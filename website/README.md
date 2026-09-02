# Notorious Strength — marketing website

The public-facing site: landing page, ebook checkout (real Razorpay integration), pricing, and
waitlist capture. This is what your Instagram/YouTube/Facebook links should point to during the
pre-launch phase described in the blueprint — it works standalone, without the app.

## Quick start

```bash
npm install
npm run dev
```

Opens on http://localhost:3000. Without any env vars set, the waitlist form and ebook checkout
buttons show a clear "not connected yet" message instead of failing silently — the site is fully
browsable either way.

## Going live

1. Deploy `../server` somewhere (Railway/Render both work).
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_API_BASE_URL` — your deployed server's URL
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Razorpay's publishable key (safe to expose client-side; the
     secret key stays server-only)
3. Deploy to Vercel: `npx vercel` (or connect the repo in the Vercel dashboard) — Next.js App
   Router deploys there with zero config.

## Pages

- `/` — hero, the four competitive gaps from the blueprint, ebook teasers, waitlist form
- `/ebooks` — real Razorpay Standard Checkout for each ebook + the bundle
- `/pricing` — coaching tiers, app subscription tiers, single consultation — all publicly priced

## Keeping pricing in sync

`data/pricing.ts` mirrors `../app/src/data/mockData.ts`. If you change a price in one, change it
in the other — they're intentionally separate files so the app and website can deploy
independently, but they should always show the same numbers.
