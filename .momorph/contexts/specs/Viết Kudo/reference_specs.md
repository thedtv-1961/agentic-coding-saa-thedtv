# Reference Specs - Viết Kudo

**Screen:** Viết Kudo (screenId: ihQ26W78P2)
**Source:** get_related_design_items per item (limit=3)

---

## Item A — Gửi lời cám ơn và ghi nhận đến đồng đội

Không có related items.

---

## Item B — Chọn người nhận

Không có related items.

---

## Item C — Thanh công cụ định dạng (Chức năng)

### C.ref.1 — Button ghi nhận (screen khác)
- **itemId:** 2940:13449
- **No:** A.1
- **itemType:** text_form
- **name:** mms_A.1_Button ghi nhận
- **description:** Thanh nhập để mở dialog nhập lời cảm ơn. Click: Mở dialog gửi lời cảm ơn. Display: ô nhập dạng pill với placeholder 'Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?'; icon bút bên trái.

### C.ref.2 — Tìm kiếm sunner (B.7.3 screen khác)
- **itemId:** 2940:14833
- **No:** B.7.3
- **itemType:** text_form
- **name:** mms_B.7.3_Tìm kiếm sunner
- **validation:** maxLength=100; không bắt buộc
- **description:** Thanh tìm kiếm để tìm profile Sunner. Input: ô nhập placeholder 'Tìm kiếm'; icon kính lúp. Function: Gõ nhập từ khóa; Enter/Click icon thực hiện tìm kiếm.

### C.ref.3 — B.2 Search (screen hiện tại)
- **itemId:** I520:11647;520:9873
- **No:** B.2
- **itemType:** text_form
- **dataType:** string; required: true
- **validation:** Trường bắt buộc; autocomplete; tối thiểu 1 ký tự
- **description:** Trường tìm và chọn 'Người nhận' trong form kudo. Input: placeholder 'Tìm kiếm', icon dropdown bên phải. Function: autocomplete; click mục để chọn người nhận; khi rỗng hiển thị viền đỏ.

---

## Item D — Textarea lời cảm ơn

Không có related items.

---

## Item E — Trường Hashtag

Không có related items.

---

## Item F — Khung tải ảnh

Không có related items.

---

## Item G — Gửi ẩn danh

Không có related items.

---

## Item H — Thanh hành động (Hủy / Gửi)

Không có related items.
