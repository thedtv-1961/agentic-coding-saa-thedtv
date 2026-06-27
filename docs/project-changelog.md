# Project Changelog

## [Unreleased]

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
