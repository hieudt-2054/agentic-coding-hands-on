-- ============================================================
-- Homepage SAA Database Schema
-- Tables: awards, kudos_info, event_config
-- ============================================================

-- 1. Awards table
CREATE TABLE public.awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX awards_display_order_idx ON public.awards (display_order);

COMMENT ON TABLE public.awards IS 'Award categories displayed on the Homepage SAA card grid';

-- 2. Kudos info table
CREATE TABLE public.kudos_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  detail_url text,
  decoration_image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kudos_info IS 'Sun* Kudos section content for Homepage SAA';

-- 3. Event config table
CREATE TABLE public.event_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  target_datetime timestamptz NOT NULL,
  time_display text NOT NULL,
  venue text NOT NULL,
  stream_note text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.event_config IS 'Event configuration for Homepage SAA countdown and info';

-- 4. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER kudos_info_updated_at
  BEFORE UPDATE ON public.kudos_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER event_config_updated_at
  BEFORE UPDATE ON public.event_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Row Level Security
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_config ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active rows
CREATE POLICY awards_read_authenticated ON public.awards
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY kudos_read_authenticated ON public.kudos_info
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY event_config_read_authenticated ON public.event_config
  FOR SELECT TO authenticated USING (is_active = true);

-- Service role has full access (for admin/seeding)
CREATE POLICY awards_manage_service ON public.awards
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY kudos_manage_service ON public.kudos_info
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY event_config_manage_service ON public.event_config
  FOR ALL TO service_role USING (true) WITH CHECK (true);
