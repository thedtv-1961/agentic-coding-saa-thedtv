---
phase: "02"
title: "Build + visual validation"
status: completed
priority: P1
effort: "~30m"
---

# Phase 02 — Build + visual validation

## Context Links

- Design screenshot: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
- Files modified: `app/components/shared/the-le-content.tsx`, `app/components/shared/the-le-drawer.tsx`

## Implementation Steps

### Step 1: Build check

```bash
npm run build
npm run lint
```

Fix mọi TypeScript/ESLint error trước khi tiếp tục.

### Step 2: Visual validation với Playwright

1. Khởi động dev server: `npm run dev`
2. Mở browser → đăng nhập → điều hướng đến trang auth-protected bất kỳ
3. Click FAB → click "Thể Lệ" để mở drawer
4. Screenshot và so sánh từng section với Figma design:
   - Panel background `#00070C` ✓
   - Title "Thể lệ" đúng font/màu ✓
   - Section 1: 4 hero badge pills + text ✓
   - Section 2: 6 icons circular + tên ✓
   - Section 3: Kudos Quốc Dân ✓
   - Footer: "Đóng" (outline) + "Viết KUDOS" (yellow) ✓
5. Test scroll nội dung trong panel (không scroll toàn trang)
6. Test "Đóng" button → đóng drawer ✓
7. Test "Viết KUDOS" button → đóng drawer, mở modal KUDOS ✓
8. Test Escape key → đóng drawer ✓
9. Test click backdrop → đóng drawer ✓

### Step 3: Điều chỉnh nếu cần

Sau screenshot, nếu:
- Badge pill colors sai → cập nhật color values trong `the-le-content.tsx`
- Icon không hiển thị → kiểm tra path `public/images/the-le/` và `next/image` src
- Spacing sai → fine-tune padding/gap values

## Todo List

- [x] `npm run build` pass
- [x] `npm run lint` pass
- [x] Screenshot drawer mở → so sánh Figma
- [x] Test tất cả interactive behaviors (close, write kudos, Escape, backdrop)
- [x] Fix visual discrepancies nếu có

## Success Criteria (Definition of Done)

- [x] **UI** — Screenshot khớp Figma design: dark bg, đúng nội dung, đúng buttons
- [x] **Logic** — Đóng drawer, chuyển sang KUDOS modal, Escape key, backdrop click đều hoạt động
- [x] **Build pass** — `npm run build` không có lỗi
- [x] **Lint pass** — `npm run lint` không có lỗi
