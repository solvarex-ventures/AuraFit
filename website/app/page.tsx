import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import { EBOOKS } from '@/data/pricing';

export default function HomePage() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 64, paddingBottom: 56 }}>
        <p style={{ fontFamily: 'Oswald', color: 'var(--accent)', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 10 }}>
          BODYBUILDING · POWERLIFTING · WEIGHTLIFTING
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.05, maxWidth: 780 }}>
          Train like it&rsquo;s personal.
        </h1>
        <p style={{ fontSize: 19, color: 'var(--ink-muted)', maxWidth: 620, marginTop: 20 }}>
          Real periodized programming, coaches whose prices you can actually see, and AI that watches your
          actual lift on camera — not just your macros. Nobody else in this category does the last part.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link href="/ebooks" className="btn btn-primary">Get the 12-Week Template — ₹999</Link>
          <Link href="/pricing" className="btn btn-secondary">See coaching plans</Link>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>What everyone else gets wrong</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <GapCard title="Coach quality is a lottery" body="Get assigned a coach and hope for the best. We vet every coach and publish ratings." />
          <GapCard title="Pricing hidden behind a call" body="Every price on this site is public. No 'book a call to find out.'" />
          <GapCard title="Generic weight-loss programming" body="Real mesocycles, %1RM loading, RPE autoregulation — built for strength sport, not just calorie counting." />
          <GapCard title="'AI' that's just macro math" body="Upload a set on camera. Our AI flags bar path, depth and joint-angle faults with timestamps." />
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Start here</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {EBOOKS.map((b) => (
            <div key={b.id} className="card">
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 12 }}>{b.blurb}</p>
              <p className="mono" style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>₹{b.priceInr.toLocaleString('en-IN')}</p>
              <Link href="/ebooks" className="btn btn-secondary" style={{ width: '100%' }}>View & buy</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container" id="waitlist" style={{ paddingBottom: 96 }}>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>Join the waitlist</h2>
        <p style={{ color: 'var(--ink-muted)', maxWidth: 560, marginBottom: 20 }}>
          The app is in private beta. Waitlist members get first access and founding-member pricing on Pro.
        </p>
        <div style={{ maxWidth: 480 }}>
          <WaitlistForm source="landing-page" />
        </div>
      </section>
    </main>
  );
}

function GapCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--ink-muted)', fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
