-- ============================================================
-- Dev-only helper: attach seed demo data (kudos, hearts, secret boxes)
-- to whichever new user signs in — so a `supabase db reset` + login
-- cycle immediately shows a populated dashboard without editing the
-- hardcoded UID in kudos-seed.sql.
--
-- Guarded by the presence of synthetic seed profiles (ids starting
-- with 33333333-…). In production those rows don't exist so the
-- attach is a no-op.
-- ============================================================

CREATE OR REPLACE FUNCTION public.attach_demo_data_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_dev boolean;
  v_dept uuid := '11111111-1111-1111-1111-111111111102'; -- CECV2
  v_has_data boolean;
BEGIN
  -- Are we in a dev/seeded environment?
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = '33333333-3333-3333-3333-333333333301'
  ) INTO v_is_dev;
  IF NOT v_is_dev THEN
    RETURN;
  END IF;

  -- Idempotent — bail if this user already has any demo kudos.
  SELECT EXISTS(
    SELECT 1 FROM public.kudos
     WHERE sender_id = p_user_id OR receiver_id = p_user_id
  ) INTO v_has_data;
  IF v_has_data THEN
    RETURN;
  END IF;

  -- Give the new user a non-default department + badge so UI looks populated
  UPDATE public.profiles
     SET department_id = v_dept,
         hoa_thi_level = 2,
         danh_hieu     = 'Super Hero'
   WHERE id = p_user_id;

  -- 6 kudos: 3 sent by this user, 3 received
  INSERT INTO public.kudos (sender_id, receiver_id, content, department_id, hearts_count, created_at) VALUES
    (p_user_id, '33333333-3333-3333-3333-333333333302', 'Cảm ơn anh Chức đã hỗ trợ mình triển khai sprint này!', v_dept, 12, now() - interval '3 hours'),
    (p_user_id, '33333333-3333-3333-3333-333333333303', 'Thanks Hiệp vì buổi code review rất chi tiết.',            v_dept,  5, now() - interval '9 hours'),
    (p_user_id, '33333333-3333-3333-3333-333333333305', 'Cảm ơn chị Thúy về feedback siêu hữu ích.',                v_dept,  3, now() - interval '1 day 2 hours'),
    ('33333333-3333-3333-3333-333333333302', p_user_id, 'Cảm ơn bạn đã ship đúng hạn phần Kudos Live Board 🎉',   v_dept, 27, now() - interval '30 minutes'),
    ('33333333-3333-3333-3333-333333333303', p_user_id, 'Kudo cho bạn vì luôn chủ động refactor code chung.',       v_dept, 14, now() - interval '5 hours'),
    ('33333333-3333-3333-3333-333333333306', p_user_id, 'Best teammate của quý này!',                                v_dept,  9, now() - interval '22 hours');

  -- A few hearts from this user on pre-existing seed kudos (history + votes)
  INSERT INTO public.kudo_hearts (user_id, kudo_id, value)
  SELECT p_user_id, k.id, 1
    FROM public.kudos k
   WHERE k.id IN (
     '44444444-4444-4444-4444-444444444401',
     '44444444-4444-4444-4444-444444444405'
   )
  ON CONFLICT DO NOTHING;

  -- Secret boxes: 2 unopened so Mở quà is enabled + 1 opened so D.3 shows the user
  INSERT INTO public.secret_boxes (owner_id, status, gift_description, opened_at) VALUES
    (p_user_id, 'unopened', 'Voucher 200K Highlands', NULL),
    (p_user_id, 'unopened', 'Hộp Lego Sun*',           NULL),
    (p_user_id, 'opened',   'Áo phông SAA 2025',       now() - interval '2 hours');
END;
$$;

COMMENT ON FUNCTION public.attach_demo_data_for IS
  'Dev-only helper — populates a new profile with kudos, hearts, and secret boxes so the /kudos screen has data after supabase db reset + login. Guarded by existence of synthetic seed profiles.';

-- Extend the existing handle_new_auth_user trigger function so every fresh
-- sign-in gets the demo data in dev without manual UID editing.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_display_name text;
  v_avatar_url text;
BEGIN
  v_display_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(COALESCE(NEW.email, 'Sunner'), '@', 1)
  );
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture',
    '/assets/kudos/images/avatar-placeholder.svg'
  );

  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, v_display_name, v_avatar_url)
  ON CONFLICT (id) DO NOTHING;

  -- Dev-only: attach demo data on the FIRST real sign-in. Skip for synthetic
  -- seed users (UIDs prefixed 33333333-…) because the kudos-seed.sql inserts
  -- their auth.users rows before the dev data is fully in place.
  IF NEW.id::text NOT LIKE '33333333-%' THEN
    PERFORM public.attach_demo_data_for(NEW.id);
  END IF;

  RETURN NEW;
END;
$$;
