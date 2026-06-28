---
phase: 4
title: "i18n & Polish"
status: completed
priority: P2
effort: "~15m"
---

# Phase 4 — i18n & Polish

## Overview

Thêm translation keys cho countdown vào `messages/vi.json` và `messages/en.json`. Kiểm tra visual accuracy so với Figma design.

## Implementation Steps

### 1. Thêm keys vào messages/vi.json

```json
{
  "countdown": {
    "title": "Sự kiện sẽ bắt đầu sau",
    "days": "DAYS",
    "hours": "HOURS",
    "minutes": "MINUTES"
  }
}
```

### 2. Thêm keys vào messages/en.json

```json
{
  "countdown": {
    "title": "The event will start in",
    "days": "DAYS",
    "hours": "HOURS",
    "minutes": "MINUTES"
  }
}
```

**Lưu ý**: unit labels (DAYS/HOURS/MINUTES) giữ nguyên tiếng Anh theo Figma design — đây là convention quốc tế cho countdown timer.

### 3. Visual check vs Figma

Dùng MoMorph để so sánh:
- URL: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
- Kiểm tra: font size, spacing, màu chữ, màu nền digit block, overlay opacity
- Điều chỉnh Tailwind classes nếu lệch

### 4. Polish checklist

- [ ] `<html lang>` được set đúng (next-intl handle tự động)
- [ ] Background image có `aria-hidden="true"` (decorative)
- [ ] Title dùng `<h1>` (semantic heading)
- [ ] Digit block dùng `aria-label` cho screen reader: `aria-label="03 days"`
- [ ] Không có hardcoded text ngoài i18n files

## Files to Modify

- `messages/vi.json` — thêm `countdown` namespace
- `messages/en.json` — thêm `countdown` namespace

## Success Criteria

- [ ] Text hiển thị đúng ngôn ngữ khi switch locale
- [ ] Không có hardcoded string trong component files
- [ ] Visual match Figma ở mức chấp nhận được (layout, màu sắc chính)
