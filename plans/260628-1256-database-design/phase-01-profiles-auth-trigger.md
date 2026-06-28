## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md`
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §2 (Migration Patterns)
- System arch: `docs/system-architecture.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Tạo `profiles` table mở rộng `auth.users`, trigger tự động tạo profile khi đăng ký Google OAuth.

## Key Insights

- `profiles.id` phải là FK → `auth.users.id` ON DELETE CASCADE — Supabase yêu cầu pattern này
- Trigger `handle_new_user()` MUST dùng `SECURITY DEFINER set search_path = ''` — bảo mật search_path injection
- Auth fallback: khi Google OAuth thiếu `full_name`, dùng email prefix: `split_part(new.email, '@', 1)` (đã confirm)
- Trigger failure blocks signup — giữ logic đơn giản, không throw exception
- `hero_level` default `new_hero` — trigger cập nhật sau mỗi kudos INSERT (phase 6)

## Requirements (từ spec)

- **US002** — Hero level tự động cập nhật khi nhận kudos (trigger chuẩn bị ở đây, logic ở phase 6)
- **BL002** — Hero level: 4 tiers từ `new_hero` đến `legend_hero`

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000001_create_profiles.sql`

## Implementation Steps

1. Tạo migration file:
   ```bash
   supabase migration new create_profiles
   ```
   Đổi tên thành `20260628000001_create_profiles.sql`

2. CREATE TABLE profiles:
   ```sql
   create table public.profiles (
     id          uuid primary key references auth.users(id) on delete cascade,
     full_name   text not null,
     avatar_url  text,
     role        text not null default 'user'
                 check (role in ('user', 'admin')),
     hero_level  text not null default 'new_hero'
                 check (hero_level in ('new_hero', 'rising_hero', 'super_hero', 'legend_hero')),
     created_at  timestamptz not null default now(),
     updated_at  timestamptz not null default now()
   );

   alter table public.profiles enable row level security;
   ```

3. Trigger function `handle_new_user()`:
   ```sql
   create or replace function public.handle_new_user()
   returns trigger
   language plpgsql
   security definer set search_path = ''
   as $$
   begin
     insert into public.profiles (id, full_name, avatar_url)
     values (
       new.id,
       coalesce(
         nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
         split_part(new.email, '@', 1)
       ),
       new.raw_user_meta_data->>'avatar_url'
     );
     return new;
   end;
   $$;

   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure public.handle_new_user();
   ```

4. Index `role` column:
   ```sql
   create index idx_profiles_role on public.profiles(role);
   ```

## Todo List

- [ ] Tạo `20260628000001_create_profiles.sql`
- [ ] CREATE TABLE profiles với đầy đủ constraints
- [ ] Enable RLS
- [ ] Viết function `handle_new_user()` với email fallback
- [ ] Attach trigger `on_auth_user_created`
- [ ] Tạo index `idx_profiles_role`
- [ ] Test: `supabase db reset` → verify trigger tạo profile khi signup

## Success Criteria

- `profiles` table tồn tại với tất cả columns và constraints
- Trigger `on_auth_user_created` fire khi INSERT vào `auth.users`
- `full_name` không bao giờ NULL (email fallback hoạt động)
- `hero_level` default `new_hero`
- RLS enabled

## Risk Assessment

- **High** — Trigger failure blocks signup: giữ INSERT đơn giản, xem xét `begin/exception` nếu cần
- **Medium** — Google OAuth metadata khác tùy provider version: test cả `full_name` và `name` fields
- **Low** — `search_path = ''` yêu cầu fully-qualified table names trong function body

## Security Considerations

- `SECURITY DEFINER` cần thiết để trigger có quyền INSERT vào `profiles` từ `auth` schema
- Không expose `service_role` key ra client
- RLS enabled ngay khi tạo table

## Next Steps

- Phase 2: Tạo `kudos` table (FK → `profiles.id`)
