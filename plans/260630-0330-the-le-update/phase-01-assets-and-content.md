---
phase: "01"
title: "Download assets + update components"
status: completed
priority: P1
effort: "~1.5h"
---

# Phase 01 — Download assets + update components

## Context Links

- Design: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
- Figma file key: `9ypp4enmFmdK3YAFJLIu6C`
- Spec: `.momorph/contexts/specs/Thể lệ UPDATE/`
- Files to modify: `app/components/shared/the-le-content.tsx`, `app/components/shared/the-le-drawer.tsx`

## Key Design Values (từ node context)

| Property | Value |
|----------|-------|
| Panel background | `#00070C` |
| Panel width | 553px |
| Panel padding | `24px 40px 40px 40px` |
| Content gap | `24px` |
| Footer gap | `16px` |
| Footer height | `56px` |
| Yellow accent | `#FFEA9E` (brand accent, confirmed) |

## Nội dung chính xác (từ Figma design)

### Title
```
Thể lệ
```

### Section 1: Người nhận Kudos
**Heading**: `NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC`

**Intro**: "Dựa trên số lượng đồng đội gửi Kudos cho bạn, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile"

**Hero badges** (thresholds cụ thể):

| Badge | Threshold | Description |
|-------|-----------|-------------|
| New Hero | 1–4 người | Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn. |
| Rising Hero | 5–9 người | Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình. |
| Super Hero | 10–20 người | Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến. |
| Legend Hero | >20 người | Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình. |

### Section 2: Người gửi Kudos
**Heading**: `NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN`

**Body**: "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ♥ từ cộng đồng Sunner. Cứ mỗi 5 lượt ♥, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA."

**6 icons** (tên chính xác):
1. REVIVAL
2. TOUCH OF LIGHT
3. STAY GOLD
4. FLOW TO HORIZON
5. BEYOND THE BOUNDARY
6. ROOT FURTHER

**Footer text**: "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025."

### Section 3: Kudos Quốc Dân
**Heading**: `KUDOS QUỐC DÂN`

**Body**: "5 Kudos nhận về nhiều ♥ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần thưởng đặc biệt từ SAA 2025: Root Further."

## Implementation Steps

### Step 1: Download 6 collection icon images

Dùng MoMorph `get_figma_image` hoặc `get_media_file` để download 6 circular icon images.  
Save vào: `public/images/the-le/` với tên kebab-case:
- `revival.png`
- `touch-of-light.png`
- `stay-gold.png`
- `flow-to-horizon.png`
- `beyond-the-boundary.png`
- `root-further.png`

> **Fallback**: Nếu MoMorph/Figma trả về 401/500, dùng ảnh từ production CDN hoặc tạm thời dùng placeholder có tên icon (nhưng KHÔNG commit placeholder vào production).

### Step 2: Rewrite `the-le-content.tsx`

Rewrite toàn bộ file theo nội dung trên với:
- Background: `#00070C` (truyền qua parent drawer, content chỉ cần text/spacing)
- Section headings: `uppercase font-bold text-[#FFEA9E]` (yellow accent)
- Body text: `text-white`
- Hero badge pills: styled per badge color (green, blue, orange, yellow)
- Icon grid: 3 cột, circular images 80×80px
- Spacer đủ cho footer (không che nội dung cuối)

**Badge pill colors** (from Figma - inferred from visual):

| Badge | Pill style |
|-------|------------|
| New Hero | `bg-[#1B4A2A] text-[#4ADE80]` (green) |
| Rising Hero | `bg-[#1B2F4A] text-[#60A5FA]` (blue) |
| Super Hero | `bg-[#3B1F4A] text-[#C084FC]` (purple) |
| Legend Hero | `bg-[#4A3A00] text-[#FFEA9E]` (yellow) |

> Nếu màu pill không khớp visual sau khi screenshot → điều chỉnh trong Phase 02.

### Step 3: Update `the-le-drawer.tsx`

Thay đổi minimal:
- Panel background: `bg-white` → `bg-[#00070C]`
- Panel border (nếu có): remove hoặc dùng `border-white/10`
- Footer border: `border-gray-200` → `border-white/10`
- Footer background: `bg-white` → `bg-[#00070C]`
- "Đóng" button: `border-gray-300 text-gray-700 hover:bg-gray-50` → `border-white/30 text-white hover:bg-white/10`
- "Viết KUDOS" button: giữ `bg-yellow-400` — already correct

> Logic (scroll lock, Escape key, focus management) KHÔNG thay đổi.

## Todo List

- [x] Tạo `public/images/the-le/` directory
- [x] Download 6 collection icon images từ Figma/MoMorph
- [x] Rewrite `the-le-content.tsx` với nội dung + dark theme
- [x] Update `the-le-drawer.tsx` dark theme
- [x] Chạy `npm run build` để kiểm tra compile errors

## Success Criteria

- `the-le-content.tsx` hiển thị đúng 3 sections với nội dung từ Figma
- 6 icon images tải được, hiển thị circular
- Panel background dark `#00070C`
- Buttons "Đóng" và "Viết KUDOS" đúng style dark theme
- Build pass, không có TypeScript errors

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| MoMorph icon download fails | Fallback to placeholder với label, fix trước khi merge |
| Badge pill colors không khớp Figma chính xác | Screenshot + adjust trong Phase 02 |
| Content text có ký tự đặc biệt ♥ | Test render trước |
