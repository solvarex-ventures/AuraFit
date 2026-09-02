import { Router } from 'express';
import { query, isDbConfigured } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const formChecksRouter = Router();

// GET /form-checks/me — a client's own history, powers the app's Progress screen.
formChecksRouter.get('/me', requireAuth, async (req, res) => {
  if (!isDbConfigured()) return res.json({ formChecks: [] });
  const result = await query(
    'select * from form_checks where client_id = $1 order by created_at desc limit 100',
    [req.userId]
  );
  res.json({ formChecks: result.rows });
});

// GET /form-checks/flagged — everything not yet reviewed by a coach, powers
// the trainer dashboard's "flagged for your review" list.
formChecksRouter.get('/flagged', requireAuth, async (req, res) => {
  if (req.userRole !== 'trainer') return res.status(403).json({ error: 'Trainer role required' });
  if (!isDbConfigured()) return res.json({ formChecks: [] });

  const result = await query(
    `select fc.*, u.name as client_name
     from form_checks fc join users u on u.id = fc.client_id
     where fc.coach_reviewed_at is null
     order by fc.created_at asc limit 50`
  );
  res.json({ formChecks: result.rows });
});

// POST /form-checks/:id/review  { note }
formChecksRouter.post('/:id/review', requireAuth, async (req, res) => {
  if (req.userRole !== 'trainer') return res.status(403).json({ error: 'Trainer role required' });
  if (!isDbConfigured()) return res.status(503).json({ error: 'Database not configured' });

  const note = typeof req.body?.note === 'string' ? req.body.note : null;
  await query(
    `update form_checks set coach_reviewed_at = now(), coach_id = $1, coach_note = $2 where id = $3`,
    [req.userId, note, req.params.id]
  );
  res.json({ ok: true });
});
