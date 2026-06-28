---
title: "Phase 1 — Shared Components (Header, Footer, Widget Button)"
status: completed
priority: P1
effort: "~1.5h"
---

# Phase 1: Shared Components

## Context Links

- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
- Design items: A1 (Header), 7 (Footer), 6 (Widget Button)
- Reuse: `app/components/login/language-switcher.tsx`

## Overview

Tạo 3 shared components dùng chung cho trang chủ và các trang khác sau này.

## Files to Create

| File | Mục đích |
|------|---------|
| `app/components/shared/header.tsx` | Server Component wrapper (fetch user session) |
| `app/components/shared/header-nav.tsx` | Client Component (hamburger state, active link) |
| `app/components/shared/footer.tsx` | Server Component (static nav links + copyright) |
| `app/components/shared/widget-button.tsx` | Client Component (fixed FAB, placeholder) |

## Implementation Steps

### 1. Header (`app/components/shared/header.tsx`)

**Server Component** — fetch Supabase session để truyền user vào client nav.

```tsx
// Sticky header: position fixed top-0, z-50
// Background: nền tối bán trong suốt (bg-black/60 backdrop-blur)
// Layout: logo (left) | nav links (center) | actions (right)
// Actions: bell icon | language switcher | user avatar
```

Props truyền xuống `<HeaderNav>`:
- `userAvatarUrl?: string` — từ `profiles.avatar_url`
- Không cần `locale` — next-intl tự xử lý

**Lưu ý:** Import `LanguageSwitcher` từ `app/components/login/language-switcher.tsx` — tái dùng trực tiếp.

### 2. HeaderNav (`app/components/shared/header-nav.tsx`)

**Client Component** — cần `"use client"` vì:
- Mobile hamburger menu state (`useState`)
- Active link detection (`usePathname`)

```tsx
// Nav links: About SAA 2025 → /about, Awards Information → /awards, Sun* Kudos → /kudos
// Active state: màu vàng + underline (dùng pathname matching)
// Hamburger: visible khi < md breakpoint, mở drawer overlay
// Notification bell: icon button, disabled/placeholder (onClick = no-op for now)
// User avatar: Link href="/profile" nếu auth'd
```

### 3. Footer (`app/components/shared/footer.tsx`)

**Server Component** — hoàn toàn static.

```tsx
// Layout: logo (left) | nav links (center) | copyright (right)
// Mobile: stack vertical, logo top, links middle, copyright bottom
// Nav links: giống Header (About SAA 2025, Awards Information, Sun* Kudos, Tiêu chuẩn chung)
// Copyright: từ i18n key "common.copyright"
// Logo click → href="/" (scroll top)
```

### 4. Widget Button (`app/components/shared/widget-button.tsx`)

**Client Component** — fixed position.

```tsx
// Style: pill 105x64px, nền vàng (#F5C518 hoặc màu vàng SAA), bo tròn full
// Icons: pencil (left) | "/" separator | SAA icon (right)
// Position: fixed bottom-6 right-6, z-50
// onClick: placeholder console.log hoặc no-op
// Chỉ hiển thị khi user đã auth (prop isAuthenticated)
```

## i18n Keys Cần Thêm

```json
// messages/vi.json
"common": {
  "nav_about": "About SAA 2025",
  "nav_awards": "Awards Information",
  "nav_kudos": "Sun* Kudos",
  "nav_standards": "Tiêu chuẩn chung",
  "copyright": "Bản quyền thuộc về Sun* © 2025",
  "notification_label": "Thông báo",
  "language_label": "Ngôn ngữ",
  "account_label": "Tài khoản"
}

// messages/en.json — tương tự tiếng Anh
```

## Success Criteria

- [x] Header render đúng trên desktop: logo + 3 nav links + bell + lang + avatar
- [x] Header active state: link hiện tại có màu vàng + underline
- [x] Header mobile: nav links ẩn, hamburger icon hiện → click mở drawer
- [x] Footer render đúng: logo, 4 links, copyright
- [x] Widget Button: render pill vàng góc phải dưới
- [x] `npm run build` không lỗi

## Risk Assessment

- **Low:** Language switcher reuse — đã có sẵn, chỉ import
- **Medium:** Hamburger menu animation — dùng Tailwind transitions đơn giản
- **Low:** User avatar from Supabase — có thể null, dùng fallback icon

## Notes

- `Tiêu chuẩn chung` chưa có route riêng → href="#" hoặc `/` tạm thời
- Header không có `"use client"` — Server Component, truyền props xuống HeaderNav
- Tách header.tsx + header-nav.tsx để giữ file ≤ 200 dòng
