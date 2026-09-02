// Every service in the app decides "mock vs. real" the same way: is
// EXPO_PUBLIC_API_BASE_URL actually set? Not set → the app runs fully
// mocked, no server needed. Set → every request is real and errors surface
// to the screen instead of being silently swallowed, so a misconfigured
// server never quietly pretends to work.
export function isServerConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_API_BASE_URL);
}

export function apiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
}

export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
