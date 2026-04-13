-- ============================================================
-- Extend awards table for Awards Information page
-- Add quantity, unit_type, prize_value columns
-- ============================================================

ALTER TABLE public.awards
  ADD COLUMN quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN unit_type text NOT NULL DEFAULT 'Cá nhân',
  ADD COLUMN prize_value text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.awards.quantity IS 'Number of awards in this category';
COMMENT ON COLUMN public.awards.unit_type IS 'Unit type: Đơn vị, Tập thể, or Cá nhân';
COMMENT ON COLUMN public.awards.prize_value IS 'Prize value text (e.g. 7.000.000 VNĐ)';
