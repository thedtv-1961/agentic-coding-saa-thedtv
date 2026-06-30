---
title: "Dropdown Profile — User & Admin"
description: "Profile dropdown menu trên header: user variant (Profile no-op + Logout) và admin variant (Profile no-op + Dashboard → /admin + Logout). Kết nối Supabase signOut, query role từ DB."
status: completed
priority: P1
effort: "~2h"
branch: admin
tags: [ui, dropdown, auth, logout, admin, header]
blockedBy: []
blocks: []
work_type: feature
spec_waived: "MoMorph spec provided at .momorph/contexts/specs/Dropdown-profile và Dropdown-profile Admin"
created: 2026-06-30
completed: 2026-06-30
---

# Dropdown Profile — User & Admin

## MoMorph refs
- Dropdown-profile: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/z4sCl3_Qtk
- Dropdown-profile Admin: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/54rekaCHG1

## Overview

Implement profile dropdown menu cho header, thay thế avatar link hiện tại (đang link về `/login`).

- **Người dùng thường**: 2 items — Profile (no-op) + Logout
- **Admin**: 3 items — Profile (no-op) + Dashboard → `/admin` + Logout
- Admin detection: query `profiles.role` từ DB trong Server Component
- Logout: Supabase `signOut()` + redirect `/login` (không có confirmation)
- Toggle: click avatar mở/đóng; click ngoài vùng đóng; không animation

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Logout Server Action | ✅ completed | [phase-01](phase-01-logout-action.md) |
| 2 | ProfileDropdown Component | ✅ completed | [phase-02](phase-02-profile-dropdown.md) |
| 3 | Update Header | ✅ completed | [phase-03](phase-03-update-header.md) |
| 4 | Admin Placeholder Page | ✅ completed | [phase-04](phase-04-admin-page.md) |
| 5 | i18n Keys | ✅ completed | [phase-05](phase-05-i18n.md) |
| 6 | Tests | ✅ completed | [phase-06](phase-06-tests.md) |

## Key Decisions

- Profile click → **no-op** cho cả user lẫn admin (trang Profile chưa implement)
- Dashboard click → `/admin` (admin only)
- Admin detection → query `profiles.role = 'admin'` trong `header.tsx` Server Component
- Không có animation mở/đóng
- Click outside đóng dropdown (useEffect + document click listener)
- Logout → `signOut()` + redirect `/login`
