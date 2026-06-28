-- Phase 7: Finalize — remaining indexes
-- Spec: docs/features/F001_DatabaseDesignSaa2025/technical-spec.md (US007, BL008)
-- Phases 1-6 already cover core indexes. This migration adds any remaining composite indexes
-- and serves as the chain-verification point before TypeScript type generation.

-- nominations: already covered in migration 004 (idx_nominations_*)
-- kudos: already covered in migration 002 (idx_kudos_*)
-- audit_logs: already covered in migration 006 (idx_audit_logs_*)

-- Additional composite index for kudos global feed (all senders, ordered)
create index if not exists idx_kudos_global_feed
  on public.kudos(created_at desc);

-- Composite index for profile hero level leaderboard
create index if not exists idx_profiles_hero_level
  on public.profiles(hero_level, created_at desc);
