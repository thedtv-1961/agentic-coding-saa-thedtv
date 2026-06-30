---
feature: awards-e2e-tests
lang: en
spec_lang: en
version: 1.0.0
status: draft
---

# Spec: Playwright E2E Tests for /awards Page

## Purpose

Add Playwright E2E tests for the `/awards` page covering: auth guard redirect,
page structure/layout, hero content, and navigation elements. Mirrors the pattern
established in `e2e/home.spec.ts`.

## Scope

- File: `e2e/awards.spec.ts`
- Route: `/awards`
- Auth: Protected route (unauthenticated → `/login`)

## Test Cases

### Group 1 — Auth Guard (runs without auth)

| # | Test | Expected |
|---|------|----------|
| 1 | Unauthenticated GET `/awards` | Redirect to `/login` |
| 2 | No session (cleared cookies) → `/awards` | URL matches `/login` |

### Group 2 — Authenticated (skipped — OAuth required)

| # | Test | Expected |
|---|------|----------|
| 3 | Page loads at `/awards` | URL stays `/awards` |
| 4 | Header visible | SAA logo present |
| 5 | Hero subtitle visible | "Sun* Annual Award 2025" |
| 6 | Hero section title visible | "SAA 2025 Award System" |
| 7 | Awards nav (desktop sidebar) visible | `<nav aria-label="Danh mục giải thưởng">` |
| 8 | At least one award detail card visible | `<h2>` inside detail list |
| 9 | Kudos section visible | text "Sun* Kudos" |
| 10 | Footer visible | `<footer>` element |

## Constraints

- No OAuth mock — authenticated group uses `test.skip(true, "...")`
- No DB seeding in tests — rely on existing Supabase local data
- Follow pattern from `e2e/home.spec.ts` exactly (BASE_URL const, describe groups)
- i18n keys referenced: `awards.hero_subtitle`, `awards.section_title`
- Nav `aria-label`: "Danh mục giải thưởng" (from component source)

## Out of Scope

- Nav scrollspy behavior (requires authenticated session + real DOM scroll)
- Mobile dropdown select (viewport-specific, requires auth)
- Award card image rendering (requires Supabase data + auth)
