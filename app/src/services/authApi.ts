import { apiBaseUrl } from '@/services/api';
import { Role, User } from '@/types';

interface RawUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  discipline: string | null;
  health_screening_completed_at: string | null;
}

interface AuthResponse {
  user: RawUser;
  token: string;
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export async function signUp(params: { name: string; email: string; password: string; role: Role }) {
  const { user, token } = await post<AuthResponse>('/auth/signup', params);
  return { user: toUser(user), token };
}

export async function logIn(params: { email: string; password: string }) {
  const { user, token } = await post<AuthResponse>('/auth/login', params);
  return { user: toUser(user), token };
}

export async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${apiBaseUrl()}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Session expired');
  return toUser(data.user);
}

export async function submitHealthScreening(
  token: string,
  answers: Record<string, boolean | string | undefined>
) {
  await post('/auth/health-screening', answers, token);
}

function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    discipline: (raw.discipline as User['discipline']) ?? undefined,
    healthScreeningCompletedAt: raw.health_screening_completed_at,
  };
}
