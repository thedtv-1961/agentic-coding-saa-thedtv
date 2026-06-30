# Phase 01 — Forge E2E Test for /awards

**Status:** ⬜ Todo
**Spec:** `../spec/awards-e2e.md`

## Goal

Create `e2e/awards.spec.ts` with Playwright tests for the `/awards` page.

## Files

- **Create:** `e2e/awards.spec.ts`
- **Pattern ref:** `e2e/home.spec.ts`

## Implementation Steps

1. Create `e2e/awards.spec.ts` following `home.spec.ts` pattern
2. **Group 1 — Auth Guard** (no auth needed, runs in CI):
   - Test: unauthenticated GET `/awards` → redirect `/login`
   - Test: cleared cookies + GET `/awards` → URL matches `/login`
3. **Group 2 — Authenticated** (`test.skip(true, "...")` — requires Google OAuth):
   - Page loads at `/awards`
   - Header visible (SAA logo)
   - Hero subtitle: "Sun* Annual Award 2025"
   - Hero section title: "SAA 2025 Award System"
   - Desktop awards nav visible (`aria-label="Danh mục giải thưởng"`)
   - At least one award detail `<h2>` visible in detail list
   - Kudos section visible (text "Sun* Kudos")
   - Footer visible

## Constraints

- No OAuth mock, no DB seeding
- Mirror `home.spec.ts` exactly: `BASE_URL` const, `test.describe` groups, `test.skip` pattern
- i18n values from `messages/en.json` → `awards.hero_subtitle`, `awards.section_title`

## Success Criteria

- [ ] `e2e/awards.spec.ts` created
- [ ] Auth Guard tests pass (`npx playwright test e2e/awards.spec.ts`)
- [ ] Authenticated group properly skipped with descriptive message
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
