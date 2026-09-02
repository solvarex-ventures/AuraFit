'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { createOrder } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Props {
  itemId: string;
  itemLabel: string;
  amountInr: number;
  kind: 'ebook' | 'bundle';
}

// Real Razorpay Standard Checkout — this is the actual integration, not a
// mock. It needs NEXT_PUBLIC_RAZORPAY_KEY_ID (client-safe publishable key)
// and a reachable /server with RAZORPAY_KEY_ID/SECRET set to create the
// order. Until both are configured it explains exactly what's missing
// instead of silently failing.
export default function RazorpayCheckoutButton({ itemId, itemLabel, amountInr, kind }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  async function checkout() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email so we can send the PDF.');
      return;
    }
    if (!razorpayKeyId) {
      setError('Checkout isn’t live yet — NEXT_PUBLIC_RAZORPAY_KEY_ID isn’t set.');
      return;
    }
    setLoading(true);
    try {
      const order = await createOrder({ itemId, itemLabel, amountInr, kind, guestEmail: email.trim() });
      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Notorious Strength',
        description: itemLabel,
        order_id: order.id,
        prefill: { email },
        theme: { color: '#b3452a' },
        handler: function () {
          window.location.href = `/ebooks?purchased=${encodeURIComponent(itemId)}`;
        },
      });
      razorpay.open();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptReady(true)} strategy="lazyOnload" />
      <input placeholder="Email for delivery" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p style={{ color: '#c0392b', fontSize: 12.5, margin: 0 }}>{error}</p>}
      <button className="btn btn-primary" onClick={checkout} disabled={loading}>
        {loading ? 'Starting checkout…' : `Buy for ₹${amountInr.toLocaleString('en-IN')}`}
      </button>
      {!scriptReady && <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>Loading secure checkout…</p>}
    </div>
  );
}
