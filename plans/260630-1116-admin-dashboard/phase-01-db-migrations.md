# Phase 01 — DB Migrations: Admin Write RLS

## Context Links
- Existing RLS: `supabase/migrations/20260628000005_rls_policies.sql`
- Existing helper pattern: `exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')`
- `hashtags_admin_write` policy ALREADY exists — do NOT recreate.

## Overview
- **Priority:** P1 — blocks all write actions.
- **Status:** completed
- New migration adding admin-only write policies for tables that today have NO write policy: `profiles` (admin update role), `kudos` (admin delete), `award_categories` (admin update), `awards` (admin update), `app_settings` (admin select+update). Verify FK cascades for kudos delete.

## Key Insights
- Performance pattern: wrap `auth.uid()` in `(select auth.uid())` so it is evaluated once/query.
- `hashtags` already has `hashtags_admin_write` (FOR ALL) → hashtag add/delete already covered. Phase 06 relies on it.
- `app_settings` currently service_role only → admin UI cannot read/write it. MUST add admin policies.
- `profiles_update_own` blocks role self-change. Admin role-toggle needs a SEPARATE admin policy that allows changing `role` on OTHER rows.

## Requirements
- Functional: admins can delete kudos, update award_categories/awards, update profiles.role, read+update app_settings.
- Non-functional: no data destroyed; additive only; self-demote prevented at app layer (RLS allows admin to change any role — UI guards self).

## Architecture — policies to add
```sql
-- migration: 20260630000019_admin_write_policies.sql

-- profiles: admin can update ANY profile (role/hero_level changes)
create policy "profiles_admin_update" on public.profiles for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- kudos: admin delete
create policy "kudos_admin_delete" on public.kudos for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- award_categories: admin update
create policy "award_categories_admin_update" on public.award_categories for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- awards: admin update (prize_value etc.)
create policy "awards_admin_update" on public.awards for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- app_settings: admin select + update
create policy "app_settings_admin_select" on public.app_settings for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create policy "app_settings_admin_update" on public.app_settings for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
```

## Related Code Files
- **Create:** `supabase/migrations/20260630000019_admin_write_policies.sql`
- **Read:** `20260628000005_rls_policies.sql`, `20260628000002_create_kudos_system.sql` (verify cascade), `20260628000003_create_awards_settings.sql`

## Implementation Steps
1. Read `20260628000002_create_kudos_system.sql`: confirm `kudos_images.kudos_id` and `kudos_hashtags.kudos_id` FKs are `on delete cascade`. If NOT, add cascade in this migration (`alter table ... drop constraint ... add constraint ... on delete cascade`).
2. Create migration file with the 8 policies above.
3. Grant table privileges if missing: check `app_settings` has `grant select, update on public.app_settings to authenticated;` (follow pattern in `20260628000008_grant_service_role.sql` / `20260630000018`).
4. Run `supabase db reset` → confirm no error.
5. Verify with `psql`: as an admin uid, `delete from kudos`, `update app_settings`, `update profiles set role` succeed; as non-admin they fail.

## Todo
- [ ] Verify kudos child FK cascades (step 1)
- [ ] Write migration with 8 admin policies
- [ ] Add `authenticated` grants for app_settings if missing
- [ ] `supabase db reset` clean
- [ ] psql verification admin vs non-admin

## Success Criteria
- `supabase db reset` runs clean.
- Admin can write all 5 target tables; authenticated non-admin cannot (verified via psql role simulation).
- Deleting a kudos removes its `kudos_images` + `kudos_hashtags` rows.

## Risk Assessment
| Risk | L | I | Countermove |
|------|---|---|-------------|
| Cascade missing → orphan rows on delete | M | M | Step 1 verify/add cascade |
| app_settings grants missing → 42501 permission denied even with policy | M | H | Step 3 add grants |
| Recursive policy (profiles selecting profiles) infinite loop | L | H | Subquery is on same table but non-recursive; pattern already proven in existing migration |

## Security
- Admin check at DB = source of truth. App-layer `assertAdmin` is convenience/UX, not the security boundary.
