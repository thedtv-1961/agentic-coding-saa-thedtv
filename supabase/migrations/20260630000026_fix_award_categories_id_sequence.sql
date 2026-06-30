-- award_categories.id is bigint with no default — add a sequence so inserts auto-generate the PK.
create sequence if not exists public.award_categories_id_seq;

alter table public.award_categories
  alter column id set default nextval('public.award_categories_id_seq');

-- Align the sequence with the highest existing id so it does not collide.
select setval(
  'public.award_categories_id_seq',
  coalesce((select max(id) from public.award_categories), 0) + 1,
  false
);
