# Phase 05 — i18n Keys

**Status:** completed
**Priority:** P1
**Effort:** ~10 phút

## Overview

Thêm translation keys cho dropdown menu items vào cả `messages/en.json` và `messages/vi.json`.

## Related Code Files

- **Edit:** `messages/en.json`
- **Edit:** `messages/vi.json`

## Keys cần thêm (trong namespace "common")

| Key | EN | VI |
|-----|----|----|
| `dropdown_profile` | `Profile` | `Hồ sơ` |
| `dropdown_dashboard` | `Dashboard` | `Bảng quản trị` |
| `dropdown_logout` | `Logout` | `Đăng xuất` |

## Implementation

Thêm vào section `"common"` trong cả hai file:

```json
"dropdown_profile": "Profile",
"dropdown_dashboard": "Dashboard",
"dropdown_logout": "Logout"
```

```json
"dropdown_profile": "Hồ sơ",
"dropdown_dashboard": "Bảng quản trị",
"dropdown_logout": "Đăng xuất"
```

## Todo List

- [x] Thêm 3 keys vào `messages/en.json`
- [x] Thêm 3 keys vào `messages/vi.json`
- [x] Đảm bảo cùng vị trí trong object (sau `account_label`)

## Success Criteria

- `useTranslations("common")` trả đúng text khi switch ngôn ngữ EN/VI
- Không có missing translation warning
