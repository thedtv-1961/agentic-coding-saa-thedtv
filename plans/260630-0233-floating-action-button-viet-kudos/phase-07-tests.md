# Phase 07 — Tests (Unit + E2E)

## Context Links

- Vitest config: `vitest.config.ts` (hoặc `package.json`)
- Playwright config: `playwright.config.ts`
- Test examples: `src/test/` (login, home, awards, countdown)
- Phụ thuộc: Phases 01–06 hoàn thành

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Unit tests (Vitest) cho utilities và server actions logic; E2E tests (Playwright) cho FAB happy path và các flow quan trọng.

## Unit Tests (Vitest)

### 1. `image-upload.test.ts`

File: `src/test/kudos/image-upload.test.ts`

Test cases:
```ts
describe('validateImageFile', () => {
  it('accepts valid JPEG under 5MB')
  it('accepts valid PNG under 5MB')
  it('accepts valid WEBP under 5MB')
  it('rejects file with invalid type (PDF)')
  it('rejects file exceeding 5MB')
})
```

### 2. `submit-kudos.test.ts`

File: `src/test/kudos/submit-kudos.test.ts`

Test cases (mock Supabase client):
```ts
describe('submitKudos validation', () => {
  it('returns error when receiverId is empty')
  it('returns error when content is empty')
  it('returns error when hashtagIds is empty array')
  it('returns error when hashtagIds has more than 5 items')
  it('returns error when imageUrls has more than 5 items')
  it('calls supabase.from("kudos").insert with correct sender_id when not anonymous')
  it('calls supabase.from("kudos").insert with sender_id=null when anonymous')
})
```

**Pattern mock Supabase** (theo codebase hiện tại — xem `src/test/setup.ts`):
```ts
vi.mock('@/utils/supabase/server', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }) },
    from: vi.fn(() => ({ insert: vi.fn(...), select: vi.fn(...) }))
  }))
}))
```

### 3. `fab-controller.test.tsx`

File: `src/test/kudos/fab-controller.test.tsx`

Test cases:
```ts
describe('FabController', () => {
  it('renders FAB in collapsed state by default')
  it('expands FAB when collapsed button is clicked')
  it('opens drawer when Thể Lệ button is clicked')
  it('opens modal when Viết KUDOS button is clicked')
  it('closes drawer when × is clicked in drawer')
  it('closes modal and opens drawer when Viết KUDOS in drawer footer is clicked — opens modal')
})
```

## E2E Tests (Playwright)

File: `src/test/e2e/fab-kudos.spec.ts`

### Happy Path: Gửi Kudos thành công

```ts
test('FAB → Viết KUDOS → submit thành công', async ({ page }) => {
  // 1. Login (reuse auth helper từ existing tests)
  await loginAsTestUser(page);

  // 2. Navigate về homepage
  await page.goto('/');

  // 3. FAB hiển thị ở bottom-right
  await expect(page.locator('[data-testid="fab-collapsed"]')).toBeVisible();

  // 4. Click FAB → expanded
  await page.click('[data-testid="fab-collapsed"]');
  await expect(page.locator('[data-testid="fab-write-kudos"]')).toBeVisible();

  // 5. Click "Viết KUDOS" → modal mở
  await page.click('[data-testid="fab-write-kudos"]');
  await expect(page.locator('[data-testid="kudos-modal"]')).toBeVisible();

  // 6. Điền người nhận
  await page.fill('[data-testid="recipient-search"]', 'Test');
  await page.click('[data-testid="recipient-option"]:first-child');

  // 7. Nhập nội dung
  await page.click('[data-testid="kudos-content"]');
  await page.keyboard.type('Cảm ơn bạn đã hỗ trợ tôi!');

  // 8. Chọn hashtag
  await page.click('[data-testid="hashtag-add-btn"]');
  await page.click('[data-testid="hashtag-option"]:first-child');

  // 9. Submit
  await page.click('[data-testid="kudos-submit-btn"]');

  // 10. Verify modal đóng + toast xuất hiện
  await expect(page.locator('[data-testid="kudos-modal"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
})
```

