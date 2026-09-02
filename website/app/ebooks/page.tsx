import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';
import { EBOOKS, EBOOK_BUNDLE_PRICE_INR } from '@/data/pricing';

export const metadata = { title: 'Ebooks — AuraFit' };

export default function EbooksPage() {
  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 96 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ebooks</h1>
      <p style={{ color: 'var(--ink-muted)', maxWidth: 600, marginBottom: 36 }}>
        One-time purchase, instant PDF delivery to the email you check out with.
      </p>

      <div className="card" style={{ borderColor: 'var(--gold)', marginBottom: 24 }}>
        <p style={{ fontFamily: 'Oswald', fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
          BEST VALUE
        </p>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Complete Bundle</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 16 }}>All three guides below, delivered together.</p>
        <div style={{ maxWidth: 320 }}>
          <RazorpayCheckoutButton itemId="bundle" itemLabel="Complete Bundle" amountInr={EBOOK_BUNDLE_PRICE_INR} kind="bundle" />
        </div>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {EBOOKS.map((book) => (
          <div key={book.id} className="card">
            <h2 style={{ fontSize: 17, marginBottom: 6 }}>{book.title}</h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 6 }}>{book.blurb}</p>
            <p style={{ color: 'var(--ink-muted)', fontSize: 12, marginBottom: 16 }}>{book.pages} pages · PDF</p>
            <div style={{ maxWidth: 320 }}>
              <RazorpayCheckoutButton itemId={book.id} itemLabel={book.title} amountInr={book.priceInr} kind="ebook" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
