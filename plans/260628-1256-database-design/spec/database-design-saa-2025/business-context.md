---
status: draft
authored_by: takumi
created: 2026-06-28
lang: vi
---

## Why It Matters

SAA 2025 (Sun* Awards & Achievements) là nền tảng recognition nội bộ của Sun*, phục vụ hai mục tiêu chính:

1. **Văn hóa ghi nhận liên tục**: Kudos cho phép bất kỳ thành viên nào ghi nhận đóng góp của đồng nghiệp mọi lúc, không cần chờ đến chu kỳ review. Điều này xây dựng văn hóa tích cực và tăng gắn kết nội bộ.

2. **Giải thưởng cuối năm**: Awards SAA 2025 là sự kiện thường niên — top talent, top project, best manager, v.v. — được bầu chọn bởi chính nội bộ thông qua nomination/voting, thay vì chỉ quyết định từ ban lãnh đạo.

Database layer phải đảm bảo: dữ liệu recognition **không thể bị chỉnh sửa hoặc xóa**, danh tính người gửi kudos ẩn danh **tuyệt đối an toàn tại tầng DB**, và quá trình bầu chọn **minh bạch về tổng số nhưng bảo vệ quyền riêng tư của người đề cử**.

## Who Uses It

| Vai trò | Quyền truy cập |
|---------|----------------|
| **User** (thành viên Sun*) | Gửi kudos, nhận kudos, xem feed, đề cử người khác vào giải thưởng |
| **Admin** | Xem toàn bộ dữ liệu (kể cả audit log), seed hashtag/awards, quản lý nomination period, xem báo cáo bầu chọn |
| **System / Trigger** | Tự động cập nhật hero_level, ghi audit_logs — không phải human actor |

Không có vai trò "manager" hay "HR" riêng biệt trong v1. Admin là superuser duy nhất.

## What They Do

### Kudos

- Thành viên gửi kudos bất kỳ lúc nào trong năm.
- Kudos **immutable** sau khi gửi — không edit, không delete (kể cả admin). Ghi nhận chân thực.
- Anonymous kudos: người gửi chọn ẩn danh → `sender_id = NULL` tại DB. Không có cách nào truy vết người gửi kể cả admin.
- Mỗi kudos gắn 1–5 hashtag từ master list do admin seed (không có hashtag tự do — đảm bảo consistency).
- Đính kèm tối đa 5 ảnh (lưu URL Supabase Storage).

### Hero Level — Gamification

Hero level là cơ chế gamification nhẹ, tạo động lực nhận kudos:

| Kudos nhận được | Hero Level |
|----------------|------------|
| 1–4 | `new_hero` |
| 5–9 | `rising_hero` |
| 10–20 | `super_hero` |
| >20 | `legend_hero` |

Level tự động cập nhật qua DB trigger sau mỗi kudos mới — không cần application code tính lại. Hiển thị như badge trên profile.

**Lý do chọn trigger thay vì computed column**: Hero level cần persist để dễ query/sort/filter. Computed column trong Postgres không index được nếu dùng subquery; trigger giải quyết vấn đề này.

### Nominations & Voting

Trong nomination period (thời gian quy định hàng năm):

- User đề cử 1 đồng nghiệp cho mỗi hạng mục giải thưởng (không tự đề cử).
- Nomination immutable sau khi submit — không thay đổi được lựa chọn.
- Kết quả hiển thị dạng aggregate (số lượng nominations / hạng mục) — không lộ ai đề cử ai với user thường.
- Admin xem được chi tiết để finalize kết quả.

**Business rules cho nominations/voting:**
- **BL004**: Chỉ nhận nomination trong `nomination_periods.start_at … end_at`.
- **BL005**: `nominee_id <> nominator_id` — không tự bầu cho mình.
- **BL006**: Mỗi user chỉ có 1 nomination mỗi hạng mục — tránh vote nhiều lần.
- **BL007**: 6 hạng mục awards là cố định cho năm 2025; không thêm/sửa trong runtime.

### Audit Log

Mọi INSERT quan trọng (kudos, nominations) được ghi vào `audit_logs` qua trigger. Mục đích:
- Truy vết sự cố (ai làm gì, khi nào).
- Không bao giờ xóa hay sửa audit log (append-only).
- Admin-only access.
