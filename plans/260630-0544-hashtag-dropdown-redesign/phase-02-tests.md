---
title: "Phase 02 — Cập nhật Unit Tests"
status: completed
priority: P1
effort: "~30m"
---

# Phase 02 — Cập nhật Unit Tests

## Context Links
- Test file: `src/test/kudos/kudos-hashtag-field.test.tsx`
- Component: `app/components/kudos/kudos-hashtag-field.tsx`

## Requirements

Cập nhật/bổ sung Vitest tests sau khi redesign dropdown:

### Test cases cần có

| # | Case | Mô tả |
|---|------|--------|
| T1 | Render | Dropdown button render, chips empty khi không có selection |
| T2 | Toggle add | Click unselected hashtag → được thêm vào value |
| T3 | Toggle remove | Click selected hashtag trong dropdown → bị remove |
| T4 | Max 5 enforce | Khi 5 đã chọn, unselected rows bị disabled |
| T5 | Selected still clickable | Khi đủ 5, selected rows vẫn click được (deselect) |
| T6 | Chips display | Chips hiển thị đúng số lượng selected items |
| T7 | Close on outside click | Click outside đóng dropdown |
| T8 | All hashtags shown | Dropdown show ALL hashtags (cả selected lẫn unselected) |

## Related Code Files

- **Modify**: `src/test/kudos/kudos-hashtag-field.test.tsx`

## Todo

- [x] Chạy test hiện tại: `npm run test -- kudos-hashtag`
- [x] Cập nhật tests fail do dropdown behavior thay đổi
- [x] Thêm T3, T4, T5, T8 nếu chưa có
- [x] `npm run test` — tất cả pass

## Success Criteria

- `npm run test` pass với 0 failures
- Coverage cho toggle, disable, all-show behaviors
