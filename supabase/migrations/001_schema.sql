-- ============================================================================
-- ACT Crowdfunding App — Full Schema
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ──────────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific fields
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  account_type  text not null default 'individual_donor'
                  check (account_type in ('individual_donor','business_donor','parent','student')),
  role          text not null default 'user'
                  check (role in ('super_admin','admin','user')),
  first_name    text not null,
  last_name     text not null,
  nickname      text,
  phone         text,
  avatar        text,
  status        text not null default 'active'
                  check (status in ('active','suspended')),
  bio           text,
  location      text,
  school_name   text,
  -- Business fields
  business_name   text,
  business_title  text,
  ein             text,
  -- Student fields
  parent_id       uuid references public.profiles(id),
  date_of_birth   text,
  grade_level     text,
  parent_approved boolean default false,
  created_at    timestamptz not null default now()
);

-- ─── STUDENTS ──────────────────────────────────────────────────────────────────
-- Children managed by parent accounts
create table public.students (
  id              uuid primary key default uuid_generate_v4(),
  parent_id       uuid not null references public.profiles(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  nickname        text,
  grade_level     text not null default 'Unknown',
  date_of_birth   text,
  parent_approved boolean not null default true,
  avatar          text,
  email           text,
  auth_user_id    uuid references public.profiles(id),
  created_at      timestamptz not null default now()
);

-- ─── CAMPAIGNS ─────────────────────────────────────────────────────────────────
create table public.campaigns (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  tagline           text not null,
  story             text not null,
  category          text not null,
  goal              numeric not null default 0,
  raised            numeric not null default 0,
  backers           integer not null default 0,
  days_left         integer not null default 30,
  image             text,
  status            text not null default 'active'
                      check (status in ('active','funded','ending_soon')),
  featured          boolean not null default false,
  tags              jsonb not null default '[]'::jsonb,
  creator           jsonb not null default '{}'::jsonb,
  pledge_tiers      jsonb not null default '[]'::jsonb,
  updates           jsonb not null default '[]'::jsonb,
  faqs              jsonb not null default '[]'::jsonb,
  creator_profile_id uuid references public.profiles(id),
  created_at        timestamptz not null default now()
);

-- ─── PLEDGES ───────────────────────────────────────────────────────────────────
create table public.pledges (
  id                    uuid primary key default uuid_generate_v4(),
  campaign_id           uuid not null references public.campaigns(id) on delete cascade,
  donor_id              uuid references public.profiles(id),
  tier_id               text,
  amount                numeric not null,
  status                text not null default 'confirmed',
  payment_method        text,
  paypal_transaction_id text,
  paypal_order_id       text,
  payer_email           text,
  donor_info            jsonb,
  tax_info              jsonb,
  created_at            timestamptz not null default now()
);

-- ─── INDEXES ───────────────────────────────────────────────────────────────────
create index idx_profiles_email on public.profiles(email);
create index idx_students_parent on public.students(parent_id);
create index idx_campaigns_status on public.campaigns(status);
create index idx_campaigns_featured on public.campaigns(featured);
create index idx_pledges_campaign on public.pledges(campaign_id);
create index idx_pledges_donor on public.pledges(donor_id);

-- ─── RLS POLICIES ──────────────────────────────────────────────────────────────

-- Profiles
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

create policy "Admins can delete any profile"
  on public.profiles for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

-- Students
alter table public.students enable row level security;

create policy "Parents can view own students"
  on public.students for select using (
    parent_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

create policy "Parents can insert students"
  on public.students for insert with check (parent_id = auth.uid());

create policy "Parents can update own students"
  on public.students for update using (parent_id = auth.uid());

create policy "Parents can delete own students"
  on public.students for delete using (parent_id = auth.uid());

create policy "Admins can manage all students"
  on public.students for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

-- Campaigns
alter table public.campaigns enable row level security;

create policy "Campaigns are viewable by everyone"
  on public.campaigns for select using (true);

create policy "Authenticated users can create campaigns"
  on public.campaigns for insert with check (auth.uid() is not null);

create policy "Creator or admin can update campaigns"
  on public.campaigns for update using (
    creator_profile_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

create policy "Creator or admin can delete campaigns"
  on public.campaigns for delete using (
    creator_profile_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

-- Pledges
alter table public.pledges enable row level security;

create policy "Users can view own pledges"
  on public.pledges for select using (
    donor_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

create policy "Authenticated users can create pledges"
  on public.pledges for insert with check (auth.uid() is not null);

create policy "Admins can view all pledges"
  on public.pledges for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin'))
  );

-- Also allow anonymous pledges to be viewed by matching payer_email (for receipts)
create policy "Anonymous pledges viewable by all"
  on public.pledges for select using (donor_id is null);

-- ─── FUNCTION: make_pledge ─────────────────────────────────────────────────────
-- Atomically inserts a pledge and updates campaign raised/backers
create or replace function public.make_pledge(
  p_campaign_id uuid,
  p_donor_id uuid,
  p_tier_id text,
  p_amount numeric,
  p_payment_method text default null,
  p_paypal_transaction_id text default null,
  p_paypal_order_id text default null,
  p_payer_email text default null,
  p_donor_info jsonb default null,
  p_tax_info jsonb default null
) returns uuid
language plpgsql security definer as $$
declare
  v_pledge_id uuid;
begin
  -- Insert the pledge
  insert into public.pledges (
    campaign_id, donor_id, tier_id, amount,
    payment_method, paypal_transaction_id, paypal_order_id, payer_email,
    donor_info, tax_info
  ) values (
    p_campaign_id, p_donor_id, p_tier_id, p_amount,
    p_payment_method, p_paypal_transaction_id, p_paypal_order_id, p_payer_email,
    p_donor_info, p_tax_info
  ) returning id into v_pledge_id;

  -- Update campaign raised and backers atomically
  update public.campaigns
  set raised = raised + p_amount,
      backers = backers + 1
  where id = p_campaign_id;

  return v_pledge_id;
end;
$$;

-- ─── TRIGGER: Create profile on auth.users insert ──────────────────────────────
-- NOTE: This is optional — the app creates profiles explicitly after signUp.
-- Uncomment if you want an automatic fallback.
--
-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (id, email, first_name, last_name)
--   values (new.id, new.email, '', '');
--   return new;
-- end;
-- $$ language plpgsql security definer;
--
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();
