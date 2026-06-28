-- Phase 2: Kudos system — hashtags, kudos, kudos_hashtags, kudos_images
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US001, US004, BL001, BL003)

create table public.hashtags (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique
);

alter table public.hashtags enable row level security;

-- H10: anon invariant at DB level — is_anonymous=true requires sender_id IS NULL
create table public.kudos (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid references public.profiles(id) on delete set null,
  receiver_id  uuid not null references public.profiles(id) on delete cascade,
  content      text not null check (length(content) <= 1000),
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now(),

  constraint kudos_anon_sender_consistency
    check (not (is_anonymous = true and sender_id is not null))
);

alter table public.kudos enable row level security;

create table public.kudos_hashtags (
  kudos_id    uuid not null references public.kudos(id) on delete cascade,
  hashtag_id  uuid not null references public.hashtags(id) on delete restrict,
  primary key (kudos_id, hashtag_id)
);

alter table public.kudos_hashtags enable row level security;

create table public.kudos_images (
  id           uuid primary key default gen_random_uuid(),
  kudos_id     uuid not null references public.kudos(id) on delete cascade,
  url          text not null,
  order_index  int not null default 0
);

alter table public.kudos_images enable row level security;

-- H9: max-5 images per kudos enforced at DB level
create or replace function public.check_kudos_images_limit()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (select count(*) from public.kudos_images where kudos_id = new.kudos_id) >= 5 then
    raise exception 'Maximum 5 images per kudos (kudos_id: %)', new.kudos_id;
  end if;
  return new;
end;
$$;

create trigger on_kudos_images_insert_limit
  before insert on public.kudos_images
  for each row execute function public.check_kudos_images_limit();

-- Performance indexes
create index idx_kudos_receiver_created
  on public.kudos(receiver_id, created_at desc);

create index idx_kudos_sender
  on public.kudos(sender_id) where sender_id is not null;

create index idx_kudos_created_brin
  on public.kudos using brin(created_at);

create index idx_kudos_hashtags_hashtag
  on public.kudos_hashtags(hashtag_id);

create index idx_kudos_images_kudos
  on public.kudos_images(kudos_id, order_index);
