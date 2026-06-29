---
title: "Floating Action Button — Thể Lệ & Viết KUDOS"
description: "FAB nổi 2 trạng thái (collapsed/expanded), drawer Thể Lệ slide từ phải, modal Viết KUDOS đầy đủ (recipient autocomplete, rich text, hashtag, image upload, anonymous). Hiện trên tất cả trang auth-protected."
status: completed
priority: P1
effort: "~6h"
branch: awards
tags: [ui, fab, kudos, drawer, modal, image-upload, supabase-storage]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-30
---

# Floating Action Button — Thể Lệ & Viết KUDOS

## Overview

Implement Floating Action Button (FAB) theo MoMorph spec:
- **Screen 1** (`_hphd32jN2`): Widget Button collapsed → click mở expanded state
- **Screen 2** (`Sv7DFwBw1h`): 3 button: Thể Lệ / Viết KUDOS / Hủy (×)
- **Thể Lệ**: Drawer slide từ phải, content HTML tĩnh
- **Viết KUDOS**: Modal overlay, form đầy đủ (recipient autocomplete, rich text, hashtag, image upload, anonymous)
- FAB xuất hiện trên tất cả trang auth-protected (đặt trong auth layout)

## MoMorph refs

- Screen 1: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/_hphd32jN2
- Screen 2: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h
- Thể Lệ drawer: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2

## Decisions

- Viết KUDOS → modal overlay (không navigate sang trang mới)
- FAB scope → tất cả trang auth-protected (layout level)
- Image upload → bao gồm (Supabase Storage)
- Thể lệ content → hardcode HTML tĩnh

## Phases

| Phase | Title | Status |
|-------|-------|--------|
| [Phase 01](phase-01-fab-component.md) | FAB Component (collapsed/expanded + animation) | completed |
| [Phase 02](phase-02-the-le-drawer.md) | Thể Lệ Drawer (right slide-in) | completed |
| [Phase 03](phase-03-storage-image-upload.md) | Supabase Storage + Image Upload Utilities | completed |
| [Phase 04](phase-04-viet-kudos-modal.md) | Viết KUDOS Modal (form UI + validation) | completed |
| [Phase 05](phase-05-server-actions.md) | Server Actions (recipient search, hashtags, submit) | completed |
| [Phase 06](phase-06-integration.md) | Integration — wire form + auth layout | completed |
| [Phase 07](phase-07-tests.md) | Tests (unit + E2E) | completed |

## Key Dependencies

- Database: `kudos`, `hashtags`, `profiles`, `kudos_hashtags`, `kudos_images` tables — already migrated
- Auth: FAB hiện chỉ sau khi authenticated (auth layout guard)
- Storage: Supabase Storage bucket `kudos-images` cần tạo mới
- Existing stub: `app/components/shared/widget-button.tsx` — sẽ được refactor hoàn toàn
