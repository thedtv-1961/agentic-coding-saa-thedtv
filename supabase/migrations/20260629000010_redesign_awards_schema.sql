-- Migration 10: Redesign awards schema
-- Split into award_categories (metadata) + awards (instance per category)
-- winner_unit: 1=Cá nhân, 2=Tập thể, 3=Đơn vị, NULL=không áp dụng

-- Step 1: Drop FK from nominations → awards (old schema)
alter table public.nominations
  drop constraint if exists nominations_award_id_fkey;

-- Step 2: Drop old awards table
drop table if exists public.awards cascade;

-- Step 3: Create award_categories
create table public.award_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  image_url   text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.award_categories enable row level security;

create policy "award_categories_read_authenticated"
  on public.award_categories for select to authenticated using (true);

-- Step 4: Create new awards table
create table public.awards (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid not null references public.award_categories(id) on delete cascade,
  number_of_winners integer not null default 1,
  winner_unit       integer, -- 1=Cá nhân, 2=Tập thể, 3=Đơn vị, NULL=không áp dụng
  prize_value       text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.awards enable row level security;

create policy "awards_read_authenticated"
  on public.awards for select to authenticated using (true);

-- Step 5: Restore FK from nominations → awards (new schema)
alter table public.nominations
  add constraint nominations_award_id_fkey
  foreign key (award_id) references public.awards(id);

-- Step 6: Seed award_categories (fixed UUIDs for deterministic ordering)
insert into public.award_categories (id, name, description, image_url) values
  ('a1000000-0000-0000-0000-000000000001',
   'Top Talent',
   'Vinh danh những cá nhân xuất sắc nhất, có thành tích vượt trội và đóng góp nổi bật cho sự phát triển của Sun*.',
   '/images/awards/top-talent.png'),

  ('a1000000-0000-0000-0000-000000000002',
   'Top Project',
   'Ghi nhận những dự án tiêu biểu nhất năm, mang lại giá trị cao cho khách hàng và thể hiện năng lực vượt trội của đội ngũ.',
   '/images/awards/top-project.png'),

  ('a1000000-0000-0000-0000-000000000003',
   'Top Project Leader',
   'Tôn vinh những Project Manager và Tech Lead xuất sắc, có khả năng dẫn dắt đội nhóm đạt kết quả ấn tượng.',
   '/images/awards/top-project-leader.png'),

  ('a1000000-0000-0000-0000-000000000004',
   'Best Manager',
   'Dành cho những quản lý được yêu thích nhất, truyền cảm hứng và tạo môi trường làm việc tích cực cho đội ngũ.',
   '/images/awards/best-manager.png'),

  ('a1000000-0000-0000-0000-000000000005',
   'Signature 2025 - Creator',
   'Tôn vinh những cá nhân hoặc tập thể tạo ra dấu ấn văn hóa đặc sắc, góp phần định hình bản sắc Sun*.',
   '/images/awards/signature-2025-creator.png'),

  ('a1000000-0000-0000-0000-000000000006',
   'MVP (Most Valuable Person)',
   'Giải thưởng cao quý nhất, vinh danh cá nhân có đóng góp vượt trội, tạo ra tác động lớn nhất cho Sun* trong năm.',
   '/images/awards/mvp.png');

-- Step 7: Seed awards (one award per category, data from Figma design)
insert into public.awards (category_id, number_of_winners, winner_unit, prize_value) values
  ('a1000000-0000-0000-0000-000000000001', 10, 3, '7.000.000 VNĐ cho mỗi giải thưởng'),
  ('a1000000-0000-0000-0000-000000000002',  2, 2, '15.000.000 VNĐ mỗi giải'),
  ('a1000000-0000-0000-0000-000000000003',  3, 1, '7.000.000 VNĐ'),
  ('a1000000-0000-0000-0000-000000000004',  1, 1, '10.000.000 VNĐ'),
  ('a1000000-0000-0000-0000-000000000005',  1, null, '5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể)'),
  ('a1000000-0000-0000-0000-000000000006',  1, null, '15.000.000 VNĐ');
