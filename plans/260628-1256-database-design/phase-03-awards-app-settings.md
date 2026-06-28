## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §awards, §app_settings, §Seed Data
- Research: `plans/reports/researcher-260628-1256-nominations-voting-audit.md` §3 (App Settings)
- System arch: `docs/system-architecture.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Tạo `awards`, `app_settings`, và `nomination_periods` tables. Awards là dependency của nominations (phase 4).

## Key Insights

- `awards` phải tạo TRƯỚC `nominations` vì FK `nominations.award_id → awards.id`
- `nomination_periods` tạo cùng phase này — cần cho nominations FK
- `award_value` dùng `text` placeholder — BA/PM xác nhận sau (BL007)
- 6 hạng mục cố định cho 2025 — không có CRUD UI, seed via migration
- `app_settings` dùng key-value text store — đủ cho countdown_date và nomination flags

## Requirements (từ spec)

- **US005** — Nominations phụ thuộc vào awards (FK) và nomination_periods (period check)
- **US008** — `app_settings` lưu `countdown_date`
- **BL007** — 6 hạng mục cố định cho 2025
- **BL004** — Nomination period gates theo `nomination_periods.start_at…end_at`

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000003_create_awards_settings.sql`

## Implementation Steps

1. CREATE TABLE awards:
   ```sql
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
   ```

2. CREATE TABLE app_settings:
   ```sql
   create table public.app_settings (
     key    text primary key,
     value  text not null
   );
   alter table public.app_settings enable row level security;
   ```

3. CREATE TABLE nomination_periods:
   ```sql
   -- H7: btree_gist required for EXCLUDE constraint
   create extension if not exists btree_gist;

   create table public.nomination_periods (
     id         uuid primary key default gen_random_uuid(),
     year       int not null,
     start_at   timestamptz not null,
     end_at     timestamptz not null,
     created_at timestamptz not null default now(),
     constraint nomination_periods_valid_range check (end_at > start_at),
     -- H7: prevent overlapping periods at DB level
     constraint nomination_periods_no_overlap
       exclude using gist (tstzrange(start_at, end_at) with &&)
   );
   alter table public.nomination_periods enable row level security;

   create index idx_nomination_periods_year
     on public.nomination_periods(year);
   ```

## Todo List

- [ ] Tạo `20260628000003_create_awards_settings.sql`
- [ ] CREATE TABLE awards với CHECK constraint 6 categories
- [ ] CREATE TABLE app_settings + RLS enable
- [ ] CREATE TABLE nomination_periods với CHECK (end_at > start_at)
- [ ] Index `nomination_periods.year`
- [ ] Verify: awards tạo TRƯỚC nominations migration

## Success Criteria

- `awards` có CHECK constraint cho 6 categories cố định
- `nomination_periods` có CHECK `end_at > start_at`
- `app_settings` PK là `key` text
- RLS enabled trên tất cả 3 tables

## Risk Assessment

- **Low** — `award_value` là text placeholder; đổi sang numeric cần migration mới (YAGNI)
- **Low** — Multi-period per year không có EXCLUDE constraint; application validate overlap

## Security Considerations

- `app_settings` chứa config nhạy cảm (nomination dates): chỉ admin UPDATE
- `nomination_periods`: admin-only INSERT/UPDATE; authenticated SELECT

## Next Steps

- Phase 4: `nominations` table (EXPANSION) — depend on awards + nomination_periods
