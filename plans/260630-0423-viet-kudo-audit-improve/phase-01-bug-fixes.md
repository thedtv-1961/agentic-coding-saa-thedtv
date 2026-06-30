# Phase 01 — Bug Fixes + Missing UI

## Context Links

- Plan: `plans/260630-0423-viet-kudo-audit-improve/plan.md`
- MoMorph spec: `.momorph/contexts/specs/Viết Kudo/items_analysis.md`

## Overview

- **Priority**: P0 (bugs)
- **Status**: todo
- **Description**: Fix 3 gaps không ảnh hưởng kiến trúc — có thể làm trong 1 lần commit.

## Gaps cần fix

### G1 — Content field label bị broken

**File**: `app/components/kudos/viet-kudos-modal.tsx:200-209`

**Vấn đề**: Label hiển thị `{t("content_placeholder").slice(0, 10)}…` — đây là substring của placeholder text, không phải label.

**Fix**:
1. Thêm i18n key `content_label` vào `messages/vi.json` và `messages/en.json`
2. Thay `{t("content_placeholder").slice(0, 10)}…` bằng `{t("content_label")}`

```json
// messages/vi.json — thêm vào section "kudos"
"content_label": "Lời cảm ơn"
// messages/en.json
"content_label": "Message"
```

```tsx
// viet-kudos-modal.tsx — thay phần label
<span className="text-sm font-medium text-gray-700">
  {t("content_label")}
  <span className="text-red-500 ml-0.5">*</span>
</span>
```

### G2 — Link "Tiêu chuẩn cộng đồng" không render

**File**: `app/components/kudos/kudos-rich-text-editor.tsx`

**Vấn đề**: Spec Item C nói toolbar phải có link "Tiêu chuẩn cộng đồng" bên phải. i18n key `community_standards` tồn tại nhưng không được dùng.

**Fix**: Thêm link vào toolbar row, đẩy về bên phải bằng `ml-auto`:

```tsx
// Trong toolbar div, sau các TOOLBAR_BUTTONS
<a
  href="#"
  className="ml-auto text-xs text-blue-500 hover:underline whitespace-nowrap"
  target="_blank"
  rel="noopener noreferrer"
>
  {t("community_standards")}
</a>
```

> **Note**: Link target `#` là placeholder — cần hỏi product team URL thực nếu có.

### G4 — Submit button loading text không rõ ràng

**File**: `app/components/kudos/viet-kudos-modal.tsx:253`

**Vấn đề**: `{isSubmitting ? "..." : t("submit")}` — "..." không thân thiện.

**Fix**: Thêm i18n key `submitting` và thay:
```json
// messages/vi.json
"submitting": "Đang gửi..."
// messages/en.json
"submitting": "Sending..."
```
```tsx
{isSubmitting ? t("submitting") : t("submit")}
```

### G5 — Success toast thiếu data-testid

**File**: `app/components/shared/fab-controller.tsx:54`

**Vấn đề**: E2E test kiểm tra `page.getByTestId("success-toast")` nhưng div không có attribute này.

**Fix**:
```tsx
// Thêm data-testid vào div toast
<div
  data-testid="success-toast"
  role="status"
  aria-live="polite"
  className="fixed bottom-24 right-6 z-[80] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
>
  Kudos đã được gửi thành công!
</div>
```

## Todo

- [ ] Thêm `content_label` + `submitting` vào `messages/vi.json` + `messages/en.json`
- [ ] Fix label trong `viet-kudos-modal.tsx`
- [ ] Fix loading text trong `viet-kudos-modal.tsx`
- [ ] Thêm link "Tiêu chuẩn cộng đồng" vào `kudos-rich-text-editor.tsx`
- [ ] Thêm `data-testid="success-toast"` vào `fab-controller.tsx`

## Success Criteria

- [ ] Content field hiển thị "Lời cảm ơn*" thay vì truncated text
- [ ] Toolbar có link "Tiêu chuẩn cộng đồng" phía bên phải
- [ ] Submit button hiện "Đang gửi..." khi submitting
- [ ] `data-testid="success-toast"` tồn tại trong DOM khi success

## Next Steps

→ Phase 02: Link dialog UX
