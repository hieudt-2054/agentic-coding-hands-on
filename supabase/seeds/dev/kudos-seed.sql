-- ============================================================
-- Sun* Kudos — Development Seed Data
-- ============================================================

-- Synthetic auth.users so the profiles.id FK is satisfied during dev seeding.
-- These rows are bypassed by real Google-OAuth sign-ins (different ids).
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user, is_anonymous, confirmation_token, recovery_token,
  email_change_token_new, email_change, reauthentication_token, email_change_token_current
) VALUES
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333301', 'authenticated', 'authenticated', 'xuan.huynh@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333302', 'authenticated', 'authenticated', 'chuc.nguyen@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333303', 'authenticated', 'authenticated', 'hiep.do@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333304', 'authenticated', 'authenticated', 'an.duong@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333305', 'authenticated', 'authenticated', 'thuy.mai@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333306', 'authenticated', 'authenticated', 'linh.nguyen@sun-seed.local', '', now(), now(), now(), '{"provider":"google"}'::jsonb, '{}'::jsonb, false, false, false, '', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO public.departments (id, name) VALUES
  ('11111111-1111-1111-1111-111111111101', 'CECV1'),
  ('11111111-1111-1111-1111-111111111102', 'CECV2'),
  ('11111111-1111-1111-1111-111111111103', 'CECV3'),
  ('11111111-1111-1111-1111-111111111104', 'CECJ1'),
  ('11111111-1111-1111-1111-111111111105', 'CECJ2'),
  ('11111111-1111-1111-1111-111111111106', 'PMO')
ON CONFLICT DO NOTHING;

-- Hashtags
INSERT INTO public.hashtags (id, slug, label) VALUES
  ('22222222-2222-2222-2222-222222222201', 'dedicated', '#Dedicated'),
  ('22222222-2222-2222-2222-222222222202', 'inspring', '#Inspring'),
  ('22222222-2222-2222-2222-222222222203', 'idol-gioi-tre', '#IdolGioiTre'),
  ('22222222-2222-2222-2222-222222222204', 'teamwork', '#Teamwork'),
  ('22222222-2222-2222-2222-222222222205', 'innovation', '#Innovation'),
  ('22222222-2222-2222-2222-222222222206', 'customer-first', '#CustomerFirst'),
  ('22222222-2222-2222-2222-222222222207', 'growth', '#Growth'),
  ('22222222-2222-2222-2222-222222222208', 'humble', '#Humble'),
  ('22222222-2222-2222-2222-222222222209', 'mentor', '#Mentor'),
  ('22222222-2222-2222-2222-222222222210', 'shipping', '#Shipping')
ON CONFLICT DO NOTHING;

-- Profiles (we create 6 synthetic ones — in production these come from auth.users)
-- Note: in local dev you'd sign up real users first; the seed below is tolerant of missing auth.users
-- by using service_role (which bypasses FK to auth.users.id through the RLS policies above).
-- For local Supabase CLI, run `supabase db reset` after you have at least one auth.users row,
-- or relax the FK (temporarily) if you want seed-only local demos.

