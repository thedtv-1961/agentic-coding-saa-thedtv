## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §nominations
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §4 (Nominations/Voting)
- Research: `plans/reports/researcher-260628-1256-nominations-voting-audit.md` §1
- Edge cases: `plans/260628-1256-database-design/spec/database-design-saa-2025/edge-cases.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** (EXPANSION) Tạo `nominations` table cho hệ thống đề cử giải thưởng SAA 2025.

## Key Insights

- **Đã confirm:** Nomination visibility = aggregate count only — user không thấy ai đề cử ai. RLS enforce: user chỉ SELECT row của chính mình.
- 1 nomination = 1 vote per award per user: `UNIQUE(award_id, nominator_id)` enforce BL006
- `CHECK (nominee_id <> nominator_id)` tại DB level — fail nhanh, không cần application check (BL005)
- Period validation: application layer check (P005 query) — DB không có time CHECK constraint
- `reason` text nullable — optional per spec
- Không có `votes` table riêng — nominations model đủ cho 2025

## Requirements (từ spec)

- **US005** — User đề cử đồng nghiệp trong nomination period
- **US006** — Mỗi user chỉ vote 1 lần mỗi hạng mục
- **BL004** — Chỉ nhận nomination trong `nomination_periods.start_at…end_at` (application layer)
- **BL005** — `nominee_id <> nominator_id` — CHECK constraint tại DB
- **BL006** — `UNIQUE(award_id, nominator_id)` — 1 nomination per hạng mục per user

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000004_create_nominations.sql`

## Implementation Steps

1. CREATE TABLE nominations:
   ```sql
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
   ```

   > **Note (H6 — Red Team fix):** Đã thay `UNIQUE(award_id, nominator_id)` → `UNIQUE(period_id, award_id, nominator_id)` để multi-year và period correction hoạt động đúng.

2. Indexes:
   ```sql
   -- Aggregation query (P004: count per award)
   create index idx_nominations_award_id
     on public.nominations(award_id);

   -- Leaderboard per nominee (P008)
   create index idx_nominations_nominee_id
     on public.nominations(nominee_id);

   -- Period filter (P005 join)
   create index idx_nominations_period_id
     on public.nominations(period_id);

   -- Composite: period + award for admin leaderboard
   create index idx_nominations_period_award
     on public.nominations(period_id, award_id);
   ```

## Todo List

- [ ] Tạo `20260628000004_create_nominations.sql`
- [ ] CREATE TABLE nominations với đầy đủ FKs và constraints
- [ ] Enable RLS
- [ ] Tạo 4 indexes
- [ ] Verify: `UNIQUE(award_id, nominator_id)` reject duplicate nomination (error 23505)
- [ ] Verify: CHECK `nominee_id <> nominator_id` reject self-nomination (error 23514)

## Success Criteria

- `nominations` table tồn tại với đủ FKs
- `nominations_no_self_nominate` CHECK constraint active
- `nominations_unique_per_award` UNIQUE constraint active
- 4 indexes tạo thành công
- RLS enabled

## Risk Assessment

- **High** — `UNIQUE(award_id, nominator_id)` không include `period_id`: user không thể re-nominate trong năm sau nếu SAA multi-year. YAGNI cho 2025; migration mới nếu cần.
- **Medium** — ON DELETE CASCADE trên `nominator_id`/`nominee_id`: user bị xóa → nominations bị xóa theo

## Security Considerations

- RLS: user thường chỉ thấy nominations của chính mình — chi tiết phase 5
- `nominator_id` không expose qua user-facing SELECT policies → aggregate count only

## Next Steps

- Phase 5: RLS policies (quan trọng — nominator privacy)
- Phase 6: Trigger `log_nomination_insert()` cho audit
