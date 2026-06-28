---
status: draft
authored_by: takumi
created: 2026-06-28
lang: vi
---

## Screen List

Không có màn hình trực tiếp — đây là DB layer (backend data layer).

Feature này cung cấp schema, RLS policies, triggers, và seed data. UI screens sẽ được thiết kế trong các feature riêng (Kudos Feed, Awards Page, Profile, Admin Dashboard).

---

## API / Query Patterns

Các query patterns mà UI layers sẽ cần từ DB layer này.

### P001 — Lấy kudos feed (chronological)

```sql
SELECT
  k.id, k.content, k.is_anonymous, k.created_at,
  k.sender_id,               -- NULL nếu ẩn danh
  receiver.full_name  AS receiver_name,
  receiver.avatar_url AS receiver_avatar,
  receiver.hero_level AS receiver_hero_level,
  ARRAY_AGG(h.name)   AS hashtags
FROM kudos k
JOIN profiles receiver ON receiver.id = k.receiver_id
LEFT JOIN kudos_hashtags kh ON kh.kudos_id = k.id
LEFT JOIN hashtags h ON h.id = kh.hashtag_id
GROUP BY k.id, receiver.full_name, receiver.avatar_url, receiver.hero_level
ORDER BY k.created_at DESC
LIMIT 20 OFFSET $1;
```

*Lưu ý:* Khi `is_anonymous = true`, `sender_id` đã là NULL — không cần JOIN profiles cho sender.

---

### P002 — Profile + hero level + kudos count

```sql
SELECT
  p.id, p.full_name, p.avatar_url, p.role, p.hero_level,
  COUNT(k.id) AS kudos_received
FROM profiles p
LEFT JOIN kudos k ON k.receiver_id = p.id
WHERE p.id = $1
GROUP BY p.id;
```

---

### P003 — Hashtag list (cho dropdown khi tạo kudos)

```sql
SELECT id, name FROM hashtags ORDER BY name ASC;
```

---

### P004 — Awards list + nomination count per award

```sql
SELECT
  a.id, a.category, a.title, a.description,
  a.recipient_count, a.award_value,
  COUNT(n.id) AS nomination_count
FROM awards a
LEFT JOIN nominations n ON n.award_id = a.id
WHERE a.year = 2025
GROUP BY a.id
ORDER BY a.title;
```

---

### P005 — Kiểm tra nomination period còn hiệu lực

```sql
SELECT id, start_at, end_at
FROM nomination_periods
WHERE year = 2025
  AND now() BETWEEN start_at AND end_at
LIMIT 1;
```

---

### P006 — Submit nomination (RPC / application-layer insert)

```sql
INSERT INTO nominations (period_id, award_id, nominator_id, nominee_id, reason)
VALUES ($1, $2, auth.uid(), $3, $4);
```

*Constraint `(award_id, nominator_id)` UNIQUE tự reject duplicate tại DB.*

---

### P007 — Kudos images cho 1 kudos

```sql
SELECT url, order_index
FROM kudos_images
WHERE kudos_id = $1
ORDER BY order_index ASC;
```

---

### P008 — Leaderboard nominees (admin view)

```sql
SELECT
  p.full_name, p.avatar_url,
  a.title AS award_title,
  COUNT(n.id) AS votes
FROM nominations n
JOIN profiles p ON p.id = n.nominee_id
JOIN awards a ON a.id = n.award_id
WHERE n.period_id = $1
GROUP BY p.id, p.full_name, p.avatar_url, a.id, a.title
ORDER BY a.title, votes DESC;
```

---

### P009 — App settings (countdown date)

```sql
SELECT value FROM app_settings WHERE key = 'countdown_date';
```

---

## User Journey

DB layer không trực tiếp drive user journey. Tham chiếu feature specs UI:

1. **Kudos Flow**: User vào Feed → nhấn "Gửi Kudos" → chọn receiver, nhập nội dung, chọn hashtag, upload ảnh → submit → trigger cập nhật hero_level receiver.
2. **Awards / Nomination Flow**: User vào Awards page → chọn hạng mục → chọn nominee → submit (chỉ trong nomination period).
3. **Profile Flow**: User xem profile → thấy hero_level badge + số kudos nhận.
