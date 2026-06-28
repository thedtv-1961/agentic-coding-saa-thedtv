---
title: "Login Page — Visual Validation & Polish"
description: "Validate và polish trang Login SAA 2025 theo Figma design: visual accuracy, responsive, i18n, test coverage."
status: completed
priority: P1
effort: "~3h"
branch: login_page
tags: [ui, login, auth, i18n, e2e]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-28
---

# Login Page — Visual Validation & Polish

## Overview

Trang Login đã được implement cơ bản. Plan này kiểm tra và hoàn thiện theo Figma design specs:

- **Screen**: Login | screenId: `GzbNeVGJHz` | fileKey: `9ypp4enmFmdK3YAFJLIu6C`
- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz

## Tình trạng hiện tại

Code đã có đầy đủ:
- `app/login/page.tsx` — Login page (auth guard + layout)
- `app/components/login/login-header.tsx` — Header (logo + language switcher)
- `app/components/login/login-hero.tsx` — Hero section (ROOT FURTHER + login button)
- `app/components/login/login-footer.tsx` — Footer (copyright)
- `app/components/login/login-button.tsx` — Google login button với loading state
- `app/components/login/language-switcher.tsx` — Language dropdown
- `app/login/actions.ts` — `signInWithGoogle` server action
- `app/auth/callback/route.ts` — OAuth callback
- `middleware.ts` — Auth guard + i18n middleware
- `messages/vi.json` + `messages/en.json` — i18n translations
- `src/test/login/` — Unit tests (login-button, language-switcher)
- `e2e/login.spec.ts` — E2E tests

## Gaps cần xử lý

| Gap | Mức độ | Phase |
|-----|--------|-------|
| Visual accuracy chưa được validate vs Figma | High | 01 |
| Responsive layout (mobile/tablet) chưa xử lý | High | 02 |
| Footer year hardcoded "© 2025" | Low | 03 |
| "ROOT FURTHER" không qua i18n (brand name) | Low | 03 |
| Unit test cho login-hero, login-footer chưa có | Medium | 04 |
| E2E tests chưa verify passed thực tế | High | 04 |

## Cross-Plan Dependencies

- `plans/260628-1256-database-design/` — **Completed** (không blocking)

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Visual Validation vs Figma](./phase-01-visual-validation.md) | ✅ completed |
| 2 | [Responsive Layout](./phase-02-responsive-layout.md) | ✅ completed |
| 3 | [Polish & i18n Completeness](./phase-03-polish-i18n.md) | ✅ completed |
| 4 | [Test Coverage & DoD](./phase-04-tests-dod.md) | ✅ completed |

## Key Files

```
app/
├── login/
│   ├── page.tsx          # Login page
│   └── actions.ts        # signInWithGoogle server action
├── auth/callback/
│   └── route.ts          # OAuth callback
├── components/login/
│   ├── login-header.tsx
│   ├── login-hero.tsx
│   ├── login-footer.tsx
│   ├── login-button.tsx
│   └── language-switcher.tsx
messages/
├── en.json
└── vi.json
src/test/login/
├── login-button.test.tsx
└── language-switcher.test.tsx
e2e/
└── login.spec.ts
```