INSERT INTO public.profiles (
  id, display_name, avatar_url, department_id, hoa_thi_level, danh_hieu,
  kudos_received_count, kudos_sent_count, hearts_received_count
) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Huỳnh Dương Xuân', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111102', 1, 'Rising Hero', 12, 4, 45),
  ('33333333-3333-3333-3333-333333333302', 'Nguyễn Bá Chức', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111102', 3, 'Legend Hero', 58, 10, 212),
  ('33333333-3333-3333-3333-333333333303', 'Đỗ Hoàng Hiệp', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111101', 2, 'Super Hero', 23, 6, 88),
  ('33333333-3333-3333-3333-333333333304', 'Dương Thúy An', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111104', 0, 'New Hero', 5, 12, 18),
  ('33333333-3333-3333-3333-333333333305', 'Mai Phương Thúy', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111103', 1, 'Rising Hero', 14, 8, 51),
  ('33333333-3333-3333-3333-333333333306', 'Nguyễn Hoàng Linh', '/assets/kudos/images/avatar-placeholder.svg', '11111111-1111-1111-1111-111111111105', 2, 'Super Hero', 22, 5, 84)
ON CONFLICT DO NOTHING;

-- Kudos (12)
INSERT INTO public.kudos (id, sender_id, receiver_id, content, department_id, hearts_count, created_at) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', '33333333-3333-3333-3333-333333333302', 'Cảm ơn anh Chức đã chia sẻ kinh nghiệm leader nhiệt tình trong retro tuần này — cả team học được rất nhiều.', '11111111-1111-1111-1111-111111111102', 1000, now() - interval '2 hours'),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333303', '33333333-3333-3333-3333-333333333302', 'Cảm ơn anh đã kéo cả PRs của tôi trong tuần sát deadline — đúng nghĩa Super Hero.', '11111111-1111-1111-1111-111111111102', 820, now() - interval '6 hours'),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333304', '33333333-3333-3333-3333-333333333305', 'Cảm ơn chị An đã review code siêu kỹ, em học hỏi được nhiều!', '11111111-1111-1111-1111-111111111103', 450, now() - interval '10 hours'),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333306', '33333333-3333-3333-3333-333333333301', 'Cảm ơn Xuân đã support demo session — nhờ có bạn mà khách hàng thấy được giá trị team.', '11111111-1111-1111-1111-111111111105', 310, now() - interval '14 hours'),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', '33333333-3333-3333-3333-333333333303', 'Cảm ơn em đã chủ động viết documentation, future-you cảm ơn em rất nhiều.', '11111111-1111-1111-1111-111111111101', 280, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333305', '33333333-3333-3333-3333-333333333304', 'Cảm ơn An đã tổ chức buổi knowledge sharing tuần trước — thông tin rất thiết thực.', '11111111-1111-1111-1111-111111111104', 200, now() - interval '1 day 4 hours'),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333301', '33333333-3333-3333-3333-333333333306', 'Cảm ơn bạn đã giúp fix production incident đêm qua.', '11111111-1111-1111-1111-111111111105', 180, now() - interval '1 day 12 hours'),
  ('44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333302', '33333333-3333-3333-3333-333333333305', 'Cảm ơn Thúy luôn nhiệt tình đón tiếp intern mới.', '11111111-1111-1111-1111-111111111103', 150, now() - interval '2 days'),
  ('44444444-4444-4444-4444-444444444409', '33333333-3333-3333-3333-333333333303', '33333333-3333-3333-3333-333333333301', 'Ngày nào cũng commit sớm nhất team — cảm ơn Xuân!', '11111111-1111-1111-1111-111111111102', 120, now() - interval '2 days 6 hours'),
  ('44444444-4444-4444-4444-444444444410', '33333333-3333-3333-3333-333333333304', '33333333-3333-3333-3333-333333333302', 'Cảm ơn anh đã là mentor tận tâm trong suốt quý vừa qua.', '11111111-1111-1111-1111-111111111102', 95, now() - interval '3 days'),
  ('44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333306', '33333333-3333-3333-3333-333333333304', 'Cảm ơn An đã giúp debug vụ API rate limiting trong tuần.', '11111111-1111-1111-1111-111111111104', 70, now() - interval '3 days 8 hours'),
  ('44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333305', '33333333-3333-3333-3333-333333333306', 'Cảm ơn Linh đã chia sẻ deck về Realtime architecture, mình nâng cấp được ngay.', '11111111-1111-1111-1111-111111111105', 45, now() - interval '4 days')
ON CONFLICT DO NOTHING;

-- Kudo ↔ Hashtag relations
INSERT INTO public.kudo_hashtags (kudo_id, hashtag_id) VALUES
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201'),
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222202'),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222204'),
  ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222205'),
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222206'),
  ('44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222207'),
  ('44444444-4444-4444-4444-444444444406', '22222222-2222-2222-2222-222222222209'),
  ('44444444-4444-4444-4444-444444444407', '22222222-2222-2222-2222-222222222201'),
  ('44444444-4444-4444-4444-444444444408', '22222222-2222-2222-2222-222222222208'),
  ('44444444-4444-4444-4444-444444444409', '22222222-2222-2222-2222-222222222210'),
  ('44444444-4444-4444-4444-444444444410', '22222222-2222-2222-2222-222222222203'),
  ('44444444-4444-4444-4444-444444444412', '22222222-2222-2222-2222-222222222205')
ON CONFLICT DO NOTHING;

