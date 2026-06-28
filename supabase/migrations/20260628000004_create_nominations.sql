-- Phase 4: Nominations table
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US005, US006, BL004, BL005, BL006)

create table public.nominations (
  id            uuid primary key default gen_random_uuid(),
  period_id     uuid not null references public.nomination_periods(id),
  award_id      uuid not null references public.awards(id),
  nominator_id  uuid not null references public.profiles(id) on delete cascade,
  nominee_id    uuid not null references public.profiles(id) on delete cascade,
  reason        text,
  created_at    timestamptz not null default now(),

  -- BL005: no self-nomination
  constraint nominations_no_self_nominate
    check (nominee_id <> nominator_id),

  -- BL006: 1 nomination per user per award per period (H6 fix: include period_id)
  constraint nominations_unique_per_award
    unique (period_id, award_id, nominator_id)
);

alter table public.nominations enable row level security;

create index idx_nominations_award_id
  on public.nominations(award_id);

create index idx_nominations_nominee_id
  on public.nominations(nominee_id);

create index idx_nominations_period_id
  on public.nominations(period_id);

create index idx_nominations_period_award
  on public.nominations(period_id, award_id);
