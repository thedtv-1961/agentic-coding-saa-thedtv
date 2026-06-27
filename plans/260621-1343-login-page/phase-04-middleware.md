# Phase 04 — Middleware Update

**Status:** pending | **Priority:** medium | **Effort:** ~30min

**Requires:** Phase 01 (next-intl routing), Phase 02 (Supabase auth)

## Overview

Cập nhật `middleware.ts` để:
1. Xử lý locale detection (next-intl)
2. Bảo vệ route: user đã đăng nhập → redirect khỏi `/login`

## File to Modify

```
middleware.ts    # Chain intl middleware + auth guard
```

## Current State

```typescript
// middleware.ts hiện tại
import { updateSession } from '@/utils/supabase/middleware';
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

## Target State

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Xử lý locale (set cookie NEXT_LOCALE nếu cần)
  const intlResponse = intlMiddleware(request);

  // 2. Auth guard cho route /login
  if (pathname === '/login') {
    // Tạo Supabase client tạm để kiểm tra session
    let response = intlResponse ?? NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // 3. Các route khác: chỉ refresh session
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

> **Lưu ý:** `updateSession` từ `utils/supabase/middleware` đã xử lý cookie refresh.
> Đối với `/login`, ta tạo client inline để kiểm tra user trước khi refresh.

## Todo

- [ ] Import `createIntlMiddleware` từ `next-intl/middleware`
- [ ] Import `routing` từ `./i18n/routing`
- [ ] Thêm auth guard cho `/login` → redirect về `/` nếu đã đăng nhập
- [ ] Giữ nguyên `updateSession` cho các route còn lại
- [ ] Chạy `npm run build` kiểm tra TypeScript

## Success Criteria

- User đã đăng nhập vào `/login` → tự động redirect về `/`
- User chưa đăng nhập vào `/login` → trang login hiển thị bình thường
- Locale cookie `NEXT_LOCALE` được set đúng khi chọn ngôn ngữ
- Session vẫn được refresh đúng trên các route khác
