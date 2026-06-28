---
status: draft
authored_by: takumi
created: 2026-06-28
lang: vi
---

# F000_DatabaseDesignSaa2025

## Overview

Thiết kế toàn bộ database layer cho SAA 2025 (Sun* Awards & Achievements) — nền tảng recognition nội bộ. Bao gồm:
- Core schema: profiles, kudos, hashtags, images
- Awards seed data: 6 hạng mục giải
- **EXPANSION**: nominations/voting tables
- **EXPANSION**: audit log
- RLS policies, triggers, performance indexes

Stack: PostgreSQL (Supabase), Row-Level Security bật toàn bộ.

## Polymorphic Behavior

Không có polymorphic entity. Mỗi table có mục đích đơn lẻ. `audit_logs.record_id` dùng `uuid` + `table_name text` để reference cross-table — không dùng polymorphic FK.

## Cross-Cutting Logic

### Requirements

**US001** — Người dùng đã đăng nhập có thể gửi kudos cho đồng nghiệp, tùy chọn ẩn danh.
**US002** — Người dùng nhận kudos được cập nhật hero_level tự động.
**US003** — Admin seed hashtag master data; user không tạo hashtag tự do.
**US004** — Mỗi kudos gắn 1–5 hashtag, đính kèm tối đa 5 ảnh.
**US005** — Người dùng đề cử đồng nghiệp vào hạng mục giải thưởng trong nomination period.
**US006** — Mỗi user chỉ vote 1 lần mỗi hạng mục (1 vote = 1 nomination record).
**US007** — Admin xem được toàn bộ audit log thay đổi dữ liệu quan trọng.
**US008** — Hệ thống lưu cấu hình đếm ngược (countdown_date) qua app_settings.

### Business Rules

**BL001** — `is_anonymous = true` → `sender_id = NULL` tại DB; không có cột nào khác lưu sender identity.
**BL002** — Hero level: 1–4 kudos nhận = `new_hero`; 5–9 = `rising_hero`; 10–20 = `super_hero`; >20 = `legend_hero`. Đếm bằng trigger, không tính kudos ẩn danh từ phía receiver (vẫn đếm — ẩn danh chỉ ẩn sender, không ẩn receiver).
**BL003** — Hashtag format: `#TênHashtag`. Admin seed, không có CRUD UI cho user.
**BL004** — Nominations chỉ nhận trong `nomination_periods.start_at … end_at`. Ngoài period → reject ở application layer và DB constraint.
**BL005** — Một user không thể tự đề cử chính mình (`nominee_id <> nominator_id`).
**BL006** — Một user chỉ đề cử mỗi hạng mục 1 lần — unique constraint `(award_id, nominator_id)`.
**BL007** — Awards 2025: 6 hạng mục cố định — seed data, không thay đổi runtime.
**BL008** — `audit_logs`: INSERT-only, không UPDATE/DELETE (append-only via RLS + trigger).

### Decision Logic

Không có complex decision tree. Hero level là pure function của `count(kudos where receiver_id = user)` — trigger cập nhật sau mỗi INSERT INTO kudos.

### State Machines

**Nomination state** (đơn giản):
```
[draft] → [submitted] → [closed]
```
Không có explicit state column — nomination period đóng/mở theo thời gian (`nomination_periods.end_at`).

### Algorithms

**Hero level recalculation** (trigger function `update_hero_level()`):
```sql
kudos_count := COUNT(*) FROM kudos WHERE receiver_id = NEW.receiver_id;
hero_level :=
  CASE
    WHEN kudos_count >= 20 THEN 'legend_hero'
    WHEN kudos_count >= 10 THEN 'super_hero'
    WHEN kudos_count >= 5  THEN 'rising_hero'
    ELSE                        'new_hero'
  END;
UPDATE profiles SET hero_level = hero_level WHERE id = NEW.receiver_id;
```

### External Integrations

