-- Add title (danh hiệu) column to kudos
-- Design spec: badge/title assigned by sender, displayed as the Kudos headline

ALTER TABLE public.kudos
  ADD COLUMN title text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.kudos.title IS 'Badge/title (danh hiệu) assigned by sender — displayed as Kudos headline';
