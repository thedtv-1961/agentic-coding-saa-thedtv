-- Grant SELECT on app_settings to service_role so getCountdownDate() can read countdown_date
-- service_role bypasses RLS but still needs PostgreSQL-level GRANT
GRANT SELECT ON public.app_settings TO service_role;
