-- Migration: 20260630000019_admin_write_policies.sql
-- Purpose: Add admin-only write RLS policies for profiles, kudos, award_categories, and awards.
--          Also add missing PostgreSQL-level GRANT privileges needed for write operations.
--
-- FK CASCADE VERIFICATION (checked against 20260628000002_create_kudos_system.sql):
--   kudos_images.kudos_id  references public.kudos(id) ON DELETE CASCADE  ✓
--   kudos_hashtags.kudos_id references public.kudos(id) ON DELETE CASCADE  ✓
--   Deleting a kudos row will automatically remove its kudos_images and kudos_hashtags rows.
--
-- SKIPPED policies (already exist in 20260628000005_rls_policies.sql):
--   app_settings_select_all    (for select to authenticated using (true))
--   app_settings_admin_update  (for update to authenticated, uses admin check)
--
-- SKIPPED tables:
--   hashtags — hashtags_admin_write (FOR ALL) already exists in 20260628000005_rls_policies.sql

-- ============================================================
-- PostgreSQL-level GRANTs (RLS policies are no-ops without these)
-- ============================================================

-- profiles: add UPDATE privilege (authenticated currently has SELECT only)
grant update on public.profiles to authenticated;

-- kudos: add DELETE privilege (authenticated currently has SELECT, INSERT only)
grant delete on public.kudos to authenticated;

-- award_categories: add UPDATE privilege (authenticated currently has SELECT only)
grant update on public.award_categories to authenticated;

-- awards: add UPDATE privilege (authenticated currently has SELECT only)
grant update on public.awards to authenticated;

-- app_settings: grant SELECT + UPDATE to authenticated (currently no grant for authenticated role)
grant select, update on public.app_settings to authenticated;

-- ============================================================
-- RLS Policies
-- ============================================================

-- profiles: admin can update ANY profile (e.g., role change, hero_level)
-- Note: profiles_update_own blocks self-updates of role; this separate policy allows
--       admin to change role on OTHER rows. UI layer must guard against self-demotion.
create policy "profiles_admin_update"
  on public.profiles for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- kudos: admin can delete any kudos record
-- Cascade removes child kudos_images + kudos_hashtags rows automatically (FK ON DELETE CASCADE).
create policy "kudos_admin_delete"
  on public.kudos for delete to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- award_categories: admin can update any category (name, description, etc.)
create policy "award_categories_admin_update"
  on public.award_categories for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- awards: admin can update any award (prize_value, name, etc.)
create policy "awards_admin_update"
  on public.awards for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- app_settings: admin select policy
-- NOTE: app_settings_select_all (for select to authenticated using (true)) already exists.
--       This policy is intentionally SKIPPED to avoid duplicate policy error.
--       Admins can already read app_settings via the existing select_all policy.

-- app_settings: admin update policy
-- NOTE: app_settings_admin_update already exists in 20260628000005_rls_policies.sql.
--       This policy is intentionally SKIPPED to avoid duplicate policy error.
--       The existing policy already enforces admin-only updates.
