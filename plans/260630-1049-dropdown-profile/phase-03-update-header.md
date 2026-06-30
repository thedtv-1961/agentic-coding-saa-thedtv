# Phase 03 — Update Header

**Status:** completed
**Priority:** P1
**Effort:** ~20 phút
**Depends on:** Phase 01 (logout action), Phase 02 (ProfileDropdown component)

## Context Links
- `app/components/shared/header.tsx` — Server Component gọi supabase
- `app/components/shared/header-nav.tsx` — Client Component render nav
- Profiles table: `supabase/migrations/20260628000001_create_profiles.sql`

## Overview

Hai thay đổi:
1. `header.tsx` — query thêm `profiles.role` để xác định admin, truyền `isAdmin` xuống
2. `header-nav.tsx` — thay avatar `<Link href="/login">` bằng `<ProfileDropdown>`

## Related Code Files

- **Edit:** `app/components/shared/header.tsx`
- **Edit:** `app/components/shared/header-nav.tsx`
- **Read:** `utils/supabase/server.ts` (createClient pattern)

## Implementation Steps

### header.tsx

Thêm query `profiles` table sau khi lấy user:

```ts
export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  // Xác định admin từ profiles table
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md">
      <HeaderNav userAvatarUrl={avatarUrl} isAdmin={isAdmin} />
    </header>
  );
}
```

### header-nav.tsx

1. Thêm `isAdmin: boolean` vào Props interface.
2. Import `ProfileDropdown` thay vì dùng Link trực tiếp.
3. Thay block avatar link:

```tsx
// Trước:
<Link href="/login" ...>
  {userAvatarUrl ? <Image ... /> : <FallbackIcon />}
</Link>

// Sau:
<ProfileDropdown isAdmin={isAdmin} userAvatarUrl={userAvatarUrl} />
```

4. Xóa import `Link` nếu không còn dùng cho avatar (Link vẫn dùng cho nav links → giữ lại).

## Todo List

- [x] Edit `header.tsx`: query `profiles.role`, tính `isAdmin`, pass xuống HeaderNav
- [x] Edit `header-nav.tsx`: thêm `isAdmin` prop, import và render `ProfileDropdown`
- [x] Xóa avatar Link block cũ
- [x] Chạy `npm run build` không có lỗi
- [x] Test thủ công: đăng nhập → click avatar → dropdown xuất hiện

## Success Criteria

- Header Server Component query profile không ảnh hưởng performance đáng kể
- Avatar không còn link về `/login`
- Dropdown render đúng variant (user/admin) tuỳ theo role
- TypeScript strict không có lỗi

## Risk Assessment

- **Thấp** — chỉ thêm 1 query nhỏ vào Server Component đã có
- Nếu user chưa có profile (edge case): `isAdmin` default `false` → safe fallback
- `single()` trả `null` khi không tìm thấy row → không throw, cần check `data?.role`
