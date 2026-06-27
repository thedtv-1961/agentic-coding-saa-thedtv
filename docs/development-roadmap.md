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

### Phase 2 — Core Features 🔄 In Progress
- [ ] Home page sau khi đăng nhập
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
| Core features | 🔄 In Progress | — |
| Production deploy | 📋 Planned | — |
