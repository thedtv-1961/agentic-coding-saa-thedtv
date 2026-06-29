# Development Roadmap

## Dự án

**Agentic Coding — SAA Hands-on (Web)**
Thực hành nội bộ Sun* sử dụng MoMorph + Claude Code để generate code từ Figma design.

---

## Phases

### Phase 1 — Setup & Auth ✅ Complete
- [x] Khởi tạo Next.js 15 + TailwindCSS 4 + TypeScript
- [x] Cấu hình Supabase local (Docker)
- [x] Cấu hình i18n (next-intl, EN/VI)
- [x] Cài đặt Claude Code Takumi harness
- [x] Cấu hình MCP servers (supabase, playwright, context7, momorph)
- [x] Implement Login page (Supabase Auth + Google OAuth)
- [x] Auth callback route + middleware

### Phase 1b — Database Schema ✅ Complete
- [x] 9 Supabase tables: profiles, kudos, hashtags, kudos_hashtags, kudos_images, awards, app_settings, nomination_periods, nominations, audit_logs
- [x] RLS policies trên tất cả tables
- [x] 3 trigger functions: handle_new_user, update_hero_level, log_kudos_insert, log_nomination_insert
- [x] Performance indexes (BRIN, composite, partial)
- [x] Seed data: hashtags, awards, app_settings
- [x] Feature spec: `docs/features/F001_DatabaseDesignSaa2025/`

### Phase 1c — Countdown Prelaunch Page ✅ Complete
- [x] Middleware gate `PRELAUNCH_MODE` redirect mọi route về `/countdown`
- [x] Server Component `/countdown` fetch `countdown_date` từ `app_settings` (service role)
- [x] 4 UI components: background, title, digit-block, timer (client)
- [x] i18n keys EN/VI

### Phase 2 — Core Features 🔄 In Progress
- [x] Home page sau khi đăng nhập (Hero/Keyvisual, Root Further, Awards, Kudos sections; shared Header/Footer/Widget Button)
- [x] FAB + Thể Lệ drawer (layout-level cho tất cả protected pages)
- [x] Viết KUDOS modal — form submit kudos với recipient autocomplete, rich text editor, hashtag picker, image upload, anonymous toggle
- [x] Server actions: search profiles, get hashtags, submit kudos
- [x] Supabase Storage bucket `kudos-images`
- [x] `(protected)` route group — auth-guarded layout với FAB
- [ ] User profile
- [ ] Navigation / layout chính

### Phase 3 — Testing & Quality 📋 Planned
- [ ] Unit tests coverage > 80%
- [ ] E2E tests cho happy paths
- [ ] Performance audit

### Phase 4 — Deploy 📋 Planned
- [ ] Build Cloudflare Workers (`next-on-pages`)
- [ ] Deploy lên Cloudflare Pages
- [ ] Environment variables production

---

## Milestones

| Milestone | Status | Date |
|---|---|---|
| Project setup | ✅ Done | 2026-06 |
| Login / Auth | ✅ Done | 2026-06 |
| Database schema | ✅ Done | 2026-06-28 |
| Countdown Prelaunch Page | ✅ Done | 2026-06-28 |
| Core features | 🔄 In Progress | — |
| Production deploy | 📋 Planned | — |