- **Supabase Auth**: `profiles.id` → `auth.users.id` (FK). Trigger `handle_new_user()` tạo profile khi user đăng ký.
- **Supabase Storage**: `kudos_images.url` trỏ tới Storage bucket `kudos-images`.
- **Google OAuth**: qua Supabase Auth — không có table riêng.

### Verification

- Trigger `update_hero_level` fire AFTER INSERT ON kudos.
- Trigger `handle_new_user` fire AFTER INSERT ON auth.users.
- Trigger `log_kudos_change` fire AFTER INSERT ON kudos → ghi audit_logs.
- Constraint `nominations_no_self_nominate`: CHECK `nominee_id <> nominator_id`.
- Constraint `nominations_unique_per_award`: UNIQUE `(award_id, nominator_id)`.

**Client behavior:** see behavior-logic.md, permissions.md, screen-flow.md

## User Stories

**US001** — Gửi kudos: user chọn receiver, nhập content, chọn 1–5 hashtag, upload 0–5 ảnh, toggle ẩn danh.
**US002** — Xem hero level: user thấy badge hero_level trên profile, tự động cập nhật khi nhận thêm kudos.
**US005** — Đề cử: user chọn hạng mục, chọn nominee, submit — chỉ khả dụng trong nomination period.
**US006** — Vote: UI hiển thị số lượng nominations mỗi hạng mục (aggregate, không lộ nominator).

### Edge Cases

See edge-cases.md.

## Key Entities

### Table: `profiles`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE |
| `full_name` | `text` | NOT NULL |
| `avatar_url` | `text` | NULL |
| `role` | `text` | NOT NULL DEFAULT `'user'`, CHECK IN `('user','admin')` |
| `hero_level` | `text` | NOT NULL DEFAULT `'new_hero'`, CHECK IN `('new_hero','rising_hero','super_hero','legend_hero')` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

**Indexes:** PK trên `id` (implicit). Index `idx_profiles_role` ON `(role)` — admin queries.

**RLS:**
- `SELECT`: authenticated users xem được tất cả profiles (public recognition platform).
- `INSERT`: service_role only (via trigger `handle_new_user`).
- `UPDATE`: user chỉ update profile của chính mình (`auth.uid() = id`). Admin (`role='admin'`) update bất kỳ.
- `DELETE`: disabled.

---

