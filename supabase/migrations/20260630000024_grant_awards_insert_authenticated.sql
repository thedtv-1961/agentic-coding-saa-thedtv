-- Grant INSERT on award_categories and awards to authenticated role (for admin add new).
-- Only SELECT + UPDATE were granted previously (migrations 14 and 019).
GRANT INSERT ON public.award_categories TO authenticated;
GRANT INSERT ON public.awards TO authenticated;

-- Also grant DELETE so admin can remove awards/categories in future.
GRANT DELETE ON public.award_categories TO authenticated;
GRANT DELETE ON public.awards TO authenticated;
