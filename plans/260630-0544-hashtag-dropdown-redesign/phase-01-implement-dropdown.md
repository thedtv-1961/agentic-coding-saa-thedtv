---
title: "Phase 01 — Implement Hashtag Dropdown mới"
status: completed
priority: P1
effort: "~1h"
---

# Phase 01 — Implement Hashtag Dropdown mới

## Context Links
- Spec: `.momorph/contexts/specs/Dropdown list hashtag/items_analysis.md`
- File cần sửa: `app/components/kudos/kudos-hashtag-field.tsx`
- MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/p9zO-c4a4x

## Design Values (từ MoMorph)

### Container (Dropdown-List)
```css
background: #00070C;
border: 1px solid #998C5F;
border-radius: 8px;
padding: 6px;
width: 318px; /* fluid trong thực tế */
```

### Selected Row (A/B/C state)
```css
background: rgba(255, 234, 158, 0.20); /* #FFEA9E tại 20% */
height: 40px;
padding: 0 16px;
border-radius: 2px;
```

### Unselected Row (D state)
```css
background: transparent;
height: 40px;
padding: 0 16px;
border-radius: 0 (default);
```

### Text label
```css
font-family: Montserrat, font-bold (700);
font-size: 16px;
line-height: 24px;
color: #FFFFFF;
letter-spacing: 0.15px;
```

### Check Icon
- 24×24px
- Vòng tròn + dấu ✓
- Hiển thị khi selected, ẩn (giữ khoảng trống 24px) khi unselected để layout ổn định

### Hover state
- Selected row hover: `rgba(255, 234, 158, 0.30)` (tăng opacity nhẹ)
- Unselected row hover: `rgba(255, 255, 255, 0.05)` (white tại 5% opacity)
- Disabled (khi đủ 5): cursor `not-allowed`, opacity giảm

## Requirements

### Functional
- [x] Dropdown mở khi click `+ Hashtag` (giữ nguyên trigger)
- [x] Hiển thị TẤT CẢ hashtags trong dropdown (cả selected lẫn unselected)
- [x] Click row đã chọn → bỏ chọn (deselect)
- [x] Click row chưa chọn (khi count < 5) → chọn (select)
- [x] Khi count = 5: unselected rows bị disable (không phản hồi click, opacity giảm)
- [x] Selected rows vẫn click được để bỏ chọn khi count = 5
- [x] Chips phía trên dropdown giữ nguyên (hiển thị selected items)
- [x] Click outside → đóng dropdown (giữ nguyên)

### Visual
- [x] Container: dark theme `#00070C`, border `#998C5F`
- [x] Selected row: `rgba(255,234,158,0.20)` bg + check icon visible
- [x] Unselected row: transparent bg + check icon space (ẩn nhưng giữ vị trí)
- [x] Text: Montserrat 700 16px white
- [x] Hover effects per state
- [x] Disabled state visual (opacity giảm, cursor not-allowed)

## Implementation Steps

### 1. Thêm CheckIcon SVG component (inline, trên file)
```tsx
function IconCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1.5"/>
      <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
```

### 2. Sửa dropdown list trong JSX
Thay thế `<ul>` hiện tại (chỉ show `available`) thành full list `hashtags` với toggle:

```tsx
{isOpen && (
  <ul className="absolute top-[calc(100%+4px)] left-0 z-10 
    min-w-[200px] rounded-lg border border-[#998C5F]
    bg-[#00070C] p-1.5 shadow-lg max-h-60 overflow-y-auto">
    {hashtags.map((h) => {
      const isSelected = value.includes(h.id);
      const isDisabled = !isSelected && value.length >= MAX_HASHTAGS;
      return (
        <li key={h.id}>
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => isSelected ? handleRemove(h.id) : handleAdd(h.id)}
            className={`w-full flex items-center justify-between
              h-10 px-4 rounded-[2px] transition-colors
              font-bold text-[16px] text-white tracking-[0.15px]
              ${isSelected
                ? 'bg-[rgba(255,234,158,0.20)] hover:bg-[rgba(255,234,158,0.30)]'
                : isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-transparent hover:bg-white/5'
              }`}
          >
            <span>#{h.name}</span>
            <span className="w-6 h-6 flex items-center justify-center shrink-0">
              {isSelected && <IconCheck />}
            </span>
          </button>
        </li>
      );
    })}
  </ul>
)}
```

### 3. Xóa message "hashtag_max" trong dropdown (nay hiển thị qua disabled state)

### 4. Giữ nguyên chips display và trigger button

## Related Code Files

- **Modify**: `app/components/kudos/kudos-hashtag-field.tsx`
- **Read**: `app/components/kudos/viet-kudos-modal.tsx` (context)

## Todo

- [x] Thêm `IconCheck` SVG component
- [x] Refactor dropdown: show all hashtags với toggle logic
- [x] Apply dark theme container styles
- [x] Apply per-row selected/unselected/disabled styles
- [x] Remove "hashtag_max" tooltip trong dropdown (dùng disabled state)
- [x] `npm run build` — kiểm tra lỗi
- [x] `npm run lint` — kiểm tra lỗi

## Success Criteria

- Dropdown hiển thị tất cả hashtags (không chỉ unselected)
- Selected rows có highlight + check icon
- Unselected rows có transparent bg
- Khi 5 selected: unselected disabled, selected vẫn bỏ chọn được
- Build + lint pass
- Chips phía trên vẫn hoạt động bình thường

## Risk Assessment

- **Low**: Logic đơn giản — toggle dựa trên `value.includes(id)`
- Không breaking change với parent components (same props)
