## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §kudos, §kudos_hashtags, §kudos_images
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §3 (Performance Indexes)
- Edge cases: `plans/260628-1256-database-design/spec/database-design-saa-2025/edge-cases.md`

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Tạo `kudos`, `hashtags`, `kudos_hashtags`, `kudos_images` tables — core recognition system.

## Key Insights

- `sender_id` là nullable FK — NULL khi `is_anonymous = true` (BL001). Data-level privacy, không cần masking tầng RLS.
- Partial index `WHERE sender_id IS NOT NULL` tiết kiệm index size khi có nhiều anonymous kudos
- BRIN index trên `created_at` nhỏ hơn 10x B-tree, phù hợp append-only feed data
- Composite index `(receiver_id, created_at DESC)` cover cả hero level count query lẫn paginated feed
- Hashtag count constraints (1–5) enforce ở application layer
- `kudos_hashtags` PK tự block duplicate hashtag trong cùng 1 kudos

## Requirements (từ spec)

- **US001** — Gửi kudos với content, hashtags, images, toggle anonymous
- **US004** — 1–5 hashtags per kudos, max 5 images
- **BL001** — `is_anonymous = true` → `sender_id = NULL`
- **BL003** — Hashtag format `#TênHashtag`, admin seed only

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000002_create_kudos_system.sql`

## Implementation Steps

1. CREATE TABLE hashtags:
   ```sql
   create table public.hashtags (
     id    uuid primary key default gen_random_uuid(),
     name  text not null unique
   );
   alter table public.hashtags enable row level security;
   ```

2. CREATE TABLE kudos:
   ```sql
   create table public.kudos (
     id           uuid primary key default gen_random_uuid(),
     sender_id    uuid references public.profiles(id) on delete set null,
     receiver_id  uuid not null references public.profiles(id) on delete cascade,
     content      text not null check (length(content) <= 1000),
     is_anonymous boolean not null default false,
     created_at   timestamptz not null default now(),

     -- H10: anonymous invariant enforced at DB level
     constraint kudos_anon_sender_consistency
       check (not (is_anonymous = true and sender_id is not null))
   );
   alter table public.kudos enable row level security;
   ```

3. CREATE TABLE kudos_hashtags:
   ```sql
   create table public.kudos_hashtags (
     kudos_id    uuid not null references public.kudos(id) on delete cascade,
     hashtag_id  uuid not null references public.hashtags(id) on delete restrict,
     primary key (kudos_id, hashtag_id)
   );
   alter table public.kudos_hashtags enable row level security;
   ```

4. CREATE TABLE kudos_images:
   ```sql
   create table public.kudos_images (
     id           uuid primary key default gen_random_uuid(),
     kudos_id     uuid not null references public.kudos(id) on delete cascade,
     url          text not null,
     order_index  int not null default 0
   );
   alter table public.kudos_images enable row level security;
   ```

   Trigger enforce max-5 images per kudos (H9 — DB-level enforcement):
   ```sql
   create or replace function public.check_kudos_images_limit()
   returns trigger
   language plpgsql
   security definer set search_path = ''
   as $$
   begin
     if (select count(*) from public.kudos_images where kudos_id = new.kudos_id) >= 5 then
       raise exception 'Maximum 5 images per kudos (kudos_id: %)', new.kudos_id;
     end if;
     return new;
   end;
   $$;

   create trigger on_kudos_images_insert_limit
     before insert on public.kudos_images
     for each row execute function public.check_kudos_images_limit();
   ```

5. Performance indexes:
   ```sql
   -- Feed index (receiver + time)
   create index idx_kudos_receiver_created
     on public.kudos(receiver_id, created_at desc);

   -- Partial index sender (exclude anonymous)
   create index idx_kudos_sender
     on public.kudos(sender_id) where sender_id is not null;

   -- BRIN on created_at for global feed
   create index idx_kudos_created_brin
     on public.kudos using brin(created_at);

   -- Junction reverse lookup
   create index idx_kudos_hashtags_hashtag
     on public.kudos_hashtags(hashtag_id);

   -- Images by kudos
   create index idx_kudos_images_kudos
     on public.kudos_images(kudos_id, order_index);
   ```

## Todo List

- [ ] Tạo `20260628000002_create_kudos_system.sql`
- [ ] CREATE TABLE hashtags + RLS enable
- [ ] CREATE TABLE kudos với nullable sender_id + RLS enable
- [ ] CREATE TABLE kudos_hashtags + RLS enable
- [ ] CREATE TABLE kudos_images + RLS enable
- [ ] Tạo tất cả 5 performance indexes
- [ ] Verify FK chain: kudos → profiles, kudos_hashtags → kudos + hashtags

## Success Criteria

- 4 tables tồn tại với đúng schema
- `sender_id` nullable, FK ON DELETE SET NULL
- PK `(kudos_id, hashtag_id)` blocks duplicates
- Tất cả 5 indexes tạo thành công
- RLS enabled trên tất cả tables

## Risk Assessment

- **Medium** — `hashtags ON DELETE RESTRICT`: không xóa hashtag nếu còn kudos dùng. Document rõ cho admin.
- **Low** — `content` length check tại DB là fallback; application đã validate trước

## Security Considerations

- Anonymous kudos: `sender_id = NULL` là data-level protection. SELECT `using (true)` safe vì không có data để leak.
- `kudos_hashtags` và `kudos_images` inherit security context từ kudos qua RLS (phase 5)

## Next Steps

- Phase 3: `awards` và `app_settings` tables
- Phase 5: RLS policies cho tất cả tables này
