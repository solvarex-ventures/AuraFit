import { Router } from 'express';
import { z } from 'zod';
import { query, isDbConfigured, DbNotConfiguredError } from '../db.js';

export const leadsRouter = Router();

// Used by the marketing website's waitlist + ebook-interest forms — this is
// the pre-launch funnel described in the blueprint's go-to-market section.
const leadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
  interest: z.string().optional(),
});

leadsRouter.post('/', async (req, res) => {
  if (!isDbConfigured()) return res.status(503).json({ error: new DbNotConfiguredError().message });

  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });

  try {
    await query(
      `insert into leads (name, email, phone, source, interest) values ($1, $2, $3, $4, $5)`,
      [parsed.data.name ?? null, parsed.data.email, parsed.data.phone ?? null, parsed.data.source ?? null, parsed.data.interest ?? null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
