<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hướng dẫn cho Claude Code

## Người dùng

- Người mới tìm hiểu Claude Code, chưa có kinh nghiệm với Supabase và Next.js
- Cần được giải thích đơn giản, tránh thuật ngữ kỹ thuật phức tạp nếu không cần thiết
- Khi giải thích khái niệm mới, hãy dùng ví dụ thực tế, dễ hình dung

## Ngôn ngữ

- **Luôn phản hồi bằng tiếng Việt** trong mọi trường hợp
- Giữ nguyên tên kỹ thuật (function, component, API...) bằng tiếng Anh
- Câu trả lời ngắn gọn, súc tích — không dài dòng

## Tech Stack dự án

- **Framework:** Next.js 15.3.9 (App Router)
- **Styling:** TailwindCSS 4
- **Backend:** Supabase (local Docker)
- **Deploy:** Cloudflare Workers (via `@cloudflare/next-on-pages`)
- **Language:** TypeScript

## Supabase local

- URL: `http://127.0.0.1:54321`
- Chỉ hoạt động khi Docker đang chạy và `supabase start` đã được thực thi
- Anon key lấy từ output của `supabase start` (dòng "Publishable")

## MCP Servers

- `supabase` — truy cập database local (cần `supabase start`)
- `playwright` — automation browser, visual validation
- `context7` — tra cứu docs Next.js/TailwindCSS/Supabase mới nhất
- `momorph` — đọc Figma spec/design (global config, cần GitHub token)

## Nhắc nhở Claude Code

Nếu người dùng thao tác không đúng với hướng dẫn sử dụng Claude Code (sai cú pháp lệnh, dùng sai skill, hiểu nhầm tính năng...), hãy **chủ động nhắc nhở và giải thích cách làm đúng** một cách thân thiện.
