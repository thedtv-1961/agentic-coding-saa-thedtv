---
phase: 1
title: "Visual Validation vs Figma"
status: completed
priority: P1
effort: "~45min"
---

# Phase 01 — Visual Validation vs Figma

## Context Links

- MoMorph design: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Specs: `.momorph/contexts/specs/Login/items_analysis.md`
- Design items: `.momorph/contexts/specs/Login/design_items.md`
- Login page: `app/login/page.tsx`
- Components: `app/components/login/`

## Overview

So sánh UI hiện tại với Figma design. Phát hiện và ghi nhận sai lệch để fix trong các phase sau.

## Checklist

- [x] Chụp screenshot login page trên desktop (1440px)
- [x] Lấy Figma design image qua MoMorph (`get_frame_image` hoặc screenshot)
- [x] So sánh:
  - [x] Header: layout, logo size, language selector position
  - [x] Hero: "ROOT FURTHER" typography (font size, weight, spacing)
  - [x] Hero: subtitle và tagline text/style
  - [x] Login button: màu `#e8d5a3` (Figma: vàng nhạt), icon Google, layout
  - [x] Hero visual: background image coverage và position
  - [x] Footer: text "Bản quyền thuộc về Sun* © 2025", style
- [x] Ghi gaps vào report (nếu có)

## Completion Results

### Issues Found & Fixed

1. **Font Weight on "ROOT FURTHER"**
   - Issue: Was `font-bold`, should be `font-thin`
   - Fixed in: `app/[locale]/login/components/login-hero.tsx`
   - Change: `font-bold` → `font-thin`

2. **Heading Font Size**
   - Issue: Too large (9rem clamp) vs Figma
   - Fixed in: `app/[locale]/login/components/login-hero.tsx`
   - Change: `clamp(4rem, 10vw, 9rem)` → `clamp(4rem, 10vw, 7rem)`

3. **Background Overlay**
   - Issue: Uniform solid black (bg-black/40) looked flat
   - Fixed in: `app/[locale]/login/components/login-hero.tsx`
   - Change: `bg-black/40` → `bg-gradient-to-r from-black/50 via-black/20 to-transparent`

4. **Google Icon Position**
   - Issue: Icon left of text, should be right
   - Fixed in: `app/[locale]/login/components/login-footer.tsx`
   - Change: Repositioned icon after button text

## Acceptance Criteria

- Screenshot hiện tại được chụp và đánh giá
- Sai lệch layout/màu/spacing được liệt kê rõ ràng
- Nếu không có sai lệch đáng kể → phase complete, note confirmed

## Implementation Steps

1. Start dev server (`npm run dev`)
2. Dùng Playwright/browser để chụp screenshot `http://localhost:3000/login`
3. Lấy Figma frame image qua momorph MCP: `get_frame_image(screenId="GzbNeVGJHz", fileKey="9ypp4enmFmdK3YAFJLIu6C")`
4. So sánh trực quan, liệt kê gaps
5. Nếu cần fix ngay → ghi vào phase-02 hoặc phase-03

## Risk

- Background image `login-background.png` có thể khác với Figma hero visual → cần verify
- Font size "ROOT FURTHER" dùng `clamp(4rem, 10vw, 9rem)` — cần verify tại 1440px khớp Figma
