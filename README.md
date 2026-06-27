# Agentic Coding — SAA Hands-on (Web)

Dự án thực hành khóa học **Agentic Coding** nội bộ Sun\*, sử dụng **MoMorph + Claude Code** để generate code từ Figma design.

**Figma file:** [SAA 2025 - Internal Live Coding](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding)

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15.3.x (App Router) |
| Styling | TailwindCSS 4 |
| i18n | next-intl (EN / VI) |
| Backend | Supabase (local Docker) |
| Auth | Supabase Auth — Google OAuth |
| Testing | Vitest + Playwright |
| Deploy | Cloudflare Workers (next-on-pages) |
| Language | TypeScript |

## Yêu cầu

- Node.js v24.x
- Docker
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [MoMorph CLI](https://github.com/momorph/cli)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## Cài đặt (lần đầu)

**1. Tạo file môi trường:**

```bash
cp .env.example .env
```

Điền thông tin vào `.env` sau khi có output từ `supabase start`:

```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=<publishable key>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
```

**2. Cài đặt dependencies:**

```bash
npm install
```

**3. Thiết lập MoMorph:**

```bash
# Đăng nhập
momorph login

# Khởi tạo project (sinh ra .claude/, prompt files...)
momorph init . --ai claude
```

## Chạy dự án

```bash
# 1. Khởi động Supabase local (cần Docker đang chạy)
supabase start

# 2. Chạy dev server
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Supabase Studio: [http://127.0.0.1:54323](http://127.0.0.1:54323)

## Scripts

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production (kiểm tra type errors) |
| `npm run lint` | Kiểm tra lỗi lint |
| `npm run test` | Chạy unit tests (Vitest) |
| `npm run test:watch` | Chạy tests ở watch mode |
| `npm run test:coverage` | Báo cáo coverage |
| `npm run test:e2e` | Chạy E2E tests (Playwright) |
| `npm run pages:build` | Build cho Cloudflare Workers |
| `npm run deploy` | Deploy lên Cloudflare Pages |
| `supabase start` | Khởi động local Supabase |
| `supabase stop` | Dừng local Supabase |
| `supabase db reset` | Reset database + chạy lại migrations & seeds |
| `supabase migration new <name>` | Tạo migration mới |

## Cấu trúc thư mục

```
├── app/                        # Next.js App Router
│   ├── auth/callback/          # OAuth callback route
│   ├── components/             # UI components theo feature
│   │   └── login/              # Login page components
│   ├── login/                  # Login page (route + actions)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── utils/
│   └── supabase/               # Supabase client helpers
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client
│       └── middleware.ts       # Auth middleware helper
├── i18n/                       # next-intl config
│   ├── routing.ts              # Locale routing
│   └── request.ts              # Server request config
├── messages/                   # i18n translations
│   ├── en.json
│   └── vi.json
├── src/test/                   # Unit tests (Vitest)
├── e2e/                        # E2E tests (Playwright)
├── supabase/                   # Supabase local config & migrations
├── middleware.ts               # Next.js middleware (auth + i18n)
└── public/                     # Static assets
```

## MCP Servers

Cấu hình trong `.mcp.json` — Claude Code tự động kết nối khi mở project:

| MCP | Vai trò |
|---|---|
| `supabase` | Truy vấn và quản lý database local |
| `playwright` | Automation browser, kiểm tra UI |
| `context7` | Tra cứu docs Next.js / TailwindCSS / Supabase mới nhất |
| `momorph` | Đọc Figma spec/design |

> `supabase` MCP yêu cầu `supabase start` đang chạy.

## Quy trình generate code với MoMorph

Chạy lần lượt các slash commands trong Claude Code:

| Command | Mục đích |
|---|---|
| `/momorph.constitution` | Thiết lập coding standards (chạy **một lần** đầu tiên) |
| `/momorph.specify` | Kéo screen spec + design Figma về local |
| `/momorph.reviewspecify` | Review spec (nên chạy 2–3 lần) |
| `/momorph.plan` | Tạo implementation plan |
| `/momorph.reviewplan` | Review plan (nên chạy 2–3 lần) |
| `/momorph.tasks` | Chia plan thành danh sách tasks |
| `/momorph.implement` | Sinh code theo từng task |

## Cấu trúc AI config

| File/Thư mục | Vai trò |
|---|---|
| `CLAUDE.md` | Entry point — trỏ vào `AGENTS.md` |
| `AGENTS.md` | Hướng dẫn hành vi cho Claude Code (ngôn ngữ, tech stack, context) |
| `.mcp.json` | Cấu hình MCP servers |
| `.claude/` | Prompt templates, slash commands của MoMorph |
