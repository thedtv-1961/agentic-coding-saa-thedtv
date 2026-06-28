# System Architecture

## Overview

Next.js 15 App Router + Supabase Auth + Cloudflare Workers.

```
Browser
  └─ Next.js App Router (Cloudflare Workers)
       ├─ middleware.ts         — auth check + i18n locale redirect
       ├─ app/[locale]/         — localised routes (EN/VI)
       │   ├─ layout.tsx        — root layout + NextIntlClientProvider
       │   ├─ page.tsx          — home (protected)
       │   └─ login/            — public login page
       ├─ app/auth/callback/    — Supabase OAuth callback
       └─ utils/supabase/       — Supabase client helpers
            ├─ client.ts        — browser client (createBrowserClient)
            ├─ server.ts        — server client (createServerClient)
            └─ middleware.ts    — session refresh helper
```

## Auth Flow

```
User → /login → Google OAuth → Supabase Auth
  → /auth/callback → exchange code → session cookie
  → redirect → / (protected home)
```

Middleware kiểm tra session trên mọi request. Unauthenticated → redirect `/login`.

## i18n

next-intl với 2 locale: `en`, `vi`. Default locale: `vi`.
Routing: `/{locale}/...` — middleware tự inject locale vào URL.
Messages: `messages/en.json`, `messages/vi.json`.

## Data Layer

- **Supabase local** (Docker): `http://127.0.0.1:54321`
- Server components dùng `createServerClient` (cookie-based session)
- Client components dùng `createBrowserClient`
- Migrations: `supabase/migrations/`

## Database Schema

### Tables

| Table | Mô tả |
|---|---|
| `profiles` | Extends `auth.users` — thông tin user + role + hero level |
| `kudos` | Bài viết kudos gửi giữa các thành viên |
| `hashtags` | Master data hashtag, admin seed sẵn |
| `kudos_hashtags` | Junction table kudos ↔ hashtags (min 1, max 5) |
| `kudos_images` | Ảnh đính kèm trong kudos (max 5), URL từ Supabase Storage |
| `awards` | Seed data 6 hạng mục giải thưởng (Hệ thống giải SAA 2025) |
| `app_settings` | Cấu hình chung — lưu `countdown_date` và các config khác |
| `nomination_periods` | Khoảng thời gian bình chọn — có EXCLUDE constraint ngăn overlap |
| `nominations` | Bình chọn giải thưởng (1 per user per award per period) |
| `audit_logs` | Append-only log của kudos và nominations (admin-only select) |

### Columns chính

```sql
profiles
  id          uuid PK → auth.users.id
  full_name   text
  avatar_url  text
  role        text        -- 'user' | 'admin'
  hero_level  text        -- 'new_hero' | 'rising_hero' | 'super_hero' | 'legend_hero'
  created_at  timestamptz

kudos
  id           uuid PK
  sender_id    uuid → profiles.id  -- NULL nếu ẩn danh (is_anonymous = true)
  receiver_id  uuid → profiles.id  NOT NULL
  content      text                -- rich text HTML, max 1000 chars
  is_anonymous boolean             DEFAULT false
  created_at   timestamptz

hashtags
  id    uuid PK
  name  text UNIQUE  -- format: '#TênHashtag'

kudos_hashtags
  kudos_id    uuid → kudos.id
  hashtag_id  uuid → hashtags.id
  PRIMARY KEY (kudos_id, hashtag_id)

kudos_images
  id          uuid PK
  kudos_id    uuid → kudos.id
  url         text  -- Supabase Storage URL
  order_index int

awards
  id              uuid PK
  category        text  -- 'top_talent' | 'top_project' | 'top_project_leader' | 'best_manager' | 'signature_creator' | 'mvp'
  title           text
  description     text
  recipient_count int
  award_value     text
  year            int   DEFAULT 2025

app_settings
  key    text PK   -- e.g. 'countdown_date', 'nomination_enabled'
  value  text

nomination_periods
  id        uuid PK
  year      int
  start_at  timestamptz
  end_at    timestamptz
  -- EXCLUDE constraint via btree_gist prevents overlapping periods

nominations
  id            uuid PK
  period_id     uuid → nomination_periods.id
  award_id      uuid → awards.id
  nominator_id  uuid → profiles.id
  nominee_id    uuid → profiles.id
  reason        text
  -- CHECK: nominee_id <> nominator_id (no self-nomination)
  -- UNIQUE: (period_id, award_id, nominator_id) — 1 per user per award per period

audit_logs
  id            uuid PK
  table_name    text          -- 'kudos' | 'nominations'
  record_id     uuid
  action        text          -- 'INSERT' | 'UPDATE' | 'DELETE'
  old_data      jsonb
  new_data      jsonb         -- sender_id/nominator_id stripped for privacy
  performed_by  uuid → auth.users.id
  performed_at  timestamptz
```

### Trigger Functions

| Function | Trigger | Mô tả |
|---|---|---|
| `handle_new_user()` | `after insert on auth.users` | Tạo `profiles` row từ user mới |
| `update_hero_level()` | `after insert on kudos` | Cập nhật `hero_level` theo số kudos nhận |
| `log_kudos_insert()` | `after insert on kudos` | Ghi audit log — ẩn `sender_id` nếu anonymous |
| `log_nomination_insert()` | `after insert on nominations` | Ghi audit log — ẩn `nominator_id` |

Tất cả trigger functions dùng `SECURITY DEFINER` để bypass RLS khi ghi `audit_logs`.

### Hero Level Logic

DB trigger cập nhật `profiles.hero_level` mỗi khi nhận kudos mới:

| Kudos nhận được | Hero Level |
|---|---|
| 1–4 | `new_hero` |
| 5–9 | `rising_hero` |
| 10–20 | `super_hero` |
| 20+ | `legend_hero` |

### Quyết định thiết kế

- **Anonymous kudos**: `sender_id = NULL`, không lưu sender kể cả admin — data-level privacy
- **Collections** (REVIVAL, TOUCH OF LIGHT...): hardcode trong code, không có table — display-only trong Thể lệ drawer
- **Hashtags**: master data, admin seed một lần, không có CRUD UI
- **Awards**: seed data, không thay đổi trong runtime

## Deploy Target

Cloudflare Workers via `@cloudflare/next-on-pages`.
Build: `npm run pages:build` → `npm run deploy`.
Config: `wrangler.toml`.

## Testing

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `src/test/` |
| E2E | Playwright | `e2e/` |
