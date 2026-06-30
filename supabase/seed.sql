-- Seed file: chạy tự động sau supabase db reset (local dev only)
-- Tạo test users nếu profiles table rỗng

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
