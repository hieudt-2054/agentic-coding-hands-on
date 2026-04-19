-- ============================================================
-- Extend event_config for Sun* Kudos
-- Adds: double_heart_active (x2 hearts flag), highlight_limit (carousel size)
-- ============================================================

ALTER TABLE public.event_config
  ADD COLUMN double_heart_active boolean NOT NULL DEFAULT false,
  ADD COLUMN highlight_limit int NOT NULL DEFAULT 5 CHECK (highlight_limit BETWEEN 1 AND 10);

COMMENT ON COLUMN public.event_config.double_heart_active IS
  'When true, toggle_kudo_heart stores value=2 and receivers get 2 hearts per like (Sun* Kudos special days)';
COMMENT ON COLUMN public.event_config.highlight_limit IS
  'How many kudos the Sun* Kudos Highlight carousel renders (default 5)';
