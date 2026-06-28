## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §Triggers, §Seed Data
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §2 (Trigger patterns)
- Business context: `plans/260628-1256-database-design/spec/database-design-saa-2025/business-context.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Tạo `audit_logs` table, viết trigger functions (hero_level, audit kudos, audit nominations), seed hashtags + awards + app_settings.

## Key Insights

- `audit_logs` CREATE TABLE phải đặt ở **đầu file này** — TRƯỚC trigger functions vì triggers reference table này
- `update_hero_level()` trigger: AFTER INSERT ON kudos only (đã confirm: YAGNI, không có AFTER DELETE)
- Hero level count dùng `COUNT(*)` — anonymous kudos vẫn đếm vào hero level (sender ẩn, receiver vẫn được credit)
- `log_kudos_insert()` snapshot `row_to_json(NEW)` → `new_data`. `sender_id = NULL` nếu anonymous: không leak sender qua audit
- Seed idempotent với `ON CONFLICT DO NOTHING` — re-run safe
- Hashtags: 10 placeholders — BA/PM cập nhật sau (đã confirm)

## Requirements (từ spec)

- **US002** — Hero level tự động sau mỗi kudos INSERT
- **US007** — Audit log mọi kudos INSERT
- **BL002** — Hero level thresholds: 1–4 = new_hero, 5–9 = rising_hero, 10–20 = super_hero, >20 = legend_hero
- **BL007** — Awards: 6 hạng mục cố định
- **BL008** — audit_logs: INSERT-only (trigger logic + RLS no UPDATE/DELETE)

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000006_triggers_seed.sql`

## Implementation Steps

### 1. CREATE TABLE audit_logs (đặt ĐẦU FILE — trước triggers)

```sql
create table public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  table_name    text not null,
  record_id     uuid not null,
  action        text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data      jsonb,
  new_data      jsonb,
  performed_by  uuid references auth.users(id),
  performed_at  timestamptz not null default now()
);
alter table public.audit_logs enable row level security;

-- Indexes
create index idx_audit_logs_table_record
  on public.audit_logs(table_name, record_id);
create index idx_audit_logs_performed_at
  on public.audit_logs using brin(performed_at);

-- RLS: admin only SELECT, no INSERT/UPDATE/DELETE for authenticated
create policy "audit_logs_admin_select"
  on public.audit_logs for select to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
```

### 2. Hero Level Trigger

```sql
-- H5 fix: FOR UPDATE lock prevents race condition at tier boundary
create or replace function public.update_hero_level()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  kudos_count int;
begin
  -- Lock profile row to serialize concurrent kudos inserts for same receiver
  perform 1 from public.profiles where id = new.receiver_id for update;

  select count(*) into kudos_count
  from public.kudos
  where receiver_id = new.receiver_id;

  update public.profiles
  set hero_level =
    case
      when kudos_count > 20 then 'legend_hero'
      when kudos_count >= 10 then 'super_hero'
      when kudos_count >= 5  then 'rising_hero'
      else                        'new_hero'
    end,
    updated_at = now()
  where id = new.receiver_id;

  return new;
end;
$$;

create trigger on_kudos_inserted_update_hero
  after insert on public.kudos
  for each row execute function public.update_hero_level();
```

> **Ambiguity note:** threshold tại `kudos_count = 20`: spec dùng `>20 → legend_hero`. Confirm: 20 kudos = `super_hero`, 21+ = `legend_hero`.

### 3. Audit Trigger cho Kudos

```sql
create or replace function public.log_kudos_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.audit_logs (table_name, record_id, action, new_data, performed_by)
  values (
    'kudos',
    new.id,
    'INSERT',
    row_to_json(new)::jsonb,
    new.sender_id  -- NULL nếu anonymous: safe, không leak
  );
  return new;
end;
$$;

create trigger on_kudos_inserted_audit
  after insert on public.kudos
  for each row execute function public.log_kudos_insert();
```

### 4. Audit Trigger cho Nominations

```sql
-- C3 fix: strip nominator_id from new_data to prevent audit log leaking nominator identity
create or replace function public.log_nomination_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  safe_data jsonb;
begin
  safe_data := (row_to_json(new)::jsonb) - 'nominator_id';
  insert into public.audit_logs (table_name, record_id, action, new_data, performed_by)
  values (
    'nominations',
    new.id,
    'INSERT',
    safe_data,
    new.nominator_id  -- still stored in performed_by (admin-only column), not in new_data
  );
  return new;
end;
$$;

create trigger on_nomination_inserted_audit
  after insert on public.nominations
  for each row execute function public.log_nomination_insert();
```

