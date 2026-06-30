---
title: "Admin Dashboard — Quản lý dữ liệu site"
description: "Trang admin quản lý kudos/users/awards/hashtags/app-settings với sidebar layout."
status: completed
priority: P1
effort: "~8h"
branch: admin
tags: [admin, dashboard, ui, crud, supabase, rls]
blockedBy: []
blocks: []
work_type: feature
spec_waived: true
created: 2026-06-30
---

# Admin Dashboard

Trang `/admin/*` với sidebar layout, 5 sections quản lý dữ liệu site. Server Components fetch data, Client Components cho phần tương tác, Server Actions trong `app/actions/admin/`. Write access bảo vệ bằng admin-only RLS policies + double-check role ở Server Action layer.

## Architecture (data flow)

```
Browser → middleware.ts (auth guard /admin)
        → app/(protected)/admin/layout.tsx  (getUserWithRole → redirect non-admin + sidebar)
        → section page.tsx (Server Component: createServerClient → fetch)
        → section client component (interactive) → Server Action (app/actions/admin/*)
              → assertAdmin() guard → supabase mutation (RLS enforces) → revalidatePath
```

Hai lớp bảo vệ write: (1) RLS policy `admin` ở DB, (2) `assertAdmin()` helper ở Server Action. Defense in depth — RLS là nguồn chân lý cuối.

## Phases

| # | Phase | Status | Effort | Depends on |
|---|-------|--------|--------|------------|
| 01 | [DB migrations — admin write RLS](phase-01-db-migrations.md) | ✅ completed | 1h | — |
| 02 | [Admin layout + sidebar + guard](phase-02-admin-layout.md) | ✅ completed | 1h | 01 |
| 03 | [Kudos section (list + delete)](phase-03-kudos-section.md) | ✅ completed | 1.5h | 02 |
| 04 | [Users section (list + role toggle)](phase-04-users-section.md) | ✅ completed | 1h | 02 |
| 05 | [Awards section (inline edit)](phase-05-awards-section.md) | ✅ completed | 1.5h | 02 |
| 06 | [Hashtags CRUD + App settings](phase-06-hashtags-settings.md) | ✅ completed | 1.5h | 02 |
| 07 | [i18n keys + unit tests](phase-07-i18n-tests.md) | ✅ completed | 1h | 03,04,05,06 |

## Dependency graph

- Phase 01 (DB) blocks everything — write actions fail without RLS.
- Phase 02 (layout + `assertAdmin` helper) blocks all section phases.
- Phases 03–06 are **parallel-runnable** (disjoint file ownership: each owns its own route subfolder + action subfile). They share only `app/actions/admin/assert-admin.ts` (read-only) and `messages/*.json` (deferred to 07).
- Phase 07 integrates: collects all i18n keys + writes tests against final code.

## File ownership (parallel safety)

| Phase | Owns (write) |
|-------|--------------|
| 03 | `admin/kudos/**`, `actions/admin/delete-kudos.ts` |
| 04 | `admin/users/**`, `actions/admin/toggle-user-role.ts` |
| 05 | `admin/awards/**`, `actions/admin/update-award.ts` |
| 06 | `admin/hashtags/**`, `admin/settings/**`, `actions/admin/manage-hashtags.ts`, `actions/admin/update-setting.ts` |
| 07 | `messages/en.json`, `messages/vi.json`, `**/*.test.ts` |

Rule: phases 03–06 MUST NOT edit `messages/*.json` directly — collect strings into their own phase notes; phase 07 merges. Avoids JSON merge conflicts.

## Key risks (site-wide)

| Risk | L | I | Countermove |
|------|---|---|-------------|
| Admin demotes self / locks out all admins | M | H | `toggle-user-role` blocks self-demote (phase 04); RLS still requires ≥1 admin row implicitly via UI guard |
| Write action bypasses role check | L | H | `assertAdmin()` in every action + RLS at DB (phase 01) |
| Delete kudos orphans images/hashtags | M | M | FK `on delete cascade` verified in phase 01 step 1 |
| i18n key drift EN/VI | M | L | Phase 07 diff-checks key parity |

## Rollback

Each phase reversible: migrations have paired down-notes (drop policy); UI/action files are new (delete to revert). No destructive schema change — only additive policies. Layout change is additive route group.

## Definition of Done

- 5 sections render under `/admin/*`, non-admin redirected.
- All CRUD actions work + enforce admin at RLS + action layer.
- `npm run build` + `npm run lint` pass, unit tests green, EN/VI key parity.
