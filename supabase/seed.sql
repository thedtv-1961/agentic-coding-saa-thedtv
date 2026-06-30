-- Seed file: chạy tự động sau supabase db reset (local dev only)
-- Seed data mặc định cho: app_settings, hashtags, award_categories, awards, profiles

-- ── app_settings ──────────────────────────────────────────────────────────────
-- DO UPDATE để đảm bảo seed value luôn thắng migration value
INSERT INTO public.app_settings (key, value) VALUES
  ('countdown_date',     '2025-12-20T00:00:00+07:00'),
  ('nomination_enabled', 'false')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ── hashtags ──────────────────────────────────────────────────────────────────
INSERT INTO public.hashtags (name) VALUES
  ('#Teamwork'), ('#Innovation'), ('#Leadership'), ('#CustomerFirst'),
  ('#Growth'), ('#Ownership'), ('#Excellence'), ('#Collaboration'),
  ('#Integrity'), ('#Impact')
ON CONFLICT (name) DO NOTHING;

-- ── award_categories ──────────────────────────────────────────────────────────
INSERT INTO public.award_categories (id, name, title, description, content, image_url, is_active) VALUES
(1, 'Top Talent', 'Top Talent',
 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',
 'Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng.',
 '/images/awards/top-talent.png', true),
(2, 'Top Project', 'Top Project',
 'Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật',
 'Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm.',
 '/images/awards/top-project.png', true),
(3, 'Top Project Leader', 'Top Project Leader',
 'Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá',
 'Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ.',
 '/images/awards/top-project-leader.png', true),
(4, 'Best Manager', 'Best Manager',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng.',
 '/images/awards/best-manager.png', true),
(5, 'Signature 2025 Creator', 'Signature 2025 – Creator',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.',
 '/images/awards/signature-2025-creator.png', true),
(6, 'MVP', 'MVP (Most Valuable Person)',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*.',
 '/images/awards/mvp.png', true)
ON CONFLICT (id) DO NOTHING;

-- ── awards ────────────────────────────────────────────────────────────────────
-- Chỉ seed nếu bảng rỗng (migrations đã seed khi chạy lần đầu)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.awards LIMIT 1) THEN
    INSERT INTO public.awards (category_id, number_of_winners, winner_unit, prize_value, is_active) VALUES
    (1, 10, 1, 7000000,  true),
    (2,  2, 2, 15000000, true),
    (3,  3, 1, 7000000,  true),
    (4,  1, 1, 10000000, true),
    (5,  1, 1, 5000000,  true),
    (5,  1, 2, 8000000,  true),
    (6,  1, 1, 15000000, true);
  END IF;
END $$;

-- ── profiles (test users — local dev only) ────────────────────────────────────
DO $$
DECLARE
  v_admin_id  uuid := '00000000-aaaa-0000-0000-000000000001';
  v_user1_id  uuid := '00000000-aaaa-0000-0000-000000000002';
  v_user2_id  uuid := '00000000-aaaa-0000-0000-000000000003';
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN
    RAISE NOTICE 'profiles table đã có data — bỏ qua seed.';
    RETURN;
  END IF;

  -- Insert vào auth.users (trigger on_auth_user_created tự tạo profiles)
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, confirmation_sent_at,
    raw_user_meta_data,
    created_at, updated_at
  ) VALUES
    (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@sun-asterisk.com',
      crypt('password123', gen_salt('bf')),
      now(), now(),
      '{"full_name": "Admin SAA", "avatar_url": null}'::jsonb,
      now(), now()
    ),
    (
      v_user1_id,
      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'user1@sun-asterisk.com',
      crypt('password123', gen_salt('bf')),
      now(), now(),
      '{"full_name": "Nguyễn Văn A", "avatar_url": null}'::jsonb,
      now(), now()
    ),
    (
      v_user2_id,
      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'user2@sun-asterisk.com',
      crypt('password123', gen_salt('bf')),
      now(), now(),
      '{"full_name": "Trần Thị B", "avatar_url": null}'::jsonb,
      now(), now()
    );

  -- Set admin role (trigger đã tạo profiles với role='user' mặc định)
  UPDATE public.profiles SET role = 'admin' WHERE id = v_admin_id;

  RAISE NOTICE 'Seeded 3 users: admin@, user1@, user2@ (password: password123)';
END $$;
