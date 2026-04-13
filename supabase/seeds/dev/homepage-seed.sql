-- ============================================================
-- Homepage SAA — Development Seed Data
-- ============================================================

-- 6 award categories
INSERT INTO public.awards (slug, title, description, image_url, category, display_order) VALUES
  ('top-talent', 'TOP TALENT', 'Vinh danh những cá nhân tài năng xuất sắc nhất năm với những đóng góp nổi bật.', '/assets/homepage/images/award-top-talent.png', 'individual', 1),
  ('top-project', 'TOP PROJECT', 'Ghi nhận những dự án xuất sắc đã tạo nên giá trị vượt trội cho tổ chức.', '/assets/homepage/images/award-top-project.png', 'team', 2),
  ('top-project-leader', 'TOP PROJECT LEADER', 'Tôn vinh những nhà lãnh đạo dự án đã dẫn dắt đội ngũ đến thành công.', '/assets/homepage/images/award-top-project-leader.png', 'individual', 3),
  ('best-manager', 'BEST MANAGER', 'Vinh danh những quản lý xuất sắc với khả năng lãnh đạo và phát triển đội ngũ.', '/assets/homepage/images/award-best-manager.png', 'individual', 4),
  ('signature-creator', 'SIGNATURE CREATOR', 'Ghi nhận những người sáng tạo đã để lại dấu ấn đặc biệt trong năm.', '/assets/homepage/images/award-signature-creator.png', 'individual', 5),
  ('mvp', 'MVP', 'Tôn vinh cá nhân có đóng góp giá trị nhất, là nguồn cảm hứng cho tổ chức.', '/assets/homepage/images/award-mvp.png', 'individual', 6);

-- Sun* Kudos section
INSERT INTO public.kudos_info (label, title, description, detail_url, decoration_image_url) VALUES
  ('Phong trào ghi nhận', 'Sun* Kudos', 'Sun* Kudos là nền tảng ghi nhận và tôn vinh những đóng góp của nhân viên, giúp xây dựng văn hóa biết ơn và động viên trong tổ chức.', '#', '/assets/homepage/images/kudos-decoration.png');

-- Awards extended data (quantity, unit_type, prize_value)
UPDATE public.awards SET quantity = 10, unit_type = 'Đơn vị', prize_value = '7.000.000 VNĐ' WHERE slug = 'top-talent';
UPDATE public.awards SET quantity = 2, unit_type = 'Tập thể', prize_value = '15.000.000 VNĐ' WHERE slug = 'top-project';
UPDATE public.awards SET quantity = 3, unit_type = 'Cá nhân', prize_value = '7.000.000 VNĐ' WHERE slug = 'top-project-leader';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân', prize_value = '10.000.000 VNĐ' WHERE slug = 'best-manager';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân / Tập thể', prize_value = '5.000.000 (cá nhân) / 8.000.000 VNĐ (tập thể)' WHERE slug = 'signature-creator';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân', prize_value = '15.000.000 VNĐ' WHERE slug = 'mvp';

-- Event configuration
INSERT INTO public.event_config (event_name, target_datetime, time_display, venue, stream_note) VALUES
  ('saa-2025', '2026-12-05T18:30:00+07:00', '18h30', 'Nhà hát Lớn Hà Nội', 'Tường thuật trực tiếp tại website');
