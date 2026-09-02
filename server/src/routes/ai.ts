import { Router } from 'express';
import { z } from 'zod';
import { analyzeLiftVideo, chatReply } from '../services/aiOrchestrator.js';
import { query, isDbConfigured } from '../db.js';
import { optionalAuth } from '../middleware/requireAuth.js';

export const aiRouter = Router();

// POST /ai/form-check  { lift, videoUri }
// In production `videoUri` should already be a signed URL to the file in
// Cloudflare R2 (uploaded by the client directly via a pre-signed PUT URL,
// not proxied through this server) — see the blueprint's storage layer note.
const formCheckSchema = z.object({ lift: z.string().min(1), videoUri: z.string().min(1) });

aiRouter.post('/form-check', optionalAuth, async (req, res) => {
  const parsed = formCheckSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
  const { lift, videoUri } = parsed.data;

  try {
    const analysis = await analyzeLiftVideo({ lift, videoUrl: videoUri });
    const result = {
      id: `fc_${Date.now()}`,
      lift,
      createdAt: new Date().toISOString(),
      aiProvider: 'gemini-2.5-flash',
      status: 'complete' as const,
      ...analysis,
    };

    if (req.userId && isDbConfigured()) {
      await query(
        `insert into form_checks (client_id, lift, video_url, ai_provider, overall_note, faults)
         values ($1, $2, $3, $4, $5, $6)`,
        [req.userId, lift, videoUri, result.aiProvider, result.overallNote, JSON.stringify(result.faults)]
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /ai/chat  { history, message, complex? }
const chatSchema = z.object({
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string() })).default([]),
  message: z.string().min(1),
  complex: z.boolean().optional(),
});

aiRouter.post('/chat', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });

  try {
    const reply = await chatReply(parsed.data);
    res.json({ id: `msg_${Date.now()}`, role: 'assistant', text: reply.text, provider: reply.provider });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