### Table: `kudos`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `sender_id` | `uuid` | NULL, FK → `profiles.id` ON DELETE SET NULL |
| `receiver_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE |
| `content` | `text` | NOT NULL, CHECK `length(content) <= 1000` |
| `is_anonymous` | `boolean` | NOT NULL DEFAULT `false` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

**Indexes:**
- `idx_kudos_receiver_id` ON `(receiver_id)` — hero level queries, feed by receiver.
- `idx_kudos_sender_id` ON `(sender_id)` — feed by sender (nullable, partial index WHERE sender_id IS NOT NULL).
- `idx_kudos_created_at` ON `(created_at DESC)` — chronological feed.

**RLS:**
- `SELECT`: authenticated users xem được tất cả kudos. Khi `is_anonymous = true`, `sender_id` đã là NULL — không cần mask thêm.
- `INSERT`: authenticated users (`auth.uid() IS NOT NULL`). Application set `sender_id = NULL` khi `is_anonymous = true`.
- `UPDATE`/`DELETE`: disabled (kudos là immutable sau khi gửi).

---

### Table: `hashtags`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `name` | `text` | NOT NULL UNIQUE |

**RLS:**
- `SELECT`: tất cả authenticated users.
- `INSERT`/`UPDATE`/`DELETE`: admin only hoặc service_role (seed via migration).

---

### Table: `kudos_hashtags`

| Column | Type | Constraints |
|--------|------|-------------|
| `kudos_id` | `uuid` | FK → `kudos.id` ON DELETE CASCADE |
| `hashtag_id` | `uuid` | FK → `hashtags.id` ON DELETE RESTRICT |
| PRIMARY KEY | | `(kudos_id, hashtag_id)` |

**Constraint phụ:** Application enforce 1–5 hashtags per kudos. DB không có CHECK count (phức tạp); enforce ở application layer.

**RLS:** Inherit từ kudos — authenticated users SELECT; INSERT khi tạo kudos.

---

### Table: `kudos_images`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `kudos_id` | `uuid` | NOT NULL, FK → `kudos.id` ON DELETE CASCADE |
| `url` | `text` | NOT NULL |
| `order_index` | `int` | NOT NULL DEFAULT 0 |

**Indexes:** `idx_kudos_images_kudos_id` ON `(kudos_id, order_index)`.

**RLS:** Same as kudos — authenticated SELECT; INSERT khi tạo kudos.

---

### Table: `awards`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `category` | `text` | NOT NULL UNIQUE, CHECK IN seed list |
| `title` | `text` | NOT NULL |
| `description` | `text` | NOT NULL |
| `recipient_count` | `int` | NOT NULL DEFAULT 1 |
| `award_value` | `text` | NOT NULL |
| `year` | `int` | NOT NULL DEFAULT 2025 |

**RLS:** Tất cả authenticated users SELECT. Admin only INSERT/UPDATE/DELETE.

---

### Table: `app_settings`

| Column | Type | Constraints |
|--------|------|-------------|
| `key` | `text` | PK |
| `value` | `text` | NOT NULL |

**RLS:** Authenticated users SELECT. Admin only UPDATE.

---

### Table (EXPANSION): `nomination_periods`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `year` | `int` | NOT NULL |
| `start_at` | `timestamptz` | NOT NULL |
| `end_at` | `timestamptz` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

**Constraint:** CHECK `end_at > start_at`.

**RLS:** Authenticated users SELECT. Admin INSERT/UPDATE.

---

### Table (EXPANSION): `nominations`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `period_id` | `uuid` | NOT NULL, FK → `nomination_periods.id` |
| `award_id` | `uuid` | NOT NULL, FK → `awards.id` |
| `nominator_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE |
| `nominee_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE |
| `reason` | `text` | NULL — lý do đề cử (optional) |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

**Constraints:**
- UNIQUE `(award_id, nominator_id)` — mỗi user chỉ đề cử 1 người mỗi hạng mục mỗi period.
- CHECK `nominee_id <> nominator_id` — không tự đề cử.

**Indexes:**
- `idx_nominations_award_id` ON `(award_id)` — aggregation.
- `idx_nominations_nominee_id` ON `(nominee_id)` — leaderboard per nominee.
- `idx_nominations_period_id` ON `(period_id)`.

**RLS:**
- `SELECT`: Admin xem toàn bộ. User thường chỉ xem count aggregate (via view hoặc RPC), không xem nominator của người khác.
- `INSERT`: Authenticated users, trong nomination period hiện tại. Application validate period còn hiệu lực.
- `UPDATE`/`DELETE`: Disabled sau khi submit (nomination immutable).

---

### Table (EXPANSION): `audit_logs`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK DEFAULT `gen_random_uuid()` |
| `table_name` | `text` | NOT NULL |
| `record_id` | `uuid` | NOT NULL |
| `action` | `text` | NOT NULL, CHECK IN `('INSERT','UPDATE','DELETE')` |
| `old_data` | `jsonb` | NULL — snapshot trước khi thay đổi |
| `new_data` | `jsonb` | NULL — snapshot sau khi thay đổi |
| `performed_by` | `uuid` | NULL, FK → `auth.users.id` — NULL nếu trigger/system |
| `performed_at` | `timestamptz` | NOT NULL DEFAULT `now()` |

**Indexes:**
- `idx_audit_logs_table_record` ON `(table_name, record_id)`.
- `idx_audit_logs_performed_at` ON `(performed_at DESC)`.

**RLS:** Admin only SELECT. INSERT via trigger (service_role). UPDATE/DELETE disabled (append-only).

---

## Triggers & Functions

### `handle_new_user()` — AFTER INSERT ON auth.users
```sql
INSERT INTO public.profiles (id, full_name, avatar_url)
VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
```

### `update_hero_level()` — AFTER INSERT ON kudos
```sql
DECLARE kudos_count int;
BEGIN
  SELECT COUNT(*) INTO kudos_count FROM kudos WHERE receiver_id = NEW.receiver_id;
  UPDATE profiles SET hero_level =
    CASE
      WHEN kudos_count >= 20 THEN 'legend_hero'
      WHEN kudos_count >= 10 THEN 'super_hero'
      WHEN kudos_count >= 5  THEN 'rising_hero'
      ELSE 'new_hero'
    END
  WHERE id = NEW.receiver_id;
  RETURN NEW;
