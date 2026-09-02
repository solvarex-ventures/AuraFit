import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Notorious Strength — Bodybuilding, Powerlifting & Weightlifting Coaching',
  description:
    'AI form-check on every lift you upload, real periodized programming, and coaches you can actually see the price of. Ebooks, 1:1 coaching, and consultations for bodybuilding, powerlifting and weightlifting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header style={{ borderBottom: '1px solid var(--line)', padding: '20px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 18, color: 'var(--ink)', textDecoration: 'none', letterSpacing: '0.02em' }}>
          NOTORIOUS STRENGTH
        </Link>
        <nav style={{ display: 'flex', gap: 24, fontFamily: 'Oswald', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          <Link href="/ebooks" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Ebooks</Link>
          <Link href="/pricing" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Coaching</Link>
          <Link href="/#waitlist" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Waitlist</Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 96, padding: '32px 0', color: 'var(--ink-muted)', fontSize: 13 }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
        <span>© {new Date().getFullYear()} Notorious Strength</span>
        <span>
          <a href="https://instagram.com/fitnotooriousashu" target="_blank" rel="noreferrer">Instagram</a>
          {' · '}
          <a href="https://facebook.com/thenotoriousashu" target="_blank" rel="noreferrer">Facebook</a>
          {' · '}
          <a href="https://youtube.com/@Fittravelerashu" target="_blank" rel="noreferrer">YouTube</a>
        </span>
      </div>
    </footer>
  );
}
