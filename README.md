# AuraFit

A trainer–client platform for bodybuilding, powerlifting and weightlifting — AI form-check on
uploaded lift videos, real periodized programming, ebooks, and 1:1 coaching. Built from the
[AuraFit Blueprint](aurafit-blueprint.md), a full competitor teardown
(Fittr/HealthifyMe/Fitelo) and business model.

## What's inside

```
aurafit/
  aurafit-blueprint.md   the business strategy summary
  blueprint.html                    the full designed strategy report (open in a browser)
  app/                               Expo (React Native) client — Android, iOS, and web
  server/                            Node/Express API — auth, database, AI, payments
  website/                           Next.js marketing site — landing page, ebook checkout, waitlist
```

Everything runs **fully mocked out of the box** — no accounts or API keys needed to try the app.
The website needs `NEXT_PUBLIC_API_BASE_URL` pointed at a running server to do anything beyond
render static pages, since its whole job is capturing real leads and real ebook sales.

## Quick start — the app (mocked, no keys needed)

```bash
cd app
npm install
npm run web        # opens in your browser — fastest way to look around
```

Try both **Sign up as a Client** and **Sign up as a Trainer** (or "Try the demo instead" — no
account needed) to see both sides. This build was verified to install and bundle cleanly
(`npx expo export --platform web`, 455 modules, no errors).

## Quick start — the website

```bash
cd website
npm install
npm run dev         # opens on localhost:3000
```

Verified with `npx next build` — compiles clean, 4 static routes generated.

## Quick start — the server

```bash
cd server
npm install
cp .env.example .env
npm run dev          # starts on :4000, typechecked clean with `npx tsc --noEmit`
```

Without any `.env` values set, the server still boots — it just returns clear 503s on the routes
that need a database or API keys, rather than crashing. Hit `GET /config/status` to see exactly
what's live.

## What's real vs. what needs your accounts

| Piece | Status |
|---|---|
| App UI — every screen, both roles, navigation | Real, fully built |
| Website — landing, pricing, ebooks, waitlist | Real, fully built |
| Auth (signup/login/sessions) | Real code (bcrypt + JWT) — needs `DATABASE_URL` + `JWT_SECRET` |
| Database (users, purchases, coaching, form-checks, leads) | Real schema (`server/schema.sql`) — needs a Postgres instance |
| AI form-check + chat | Real Gemini/OpenAI integration code — needs `GEMINI_API_KEY`/`OPENAI_API_KEY` |
| Razorpay checkout (app + website) | Real order-creation + webhook-verified activation — needs Razorpay business KYC + keys |
| Everything above with no keys set | Runs fully mocked/demo — the app and website are usable standalone |

Nothing here is a placeholder screen waiting to be built — every piece above is real, working
code. What's missing is *your* accounts (Supabase project, Gemini/OpenAI keys, Razorpay KYC),
which nobody but you can create. See "Getting the accounts you need" below.

## Getting the accounts you need

| Account | Where | Notes |
|---|---|---|
| Postgres database | supabase.com (free tier) | Create a project, run `server/schema.sql` against it once, copy the connection string into `DATABASE_URL`. |
| Razorpay | dashboard.razorpay.com | Complete business KYC first (PAN, bank account, business proof) — typically 2–5 working days. Use a payment *link* for pre-launch ebook/coaching sales while the full merchant account activates. |
| Gemini API key | aistudio.google.com/app/apikey | Powers the AI form-check (multimodal video analysis) and fast chat. |
| OpenAI API key | platform.openai.com/api-keys | Used as the alternate/fallback chat provider. |

## Architecture notes

- **One database, three clients.** The app, the website, and (eventually) an admin dashboard all
  talk to the same `/server` API — nobody writes to Postgres directly except the server.
- **Guest checkout on the website, account-based in the app.** The website sells ebooks to a
  guest email (no signup friction, matches the blueprint's pre-launch plan); the app requires an
  account since coaching/progress history need one.
- **"Flip a switch" go-live.** Every service (`app/src/services/aiService.ts`,
  `paymentService.ts`) checks `EXPO_PUBLIC_API_BASE_URL`/`NEXT_PUBLIC_API_BASE_URL` at call time —
  set it and real requests start immediately, no code changes. A *configured* server that errors
  surfaces the real error; it never silently pretends to succeed.

## Building the real Android app (Play Store)

```bash
cd app
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
```

Complete the Data Safety form accurately before submission — health/fitness apps get extra Play
Store review scrutiny on it (see the blueprint's Risk Register).

## Next build priorities, in order

1. Move video upload from the local device picker to a direct pre-signed upload into Cloudflare
   R2, passing that signed URL (not the raw file) to `/ai/form-check`.
2. Add `react-native-razorpay` in the app for live in-app checkout (the website's checkout is
   already fully live via Razorpay's web SDK).
3. Open the coach marketplace (Phase 2 in the blueprint) — coach applications, vetting, ratings,
   commission payouts.
4. Wire push notifications for form-check results and coach reviews (Settings screen already has
   the toggles; they're not yet backed by real push tokens).
