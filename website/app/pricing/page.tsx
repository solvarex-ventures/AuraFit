import { APP_SUBSCRIPTION_TIERS, COACHING_TIERS, CONSULT_PRICE_INR } from '@/data/pricing';

export const metadata = { title: 'Pricing — AuraFit' };

export default function PricingPage() {
  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 96 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Pricing</h1>
      <p style={{ color: 'var(--ink-muted)', maxWidth: 600, marginBottom: 40 }}>
        Every figure here is what you'll actually be charged — no "book a call to find out."
      </p>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>1:1 Coaching</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {COACHING_TIERS.map((tier) => (
          <div key={tier.id} className="card">
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>{tier.name}</h3>
            <p className="mono" style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
              ₹{tier.priceInr.toLocaleString('en-IN')}
            </p>
            <p style={{ color: 'var(--ink-muted)', fontSize: 12, marginBottom: 12 }}>{tier.billing}</p>
            <p style={{ color: 'var(--ink-muted)', fontSize: 13.5, marginBottom: 12 }}>{tier.description}</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ink-muted)' }}>
              {tier.features.map((f) => (
                <li key={f} style={{ marginBottom: 4 }}>{f}</li>
              ))}
            </ul>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi! I'd like to start ${tier.name} coaching (₹${tier.priceInr}/${tier.billing}) on AuraFit.`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ marginTop: 16, width: '100%' }}
            >
              Message to start
            </a>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>App subscription</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
        {APP_SUBSCRIPTION_TIERS.map((tier) => (
          <div key={tier.name} className="card">
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>{tier.name}</h3>
            <p className="mono" style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              {tier.priceInr === 0 ? '₹0' : `₹${tier.priceInr}/mo`}
            </p>
            <p style={{ color: 'var(--ink-muted)', fontSize: 13, margin: 0 }}>{tier.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Single consultation</h2>
      <div className="card" style={{ maxWidth: 420 }}>
        <p className="mono" style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>₹{CONSULT_PRICE_INR}</p>
        <p style={{ color: 'var(--ink-muted)', fontSize: 13.5, margin: 0 }}>
          45-minute diet or training audit. No subscription required.
        </p>
      </div>
    </main>
  );
}
