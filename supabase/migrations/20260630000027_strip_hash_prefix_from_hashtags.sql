-- Hashtag names were stored with a leading '#' (e.g. '#Teamwork').
-- The '#' is a display concern handled by the UI, not a data concern.
-- Strip it from all existing rows so the DB stores clean names.
UPDATE public.hashtags
SET name = ltrim(name, '#')
WHERE name LIKE '#%';