### Thể Lệ Drawer Flow

```ts
test('FAB → Thể Lệ → drawer mở và đóng', async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto('/');

  await page.click('[data-testid="fab-collapsed"]');
  await page.click('[data-testid="fab-rules"]');
  await expect(page.locator('[data-testid="the-le-drawer"]')).toBeVisible();

  // Đóng bằng nút Đóng
  await page.click('[data-testid="drawer-close-btn"]');
  await expect(page.locator('[data-testid="the-le-drawer"]')).not.toBeVisible();
})

test('Thể Lệ drawer đóng bằng Escape', async ({ page }) => {
  // ...open drawer...
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-testid="the-le-drawer"]')).not.toBeVisible();
})
```

### Validation Errors

```ts
test('Viết KUDOS: submit khi thiếu field → hiện lỗi', async ({ page }) => {
  // Open modal, click Gửi ngay → nút disabled → không submit
  await page.click('[data-testid="kudos-submit-btn"]');  // nút bị disabled
  // Verify nút vẫn disabled (không có toast lỗi từ server)
  await expect(page.locator('[data-testid="kudos-submit-btn"]')).toBeDisabled();
})
```

## data-testid Cần Thêm

Khi implement các component, thêm `data-testid` attribute:

| Component | data-testid |
|-----------|-------------|
| FAB collapsed | `fab-collapsed` |
| FAB expanded → Thể Lệ button | `fab-rules` |
| FAB expanded → Viết KUDOS button | `fab-write-kudos` |
| FAB cancel × | `fab-cancel` |
| Thể Lệ drawer container | `the-le-drawer` |
| Drawer close button | `drawer-close-btn` |
| Drawer Viết KUDOS button | `drawer-write-kudos-btn` |
| Kudos modal container | `kudos-modal` |
| Recipient search input | `recipient-search` |
| Recipient dropdown option | `recipient-option` |
| Content editor | `kudos-content` |
| Hashtag add button | `hashtag-add-btn` |
| Hashtag dropdown option | `hashtag-option` |
| Submit button | `kudos-submit-btn` |
| Success toast | `success-toast` |

## Related Code Files

**Create:**
- `src/test/kudos/image-upload.test.ts`
- `src/test/kudos/submit-kudos.test.ts`
- `src/test/kudos/fab-controller.test.tsx`
- `src/test/e2e/fab-kudos.spec.ts`

## Todo

- [ ] Tạo `src/test/kudos/image-upload.test.ts`
- [ ] Tạo `src/test/kudos/submit-kudos.test.ts`
- [ ] Tạo `src/test/kudos/fab-controller.test.tsx`
- [ ] Tạo `src/test/e2e/fab-kudos.spec.ts`
- [ ] Thêm `data-testid` vào tất cả components (Phases 01–06)
- [ ] `npm run test` — tất cả unit tests pass
- [ ] `npm run test:e2e` — E2E happy path pass

## Success Criteria

- [ ] Unit tests cover `validateImageFile` (5 cases)
- [ ] Unit tests cover `submitKudos` validation (7 cases)
- [ ] Unit tests cover `FabController` state transitions (6 cases)
- [ ] E2E happy path: submit kudos thành công end-to-end
- [ ] E2E Thể Lệ drawer: open/close bằng button và Escape
- [ ] `npm run test` pass (0 failures)
- [ ] `npm run build` pass sau khi thêm data-testid

## Risk Assessment

- **E2E test data**: cần test user trong seed data của Supabase local — kiểm tra `supabase/migrations/20260628000006_triggers_seed.sql` có user test không
- **Mock Supabase phức tạp**: `submitKudos` có nhiều chained calls — nếu mock khó, test validation logic riêng (không test DB calls trong unit test)
