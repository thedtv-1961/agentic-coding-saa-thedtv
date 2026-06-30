-- Grant INSERT, UPDATE, DELETE on hashtags to authenticated role.
-- RLS policy "hashtags_admin_write" (FOR ALL) already exists in 20260628000005_rls_policies.sql
-- but PostgreSQL-level GRANTs were missing, causing "permission denied for table hashtags".
GRANT INSERT, UPDATE, DELETE ON public.hashtags TO authenticated;
