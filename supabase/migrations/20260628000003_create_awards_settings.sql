-- Phase 3: Awards, app_settings, nomination_periods
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US005, US008, BL004, BL007)

create table public.awards (
  id              uuid primary key default gen_random_uuid(),
  category        text not null unique
                  check (category in (
                    'top_talent','top_project','top_project_leader',
                    'best_manager','signature_creator','mvp'
                  )),
  title           text not null,
  description     text not null,
  recipient_count int not null default 1,
  award_value     text not null default 'TBD',
  year            int not null default 2025
);

alter table public.awards enable row level security;

create table public.app_settings (
  key    text primary key,
  value  text not null
);

alter table public.app_settings enable row level security;

-- H7: btree_gist required for EXCLUDE constraint (prevent overlapping nomination periods)
create extension if not exists btree_gist;

create table public.nomination_periods (
  id         uuid primary key default gen_random_uuid(),
  year       int not null,
  start_at   timestamptz not null,
  end_at     timestamptz not null,
  created_at timestamptz not null default now(),
  constraint nomination_periods_valid_range check (end_at > start_at),
  constraint nomination_periods_no_overlap
    exclude using gist (tstzrange(start_at, end_at) with &&)
);

alter table public.nomination_periods enable row level security;

create index idx_nomination_periods_year
  on public.nomination_periods(year);
