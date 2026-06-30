# Phase 04 — Users Section (list + role toggle)

## Context Links
- Route: `/admin/users` | Helper: `app/actions/admin/assert-admin.ts`
- Table: `profiles` | RLS: `profiles_admin_update` (phase 01)
- Current user id from `getUserWithRole()`.

## Overview
- **Priority:** P1 | **Status:** completed
- Users table (avatar, full_name, role badge, hero_level badge, created_at) with a row button to toggle role user↔admin. Self-demote blocked.

## Requirements
- Columns: avatar (next/image, fallback), full_name, role badge (admin gold / user gray), hero_level badge, created_at.
- Toggle role button per row; disabled + tooltip for the logged-in admin's own row (cannot demote self).
- After toggle, list reflects new role.

## Architecture (data flow)
```
page.tsx (Server) → getUserWithRole() → currentUserId
  → supabase.from("profiles").select("id,full_name,avatar_url,role,hero_level,created_at")
       .order("created_at")
  → <UsersTable rows currentUserId/> (Client)
  → toggle → toggleUserRole(id) → assertAdmin + self-check + update → revalidatePath
```

## Related Code Files
- **Create:** `app/(protected)/admin/users/page.tsx` (Server: fetch + pass currentUserId)
- **Create:** `app/components/admin/users-table.tsx` (Client: toggle button + transition)
- **Create:** `app/actions/admin/toggle-user-role.ts` (`"use server"`)
- **Read:** `utils/supabase/get-user-with-role.ts`, `app/components/shared/profile-dropdown.tsx` (avatar style ref)

## Implementation Steps
1. `toggle-user-role.ts`: `"use server"; export async function toggleUserRole(targetId: string)`. Call `assertAdmin()`. Get `{ user }` from `getUserWithRole()`; if `user.id === targetId` throw `"CANNOT_DEMOTE_SELF"`. Read current role of target, compute next = role==='admin'?'user':'admin'. `update profiles set role=next where id=targetId`. `revalidatePath("/admin/users")`. Return `{ ok:true, role: next }`.
2. `page.tsx`: fetch profiles ordered by created_at; `const { user } = await getUserWithRole()`; render `<UsersTable rows currentUserId={user.id}/>`.
3. `users-table.tsx`: `"use client"`. Avatar via `next/image` (fallback initial if no avatar_url). Role badge: admin → `bg-[#FFEA9E] text-black`, user → `bg-white/10`. hero_level badge. Toggle button uses `useTransition`; disabled when `row.id === currentUserId` with title t("cannot_demote_self").
4. Collect i18n keys → phase 07 (`admin.users.*`).
5. `npm run build`.

## Todo
- [ ] `toggle-user-role.ts` (assertAdmin + self-block + flip role)
- [ ] `page.tsx` fetch + currentUserId
- [ ] `users-table.tsx` badges + avatar + toggle (self disabled)
- [ ] record i18n keys
- [ ] build passes

## Success Criteria
- All users listed with avatar, badges, date.
- Toggle flips role and persists; list updates.
- Own row toggle disabled — cannot demote self (both UI-disabled AND action throws).

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Admin demotes self → loses access | M | H | UI disable + action throw `CANNOT_DEMOTE_SELF` (step 1+3) |
| Last admin demoted (other admin) → no admins left | L | H | Out of scope for v1; documented unresolved Q below |
| avatar_url null → broken image | M | L | Initial-letter fallback |
| Stale role read race (toggle twice fast) | L | L | `useTransition` disables button while pending |

## Security
- `toggleUserRole` double-guards: assertAdmin + self-check. RLS `profiles_admin_update` is DB gate.

## Unresolved
- Should we prevent demoting the LAST remaining admin? v1 only blocks self-demote. Flag to user.
