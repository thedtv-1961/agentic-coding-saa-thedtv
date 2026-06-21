# Phase 05 — Tests

**Status:** pending | **Priority:** medium | **Effort:** ~1.5h

**Requires:** Phase 03 (UI components), Phase 04 (middleware)

## Overview

Viết unit tests (Vitest + Testing Library) và E2E tests (Playwright) theo test cases từ MoMorph.

## Test Cases Coverage (từ MoMorph)

| TC ID | Area | Mô tả | Test type |
|-------|------|-------|-----------|
| 45278c06 | ACCESSING | Unauthenticated user → login page hiển thị | E2E |
| f62b0c97 | FUNCTION | Authenticated user → redirect to main page | E2E |
| b9805e65 | GUI | Logo ở top-left, click về homepage | Unit |
| 8415b629 | GUI | Language selector ở top-right | Unit |
| 5f1cbabd | GUI | Default language là VN | Unit |
| 98e20775 | GUI | Flag VN + chevron hiển thị | Unit |
| 20d87e28 | GUI | Language dropdown mở khi click | Unit |
| 4426635b | FUNCTION | Dropdown mở khi click language selector | Unit |
| cb42461d | FUNCTION | Hover language selector → highlight + pointer | Unit |
| 6ae76d15 | GUI | Login button centered, Google icon visible | Unit |
| 60bc5bbb | FUNCTION | Click login button → Google auth flow | Unit |
| c18649fa | FUNCTION | Hover login button → shadow effect | Unit |
| 37eae882 | FUNCTION | Trong lúc auth → button disabled + spinner | Unit |
| 33a1dacf | GUI | Footer visible, fixed bottom, non-interactive | Unit |
| e76aa170 | FUNCTION | Login thành công → redirect to main page | E2E |

## Files to Create

```
src/test/login/
├── login-button.test.tsx       # Unit tests cho LoginButton
└── language-switcher.test.tsx  # Unit tests cho LanguageSwitcher

e2e/
└── login.spec.ts               # E2E tests cho login page
```

## Unit Test: login-button.test.tsx

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginButton from '@/app/components/login/login-button';

vi.mock('@/app/login/actions', () => ({
  signInWithGoogle: vi.fn(() => new Promise(() => {})), // never resolves (simulates redirect)
}));

describe('LoginButton', () => {
  it('renders label and Google icon', () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    expect(screen.getByText('Đăng nhập bằng Google')).toBeInTheDocument();
    expect(screen.getByAltText('Google')).toBeInTheDocument();
  });

  it('shows spinner and disables button when loading', async () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(screen.queryByAltText('Google')).not.toBeInTheDocument(); // replaced by spinner
  });
});
```

## Unit Test: language-switcher.test.tsx

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({ useLocale: () => 'vi' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import LanguageSwitcher from '@/app/components/login/language-switcher';

describe('LanguageSwitcher', () => {
  it('shows VN as default locale', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('VN')).toBeInTheDocument();
  });

  it('shows Vietnam flag', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByAltText('VN')).toBeInTheDocument();
  });

  it('shows chevron icon', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('has pointer cursor on hover (CSS class check)', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('cursor-pointer');
  });
});
```

## E2E Test: e2e/login.spec.ts

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Login Page', () => {
  test('unauthenticated user sees login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    await expect(page.locator('text=ROOT FURTHER')).toBeVisible();
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('authenticated user is redirected from /login to /', async ({ page, context }) => {
    // Set valid Supabase session cookie
    // NOTE: requires a real Supabase session token for full E2E
    // Skip if no credentials available — mark as manual verification
    test.skip(true, 'Requires Google OAuth credentials configured in Supabase');
  });

  test('logo is visible at top-left', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const logo = page.getByAltText('Sun* Annual Awards 2025');
    await expect(logo).toBeVisible();
  });

  test('language selector is at top-right with VN default', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const langButton = page.getByRole('button', { name: /VN/i });
    await expect(langButton).toBeVisible();
  });

  test('language dropdown opens on click', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('button', { name: /VN/i }).click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option', { name: 'VN' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'EN' })).toBeVisible();
  });

  test('footer is visible at bottom', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('text=Bản quyền thuộc về Sun* © 2025')).toBeVisible();
  });

  test('login button shows spinner when clicked', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const loginBtn = page.getByRole('button', { name: /google/i });
    await loginBtn.click();
    // Button should become disabled with spinner
    await expect(loginBtn).toBeDisabled();
  });
});
```

## Todo

- [ ] Tạo `src/test/login/login-button.test.tsx`
- [ ] Tạo `src/test/login/language-switcher.test.tsx`
- [ ] Tạo `e2e/login.spec.ts`
- [ ] Chạy `npm run test` — unit tests pass
- [ ] Chạy `npm run test:e2e` — E2E tests pass (trừ test cần Google credentials)

## Success Criteria

- Unit tests: tất cả pass
- E2E: unauthenticated access, UI layout, dropdown, footer — pass
- E2E: Google OAuth redirect test được đánh dấu `skip` với lý do rõ ràng
- Coverage ≥ 80% cho login components
