# Phase 01 — Logout Server Action

**Status:** completed
**Priority:** P1
**Effort:** ~15 phút

## Context Links
- MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/z4sCl3_Qtk
- Auth pattern: `app/login/actions.ts`
- Supabase server client: `utils/supabase/server.ts`

## Overview

Tạo server action `logout` để:
1. Gọi `supabase.auth.signOut()`
2. Redirect về `/login`

Action này sẽ được dùng bởi ProfileDropdown (Client Component) qua form action.

## Related Code Files

- **Create:** `app/actions/auth/logout.ts`
- **Read:** `app/login/actions.ts` (tham khảo pattern)

## Implementation Steps

1. Tạo file `app/actions/auth/logout.ts`:

```ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
```

2. Đảm bảo directory `app/actions/auth/` tồn tại (tạo nếu chưa có).

## Todo List

- [x] Tạo `app/actions/auth/` directory
- [x] Viết `logout.ts` server action
- [x] Chạy `npm run build` kiểm tra type error

## Success Criteria

- `logout()` gọi được từ Client Component qua `startTransition`
- Sau logout, session bị xóa và redirect về `/login`
- Không có TypeScript errors

## Risk Assessment

- **Thấp** — pattern giống hệt `signInWithGoogle` đã có
- Supabase client pattern đã ổn định trong project
