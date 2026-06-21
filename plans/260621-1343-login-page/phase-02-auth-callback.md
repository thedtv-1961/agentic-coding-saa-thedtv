# Phase 02 — Supabase Auth Callback & Login Action

**Status:** pending | **Priority:** high | **Effort:** ~30min

## Overview

Tạo OAuth callback route và server action để xử lý Google OAuth flow qua Supabase.

## Context

- Supabase local: `http://127.0.0.1:54321`
- Google OAuth chưa có credentials — chỉ implement code, ghi chú cấu hình credentials
- Callback URL: `http://127.0.0.1:3000/auth/callback`
- Sau login thành công → redirect `/`

## Files to Create

```
app/auth/callback/route.ts   # Xử lý OAuth code exchange
app/login/actions.ts         # Server action: signInWithOAuth Google
```

## Implementation Steps

### 1. Tạo app/auth/callback/route.ts

Đây là route Supabase sẽ redirect về sau khi user xác thực với Google:

```typescript
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Lỗi → redirect về login với error param
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

### 2. Tạo app/login/actions.ts

Server action để trigger Google OAuth:

```typescript
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') ?? 'http://127.0.0.1:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect('/login?error=oauth_init_failed');
  }

  if (data.url) {
    redirect(data.url);
  }
}
```

### 3. Hướng dẫn cấu hình Google OAuth (thực hiện manual)

Thêm vào `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
redirect_uri = ""
```

Thêm vào `.env.local`:

```
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<your-google-client-id>
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<your-google-client-secret>
```

> **Lưu ý:** Lấy credentials tại [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client ID. Authorized redirect URI: `http://127.0.0.1:54321/auth/v1/callback`

## Todo

- [ ] Tạo `app/auth/callback/route.ts`
- [ ] Tạo `app/login/actions.ts`
- [ ] Ghi chú cấu hình Google OAuth trong supabase/config.toml (comment hướng dẫn)
- [ ] Chạy `npm run build` kiểm tra TypeScript

## Success Criteria

- Route `/auth/callback` nhận `code` param, exchange session, redirect về `/`
- Server action `signInWithGoogle` khởi tạo OAuth flow đúng redirect URL
- Không có lỗi TypeScript
