import { Router } from 'express';
import { isDbConfigured } from '../db.js';

export const configRouter = Router();

// A single place to check what's live vs. still mocked — the app's Profile/
// Settings screen and the website's admin footer can both hit this instead
// of guessing. Never returns the actual key values, only whether they exist.
configRouter.get('/status', (_req, res) => {
  res.json({
    database: isDbConfigured(),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    razorpayWebhook: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    auth: Boolean(process.env.JWT_SECRET),
  });
});
