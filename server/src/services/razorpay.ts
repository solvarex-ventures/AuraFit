// Real Razorpay integration. Requires completed business KYC and live keys
// (server/.env: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). See the blueprint's
// fee-structure section for the transaction-fee schedule (2% + GST on
// cards/UPI/netbanking, ~1% additional on recurring subscriptions).

import Razorpay from 'razorpay';
import crypto from 'node:crypto';

let client: Razorpay | null = null;

function getClient(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — add them to server/.env.');
  }
  if (!client) {
    client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return client;
}

export async function createOrder(params: { amountInr: number; receipt: string }) {
  const rzp = getClient();
  return rzp.orders.create({
    amount: params.amountInr * 100, // paise
    currency: 'INR',
    receipt: params.receipt,
  });
}

// Call this on the Razorpay webhook route to confirm a payload really came
// from Razorpay before trusting it (unlocks the ebook / activates coaching).
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET not set.');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}
