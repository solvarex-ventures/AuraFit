'use client';

import React, { useState } from 'react';
import { submitLead } from '@/lib/api';

export default function WaitlistForm({ source }: { source: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('bodybuilding');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      await submitLead({ name, email, interest, source });
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="card" style={{ borderColor: 'var(--good)' }}>
        <p style={{ margin: 0 }}>
          You're on the list — you'll hear from us the moment beta invites go out. In the meantime, check the ebooks page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
        <input
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['bodybuilding', 'powerlifting', 'weightlifting'] as const).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInterest(i)}
            className="btn"
            style={{
              background: interest === i ? 'var(--accent)' : 'transparent',
              color: interest === i ? 'var(--accent-ink)' : 'var(--ink-muted)',
              borderColor: 'var(--line)',
              textTransform: 'capitalize',
            }}
          >
            {i}
          </button>
        ))}
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: 13, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
      </button>
    </form>
  );
}
