-- Add recipient_label to distinguish unit types (Đơn vị / Cá nhân / Tập thể)
alter table public.awards
  add column if not exists recipient_label text;

-- Update seed data to match Figma design specs
-- Source: items_analysis.md (D.1–D.6)
update public.awards set
  title           = 'Top Talent',
  recipient_count = 10,
  recipient_label = 'Đơn vị',
  award_value     = '7.000.000 VNĐ cho mỗi giải thưởng'
where category = 'top_talent';

update public.awards set
  title           = 'Top Project',
  recipient_count = 2,
  recipient_label = 'Tập thể',
  award_value     = '15.000.000 VNĐ mỗi giải'
where category = 'top_project';

update public.awards set
  title           = 'Top Project Leader',
  recipient_count = 3,
  recipient_label = 'Cá nhân',
  award_value     = '7.000.000 VNĐ'
where category = 'top_project_leader';

update public.awards set
  title           = 'Best Manager',
  recipient_count = 1,
  recipient_label = 'Cá nhân',
  award_value     = '10.000.000 VNĐ'
where category = 'best_manager';

update public.awards set
  title           = 'Signature 2025 - Creator',
  recipient_count = 1,
  recipient_label = null,
  award_value     = '5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể)'
where category = 'signature_creator';

update public.awards set
  title           = 'MVP (Most Valuable Person)',
  recipient_count = 1,
  recipient_label = null,
  award_value     = '15.000.000 VNĐ'
where category = 'mvp';
