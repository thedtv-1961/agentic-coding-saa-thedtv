---
phase: 2
title: "Server Component & Data Fetch"
status: completed
priority: P1
effort: "~20m"
---

# Phase 2 — Server Component & Data Fetch

## Overview

`app/countdown/page.tsx` là Server Component. Nó fetch `countdown_date` từ `app_settings` table qua Supabase service role client (bypass RLS vì page này public — không có session). Pass target date xuống CountdownTimer client component.

## Data Shape

`app_settings` table (key-value):
```sql
key   TEXT PRIMARY KEY
value TEXT
-- seed: ('countdown_date', '2026-12-20T00:00:00+07:00')
```

## Implementation Steps

### 1. Utility: getCountdownDate()

Tạo `utils/supabase/get-countdown-date.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const FALLBACK_DATE = '2026-12-20T00:00:00+07:00';

export async function getCountdownDate(): Promise<string> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'countdown_date')
    .single();

  if (error || !data?.value) return FALLBACK_DATE;
  return data.value;
}
```

**Tại sao service role?** `app_settings_select_all` RLS chỉ cho `authenticated`. Trang countdown là public — không có session cookie, nên anon client bị block. Service role bypass RLS hoàn toàn (server-side only, an toàn).

### 2. Countdown Page (Server Component)

```tsx
// app/countdown/page.tsx
import { getCountdownDate } from '@/utils/supabase/get-countdown-date';
import CountdownBackground from '@/app/components/countdown/countdown-background';
import CountdownTitle from '@/app/components/countdown/countdown-title';
import CountdownTimer from '@/app/components/countdown/countdown-timer';

export default async function CountdownPage() {
  const targetDate = await getCountdownDate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CountdownBackground />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <CountdownTitle />
        <CountdownTimer targetDate={targetDate} />
      </div>
    </div>
  );
}
```

### 3. Env var cần có

`.env.local` cần có:
```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<từ output supabase start>
```

## Files to Create

- `utils/supabase/get-countdown-date.ts`
- `app/countdown/page.tsx` (thay thế placeholder từ phase 1)

## Success Criteria

- [ ] `getCountdownDate()` trả về ISO string hợp lệ
- [ ] Khi `app_settings` không có row, fallback date được dùng
- [ ] Page render không lỗi khi Supabase offline (nhờ fallback)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` không expose ra client bundle

## Risk

- **Service role key leak**: tuyệt đối không dùng `NEXT_PUBLIC_` prefix cho key này. Chỉ dùng trong Server Component hoặc Server Action.
- **Supabase offline**: fallback date đảm bảo page vẫn render được.
