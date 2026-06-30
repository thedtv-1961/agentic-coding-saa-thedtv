# Phase 02 — ProfileDropdown Component

**Status:** completed
**Priority:** P1
**Effort:** ~45 phút

## Context Links
- MoMorph user variant: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/z4sCl3_Qtk
- MoMorph admin variant: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/54rekaCHG1
- Existing dropdown pattern: `app/components/login/language-switcher.tsx`
- Logout action: `app/actions/auth/logout.ts` (Phase 01)

## Overview

Client Component `profile-dropdown.tsx` — hiển thị avatar, toggle dropdown khi click,
render đúng variant dựa trên `isAdmin` prop.

**User variant (2 items):**
- Profile — no-op (cursor pointer, không navigate)
- Logout — gọi `logout()` action

**Admin variant (3 items):**
- Profile — no-op (active state khi route === '/profile', nhưng trang chưa có)
- Dashboard — navigate `/admin` (active khi `pathname === '/admin'`)
- Logout — gọi `logout()` action

**Visual spec (từ MoMorph):**
- Container: dark bg, bo tròn, nổi trên header
- Items: label + icon bên phải
- Active item: nền highlight + glow nhẹ
- Hover: nền sáng nhẹ
- Không animation mở/đóng
- Click ngoài vùng → đóng dropdown

## Related Code Files

- **Create:** `app/components/shared/profile-dropdown.tsx`
- **Read:** `app/components/login/language-switcher.tsx` (click-outside pattern)
- **Read:** `app/components/shared/header-nav.tsx` (vị trí tích hợp)
- **Depends on:** `app/actions/auth/logout.ts`

## Implementation Steps

1. Tạo file `app/components/shared/profile-dropdown.tsx` với `"use client"`.

2. Props interface:
```ts
interface Props {
  isAdmin: boolean;
  userAvatarUrl?: string | null;
}
```

3. State & refs:
```ts
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
const pathname = usePathname();
```

4. Click outside handler (useEffect):
```ts
useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isOpen]);
```

5. Logout handler dùng `startTransition`:
```ts
const [isPending, startTransition] = useTransition();
function handleLogout() {
  setIsOpen(false);
  startTransition(() => logout());
}
```

6. Avatar trigger (giống header-nav hiện tại, nhưng là button thay vì Link):
```tsx
<button onClick={() => setIsOpen(v => !v)} aria-expanded={isOpen}>
  {userAvatarUrl ? <Image ... /> : <FallbackIcon />}
</button>
```

7. Dropdown container (absolute, top-full, right-0):
```tsx
{isOpen && (
  <div className="absolute top-full right-0 mt-2 bg-[#0d1117] rounded-lg ...">
    {/* Profile item — no-op */}
    <button onClick={() => setIsOpen(false)} className={activeClass} disabled>
      Profile <UserIcon />
    </button>

    {/* Dashboard — admin only */}
    {isAdmin && (
      <Link href="/admin" onClick={() => setIsOpen(false)} className={dashboardActive}>
        Dashboard <GridIcon />
      </Link>
    )}

    {/* Logout */}
    <button onClick={handleLogout} disabled={isPending}>
      Logout <ChevronRightIcon />
    </button>
  </div>
)}
```

8. Icons: inline SVG (consistent với codebase hiện tại — không dùng thư viện icon ngoài).
   - User icon: `M16 7a4 4 0 11-8 0...` (đã có trong header-nav)
   - Grid icon: 3×3 dots hoặc grid pattern
   - Chevron right: `M9 5l7 7-7 7`

9. i18n: dùng `useTranslations("common")` cho labels `dropdown_profile`, `dropdown_dashboard`, `dropdown_logout`.

## Visual Classes (tham khảo từ spec)

```ts
// Container
"absolute top-full right-0 mt-2 min-w-[160px] bg-[#0d1117] rounded-xl border border-white/10 shadow-xl z-50"

// Item base
"flex items-center justify-between w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors cursor-pointer"

// Item active (Profile khi đang ở /profile, Dashboard khi đang ở /admin)
"bg-white/10 shadow-[0_0_8px_rgba(250,226,135,0.2)]"
```

## Todo List

- [x] Tạo `profile-dropdown.tsx` với "use client"
- [x] Implement avatar trigger button
- [x] Implement dropdown với user variant
- [x] Thêm admin variant (Profile + Dashboard)
- [x] Click outside handler
- [x] Logout với startTransition
- [x] Active state cho Dashboard item
- [x] i18n keys (dùng keys từ Phase 05)
- [x] Chạy `npm run build` không có lỗi

## Success Criteria

- Avatar click mở/đóng dropdown
- Click ngoài vùng đóng dropdown
- User thường thấy Profile + Logout
- Admin thấy Profile + Dashboard + Logout
- Dashboard link active khi pathname === '/admin'
- Logout gọi server action, redirect /login
- Không animation (transition-none)
- Zero TypeScript errors

## Risk Assessment

- **Trung bình** — click outside với SSR cần cẩn thận (dùng `"use client"` + `document` trong useEffect)
- `startTransition` wrap server action là pattern chuẩn Next.js App Router
