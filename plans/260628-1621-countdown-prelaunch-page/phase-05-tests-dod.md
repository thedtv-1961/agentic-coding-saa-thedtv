---
phase: 5
title: "Tests & DoD"
status: completed
priority: P1
effort: "~30m"
---

# Phase 5 — Tests & DoD

## Overview

Unit tests cho countdown logic (Vitest) và E2E test cho happy path (Playwright). Kết thúc bằng `npm run build` + `npm run lint` pass.

## Unit Tests (Vitest)

### src/test/countdown/countdown-timer.test.ts

Test `calcTimeLeft` function (extract ra utility nếu chưa):

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';

// Extract calcTimeLeft sang utils/calc-time-left.ts để test được
import { calcTimeLeft } from '@/utils/calc-time-left';

describe('calcTimeLeft', () => {
  afterEach(() => vi.useRealTimers());

  it('trả về đúng days/hours/minutes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-19T00:00:00+07:00'));
    const result = calcTimeLeft('2026-12-20T00:00:00+07:00');
    expect(result).toEqual({ days: 1, hours: 0, minutes: 0 });
  });

  it('trả về 0/0/0 khi đã qua target date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-21T00:00:00+07:00'));
    const result = calcTimeLeft('2026-12-20T00:00:00+07:00');
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
  });

  it('zero-pad không cần thiết ở logic — chỉ ở UI', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-19T18:35:00+07:00'));
    const result = calcTimeLeft('2026-12-20T00:00:00+07:00');
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(25);
  });
});
```

**Lưu ý**: cần extract `calcTimeLeft` ra file riêng `utils/calc-time-left.ts` để Vitest import được (tránh import component có `'use client'`).

### src/test/countdown/countdown-digit-block.test.tsx

```ts
import { render, screen } from '@testing-library/react';
import CountdownDigitBlock from '@/app/components/countdown/countdown-digit-block';

describe('CountdownDigitBlock', () => {
  it('zero-pad single digit', () => {
    render(<CountdownDigitBlock value={5} label="HOURS" />);
    expect(screen.getByText('0')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('HOURS')).toBeDefined();
  });

  it('hiển thị đúng 2 chữ số khi value >= 10', () => {
    render(<CountdownDigitBlock value={23} label="HOURS" />);
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
  });
});
```

## E2E Tests (Playwright)

### e2e/countdown.spec.ts

```ts
import { test, expect } from '@playwright/test';

test.describe('Countdown Page', () => {
  test('hiển thị countdown khi PRELAUNCH_MODE=true', async ({ page }) => {
    await page.goto('/countdown');
    await expect(page.locator('h1')).toContainText('Sự kiện sẽ bắt đầu sau');
    // 3 unit labels hiện đủ
    await expect(page.getByText('DAYS')).toBeVisible();
    await expect(page.getByText('HOURS')).toBeVisible();
    await expect(page.getByText('MINUTES')).toBeVisible();
  });

  test('middleware redirect về /countdown khi PRELAUNCH_MODE=true', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/countdown');
  });

  test('digit values là 2 ký tự số', async ({ page }) => {
    await page.goto('/countdown');
    const digits = page.locator('[data-testid="digit"]');
    const count = await digits.count();
    expect(count).toBe(6); // 2 digits × 3 units
    for (let i = 0; i < count; i++) {
      const text = await digits.nth(i).textContent();
      expect(text).toMatch(/^\d$/);
    }
  });
});
```

**Cần thêm** `data-testid="digit"` vào từng digit `<div>` trong `countdown-digit-block.tsx`.

## DoD Checklist

- [ ] `npm run test` — tất cả unit tests pass
- [ ] `npm run test:e2e` — E2E tests pass
- [ ] `npm run build` — không có lỗi TypeScript/build
- [ ] `npm run lint` — không có warning/error
- [ ] Screenshot `/countdown` khớp với Figma design (layout, màu sắc)
- [ ] Middleware redirect hoạt động đúng với `PRELAUNCH_MODE=true/false`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` không xuất hiện trong client bundle

## Files to Create

- `utils/calc-time-left.ts` — extract `calcTimeLeft` để test được
- `src/test/countdown/countdown-timer.test.ts`
- `src/test/countdown/countdown-digit-block.test.tsx`
- `e2e/countdown.spec.ts`
