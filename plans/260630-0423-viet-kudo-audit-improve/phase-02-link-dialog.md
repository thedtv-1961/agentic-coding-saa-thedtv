# Phase 02 — Link Dialog UX (thay window.prompt)

## Context Links

- Plan: `plans/260630-0423-viet-kudo-audit-improve/plan.md`
- File: `app/components/kudos/kudos-rich-text-editor.tsx:59-70`

## Overview

- **Priority**: P2
- **Status**: todo
- **Description**: Thay `window.prompt()` bằng inline popover dialog để nhập URL link — nhất quán với design language của app.

## Vấn đề

```ts
// Hiện tại — dùng native browser dialog
if (command === "createLink") {
  const url = window.prompt("Enter URL:");
  if (!url) return;
  document.execCommand("createLink", false, url);
}
```

`window.prompt()` chặn thread, không stylable, và trông không nhất quán với app.

## Architecture

Thêm inline URL input popover vào `kudos-rich-text-editor.tsx`:
- **Không cần component mới** — thêm state + conditional render trong file hiện tại
- Popover xuất hiện ngay dưới toolbar khi click nút link
- Input nhập URL + nút "Áp dụng" + nút "Hủy"

```tsx
// State thêm vào component
const [linkDialogOpen, setLinkDialogOpen] = useState(false);
const [linkUrl, setLinkUrl] = useState("");
```

```tsx
// Xử lý link click — thay window.prompt
if (command === "createLink") {
  // Lưu selection trước khi dialog mở
  savedSelectionRef.current = saveSelection();
  setLinkDialogOpen(true);
  return;
}

// Khi submit URL
function handleLinkSubmit() {
  if (!linkUrl.trim()) return;
  restoreSelection(savedSelectionRef.current);
  document.execCommand("createLink", false, linkUrl.trim());
  editorRef.current?.focus();
  handleInput();
  setLinkDialogOpen(false);
  setLinkUrl("");
}
```

## Implementation Steps

1. Thêm state: `linkDialogOpen: boolean`, `linkUrl: string`
2. Thêm `savedSelectionRef` để lưu text selection trước khi dialog mở (vì focus chuyển sang input làm mất selection)
3. Viết `saveSelection()` / `restoreSelection()` helpers dùng `window.getSelection()` và `Range`
4. Sửa `execCommand` handler cho `createLink` — không gọi `window.prompt`, thay bằng `setLinkDialogOpen(true)`
5. Render inline dialog ngay dưới toolbar khi `linkDialogOpen`:

```tsx
{linkDialogOpen && (
  <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-2 py-1.5 shadow-sm">
    <input
      type="url"
      value={linkUrl}
      onChange={(e) => setLinkUrl(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleLinkSubmit();
        if (e.key === "Escape") { setLinkDialogOpen(false); setLinkUrl(""); }
      }}
      placeholder="https://..."
      autoFocus
      className="flex-1 text-sm border-none outline-none"
    />
    <button type="button" onClick={handleLinkSubmit}
      className="text-xs px-2 py-1 bg-yellow-400 rounded text-gray-800 font-medium">
      Áp dụng
    </button>
    <button type="button" onClick={() => { setLinkDialogOpen(false); setLinkUrl(""); }}
      className="text-xs text-gray-400 hover:text-gray-600">
      ×
    </button>
  </div>
)}
```

## Helpers — saveSelection / restoreSelection

```ts
function saveSelection(): Range | null {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) return sel.getRangeAt(0).cloneRange();
  return null;
}

function restoreSelection(range: Range | null) {
  if (!range) return;
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
```

## File giới hạn

`kudos-rich-text-editor.tsx` hiện có 126 dòng. Thêm dialog sẽ đẩy lên ~165 dòng — vẫn trong ngưỡng 200.

## Todo

- [ ] Thêm state `linkDialogOpen`, `linkUrl`, `savedSelectionRef`
- [ ] Thêm helpers `saveSelection` / `restoreSelection`
- [ ] Sửa `execCommand` handler cho `createLink`
- [ ] Render inline URL dialog
- [ ] Test: click link button → dialog mở, nhập URL → Enter áp dụng, Escape đóng

## Success Criteria

- [ ] Click nút link 🔗 mở inline dialog (không `window.prompt`)
- [ ] Enter hoặc nút "Áp dụng" chèn link vào text đang chọn
- [ ] Escape hoặc nút "×" đóng dialog
- [ ] Không có regression với toolbar buttons khác

## Next Steps

→ Phase 03: Unit tests
