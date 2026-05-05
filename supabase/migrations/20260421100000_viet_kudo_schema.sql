-- ============================================================
-- Viết Kudo (ihQ26W78P2) — Schema Extension
-- Extends public.kudos with: danh_hieu, is_anonymous, content_html
-- Adds: kudo_mentions, kudo_feed_v, create_kudo RPC, kudos-images Storage
-- ============================================================

-- --------------------------------------------------------
-- 1. Extend public.kudos table
-- --------------------------------------------------------
ALTER TABLE public.kudos
  ADD COLUMN IF NOT EXISTS danh_hieu text NOT NULL DEFAULT 'Ghi nhận',
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS content_html text NOT NULL DEFAULT '';

-- Back-fill existing rows with content as content_html where empty
UPDATE public.kudos
  SET content_html = content
  WHERE content_html = '';

-- Add CHECK constraints
ALTER TABLE public.kudos
  ADD CONSTRAINT kudos_danh_hieu_length
    CHECK (length(danh_hieu) BETWEEN 1 AND 60);

-- --------------------------------------------------------
-- 2. kudo_mentions table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kudo_mentions (
  kudo_id uuid NOT NULL REFERENCES public.kudos (id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  PRIMARY KEY (kudo_id, mentioned_user_id)
);

ALTER TABLE public.kudo_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY kudo_mentions_read_authenticated ON public.kudo_mentions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY kudo_mentions_insert_service ON public.kudo_mentions
  FOR INSERT TO service_role WITH CHECK (true);

-- --------------------------------------------------------
-- 3. kudo_feed_v — anonymous-safe read view
-- --------------------------------------------------------
CREATE OR REPLACE VIEW public.kudo_feed_v AS
SELECT
  k.id,
  k.receiver_id,
  k.department_id,
  k.content,
  k.content_html,
  k.danh_hieu,
  k.is_anonymous,
  k.hearts_count,
  k.created_at,
  CASE WHEN k.is_anonymous THEN NULL ELSE k.sender_id END AS sender_id
FROM public.kudos k;

GRANT SELECT ON public.kudo_feed_v TO authenticated;

-- --------------------------------------------------------
-- 4. create_kudo RPC
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_kudo(
  p_receiver_id uuid,
  p_danh_hieu text,
  p_content_html text,
  p_hashtag_slugs text[],
  p_image_urls jsonb,
  p_is_anonymous boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_sender_id uuid;
  v_new_id uuid;
  v_created_at timestamptz;
  v_plain_content text;
  v_hashtag_slug text;
  v_hashtag_id uuid;
  v_image jsonb;
  v_mention_id uuid;
  v_mention_match text;
BEGIN
  -- 1. Auth check
  v_sender_id := auth.uid();
  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = 'P0001';
  END IF;

  -- 2. Self-send check
  IF p_receiver_id = v_sender_id THEN
    RAISE EXCEPTION 'invalid_receiver' USING ERRCODE = 'P0001';
  END IF;

  -- 3. Rate limit: max 10 kudos per hour per sender
  IF (
    SELECT COUNT(*) FROM public.kudos
    WHERE sender_id = v_sender_id
      AND created_at > now() - interval '1 hour'
  ) >= 10 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  -- 4. Duplicate guard: same sender+receiver+content hash within 60 seconds
  IF EXISTS (
    SELECT 1 FROM public.kudos
    WHERE sender_id = v_sender_id
      AND receiver_id = p_receiver_id
      AND md5(content_html) = md5(p_content_html)
      AND created_at > now() - interval '60 seconds'
  ) THEN
    RAISE EXCEPTION 'duplicate' USING ERRCODE = 'P0001';
  END IF;

  -- 5. Strip tags to produce plain-text content
  v_plain_content := regexp_replace(p_content_html, '<[^>]+>', '', 'g');

  -- 6. INSERT kudo row
  INSERT INTO public.kudos (
    sender_id, receiver_id, danh_hieu,
    content, content_html, is_anonymous,
    hearts_count, created_at
  )
  VALUES (
    v_sender_id, p_receiver_id, p_danh_hieu,
    v_plain_content, p_content_html, COALESCE(p_is_anonymous, false),
    0, now()
  )
  RETURNING id, created_at INTO v_new_id, v_created_at;

  -- 7. Upsert hashtags + insert join rows
  IF p_hashtag_slugs IS NOT NULL THEN
    FOREACH v_hashtag_slug IN ARRAY p_hashtag_slugs LOOP
      -- Upsert: create hashtag if it doesn't exist
      INSERT INTO public.hashtags (slug, label)
      VALUES (v_hashtag_slug, '#' || v_hashtag_slug)
      ON CONFLICT (slug) DO NOTHING;

      SELECT id INTO v_hashtag_id FROM public.hashtags WHERE slug = v_hashtag_slug;

      IF v_hashtag_id IS NOT NULL THEN
        INSERT INTO public.kudo_hashtags (kudo_id, hashtag_id)
        VALUES (v_new_id, v_hashtag_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 8. Insert image rows from JSON array [{ url, path, position }]
  IF p_image_urls IS NOT NULL AND jsonb_array_length(p_image_urls) > 0 THEN
    FOR v_image IN SELECT * FROM jsonb_array_elements(p_image_urls) LOOP
      INSERT INTO public.kudo_images (kudo_id, url, position)
      VALUES (
        v_new_id,
        v_image->>'url',
        (v_image->>'position')::smallint
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- 9. Extract mention IDs from content_html (data-mention-id attributes)
  FOR v_mention_match IN
    SELECT (regexp_matches(p_content_html, 'data-mention-id="([0-9a-f-]{36})"', 'g'))[1]
  LOOP
    BEGIN
      v_mention_id := v_mention_match::uuid;
      INSERT INTO public.kudo_mentions (kudo_id, mentioned_user_id)
      VALUES (v_new_id, v_mention_id)
      ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      NULL; -- skip invalid UUIDs
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_new_id,
    'created_at', v_created_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_kudo(uuid, text, text, text[], jsonb, boolean) TO authenticated;

-- --------------------------------------------------------
-- 5. kudos-images Storage bucket + RLS
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kudos-images',
  'kudos-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (storage.objects table)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kudos_images_read'
  ) THEN
    CREATE POLICY kudos_images_read ON storage.objects
      FOR SELECT TO authenticated
      USING (bucket_id = 'kudos-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kudos_images_insert_own'
  ) THEN
    CREATE POLICY kudos_images_insert_own ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'kudos-images' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'kudos_images_delete_own'
  ) THEN
    CREATE POLICY kudos_images_delete_own ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'kudos-images' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

-- --------------------------------------------------------
-- Notes on daily GC for orphan images
-- --------------------------------------------------------
-- Run daily (e.g. via pg_cron or Supabase Edge Function schedule):
--
-- DELETE FROM storage.objects so
-- WHERE so.bucket_id = 'kudos-images'
--   AND so.created_at < now() - interval '24 hours'
--   AND NOT EXISTS (
--     SELECT 1 FROM public.kudo_images ki
--     WHERE ki.url LIKE '%' || so.name
--   );
