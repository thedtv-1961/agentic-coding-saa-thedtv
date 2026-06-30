-- Allow anon role to SELECT profiles (needed for recipient search in kudo form)
-- Drop the old authenticated-only policy and replace with one covering both roles
drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "profiles_select_all" on public.profiles;

create policy "profiles_select_all"
  on public.profiles for select to anon, authenticated using (true);

grant select on table public.profiles to anon, authenticated;
