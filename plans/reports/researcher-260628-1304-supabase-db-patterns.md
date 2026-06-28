# Study Report: Supabase DB Patterns — Social Recognition App

**Date:** 2026-06-28 | **Stack:** Next.js 15 + Supabase (local Docker) + Cloudflare Workers

---

## Summary

Four areas covered: RLS policies, migration patterns, performance indexes, nominations/voting schema. All patterns validated against official Supabase docs + production case studies. Key call: use `SECURITY DEFINER` helper functions for role checks, `UNIQUE` constraints for one-vote enforcement, and `BRIN` indexes on `created_at` for feed queries. Anonymous kudos handled at data-level (sender_id = NULL) — already correct in current schema design.

---

## 1. RLS Patterns

### Enable & General Rule

```sql
-- On every table in public schema
alter table profiles enable row level security;
alter table kudos enable row level security;
alter table nominations enable row level security;
alter table votes enable row level security;
```

**Rule:** enable RLS with NO policies = fully locked. Add policies selectively. Never disable RLS to "fix" a permission bug.

### Kudos: Receiver reads own kudos

```sql
-- Receiver sees kudos addressed to them
create policy "receiver sees own kudos"
on kudos for select
to authenticated
using (receiver_id = (select auth.uid()));

-- Sender sees kudos they sent (non-anonymous only)
create policy "sender sees own sent kudos"
on kudos for select
to authenticated
using (
  is_anonymous = false
  and sender_id = (select auth.uid())
);
```

### Anonymous Kudos: hide sender, still countable

Schema already correct: `sender_id = NULL` when `is_anonymous = true`.

```sql
-- Public feed: everyone sees kudos but sender hidden when anonymous
create policy "public kudos feed"
on kudos for select
to authenticated
using (true);  -- all rows visible

-- INSERT: sender_id must match auth.uid() OR be null (anonymous)
create policy "insert kudos"
on kudos for insert
to authenticated
with check (
  (is_anonymous = false and sender_id = (select auth.uid()))
  or
  (is_anonymous = true and sender_id is null)
);
```

Count query remains simple — `sender_id` nullability doesn't affect `COUNT(*)`.

### Admin bypass via service_role

- `service_role` key bypasses ALL RLS automatically — use only server-side (Next.js Server Actions, API routes)
- Never expose to client
- For admin UI queries: use `createClient(url, SERVICE_ROLE_KEY)` in server context

```ts
// utils/supabase/admin.ts — server only
import { createClient } from '@supabase/supabase-js'
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // never NEXT_PUBLIC_
)
```

### Profile visibility (public read)

```sql
create policy "profiles are publicly readable"
on profiles for select
to authenticated
using (true);

create policy "users update own profile"
on profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));
```

### Performance: wrap auth calls in SELECT

```sql
-- SLOW — called once per row
using (auth.uid() = user_id)

-- FAST — evaluated once per query (up to 99.99% improvement per Supabase docs)
using ((select auth.uid()) = user_id)
```

---

## 2. Migration Patterns

### File naming convention

```
supabase/migrations/
  20250101000000_init_profiles.sql
  20250101000001_create_kudos.sql
  20250101000002_create_awards.sql
  20250601000000_add_nominations.sql
```

Format: `YYYYMMDDHHMMSS_<snake_case_description>.sql`

CLI: `supabase migration new add_nominations` — auto-generates timestamp prefix.

### Auth schema hook: profiles extends auth.users

```sql
-- In migration file
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  hero_level  text not null default 'new_hero'
    check (hero_level in ('new_hero', 'rising_hero', 'super_hero', 'legend_hero')),
  created_at  timestamptz default now()
);
```

### Trigger: auto-create profile after OAuth signup

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Warning:** trigger failure blocks signup. Keep the INSERT simple; handle null gracefully.

### TypeScript types generation

```bash
# Local
supabase gen types typescript --local > src/types/database.types.ts

# From remote project
supabase gen types typescript --project-id <id> > src/types/database.types.ts
```

Add to `package.json`:
```json
"gen:types": "supabase gen types typescript --local > src/types/database.types.ts"
```

Usage:
```ts
import { Database } from '@/types/database.types'
const supabase = createClient<Database>(url, key)
```

---

## 3. Performance Indexes

### Kudos feed by receiver (home feed)

```sql
-- Primary: receiver_id for filtering
create index idx_kudos_receiver_id on kudos(receiver_id);

-- Composite: receiver + created_at DESC for paginated feed
create index idx_kudos_receiver_created on kudos(receiver_id, created_at desc);

-- created_at alone: BRIN is 10x smaller than B-tree for append-only data
create index idx_kudos_created_brin on kudos using brin(created_at);
```

### Kudos count per user (hero level calculation)

```sql
-- Covering index for COUNT query: SELECT COUNT(*) FROM kudos WHERE receiver_id = ?
-- idx_kudos_receiver_id above already covers this

-- If computing hero_level via trigger, index aids the UPDATE
create index idx_kudos_receiver_anon on kudos(receiver_id) where is_anonymous = false;
```

### Nominations by award category

