-- Grant permissions for kudos-related tables
GRANT SELECT, INSERT ON TABLE public.kudos TO authenticated;
GRANT SELECT, INSERT ON TABLE public.kudos_hashtags TO authenticated;
GRANT SELECT, INSERT ON TABLE public.kudos_images TO authenticated;

GRANT SELECT ON TABLE public.kudos TO anon;
GRANT SELECT ON TABLE public.kudos_hashtags TO anon;
GRANT SELECT ON TABLE public.kudos_images TO anon;
