# AuraFit — Platform Blueprint (Sept 2026)

## What this is
A trainer–client platform for bodybuilding/powerlifting/weightlifting, positioned against
Fittr, HealthifyMe, Fitelo, Trainerize/TrueCoach and Cult.fit. Brand name: **AuraFit**
(pre-launch content should visibly link it to the existing @fitnotooriousashu /
thenotoriousashu / Fittravelerashu audience until the new name has its own recognition).

## Competitive gaps identified (the wedge)
- No competitor offers AI video form-check (all "AI" claims are macro math or chat, not movement analysis).
- No competitor treats bodybuilding/powerlifting/weightlifting as a real periodized discipline — all are generalist weight-loss/wellness.
- Fittr: coach quality varies wildly by assignment. HealthifyMe: upsell-heavy funnel. Fitelo: pricing hidden behind a sales call (biggest complaint source). Trainerize/TrueCoach: B2B tool for trainers only, no consumer marketplace, not India-priced.

## Business model — 9 revenue streams
Digital products (ebooks) · App subscription (Free/Plus ₹499/Pro ₹999 per month) · 1:1 coaching
(Foundation ₹3,000/mo, Specialist ₹6,000/mo, Elite Contest-Prep ₹35,000/12-wk cycle) · Single
consultations ₹699 · AI form-check pay-as-you-go ₹99/video · Trainer marketplace commission
(25% platform / 75% trainer, Phase 2) · Affiliate/brand partnerships (10-20% typical) ·
Contest/challenge entry fees · Corporate wellness B2B (Phase 3).

## Ebook pricing (flagship = user's original spec)
12-Week Programming Template ₹999 · Powerlifting Peaking Guide ₹799 · Indian Macro & Diet Guide
₹599 · Bundle ₹1,799.

## Tech stack
Client: React Native + Expo (Android/iOS/web from one codebase). Backend: Node/Express,
PostgreSQL (Supabase recommended), Cloudflare R2 for video storage, Redis/BullMQ for async AI
jobs, Razorpay for payments. AI: Gemini 2.5 Flash for multimodal video form-check, Gemini
Flash-Lite/GPT-4o mini for chat, GPT-5-tier/Gemini Pro reserved for complex programming —
provider-agnostic orchestration layer so routing can change without touching the app.

## Go-to-market
Pre-launch (Wk1-4): sell the ebook + fill 5 Foundation coaching slots (₹15,000/mo, exactly per
Ashish's original spec) directly to the existing IG/FB/YouTube audience via landing page +
Razorpay payment link — no app needed yet. Beta (Wk5-8): waitlist gets MVP access, referral loop.
Public launch (Wk9-12): subscriptions + affiliate activation + launch challenge.

## 90-day financial projection
Month 1 ~₹0.95L, Month 2 ~₹1.59L, Month 3 ~₹3.56L → ~₹6.1L cumulative, crossing the ₹5L target
partway through Month 3. Biggest swing factors: ebook sale velocity and Specialist/Elite coaching
fill rate.

## Compliance flags to close before public launch
Razorpay business KYC, DPDP Act 2023/2025-Rules consent flow, signed medical/fitness disclaimer +
health screening at signup, published refund policy (direct fix for Fitelo's top complaint
pattern), Play Store Data Safety form.

## Delivered so far
Business blueprint, an Expo (React Native) app, a Node/Express server (auth, database, AI,
payments), and a Next.js marketing website — all under the AuraFit name, pushed to
github.com/solvarex-ventures/AuraFit.

## Open decisions for Ashish
1. Whether to start Razorpay KYC now (recommended immediately — it's the longest lead-time item).
2. Which 5 audience members to approach first for the ₹3,000/mo Foundation coaching slots.
