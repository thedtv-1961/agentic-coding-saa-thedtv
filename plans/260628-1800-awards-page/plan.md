---
title: "Awards Page — Hệ thống giải thưởng"
description: "Trang /awards hiển thị đầy đủ 6 hạng mục giải thưởng SAA 2025: keyvisual, sticky sidebar nav với scroll spy, award detail cards từ DB, Sun* Kudos promo. Auth-protected."
status: completed
priority: P1
effort: "~3h"
branch: awards
tags: [ui, awards, scroll-spy, i18n, auth]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-28
---

# Awards Page — Hệ thống giải thưởng

## Overview

- **Screen**: Hệ thống giải | screenId: `zFYDgyj_pD` | fileKey: `9ypp4enmFmdK3YAFJLIu6C`
- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
- **Route**: `/awards` (auth-protected — redirect về `/login` nếu chưa đăng nhập)

## Quyết định thiết kế

| Quyết định | Lựa chọn |
|-----------|---------|
| Auth guard | Có — protected, giống `/` |
| Mobile nav | Dropdown select |
| Data source | DB (`awards` table) — award_value, recipient_count từ DB |
| Kudos "Chi tiết" link | `/kudos` (internal, cùng tab) |
| Scroll spy | IntersectionObserver, active khi section vào viewport |

## Cross-Plan Dependencies

- `260628-1256-database-design` (completed) — cung cấp `awards` table với `award_value`, `recipient_count`
- `260628-1752-homepage-saa` (completed) — `AwardCard` đã link đến `/awards#slug`

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 01 | Route Setup + Auth + Data Layer | completed |
| 02 | Static UI — Hero, Title, Award Cards | completed |
| 03 | Interactive Nav — Sticky Sidebar + Scroll Spy + Mobile Dropdown | completed |
| 04 | i18n + Tests + Build | completed |
