-- Grant full access to service_role on tables used by the seed script
-- PostgREST enforces table-level GRANTs even for service_role (which bypasses RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hashtags TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.award_categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.awards TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO service_role;
