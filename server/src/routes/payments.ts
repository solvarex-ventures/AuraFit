import { Router } from 'express';
import { z } from 'zod';
import { createOrder, verifyWebhookSignature } from '../services/razorpay.js';
import { query, isDbConfigured } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/requireAuth.js';

export const paymentsRouter = Router();

// POST /payments/orders  { itemId, itemLabel, amountInr, kind, guestEmail? }
// Called by both the app (logged in — Authorization header present) and the
// marketing website (guest checkout — guestEmail instead). Creates a real
// Razorpay order, then — if a database is configured — a matching 'pending'
// row so the webhook below has something to mark paid.
const orderSchema = z.object({
  itemId: z.string().min(1),
  itemLabel: z.string().optional(),
  amountInr: z.number().int().positive(),
  kind: z.enum(['ebook', 'bundle', 'subscription', 'coaching', 'consultation']),
  guestEmail: z.string().email().optional(),
  billing: z.enum(['per month', 'per 12-week cycle']).optional(),
});

paymentsRouter.post('/orders', optionalAuth, async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
  const { itemId, amountInr, kind, guestEmail, billing } = parsed.data;

  if (!req.userId && !guestEmail) {
    return res.status(400).json({ error: 'Sign in, or provide guestEmail for checkout without an account.' });
  }

  try {
    const order = await createOrder({ amountInr, receipt: `${itemId}_${Date.now()}` });

    let recordId: string | null = null;
    if (isDbConfigured()) {
      if (kind === 'ebook' || kind === 'bundle') {
        const result = await query<{ id: string }>(
          `insert into ebook_purchases (user_id, guest_email, ebook_id, amount_inr, razorpay_order_id)
           values ($1, $2, $3, $4, $5) returning id`,
          [req.userId ?? null, req.userId ? null : guestEmail, itemId, amountInr, order.id]
        );
        recordId = result.rows[0].id;
      } else if (kind === 'coaching') {
        if (!req.userId) return res.status(401).json({ error: 'Sign in required for coaching purchases.' });
        const result = await query<{ id: string }>(
          `insert into coaching_subscriptions (client_id, tier_id, amount_inr, billing)
           values ($1, $2, $3, $4) returning id`,
          [req.userId, itemId, amountInr, billing ?? 'per month']
        );
        recordId = result.rows[0].id;
      } else if (kind === 'consultation') {
        if (!req.userId) return res.status(401).json({ error: 'Sign in required to book a consultation.' });
        const result = await query<{ id: string }>(
          `insert into consultations (client_id, slot_label, amount_inr) values ($1, $2, $3) returning id`,
          [req.userId, itemId, amountInr]
        );
        recordId = result.rows[0].id;
      }
    }

    res.json({ ...order, recordId });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /payments/webhook — configure this URL + RAZORPAY_WEBHOOK_SECRET in
// the Razorpay dashboard. Verifies the signature before marking anything
// paid, so a spoofed request can never grant access for free.
paymentsRouter.post('/webhook', async (req, res) => {
  const signature = req.header('x-razorpay-signature') ?? '';
  const rawBody = JSON.stringify(req.body);

  try {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body?.event;
    const payment = req.body?.payload?.payment?.entity;
    if (event === 'payment.captured' && payment?.order_id && isDbConfigured()) {
      const orderId = payment.order_id as string;
      const paymentId = payment.id as string;

      await query(
        `update ebook_purchases set status = 'paid', razorpay_payment_id = $1
         where razorpay_order_id = $2`,
        [paymentId, orderId]
      );
      // coaching_subscriptions / consultations don't carry a razorpay_order_id
      // column in this scaffold (they're created already-active for
      // simplicity) — add one the same way as ebook_purchases if you want
      // webhook-gated activation for those too.
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /payments/me — everything the logged-in client has bought, for the
// app's Profile screen and the trainer's client-detail view.
paymentsRouter.get('/me', requireAuth, async (req, res) => {
  if (!isDbConfigured()) return res.json({ ebooks: [], coaching: [], consultations: [] });

  const [ebooks, coaching, consultations] = await Promise.all([
    query('select * from ebook_purchases where user_id = $1 order by created_at desc', [req.userId]),
    query('select * from coaching_subscriptions where client_id = $1 order by started_at desc', [req.userId]),
    query('select * from consultations where client_id = $1 order by created_at desc', [req.userId]),
  ]);

  res.json({ ebooks: ebooks.rows, coaching: coaching.rows, consultations: consultations.rows });
});
