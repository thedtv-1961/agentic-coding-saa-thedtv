---
status: draft
authored_by: takumi
created: 2026-06-28
lang: vi
---

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| **Anonymous kudos — sender leak qua SELECT** | User query `SELECT * FROM kudos WHERE id = X` khi `is_anonymous = true` | `sender_id = NULL` — không có thông tin nào trả về; RLS không cần mask thêm vì data không tồn tại | high |
| **Anonymous kudos — sender leak qua JOIN** | Application JOIN kudos với profiles ON sender_id | NULL JOIN → không trả về sender row; safe by design | high |
| **Anonymous kudos — sender leak qua audit_log** | Admin đọc `audit_logs.new_data` của kudos ẩn danh | `new_data.sender_id = null` — trigger chỉ snapshot row hiện tại, sender đã là NULL | high |
| **Hero level race condition — concurrent INSERT** | 2 kudos INSERT đồng thời cho cùng 1 receiver | Trigger `update_hero_level` dùng `SELECT COUNT(*)` trong transaction; Postgres row-level lock đảm bảo count nhất quán | medium |
| **Hero level không tự giảm** | Admin xóa kudos (nếu có cơ chế xóa trong tương lai) | Hero level hiện tại không có trigger AFTER DELETE — cần thêm trigger riêng hoặc block DELETE | medium |
| **Nomination ngoài period** | User submit nomination khi `now() > end_at` | Application kiểm tra P005 trước insert; nếu bypass, DB không có CHECK constraint thời gian — cần enforce ở application layer hoặc thêm DB function | high |
| **Duplicate nomination** | User submit nomination thứ 2 cho cùng award | UNIQUE `(award_id, nominator_id)` tại DB reject với `23505 unique_violation` | medium |
| **Self-nomination** | `nominee_id = auth.uid()` | CHECK `nominee_id <> nominator_id` tại DB reject với `23514 check_violation` | medium |
| **Nomination receiver đã nghỉ việc** | nominee_id → profiles.id của user đã bị soft-delete hoặc deactivated | Profiles không có soft-delete trong v1 — nếu profile bị xóa, ON DELETE CASCADE xóa nominations liên quan | low |
| **RLS bypass — anon role** | Request không có JWT (anon Supabase key) | Tất cả tables chỉ có policy cho `authenticated` role — anon nhận 0 rows hoặc permission denied | high |
| **Admin xem nominations** | Admin SELECT nominations | Policy cho admin (`role = 'admin'`) trả về tất cả rows kể cả nominator_id — cần đảm bảo UI admin không public kết quả này | medium |
| **Kudos content > 1000 chars** | INSERT kudos với content 1001 chars | CHECK `length(content) <= 1000` reject tại DB | low |
| **Kudos với 0 hashtag** | INSERT kudos_hashtags = 0 rows | DB không block (không có count constraint); application layer phải enforce min 1 hashtag | medium |
| **Kudos với > 5 hashtag** | INSERT 6 rows vào kudos_hashtags cho 1 kudos | DB không block; application layer enforce max 5 | medium |
| **Kudos với > 5 ảnh** | INSERT 6 rows vào kudos_images cho 1 kudos | DB không block; application layer enforce max 5 | low |
| **Duplicate hashtag trong 1 kudos** | INSERT `(kudos_id, hashtag_id)` trùng | PK `(kudos_id, hashtag_id)` reject | low |
| **Tạo profile khi đăng ký Google OAuth** | Trigger `handle_new_user` chạy, `raw_user_meta_data` thiếu `full_name` | `full_name` sẽ là NULL nếu không có metadata — cần fallback: dùng email prefix hoặc `display_name` | medium |
| **Xóa user khỏi auth.users** | `auth.users` DELETE → `profiles` ON DELETE CASCADE | Tất cả kudos của user (sender) SET NULL; kudos nhận được (receiver) CASCADE delete — mất dữ liệu recognition | high |
| **audit_logs bị INSERT block bởi RLS** | Trigger (service_role) insert vào audit_logs | Trigger chạy với SECURITY DEFINER hoặc service_role — bypass RLS user-level; cần confirm policy không chặn service_role | medium |
| **Nomination period overlap** | Admin tạo 2 periods cùng year với overlap date | Không có DB constraint chặn overlap; application layer phải validate hoặc thêm exclusion constraint | low |
