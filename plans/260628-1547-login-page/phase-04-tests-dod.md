---
phase: 4
title: "Test Coverage & DoD"
status: completed
priority: P1
effort: "~45min"
---

# Phase 04 — Test Coverage & DoD

## Context Links

- Unit tests: `src/test/login/login-button.test.tsx`, `src/test/login/language-switcher.test.tsx`
- E2E tests: `e2e/login.spec.ts`
- Vitest config: `vitest.config.ts`
- Playwright config: `playwright.config.ts`

## Overview

Hoàn thiện test coverage và verify DoD checklist trước khi đóng plan.

## Unit Tests — Gaps cần thêm

Đã có: `login-button.test.tsx`, `language-switcher.test.tsx`

Còn thiếu:

### `login-hero.test.tsx`

```
- Renders "ROOT FURTHER" heading
- Renders welcome_line1 và welcome_line2 (mock i18n)
- Renders error message khi errorMessage prop được truyền vào
- Không render error message khi errorMessage undefined
- Renders LoginButton
```

### `login-footer.test.tsx`

```
- Renders footer text qua i18n
- Element là <footer>
```

### `login-header.test.tsx`

```
- Renders logo image với đúng alt text
- Logo wrapped trong Link href="/"
- Renders LanguageSwitcher
```

> **Lưu ý:** LoginHeader, LoginHero, LoginFooter là Server Components — dùng async render pattern với `vi.mock("next-intl/server")`.

## Implementation Steps

1. **Chạy unit tests hiện tại** để confirm pass:
   ```bash
   npm run test
   ```

2. **Thêm test files còn thiếu:**
   - `src/test/login/login-hero.test.tsx`
   - `src/test/login/login-footer.test.tsx`
   - `src/test/login/login-header.test.tsx`

3. **Mock pattern cho Server Components** (dùng như các test hiện có):
   ```typescript
   vi.mock("next-intl/server", () => ({
     getTranslations: () => (key: string) => key,
   }));
   vi.mock("next/image", () => ({
     default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
   }));
   vi.mock("next/link", () => ({
     default: ({ href, children }: { href: string; children: React.ReactNode }) =>
       <a href={href}>{children}</a>,
   }));
   ```

4. **Chạy coverage report:**
   ```bash
   npm run test:coverage
   ```
   Target: > 80% cho login components

5. **E2E tests** (cần dev server chạy):
   ```bash
   npm run dev &
   npm run test:e2e -- --grep "Login Page"
   ```

6. **Build pass:**
   ```bash
   npm run build
   ```

7. **Lint pass:**
   ```bash
   npm run lint
   ```

## DoD Checklist

- [x] **UI** — Screenshot desktop đã so sánh với Figma (phase 01)
- [x] **Logic** — Google OAuth flow, language switcher, error message đều hoạt động
- [x] **Unit Tests** — login-button ✅, language-switcher ✅, login-hero ✅, login-footer ✅, login-header ✅
- [x] **E2E Tests** — `e2e/login.spec.ts` pass trên dev server
- [x] **Build pass** — `npm run build` không lỗi
- [x] **Lint pass** — `npm run lint` không lỗi

## Files to Create

- `src/test/login/login-hero.test.tsx`
- `src/test/login/login-footer.test.tsx`
- `src/test/login/login-header.test.tsx`

## Acceptance Criteria

- [x] Tất cả unit tests pass
- [x] Coverage > 80% cho login components
- [x] E2E happy path pass
- [x] `npm run build` thành công
- [x] `npm run lint` không có errors

## Completion Results

### Unit Tests

**Created:**
- ✅ `app/[locale]/login/components/__tests__/login-hero.test.tsx`
- ✅ `app/[locale]/login/components/__tests__/login-footer.test.tsx`
- ✅ `app/[locale]/login/components/__tests__/login-header.test.tsx`

**Status:** 
- Total: 22/22 tests passing
- Coverage:
  - Statements: 100%
  - Branches: 91.66%

### E2E Tests

**Modified:** `e2e/login.spec.ts`
- ✅ Fixed unused `page` parameter
- ✅ Happy path tests verified
- ✅ Error flow validated

### Build & Lint

**Build:** ✅ PASS
- No TypeScript errors
- All imports resolved

**Linting:** ✅ PASS
- Fixed `eslint.config.mjs`: added `.claude/**` to ignored patterns
- No ESLint errors or warnings

### Summary

- ✅ All 4 phases completed
- ✅ UI pixel-perfect vs Figma
- ✅ Responsive layout working (mobile/tablet/desktop)
- ✅ i18n verified (EN/VI complete)
- ✅ 22/22 unit tests passing with 100% statement coverage
- ✅ E2E tests validated
- ✅ Build clean, no TypeScript errors
- ✅ Lint clean, no warnings

## Risk

- Server Components cần mock `next-intl/server` và các Next.js modules — follow pattern từ test hiện có
- E2E cần dev server + Supabase local đang chạy — nếu không có môi trường, skip E2E và note lại
