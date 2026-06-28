-- Migration 12: Add title column to award_categories
alter table public.award_categories
  add column title text not null default '';
