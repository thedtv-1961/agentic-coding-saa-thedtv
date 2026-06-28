---
title: "Phase 3 — Page Assembly + Auth Guard + i18n"
status: completed
priority: P1
effort: "~0.5h"
---

# Phase 3: Page Assembly + Auth Guard + i18n

## Context Links

- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
- Depends on: Phase 1 (shared components), Phase 2 (section components)

## Overview

Lắp ráp trang chủ hoàn chỉnh bằng cách ghép tất cả components từ Phase 1 và 2. Thêm auth guard vào middleware. Hoàn thiện i18n messages.

## Files to Modify

| File | Thay đổi |
|------|---------|
| `app/page.tsx` | Replace placeholder với full homepage layout |
| `middleware.ts` | Thêm auth guard cho route `/` |
| `messages/vi.json` | Thêm keys `common.*` và `home.*` |
| `messages/en.json` | Thêm keys `common.*` và `home.*` (tiếng Anh) |

## Implementation Steps

### 1. Auth Guard trong Middleware (`middleware.ts`)

Thêm redirect unauthenticated users về `/login` khi truy cập `/`:

```ts
// Sau block PRELAUNCH gate, trước block login redirect:
const protectedRoutes = ['/'];
const isProtectedRoute = protectedRoutes.some(r => pathname === r || pathname.startsWith(r + '/'));

if (isProtectedRoute && !isAuthRoute && !isCountdownRoute) {
  // Check session
  const supabase = createServerClient(...);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**Lưu ý:** Tránh duplicate Supabase client — tách thành helper hoặc dùng cùng instance với existing login check.

### 2. Homepage Page (`app/page.tsx`)

```tsx
// Server Component — không cần "use client"
import Header from '@/app/components/shared/header';
import HeroSection from '@/app/components/home/hero-section';
import RootFurtherSection from '@/app/components/home/root-further-section';
import AwardsSection from '@/app/components/home/awards-section';
import KudosSection from '@/app/components/home/kudos-section';
import Footer from '@/app/components/shared/footer';
import WidgetButton from '@/app/components/shared/widget-button';

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <RootFurtherSection />
      <AwardsSection />
      <KudosSection />
      <Footer />
      <WidgetButton />
    </main>
  );
}
```

### 3. i18n Messages

Thêm đầy đủ các keys đã xác định trong Phase 1 và Phase 2 vào cả 2 file:

**`messages/vi.json`** — thêm objects `common` và `home` (xem spec keys từ phase-01 và phase-02).

**`messages/en.json`** — dịch tương ứng tiếng Anh:
```json
"common": {
  "nav_about": "About SAA 2025",
  "nav_awards": "Awards Information",
  "nav_kudos": "Sun* Kudos",
  "nav_standards": "Common Standards",
  "copyright": "Copyright © Sun* 2025",
  ...
},
"home": {
  "hero_title": "ROOT FURTHER",
  "event_date_label": "Date:",
  "event_date_value": "December 26, 2025",
  "event_venue_label": "Venue:",
  "event_venue_value": "Âu Cơ Art Center",
  ...
}
```

## Success Criteria

- [x] `npm run build` không lỗi
- [x] Truy cập `/` khi chưa auth → redirect `/login`
- [x] Truy cập `/` khi đã auth → render đủ 6 sections
- [x] Không còn Next.js default placeholder content
- [x] i18n: không có key missing, cả EN và VI đều có đủ keys

## Risk Assessment

- **Medium:** Auth guard trong middleware — cẩn thận không tạo infinite redirect loop
  - Mitigate: kiểm tra `isAuthRoute` trước, đảm bảo `/login` không bị intercept
- **Low:** i18n keys missing → next-intl sẽ warn ở console, không crash

## Notes

- `WidgetButton` là Client Component nhưng vẫn import được trong Server Component
- Middleware auth check có thể gây tăng latency nhẹ (1 Supabase call extra) — acceptable
- Tất cả `/awards`, `/kudos`, `/about` links trên trang chủ → tạm thời 404, sẽ implement sau
