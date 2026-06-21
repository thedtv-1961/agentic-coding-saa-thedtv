# Phase 01 — Setup next-intl i18n

**Status:** pending | **Priority:** high | **Effort:** ~1h

## Overview

Cài đặt và cấu hình `next-intl` cho toàn app với chế độ không có locale prefix trong URL (locale lưu trong cookie `NEXT_LOCALE`).

## Requirements

- URL `/login` giữ nguyên, không đổi thành `/vi/login` hay `/en/login`
- Locale mặc định: `vi` (Vietnamese)
- Hỗ trợ: `vi`, `en`
- Server Components và Client Components đều dùng được translations

## Files to Create

```
messages/
├── vi.json          # Vietnamese translations
└── en.json          # English translations
i18n/
├── routing.ts       # defineRouting config
└── request.ts       # getRequestConfig — server-side locale detection
```

## Files to Modify

```
next.config.ts       # Wrap với createNextIntlPlugin
middleware.ts        # Chain next-intl middleware với Supabase middleware
```

## Implementation Steps

### 1. Install next-intl

```bash
npm install next-intl
```

### 2. Tạo i18n/routing.ts

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'never',  // không có /vi/ hay /en/ trong URL
});
```

### 3. Tạo i18n/request.ts

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 4. Tạo messages/vi.json

```json
{
  "login": {
    "welcome_line1": "Bắt đầu hành trình của bạn cùng SAA 2025.",
    "welcome_line2": "Đăng nhập để khám phá!",
    "login_button": "Đăng nhập bằng Google",
    "footer": "Bản quyền thuộc về Sun* © 2025",
    "logo_alt": "Sun* Annual Awards 2025",
    "language_label_vn": "VN",
    "language_label_en": "EN"
  }
}
```

### 5. Tạo messages/en.json

```json
{
  "login": {
    "welcome_line1": "Start your journey with SAA 2025.",
    "welcome_line2": "Log in to explore!",
    "login_button": "Login With Google",
    "footer": "Copyright belongs to Sun* © 2025",
    "logo_alt": "Sun* Annual Awards 2025",
    "language_label_vn": "VN",
    "language_label_en": "EN"
  }
}
```

### 6. Cập nhật next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin';
// ... existing config ...
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
```

### 7. Cập nhật middleware.ts

Chain next-intl createMiddleware với updateSession:

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  // Nếu intl redirect (chuyển locale) → trả về ngay
  if (intlResponse.status !== 200) return intlResponse;
  // Tiếp tục refresh Supabase session
  return await updateSession(request);
}
```

## Todo

- [ ] `npm install next-intl`
- [ ] Tạo `i18n/routing.ts`
- [ ] Tạo `i18n/request.ts`
- [ ] Tạo `messages/vi.json`
- [ ] Tạo `messages/en.json`
- [ ] Cập nhật `next.config.ts`
- [ ] Cập nhật `middleware.ts`
- [ ] Chạy `npm run build` kiểm tra compile errors

## Success Criteria

- `npm run build` không có lỗi TypeScript
- `useTranslations('login')` hoạt động trong Client Component
- `getTranslations('login')` hoạt động trong Server Component
