# Phase 03 — Interactive Nav: Sticky Sidebar + Scroll Spy + Mobile Dropdown

## Overview
- **Priority**: P1
- **Status**: todo
- **Effort**: ~60 phút
- **Blocked by**: Phase 02 (cần `id` anchors trên các award sections)

## Context Links
- Plan: `plans/260628-1800-awards-page/plan.md`
- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
- Clarifications: sticky = YES, scroll spy = YES, mobile = dropdown select

## Key Insights

### Item C — Navigation Menu
- **Desktop**: Sidebar cố định bên trái, `position: sticky`, không scroll theo trang
- **Mobile**: Dropdown select — ẩn vào 1 select element, chọn → scroll đến section
- **Active state**: màu vàng `#FFEA9E` + gạch chân trên mục đang active
- **Scroll spy**: `IntersectionObserver` theo dõi 6 section `id`, cập nhật active khi section vào viewport
- **Click**: smooth scroll đến section tương ứng (`scrollIntoView({ behavior: 'smooth' })`)

### 6 Nav Items (theo thứ tự Figma)
| Item | Label | Target ID |
|------|-------|-----------|
| C.1 | Top Talent | `top-talent` |
| C.2 | Top Project | `top-project` |
| C.3 | Top Project Leader | `top-project-leader` |
| C.4 | Best Manager | `best-manager` |
| C.5 | Signature 2025 | `signature-2025-creator` |
| C.6 | MVP | `mvp` |

### Layout Two-Column
```
┌─────────────────────────────────────────────────┐
│ [sticky sidebar 240px] │ [award cards flex-1]   │
│   Top Talent  ←active  │                        │
│   Top Project          │  [D.1 Top Talent card] │
│   ...                  │  [D.2 Top Project]     │
│                        │  ...                   │
└─────────────────────────────────────────────────┘
```

## Requirements

**Functional:**
- Desktop: sidebar sticky `top-24` (dưới header), width cố định ~240px
- Mobile (< md): dropdown `<select>` thay cho sidebar, full-width, sticky top
- Click nav item → smooth scroll đến section đó, set active
- Scroll spy: khi user scroll đến section → nav item tương ứng tự động active
- Active style: `text-[#FFEA9E] underline font-bold`
- Inactive style: `text-white/70 hover:text-white`

**Non-functional:**
- **"use client"** — bắt buộc vì dùng `IntersectionObserver`, `useState`, `useEffect`
- Tách riêng nav component để không force cả page thành client
- Fallback graceful nếu JS chưa load: first item active by default

## Architecture

```
app/
  components/
    awards/
      awards-nav.tsx          ← "use client" — sidebar + mobile dropdown + scroll spy
  awards/
    page.tsx                  ← Compose: <AwardsNav> bên trái, <AwardsDetailList> bên phải
```

### Layout trong `page.tsx`

```tsx
<div className="max-w-7xl mx-auto px-6 py-16">
  <div className="flex gap-12 items-start">
    {/* Sticky sidebar — hidden on mobile */}
    <aside className="hidden md:block w-60 shrink-0">
      <AwardsNav />
    </aside>

    {/* Mobile dropdown — shown on mobile only */}
    <div className="md:hidden w-full sticky top-16 z-20 bg-zinc-950 py-3">
      <AwardsNav mobile />
    </div>

    {/* Award cards */}
    <div className="flex-1 min-w-0">
      <AwardsDetailList awards={awards} />
    </div>
  </div>
</div>
```

> Hoặc dùng 1 `<AwardsNav>` duy nhất tự handle responsive bên trong — linh hoạt tùy implementation.

## Related Code Files

**Đọc để tham khảo:**
- `app/components/home/awards-section.tsx` — `CATEGORY_ORDER`
- `types/awards.ts` — `AWARD_META` với slugs
- Phase 02 output: `app/components/awards/awards-detail-list.tsx`

**Tạo mới:**
- `app/components/awards/awards-nav.tsx`

**Sửa:**
- `app/awards/page.tsx` — wrap layout 2 cột, import `AwardsNav`

## Implementation Steps

1. **Tạo `awards-nav.tsx`** — Client Component:

   ```tsx
   "use client";
   import { useEffect, useState } from "react";
   import { AWARD_META } from "@/types/awards";

   const NAV_ITEMS = [
     { label: "Top Talent",          slug: "top-talent" },
     { label: "Top Project",         slug: "top-project" },
     { label: "Top Project Leader",  slug: "top-project-leader" },
     { label: "Best Manager",        slug: "best-manager" },
     { label: "Signature 2025",      slug: "signature-2025-creator" },
     { label: "MVP",                 slug: "mvp" },
   ] as const;
   ```

   - `useState<string>` cho `activeSlug` — default: `"top-talent"`
   - `useEffect`: setup `IntersectionObserver` cho 6 sections theo slug
     - `threshold: 0.3` — active khi 30% section visible
     - Cleanup observer khi unmount
   - Click handler: `document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })` + set active
   - **Desktop render**: `<nav>` với danh sách `<button>` (không phải `<a>` — scroll là JS)
   - **Mobile render**: `<select onChange>` với 6 `<option>` — onChange scroll + set active
   - Phân biệt mobile/desktop bằng prop hoặc CSS (`hidden md:block`)

2. **Update layout trong `app/awards/page.tsx`**:
   - Bọc `<AwardsSectionTitle>` + layout 2 cột trong `<div className="bg-zinc-950">`
   - Đặt `<AwardsNav>` trong `<aside className="hidden md:block sticky top-24 ...">` 
   - Đặt mobile nav trong `<div className="md:hidden sticky top-16 ...">` 

3. **Đảm bảo section `id` matching**:
   - Phase 02 đặt `id={slug}` trên mỗi `<section>` trong `awards-detail-list.tsx`
   - `slug` lấy từ `AWARD_META[award.category].slug`
   - Phải match chính xác với `NAV_ITEMS[i].slug`

## Todo

- [ ] Tạo `awards-nav.tsx` với scroll spy (`IntersectionObserver`)
- [ ] Implement desktop sidebar (danh sách buttons)
- [ ] Implement mobile dropdown (`<select>`)
- [ ] Active style: `text-[#FFEA9E] underline font-bold`
- [ ] Update `page.tsx` layout 2 cột với nav
- [ ] Test scroll spy: scroll thủ công → nav item tự active
- [ ] Test click nav: click item → smooth scroll đến section
- [ ] Test mobile dropdown: chọn option → scroll đến section
- [ ] Visual check desktop vs Figma

## Success Criteria
- Desktop: sidebar sticky, không scroll theo trang
- Scroll xuống section "Best Manager" → nav item "Best Manager" active (vàng + gạch chân)
- Click "MVP" trong nav → trang scroll mượt đến section MVP
- Mobile: dropdown hiển thị đúng 6 options, chọn → scroll đúng section
- Không có lỗi TypeScript hoặc hydration mismatch

## Risk Assessment
- **Medium**: Hydration mismatch nếu `IntersectionObserver` chạy SSR — cần guard `typeof window !== 'undefined'` hoặc dùng `useEffect` (đã đúng)
- **Medium**: Scroll spy threshold cần tune nếu cards có chiều cao khác nhau nhiều
- **Low**: Mobile dropdown style mặc định của browser — có thể dùng custom styled select hoặc accept browser default
