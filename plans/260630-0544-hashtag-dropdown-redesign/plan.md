---
title: "Hashtag Dropdown — Redesign theo Figma spec"
description: "Redesign KudosHashtagField dropdown từ chip+small-list sang full-list với toggle states (dark theme) theo MoMorph screen 'Dropdown list hashtag' (p9zO-c4a4x)."
status: completed
priority: P1
effort: "~1.5h"
branch: create_kudo
tags: [ui, kudos, hashtag, dropdown]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-30
---

# Hashtag Dropdown — Redesign theo Figma spec

## MoMorph refs
- Dropdown list hashtag: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/p9zO-c4a4x

## Overview

Implementation hiện tại (`kudos-hashtag-field.tsx`) dùng chips + small dropdown chỉ liệt kê hashtag chưa chọn. Figma spec yêu cầu dropdown full-list với toggle states (dark theme).

### Current vs Target

| Điểm | Hiện tại | Target |
|------|----------|--------|
| Dropdown content | Chỉ unselected | Tất cả hashtags |
| Selected state | Chip bên ngoài | Dark highlight + checkmark icon trong dropdown |
| Theme | White/light | Dark (`#00070C`) |
| Toggle | One-way add | Click để toggle chọn/bỏ chọn |

## Phases

| Phase | Status | Mô tả |
|-------|--------|--------|
| [Phase 01](phase-01-implement-dropdown.md) | completed | Implement dropdown mới |
| [Phase 02](phase-02-tests.md) | completed | Cập nhật unit tests |

## Dependencies

- `KudosHashtagField` props giữ nguyên — không breaking change
- `getHashtags` action giữ nguyên
- Chips display giữ nguyên (selected chips vẫn show phía trên)
