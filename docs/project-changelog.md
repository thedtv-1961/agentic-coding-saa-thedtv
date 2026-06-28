# Project Changelog

## [Unreleased]

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
