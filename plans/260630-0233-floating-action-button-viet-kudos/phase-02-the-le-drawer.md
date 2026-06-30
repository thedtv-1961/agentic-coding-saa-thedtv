# Phase 02 — Thể Lệ Drawer (Right Slide-In)

## Context Links

- MoMorph Thể Lệ: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
- Spec: `.momorph/contexts/specs/Thể lệ UPDATE/`
- Phụ thuộc: Phase 01 (FAB callbacks `onRulesClick`)

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Drawer slide từ phải màn hình, hiển thị nội dung Thể Lệ SAA 2025 (HTML tĩnh). Đóng bằng nút "Đóng", click ngoài, hoặc Escape. Footer có nút "Viết KUDOS" → đóng drawer rồi mở Viết KUDOS modal.

## Key Insights

Theo spec (screenId `b1Filzi9i6`, frameId `3204:6051`):
- Drawer chiếm full chiều cao màn hình, slide từ phải vào
- Có backdrop overlay
- Scroll chỉ trong vùng content (không scroll cả trang)
- Nội dung HTML tĩnh (hardcode): tiêu đề "Thể lệ", mô tả, 4 cấp Hero badge, 6 icon bộ sưu tập, Kudos Quốc Dân
- Footer: nút "Đóng" (icon X + text, outlined) + nút "Viết KUDOS" (icon bút, nền vàng)
- Đóng drawer: click "Đóng", click backdrop, hoặc Escape
- "Viết KUDOS" trong footer: đóng drawer trước, rồi mở modal Viết KUDOS

## Requirements

- `"use client"` — cần state (isOpen), animation
- Props: `isOpen: boolean`, `onClose: () => void`, `onWriteKudos: () => void`
- Accessibility: focus trap khi drawer open, `aria-modal`, `role="dialog"`
- Đóng bằng Escape (`useEffect` + keydown listener)
- Backdrop: `bg-black/50` overlay, click → close
- Animation: `translate-x-full` → `translate-x-0` (slide in từ phải)

## Architecture

```
app/components/shared/
├── the-le-drawer.tsx          ← Drawer component
├── the-le-content.tsx         ← Nội dung HTML tĩnh (tách ra để giữ file ≤200 dòng)
```

## Related Code Files

**Create:**
- `app/components/shared/the-le-drawer.tsx`
- `app/components/shared/the-le-content.tsx`

## Implementation Steps

1. Fetch Figma design với MCP `momorph__get_frame` screenId `b1Filzi9i6` để lấy layout chính xác
2. Tạo `the-le-content.tsx` — HTML tĩnh với nội dung Thể Lệ:
   - Tiêu đề "Thể lệ"
   - Mô tả chương trình SAA 2025
   - 4 cấp Hero: New Hero / Rising Hero / Super Hero / Legend Hero + điều kiện
   - 6 icon bộ sưu tập: REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER (dùng ảnh tĩnh từ `public/images/collections/`)
   - Thông tin Kudos Quốc Dân
3. Tạo `the-le-drawer.tsx`:
   ```tsx
   // Drawer slide từ phải
   <div className={`fixed inset-y-0 right-0 w-[480px] max-w-full bg-white z-[60]
     transform transition-transform duration-300 ease-in-out
     ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
     {/* scroll vùng content */}
     <div className="overflow-y-auto h-full pb-24">
       <TheLeDrqawerContent />
     </div>
     {/* footer fixed */}
     <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 bg-white border-t">
       <button onClick={onClose}>× Đóng</button>
       <button onClick={onWriteKudos} className="bg-yellow-400">✏ Viết KUDOS</button>
     </div>
   </div>
   {/* Backdrop */}
   {isOpen && <div className="fixed inset-0 bg-black/50 z-[59]" onClick={onClose} />}
   ```
4. Escape key handler:
   ```tsx
   useEffect(() => {
     if (!isOpen) return;
     const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
     document.addEventListener('keydown', handleEsc);
     return () => document.removeEventListener('keydown', handleEsc);
   }, [isOpen, onClose]);
   ```
5. Body scroll lock khi drawer open: `document.body.style.overflow = 'hidden'` khi open, restore khi close
6. i18n: thêm keys `drawer.close`, `drawer.write_kudos` vào messages

## Todo

- [ ] Fetch Figma design để xác nhận layout, màu sắc, width drawer
- [ ] Tạo `the-le-content.tsx` với nội dung tĩnh đầy đủ
- [ ] Tạo `the-le-drawer.tsx` với animation slide-in
- [ ] Backdrop + click-outside close
- [ ] Escape key close
- [ ] Body scroll lock
- [ ] Footer "Viết KUDOS" → callback `onWriteKudos`
- [ ] Thêm i18n keys
- [ ] Kiểm tra visual với screenshot

## Success Criteria

- [ ] Drawer slide từ phải với animation mượt
- [ ] Nội dung Thể Lệ hiển thị đủ, scroll trong drawer
- [ ] Đóng bằng "Đóng" / click backdrop / Escape
- [ ] "Viết KUDOS" trong footer: đóng drawer, mở modal Viết KUDOS
- [ ] Không scroll body khi drawer đang mở

## Risk Assessment

- **Drawer width**: Figma chưa rõ (spec nói "full chiều cao") — default 480px, adjust sau khi xem Figma

## Next Steps

→ Phase 06 (Integration): wire `onRulesClick` từ FAB → open drawer
