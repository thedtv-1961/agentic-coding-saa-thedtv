# Phase 04 — Admin Placeholder Page

**Status:** completed
**Priority:** P2
**Effort:** ~15 phút
**Depends on:** Phase 03 (header update)

## Overview

Tạo route `/admin` với placeholder page để Dashboard link trong admin dropdown có thể navigate đến mà không 404. Middleware cần được cập nhật để bảo vệ route này (chỉ admin mới vào được).

## Related Code Files

- **Create:** `app/(protected)/admin/page.tsx`
- **Edit:** `middleware.ts` — thêm auth guard cho `/admin`

## Implementation Steps

### app/(protected)/admin/page.tsx

```tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Admin gate: chỉ admin mới vào được
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-white/60">Trang này đang được xây dựng.</p>
      </div>
    </main>
  );
}
```

### middleware.ts

Thêm `/admin` vào auth guard block (tương tự `/` và `/awards`):

```ts
if (pathname === "/" || pathname.startsWith("/awards") || pathname.startsWith("/admin")) {
  // existing auth check...
}
```

**Lưu ý:** Middleware chỉ kiểm tra auth (đăng nhập hay chưa), không kiểm tra role. Role check được thực hiện trong page.tsx để tránh middleware phức tạp.

## Todo List

- [x] Tạo `app/(protected)/admin/page.tsx` với admin gate
- [x] Edit `middleware.ts` thêm `/admin` vào auth guard
- [x] Chạy `npm run build` không có lỗi
- [x] Test thủ công: non-admin user vào `/admin` → redirect về `/`

## Success Criteria

- `/admin` không 404 khi admin click Dashboard
- Non-admin bị redirect về `/`
- Unauthenticated user bị redirect về `/login` bởi middleware
- Build pass, no TypeScript errors

## Risk Assessment

- **Thấp** — pattern giống hệt `app/(protected)/layout.tsx` hiện tại
- Placeholder page không có logic phức tạp
