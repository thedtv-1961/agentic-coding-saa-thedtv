# Phase 03 — Kudos Section (list + delete)

## Context Links
- Route: `/admin/kudos` | Action helper: `app/actions/admin/assert-admin.ts` (phase 02)
- Tables: `kudos`, `kudos_images`, `kudos_hashtags`, `profiles`
- Delete RLS + cascade from phase 01.

## Overview
- **Priority:** P1 | **Status:** completed
- Paginated kudos table (20/page) with JOINed sender/receiver names, expandable detail row, delete action (cascades images + hashtags via DB).

## Requirements
- Columns: id (short, first 8 chars), title, sender name, receiver name, created_at, is_anonymous badge.
- Anonymous kudos: `sender_id` is null → show "Ẩn danh" / "Anonymous".
- Expand row → show content + image count + hashtags.
- Delete with confirm → removes kudos + children.
- Pagination: 20 rows, page via `?page=N` searchParam.

## Architecture (data flow)
```
page.tsx (Server, reads searchParams.page)
  → supabase.from("kudos").select("id,title,created_at,is_anonymous,
       sender:profiles!sender_id(full_name), receiver:profiles!receiver_id(full_name)")
       .order("created_at",{ascending:false}).range(offset, offset+19)
  → also count for total pages
  → <KudosTable rows page totalPages/> (Client: expand state + delete button)
  → delete → deleteKudos(id) action → revalidatePath("/admin/kudos")
```

## Related Code Files
- **Create:** `app/(protected)/admin/kudos/page.tsx` (Server: fetch + count + pagination)
- **Create:** `app/components/admin/kudos-table.tsx` (Client: expand + delete + confirm)
- **Create:** `app/actions/admin/delete-kudos.ts` (`"use server"`, assertAdmin + delete)
- **Read:** `app/actions/admin/assert-admin.ts`, existing kudos query patterns in `app/actions/kudos/`

## Implementation Steps
1. `delete-kudos.ts`: `"use server"; export async function deleteKudos(id: string)`. Call `assertAdmin()`, then `await supabase.from("kudos").delete().eq("id", id)`. On error throw. `revalidatePath("/admin/kudos")`. Return `{ ok: true }`.
2. `page.tsx`: parse `page = Number(searchParams.page ?? 1)`, `offset = (page-1)*20`. Query with embedded `sender:profiles!sender_id(full_name)` + `receiver:profiles!receiver_id(full_name)`. Separate `count` query `{ count: 'exact', head: true }`. Compute `totalPages = Math.ceil(count/20)`.
3. `kudos-table.tsx`: `"use client"`; props rows/page/totalPages. Table dark theme. Per row: short id `id.slice(0,8)`, names (anonymous → t("anonymous")), formatted date, is_anonymous badge. Click row → toggle expand showing content/hashtags/image count. Delete button → `confirm()` + `useTransition` calling `deleteKudos`.
4. Pagination controls: prev/next links `?page=`.
5. Collect i18n keys → phase 07 (`admin.kudos.*`).
6. `npm run build`.

## Todo
- [ ] `delete-kudos.ts` action (assertAdmin + cascade delete)
- [ ] `page.tsx` fetch + count + pagination
- [ ] `kudos-table.tsx` table + expand + delete confirm
- [ ] pagination controls
- [ ] record i18n keys
- [ ] build passes

## Success Criteria
- Table shows 20 kudos/page newest-first with correct sender/receiver names.
- Anonymous kudos show anonymous label (no crash on null join).
- Delete removes kudos + its images + hashtags; list refreshes.
- Pagination navigates correctly.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Null `sender_id` breaks embedded join render | M | M | Optional-chain + anonymous fallback (step 3) |
| Delete without cascade orphans rows | L | M | Cascade verified phase 01 |
| Two profiles joins ambiguous (both FK to profiles) | M | M | Use explicit `!sender_id` / `!receiver_id` hint (step 2) |
| Large kudos count slow count query | L | L | `head:true` count; acceptable at current scale |

## Security
- `deleteKudos` calls `assertAdmin()`; RLS `kudos_admin_delete` is the real gate.
