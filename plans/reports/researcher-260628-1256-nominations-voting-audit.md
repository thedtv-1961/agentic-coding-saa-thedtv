# Schema Research: Nominations, Voting, Audit & App Settings

**Date:** 2026-06-28 | Stack: PostgreSQL / Supabase

---

## 1. Nominations & Voting Schema

```sql
create table nominations (
  id            uuid primary key default gen_random_uuid(),
  award_id      uuid not null references awards(id),
  nominator_id  uuid not null references profiles(id),
  nominee_id    uuid not null references profiles(id),
  reason        text,
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references profiles(id),
  constraint no_self_nomination check (nominator_id <> nominee_id),
  constraint unique_nomination unique (award_id, nominator_id, nominee_id)
);

create table votes (
  id             uuid primary key default gen_random_uuid(),
  award_id       uuid not null references awards(id),
  voter_id       uuid not null references profiles(id),
  nomination_id  uuid not null references nominations(id),
  created_at     timestamptz not null default now(),
  constraint unique_vote unique (award_id, voter_id)
);
```

### Constraints
| Rule | Enforcement |
|---|---|
| No self-nomination | `CHECK (nominator_id <> nominee_id)` |
| 1 nomination per nominator per award | `UNIQUE (award_id, nominator_id, nominee_id)` |
| 1 vote per user per award | `UNIQUE (award_id, voter_id)` |
| Period gates | Application layer (Server Action) |

### RLS
```sql
-- nominations: insert own, read approved
create policy "anyone can nominate" on nominations for insert
  to authenticated with check (auth.uid() = nominator_id);
create policy "read approved nominations" on nominations for select
  to authenticated using (status = 'approved');
create policy "admin manages nominations" on nominations for all
  to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- votes: insert own, read own (admin sees all)
create policy "insert own vote" on votes for insert
  to authenticated with check (auth.uid() = voter_id);
create policy "read own vote" on votes for select
  to authenticated using (auth.uid() = voter_id);
create policy "admin reads all votes" on votes for select
  to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
```

---

## 2. Audit Log — supa_audit Extension

**Recommendation:** supa_audit (trigger-based, schema-agnostic JSONB).

```sql
create extension supa_audit cascade;

select audit.enable_tracking('public.kudos'::regclass);
select audit.enable_tracking('public.nominations'::regclass);
select audit.enable_tracking('public.votes'::regclass);
select audit.enable_tracking('public.app_settings'::regclass);
```

Tables to audit: `kudos`, `nominations`, `votes`, `app_settings`.

---

## 3. App Settings Extended Seeds

```sql
insert into app_settings (key, value) values
  ('countdown_date',    '2025-12-20T00:00:00+07:00'),
  ('nomination_start',  '2025-11-01T00:00:00+07:00'),
  ('nomination_end',    '2025-11-30T23:59:59+07:00'),
  ('voting_start',      '2025-12-01T00:00:00+07:00'),
  ('voting_end',        '2025-12-15T23:59:59+07:00');
```

---

## Migration Order
1. app_settings (extend seeds)
2. nominations (depends on awards + profiles)
3. votes (depends on nominations)
4. supa_audit (enable tracking sau khi tables tạo)

---

## Unresolved Questions
1. Nomination limit: schema cho phép 1 user đề cử nhiều người vào 1 award. Nếu chỉ 1 → `UNIQUE(award_id, nominator_id)`.
2. Anonymous voting: votes linked to voter_id. RLS đã cover admin-only visibility.
3. recipient_count trong awards: top-N logic — admin chọn tay hay tự động?
4. supa_audit storage: cần monitor table size trên production.
