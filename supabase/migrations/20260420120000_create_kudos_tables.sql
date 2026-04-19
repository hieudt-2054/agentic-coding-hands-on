-- ============================================================
-- Sun* Kudos — Live Board Database Schema
-- Tables: profiles, departments, hashtags, kudos, kudo_hashtags,
--         kudo_images, kudo_hearts, secret_boxes, live_kudo_events
-- RPCs:   toggle_kudo_heart(uuid), open_secret_box(uuid)
-- ============================================================

-- 1. Departments
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Hashtags
CREATE TABLE public.hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  hoa_thi_level smallint NOT NULL DEFAULT 0 CHECK (hoa_thi_level BETWEEN 0 AND 3),
  danh_hieu text NOT NULL DEFAULT 'New Hero' CHECK (
    danh_hieu IN ('New Hero', 'Rising Hero', 'Super Hero', 'Legend Hero')
  ),
  kudos_received_count int NOT NULL DEFAULT 0,
  kudos_sent_count int NOT NULL DEFAULT 0,
  hearts_received_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_department_idx ON public.profiles (department_id);
CREATE INDEX profiles_kudos_received_idx ON public.profiles (kudos_received_count DESC);

-- 4. Kudos
CREATE TABLE public.kudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  content text NOT NULL,
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  hearts_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (sender_id <> receiver_id)
);

CREATE INDEX kudos_hearts_idx ON public.kudos (hearts_count DESC);
CREATE INDEX kudos_created_at_idx ON public.kudos (created_at DESC);
CREATE INDEX kudos_receiver_idx ON public.kudos (receiver_id);
CREATE INDEX kudos_sender_idx ON public.kudos (sender_id);

-- 5. Kudo ↔ Hashtag join
CREATE TABLE public.kudo_hashtags (
  kudo_id uuid NOT NULL REFERENCES public.kudos (id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES public.hashtags (id) ON DELETE CASCADE,
  PRIMARY KEY (kudo_id, hashtag_id)
);

-- 6. Kudo images (max 5 per kudo)
CREATE TABLE public.kudo_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kudo_id uuid NOT NULL REFERENCES public.kudos (id) ON DELETE CASCADE,
  url text NOT NULL,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 4),
  UNIQUE (kudo_id, position)
);

-- 7. Kudo hearts
CREATE TABLE public.kudo_hearts (
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  kudo_id uuid NOT NULL REFERENCES public.kudos (id) ON DELETE CASCADE,
  value smallint NOT NULL DEFAULT 1 CHECK (value IN (1, 2)),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kudo_id)
);

CREATE INDEX kudo_hearts_user_recent_idx ON public.kudo_hearts (user_id, created_at DESC);

-- 8. Secret boxes / Gifts
CREATE TABLE public.secret_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'unopened' CHECK (status IN ('opened', 'unopened')),
  gift_description text NOT NULL DEFAULT '',
  opened_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX secret_boxes_owner_status_idx ON public.secret_boxes (owner_id, status);
CREATE INDEX secret_boxes_opened_at_idx ON public.secret_boxes (opened_at DESC);

-- 9. Live Kudo Events (fan-out for Realtime)
CREATE TABLE public.live_kudo_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kudo_id uuid NOT NULL REFERENCES public.kudos (id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  receiver_name text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX live_kudo_events_recent_idx ON public.live_kudo_events (occurred_at DESC);

-- ============================================================
-- Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_kudo_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_receiver_name text;
BEGIN
  SELECT display_name INTO v_receiver_name FROM public.profiles WHERE id = NEW.receiver_id;

  INSERT INTO public.live_kudo_events (kudo_id, receiver_id, receiver_name, occurred_at)
  VALUES (NEW.id, NEW.receiver_id, COALESCE(v_receiver_name, 'Unknown'), NEW.created_at);

  UPDATE public.profiles SET kudos_received_count = kudos_received_count + 1 WHERE id = NEW.receiver_id;
  UPDATE public.profiles SET kudos_sent_count = kudos_sent_count + 1 WHERE id = NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE TRIGGER trg_kudos_insert
  AFTER INSERT ON public.kudos
  FOR EACH ROW EXECUTE FUNCTION public.on_kudo_insert();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudo_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudo_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kudo_hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_kudo_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active rows / public data
CREATE POLICY profiles_read_authenticated ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY departments_read_authenticated ON public.departments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY hashtags_read_authenticated ON public.hashtags
  FOR SELECT TO authenticated USING (true);
CREATE POLICY kudos_read_authenticated ON public.kudos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY kudo_hashtags_read_authenticated ON public.kudo_hashtags
  FOR SELECT TO authenticated USING (true);
CREATE POLICY kudo_images_read_authenticated ON public.kudo_images
  FOR SELECT TO authenticated USING (true);
CREATE POLICY kudo_hearts_read_authenticated ON public.kudo_hearts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY live_kudo_events_read_authenticated ON public.live_kudo_events
  FOR SELECT TO authenticated USING (true);

-- Users own their profile row
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Kudos: sender may insert + delete, nobody may update
CREATE POLICY kudos_insert_sender ON public.kudos
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY kudos_delete_sender ON public.kudos
  FOR DELETE TO authenticated USING (sender_id = auth.uid());
CREATE POLICY kudo_hashtags_insert_sender ON public.kudo_hashtags
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.kudos k WHERE k.id = kudo_id AND k.sender_id = auth.uid())
  );
CREATE POLICY kudo_images_insert_sender ON public.kudo_images
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.kudos k WHERE k.id = kudo_id AND k.sender_id = auth.uid())
  );

-- Secret boxes: only owner can read + update own
CREATE POLICY secret_boxes_read_own ON public.secret_boxes
  FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY secret_boxes_update_own ON public.secret_boxes
  FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- Hearts: users only manage their own row. Heart content flows through RPC (below) for atomicity.
