<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hướng dẫn cho Claude Code Takumi

## Người dùng

- Đang học Claude Code và Agentic Coding — chưa có nhiều kinh nghiệm với Supabase và Next.js
- Cần giải thích ngắn gọn, dùng ví dụ thực tế khi giới thiệu khái niệm mới
- Nếu thao tác sai (sai cú pháp skill, dùng nhầm lệnh), hãy **chủ động nhắc nhở thân thiện** và hướng dẫn cách đúng

## Ngôn ngữ

- **Luôn phản hồi bằng tiếng Việt** — giữ nguyên tên kỹ thuật (function, component, API...) bằng tiếng Anh
- Ngắn gọn, súc tích — không dài dòng

## Dự án

**Agentic Coding — SAA Hands-on**: thực hành nội bộ Sun*, generate code từ Figma design bằng MoMorph + Claude Code.

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15.3.x (App Router) |
| Styling | TailwindCSS 4 |
| i18n | next-intl (EN / VI, default: VI) |
| Backend | Supabase (local Docker) |
| Auth | Supabase Auth — Google OAuth |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deploy | Cloudflare Workers (`@cloudflare/next-on-pages`) |
| Language | TypeScript (strict) |

## Scripts quan trọng

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Build + type check
npm run lint             # ESLint
npm run test             # Vitest unit tests
npm run test:coverage    # Coverage report
npm run test:e2e         # Playwright E2E
npm run pages:build      # Build Cloudflare Workers
npm run deploy           # Deploy Cloudflare Pages
supabase start           # Khởi động local Supabase (cần Docker)
supabase db reset        # Reset DB + chạy lại migrations & seeds
```

## Supabase local

- URL: `http://127.0.0.1:54321` — Studio: `http://127.0.0.1:54323`
- Chỉ hoạt động khi Docker đang chạy và `supabase start` đã thực thi
- Anon key: lấy từ output `supabase start` (dòng "Publishable") hoặc file `.env`

## MCP Servers

| MCP | Vai trò | Ghi chú |
|---|---|---|
| `supabase` | Truy vấn DB local | Cần `supabase start` |
| `playwright` | Automation browser, visual validation | — |
| `context7` | Docs Next.js / TailwindCSS / Supabase mới nhất | Dùng trước khi viết code |
| `momorph` | Đọc Figma spec/design | Cần GitHub token (global config) |

## Tài liệu tham chiếu

- Code standards: `docs/code-standards.md`
- Architecture: `docs/system-architecture.md`
- Plans: `plans/` | Reports: `plans/reports/`

## Lưu ý khi viết code

- Server Component mặc định — thêm `"use client"` chỉ khi cần interactivity
- Dùng `createServerClient` (server/actions), `createBrowserClient` (client components)
- Mọi text UI phải có trong `messages/en.json` + `messages/vi.json`
- Mỗi file code ≤ 200 dòng — tách module khi vượt ngưỡng
- Sau khi thay đổi code: chạy `npm run build` để bắt lỗi sớm

## Definition of Done (DoD)

**IMPORTANT:** Trước khi báo hoàn thành bất kỳ task implement nào, bắt buộc kiểm tra và xác nhận toàn bộ checklist sau:

- [ ] **UI** — Chụp screenshot thực tế, so sánh với Figma design, không có sai lệch về layout/màu sắc/spacing
- [ ] **Logic** — Tất cả flows trong Screen Specs (MoMorph) đã hoạt động đúng, bao gồm edge cases
- [ ] **Unit Tests** — Viết test (Vitest) cho logic/utils/components trước khi implement (TDD)
- [ ] **E2E Tests** — Viết Playwright test cho happy path và các luồng quan trọng
- [ ] **Build pass** — `npm run build` không có lỗi
- [ ] **Lint pass** — `npm run lint` không có lỗi

## Compaction

When compacting, always preserve:
- Danh sách file đã thay đổi trong session
- Các lệnh test đang dùng và kết quả
- Các quyết định kiến trúc đã được confirm
- Trạng thái hiện tại của plan (phase nào đang chạy)
