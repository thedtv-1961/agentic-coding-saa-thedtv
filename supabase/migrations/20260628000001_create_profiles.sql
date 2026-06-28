-- Phase 1: Profiles table + auth trigger
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US001, BL002)

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  avatar_url  text,
  role        text not null default 'user'
              check (role in ('user', 'admin')),
  hero_level  text not null default 'new_hero'
              check (hero_level in ('new_hero', 'rising_hero', 'super_hero', 'legend_hero')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create index idx_profiles_role on public.profiles(role);

-- Auto-create profile on Google OAuth signup (email prefix fallback when full_name missing)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  -- E-2 fix: ON CONFLICT guard prevents orphaned auth.users with no profile
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
