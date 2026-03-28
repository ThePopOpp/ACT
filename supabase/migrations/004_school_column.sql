-- ============================================================================
-- Migration 004: Add structured school data to campaigns
-- ============================================================================

alter table public.campaigns
  add column if not exists school jsonb not null default '{}'::jsonb;
