-- ============================================================================
-- Migration 003: Link campaigns to students
-- ============================================================================

alter table public.campaigns
  add column if not exists student_id uuid references public.students(id);

create index if not exists idx_campaigns_student on public.campaigns(student_id);
