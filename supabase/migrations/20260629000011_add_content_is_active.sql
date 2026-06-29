-- Migration 11: Add content + is_active to award_categories; is_active to awards

alter table public.award_categories
  add column content  text    not null default '',
  add column is_active boolean not null default true;

alter table public.awards
  add column is_active boolean not null default true;

-- Backfill: all existing seed rows stay active
update public.award_categories set is_active = true;
update public.awards            set is_active = true;
