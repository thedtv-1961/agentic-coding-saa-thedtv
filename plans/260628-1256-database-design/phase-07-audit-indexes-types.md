## Context Links

- Spec: `plans/260628-1256-database-design/spec/database-design-saa-2025/technical-spec.md` §audit_logs
- Research: `plans/reports/researcher-260628-1256-nominations-voting-audit.md` §2 (supa_audit)
- Research: `plans/reports/researcher-260628-1304-supabase-db-patterns.md` §2 (TypeScript types), §3 (Indexes)

## Overview

- **Priority:** P1
- **Status:** Completed
- **Mô tả:** Verify toàn bộ migration chain, thêm remaining indexes, quyết định supa_audit, generate TypeScript types.

## Key Insights

- Phase này là "seal & validate" — tất cả tables đã tồn tại, chạy `supabase db reset` để verify
- `supa_audit`: schema-agnostic JSONB audit via extension. Custom `audit_logs` đã đủ cho v1 → supa_audit là OPTIONAL
- TypeScript types phải generate LAST, sau khi schema ổn định
- `npm run gen:types` thêm vào `package.json` — commit types file cùng với migrations
- BRIN index trên `audit_logs.performed_at` đã tạo ở phase 6; không duplicate

## Requirements (từ spec)

- **US007** — Admin xem toàn bộ audit log (tables + indexes đã có từ phase 6)
- **BL008** — audit_logs: INSERT-only enforcement (no UPDATE/DELETE RLS policies — đã set phase 6)

## Related Code Files

Tạo mới:
- `supabase/migrations/20260628000007_finalize_indexes.sql`
- `src/types/database.types.ts` (generated, không edit tay)

Sửa đổi:
- `package.json` — thêm `gen:types` script

## Implementation Steps

### 1. Migration 007 — Remaining indexes

```sql
-- nominations: remaining composite indexes (nếu chưa có từ phase 4)
-- (phase 4 đã tạo idx_nominations_period_award, idx_nominations_nominee_id, etc.)

-- Verify không duplicate — chỉ thêm nếu còn thiếu:
-- create index if not exists ...
```

> Phase 4 đã cover tất cả nomination indexes. Migration 007 chủ yếu là placeholder + verify pass.

### 2. supa_audit — Decision

```sql
-- OPTIONAL: chỉ enable nếu muốn full change tracking ngoài custom audit_logs
-- create extension if not exists supa_audit cascade;
-- select audit.enable_tracking('public.kudos'::regclass);
-- select audit.enable_tracking('public.nominations'::regclass);
```

**Quyết định:** Giữ custom `audit_logs` only cho v1. Enable supa_audit khi cần compliance audit đầy đủ (future).

### 3. Thêm gen:types script vào package.json

```json
"scripts": {
  "gen:types": "supabase gen types typescript --local > src/types/database.types.ts"
}
```

### 4. Generate TypeScript types

Sau khi `supabase db reset` pass:
```bash
npm run gen:types
```

File output: `src/types/database.types.ts` — commit cùng migrations.

### 5. Verify full migration chain

```bash
supabase db reset
```

Kiểm tra tất cả 7 migrations chạy không có error:
- `000001` — profiles + auth trigger
- `000002` — kudos system
- `000003` — awards + settings
- `000004` — nominations
- `000005` — RLS policies
- `000006` — audit_logs + triggers + seeds
- `000007` — finalize indexes

### 6. TypeScript compile check

```bash
npm run build
```

Verify `database.types.ts` không gây TypeScript errors trong codebase.

## Todo List

- [ ] Tạo `20260628000007_finalize_indexes.sql` (có thể minimal nếu phase 4 đã cover)
- [ ] Quyết định final về supa_audit extension (enable hay skip)
- [ ] Thêm `gen:types` vào `package.json` scripts
- [ ] Chạy `supabase db reset` — verify toàn bộ chain pass không có error
- [ ] Chạy `npm run gen:types` — verify types generate thành công
- [ ] Chạy `npm run build` — verify không có TypeScript errors mới
- [ ] Commit `src/types/database.types.ts`

## Success Criteria

- `supabase db reset` chạy 7 migrations không có error
- `src/types/database.types.ts` tồn tại và export đúng `Database` type với tất cả tables
- `npm run build` pass không có lỗi mới
- Tất cả tables, indexes, triggers, seeds đều đúng như design

## Unresolved Questions

1. **Hero level boundary:** `kudos_count = 20` → `super_hero` hay `legend_hero`? Spec: ">20 = legend_hero" → 20 = super_hero. Confirm với BA/PM.
2. **`UNIQUE(award_id, nominator_id)` scope:** không include `period_id` — nếu SAA multi-year, user không re-nominate. Confirm scope 2025-only hay multi-year.
3. **supa_audit:** enable extension hay chỉ custom `audit_logs`?

## Risk Assessment

- **High** — Migration ordering fail nếu `audit_logs` không tạo trước triggers (phase 6 phải đặt CREATE TABLE ĐẦU FILE)
- **Medium** — TypeScript types stale nếu schema thay đổi sau generate: phải run `npm run gen:types` sau mỗi migration mới
- **Low** — supa_audit storage: nếu enable, `audit.record_version` table grow nhanh trên production với high-volume kudos

## Security Considerations

- `src/types/database.types.ts` không chứa secrets — safe to commit
- `service_role` key chỉ trong `.env.local`, không commit
- Generated types không override RLS — security vẫn enforce tại DB layer

## Next Steps

- Implement: `/tkm:takumi plans/260628-1256-database-design/plan.md`
- Sau implement: feature Kudos Feed UI có thể consume database layer