CREATE POLICY kudo_hearts_insert_own ON public.kudo_hearts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY kudo_hearts_delete_own ON public.kudo_hearts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Service role has full access
CREATE POLICY profiles_manage_service ON public.profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY departments_manage_service ON public.departments
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY hashtags_manage_service ON public.hashtags
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY kudos_manage_service ON public.kudos
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY kudo_hashtags_manage_service ON public.kudo_hashtags
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY kudo_images_manage_service ON public.kudo_images
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY kudo_hearts_manage_service ON public.kudo_hearts
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY secret_boxes_manage_service ON public.secret_boxes
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY live_kudo_events_manage_service ON public.live_kudo_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- RPC: toggle_kudo_heart(p_kudo_id)
-- Returns: jsonb { liked: bool, count: int }
-- Rules:
--   • user must not be the kudo sender (self-heart rejected)
--   • one heart per (user, kudo) — re-click toggles off
--   • rate-limit ~5 req/s per user (5 rows within 1s window)
--   • value = 2 when event_config.double_heart_active, else 1
--   • adjust receiver.hearts_received_count atomically
-- ============================================================

CREATE OR REPLACE FUNCTION public.toggle_kudo_heart(p_kudo_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_sender_id uuid;
  v_receiver_id uuid;
  v_recent_count int;
  v_double boolean := false;
  v_value smallint;
  v_existing_value smallint;
  v_new_count int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
  END IF;

  SELECT sender_id, receiver_id INTO v_sender_id, v_receiver_id
  FROM public.kudos WHERE id = p_kudo_id;

  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'kudo_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF v_sender_id = v_user_id THEN
    RAISE EXCEPTION 'cannot_heart_own_kudo' USING ERRCODE = 'P0001';
  END IF;

  -- Rate limit: max 5 heart actions in the last 1 second per user
  SELECT COUNT(*) INTO v_recent_count FROM public.kudo_hearts
   WHERE user_id = v_user_id AND created_at > now() - interval '1 second';
  IF v_recent_count >= 5 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  -- Look up existing heart
  SELECT value INTO v_existing_value FROM public.kudo_hearts
   WHERE user_id = v_user_id AND kudo_id = p_kudo_id;

  IF v_existing_value IS NOT NULL THEN
    -- Unlike: remove heart, decrement receiver by the same value that was granted
    DELETE FROM public.kudo_hearts WHERE user_id = v_user_id AND kudo_id = p_kudo_id;
    UPDATE public.kudos SET hearts_count = GREATEST(0, hearts_count - 1) WHERE id = p_kudo_id
      RETURNING hearts_count INTO v_new_count;
    UPDATE public.profiles SET hearts_received_count = GREATEST(0, hearts_received_count - v_existing_value)
      WHERE id = v_receiver_id;

    RETURN jsonb_build_object('liked', false, 'count', v_new_count);
  ELSE
    -- Like: read event config for x2 active, insert heart, increment receiver
    SELECT double_heart_active INTO v_double FROM public.event_config
      WHERE is_active = true ORDER BY updated_at DESC LIMIT 1;
    v_value := CASE WHEN v_double THEN 2 ELSE 1 END;

    INSERT INTO public.kudo_hearts (user_id, kudo_id, value) VALUES (v_user_id, p_kudo_id, v_value);
    UPDATE public.kudos SET hearts_count = hearts_count + 1 WHERE id = p_kudo_id
      RETURNING hearts_count INTO v_new_count;
    UPDATE public.profiles SET hearts_received_count = hearts_received_count + v_value
      WHERE id = v_receiver_id;

    RETURN jsonb_build_object('liked', true, 'count', v_new_count);
  END IF;
END;
$$;

-- ============================================================
-- RPC: open_secret_box(p_box_id)
-- Returns: jsonb { gift_description, stats: { opened, unopened } }
-- ============================================================

CREATE OR REPLACE FUNCTION public.open_secret_box(p_box_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_owner_id uuid;
  v_status text;
  v_gift text;
  v_opened int;
  v_unopened int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
  END IF;

  SELECT owner_id, status, gift_description
    INTO v_owner_id, v_status, v_gift
  FROM public.secret_boxes WHERE id = p_box_id FOR UPDATE;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'box_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF v_owner_id <> v_user_id THEN
    RAISE EXCEPTION 'not_box_owner' USING ERRCODE = 'P0001';
  END IF;

  IF v_status = 'opened' THEN
    RAISE EXCEPTION 'box_already_opened' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.secret_boxes
     SET status = 'opened', opened_at = now()
   WHERE id = p_box_id;

  SELECT
    COUNT(*) FILTER (WHERE status = 'opened'),
    COUNT(*) FILTER (WHERE status = 'unopened')
  INTO v_opened, v_unopened
  FROM public.secret_boxes WHERE owner_id = v_user_id;

  RETURN jsonb_build_object(
    'gift_description', v_gift,
    'stats', jsonb_build_object('opened', v_opened, 'unopened', v_unopened)
  );
END;
$$;

-- Allow authenticated users to call the RPCs
GRANT EXECUTE ON FUNCTION public.toggle_kudo_heart(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_secret_box(uuid) TO authenticated;

-- ============================================================
-- Realtime publication
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.live_kudo_events;

COMMENT ON TABLE public.kudos IS 'Sun* Kudos — thank-you messages between Sunners';
COMMENT ON TABLE public.kudo_hearts IS 'Per-user heart on a kudo (value stored so cancel reverses correctly)';
COMMENT ON TABLE public.live_kudo_events IS 'Fan-out stream consumed by Supabase Realtime for the Spotlight ticker';
