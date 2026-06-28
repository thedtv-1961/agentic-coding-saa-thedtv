-- Phase 5: RLS policies for all tables (except audit_logs — created in migration 006)
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (BL001, BL004, BL008)
-- Performance pattern: (select auth.uid()) evaluated once per query, not per row

-- profiles
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated using (true);

-- C1 fix: WITH CHECK prevents role self-elevation and hero_level direct write (M-1 fix)
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and role = (select p.role from public.profiles p where p.id = (select auth.uid()))
    and hero_level = (select p.hero_level from public.profiles p where p.id = (select auth.uid()))
  );

-- kudos
create policy "kudos_select_all"
  on public.kudos for select to authenticated using (true);

create policy "kudos_insert"
  on public.kudos for insert to authenticated
  with check (
    (is_anonymous = false and sender_id = (select auth.uid()))
    or (is_anonymous = true and sender_id is null)
  );

-- hashtags
create policy "hashtags_select_all"
  on public.hashtags for select to authenticated using (true);

create policy "hashtags_admin_write"
  on public.hashtags for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- kudos_hashtags
create policy "kudos_hashtags_select"
  on public.kudos_hashtags for select to authenticated using (true);

-- H4 fix: removed "or is_anonymous = true" — anon kudos via server-side transaction only
create policy "kudos_hashtags_insert"
  on public.kudos_hashtags for insert to authenticated
  with check (
    exists (select 1 from public.kudos
      where id = kudos_id
      and sender_id = (select auth.uid()))
  );

-- kudos_images
create policy "kudos_images_select"
  on public.kudos_images for select to authenticated using (true);

-- H4 fix: removed "or is_anonymous = true" — anon kudos via server-side transaction only
create policy "kudos_images_insert"
  on public.kudos_images for insert to authenticated
  with check (
    exists (select 1 from public.kudos
      where id = kudos_id
      and sender_id = (select auth.uid()))
  );

-- awards
create policy "awards_select_all"
  on public.awards for select to authenticated using (true);

create policy "awards_admin_write"
  on public.awards for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- app_settings
create policy "app_settings_select_all"
  on public.app_settings for select to authenticated using (true);

-- H8 fix: admin INSERT policy was missing
create policy "app_settings_admin_insert"
  on public.app_settings for insert to authenticated
  with check (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- M13 fix: WITH CHECK prevents key rename attacks
create policy "app_settings_admin_update"
  on public.app_settings for update to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'))
  with check (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- nomination_periods
create policy "nomination_periods_select_all"
  on public.nomination_periods for select to authenticated using (true);

create policy "nomination_periods_admin_write"
  on public.nomination_periods for all to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- nominations
create policy "nominations_select_own"
  on public.nominations for select to authenticated
  using (nominator_id = (select auth.uid()));

create policy "nominations_select_admin"
  on public.nominations for select to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));

-- C2 fix: period time check enforced at DB level — cannot bypass via direct API
create policy "nominations_insert"
  on public.nominations for insert to authenticated
  with check (
    nominator_id = (select auth.uid())
    and exists (
      select 1 from public.nomination_periods
      where id = period_id
        and now() between start_at and end_at
    )
  );

-- H12: safe aggregate view — does not expose nominator_id
-- M-2 fix: security_invoker=false bypasses per-user RLS so all authenticated users see global counts
create or replace view public.nominations_count_by_award
  with (security_invoker = false) as
  select period_id, award_id, count(*) as nomination_count
  from public.nominations
  group by period_id, award_id;

-- NOTE: audit_logs RLS policy is defined in migration 006 (same file as CREATE TABLE)
