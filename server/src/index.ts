import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/ai.js';
import { paymentsRouter } from './routes/payments.js';
import { authRouter } from './routes/auth.js';
import { leadsRouter } from './routes/leads.js';
import { configRouter } from './routes/config.js';
import { formChecksRouter } from './routes/formChecks.js';
import { isDbConfigured } from './db.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'notorious-strength-server' }));
app.use('/auth', authRouter);
app.use('/ai', aiRouter);
app.use('/payments', paymentsRouter);
app.use('/leads', leadsRouter);
app.use('/form-checks', formChecksRouter);
app.use('/config', configRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Notorious Strength API listening on :${port}`);
  console.log(`GET /config/status shows exactly which integrations are live vs. still needing keys.`);
  if (!isDbConfigured()) {
    console.warn('DATABASE_URL not set — /auth, /leads, /form-checks history, and purchase persistence will 503 until it is. Everything else (AI, Razorpay order creation) still works.');
  }
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    console.warn('No AI keys set — /ai routes will error until GEMINI_API_KEY or OPENAI_API_KEY is set in .env');
  }
  if (!process.env.RAZORPAY_KEY_ID) {
    console.warn('No Razorpay keys set — /payments/orders will error until RAZORPAY_KEY_ID/SECRET are set in .env');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not set — /auth routes will error until it is set in .env (any long random string).');
  }
});
