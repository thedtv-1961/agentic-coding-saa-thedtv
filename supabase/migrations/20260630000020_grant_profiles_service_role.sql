-- Grant profiles table access to service_role for PostgREST + Admin API scripts
-- PostgREST enforces table-level GRANTs even for service_role (which bypasses RLS),
-- so the seed script (scripts/seed-users.mjs) needs explicit privileges.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
