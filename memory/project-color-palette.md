---
name: project-color-palette
description: "SAA 2025 color palette — đã confirm từ Figma, dùng CSS variables trong @theme (TailwindCSS 4)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1427457e-5e01-4b60-9e0f-d6a637ed92d2
---

Bộ màu chính thức đã được extract từ Figma variable collection "Color" (fileKey: 9ypp4enmFmdK3YAFJLIu6C) và khai báo trong `app/globals.css`.

**Các token màu (dùng trực tiếp trong Tailwind class):**

| Token | Hex | Mục đích |
|---|---|---|
| `bg` | `#00101a` | Nền trang chính |
| `bg-surface` | `#00070c` | Dropdown, lớp sâu nhất |
| `bg-container` | `#101417` | Card, modal |
| `bg-update` | `#1e2d39` | Vùng nổi bật phụ |
| `divider` | `#2e3940` | Đường kẻ phân cách |
| `border` | `#998c5f` | Viền vàng đồng |
| `primary` | `#ffea9e` | Gold accent — text, icon chính |
| `primary-hover` | `#fff8e1` | Hover state của primary button |
| `on-primary` | `#00101a` | Text trên nền gold |
| `text-white` | `#ffffff` | Text trắng |
| `text-muted` | `#999999` | Text phụ |
| `error` | `#b3261e` | Lỗi, cảnh báo đỏ |

**Opacity variants (dùng Tailwind `/` modifier):**
- `bg-primary/10` → `rgba(255,234,158,0.10)` — nền text button, secondary button normal
- `bg-primary/20` → `rgba(255,234,158,0.20)` — hashtag row selected background
- `bg-primary/40` → `rgba(255,234,158,0.40)` — secondary button hover

**Why:** User muốn dùng màu nhất quán từ Figma spec, không hardcode hex tùy tiện.

**How to apply:** Luôn dùng các token `bg-*`, `text-*`, `border-*`, `primary`, `error` này thay vì hardcode hex mới. Font chính là `Montserrat`.
