# Phase 06 — Tests

**Status:** completed
**Priority:** P1
**Effort:** ~30 phút
**Depends on:** Phase 01–05 hoàn thành

## Overview

Unit tests (Vitest) cho ProfileDropdown component và E2E test (Playwright) cho logout flow.

## Related Code Files

- **Create:** `src/test/shared/profile-dropdown.test.tsx`
- **Read:** `src/test/kudos/kudos-hashtag-field.test.tsx` (tham khảo pattern unit test)
- **Read:** `src/test/login/login-button.test.tsx` (tham khảo mock pattern)

## Unit Tests — ProfileDropdown

File: `src/test/shared/profile-dropdown.test.tsx`

Test cases:
1. **Render avatar** — hiển thị avatar image khi có `userAvatarUrl`, fallback SVG khi không có
2. **Toggle open** — click avatar → dropdown xuất hiện; click lại → đóng
3. **User variant** — `isAdmin=false`: chỉ thấy Profile + Logout, không thấy Dashboard
4. **Admin variant** — `isAdmin=true`: thấy cả Profile + Dashboard + Logout
5. **Click outside** — click ngoài container → dropdown đóng
6. **Logout gọi action** — click Logout → `logout` được gọi
7. **Profile no-op** — click Profile → dropdown đóng nhưng không navigate

```tsx
// Mock logout action
vi.mock("@/app/actions/auth/logout", () => ({
  logout: vi.fn().mockResolvedValue(undefined),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
```

## E2E Test — Logout Flow

Thêm vào file E2E hiện có hoặc tạo file riêng nếu chưa có auth flow test.

Test case: **Happy path logout**
1. Login (giả lập session hoặc dùng test user)
2. Vào trang `/`
3. Click avatar → dropdown mở
4. Click "Logout"
5. Verify redirect về `/login`
6. Verify avatar dropdown không còn accessible

**Lưu ý:** E2E test cần auth guard → cần login step trước. Tham khảo middleware để biết public routes.

## Todo List

- [x] Tạo `src/test/shared/profile-dropdown.test.tsx`
- [x] Test render + toggle (open/close)
- [x] Test user variant (2 items)
- [x] Test admin variant (3 items)
- [x] Test click outside closes
- [x] Test logout gọi action
- [x] Chạy `npm run test` → tất cả pass
- [x] (Optional) E2E logout flow nếu có test user setup

## Success Criteria

- Unit tests pass: 6+ test cases
- `npm run test` không có failing tests
- Coverage ProfileDropdown component ≥ 80%

## Risk Assessment

- **Trung bình** — mock `document.addEventListener` cho click outside cần cẩn thận với jsdom
- Dùng `@testing-library/user-event` để simulate click outside thay vì dispatch event thủ công
