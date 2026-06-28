---
title: "Homepage SAA 2025"
description: "Trang chủ SAA 2025: Header sticky/hamburger, Hero/Keyvisual, Root Further, Awards grid (dynamic từ DB), Kudos promo, Footer, Widget Button. Auth-protected."
status: completed
priority: P1
effort: "~4h"
branch: home_page
tags: [ui, homepage, awards, i18n, e2e]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-28
---

# Homepage SAA 2025

## Overview

- **Screen**: Homepage SAA | screenId: `i87tDx10uM` | fileKey: `9ypp4enmFmdK3YAFJLIu6C`
- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

Trang chủ chính của SAA 2025, protected bởi auth. Bao gồm 7 sections:

| Section | Items | Status |
|---------|-------|--------|
| Header (A1) | Sticky nav, hamburger mobile, lang switcher, user avatar | ✅ |
| Hero/Keyvisual (3.5, B1-B4) | Background, countdown, event info, CTAs, Root Further | ✅ |
| Awards (C1-C2) | Section header + 6 award cards từ DB | ✅ |
| Kudos (D1-D2) | Kudos promo block | ✅ |
| Footer (7) | Logo, nav links, copyright | ✅ |
| Widget Button (6) | Fixed FAB placeholder | ✅ |

## Phases

| Phase | File | Priority | Status |
|-------|------|----------|--------|
| [Phase 1](phase-01-shared-components.md) | Shared: Header, Footer, Widget Button | P1 | ✅ |
| [Phase 2](phase-02-homepage-sections.md) | Hero, Root Further, Awards, Kudos sections | P1 | ✅ |
| [Phase 3](phase-03-page-assembly.md) | `app/page.tsx` + auth guard + i18n | P1 | ✅ |
| [Phase 4](phase-04-tests.md) | Vitest unit + Playwright E2E | P2 | ✅ |

## Key Decisions (Clarifications)

| Điểm | Quyết định |
|------|-----------|
| Header behavior | Sticky/fixed, nền bán trong suốt |
| Mobile header | Hamburger menu collapse nav links |
| Awards data | Dynamic từ `awards` table (Supabase), image static mapped by category |
| Content (text) | Static trong `messages/vi.json` + `messages/en.json` |
| Notification panel | Placeholder (icon chỉ có style, chưa có action) |
| Widget Button | Placeholder (pill style đúng design, chưa có menu) |
| Auth protection | Homepage yêu cầu login, thêm guard vào middleware |
| Event info | Hardcode date "26/12/2025", venue "Âu Cơ Art Center" trong i18n |

## Dependencies

- `awards` table seeded (migration `20260628000006`) ✅
- `app/components/countdown/countdown-timer.tsx` reusable ✅
- `app/components/login/language-switcher.tsx` reusable ✅
- `utils/supabase/server.ts` (createClient) ✅
