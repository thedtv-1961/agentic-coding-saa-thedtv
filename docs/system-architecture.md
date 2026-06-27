# System Architecture

## Overview

Next.js 15 App Router + Supabase Auth + Cloudflare Workers.

```
Browser
  └─ Next.js App Router (Cloudflare Workers)
       ├─ middleware.ts         — auth check + i18n locale redirect
       ├─ app/[locale]/         — localised routes (EN/VI)
       │   ├─ layout.tsx        — root layout + NextIntlClientProvider
       │   ├─ page.tsx          — home (protected)
       │   └─ login/            — public login page
       ├─ app/auth/callback/    — Supabase OAuth callback
       └─ utils/supabase/       — Supabase client helpers
            ├─ client.ts        — browser client (createBrowserClient)
            ├─ server.ts        — server client (createServerClient)
            └─ middleware.ts    — session refresh helper
```

## Auth Flow

```
User → /login → Google OAuth → Supabase Auth
  → /auth/callback → exchange code → session cookie
  → redirect → / (protected home)
```

Middleware kiểm tra session trên mọi request. Unauthenticated → redirect `/login`.

## i18n

next-intl với 2 locale: `en`, `vi`. Default locale: `vi`.
Routing: `/{locale}/...` — middleware tự inject locale vào URL.
Messages: `messages/en.json`, `messages/vi.json`.

## Data Layer

- **Supabase local** (Docker): `http://127.0.0.1:54321`
- Server components dùng `createServerClient` (cookie-based session)
- Client components dùng `createBrowserClient`
- Migrations: `supabase/migrations/`

## Deploy Target

Cloudflare Workers via `@cloudflare/next-on-pages`.
Build: `npm run pages:build` → `npm run deploy`.
Config: `wrangler.toml`.

## Testing

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `src/test/` |
| E2E | Playwright | `e2e/` |
