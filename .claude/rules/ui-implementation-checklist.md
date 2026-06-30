# UI Implementation Checklist

Apply this before, during, and after any UI implementation task.

---

## Before Starting

- [ ] **Auth guard awareness** — Check `middleware.ts` for protected routes before testing with Playwright. If route requires auth, plan for a login step or test on a public route (e.g. `/countdown`, `/login`).
- [ ] **Dev server hygiene** — Run `ss -tlnp | grep 300` to confirm only ONE dev server is running on the expected port. Kill stale instances before starting.
- [ ] **Clear stale `.next/` cache** — When switching branches or after bulk asset additions, run `rm -rf .next/` then restart dev server to avoid `Cannot find module './XXX.js'` or CSS 500 errors.
- [ ] **Image asset strategy** — Check `public/images/` first before fetching. For Figma exports:
  1. Try Figma MCP (`get_media_file`, `get_figma_image`)
  2. If MCP returns 401/500 (rate limit), use Figma REST API: `curl -H "X-Figma-Token: $FIGMA_API_KEY" "https://api.figma.com/v1/images/:fileKey?ids=nodeId1,...&format=png&scale=2"` — returns S3 URLs; download in parallel with `for ... & wait`
  3. Last resort: fall back to production CDN (e.g. `https://saa.sun-asterisk.vn/assets/`)
  - Never hardcode placeholder images or use hand-drawn SVGs as permanent stand-ins.
- [ ] **Confirm unclear requirements first** — _khi có điểm chưa rõ, phải hỏi user trước — không tự ý quyết định_.

---

## During Implementation

### Assets
- [ ] Download all Figma images to `public/images/<section>/` with descriptive names (kebab-case).
- [ ] Verify image dimensions with `file` or `identify` before referencing in code — wrong aspect ratio breaks layout.
- [ ] Use `next/image` with explicit `width`/`height` for static assets; use `fill` only inside a positioned container.
- [ ] **Do not replicate Figma badges/icons with CSS** — if the design has shadows, gradients, or embedded text baked into the asset, export it as an image. CSS approximations break under review and look wrong.
- [ ] **No `mix-blend-screen`** on elements unless page background guarantees the correct blend context (dark/black bg). Test visually before committing.

### Tailwind / CSS
- [ ] Use `bg-[#HEX]` for brand colors not yet in the design system. Add to design system only when confirmed by user.
- [ ] Use `text-[#FFEA9E]` for golden accent — confirmed brand accent color.
- [ ] Remove any decorative background text (watermark) if not present in Figma design.

### i18n
- [ ] Every new UI string → add to both `messages/en.json` **and** `messages/vi.json` before using `t("key")`.
- [ ] Use descriptive key names: `hero_coming_soon`, not `text1`.
- [ ] **Keys must match spec label names exactly.** Do not reuse a `*_placeholder` key for a `*_label` slot. next-intl silently renders the key string when the key is missing — no crash, but wrong UI.

### Components
- [ ] Server Component by default — add `"use client"` only if interactivity is needed.
- [ ] **Server/Client split pattern**: Server Component fetches auth/data and passes down as props; Client Component owns interaction (toggles, active links, state). Never fetch data inside a Client Component if it can live in the parent Server Component.
- [ ] Max 200 lines per file — split if exceeded.
- [ ] **FAB / toggle UI**: When a button expands into sub-buttons, the original button must hide (`{!isExpanded && <button>}`). Never leave both visible simultaneously.
- [ ] **Font size from Figma spec**: Always pull `fontSize` from `get_node_context` styles — do NOT guess. Map directly: 24px → `text-2xl`, 20px → `text-xl`, 14px → `text-sm`, etc.
- [ ] **`contentEditable` selection is fragile**: Any React re-render invalidates the DOM selection. If a dialog opens over `contentEditable` content, save the `Range` before opening and restore it after close using `saveSelection()` / `restoreSelection()` with the `Range` API.

### Supabase Queries
- [ ] Use `.returns<T>()` on Supabase queries instead of `as T` — it's type-safe and catches schema drift earlier.
- [ ] Queries belong in Server Components. Don't fetch data inside client hooks when a parent Server Component can own it.

---

## After Implementation

### Visual Verification (MANDATORY)
- [ ] Take viewport screenshot (not `fullPage`) first to see above-the-fold layout.
- [ ] Take fullPage screenshot and compare each section against Figma design.
- [ ] Check on 1440px viewport (desktop) — use `browser_resize` if needed.
- [ ] Verify text colors match design (`#FFEA9E` for accents, `white` / `white/70` for body).
- [ ] Verify images render correctly: correct aspect ratio, no broken src, no invisible elements due to color blending.

### Dev Server Health Check
- [ ] Open browser console — zero 4xx/5xx errors for static assets (`_next/static/css/`, `_next/static/chunks/`).
- [ ] If CSS 500 error → stale `.next/` cache → `rm -rf .next/ && npm run dev`.
- [ ] If CSS 404 error → TailwindCSS compilation failed → check `npm run build` for TypeScript/ESLint errors.

### Build & Quality Gates
- [ ] `npm run build` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run test` passes (existing tests not broken).

### Tests
- [ ] Write or update tests alongside every component change — do not hand-wave old tests over new behavior.
- [ ] **Pre-existing failures**: never use `--exclude` as a permanent solution. Either fix the failing test or remove it from the suite. A failing test blocking `npm run test` is unacceptable.
- [ ] **Vitest fake timers + async**: `vi.useFakeTimers()` deadlocks with `waitFor()` (both use `setTimeout`). Pattern: `await act(async () => { vi.advanceTimersByTime(300); })` flushes timers and promise microtasks atomically.

---

## Common Pitfalls (Learned the Hard Way)

| Pitfall | Root Cause | Fix |
|---------|-----------|-----|
| Static CSS/JS returns 500 | Stale `.next/` cache after bulk changes | `rm -rf .next/` + restart dev |
| Static CSS/JS returns 404 | Multiple dev servers on same port or build error | Kill stale servers; check `npm run build` |
| Images invisible on dark bg | `mix-blend-screen` without matching bg context | Remove blend mode or set explicit dark bg on container |
| Homepage not loading | Auth guard in middleware redirects to `/login` | Login first or test a public route |
| Figma MCP returns 401 mid-session | Rate limit (seat quota exhausted) | Check `.env` for `FIGMA_API_KEY`; use REST API fallback |
| Badge looks wrong vs Figma | Tried CSS approximation for a graphical asset | Export the image; CSS can't replicate shadows/gradients/embedded text |
| Wrong label text renders | `placeholder` key reused for `label` slot | Match key names to spec labels exactly |
| Button text too small vs design | Font size guessed instead of pulled from Figma | `get_node_context` → `styles.fontSize`, map to Tailwind class |
| FAB collapsed button stays visible when expanded | Missing visibility toggle | Wrap collapsed button in `{!isExpanded && ...}` |
| contentEditable loses selection on dialog open | React re-render invalidates DOM Range | Save Range before state change; restore after DOM settles |
| `useFakeTimers` test deadlock | `waitFor()` internally uses `setTimeout` | `await act(async () => { vi.advanceTimersByTime(n); })` |
| Test payload has duplicate keys | Copy-paste test data, no schema validation | Validate payloads with strict types; review all test payloads when adding fields |
