---
title: "Viết Kudo — Audit & Cải thiện"
description: "Audit implementation Viết Kudo so với MoMorph spec, fix bugs, hoàn thiện UX còn thiếu, và viết unit tests."
status: in_progress
priority: P1
effort: "~3h"
branch: create_kudo
tags: [ui, kudos, bug-fix, tests]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-30
---

# Viết Kudo — Audit & Cải thiện

## Overview

Implementation Viết Kudo đã có trong codebase (merged qua PR #12). Plan này audit so với MoMorph spec (screenId: `ihQ26W78P2`) và fix các gaps tìm thấy:

**Gaps tìm thấy:**

| # | Loại | Mô tả | File |
|---|------|--------|------|
| G1 | BUG | Content field label hiển thị `{t("content_placeholder").slice(0, 10)}…` thay vì label thực | `viet-kudos-modal.tsx:201` |
| G2 | MISSING | Link "Tiêu chuẩn cộng đồng" có i18n key nhưng không render trong toolbar | `kudos-rich-text-editor.tsx` |
| G3 | UX | `window.prompt()` cho URL input link — native dialog, UX kém | `kudos-rich-text-editor.tsx:63` |
| G4 | UX | Submit button loading chỉ show "..." | `viet-kudos-modal.tsx:253` |
| G5 | TEST | `success-toast` thiếu `data-testid` — E2E test sẽ fail | `fab-controller.tsx:55` |
| G6 | TEST | Không có unit tests cho 4 form components chính | `src/test/kudos/` |

## MoMorph refs

- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2

## Phases

| Phase | Title | Status |
|-------|-------|--------|
| [Phase 01](phase-01-bug-fixes.md) | Bug fixes + missing UI | todo |
| [Phase 02](phase-02-link-dialog.md) | Link dialog UX (thay window.prompt) | todo |
| [Phase 03](phase-03-unit-tests.md) | Unit tests cho form components | todo |
| [Phase 04](phase-04-build-verify.md) | Build + lint verification | todo |

## Key Files

```
app/components/kudos/
├── viet-kudos-modal.tsx          ← G1, G4
├── kudos-rich-text-editor.tsx    ← G2, G3
app/components/shared/
├── fab-controller.tsx            ← G5
src/test/kudos/
├── viet-kudos-modal.test.tsx     ← G6 (tạo mới)
├── kudos-recipient-field.test.tsx← G6 (tạo mới)
├── kudos-hashtag-field.test.tsx  ← G6 (tạo mới)
```
