# Phase 04 — Viết KUDOS Modal (Form UI + Validation)

## Context Links

- MoMorph Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- Spec: `.momorph/contexts/specs/Viết Kudo/`
- Phụ thuộc: Phase 03 (`uploadKudosImage`, `validateImageFile`, `MAX_IMAGES`)

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Modal overlay form Viết KUDOS đầy đủ: recipient autocomplete, rich text textarea, hashtag picker (dropdown), image upload (max 5), anonymous toggle, nút Hủy + Gửi.

## Key Insights

Form fields (từ spec `ihQ26W78P2`):
| Field | Required | Constraint |
|-------|----------|------------|
| Người nhận (B) | ✅ | Autocomplete từ `profiles` table |
| Nội dung (D) | ✅ | Rich text, max 1000 ký tự |
| Hashtag (E) | ✅ | Min 1, max 5, từ `hashtags` table |
| Ảnh (F) | ❌ | Max 5, JPG/PNG/WEBP, max 5MB/ảnh |
| Gửi ẩn danh (G) | ❌ | Boolean toggle; khi bật → `sender_id = null` |

Validation:
- Người nhận trống → "Vui lòng chọn người nhận"
- Nội dung trống → "Vui lòng nhập nội dung lời cảm ơn"
- Hashtag = 0 → "Vui lòng thêm ít nhất 1 hashtag"
- Hashtag > 5 → "Tối đa 5 hashtag" (UI ẩn nút "+" khi đủ 5)
- Ảnh > 5 → ẩn nút "+ Image"
- Nút "Gửi" disabled cho đến khi người nhận + nội dung + ≥1 hashtag hợp lệ

Rich text toolbar (C): Bold / Italic / Strikethrough / Ordered list / Link / Quote
- Dùng `contentEditable` div hoặc `document.execCommand` (simple) — **không** cần editor library nặng
- "@" mention: hiển thị hint text "Bạn có thể '@ + tên' để nhắc đồng nghiệp" (chỉ hint, không autocomplete mention trong scope này)

## Architecture

```
app/components/kudos/
├── viet-kudos-modal.tsx          ← Modal container + form state
├── kudos-recipient-field.tsx     ← Autocomplete người nhận
├── kudos-rich-text-editor.tsx    ← Toolbar + contentEditable textarea
├── kudos-hashtag-field.tsx       ← Hashtag picker chips
├── kudos-image-upload-field.tsx  ← Image thumbnails + add/remove
├── kudos-anonymous-toggle.tsx    ← Checkbox/toggle gửi ẩn danh
```

Form state shape:
```ts
interface KudosFormState {
  recipientId: string;
  recipientName: string;
  content: string;       // HTML từ rich text editor
  hashtagIds: string[];
  imageFiles: File[];    // trước khi upload
  imageUrls: string[];   // sau khi upload (public URLs)
  isAnonymous: boolean;
}
```

## Related Code Files

**Create:**
- `app/components/kudos/viet-kudos-modal.tsx`
- `app/components/kudos/kudos-recipient-field.tsx`
- `app/components/kudos/kudos-rich-text-editor.tsx`
- `app/components/kudos/kudos-hashtag-field.tsx`
- `app/components/kudos/kudos-image-upload-field.tsx`
- `app/components/kudos/kudos-anonymous-toggle.tsx`

**Read for context:**
- `app/lib/kudos/image-upload.ts` (Phase 03)

## Implementation Steps

1. Fetch Figma design với MCP `momorph__get_frame` screenId `ihQ26W78P2`
2. Tạo `viet-kudos-modal.tsx`:
   - Props: `isOpen: boolean`, `onClose: () => void`
   - `"use client"`, useState cho `KudosFormState`
   - Modal overlay: `fixed inset-0 z-[70] flex items-center justify-center bg-black/50`
   - Modal panel: `bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6`
   - Tiêu đề: "Gửi lời cám ơn và ghi nhận đến đồng đội"
   - Escape + click backdrop → `onClose` (hỏi confirm nếu form đã có data)
