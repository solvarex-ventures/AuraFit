// Mirrors app/src/data/mockData.ts exactly — this is the website's copy of
// the same fee structure from the blueprint. Kept as a separate file
// (rather than a shared package) to keep the app and website independently
// deployable; if either changes, update the other to match.

export interface Ebook {
  id: string;
  title: string;
  priceInr: number;
  blurb: string;
  pages: number;
}

export const EBOOKS: Ebook[] = [
  {
    id: 'ebook-12wk',
    title: '12-Week Programming Template',
    priceInr: 999,
    blurb: 'The flagship template: a periodized 12-week mesocycle plan with %1RM/RPE loading tables and an exercise substitution guide.',
    pages: 46,
  },
  {
    id: 'ebook-peaking',
    title: 'Powerlifting Peaking Guide',
    priceInr: 799,
    blurb: 'A 6-10 week meet-prep peaking block with an attempt-selection calculator.',
    pages: 28,
  },
  {
    id: 'ebook-macros',
    title: 'Indian Macro & Diet Guide',
    priceInr: 599,
    blurb: 'Bulking, cutting and recomp macro templates built on Indian vegetarian and non-vegetarian staples.',
    pages: 34,
  },
];

export const EBOOK_BUNDLE_PRICE_INR = 1799;

export interface CoachingTier {
  id: string;
  name: string;
  priceInr: number;
  billing: 'per month' | 'per 12-week cycle';
  description: string;
  features: string[];
}

export const COACHING_TIERS: CoachingTier[] = [
  {
    id: 'tier-foundation',
    name: 'Foundation',
    priceInr: 3000,
    billing: 'per month',
    description: 'Remote form coaching and macro planning for general strength and hypertrophy.',
    features: ['Weekly check-in + video form review', 'Monthly program & macro update', 'Async chat support'],
  },
  {
    id: 'tier-specialist',
    name: 'Specialist',
    priceInr: 6000,
    billing: 'per month',
    description: 'Powerlifting or bodybuilding-specific coaching with technique-heavy review.',
    features: ['Bi-weekly video calls', 'Full mesocycle programming', 'Priority AI form-check review by your coach'],
  },
  {
    id: 'tier-elite',
    name: 'Elite — Contest Prep',
    priceInr: 35000,
    billing: 'per 12-week cycle',
    description: 'Meet or show peaking cycle — the highest-touch tier.',
    features: ['Weekly video calls', 'Peak-week / attempt-selection protocol', 'Direct chat access'],
  },
];

export const APP_SUBSCRIPTION_TIERS = [
  { name: 'Free', priceInr: 0, desc: 'Community feed, exercise video library (view-only), basic macro tracker.' },
  { name: 'Plus', priceInr: 499, desc: 'Full template library, AI chat assistant, 3 AI form-check credits/month.' },
  { name: 'Pro', priceInr: 999, desc: 'Unlimited AI form-check, monthly group coaching call, priority community access.' },
];

export const CONSULT_PRICE_INR = 699;
