---
phase: 3
title: "Polish & i18n Completeness"
status: completed
priority: P2
effort: "~30min"
---

# Phase 03 — Polish & i18n Completeness

## Context Links

- Specs: `.momorph/contexts/specs/Login/items_analysis.md`
- i18n messages: `messages/vi.json`, `messages/en.json`
- Footer: `app/components/login/login-footer.tsx`
- Hero: `app/components/login/login-hero.tsx`

## Overview

Xử lý các gap nhỏ còn lại sau visual validation.

## Items

### 1. Footer year — tự động hay hardcode?

Hiện tại `login-footer.tsx` render text qua i18n key `login.footer` = `"Bản quyền thuộc về Sun* © 2025"`.

**Quyết định:** Giữ hardcode "2025" trong i18n message — đây là event năm cụ thể, không phải trang generic. Không cần dynamic year.

> Nếu cần thay đổi sau này chỉ cần sửa `messages/vi.json`.

Action: Không cần thay đổi code. ✅ Confirm và document.

### 2. "ROOT FURTHER" — i18n hay hardcode?

Hiện tại `login-hero.tsx` hardcode `"ROOT FURTHER"` trong JSX (không qua i18n).

**Quyết định:** "ROOT FURTHER" là tagline thương hiệu — giữ nguyên hardcode. Không cần dịch sang tiếng Anh hay tiếng Việt. Consistent với best practice cho brand names.

Action: Không cần thay đổi. ✅ Confirm và document.

### 3. EN translations — kiểm tra completeness

File `messages/en.json` cần có đủ keys như `vi.json`:

```json
{
  "login": {
    "welcome_line1": "Start your journey with SAA 2025.",
    "welcome_line2": "Log in to explore!",
    "login_button": "Login With Google",
    "footer": "Copyright belongs to Sun* © 2025",
    "logo_alt": "Sun* Annual Awards 2025",
    "language_label_vn": "VN",
    "language_label_en": "EN",
    "error_message": "Login failed. Please try again."
  }
}
```

Action: Verify `en.json` đầy đủ. Nếu thiếu key nào → thêm vào.

### 4. Error message display — verify behavior

Từ specs: Button validation note: `"Đăng nhập không thành công. Vui lòng thử lại."` khi Google auth fail.

Hiện tại: `login-hero.tsx` nhận `errorMessage` prop từ `searchParams.error` và render `t("error_message")`.

Action: Verify flow — khi `?error=oauth_init_failed` hay `?error=auth_failed` xuất hiện trong URL → error message hiển thị đúng không.

### 5. Login button text — spec vs code

- Spec: `"LOGIN With Google"` (uppercase LOGIN)
- Code vi.json: `"Đăng nhập bằng Google"`
- Code en.json: `"Login With Google"`

**Figma là tiếng Anh** — button text trong Figma là `"LOGIN With Google"`. Code dùng i18n nên:
- VI: `"Đăng nhập bằng Google"` ✅ (đã localize)
- EN: `"Login With Google"` ✅ (khớp style, không all-caps là ổn)

Action: Không cần thay đổi.

## Implementation Steps

1. Verify `messages/en.json` có đủ keys
2. Test error message: navigate to `localhost:3000/login?error=test` → confirm error hiển thị
3. Document các quyết định trên vào phase notes
4. Chạy `npm run lint` để confirm không có warning i18n

## Acceptance Criteria

- [x] `en.json` có đầy đủ keys như `vi.json`
- [x] Error message hiển thị khi URL có `?error=`
- [x] `npm run lint` pass
- [x] Không có missing i18n keys

## Completion Results

### i18n Verification

1. **EN/VI Keys Complete**
   - ✅ `messages/en.json`: All keys present and verified
   - ✅ `messages/vi.json`: All keys present and verified
   - No missing translation keys detected

2. **Footer Year**
   - ✅ Hardcoded "© 2025" in i18n message (correct approach for year-specific content)

3. **Brand Name**
   - ✅ "ROOT FURTHER" kept as hardcoded brand name (not i18n'd)

4. **Error Message Display**
   - ✅ Tested: `?error=` parameter triggers error message display correctly
   - ✅ Error message renders properly in both EN and VI

5. **Linting**
   - ✅ No i18n warnings in lint output
   - ✅ All translation keys properly referenced

## Files to Modify (nếu cần)

- `messages/en.json` — thêm key nếu thiếu
- `messages/vi.json` — thêm key nếu thiếu
