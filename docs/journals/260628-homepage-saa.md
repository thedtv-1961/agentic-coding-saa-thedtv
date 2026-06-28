# Homepage SAA 2025 — Four Phases, Evidence Gate Sealed

**Date**: 2026-06-28
**Severity**: Low
**Component**: Home page, shared components, auth middleware
**Status**: Resolved

## What Happened

Built the full Homepage SAA 2025 in four phases: shared components, home sections, assembly into `app/page.tsx`, and test coverage. 14 files touched. Build passes, 39/39 tests green, lint clean.

## The Brutal Truth

Getting Server/Client component split right—especially header navigation—ate cycles. The decision to split Header into a Server component (avatar fetch) and a Client component (burger menu, active link logic) worked but required careful prop threading. Award images don't exist yet, so gradient placeholders bought us time. No broken `<img>` errors, but the visual will feel hollow until designs ship.

## Technical Details

**Phase 1 — Shared Components**
- `header.tsx` (Server): fetches user avatar from Google OAuth metadata via Supabase
- `header-nav.tsx` (Client): hamburger menu, `usePathname()` active link highlight, `useState` for toggle
- `footer.tsx` (Server): static footer, reused from figma spec
- `widget-button.tsx` (Client): yellow pill FAB, placeholder onClick handler

**Phase 2 — Home Sections**
- `types/awards.ts`: Award type definition + AWARD_META static mapping (category → image/slug)
- `hero-section.tsx`: full-viewport, reuses CountdownTimer from countdown_page branch
- `root-further-section.tsx`: decorative background text + quote block
- `awards-section.tsx`: Server Component, queries Supabase `awards` table
- `award-card.tsx`: Server Component, AWARD_META lookup, hover lift effect
- `kudos-section.tsx`: 2-column layout with placeholder cards

**Phase 3 — Assembly**
- `app/page.tsx`: replaced placeholder with full homepage structure
- `middleware.ts`: added auth guard for `/`; **fixed pre-existing bug** where `intlMiddleware` return was discarded; eliminated double Supabase client instantiation on root route
- `messages/vi.json` + `messages/en.json`: added `common.*` and `home.*` namespaces

**Phase 4 — Tests**
- `award-card.test.tsx`: 5 tests (title, description, href, i18n key, 6 category slugs)
- `awards-section.test.tsx`: 5 tests (mocked AwardCard, Supabase mock)
- `e2e/home.spec.ts`: auth guard redirect test; authenticated flows skipped (awaiting live env)

## What We Tried

Award images: initially considered dynamic `image_url` column in `awards` table. Rejected — cost of schema migration + image upload pipeline too high right now. Static AWARD_META mapping by category is the holdpoint.

## Root Cause Analysis

The design came from Figma with clear specs but award images unfinished. Rather than wait or mock with broken links, we embedded the category-to-asset mapping in code. Lets the page render whole. When images land, one file changes: `types/awards.ts`.

## Lessons Learned

**Split Server/Client explicitly.** The Header pattern (Server fetches auth data → passes to Client burger logic) scales. Future sections: apply the same discipline.

**Queries belong in Server Components.** Award fetching lives in `awards-section.tsx`, not buried in a client hook. Cleaner, safer, one source of truth.

**Cast `.returns<T>()` on Supabase queries instead of `as T`.** It's typed, it's clear, and it catches schema drift earlier.

## Next Steps

- Award images land → update AWARD_META in `types/awards.ts`, test visuals
- Authenticated sections (Kudos details, user widget) → wire real data once auth flow is confirmed live
- E2E tests for auth gate → unlock once local Supabase mirrors prod schema

**Timeframe**: images by sprint close; auth integration by next sprint.

---

**Evidence gate:** Build ✅ | Tests ✅ | Lint ✅
