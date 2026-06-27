# Code Standards

## Ngôn ngữ & Framework

- **TypeScript** — strict mode, không dùng `any`
- **Next.js 15 App Router** — Server Components mặc định, Client Components khi cần interactivity
- **TailwindCSS 4** — utility-first, không viết CSS thuần trừ `globals.css`

## File & Folder Naming

- Folders: `kebab-case`
- React components: `PascalCase.tsx`
- Utilities / helpers: `kebab-case.ts`
- Test files: `*.test.ts` / `*.test.tsx` cùng thư mục với file được test

## Component Rules

- Server Component mặc định — thêm `"use client"` chỉ khi cần
- Props interface đặt ngay trên component, không export riêng trừ khi dùng nhiều nơi
- Mỗi file component ≤ 200 dòng — tách nhỏ khi vượt ngưỡng
- Import order: React → Next.js → third-party → internal → types

## TypeScript

```typescript
// ✅ Đúng
interface LoginFormProps {
  onSuccess: () => void
}

// ❌ Sai
const props: any = {}
```

- Dùng `interface` cho object shapes, `type` cho union/intersection
- Không dùng non-null assertion (`!`) trừ khi chắc chắn 100%

## Supabase Patterns

- Server actions / Route handlers: dùng `createServerClient` từ `utils/supabase/server.ts`
- Client components: dùng `createBrowserClient` từ `utils/supabase/client.ts`
- Không hard-code credentials — luôn dùng env vars

## i18n

- Mọi text hiển thị phải có trong `messages/en.json` và `messages/vi.json`
- Dùng `useTranslations` (client) hoặc `getTranslations` (server)
- Key format: `ComponentName.keyName`

## Error Handling

- Server actions: trả về `{ error: string } | { data: T }`
- Không để lộ stack trace ra UI
- Log errors server-side

## Testing

- Unit test cho utilities, hooks, pure functions
- E2E test cho user flows quan trọng (login, core features)
- Coverage target: > 80% cho code logic

## Git

- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Không commit `.env`, secrets, `node_modules`
- Mỗi commit scope = 1 thay đổi cụ thể
