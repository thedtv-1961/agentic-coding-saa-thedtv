---
title: "Phase 4 — Tests (Vitest Unit + Playwright E2E)"
status: completed
priority: P2
effort: "~0.5h"
---

# Phase 4: Tests

## Context Links

- Depends on: Phase 1, 2, 3 (tất cả components đã implement)
- Pattern tham khảo: `src/test/login/`, `src/test/countdown/`

## Overview

Viết unit tests cho components có logic, và E2E test cho happy path của trang chủ.

## Files to Create

| File | Loại | Mục đích |
|------|------|---------|
| `src/test/home/award-card.test.tsx` | Vitest | Render card, hover class, link href |
| `src/test/home/awards-section.test.tsx` | Vitest | Render grid với mock data |
| `e2e/home.spec.ts` | Playwright | Happy path: auth → homepage → sections visible |

## Unit Tests

### `src/test/home/award-card.test.tsx`

```ts
// Test cases:
// 1. Render đúng title và description từ props
// 2. Link "Chi tiết" có đúng href (/awards#slug)
// 3. Image src khớp với AWARD_META mapping
// 4. Khi category không có trong AWARD_META → dùng placeholder image (không crash)
```

### `src/test/home/awards-section.test.tsx`

```ts
// Mock Supabase createClient → trả về 6 awards
// Test cases:
// 1. Render đúng 6 AwardCard components
// 2. Render section header (C1 title text)
// 3. Khi DB trả về empty array → render grid rỗng, không crash
```

## E2E Tests

### `e2e/home.spec.ts`

```ts
// Setup: login bằng test account (reuse pattern từ e2e/login hiện tại nếu có)
// Happy path:
// 1. Navigate đến / → không redirect (đã auth)
// 2. Header visible: logo + nav links
// 3. Hero section visible: "ROOT FURTHER" heading
// 4. Countdown timer visible: 3 digit blocks
// 5. Awards section visible: đúng 6 cards
// 6. Kudos section visible
// 7. Footer visible: copyright text
// 8. Widget Button visible (fixed bottom-right)

// Auth guard:
// 9. Logout → navigate đến / → redirect về /login
```

## Success Criteria

- [x] `npm run test` — tất cả unit tests pass
- [x] `npm run test:e2e` — E2E happy path pass
- [x] Coverage: award-card và awards-section ≥ 80%
- [x] Không có flaky tests (countdown timer mock time nếu cần)

## Risk Assessment

- **Medium:** E2E auth setup — cần Supabase local đang chạy và test user tồn tại
  - Mitigate: dùng `supabase db reset` trước khi chạy E2E, test account từ seed
- **Low:** Unit test mock Supabase — pattern đã có từ countdown tests

## Notes

- Countdown timer trong unit test: mock `Date.now()` hoặc truyền `targetDate` cố định trong tương lai
- E2E: nếu chưa có e2e/login helper, tạo `e2e/helpers/auth.ts` với `loginAsTestUser(page)`
- Không test các routes chưa exist (`/awards`, `/kudos`) — chỉ test homepage
