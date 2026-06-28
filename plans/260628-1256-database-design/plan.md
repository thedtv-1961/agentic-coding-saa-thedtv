---
title: "Database Design SAA 2025"
description: "Full database layer for SAA 2025 — schema, RLS, triggers, seed data, nominations/voting, audit, indexes, TypeScript types."
status: completed
priority: P1
effort: "~6h"
branch: get_spec
tags: [database, backend, infra]
blockedBy: []
blocks: []
work_type: feature
spec: docs/features/F001_DatabaseDesignSaa2025/
created: 2026-06-28
---

# Database Design SAA 2025

## Overview

Thiết kế toàn bộ database layer cho SAA 2025 (Sun* Awards & Achievements) trên Supabase (PostgreSQL). Bao gồm 9 tables (7 core + 2 expansion), RLS policies, 3 triggers, seed data, performance indexes, và TypeScript types.

Stack: PostgreSQL 17 (Supabase local Docker), Next.js 15, Cloudflare Workers.

## Cross-Plan Dependencies

Không có dependency từ plans khác hiện tại.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Profiles & Auth Trigger](./phase-01-profiles-auth-trigger.md) | Completed |
| 2 | [Kudos System](./phase-02-kudos-system.md) | Completed |
| 3 | [Awards & App Settings](./phase-03-awards-app-settings.md) | Completed |
| 4 | [Nominations & Votes](./phase-04-nominations-votes.md) | Completed |
| 5 | [RLS Policies](./phase-05-rls-policies.md) | Completed |
| 6 | [Triggers & Seed Data](./phase-06-triggers-seed-data.md) | Completed |
| 7 | [Audit, Indexes & TypeScript Types](./phase-07-audit-indexes-types.md) | Completed |

## Key Dependencies

- Supabase CLI: `supabase migration new <name>` per migration file
- Migration order: phases 1→2→3→4→5→6→7 (strict — FK dependencies)
- `audit_logs` CREATE TABLE phải đặt ở đầu migration 006, trước trigger functions
- `btree_gist` extension phải enable trong migration 003, trước EXCLUDE constraint
- TypeScript types generated last (phase 7), sau khi tất cả tables ổn định

## Red Team Review

Thực hiện ngày 2026-06-28. 4 adversarial lenses: Security Adversary, Failure Mode Analyst, Assumption Destroyer, Scope & Complexity Critic.

**14/15 findings accepted, 1 rejected.**

### Critical (3 applied)

| # | Finding | Phase Fixed |
|---|---------|-------------|
| C1 | Admin self-elevation via `profiles_update_own` — WITH CHECK không restrict role column | phase-05 |
| C2 | Nomination INSERT RLS chỉ check application layer — period time check không có tại DB | phase-05 |
| C3 | Audit trigger `log_nomination_insert()` leak `nominator_id` qua `row_to_json(new)` | phase-06 |

### High (8 applied)

| # | Finding | Phase Fixed |
|---|---------|-------------|
| H4 | `kudos_hashtags`/`kudos_images` INSERT policy có `or is_anonymous = true` — auth bypass | phase-05 |
| H5 | Hero level trigger race condition — concurrent inserts trùng receiver | phase-06 |
| H6 | `UNIQUE(award_id, nominator_id)` không include `period_id` | phase-04 |
| H7 | `nomination_periods` không có EXCLUDE constraint — overlapping periods | phase-03 |
| H8 | `app_settings` thiếu INSERT policy cho admin | phase-05 |
| H9 | `kudos_images` max-5 chỉ ở application layer, không có DB trigger | phase-02 |
| H10 | `kudos` không có CHECK `(is_anonymous = true → sender_id IS NULL)` | phase-02 |
| H11 | `audit_logs` RLS policy trong migration 005 — table không tồn tại đến migration 006 | phase-05, phase-06 |

### Medium (3 applied, 1 rejected)

| # | Finding | Phase Fixed |
|---|---------|-------------|
| H12 | Nominations aggregate không có safe view/RPC | phase-05 |
| M13 | `app_settings_admin_update` thiếu `WITH CHECK` | phase-05 |
| M14 | `profiles` thiếu `updated_at` column | phase-01 |
| ~~M15~~ | ~~No rollback strategy~~ | Rejected — over-engineering |
