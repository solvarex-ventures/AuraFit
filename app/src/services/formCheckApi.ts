import { apiBaseUrl, authHeaders, isServerConfigured } from '@/services/api';

export interface StoredFormCheck {
  id: string;
  client_id: string;
  client_name?: string;
  lift: string;
  video_url: string | null;
  ai_provider: string | null;
  overall_note: string | null;
  faults: { timestampSec: number; label: string; detail: string; severity: string }[];
  coach_reviewed_at: string | null;
  coach_note: string | null;
  created_at: string;
}

export async function fetchMyFormChecks(token: string | null): Promise<StoredFormCheck[]> {
  if (!isServerConfigured() || !token) return [];
  const res = await fetch(`${apiBaseUrl()}/form-checks/me`, { headers: authHeaders(token) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Could not load your history');
  return data.formChecks;
}

export async function fetchFlaggedFormChecks(token: string | null): Promise<StoredFormCheck[]> {
  if (!isServerConfigured() || !token) return [];
  const res = await fetch(`${apiBaseUrl()}/form-checks/flagged`, { headers: authHeaders(token) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Could not load flagged reviews');
  return data.formChecks;
}

export async function reviewFormCheck(token: string | null, id: string, note: string): Promise<void> {
  if (!isServerConfigured() || !token) throw new Error('No server configured — this action needs a real account.');
  const res = await fetch(`${apiBaseUrl()}/form-checks/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ note }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Could not submit review');
}
