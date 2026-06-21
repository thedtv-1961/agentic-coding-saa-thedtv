---
title: Login Page Implementation
status: ready
work_type: feature
spec_waived: UI design from MoMorph (GzbNeVGJHz)
created: 2026-06-21
blockedBy: []
blocks: []
---

# Login Page — Implementation Plan

## Overview

Implement trang `/login` cho SAA 2025 theo design Figma (MoMorph screen GzbNeVGJHz).

**MoMorph:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz

## Clarifications

- Background image: đã export từ Figma → `public/images/login-background.png`
- Logo SAA: đã export từ Figma → `public/images/saa-logo.png`
- Flags + Google icon: `public/icons/flag-vn.svg`, `flag-en.svg`, `google-logo.svg`
- Language switcher: **next-intl** (full i18n, no locale prefix in URL)
- Redirect sau login thành công: `/`
- Logo click: navigate về `/`
- Google OAuth credentials: chưa có — cần cấu hình manual sau

## Phases

| # | Phase | Status | Priority |
|---|-------|--------|----------|
| 01 | [Setup next-intl i18n](./phase-01-setup-i18n.md) | pending | high |
| 02 | [Supabase auth callback & login action](./phase-02-auth-callback.md) | pending | high |
| 03 | [Login page UI](./phase-03-login-page-ui.md) | pending | high |
| 04 | [Middleware update](./phase-04-middleware.md) | pending | medium |
| 05 | [Tests](./phase-05-tests.md) | pending | medium |

## Key Dependencies

- Phase 01 (i18n) phải xong trước Phase 03 (UI dùng translations)
- Phase 02 (auth callback) phải xong trước Phase 04 (middleware dùng auth)
- Phase 03 + 04 cần xong trước Phase 05 (tests)

## Assets (đã download)

```
public/
├── images/
│   ├── login-background.png  (2880×2044, 9.5MB)
│   └── saa-logo.png          (1517×1427, 52KB)
└── icons/
    ├── flag-vn.svg
    ├── flag-en.svg
    └── google-logo.svg
```
