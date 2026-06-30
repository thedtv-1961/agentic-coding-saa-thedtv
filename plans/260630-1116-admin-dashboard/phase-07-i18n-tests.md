# Phase 07 — i18n Keys + Unit Tests

## Context Links
- i18n files: `messages/en.json`, `messages/vi.json` (default VI)
- Test runner: Vitest. Actions: `app/actions/admin/*`. Phases 02–06 recorded their keys here.
- **Integration phase** — runs after 03–06 complete (collects their strings + tests final code).

## Overview
- **Priority:** P1 | **Status:** completed
- Single owner of `messages/*.json` edits (avoids parallel JSON conflicts). Add all `admin.*` keys in EN + VI with parity. Write unit tests for the pure/guard logic in admin actions.

## i18n keys to add (under `admin`)
```
admin.nav.{kudos,users,awards,hashtags,settings}
admin.kudos.{title,col_id,col_title,col_sender,col_receiver,col_date,col_anonymous,
             anonymous,expand,delete,confirm_delete,images_count,prev,next,page_of}
admin.users.{title,col_avatar,col_name,col_role,col_level,col_date,
             role_admin,role_user,make_admin,make_user,cannot_demote_self}
admin.awards.{title,name,description,image_url,prize_value,winners,unit,edit,save,cancel,invalid_number}
admin.hashtags.{title,col_name,col_count,add,add_placeholder,delete,hashtag_in_use,duplicate}
admin.settings.{title,col_key,col_value,save,readonly,invalid_date}
```

## Test matrix
| Target | Type | What to prove |
|--------|------|---------------|
| `toggleUserRole` self-check | unit | throws `CANNOT_DEMOTE_SELF` when target===current; flips role otherwise (mock supabase + getUserWithRole) |
| `deleteKudos` guard | unit | throws when `assertAdmin` rejects; calls delete on success |
| `updateSetting` whitelist | unit | throws `KEY_READONLY` for non-whitelisted key; rejects invalid date; accepts valid ISO |
| `deleteHashtag` in-use guard | unit | throws `HASHTAG_IN_USE` when count>0; deletes when 0 |
| `assertAdmin` | unit | throws `FORBIDDEN` when isAdmin false; passes when true |
| i18n parity | unit | every key in en.json exists in vi.json and vice versa (recursive key-set diff) |

Mock `@/utils/supabase/server` createClient + `getUserWithRole` per existing test patterns. No real DB — these are guard/logic units (UI + RLS covered manually per DoD).

## Related Code Files
- **Edit:** `messages/en.json`, `messages/vi.json` (add `admin.*` block)
- **Create:** `app/actions/admin/__tests__/toggle-user-role.test.ts`
- **Create:** `app/actions/admin/__tests__/delete-kudos.test.ts`
- **Create:** `app/actions/admin/__tests__/update-setting.test.ts`
- **Create:** `app/actions/admin/__tests__/manage-hashtags.test.ts`
- **Create:** `app/actions/admin/__tests__/assert-admin.test.ts`
- **Create:** `messages/__tests__/admin-i18n-parity.test.ts`
- **Read:** all phase-02..06 files for recorded keys; existing `*.test.ts` for mock pattern

## Implementation Steps
1. Gather every key recorded in phases 02–06; add `admin` block to `en.json` then mirror exact keys in `vi.json` (VI translations, EN values for en).
2. Write i18n parity test: load both JSON, flatten to dot-keys, assert symmetric difference is empty.
3. Write action unit tests per matrix — mock supabase client + getUserWithRole; assert thrown errors + happy path mutation calls.
4. `npm run test` → all green. `npm run lint`. `npm run build`.

## Todo
- [ ] Merge all `admin.*` keys into en.json
- [ ] Mirror keys into vi.json (VI translations)
- [ ] i18n parity test
- [ ] 5 action unit test files (guards + happy paths)
- [ ] test + lint + build all pass

## Success Criteria
- EN/VI key sets identical (parity test green).
- All admin action guards covered by passing unit tests.
- `npm run test`, `npm run lint`, `npm run build` all pass.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Missing VI translation → runtime key shown | M | L | Parity test catches before merge |
| Mock drift from real supabase API | M | M | Follow existing test mock patterns; guards are logic-only |
| Keys recorded inconsistently across phases | M | L | This phase is single collation point; reconcile against UI usage |

## Security
- N/A (test/i18n phase). Confirms guard logic correctness asserted in earlier phases.
