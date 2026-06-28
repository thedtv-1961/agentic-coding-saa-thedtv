---
phase: 1
title: "Middleware & Route Setup"
status: completed
priority: P1
effort: "~20m"
---

# Phase 1 — Middleware & Route Setup

## Overview

Tạo route `/countdown` và thêm PRELAUNCH_MODE gate vào middleware. Khi `PRELAUNCH_MODE=true`, mọi request không phải `/countdown` hoặc auth routes đều bị redirect về `/countdown`. Khi `PRELAUNCH_MODE=false` và user ở `/countdown`, redirect về `/`.

## Implementation Steps

### 1. Thêm env var

Trong `.env.local`, thêm:
```
PRELAUNCH_MODE=true
```

### 2. Tạo route `/countdown`

Tạo file `app/countdown/page.tsx` (placeholder, sẽ điền nội dung ở phase 2-3):

```tsx
// app/countdown/page.tsx
export default function CountdownPage() {
  return <div>Countdown</div>;
}
```

### 3. Cập nhật middleware.ts

Logic bổ sung vào đầu `middleware()`:

```ts
// Prelaunch gate
const isPrelaunch = process.env.PRELAUNCH_MODE === 'true';
const isCountdownRoute = pathname === '/countdown';
const isAuthRoute = pathname.startsWith('/auth') || pathname === '/login';

if (isPrelaunch && !isCountdownRoute && !isAuthRoute) {
  return NextResponse.redirect(new URL('/countdown', request.url));
}
if (!isPrelaunch && isCountdownRoute) {
  return NextResponse.redirect(new URL('/', request.url));
}
```

**Thứ tự trong middleware:** prelaunch gate phải đứng TRƯỚC auth guard để `/countdown` không yêu cầu session.

### 4. Cập nhật matcher

Đảm bảo `/countdown` không bị exclude khỏi matcher (hiện tại matcher đã bao gồm mọi route trừ static assets — không cần thay đổi).

## Files to Modify

- `middleware.ts` — thêm prelaunch gate
- `.env.local` — thêm `PRELAUNCH_MODE=true`

## Files to Create

- `app/countdown/page.tsx` — placeholder

## Success Criteria

- [ ] `PRELAUNCH_MODE=true` + truy cập `/` → redirect về `/countdown`
- [ ] `PRELAUNCH_MODE=true` + truy cập `/countdown` → hiển thị bình thường (không loop)
- [ ] `PRELAUNCH_MODE=true` + truy cập `/login` → không bị redirect
- [ ] `PRELAUNCH_MODE=false` + truy cập `/countdown` → redirect về `/`
- [ ] `npm run build` không lỗi

## Risk

- **Loop redirect**: cần chắc chắn `isCountdownRoute` check đúng pathname (không có locale prefix). Kiểm tra kỹ nếu next-intl thêm prefix vào URL.
