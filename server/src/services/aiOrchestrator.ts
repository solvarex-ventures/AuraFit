// This is the real AI integration referenced by app/src/services/aiService.ts.
// It routes each task to whichever model the blueprint calls for and keeps
// both Gemini and OpenAI behind one interface so the rest of the app never
// has to know which provider answered.
//
// Routing (see the blueprint's "AI & the form-check pipeline" section):
//   - Video form-check (multimodal)      -> Gemini 2.5 Flash
//   - Quick chat / macro Q&A             -> Gemini 2.5 Flash-Lite (fallback: GPT-4o mini)
//   - Complex programming / contest-prep -> GPT-5-tier or Gemini 2.5 Pro (only when explicitly requested)

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface FormCheckFault {
  timestampSec: number;
  label: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

const FORM_CHECK_SYSTEM_PROMPT = `You are a strength-sport form-check assistant for a bodybuilding/powerlifting/weightlifting
coaching platform. Given a lift name and a video, identify technical faults with an approximate
timestamp (seconds), a short label, a one-sentence explanation, and a severity of info/warning/critical.
Respond ONLY as JSON: { "overallNote": string, "faults": FormCheckFault[] }.
Be specific and reference the lift's known common-fault checklist where relevant (e.g. squat: knee
valgus, forward lean, depth cutoff, heel rise; deadlift: hip-shoot, rounded lumbar, bar drift).`;

export async function analyzeLiftVideo(params: {
  lift: string;
  videoUrl: string; // signed URL to the uploaded video in object storage
}): Promise<{ overallNote: string; faults: FormCheckFault[] }> {
  if (!gemini) {
    throw new Error('GEMINI_API_KEY not set — add it to server/.env to enable real form-check analysis.');
  }

  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent([
    FORM_CHECK_SYSTEM_PROMPT,
    `Lift: ${params.lift}`,
    { fileData: { fileUri: params.videoUrl, mimeType: 'video/mp4' } },
  ]);

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    // Model didn't return clean JSON — surface the raw text rather than crash.
    return { overallNote: text, faults: [] };
  }
}

export async function chatReply(params: {
  history: { role: 'user' | 'assistant'; text: string }[];
  message: string;
  complex?: boolean;
}): Promise<{ text: string; provider: 'gemini' | 'chatgpt' }> {
  // Cheap/fast path first; only escalate to a stronger model when the
  // caller explicitly marks the question as complex (e.g. full contest-prep
  // programming), matching the cost-routing strategy in the blueprint.
  if (!params.complex && gemini) {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const chat = model.startChat({
      history: params.history.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
    });
    const result = await chat.sendMessage(params.message);
    return { text: result.response.text(), provider: 'gemini' };
  }

  if (openai) {
    const completion = await openai.chat.completions.create({
      model: params.complex ? 'gpt-5' : 'gpt-4o-mini',
      messages: [
        ...params.history.map((h) => ({ role: h.role, content: h.text }) as const),
        { role: 'user', content: params.message },
      ],
    });
    return { text: completion.choices[0]?.message?.content ?? '', provider: 'chatgpt' };
  }

  throw new Error('No AI provider configured — set GEMINI_API_KEY and/or OPENAI_API_KEY in server/.env.');
}
