---
title: "Phase 2 — Homepage Sections (Hero, Root Further, Awards, Kudos)"
status: completed
priority: P1
effort: "~1.5h"
---

# Phase 2: Homepage Sections

## Context Links

- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
- Design items: 3.5 (Keyvisual), B1-B4 (Hero), C1-C2 (Awards), D1-D2 (Kudos)
- Reuse: `app/components/countdown/countdown-timer.tsx`, `utils/supabase/server.ts`

## Overview

Tạo các section components cho trang chủ. Awards là Server Component query từ Supabase. Các section còn lại static.

## Files to Create

| File | Mục đích | Type |
|------|---------|------|
| `app/components/home/hero-section.tsx` | Keyvisual BG + countdown + event info + CTAs | Server |
| `app/components/home/root-further-section.tsx` | B4 content block | Server |
| `app/components/home/awards-section.tsx` | C1 header + C2 award cards grid | Server |
| `app/components/home/award-card.tsx` | Individual award card (C2.1–C2.6) | Server |
| `app/components/home/kudos-section.tsx` | D1/D2 kudos promo | Server |

## Data Types

```ts
// types/awards.ts (hoặc inline trong awards-section.tsx nếu nhỏ)
export type Award = {
  id: string;
  category: 'top_talent' | 'top_project' | 'top_project_leader' | 'best_manager' | 'signature_creator' | 'mvp';
  title: string;
  description: string;
};

// Static mapping: category → image path + slug
export const AWARD_META: Record<Award['category'], { image: string; slug: string }> = {
  top_talent:         { image: '/images/awards/top-talent.png',         slug: 'top-talent' },
  top_project:        { image: '/images/awards/top-project.png',        slug: 'top-project' },
  top_project_leader: { image: '/images/awards/top-project-leader.png', slug: 'top-project-leader' },
  best_manager:       { image: '/images/awards/best-manager.png',       slug: 'best-manager' },
  signature_creator:  { image: '/images/awards/signature-creator.png',  slug: 'signature-2025-creator' },
  mvp:                { image: '/images/awards/mvp.png',                slug: 'mvp' },
};
```

**Note:** Award images (`/public/images/awards/*.png`) cần có sẵn. Nếu chưa có → dùng placeholder `/images/awards/placeholder.png` hoặc Next.js Image với fallback.

## Implementation Steps

### 1. Hero Section (`app/components/home/hero-section.tsx`)

```tsx
// Layout: full-viewport-height section, position relative
// Background: <Image src="/images/keyvisual-bg.jpg" fill objectFit="cover" /> + dark overlay
// Content (stacked center):
//   - Title "ROOT FURTHER" (large display font)
//   - <CountdownTimer targetDate={...} /> — reuse từ countdown page
//   - B1.2 "Coming soon" label (ẩn khi countdown = 0 — CountdownTimer tự xử lý)
//   - B2: Thời gian + Địa điểm (từ i18n)
//   - B3: 2 nút CTA ("ABOUT AWARDS" → /awards, "ABOUT KUDOS" → /kudos)
// targetDate: hardcode "2026-12-20T00:00:00+07:00" (same as app_settings seed)
```

**Lưu ý:** `CountdownTimer` là Client Component — chứa trong Server Component là OK.

### 2. Root Further Section (`app/components/home/root-further-section.tsx`)

```tsx
// Background: tối (bg-black hoặc bg-zinc-950)
// Decorative text: large "ROOT" / "FURTHER" (display font, opacity thấp)
// Body paragraphs: text trắng từ i18n key "home.root_further_body"
// Quote: "A tree with deep roots fears no storm" (i18n "home.root_further_quote")
// Responsive: text tự wrap, co nhỏ trên mobile
```

### 3. Awards Section (`app/components/home/awards-section.tsx`)

**Server Component** — query `awards` table.

```tsx
// Fetch từ Supabase:
const supabase = await createClient();
const { data: awards } = await supabase.from('awards').select('id,category,title,description').eq('year', 2025);

// Section header (C1):
//   - Caption: "Sun* annual awards 2025"
//   - Title: "Hệ thống giải thưởng" (từ i18n)
//   - Subtitle: "Các hạng mục sẽ được trao giải theo TOP..." (từ i18n)

// Award grid (C2):
//   - grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
//   - Mỗi item → <AwardCard award={award} />
```

### 4. Award Card (`app/components/home/award-card.tsx`)

```tsx
// Props: { award: Award }
// Layout: image (top, vuông bo góc) + title + description (2-line clamp) + "Chi tiết" link
// Image: dùng AWARD_META[award.category].image, fallback "/images/awards/placeholder.png"
// Link "Chi tiết" → `/awards#${AWARD_META[award.category].slug}`
// Hover: lift (translate-y-[-4px]) + glow (shadow-lg)
// Click toàn card → cùng route với "Chi tiết"
```

### 5. Kudos Section (`app/components/home/kudos-section.tsx`)

```tsx
// Layout: 2-column trên desktop (text trái, ảnh phải)
// Left:
//   - Label "Phong trào ghi nhận" (caption nhỏ)
//   - Title "Sun* Kudos" (heading lớn)
//   - KUDOS logo icon
//   - Body text từ i18n "home.kudos_body"
//   - Button "Chi tiết" → /kudos
// Right: ảnh minh họa Kudos ("/images/kudos-illustration.png")
// Mobile: stack vertical
```

## i18n Keys Cần Thêm

```json
// messages/vi.json
"home": {
  "hero_title": "ROOT FURTHER",
  "event_date_label": "Thời gian:",
  "event_date_value": "26/12/2025",
  "event_venue_label": "Địa điểm:",
  "event_venue_value": "Âu Cơ Art Center",
  "event_livestream": "Tường thuật trực tiếp qua sóng Livestream",
  "cta_awards": "ABOUT AWARDS",
  "cta_kudos": "ABOUT KUDOS",
  "root_further_body": "...",
  "root_further_quote": "A tree with deep roots fears no storm",
  "awards_caption": "Sun* annual awards 2025",
  "awards_title": "Hệ thống giải thưởng",
  "awards_subtitle": "Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất.",
  "award_detail": "Chi tiết",
  "kudos_label": "Phong trào ghi nhận",
  "kudos_title": "Sun* Kudos",
  "kudos_body": "...",
  "kudos_detail": "Chi tiết"
}
```

## Success Criteria

- [x] Hero section: background + countdown timer hoạt động + event info + 2 CTA buttons
- [x] Root Further section: text hiển thị đúng, decorative text làm nền
- [x] Awards section: fetch đúng 6 awards từ DB, render 3-col grid trên desktop
- [x] Award card: hover lift + glow, click dẫn đến `/awards#slug`
- [x] Kudos section: layout 2-col desktop, stack mobile
- [x] `npm run build` không lỗi

## Risk Assessment

- **Medium:** Award images chưa có → implement với fallback rõ ràng (colored placeholder), không để crash
- **Low:** CountdownTimer reuse — component đã test, chỉ thay targetDate prop
- **Low:** Supabase query trong Server Component — đã có pattern từ countdown page

## Notes

- Nếu `awards` table trả về empty (Supabase chưa start) → render empty grid, không crash
- `description` trong DB ngắn hơn spec — acceptable cho MVP, có thể update qua Studio sau
- `/awards`, `/kudos` routes chưa tồn tại → Link dùng `href="/awards"` vẫn OK (trang 404 tạm)
