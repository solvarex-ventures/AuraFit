// AI orchestration layer — this is the ONE place the app talks to AI.
// Screens never call Gemini/OpenAI directly; they call these functions.
//
// Whether a call is mocked or real is decided in one place (isServerConfigured,
// in ./api.ts) — not a hand-flipped flag here. No EXPO_PUBLIC_API_BASE_URL set
// → fully mocked, zero setup needed to demo the app. Set it once the /server
// package is deployed with real GEMINI_API_KEY/OPENAI_API_KEY and every call
// below becomes real automatically — see server/src/services/aiOrchestrator.ts
// for the actual Gemini/OpenAI calls and the cost-routing rules from the
// blueprint (Gemini 2.5 Flash for video form-check, cheapest model for chat,
// GPT-5/Gemini Pro reserved for complex programming questions).

import { ChatMessage, FormCheckFault, FormCheckResult } from '@/types';
import { EXERCISE_FAULT_LIBRARY } from '@/data/mockData';
import { apiBaseUrl, authHeaders, isServerConfigured } from '@/services/api';

function mockFaultsFor(lift: string): FormCheckFault[] {
  const library = EXERCISE_FAULT_LIBRARY[lift] ?? EXERCISE_FAULT_LIBRARY.Squat;
  return [
    {
      timestampSec: 2,
      label: library[0],
      detail: `At the 0:02 mark the model flags ${library[0].toLowerCase()} — worth filming from a second angle to confirm.`,
      severity: 'warning',
    },
    {
      timestampSec: 5,
      label: library[Math.min(1, library.length - 1)],
      detail: `Mid-rep, ${library[Math.min(1, library.length - 1)].toLowerCase()} is visible. This is the most common fault on this lift in the exercise library.`,
      severity: 'info',
    },
  ];
}

export async function requestFormCheck(params: {
  lift: string;
  videoUri: string;
  token?: string | null;
}): Promise<FormCheckResult> {
  if (!isServerConfigured()) {
    await delay(1200);
    return {
      id: `fc_${Date.now()}`,
      lift: params.lift,
      createdAt: new Date().toISOString(),
      aiProvider: 'gemini-2.5-flash',
      status: 'complete',
      overallNote:
        'DEMO MODE — no server configured. Set EXPO_PUBLIC_API_BASE_URL to a deployed /server instance with a GEMINI_API_KEY to get a real multimodal analysis of the uploaded video.',
      faults: mockFaultsFor(params.lift),
    };
  }

  const res = await fetch(`${apiBaseUrl()}/ai/form-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(params.token ?? null) },
    body: JSON.stringify({ lift: params.lift, videoUri: params.videoUri }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Form-check request failed (${res.status})`);
  return data;
}

export async function sendChatMessage(params: {
  history: ChatMessage[];
  message: string;
  token?: string | null;
}): Promise<ChatMessage> {
  if (!isServerConfigured()) {
    await delay(700);
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      provider: 'gemini',
      text: mockAssistantReply(params.message),
    };
  }

  const res = await fetch(`${apiBaseUrl()}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(params.token ?? null) },
    body: JSON.stringify({ history: params.history, message: params.message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Chat request failed (${res.status})`);
  return data;
}

function mockAssistantReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('protein') || lower.includes('macro')) {
    return 'DEMO MODE — In production this routes to Gemini 2.5 Flash-Lite / GPT-4o mini for fast macro Q&A, grounded in your active diet plan. Roughly: 1.6–2.2g protein per kg bodyweight is a solid starting target for a lean bulk.';
  }
  if (lower.includes('deload')) {
    return "DEMO MODE — Deloads are scheduled every 4th mesocycle week in your program by default: cut volume ~40% and intensity ~10-20%, keep movement patterns the same.";
  }
  return `DEMO MODE reply for "${message}". Set EXPO_PUBLIC_API_BASE_URL to a deployed /server with a real Gemini/OpenAI key to replace this.`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