3. Tạo `kudos-recipient-field.tsx`:
   - Input với debounce 300ms → gọi server action `searchProfiles(query)`
   - Dropdown với kết quả (tên + avatar nếu có)
   - Chọn → set `recipientId` + `recipientName`, đóng dropdown
   - Error state: viền đỏ + text lỗi khi submit mà trống
4. Tạo `kudos-rich-text-editor.tsx`:
   - Toolbar: 6 nút (B/I/S/ol/link/quote) dùng `document.execCommand`
   - `contentEditable` div với `min-h-[120px]`, placeholder bằng CSS `:empty::before`
   - Character counter: `{length}/1000` — đỏ khi > 1000
   - Sync value qua `onInput` → `innerHTML`
5. Tạo `kudos-hashtag-field.tsx`:
   - Load hashtags từ server action `getHashtags()` lúc mount
   - Dropdown chọn hashtag, render chip sau khi chọn
   - Chip có nút × xóa
   - Ẩn nút "+" khi đủ 5
6. Tạo `kudos-image-upload-field.tsx`:
   - Import `uploadKudosImage`, `validateImageFile`, `MAX_IMAGES` từ Phase 03
   - `<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>`
   - Click "+ Image" → trigger input click
   - Validate mỗi file → show error toast nếu invalid
   - Upload lên Storage → thêm URL vào state
   - Thumbnail grid với nút × xóa
   - Ẩn nút "+ Image" khi đủ `MAX_IMAGES`
7. Tạo `kudos-anonymous-toggle.tsx`:
   - Checkbox + label "Gửi lời cám ơn và ghi nhận ẩn danh"
   - Toggle state `isAnonymous`
8. Footer buttons:
   - "Hủy" (×): `onClose()` — nếu form có data → confirm dialog
   - "Gửi" (disabled logic): `!recipientId || !content || hashtagIds.length === 0`
   - Loading state trên nút "Gửi" khi đang submit
9. i18n: thêm tất cả labels, placeholders, error messages vào `messages/vi.json` + `messages/en.json`

## Todo

- [ ] Fetch Figma design để xác nhận layout modal
- [ ] Tạo `viet-kudos-modal.tsx` (container + form state)
- [ ] Tạo `kudos-recipient-field.tsx` (autocomplete)
- [ ] Tạo `kudos-rich-text-editor.tsx` (toolbar + contentEditable)
- [ ] Tạo `kudos-hashtag-field.tsx` (chip picker)
- [ ] Tạo `kudos-image-upload-field.tsx` (upload + thumbnail)
- [ ] Tạo `kudos-anonymous-toggle.tsx`
- [ ] Validation logic + error states
- [ ] "Gửi" button disabled state
- [ ] i18n keys đầy đủ
- [ ] Kiểm tra visual với screenshot

## Success Criteria

- [ ] Modal mở/đóng đúng
- [ ] Recipient autocomplete search hoạt động
- [ ] Rich text toolbar bold/italic/v.v. tác dụng
- [ ] Hashtag min 1, max 5 — nút ẩn đúng lúc
- [ ] Image upload validate format + size, thumbnail hiển thị
- [ ] Nút "Gửi" disabled đúng khi thiếu required fields
- [ ] Anonymous toggle hoạt động

## Risk Assessment

- **`document.execCommand` deprecated**: vẫn hoạt động tốt trên modern browsers; nếu cần thay thế dùng Selection API — nhưng YAGNI cho scope này
- **Autocomplete debounce**: cần tránh quá nhiều request Supabase — debounce 300ms là đủ
- **contentEditable và React**: React không quản lý `innerHTML` trực tiếp — dùng `useRef` + sync thủ công qua `onInput`

## Next Steps

→ Phase 05 (Server Actions): connect `searchProfiles`, `getHashtags`, `submitKudos` vào form
