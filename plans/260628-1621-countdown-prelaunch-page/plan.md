---
title: "Countdown — Prelaunch Page"
description: "Trang đếm ngược prelaunch SAA 2025: LED-style countdown timer (Days/Hours/Minutes), lấy target date từ app_settings, middleware-based routing, redirect về homepage khi về 0."
status: completed
priority: P1
effort: "~2h"
branch: countdown_page
tags: [ui, countdown, middleware, prelaunch]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-28
---

# Countdown — Prelaunch Page

## Overview

Trang prelaunch SAA 2025 hiển thị countdown timer (Days / Hours / Minutes) dạng LED digit.

- **Screen**: Countdown - Prelaunch page | screenId: `8PJQswPZmU` | fileKey: `9ypp4enmFmdK3YAFJLIu6C`
- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU

## Quyết định thiết kế

| Quyết định | Lựa chọn |
|-----------|---------|
| Target date source | `app_settings` table (key = `countdown_date`) |
| Zero state | Redirect về `/` khi countdown = 0 |
| Route strategy | Middleware-based: `PRELAUNCH_MODE=true` → mọi route → `/countdown` |
| Seconds | Không — chỉ Days / Hours / Minutes |
| Fetch strategy | Server Component dùng service role để đọc `app_settings` |

## Cross-Plan Dependencies

- `plans/260628-1256-database-design/` — **Completed** (app_settings + countdown_date seed đã có)
- `plans/260628-1547-login-page/` — **Completed** (middleware pattern tham chiếu)

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Middleware & Route Setup](./phase-01-middleware-route.md) | ✅ completed |
| 2 | [Server Component & Data Fetch](./phase-02-server-component.md) | ✅ completed |
| 3 | [UI Components — Countdown Timer](./phase-03-ui-components.md) | ✅ completed |
| 4 | [i18n & Polish](./phase-04-i18n-polish.md) | ✅ completed |
| 5 | [Tests & DoD](./phase-05-tests-dod.md) | ✅ completed |

## Key Files

```
app/
├── countdown/
│   └── page.tsx                          # Server Component — fetch + compose
├── components/countdown/
│   ├── countdown-background.tsx          # Full-screen background image
│   ├── countdown-title.tsx               # "Sự kiện sẽ bắt đầu sau"
│   ├── countdown-digit-block.tsx         # LED digit + label (reusable)
│   └── countdown-timer.tsx               # "use client" — setInterval logic
middleware.ts                             # + PRELAUNCH_MODE gate
messages/vi.json                          # + countdown keys
messages/en.json                          # + countdown keys
.env.local                                # + PRELAUNCH_MODE=true
```
