import { Router } from 'express';
import { z } from 'zod';
import { isDbConfigured, DbNotConfiguredError } from '../db.js';
import { createUser, verifyLogin, signToken, getUserById } from '../services/auth.js';
import { query } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'trainer']),
});

authRouter.post('/signup', async (req, res) => {
  if (!isDbConfigured()) return res.status(503).json({ error: new DbNotConfiguredError().message });

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });

  try {
    const user = await createUser(parsed.data);
    res.status(201).json({ user, token: signToken(user) });
  } catch (err) {
    res.status(409).json({ error: (err as Error).message });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post('/login', async (req, res) => {
  if (!isDbConfigured()) return res.status(503).json({ error: new DbNotConfiguredError().message });

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });

  try {
    const user = await verifyLogin(parsed.data.email, parsed.data.password);
    res.json({ user, token: signToken(user) });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await getUserById(req.userId!);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// POST /auth/health-screening — PAR-Q-style intake, required before a
// client's first program per the blueprint's liability mitigation note.
const healthSchema = z.object({
  hasHeartCondition: z.boolean(),
  hasChestPainDuringActivity: z.boolean(),
  hasChestPainAtRest: z.boolean(),
  hasBalanceOrConsciousnessIssues: z.boolean(),
  hasBoneOrJointProblem: z.boolean(),
  isOnBloodPressureOrHeartMeds: z.boolean(),
  hasOtherReasonNotToExercise: z.boolean(),
  notes: z.string().optional(),
});

authRouter.post('/health-screening', requireAuth, async (req, res) => {
  const parsed = healthSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });

  await query(
    `update users set health_screening = $1, health_screening_completed_at = now() where id = $2`,
    [JSON.stringify(parsed.data), req.userId]
  );
  res.json({ ok: true });
});
