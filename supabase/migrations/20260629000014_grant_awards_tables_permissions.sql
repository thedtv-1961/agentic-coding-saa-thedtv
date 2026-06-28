-- Migration 14: Grant SELECT on recreated awards tables (lost when tables were dropped/recreated in migration 13)
grant select on public.award_categories to authenticated, anon;
grant select on public.awards to authenticated, anon;