-- Hearts (sample — 15 votes on various kudos from various voters)
INSERT INTO public.kudo_hearts (user_id, kudo_id, value) VALUES
  ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444402', 1),
  ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444403', 1),
  ('33333333-3333-3333-3333-333333333302', '44444444-4444-4444-4444-444444444403', 1),
  ('33333333-3333-3333-3333-333333333303', '44444444-4444-4444-4444-444444444401', 2),
  ('33333333-3333-3333-3333-333333333304', '44444444-4444-4444-4444-444444444401', 1),
  ('33333333-3333-3333-3333-333333333304', '44444444-4444-4444-4444-444444444407', 1),
  ('33333333-3333-3333-3333-333333333305', '44444444-4444-4444-4444-444444444401', 1),
  ('33333333-3333-3333-3333-333333333305', '44444444-4444-4444-4444-444444444402', 1),
  ('33333333-3333-3333-3333-333333333306', '44444444-4444-4444-4444-444444444401', 1),
  ('33333333-3333-3333-3333-333333333306', '44444444-4444-4444-4444-444444444405', 1),
  ('33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444408', 1),
  ('33333333-3333-3333-3333-333333333302', '44444444-4444-4444-4444-444444444406', 1),
  ('33333333-3333-3333-3333-333333333303', '44444444-4444-4444-4444-444444444404', 1),
  ('33333333-3333-3333-3333-333333333304', '44444444-4444-4444-4444-444444444410', 1),
  ('33333333-3333-3333-3333-333333333305', '44444444-4444-4444-4444-444444444411', 1)
ON CONFLICT DO NOTHING;

-- Secret Boxes
INSERT INTO public.secret_boxes (id, owner_id, status, gift_description, opened_at) VALUES
  ('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', 'unopened', 'Áo phông SAA 2025', NULL),
  ('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', 'opened', 'Sổ tay Sun*', now() - interval '1 day'),
  ('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333302', 'unopened', 'Voucher Starbucks', NULL),
  ('55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333303', 'unopened', 'Tai nghe Bluetooth', NULL),
  ('55555555-5555-5555-5555-555555555505', '33333333-3333-3333-3333-333333333304', 'opened', 'Bình giữ nhiệt', now() - interval '6 hours')
ON CONFLICT DO NOTHING;

-- A handful of images to exercise the gallery
INSERT INTO public.kudo_images (kudo_id, url, position) VALUES
  ('44444444-4444-4444-4444-444444444401', '/assets/homepage/images/kudos-decoration.png', 0),
  ('44444444-4444-4444-4444-444444444401', '/assets/homepage/images/kudos-decoration.png', 1),
  ('44444444-4444-4444-4444-444444444402', '/assets/homepage/images/kudos-decoration.png', 0)
ON CONFLICT DO NOTHING;

-- Ensure the event_config row we extended actually has the new values
UPDATE public.event_config
  SET double_heart_active = false, highlight_limit = 5
  WHERE is_active = true;

-- ============================================================
-- Real user demo data
-- If a developer's Google OAuth profile exists (via the auto-create
-- trigger in 20260420130000_auto_create_profile.sql), give them
-- something to see on the sidebar.
-- ============================================================

-- Note: per-user demo data is attached automatically on sign-in via the
-- `handle_new_auth_user` trigger (see migration 20260420140000_attach_demo_data.sql).
-- No hardcoded UID needed here — just `supabase db reset` + log in via Google
-- and the next profile row will get 6 kudos + 2 unopened boxes automatically.

-- Top-recipients list needs several opened boxes WITH real profiles.
-- Add a few more opened boxes for the synthetic seed users so D.3 renders ≥5 rows.
INSERT INTO public.secret_boxes (id, owner_id, status, gift_description, opened_at) VALUES
  ('55555555-5555-5555-5555-555555555506', '33333333-3333-3333-3333-333333333302', 'opened', 'Áo phông SAA 2025', now() - interval '15 minutes'),
  ('55555555-5555-5555-5555-555555555507', '33333333-3333-3333-3333-333333333303', 'opened', 'Voucher 500K cafe',   now() - interval '45 minutes'),
  ('55555555-5555-5555-5555-555555555508', '33333333-3333-3333-3333-333333333305', 'opened', 'Tai nghe Bluetooth',  now() - interval '1 hour 30 minutes'),
  ('55555555-5555-5555-5555-555555555509', '33333333-3333-3333-3333-333333333306', 'opened', 'Bình giữ nhiệt',      now() - interval '3 hours'),
  ('55555555-5555-5555-5555-555555555510', '33333333-3333-3333-3333-333333333301', 'opened', 'Sổ tay Sun* 2025',    now() - interval '4 hours')
ON CONFLICT (id) DO NOTHING;