```sql
create index idx_nominations_award_id on nominations(award_id);
create index idx_nominations_period on nominations(period_id, award_id);
create index idx_votes_nomination on votes(nomination_id);

-- Unique votes constraint doubles as index
-- (see schema section below)
```

### Foreign keys — always index

```sql
create index idx_kudos_sender on kudos(sender_id) where sender_id is not null;
create index idx_kudos_hashtags_hashtag on kudos_hashtags(hashtag_id);
create index idx_kudos_images_kudos on kudos_images(kudos_id);
```

---

## 4. Nominations/Voting Schema

### Period table

```sql
create table voting_periods (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  year        int not null default extract(year from now()),
  is_active   boolean generated always as (
    now() between starts_at and ends_at
  ) stored,
  created_at  timestamptz default now()
);
```

### Nominations table

```sql
create table nominations (
  id            uuid primary key default gen_random_uuid(),
  period_id     uuid not null references voting_periods(id),
  award_id      uuid not null references awards(id),
  nominee_id    uuid not null references profiles(id),
  nominator_id  uuid not null references profiles(id),
  reason        text,
  vote_count    int not null default 0,  -- denormalized for performance
  created_at    timestamptz default now(),

  -- One nomination per nominee per award per period
  unique (period_id, award_id, nominee_id)
);
```

### Votes table

```sql
create table votes (
  id             uuid primary key default gen_random_uuid(),
  nomination_id  uuid not null references nominations(id) on delete cascade,
  voter_id       uuid not null references profiles(id),
  created_at     timestamptz default now(),

  -- One vote per voter per nomination
  unique (nomination_id, voter_id)
);

-- Derived: one vote per user per award per period
-- Enforced via RLS + trigger, not just UNIQUE (nomination spans award+period)
```

### RLS for nominations/voting

```sql
-- Nominations: anyone can read within active period
create policy "read nominations in active period"
on nominations for select
to authenticated
using (
  exists (
    select 1 from voting_periods
    where id = nominations.period_id
    and now() between starts_at and ends_at
  )
);

-- Votes: only within active period
create policy "vote only in active period"
on votes for insert
to authenticated
with check (
  exists (
    select 1 from nominations n
    join voting_periods vp on vp.id = n.period_id
    where n.id = votes.nomination_id
    and now() between vp.starts_at and vp.ends_at
  )
  and voter_id = (select auth.uid())
);

-- Prevent duplicate vote per category per period via DB function
create or replace function check_one_vote_per_category()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (
    select 1 from votes v
    join nominations n1 on n1.id = v.nomination_id
    join nominations n2 on n2.id = new.nomination_id
    where v.voter_id = new.voter_id
    and n1.award_id = n2.award_id
    and n1.period_id = n2.period_id
  ) then
    raise exception 'Already voted in this category for this period';
  end if;
  return new;
end;
$$;

create trigger enforce_one_vote_per_category
  before insert on votes
  for each row execute function check_one_vote_per_category();
```

### vote_count denormalization trigger

```sql
create or replace function update_vote_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    update nominations set vote_count = vote_count + 1 where id = new.nomination_id;
  elsif TG_OP = 'DELETE' then
    update nominations set vote_count = vote_count - 1 where id = old.nomination_id;
  end if;
  return null;
end;
$$;

create trigger on_vote_change
  after insert or delete on votes
  for each row execute function update_vote_count();
```

---

## Trade-off Summary

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| Anonymous kudos privacy | `sender_id = NULL` | Separate `anon_kudos` table | Simpler; already in schema |
| Admin bypass | `service_role` key | `role = admin` RLS check | Zero overhead; no policy logic |
| One vote per category | Trigger + UNIQUE | Pure RLS | UNIQUE handles race condition; trigger gives clear error |
| vote_count | Denormalized column | `COUNT(*)` on query | Feed performance; avoids full scan |
| Period validity | `is_active` generated column | Check in RLS `USING` | Reusable; index-friendly |

---

## Sources

- [Row Level Security — Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS Performance and Best Practices — Supabase Troubleshooting](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Managing User Data (auth trigger) — Supabase Docs](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase CLI: migration new](https://supabase.com/docs/reference/cli/supabase-migration-new)
- [Generating TypeScript Types — Supabase Docs](https://supabase.com/docs/guides/api/rest/generating-types)
- [Managing Indexes in Postgres — Supabase Docs](https://supabase.com/docs/guides/database/postgres/indexes)
- [Supabase RLS Best Practices: Production Patterns — MakerKit](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)
- [Votes table discussion — Supabase GitHub](https://github.com/orgs/supabase/discussions/6372)

---

## Unresolved Questions

1. **Hero level trigger**: schema doc says "DB trigger updates hero_level on new kudos" — trigger code not yet in migrations. Confirm if it needs to be written or is already seeded.
2. **Nomination by same user**: can a user nominate themselves? Schema allows it (`nominee_id != nominator_id` constraint absent). Needs business rule clarification.
3. **Multiple active periods**: schema allows overlapping `voting_periods`. If only one period active at a time, add `EXCLUDE` constraint or enforce via app logic.
4. **vote_count race condition**: concurrent inserts could briefly under-count. For high-concurrency: use `SELECT ... FOR UPDATE` on nomination row, or accept eventual consistency.
