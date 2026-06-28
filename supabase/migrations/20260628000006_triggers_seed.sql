-- Phase 6: audit_logs table (MUST be first — triggers reference it), triggers, seed data
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US002, US007, BL002, BL007, BL008)

-- H11 fix: audit_logs CREATE TABLE placed here (migration 006), NOT in migration 005
create table public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  table_name    text not null,
  record_id     uuid not null,
  action        text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data      jsonb,
  new_data      jsonb,
  performed_by  uuid references auth.users(id),
  performed_at  timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create index idx_audit_logs_table_record
  on public.audit_logs(table_name, record_id);

create index idx_audit_logs_performed_at
  on public.audit_logs using brin(performed_at);

-- H11 fix: RLS policy defined in same migration as CREATE TABLE
create policy "audit_logs_admin_select"
  on public.audit_logs for select to authenticated
  using (exists (select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'));
-- No INSERT policy — triggers use SECURITY DEFINER (bypass RLS)
-- No UPDATE/DELETE — append-only enforcement (BL008)

-- Hero level trigger
-- H5 fix: FOR UPDATE lock serializes concurrent kudos inserts for same receiver
create or replace function public.update_hero_level()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  kudos_count int;
begin
  perform 1 from public.profiles where id = new.receiver_id for update;

  select count(*) into kudos_count
  from public.kudos
  where receiver_id = new.receiver_id;

  update public.profiles
  set hero_level =
    case
      when kudos_count >= 20 then 'legend_hero'
      when kudos_count >= 10 then 'super_hero'
      when kudos_count >= 5  then 'rising_hero'
      else                        'new_hero'
    end,
    updated_at = now()
  where id = new.receiver_id;

  return new;
end;
$$;

create trigger on_kudos_inserted_update_hero
  after insert on public.kudos
  for each row execute function public.update_hero_level();

-- Kudos audit trigger
-- H-1 fix: strip sender_id from new_data when anonymous — mirrors C3 fix for nominations
create or replace function public.log_kudos_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  safe_data jsonb;
begin
  safe_data := case
    when new.is_anonymous then (row_to_json(new)::jsonb) - 'sender_id'
    else row_to_json(new)::jsonb
  end;
  insert into public.audit_logs (table_name, record_id, action, new_data, performed_by)
  values (
    'kudos',
    new.id,
    'INSERT',
    safe_data,
    new.sender_id
  );
  return new;
end;
$$;

create trigger on_kudos_inserted_audit
  after insert on public.kudos
  for each row execute function public.log_kudos_insert();

-- Nominations audit trigger
-- C3 fix: strip nominator_id from new_data to prevent audit log leaking nominator identity
create or replace function public.log_nomination_insert()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  safe_data jsonb;
begin
  safe_data := (row_to_json(new)::jsonb) - 'nominator_id';
  insert into public.audit_logs (table_name, record_id, action, new_data, performed_by)
  values (
    'nominations',
    new.id,
    'INSERT',
    safe_data,
    new.nominator_id
  );
  return new;
end;
$$;

create trigger on_nomination_inserted_audit
  after insert on public.nominations
  for each row execute function public.log_nomination_insert();

-- Seed: Hashtags (placeholders — BA/PM to update)
insert into public.hashtags (name) values
  ('#Teamwork'), ('#Innovation'), ('#Leadership'),
  ('#CustomerFirst'), ('#Growth'), ('#Ownership'),
  ('#Excellence'), ('#Collaboration'), ('#Integrity'), ('#Impact')
on conflict (name) do nothing;

-- Seed: Awards 2025 (6 fixed categories — BL007)
insert into public.awards (category, title, description, recipient_count, award_value, year)
values
  ('top_talent',         'Top Talent',         'Nhân tài xuất sắc nhất năm',       3, 'TBD', 2025),
  ('top_project',        'Top Project',         'Dự án tiêu biểu nhất năm',         1, 'TBD', 2025),
  ('top_project_leader', 'Top Project Leader',  'PM/TL dự án xuất sắc nhất',        1, 'TBD', 2025),
  ('best_manager',       'Best Manager',        'Quản lý được yêu thích nhất',      1, 'TBD', 2025),
  ('signature_creator',  'Signature Creator',   'Người tạo dấu ấn văn hóa Sun*',   1, 'TBD', 2025),
  ('mvp',                'MVP',                 'Người có đóng góp vượt trội nhất', 1, 'TBD', 2025)
on conflict (category) do nothing;

-- Seed: App settings
insert into public.app_settings (key, value) values
  ('countdown_date',     '2026-12-20T00:00:00+07:00'),
  ('nomination_enabled', 'false')
on conflict (key) do nothing;
