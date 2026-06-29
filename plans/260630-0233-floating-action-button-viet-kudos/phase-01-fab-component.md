# Phase 01 — FAB Component (Collapsed/Expanded + Animation)

## Context Links

- MoMorph Screen 1: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/_hphd32jN2
- MoMorph Screen 2: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h
- Spec Screen 1: `.momorph/contexts/specs/Floating Action Button - phim nổi chức năng/`
- Spec Screen 2: `.momorph/contexts/specs/Floating Action Button - phim nổi chức năng 2/`

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Refactor `widget-button.tsx` thành FAB đầy đủ với 2 trạng thái: collapsed (Widget Button) và expanded (3 sub-buttons). Animation expand/collapse.

## Key Insights

- Screen 1 = trạng thái collapsed: Widget Button 41×32px nền vàng (`#FFEA9E` hoặc yellow-400), icon bút + "/" + icon SAA. Fixed bottom-right.
- Screen 2 = trạng thái expanded: hiện 3 button: **Thể Lệ** (149×64px, nền vàng nhạt), **Viết KUDOS** (nền vàng, shadow), **Hủy ×** (hình tròn 56×56px, màu đỏ, icon × trắng).
- Animation mở: 2 sub-button xuất hiện từ dưới lên với slide + fade.
- Animation đóng (click ×): sub-buttons ẩn, quay về collapsed.
- Nút × chỉ hiện khi FAB đang expanded.

## Requirements

- `"use client"` — cần state management (useState) cho collapsed/expanded
- Position: `fixed bottom-6 right-6 z-50`
- Collapsed: button vàng, icon bút + "/" + text "SAA" (hoặc icon SAA)
- Expanded: hiển thị 3 button dạng column (từ dưới lên: Hủy → Viết KUDOS → Thể Lệ hoặc ngược lại, xem Figma)
- Prop callbacks: `onRulesClick`, `onWriteKudosClick` để cha inject behavior (drawer, modal)

## Architecture

```
app/components/shared/
├── widget-button.tsx          ← refactor thành FloatingActionButton
├── fab-sub-button.tsx         ← extracted sub-button (reusable)
```

Component tree:
```
FloatingActionButton (state: isExpanded)
├── [collapsed] CollapsedButton → onClick: setIsExpanded(true)
├── [expanded] SubButton "Thể Lệ" → onClick: onRulesClick()
├── [expanded] SubButton "Viết KUDOS" → onClick: onWriteKudosClick()
└── [expanded] CancelButton (×) → onClick: setIsExpanded(false)
```

## Related Code Files

**Modify:**
- `app/components/shared/widget-button.tsx` — refactor toàn bộ thành FAB đầy đủ

**Create:**
- `app/components/shared/fab-sub-button.tsx` — sub-button component tái sử dụng

## Implementation Steps

1. Đọc Figma design với MCP `momorph__get_frame` cho cả 2 screenId để lấy màu sắc và kích thước chính xác
2. Refactor `widget-button.tsx`:
   - Thêm `useState<boolean>(false)` cho `isExpanded`
   - Props: `onRulesClick: () => void`, `onWriteKudosClick: () => void`
   - Render collapsed button khi `!isExpanded`
   - Render expanded group khi `isExpanded`
3. Tạo `fab-sub-button.tsx` với props: `icon`, `label`, `onClick`, `variant: 'primary' | 'secondary' | 'cancel'`
4. Animation với Tailwind `transition-all` + `animate-` hoặc CSS keyframes trong `globals.css`:
   - Sub-buttons: `opacity-0 translate-y-4` → `opacity-100 translate-y-0` với delay stagger
5. Visual spec:
   - Collapsed: `w-[105px] h-16 rounded-full bg-yellow-400` (giữ như cũ + cải thiện icon)
   - Thể Lệ sub-button: `w-[149px] h-16 rounded-xl bg-yellow-100` (nền vàng nhạt)
   - Viết KUDOS sub-button: `bg-yellow-400 shadow-lg rounded-xl`
   - Cancel: `w-14 h-14 rounded-full bg-red-600 text-white` (×)
6. i18n: thêm keys `fab.rules_label`, `fab.write_kudos_label`, `fab.cancel_label` vào `messages/vi.json` + `messages/en.json`
7. Keyboard: click ngoài vùng FAB khi expanded → collapse (useRef + click-outside listener)

## Todo

- [ ] Fetch Figma design với MCP để xác nhận màu sắc, kích thước chính xác
- [ ] Refactor `widget-button.tsx` với 2 trạng thái
- [ ] Tạo `fab-sub-button.tsx`
- [ ] Implement animation expand/collapse
- [ ] Thêm i18n keys
- [ ] Click-outside để collapse
- [ ] Chụp screenshot kiểm tra visual

## Success Criteria

- [ ] FAB hiển thị ở bottom-right trên tất cả trang
- [ ] Click Widget Button → 3 sub-buttons xuất hiện với animation
- [ ] Click × → thu gọn về collapsed
- [ ] Click ngoài → thu gọn
- [ ] Animation mượt mà (không giật)
- [ ] Các sub-buttons gọi đúng callbacks `onRulesClick`, `onWriteKudosClick`

## Risk Assessment

- **Visual mismatch**: Figma icon SAA và icon bút có thể khác SVG placeholder hiện tại → cần dùng MCP lấy đúng asset
- **Animation complexity**: Stagger animation trong Tailwind cần custom delay classes — fallback là dùng inline style `animationDelay`

## Next Steps

→ Phase 02 (Thể Lệ Drawer): cần callback `onRulesClick` từ phase này
→ Phase 04 (Viết KUDOS Modal): cần callback `onWriteKudosClick`
