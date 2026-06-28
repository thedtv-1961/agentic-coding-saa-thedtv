# Phase 04 — i18n + Tests + Build

## Overview
- **Priority**: P1
- **Status**: todo
- **Effort**: ~45 phút
- **Blocked by**: Phase 02 + 03 (cần components và keys hoàn chỉnh)

## Context Links
- Plan: `plans/260628-1800-awards-page/plan.md`
- Test patterns: `src/test/home/awards-section.test.tsx`, `src/test/home/award-card.test.tsx`
- i18n files: `messages/vi.json`, `messages/en.json`

## Key Insights
- Dự án dùng Vitest cho unit tests, Playwright cho E2E
- Test files nằm tại `src/test/` — theo pattern đã có
- i18n namespace `awards` cần thêm vào cả vi.json và en.json
- Build target: Cloudflare Workers (`@cloudflare/next-on-pages`) — cần pass cả `npm run build` lẫn type check

## Requirements

**i18n:**
- Tất cả text UI trong components awards phải dùng `t("key")` — không hardcode string
- Cả `vi.json` và `en.json` phải có đầy đủ keys (không được thiếu key ở một file)
- Labels số lượng và giá trị phải dịch được ("Số lượng giải thưởng" / "Number of awards", "Giá trị giải thưởng" / "Award value")

**Unit Tests (Vitest):**
- `award-detail-card.test.tsx` — test render đúng title, description, award_value, recipient_count
- `awards-nav.test.tsx` — test render 6 items, active state default, click handler
- Mock `IntersectionObserver` trong test environment

**E2E (Playwright):**
- Happy path: login → navigate to `/awards` → page loads
- Nav click: click "Best Manager" → scroll đến section `#best-manager`
- Mobile: viewport 375px → dropdown visible, sidebar hidden

**Build:**
- `npm run build` — 0 errors, 0 type errors
- `npm run lint` — 0 errors
- `npm run test` — existing tests không bị break

## Architecture

```
src/
  test/
    awards/
      award-detail-card.test.tsx
      awards-nav.test.tsx
src/
  test/
    e2e/
      awards-page.spec.ts      ← Playwright E2E (nếu thư mục e2e tồn tại)
```

## Related Code Files

**Đọc để tham khảo:**
- `src/test/home/award-card.test.tsx` — pattern vitest cho award component
- `src/test/home/awards-section.test.tsx` — pattern mock supabase
- `messages/vi.json` — structure hiện tại
- `messages/en.json` — structure hiện tại

**Tạo mới:**
- `src/test/awards/award-detail-card.test.tsx`
- `src/test/awards/awards-nav.test.tsx`

**Sửa:**
- `messages/vi.json` — thêm namespace `awards`
- `messages/en.json` — thêm namespace `awards`

## i18n Keys Đầy Đủ

**vi.json** (namespace `awards`):
```json
"awards": {
  "page_title": "Hệ thống giải thưởng SAA 2025",
  "caption": "Sun* Annual Awards 2025",
  "hero_title": "ROOT FURTHER",
  "hero_subtitle": "Sun* Annual Award 2025",
  "section_caption": "Sun* Annual Awards 2025",
  "section_title": "Hệ thống giải thưởng SAA 2025",
  "quantity_label": "Số lượng giải thưởng",
  "value_label": "Giá trị giải thưởng",
  "individual_suffix": "cá nhân",
  "group_suffix": "tập thể",
  "nav_label": "Danh mục giải thưởng"
}
```

**en.json** (namespace `awards`):
```json
"awards": {
  "page_title": "SAA 2025 Award System",
  "caption": "Sun* Annual Awards 2025",
  "hero_title": "ROOT FURTHER",
  "hero_subtitle": "Sun* Annual Award 2025",
  "section_caption": "Sun* Annual Awards 2025",
  "section_title": "SAA 2025 Award System",
  "quantity_label": "Number of awards",
  "value_label": "Award value",
  "individual_suffix": "individual",
  "group_suffix": "team",
  "nav_label": "Award categories"
}
```

## Implementation Steps

1. **Thêm i18n keys** vào `messages/vi.json` và `messages/en.json`
   - Thêm namespace `"awards": { ... }` vào cả 2 files
   - Verify không missing key giữa 2 files

2. **Viết `award-detail-card.test.tsx`**:
   - Mock `next/image`, `next-intl/server`
   - Test: render với mock award data → đúng title, description, award_value
   - Test: `id` attribute đúng slug
   - Test: `recipient_count` hiển thị đúng

3. **Viết `awards-nav.test.tsx`**:
   - Mock `IntersectionObserver` (global mock trong setup)
   - Test: render 6 nav items với đúng labels
   - Test: default active item là "top-talent"
   - Test: click item → gọi `scrollIntoView`

4. **Chạy full test suite**: `npm run test` — xác nhận xanh

5. **Chạy lint**: `npm run lint` — fix mọi warning/error

6. **Chạy build**: `npm run build` — fix mọi type error

7. **Visual final check** (Playwright manual hoặc screenshot):
   - Desktop 1440px: sidebar sticky, 6 cards, kudos section
   - Mobile 375px: dropdown visible, layout single column

## Todo

- [ ] Thêm namespace `awards` vào `vi.json` và `en.json`
- [ ] Viết `award-detail-card.test.tsx`
- [ ] Viết `awards-nav.test.tsx`
- [ ] `npm run test` — xanh hoàn toàn
- [ ] `npm run lint` — 0 errors
- [ ] `npm run build` — 0 errors
- [ ] Screenshot final ở desktop 1440px và mobile 375px
- [ ] So sánh screenshot với Figma design

## Success Criteria (Definition of Done)

- [ ] **UI**: Screenshot thực tế khớp Figma — layout, màu sắc, spacing đúng
- [ ] **Logic**: Sticky nav, scroll spy, mobile dropdown hoạt động đúng
- [ ] **Unit Tests**: Vitest pass cho `award-detail-card` và `awards-nav`
- [ ] **Build pass**: `npm run build` 0 errors
- [ ] **Lint pass**: `npm run lint` 0 errors
- [ ] **Auth guard**: `/awards` redirect đúng khi chưa login

## Risk Assessment
- **Low**: i18n keys — mechanical, không có logic phức tạp
- **Low**: Unit tests — components phần lớn là display-only
- **Medium**: `IntersectionObserver` mock trong Vitest — cần setup đúng, tham khảo existing test setup nếu có
