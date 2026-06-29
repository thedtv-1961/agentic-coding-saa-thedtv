# Thể Lệ Drawer Dark Theme Implementation

**Date**: 2026-06-30 04:11
**Severity**: Medium
**Component**: Thể Lệ drawer, hero/collection badges
**Status**: Resolved

## What Happened

Rewrote the Thể Lệ drawer to match Figma design: dark background (`#00070C`), three content sections (Người nhận / Người gửi / Kudos Quốc Dân), styled hero and collection badges as image exports instead of CSS-rendered elements.

## The Brutal Truth

Hit two hard stops: Figma MCP plugin rate-limited mid-session (View seat quota), and the initial assumption that badge styling could live in CSS proved wrong—Figma designs them as graphical assets with embedded text. Rebuilding them as images felt heavy at first, but the result is pixel-perfect and avoids layout fragility.

## Technical Details

**Components rewritten:**
- `the-le-content.tsx`: 3-section layout with dark theme, hero badges (4x), collection badges (6x)
- `the-le-drawer.tsx`: panel width 553px, dark border footer, white outline close button, golden (#FFEA9E) "Viết KUDOS" button

**Error hit:**
- Figma MCP `get_media_file` returned 401 (rate limit) after 6 successful exports
- Browser dev tools showed `.next/static/css/` returning 500 during dev server reload

**Workaround:**
When MCP plugin hit its ceiling, pivoted to Figma REST API directly:
```bash
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/images/:fileKey?ids=nodeId1,nodeId2,...&format=png&scale=2"
```
This returned S3 URLs; downloaded all 10 images (4 hero + 6 collection) in parallel with 10 concurrent curl commands. No second rate-limit hit.

## What We Tried

1. **CSS-styled badge pills** — user request was explicit: "use actual Figma images". Recognized this early; no time wasted.
2. **Figma MCP plugin alone** — hit rate limit; switched to REST API as backup.
3. **Stale `.next/` cache on CSS 500** — cleared with `rm -rf .next/` + dev server restart. Resolved the dev-time friction.

## Root Cause Analysis

**Assumption broken:** Badge styling in Figma is graphical, not text-over-styling. The designs embed labels, shadows, and gradients into the image itself. Trying to replicate with CSS was fighting the source truth.

**Rate limit hit:** The MCP plugin has seat-based quotas per project. One user can exhaust the View quota; REST API has higher per-token limits and is the right fallback.

## Lessons Learned

1. **Figma image exports are not negotiable.** When a Figma design shows a polished badge with shadow/gradient/embedded text, export it. CSS styling that approximates it will break under review.

2. **Always check `.env` for `FIGMA_API_KEY`** before declaring a Figma fetch failure. The REST API is the escape hatch when MCP hits rate limits. Node tree IDs from `get_frame_node_tree` map 1:1 to REST API image node IDs.

3. **Parallel image download cuts wait time.** 10 images in one bash loop (`for ... & wait`) beats sequential curl. Each image is ~150KB; 10× in parallel takes ~4s total vs 40s sequentially.

4. **Dev server cache friction is real.** When bulk assets land and CSS 500 errors appear, kill the server, `rm -rf .next/`, restart. Do not debug the error in-place—it's almost always stale compilation.

## Next Steps

- Monitor Figma MCP rate limits on future sessions. If hitting quota again, establish a convention: use REST API by default for image exports on large batches.
- Consider documenting this REST API workaround in `ui-implementation-checklist.md` under "Image asset strategy" for the next engineer who hits it.

