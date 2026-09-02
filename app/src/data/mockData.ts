import { Ebook, CoachingTier, Trainer } from '@/types';

// Content and pricing here mirror the fee structure in the business
// blueprint exactly — this file is the single source of truth to update
// if pricing changes, both for the UI and for the (mock) payment service.

export const EBOOKS: Ebook[] = [
  {
    id: 'ebook-12wk',
    title: '12-Week Programming Template',
    priceInr: 999,
    blurb:
      'The flagship template: a periodized 12-week mesocycle plan with %1RM/RPE loading tables and an exercise substitution guide.',
    pages: 46,
    format: 'PDF',
  },
  {
    id: 'ebook-peaking',
    title: 'Powerlifting Peaking Guide',
    priceInr: 799,
    blurb: 'A 6-10 week meet-prep peaking block with an attempt-selection calculator.',
    pages: 28,
    format: 'PDF',
  },
  {
    id: 'ebook-macros',
    title: 'Indian Macro & Diet Guide',
    priceInr: 599,
    blurb: 'Bulking, cutting and recomp macro templates built on Indian vegetarian and non-vegetarian staples.',
    pages: 34,
    format: 'PDF',
  },
];

export const EBOOK_BUNDLE_PRICE_INR = 1799;

export const COACHING_TIERS: CoachingTier[] = [
  {
    id: 'tier-foundation',
    name: 'Foundation',
    priceInr: 3000,
    billing: 'per month',
    discipline: 'general',
    description: 'Remote form coaching and macro planning for general strength and hypertrophy.',
    features: ['Weekly check-in + video form review', 'Monthly program & macro update', 'Async chat support'],
  },
  {
    id: 'tier-specialist',
    name: 'Specialist',
    priceInr: 6000,
    billing: 'per month',
    discipline: 'powerlifting',
    description: 'Powerlifting or bodybuilding-specific coaching with technique-heavy review.',
    features: ['Bi-weekly video calls', 'Full mesocycle programming', 'Priority AI form-check review by your coach'],
  },
  {
    id: 'tier-elite',
    name: 'Elite — Contest Prep',
    priceInr: 35000,
    billing: 'per 12-week cycle',
    discipline: 'bodybuilding',
    description: 'Meet or show peaking cycle — the highest-touch tier.',
    features: ['Weekly video calls', 'Peak-week / attempt-selection protocol', 'Direct chat access'],
  },
];

export const TRAINERS: Trainer[] = [
  { id: 'trainer-ashu', name: 'Ashu (Founder Coach)', discipline: 'general', rating: 5.0, clients: 5, verified: true },
];

export const EXERCISE_FAULT_LIBRARY: Record<string, string[]> = {
  Squat: ['Knee valgus on ascent', 'Forward torso lean', 'Depth cutoff above parallel', 'Heel rise'],
  Deadlift: ['Hip-shoot at lockoff', 'Rounded lumbar spine', 'Bar drifting from shins', 'Late lat engagement'],
  'Bench Press': ['Bar path drifting toward face', 'Elbow flare beyond 75°', 'Uneven bar path left/right', 'Butt lifting off bench'],
  'Overhead Press': ['Excessive lower back arch', 'Bar path forward of ears', 'Incomplete lockout'],
};
