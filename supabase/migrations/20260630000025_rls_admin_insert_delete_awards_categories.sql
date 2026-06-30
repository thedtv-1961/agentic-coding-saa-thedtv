-- RLS INSERT + DELETE policies for award_categories and awards (admin only).
-- GRANTs already added in 000024; these RLS policies complete the write access.

create policy "award_categories_admin_insert"
  on public.award_categories for insert to authenticated
  with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ));

create policy "award_categories_admin_delete"
  on public.award_categories for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ));

create policy "awards_admin_insert"
  on public.awards for insert to authenticated
  with check (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ));

create policy "awards_admin_delete"
  on public.awards for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ));
