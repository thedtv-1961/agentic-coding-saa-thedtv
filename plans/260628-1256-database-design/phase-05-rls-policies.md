## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §RLS
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §1 (RLS Patterns)
- Edge cases: `plans/260628-1256-database-design/spec/database-design-saa-2025/edge-cases.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Viết tất cả RLS policies cho 9 tables.

## Key Insights

- **Performance critical:** wrap `auth.uid()` trong `(select auth.uid())` — evaluated once per query, không phải once per row. Tối đa 99.99% improvement per Supabase docs.
- `service_role` key bypass ALL RLS — triggers dùng `SECURITY DEFINER` sẽ bypass tự nhiên
- Admin check: subquery `exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')` — không dùng JWT claim vì role lưu ở `profiles`
- Nominations SELECT: user thường chỉ xem row của mình; admin xem tất cả — bảo vệ nominator privacy
- Tất cả policies `to authenticated` → anon role nhận 0 rows hoặc permission denied

## Requirements (từ spec)

- **BL001** — Anonymous kudos: `sender_id = NULL` — `SELECT using (true)` là đủ, không mask
- **BL008** — `audit_logs` append-only: no UPDATE/DELETE policies

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000005_rls_policies.sql`

## Implementation Steps

### profiles
```sql
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated using (true);

-- C1 fix: WITH CHECK prevents self-elevation — user cannot change own role
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and role = (select p.role from public.profiles p where p.id = (select auth.uid()))
  );
```

### kudos
```sql
create policy "kudos_select_all"
  on public.kudos for select to authenticated using (true);

create policy "kudos_insert"
  on public.kudos for insert to authenticated
  with check (
    (is_anonymous = false and sender_id = (select auth.uid()))
    or (is_anonymous = true and sender_id is null)
  );
-- No UPDATE/DELETE policies — kudos immutable
```

### hashtags
```sql
create policy "hashtags_select_all"
  on public.hashtags for select to authenticated using (true);

create policy "hashtags_admin_write"
  on public.hashtags for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
```

### kudos_hashtags
```sql
create policy "kudos_hashtags_select"
  on public.kudos_hashtags for select to authenticated using (true);

-- H4 fix: remove is_anonymous branch — anon kudos inserted via server-side transaction only
create policy "kudos_hashtags_insert"
  on public.kudos_hashtags for insert to authenticated
  with check (
    exists (select 1 from public.kudos
      where id = kudos_id
      and sender_id = (select auth.uid()))
  );
```

### kudos_images
```sql
create policy "kudos_images_select"
  on public.kudos_images for select to authenticated using (true);

-- H4 fix: remove is_anonymous branch — anon kudos inserted via server-side transaction only
create policy "kudos_images_insert"
  on public.kudos_images for insert to authenticated
  with check (
    exists (select 1 from public.kudos
      where id = kudos_id
      and sender_id = (select auth.uid()))
  );
```

### awards
```sql
create policy "awards_select_all"
  on public.awards for select to authenticated using (true);

create policy "awards_admin_write"
  on public.awards for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
```

### app_settings
```sql
create policy "app_settings_select_all"
  on public.app_settings for select to authenticated using (true);

-- H8 fix: admin INSERT policy was missing
create policy "app_settings_admin_insert"
  on public.app_settings for insert to authenticated
  with check (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- M13 fix: add WITH CHECK to prevent key rename attacks
create policy "app_settings_admin_update"
  on public.app_settings for update to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'))
  with check (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
```

### nomination_periods
```sql
create policy "nomination_periods_select_all"
  on public.nomination_periods for select to authenticated using (true);

create policy "nomination_periods_admin_write"
  on public.nomination_periods for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
```

### nominations
```sql
-- User sees only own nominations (nominator privacy)
create policy "nominations_select_own"
  on public.nominations for select to authenticated
  using (nominator_id = (select auth.uid()));

-- Admin sees all
create policy "nominations_select_admin"
  on public.nominations for select to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- C2 fix: period time check enforced at DB level — cannot bypass via direct API
create policy "nominations_insert"
  on public.nominations for insert to authenticated
  with check (
    nominator_id = (select auth.uid())
    and exists (
      select 1 from public.nomination_periods
      where id = period_id
        and now() between start_at and end_at
    )
  );
-- No UPDATE/DELETE — nominations immutable
```

### audit_logs
```sql
-- H11 fix: audit_logs table is created in migration 006, NOT here.
-- RLS policy for audit_logs is defined in phase-06 (same migration as CREATE TABLE).
-- DO NOT define audit_logs policies here — migration 005 will fail (table doesn't exist yet).
```

### nominations_count_by_award view (H12)
```sql
-- Safe aggregate view — không expose nominator_id
create or replace view public.nominations_count_by_award as
  select period_id, award_id, count(*) as nomination_count
  from public.nominations
  group by period_id, award_id;
```

## Todo List

- [ ] Tạo `20260628000005_rls_policies.sql`
- [ ] RLS cho profiles (select, update own — WITH CHECK chặn role self-elevation)
- [ ] RLS cho kudos (select all, insert với anonymous check)
- [ ] RLS cho hashtags (select all, admin write)
- [ ] RLS cho kudos_hashtags + kudos_images (select, insert — NO is_anonymous bypass)
- [ ] RLS cho awards (select all, admin write)
- [ ] RLS cho app_settings (select all, admin INSERT + admin UPDATE WITH CHECK)
- [ ] RLS cho nomination_periods (select all, admin write)
- [ ] RLS cho nominations (select own + admin, insert với DB-level period time check)
- [ ] **KHÔNG** định nghĩa audit_logs policy ở đây — đặt vào migration 006
- [ ] CREATE VIEW nominations_count_by_award
- [ ] Test: anon role nhận 0 rows
- [ ] Test: user không thấy nominations của người khác
- [ ] Test: user không tự nâng role = 'admin' qua UPDATE profiles
- [ ] Test: nomination INSERT bị reject ngoài nomination period
- [ ] Verify `(select auth.uid())` pattern nhất quán

## Success Criteria

- Tất cả 9 tables có ít nhất 1 RLS policy
- Anonymous kudos: SELECT không leak sender info
- User không đọc được nominations của người khác
- Admin SELECT hoạt động trên tất cả tables
- `(select auth.uid())` pattern được dùng nhất quán

## Risk Assessment

- **High** — `kudos_hashtags` insert policy phụ thuộc JOIN kudos: INSERT kudos trước, rồi kudos_hashtags trong cùng transaction
- **Medium** — Admin check dùng subquery vào `profiles` — circular dependency nếu `profiles` RLS chặn chính nó. Test kỹ admin flow.
- **Low** — Nominations: 2 SELECT policies (own + admin) — Postgres OR-combines đúng cách

## Security Considerations

- Không có UPDATE/DELETE policy trên kudos = immutable enforcement tại DB
- `nominations`: nominator_id chỉ visible cho admin
- `audit_logs`: INSERT chỉ từ trigger SECURITY DEFINER → service_role context bypass RLS

## Next Steps

- Phase 6: Triggers và seed data