END;
```

### `log_kudos_insert()` — AFTER INSERT ON kudos
Ghi vào audit_logs: table_name='kudos', record_id=NEW.id, action='INSERT', new_data=row_to_json(NEW).

---

## Seed Data

### Hashtags (admin seed)
```sql
INSERT INTO hashtags (name) VALUES
  ('#Teamwork'), ('#Innovation'), ('#Leadership'),
  ('#CustomerFirst'), ('#Growth'), ('#Ownership'),
  ('#Excellence'), ('#Collaboration'), ('#Integrity'), ('#Impact');
```
*(Danh sách chính thức cần confirm với BA/PM — xem Gaps.)*

### Awards 2025
```sql
INSERT INTO awards (category, title, description, recipient_count, award_value, year) VALUES
  ('top_talent',          'Top Talent',           'Nhân tài xuất sắc nhất năm',          3, 'TBD', 2025),
  ('top_project',         'Top Project',           'Dự án tiêu biểu nhất năm',            1, 'TBD', 2025),
  ('top_project_leader',  'Top Project Leader',    'PM/TL dự án xuất sắc nhất',           1, 'TBD', 2025),
  ('best_manager',        'Best Manager',          'Quản lý được yêu thích nhất',         1, 'TBD', 2025),
  ('signature_creator',   'Signature Creator',     'Người tạo dấu ấn văn hóa Sun*',      1, 'TBD', 2025),
  ('mvp',                 'MVP',                   'Người có đóng góp vượt trội nhất',   1, 'TBD', 2025);
```

### App Settings
```sql
INSERT INTO app_settings (key, value) VALUES
  ('countdown_date', '2025-12-20T00:00:00+07:00'),
  ('nomination_enabled', 'false');
```

---

## Artifact References

| Artifact | Path |
|----------|------|
| System Architecture | `docs/system-architecture.md` |
| Business Context | `spec/database-design-saa-2025/business-context.md` |
| Edge Cases | `spec/database-design-saa-2025/edge-cases.md` |
| Screens / API Patterns | `spec/database-design-saa-2025/screens.md` |
| DB Migrations | `supabase/migrations/` |

## Assumptions

- Supabase Auth bật RLS globally — tất cả tables phải có policy.
- Anonymous kudos: privacy tuyệt đối tại DB — không lưu sender dưới bất kỳ dạng nào.
- Nominations: chỉ 1 nomination period / năm (đơn giản hóa — xem Gaps nếu cần multi-period).
- `award_value` hiện là text placeholder — sẽ được BA confirm sau.

## Source Code References

- `supabase/migrations/` — migration files
- `utils/supabase/server.ts` — server client
- `utils/supabase/client.ts` — browser client

## Unresolved Questions

- Danh sách hashtag chính thức (bao nhiêu, tên cụ thể)?
- `award_value` là số tiền, voucher, hay trophy? Text hay numeric?
- Nomination period: 1 hay nhiều period / năm?
- Nominations có public (ai đề cử ai) hay chỉ hiện aggregate count?
