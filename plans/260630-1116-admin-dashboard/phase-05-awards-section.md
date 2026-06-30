# Phase 05 — Awards Section (inline edit)

## Context Links
- Route: `/admin/awards` | Helper: `app/actions/admin/assert-admin.ts`
- Tables: `award_categories` (name, description, image_url, title), `awards` (category_id, number_of_winners, winner_unit, prize_value)
- RLS: `award_categories_admin_update`, `awards_admin_update` (phase 01)

## Overview
- **Priority:** P1 | **Status:** completed
- List 6 award categories with current values; per-category inline edit form: name, description, image_url, prize_value (lives on `awards`). Display-only: number_of_winners, winner_unit.

## Key Insights
- Two tables: editable text fields (name/description/image_url) on `award_categories`; `prize_value` on the joined `awards` row. One action must update BOTH tables.
- Assumption: 1 `awards` row per category (number_of_winners/winner_unit/prize_value). Confirm cardinality in step 1 — if multiple awards/category, prize_value edit is ambiguous (see Unresolved).

## Architecture (data flow)
```
page.tsx (Server)
  → supabase.from("award_categories").select("id,title,name,description,image_url,
       awards(id,number_of_winners,winner_unit,prize_value)").order("created_at")
  → <AwardCard category/> per row (Client: inline form, toggle edit/save)
  → save → updateAward({categoryId, awardId, name, description, image_url, prize_value})
       → assertAdmin + update award_categories + update awards → revalidatePath
```

## Related Code Files
- **Create:** `app/(protected)/admin/awards/page.tsx` (Server: fetch categories + awards)
- **Create:** `app/components/admin/award-card.tsx` (Client: inline edit form per category)
- **Create:** `app/actions/admin/update-award.ts` (`"use server"`, updates both tables)
- **Read:** `app/components/awards/` (existing display style ref), `assert-admin.ts`

## Implementation Steps
1. Confirm cardinality: query `select category_id, count(*) from awards group by 1`. If any >1, treat first award row as primary OR ask user. Document.
2. `update-award.ts`: `"use server"; export async function updateAward(input)`. `assertAdmin()`. `update award_categories set name,description,image_url where id=categoryId`. `update awards set prize_value where id=awardId`. Wrap both; if second fails, surface error (no transaction in supabase-js — do sequential, report partial). `revalidatePath("/admin/awards")`.
3. `page.tsx`: fetch categories with embedded `awards(...)`. Pass each to `<AwardCard/>`.
4. `award-card.tsx`: `"use client"`. View mode shows values + edit button. Edit mode: controlled inputs for name/description/image_url/prize_value; number_of_winners + winner_unit read-only. Save via `useTransition` → `updateAward`. Cancel reverts local state.
5. `prize_value` is bigint in DB → handle as string/number carefully; validate numeric before submit.
6. Collect i18n keys → phase 07 (`admin.awards.*`).
7. `npm run build`.

## Todo
- [ ] Confirm awards/category cardinality (step 1)
- [ ] `update-award.ts` (two-table update + assertAdmin)
- [ ] `page.tsx` fetch categories+awards
- [ ] `award-card.tsx` inline edit/view toggle + numeric validation
- [ ] record i18n keys
- [ ] build passes

## Success Criteria
- 6 categories shown with current name/description/image_url/prize_value + read-only winners/unit.
- Editing + save persists to both tables; UI reflects new values.
- prize_value rejects non-numeric input.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Multiple awards/category → ambiguous prize edit | M | M | Step 1 confirm; document; default to primary award |
| No atomic transaction across 2 tables → partial write | M | M | Sequential update, surface partial-failure error; categories update first |
| bigint prize_value JS precision loss | L | M | Treat as string in form, validate integer, send as string |
| image_url invalid → broken display | M | L | Basic URL validation; broken-image fallback |

## Security
- `updateAward` assertAdmin; RLS on both tables enforces.

## Unresolved
- Cardinality awards↔category (1:1 assumed). Confirm with user/data in step 1.
