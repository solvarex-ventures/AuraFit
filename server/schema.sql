-- Notorious Strength — database schema
-- Target: PostgreSQL (Supabase's free tier works out of the box — it just
-- gives you a Postgres connection string, which is all this file needs).
--
-- Setup:
--   1. Create a free project at supabase.com (or point at any Postgres 14+).
--   2. Run this file once against it (Supabase: SQL Editor -> paste -> Run,
--      or `psql "$DATABASE_URL" -f schema.sql`).
--   3. Set DATABASE_URL in server/.env to the connection string.
--
-- Every table matches a type already in the app (see app/src/types.ts) and
-- a price already in the blueprint's fee structure — this is the single
-- source of truth for what actually gets stored once the server has a DB.

create extension if not exists "pgcrypto";

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null check (role in ('client', 'trainer')),
  discipline    text check (discipline in ('bodybuilding', 'powerlifting', 'weightlifting', 'general')),
  -- health screening (PAR-Q style), collected at onboarding before any
  -- program is issued — see the blueprint's liability mitigation note
  health_screening jsonb,
  health_screening_completed_at timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists ebook_purchases (
  id           uuid primary key default gen_random_uuid(),
  -- nullable so the marketing website can sell ebooks to a guest email
  -- before the app even exists (see the blueprint's pre-launch plan) —
  -- exactly one of user_id / guest_email is set.
  user_id      uuid references users(id) on delete cascade,
  guest_email  text,
  ebook_id     text not null,        -- matches EBOOKS[].id in app/src/data/mockData.ts
  amount_inr   integer not null,
  razorpay_order_id   text,
  razorpay_payment_id text,
  status       text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at   timestamptz not null default now(),
  constraint ebook_purchases_owner check (user_id is not null or guest_email is not null)
);

create table if not exists coaching_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references users(id) on delete cascade,
  trainer_id    uuid references users(id) on delete set null,
  tier_id       text not null,       -- matches COACHING_TIERS[].id
  amount_inr    integer not null,
  billing       text not null check (billing in ('per month', 'per 12-week cycle')),
  status        text not null default 'active' check (status in ('active', 'paused', 'cancelled', 'completed')),
  started_at    timestamptz not null default now(),
  next_billing_at timestamptz
);

create table if not exists consultations (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references users(id) on delete cascade,
  slot_label   text not null,
  amount_inr   integer not null default 699,
  status       text not null default 'booked' check (status in ('booked', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create table if not exists form_checks (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references users(id) on delete cascade,
  lift          text not null,
  video_url     text,
  ai_provider   text,
  overall_note  text,
  faults        jsonb not null default '[]',
  coach_reviewed_at timestamptz,
  coach_id      uuid references users(id) on delete set null,
  coach_note    text,
  created_at    timestamptz not null default now()
);

-- Pre-launch waitlist / lead capture — this is what the marketing website's
-- signup form and ebook-interest form write to.
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text not null,
  phone      text,
  source     text,           -- e.g. 'waitlist', 'ebook-landing', 'instagram-bio'
  interest   text,           -- e.g. 'bodybuilding', 'powerlifting', 'weightlifting'
  created_at timestamptz not null default now()
);

create index if not exists idx_ebook_purchases_user on ebook_purchases(user_id);
create index if not exists idx_coaching_subs_client on coaching_subscriptions(client_id);
create index if not exists idx_form_checks_client on form_checks(client_id);
create index if not exists idx_leads_email on leads(email);
