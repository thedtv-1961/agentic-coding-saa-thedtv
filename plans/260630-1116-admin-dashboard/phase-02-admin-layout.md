# Phase 02 — Admin Layout: Sidebar + Guard + assertAdmin

## Context Links
- Existing: `app/(protected)/admin/page.tsx` (placeholder, redirects non-admin)
- Helper: `utils/supabase/get-user-with-role.ts` → `{ user, isAdmin }`
- Middleware already guards `/admin` for auth.

## Overview
- **Priority:** P1 — blocks all section phases.
- **Status:** completed
- Add `layout.tsx` for `/admin` route group: server-side admin guard (redirect non-admin to `/`), persistent sidebar with 5 nav links + active highlight. Add shared `assertAdmin()` Server Action helper. Repoint `/admin` index to redirect to `/admin/kudos`.

## Key Insights
- Layout runs as Server Component → call `getUserWithRole()` once, redirect if `!isAdmin`. Section pages then trust the guard but still call `assertAdmin()` in their write actions (defense in depth).
- Active link highlight needs `usePathname()` → sidebar nav must be a small Client Component; layout stays Server.
- Dark theme: `bg-black text-white`, accent `#FFEA9E` for active link (confirmed brand accent).

## Requirements
- Functional: non-admin hitting any `/admin/*` → redirect `/`. Sidebar links: Kudos, Users, Awards, Hashtags, Settings.
- Non-functional: ≤200 lines/file; Server Component default.

## Architecture (data flow)
```
/admin/* request → layout.tsx (Server: getUserWithRole → redirect if !isAdmin)
                 → renders <AdminSidebar/> (Client: usePathname highlight) + {children}
write action     → assertAdmin() (server: getUserWithRole, throw if !isAdmin)
```

## Related Code Files
- **Create:** `app/(protected)/admin/layout.tsx` (Server, guard + grid shell)
- **Create:** `app/components/admin/admin-sidebar.tsx` (Client, nav + active highlight)
- **Create:** `app/actions/admin/assert-admin.ts` (server helper, shared by all phases)
- **Edit:** `app/(protected)/admin/page.tsx` → `redirect("/admin/kudos")`
- **Read:** `utils/supabase/get-user-with-role.ts`, `app/components/shared/header-nav.tsx` (style reference)

## Implementation Steps
1. `assert-admin.ts`: `export async function assertAdmin() { const { isAdmin } = await getUserWithRole(); if (!isAdmin) throw new Error("FORBIDDEN"); }`. Mark file `"use server"` is NOT needed (it's a util, not an action) — export plain async fn imported by action files.
2. `layout.tsx`: `const { isAdmin } = await getUserWithRole(); if (!isAdmin) redirect("/");` then return `<div class="flex min-h-screen bg-black text-white"><AdminSidebar/><main class="flex-1 p-6">{children}</main></div>`.
3. `admin-sidebar.tsx`: `"use client"`; array of `{href,labelKey}` for 5 sections; `usePathname()`; active when `pathname.startsWith(href)` → accent text/border. Use `useTranslations("admin.nav")`.
4. Edit `page.tsx` to `redirect("/admin/kudos")`.
5. Collect i18n keys for nav into phase-07 notes (`admin.nav.kudos|users|awards|hashtags|settings`). Do NOT edit messages JSON here.
6. `npm run build` to confirm route group + layout compile.

## Todo
- [ ] `assert-admin.ts` helper
- [ ] `layout.tsx` guard + shell
- [ ] `admin-sidebar.tsx` client nav + active highlight
- [ ] `page.tsx` redirect to /admin/kudos
- [ ] Record nav i18n keys for phase 07
- [ ] build passes

## Success Criteria
- Non-admin visiting `/admin/kudos` → redirected to `/`.
- Admin sees sidebar on all sections; active section highlighted.
- `/admin` redirects to `/admin/kudos`.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Layout guard skipped for nested route | L | H | Next.js layout wraps all children; verify by visiting each path |
| `redirect()` inside try/catch swallowed | L | M | Keep redirect outside try blocks (it throws by design) |
| Sidebar active match too greedy (`/admin` matches all) | M | L | Use exact/startsWith on full section href, order-specific |

## Security
- Guard is UX layer; real enforcement is RLS (phase 01). assertAdmin throws before any mutation.
