# Project Changelog

## [Unreleased]

---

## [0.6.0] — 2026-06-30

### Added
- FAB (Floating Action Button): `widget-button.tsx`, `fab-sub-button.tsx`, `fab-controller.tsx` — layout-level for all protected pages
- Thể Lệ right slide drawer: `the-le-drawer.tsx`, `the-le-content.tsx` — accessible via FAB sub-button
- Viết KUDOS modal: `viet-kudos-modal.tsx` — full kudos submission form
- Kudos form fields: `kudos-recipient-field.tsx` (autocomplete), `kudos-rich-text-editor.tsx`, `kudos-hashtag-field.tsx`, `kudos-image-upload-field.tsx`, `kudos-anonymous-toggle.tsx`
- Server actions: `search-profiles.ts`, `get-hashtags.ts`, `submit-kudos.ts`
- Image upload utility: `app/lib/kudos/image-upload.ts`
- Supabase Storage bucket `kudos-images` (migration `20260630000015_kudos_images_storage.sql`)
- `(protected)` route group: `app/(protected)/layout.tsx` — mounts FAB for all auth-protected pages
- Moved homepage to `app/(protected)/page.tsx`, awards to `app/(protected)/awards/page.tsx`

---

## [0.5.1] — 2026-06-28

### Fixed
- Root Further section: expanded body text from 1 paragraph to 3 to match Figma design
- Kudos section: added "ĐIỂM MỚI CỦA SAA 2025" subtitle + updated body text to match design
- Awards section: updated `Signature Creator` title to `Signature 2025 - Creator` in DB
- Awards section: fixed empty display caused by `sb_publishable_` key format incompatibility — added JWT anon key override in `.env.local`
- `AwardCard` test: fixed `getByText` → `getAllByText` due to title appearing in both medal circle and card heading

---

## [0.5.0] — 2026-06-28

### Added
- Homepage (`/`) implementation: Hero/Keyvisual, Root Further, Awards (DB-backed), Kudos sections
- Shared components: `Header` (sticky, hamburger), `Footer`, `Widget Button`
- `types/awards.ts` — `Award` type + `AWARD_META` mapping for 6 SAA 2025 categories
- i18n keys: `common.*` and `home.*` namespaces (EN/VI)

### Changed
- `middleware.ts` — auth guard applied to `/` route (unauthenticated → redirect `/login`)

---

## [0.4.0] — 2026-06-28

### Added
- Countdown Prelaunch Page (`/countdown`) — server-rendered, fetch `countdown_date` từ `app_settings` (Supabase service role)
- Middleware prelaunch gate: `PRELAUNCH_MODE=true` redirect mọi route về `/countdown`
- 4 UI components: `countdown-background`, `countdown-title`, `countdown-digit-block`, `countdown-timer` (client)
- i18n keys cho countdown page (EN/VI)

---

## [0.3.1] — 2026-06-28

### Changed
- Login hero: reduced font weight (thin) and font size; adjusted responsive padding
- Login page background: gradient overlay (from-black/80 via-black/40 to-transparent) replacing flat overlay
- Login button: Google icon repositioned after label text

### Fixed
- ESLint config: fixed module imports, added `.claude/**` to ignore list
- E2E login spec: removed unused `page` parameter

### Added
- Unit tests: `login-hero.test.tsx`, `login-footer.test.tsx`, `login-header.test.tsx`

---

## [0.3.0] — 2026-06-28

### Added
- Database schema SAA 2025: 9 tables (profiles, kudos, hashtags, kudos_hashtags, kudos_images, awards, app_settings, nomination_periods, nominations, audit_logs)
- RLS policies trên tất cả tables
- Trigger functions: `handle_new_user`, `update_hero_level`, `log_kudos_insert`, `log_nomination_insert` (tất cả SECURITY DEFINER)
- Performance indexes: BRIN index trên `audit_logs.performed_at`, composite indexes trên nominations và kudos
- EXCLUDE constraint (btree_gist) trên `nomination_periods` để ngăn overlap
- Seed data: 10 hashtags, 6 awards (SAA 2025 categories), app_settings defaults
- Feature spec: `docs/features/F001_DatabaseDesignSaa2025/`

---

## [0.2.0] — 2026-06-21

### Added
- Login page UI từ Figma design (MoMorph)
- Google OAuth flow via Supabase Auth
- Auth callback route (`/auth/callback`)
- Login components: `LoginButton`, `LoginForm`
- i18n messages cho login (EN/VI)

### Changed
- Middleware cập nhật để handle auth + i18n routing

---

## [0.1.0] — 2026-06-XX

### Added
- Khởi tạo dự án Next.js 15.3.x (App Router)
- TailwindCSS 4
- TypeScript
- Supabase local (Docker) setup
- next-intl cho i18n (EN/VI)
- Vitest + Playwright testing setup
- Cloudflare Workers config (`wrangler.toml`)
- Claude Code Takumi harness (`.claude/`)
- MCP servers: supabase, playwright, context7, momorph
- CLAUDE.md + AGENTS.md
