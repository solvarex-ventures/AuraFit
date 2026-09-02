import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Role, User } from '@/types';
import * as authApi from '@/services/authApi';
import { clearToken, loadToken, saveToken } from '@/services/tokenStorage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  restoringSession: boolean;
  /** true when there's no real account behind `user` — either no server is
   *  configured, or the person chose "Try the demo instead". Screens that
   *  hit the backend (purchases, form-check history) should expect those
   *  calls to be unavailable while this is true. */
  isDemo: boolean;
  authError: string | null;
  signUp: (params: { name: string; email: string; password: string; role: Role }) => Promise<void>;
  logIn: (params: { email: string; password: string }) => Promise<void>;
  continueAsDemo: (name: string, role: Role) => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  /** Optimistic local update for demo mode, where there's no server to persist to. */
  markHealthScreeningComplete: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // On launch, if a token was saved from a previous session, try to restore
  // it. If the server is unreachable or the token expired, fall through to
  // the signed-out state rather than blocking the app.
  useEffect(() => {
    (async () => {
      try {
        const saved = await loadToken();
        if (saved) {
          const restoredUser = await authApi.fetchMe(saved);
          setUser(restoredUser);
          setToken(saved);
        }
      } catch {
        await clearToken();
      } finally {
        setRestoringSession(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      restoringSession,
      isDemo,
      authError,
      async signUp(params) {
        setAuthError(null);
        try {
          const { user: newUser, token: newToken } = await authApi.signUp(params);
          await saveToken(newToken);
          setUser(newUser);
          setToken(newToken);
          setIsDemo(false);
        } catch (err) {
          setAuthError(describeAuthError(err));
          throw err;
        }
      },
      async logIn(params) {
        setAuthError(null);
        try {
          const { user: loggedInUser, token: newToken } = await authApi.logIn(params);
          await saveToken(newToken);
          setUser(loggedInUser);
          setToken(newToken);
          setIsDemo(false);
        } catch (err) {
          setAuthError(describeAuthError(err));
          throw err;
        }
      },
      continueAsDemo(name, role) {
        setAuthError(null);
        setUser({
          id: `demo_${Date.now()}`,
          name,
          role,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.local`,
        });
        setToken(null);
        setIsDemo(true);
      },
      signOut() {
        setUser(null);
        setToken(null);
        setIsDemo(false);
        clearToken();
      },
      async refreshUser() {
        if (!token) return;
        try {
          const refreshed = await authApi.fetchMe(token);
          setUser(refreshed);
        } catch {
          // Session likely expired — leave the user signed in with stale
          // data rather than booting them out mid-task; they'll be caught
          // on next app launch's restore check.
        }
      },
      markHealthScreeningComplete() {
        setUser((current) => (current ? { ...current, healthScreeningCompletedAt: new Date().toISOString() } : current));
      },
    }),
    [user, token, restoringSession, isDemo, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function describeAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('DATABASE_URL') || message.includes('Database not configured')) {
    return 'No account server is connected yet — use "Try the demo instead" below, or ask whoever set this up to configure DATABASE_URL.';
  }
  if (message.includes('Network request failed') || message.includes('fetch')) {
    return "Can't reach the server right now — use \"Try the demo instead\" below to keep exploring.";
  }
  return message;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
