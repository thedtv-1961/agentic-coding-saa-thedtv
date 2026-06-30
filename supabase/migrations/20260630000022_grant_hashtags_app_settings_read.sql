-- Grant read access on hashtags and app_settings to authenticated users
GRANT SELECT ON public.hashtags TO authenticated;
GRANT SELECT ON public.app_settings TO authenticated;
