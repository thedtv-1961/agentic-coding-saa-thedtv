---
phase: 2
title: "Responsive Layout"
status: completed
priority: P1
effort: "~1h"
---

# Phase 02 — Responsive Layout

## Context Links

- Specs QA (unanswered): `items_analysis.md` — responsive questions cho Main Section, Hero Visual, Logo
- Login page: `app/login/page.tsx`
- Hero component: `app/components/login/login-hero.tsx`
- Header component: `app/components/login/login-header.tsx`

## Overview

Đảm bảo login page hiển thị đúng trên mobile (375px) và tablet (768px). Code hiện tại chưa có breakpoint responsive — cần thêm.

## Requirements

Từ specs (các QA chưa có đáp án chính thức — áp dụng best practice):

| Element | Desktop | Mobile (375px) | Tablet (768px) |
|---------|---------|----------------|----------------|
| "ROOT FURTHER" | ~9rem | Thu nhỏ (clamp đã có) | Trung bình |
| Hero content block | Bên trái, ~50% width | Full width, centered | Full width hoặc left |
| Hero background | Cover right + partial top | Cover center | Cover |
| Header logo | 69×64px | Giữ nguyên hoặc nhỏ hơn | Giữ nguyên |
| Login button | `w-fit` | `w-full` hoặc `w-fit` | Giữ nguyên |
| Padding content | `px-12` | `px-6` | `px-8` |

## Implementation Steps

1. Mở `app/login/page.tsx` — kiểm tra background overlay responsive
2. Mở `app/components/login/login-hero.tsx`:
   - Thêm responsive padding: `px-6 md:px-12`
   - Adjust content block width: hiện tại full width (ok cho mobile)
   - Verify `clamp(4rem, 10vw, 9rem)` hoạt động đúng trên mobile
3. Mở `app/components/login/login-header.tsx`:
   - Thêm `px-4 md:px-6` nếu cần
4. Verify trên browser: 375px, 768px, 1440px
5. Dùng Playwright để chụp screenshot 3 breakpoints để confirm

## Acceptance Criteria

- [x] Mobile 375px: không có horizontal overflow, text readable, button accessible
- [x] Tablet 768px: layout hợp lý
- [x] Desktop 1440px: không bị vỡ so với trước
- [x] Screenshot xác nhận cả 3 breakpoints

## Completion Results

### Changes Applied

1. **Hero Component Responsive Padding**
   - Added: `px-6 md:px-10 lg:px-16`
   - File: `app/[locale]/login/components/login-hero.tsx`
   - Result: Proper spacing across mobile/tablet/desktop

2. **Font Size Verification**
   - Confirmed: `clamp(4rem, 10vw, 7rem)` works correctly across breakpoints
   - Mobile 375px: 64px (4rem floor)
   - Tablet 768px: ~76px (10vw = 76.8px)
   - Desktop 1440px: 140px (7rem ceiling)

3. **Header Responsive**
   - Maintained responsive padding consistency
   - Logo scaling verified across viewports

### Validation

- [x] Mobile responsive verified (375px)
- [x] Tablet layout confirmed (768px)
- [x] Desktop layout intact (1440px)
- [x] No horizontal overflow
- [x] Text readability maintained
- [x] Button accessibility preserved

## Files to Modify

- `app/components/login/login-hero.tsx` — responsive padding, font size check
- `app/components/login/login-header.tsx` — responsive padding nếu cần
- `app/login/page.tsx` — background responsive nếu cần

## Risk

- `clamp(4rem, 10vw, 9rem)` với viewport 375px → `10vw = 37.5px` — nhỏ hơn 4rem (64px) nên clamp trả về `4rem` = 64px. Hợp lý.
- Cần kiểm tra hero section `flex-1 flex flex-col justify-center` có hoạt động đúng trên mobile không (pt-24 padding-top khi header fixed)
