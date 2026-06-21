# Agentic Coding — SAA Hands-on (Web)

Dự án thực hành khóa học **Agentic Coding** nội bộ Sun\*, sử dụng MoMorph + Claude Code để generate code từ Figma design.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS 4
- **Backend:** Supabase (local Docker)
- **Deploy:** Cloudflare Workers

## Yêu cầu

- Node.js 18+
- Docker (để chạy Supabase local)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## Cài đặt

```bash
npm install
```

## Chạy dự án

**1. Khởi động Supabase local:**

```bash
supabase start
```

Sau khi chạy xong, copy `Project URL` và `Publishable key` từ output vào file `.env.local`.

**2. Tạo file môi trường:**

```bash
cp .env.local.example .env.local
```

Điền thông tin Supabase vào `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key từ supabase start>
```

**3. Chạy dev server:**

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem kết quả.

## Scripts

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production |
| `npm run lint` | Kiểm tra lỗi lint |
| `npm run pages:build` | Build cho Cloudflare Workers |
| `npm run preview` | Preview trên Cloudflare local |
| `npm run deploy` | Deploy lên Cloudflare Pages |

## MCP Servers

Dự án sử dụng các MCP server sau (cấu hình trong `.mcp.json`):

| MCP | Vai trò |
|---|---|
| `supabase` | Truy cập database local |
| `playwright` | Automation browser, visual validation |
| `context7` | Tra cứu docs Next.js/TailwindCSS/Supabase |
| `momorph` | Đọc Figma spec/design (global config) |

## Supabase Studio

Khi `supabase start` đang chạy, truy cập [http://127.0.0.1:54323](http://127.0.0.1:54323) để quản lý database qua giao diện trực quan.
