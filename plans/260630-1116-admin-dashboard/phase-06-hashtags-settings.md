# Phase 06 — Hashtags CRUD + App Settings

## Context Links
- Routes: `/admin/hashtags`, `/admin/settings` | Helper: `assert-admin.ts`
- Tables: `hashtags`, `kudos_hashtags`, `app_settings`
- RLS: `hashtags_admin_write` (ALREADY exists), `app_settings_admin_select/update` (phase 01)

## Overview
- **Priority:** P1 | **Status:** completed
- Two sections in one phase (shared concern: simple key/value + tag CRUD).
- **Hashtags:** table name + kudos count; add new; delete (blocked if count > 0).
- **Settings:** key/value table; `countdown_date` editable (ISO datetime); other keys read-only unless whitelisted.

## Requirements
- Hashtags: list `name` + usage count (from `kudos_hashtags`). Add by name input (trim, reject duplicate/empty). Delete disabled when count > 0.
- Settings: whitelist `["countdown_date"]` editable; render others read-only. Validate `countdown_date` parses as ISO datetime before save.

## Architecture (data flow)
```
hashtags/page.tsx (Server)
  → supabase.from("hashtags").select("id,name,kudos_hashtags(count)").order("name")
  → <HashtagsManager rows/> (Client: add input + delete buttons)
  → addHashtag(name) / deleteHashtag(id) → assertAdmin + mutate → revalidatePath

settings/page.tsx (Server)
  → supabase.from("app_settings").select("key,value")
  → <SettingsTable rows whitelist/> (Client: inline edit whitelisted keys)
  → updateSetting(key,value) → assertAdmin + whitelist check + update → revalidatePath
```

## Related Code Files
- **Create:** `app/(protected)/admin/hashtags/page.tsx` (Server)
- **Create:** `app/components/admin/hashtags-manager.tsx` (Client: add + delete)
- **Create:** `app/(protected)/admin/settings/page.tsx` (Server)
- **Create:** `app/components/admin/settings-table.tsx` (Client: inline edit)
- **Create:** `app/actions/admin/manage-hashtags.ts` (`"use server"`: addHashtag, deleteHashtag)
- **Create:** `app/actions/admin/update-setting.ts` (`"use server"`: updateSetting)
- **Read:** `assert-admin.ts`, `app/actions/kudos/get-hashtags.ts` (query ref)

## Implementation Steps
1. `manage-hashtags.ts`:
   - `addHashtag(name)`: assertAdmin; `name = name.trim()`; reject empty; insert into hashtags (rely on unique constraint or pre-check duplicate); revalidate `/admin/hashtags`.
   - `deleteHashtag(id)`: assertAdmin; count `kudos_hashtags` where `hashtag_id=id`; if >0 throw `"HASHTAG_IN_USE"`; else delete; revalidate.
2. `hashtags/page.tsx`: fetch with `kudos_hashtags(count)` aggregate → map to `{id,name,count}`. Pass to manager.
3. `hashtags-manager.tsx`: `"use client"`. Add form (input + button, useTransition). Table rows with delete button disabled when `count>0` (title t("hashtag_in_use")).
4. `update-setting.ts`: `"use server"; const EDITABLE = ["countdown_date"];`. `updateSetting(key,value)`: assertAdmin; if `!EDITABLE.includes(key)` throw `"KEY_READONLY"`; if key==='countdown_date' validate `!isNaN(Date.parse(value))`; `update app_settings set value where key`; revalidate `/admin/settings`.
5. `settings/page.tsx`: fetch all app_settings; pass `whitelist=["countdown_date"]`.
6. `settings-table.tsx`: `"use client"`. Editable input only for whitelisted keys; others render value as read-only text. Save via useTransition.
7. Collect i18n keys → phase 07 (`admin.hashtags.*`, `admin.settings.*`).
8. `npm run build`.

## Todo
- [ ] `manage-hashtags.ts` (add + delete-with-guard)
- [ ] `hashtags/page.tsx` + `hashtags-manager.tsx`
- [ ] `update-setting.ts` (whitelist + ISO validation)
- [ ] `settings/page.tsx` + `settings-table.tsx`
- [ ] record i18n keys
- [ ] build passes

## Success Criteria
- Hashtags list shows name + usage count; add works; delete blocked when used, allowed when count 0.
- Settings: countdown_date editable + ISO-validated; other keys read-only.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Duplicate hashtag insert | M | L | Trim + unique constraint / pre-check; surface friendly error |
| Delete hashtag in use orphans kudos_hashtags | L | M | Count-guard before delete (step 1) |
| Invalid countdown_date breaks countdown page | M | H | `Date.parse` validation in action (step 4) |
| Editing arbitrary setting key | L | M | Whitelist enforced server-side (step 4) |

## Security
- All three actions assertAdmin. `hashtags_admin_write` + `app_settings_admin_update` RLS enforce. Whitelist prevents editing non-intended keys even if RLS allows.
