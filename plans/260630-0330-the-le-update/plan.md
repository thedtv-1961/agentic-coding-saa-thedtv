---
title: "Thể lệ UPDATE — Dark theme & nội dung mới"
description: "Cập nhật drawer Thể lệ theo design 'Thể lệ UPDATE': dark theme (#00070C), nội dung mới (hero badge thresholds, 6 collection icons, Kudos Quốc Dân), download icon assets từ Figma."
status: completed
priority: P1
effort: "~2h"
branch: awards
tags: [ui, the-le, drawer, dark-theme, assets]
blockedBy: []
blocks: []
work_type: feature
spec_waived: "MoMorph spec provided directly at .momorph/contexts/specs/Thể lệ UPDATE/"
created: 2026-06-30
completed: 2026-06-30
---

# Thể lệ UPDATE — Dark theme & nội dung mới

## Overview

- **Screen**: Thể lệ UPDATE | screenId: `b1Filzi9i6` | fileKey: `9ypp4enmFmdK3YAFJLIu6C`
- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
- **Current code**: drawer trắng (light theme) với nội dung placeholder

## Design delta (current vs new)

| Aspect | Current | New |
|--------|---------|-----|
| Panel bg | white | `#00070C` (dark navy-black) |
| Text | gray | white / yellow headings |
| Hero badges | 4 generic descriptions | Thresholds cụ thể (1-4, 5-9, 10-20, 20+) |
| Collection icons | gradient placeholder circles | 6 real circular icon images từ Figma |
| Kudos Quốc Dân | generic text | "Top 5 Kudos nhận nhiều likes nhất" |
| Footer buttons | light border | dark-themed outline + yellow |

## Cross-Plan Dependencies

Không có dependency từ plans khác.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| [01](phase-01-assets-and-content.md) | Download assets + update components | completed |
| [02](phase-02-build-validation.md) | Build + visual validation | completed |

## Files bị ảnh hưởng

- `app/components/shared/the-le-content.tsx` — rewrite toàn bộ nội dung + dark theme
- `app/components/shared/the-le-drawer.tsx` — cập nhật dark theme
- `public/images/the-le/` — tạo mới, chứa 6 collection icon images

## MoMorph refs

- Thể lệ UPDATE: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
