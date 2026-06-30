# Phase 01 — Phân tích Figma & Redesign LanguageSwitcher

## Context

- **MoMorph**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
- **Specs**: `.momorph/contexts/specs/Dropdown-ngôn ngữ/`
- **Component hiện tại**: `app/components/login/language-switcher.tsx`
- **Test hiện tại**: `src/test/login/language-switcher.test.tsx`
- **Được dùng tại**: `app/components/shared/header-nav.tsx`
- **Flag icons**: `public/icons/flag-vn.svg`, `public/icons/flag-en.svg`

## Overview

- **Priority**: P1
- **Status**: completed
- **Mục tiêu**: Redesign phần visual của `LanguageSwitcher` để khớp với Figma spec; giữ nguyên logic i18n cookie + reload.

## Key Insights từ Specs

| Thuộc tính | Spec |
|-----------|------|
| Selected item bg | Nền xám đậm (lấy giá trị chính xác từ Figma) |
| Option item bg | Nền đen |
| Hover state | Highlight (màu exact từ Figma) |
| Animation | Không có (no animation khi toggle) |
| Layout item | Flag icon (trái) + Label VN/EN (chữ trắng) |
| VN no-op | Click VN khi đang là VN → không làm gì |
| Mặc định | VN |
| Open/close | Click vào selected item để toggle |

**Open question từ spec**: Màu hover/active của item EN chưa xác định (`TODO` trong items_analysis.md) → dùng `white/10` (consistent với header-nav) cho đến khi có spec chính thức.

## Related Code Files

- **Sửa**: `app/components/login/language-switcher.tsx`
- **Sửa**: `src/test/login/language-switcher.test.tsx`
- **Đọc**: `app/components/shared/header-nav.tsx` (context dùng component)

## Implementation Steps

### 1. Lấy Figma design data

Dùng MoMorph tool để lấy màu chính xác:
```
get_frame(screenId: "hUyaaugye2") → kiểm tra background colors
get_node_context(nodeId: "525:11713") → Dropdown-List container
get_node_context(nodeId: "I525:11713;362:6085") → selected item (VN)
get_node_context(nodeId: "I525:11713;362:6128") → option item (EN)
```

### 2. Redesign component

**File**: `app/components/login/language-switcher.tsx`

Giữ nguyên:
- `"use client"` directive
- `useLocale()` hook
- `useState(open)` toggle
- Cookie-based locale switching: `document.cookie = \`NEXT_LOCALE=...\``
- `window.location.reload()` sau khi set cookie

Thay đổi:
- **Layout**: Bỏ chevron SVG arrow — không có trong Figma spec
- **Selected item bg**: Dùng màu từ Figma (dark gray, ví dụ `bg-[#2C2C2C]` hoặc `bg-white/15`)
- **Option item bg**: Đen (`bg-black` hoặc `bg-[#0D0D0D]`)
- **Hover**: `hover:bg-white/10` (placeholder cho đến khi có spec)
- **No-op khi click same locale**: `if (code === currentLocale) { setOpen(false); return; }`
- **Aria**: giữ `aria-expanded`, `role="listbox"`, `role="option"`, `aria-selected`

Pseudocode structure:
```tsx
<div className="relative">
  {/* Trigger = selected item */}
  <button onClick={toggle} className="[selected-item-styles]">
    <Image flag /> <span>{current.label}</span>
  </button>

  {/* Dropdown list */}
  {open && (
    <ul role="listbox" className="absolute ...">
      {LOCALES.map(locale => (
        <li key={locale.code}>
          <button
            role="option"
            aria-selected={locale.code === currentLocale}
            onClick={() => selectLocale(locale.code)}
            className="[option-item-styles] [hover-styles]"
          >
            <Image flag /> <span>{locale.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )}
</div>
```

### 3. Cập nhật unit tests

**File**: `src/test/login/language-switcher.test.tsx`

Thêm test case:
- `it("clicking current locale closes dropdown without reload")`
- `it("selected item has correct aria-selected")`
- `it("no chevron/arrow in DOM")` (nếu bỏ chevron)

Giữ nguyên test cases hiện có (chỉ update mock nếu cần).

### 4. Build & lint check

```bash
npm run build
npm run lint
npm run test
```

## Todo List

- [x] Lấy màu chính xác từ Figma (node context cho selected + option items)
- [x] Redesign `language-switcher.tsx` theo spec
- [x] Thêm no-op logic cho same-locale click
- [x] Cập nhật `language-switcher.test.tsx`
- [x] `npm run build` pass
- [x] `npm run lint` pass
- [x] `npm run test` pass
- [x] Screenshot thực tế so sánh với Figma

## Success Criteria

- Selected item hiển thị với nền xám đậm (khác rõ với option items)
- Option items có nền đen, hover highlight
- Click VN khi đang VN → dropdown đóng, không reload
- Tất cả tests pass (cũ + mới)
- Build + lint sạch

## Risk Assessment

| Rủi ro | Mức độ | Phòng tránh |
|--------|--------|-------------|
| Màu hover chưa có trong spec | Thấp | Dùng `white/10` làm placeholder |
| Chevron trong test hiện tại | Thấp | Kiểm tra trước khi xóa |
| Breakage ở mobile/login page | Thấp | Component reuse — không thay đổi API |

## Open Questions

1. **Màu hover/active của option items**: Spec ghi `TODO` — dùng `hover:bg-white/10` tạm thời, confirm với designer sau.
2. **Vị trí dropdown**: Hiện `right-0` (align phải) — kiểm tra trên mobile header có đúng không.