### 5. RLS policy cho audit_logs (H11 — phải đặt SAU CREATE TABLE trong cùng migration)

```sql
-- Admin only SELECT
create policy "audit_logs_admin_select"
  on public.audit_logs for select to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
-- No INSERT policy for authenticated — triggers use SECURITY DEFINER (bypass RLS)
-- No UPDATE/DELETE — append-only (BL008)
```

### 7. Seed — Hashtags (10 placeholders)

```sql
insert into public.hashtags (name) values
  ('#Teamwork'), ('#Innovation'), ('#Leadership'),
  ('#CustomerFirst'), ('#Growth'), ('#Ownership'),
  ('#Excellence'), ('#Collaboration'), ('#Integrity'), ('#Impact')
on conflict (name) do nothing;
```

### 8. Seed — Awards 2025

```sql
insert into public.awards (category, title, description, recipient_count, award_value, year)
values
  ('top_talent',         'Top Talent',         'Nhân tài xuất sắc nhất năm',       3, 'TBD', 2025),
  ('top_project',        'Top Project',         'Dự án tiêu biểu nhất năm',         1, 'TBD', 2025),
  ('top_project_leader', 'Top Project Leader',  'PM/TL dự án xuất sắc nhất',        1, 'TBD', 2025),
  ('best_manager',       'Best Manager',        'Quản lý được yêu thích nhất',      1, 'TBD', 2025),
  ('signature_creator',  'Signature Creator',   'Người tạo dấu ấn văn hóa Sun*',   1, 'TBD', 2025),
  ('mvp',                'MVP',                 'Người có đóng góp vượt trội nhất', 1, 'TBD', 2025)
on conflict (category) do nothing;
```

### 9. Seed — App Settings

```sql
insert into public.app_settings (key, value) values
  ('countdown_date',     '2025-12-20T00:00:00+07:00'),
  ('nomination_enabled', 'false')
on conflict (key) do nothing;
```

## Todo List

- [ ] Tạo `20260628000006_triggers_seed.sql`
- [ ] `audit_logs` CREATE TABLE ở ĐẦU FILE (trước triggers)
- [ ] Enable RLS + audit_logs_admin_select policy (H11 — cùng migration 006, không phải 005)
- [ ] Tạo 2 indexes cho audit_logs
- [ ] Function `update_hero_level()` với FOR UPDATE lock (H5) + trigger
- [ ] Confirm: kudos_count = 20 → super_hero hay legend_hero? (spec ambiguity)
- [ ] Function `log_kudos_insert()` + trigger
- [ ] Function `log_nomination_insert()` với safe_data strip `nominator_id` (C3) + trigger
- [ ] Seed hashtags (10 placeholders, ON CONFLICT DO NOTHING)
- [ ] Seed awards (6 hạng mục 2025, ON CONFLICT DO NOTHING)
- [ ] Seed app_settings (countdown_date + nomination_enabled)
- [ ] Test: INSERT kudos → profiles.hero_level tự cập nhật
- [ ] Test: INSERT kudos → audit_logs có row mới
- [ ] Test: anonymous kudos audit_log → `new_data.sender_id = null`

## Success Criteria

- Trigger `on_kudos_inserted_update_hero` fire và update `profiles.hero_level` đúng tier
- Trigger `on_kudos_inserted_audit` ghi audit_logs sau mỗi kudos INSERT
- Trigger `on_nomination_inserted_audit` ghi audit_logs sau mỗi nomination INSERT
- Seed idempotent: re-run không tạo duplicate
- 10 hashtags + 6 awards + 2 app_settings seeded

## Risk Assessment

- **High** — `audit_logs` phải tồn tại trước trigger compile: đặt CREATE TABLE ĐẦU FILE là bắt buộc
- **Medium** — Hero level race condition: concurrent kudos INSERT cùng receiver. Postgres row-level lock đảm bảo đúng thứ tự. Acceptable.
- **Low** — Seed re-run safe nhờ `ON CONFLICT DO NOTHING`

## Security Considerations

- Tất cả trigger functions dùng `SECURITY DEFINER set search_path = ''`
- `audit_logs.performed_by = NULL` cho anonymous kudos — không leak identity
- Seed data chạy với service_role trong migration — không cần RLS bypass thủ công

## Next Steps

- Phase 7: Performance indexes còn lại, supa_audit (optional), TypeScript types generation
