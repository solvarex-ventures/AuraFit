export function apiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? null;
}

export function isApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);
}

export interface LeadPayload {
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  interest?: string;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!isApiConfigured()) {
    throw new Error('Waitlist isn’t connected yet — set NEXT_PUBLIC_API_BASE_URL to your deployed server.');
  }
  const res = await fetch(`${apiBaseUrl()}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Could not join the waitlist — try again in a moment.');
  }
}

export interface CreateOrderPayload {
  itemId: string;
  itemLabel: string;
  amountInr: number;
  kind: 'ebook' | 'bundle';
  guestEmail: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ id: string; amount: number; currency: string }> {
  if (!isApiConfigured()) {
    throw new Error('Checkout isn’t connected yet — set NEXT_PUBLIC_API_BASE_URL to your deployed server.');
  }
  const res = await fetch(`${apiBaseUrl()}/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Could not start checkout.');
  return data;
}
