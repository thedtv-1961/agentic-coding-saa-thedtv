-- Migration 13: Full redesign — integer PKs + bigint prize_value, seed from CSV
-- award_categories.id: bigint (explicit 1–6)
-- awards.id: bigserial (auto)
-- awards.prize_value: bigint (raw VNĐ)
-- winner_unit: 1=Cá nhân, 2=Tập thể

-- Step 1: Remove nominations FK + award_id column (will be re-added as bigint)
-- CASCADE drops dependent indexes: idx_nominations_award_id, idx_nominations_period_award
alter table public.nominations
  drop constraint if exists nominations_award_id_fkey;
alter table public.nominations
  drop constraint if exists nominations_unique_per_award;
alter table public.nominations
  drop column if exists award_id cascade;

-- Step 2: Drop old tables
drop table if exists public.awards;
drop table if exists public.award_categories;

-- Step 3: award_categories — bigint PK, all columns from CSV
create table public.award_categories (
  id          bigint primary key,
  name        text        not null,
  title       text        not null default '',
  description text        not null default '',
  content     text        not null default '',
  image_url   text        not null default '',
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.award_categories enable row level security;
create policy "award_categories_read_authenticated"
  on public.award_categories for select to authenticated using (true);

-- Step 4: awards — bigserial PK, bigint prize_value
create table public.awards (
  id                bigserial   primary key,
  category_id       bigint      not null references public.award_categories(id) on delete cascade,
  number_of_winners integer     not null default 1,
  winner_unit       integer,             -- 1=Cá nhân, 2=Tập thể
  prize_value       bigint      not null default 0,  -- in VNĐ
  is_active         boolean     not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.awards enable row level security;
create policy "awards_read_authenticated"
  on public.awards for select to authenticated using (true);

-- Step 5: Restore award_id in nominations (bigint FK) + recreate indexes
alter table public.nominations
  add column award_id bigint not null references public.awards(id);
alter table public.nominations
  add constraint nominations_unique_per_award
  unique (period_id, award_id, nominator_id);
create index idx_nominations_award_id on public.nominations(award_id);
create index idx_nominations_period_award on public.nominations(period_id, award_id);

-- Step 6: Seed award_categories from data-csv/award_categories.csv
insert into public.award_categories (id, name, title, description, content, image_url, is_active) values
(1,
 'Top Talent',
 'Top Talent',
 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',
 'Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.',
 '/images/awards/top-talent.png',
 true),

(2,
 'Top Project',
 'Top Project',
 'Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật',
 'Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.',
 '/images/awards/top-project.png',
 true),

(3,
 'Top Project Leader',
 'Top Project Leader',
 'Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá',
 'Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy "Aim High – Be Agile" trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.',
 '/images/awards/top-project-leader.png',
 true),

(4,
 'Best Manager',
 'Best Manager',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.',
 '/images/awards/best-manager.png',
 true),

(5,
 'Signature 2025 Creator',
 'Signature 2025 – Creator',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ. Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.',
 '/images/awards/signature-2025-creator.png',
 true),

(6,
 'MVP',
 'MVP (Most Valuable Person)',
 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
 'Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua. Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.',
 '/images/awards/mvp.png',
 true);

-- Step 7: Seed awards from data-csv/awards.csv
-- Signature (category 5) has 2 rows: one per winner_unit (1=Cá nhân, 2=Tập thể)
insert into public.awards (category_id, number_of_winners, winner_unit, prize_value, is_active) values
(1, 10, 1, 7000000,  true),
(2,  2, 2, 15000000, true),
(3,  3, 1, 7000000,  true),
(4,  1, 1, 10000000, true),
(5,  1, 1, 5000000,  true),
(5,  1, 2, 8000000,  true),
(6,  1, 1, 15000000, true);
