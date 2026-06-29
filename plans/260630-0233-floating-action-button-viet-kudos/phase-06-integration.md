# Phase 06 — Integration (Wire Form + Auth Layout)

## Context Links

- Auth layout: `app/layout.tsx` (root), cần tìm/tạo auth-protected layout
- FAB component: Phase 01 (`app/components/shared/widget-button.tsx`)
- Thể Lệ drawer: Phase 02 (`app/components/shared/the-le-drawer.tsx`)
- Viết KUDOS modal: Phase 04 (`app/components/kudos/viet-kudos-modal.tsx`)
- Server actions: Phase 05 (`app/actions/kudos/`)

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Kết nối FAB → drawer → modal. Đặt tất cả vào auth-protected layout để xuất hiện trên mọi trang cần auth (homepage, awards, và các trang sau này).

## Key Insights

- Hiện tại `app/layout.tsx` là root layout (không có auth check).
- Homepage (`app/page.tsx`) và Awards (`app/awards/page.tsx`) đều có auth check riêng → cần một **shared auth layout** để đặt FAB một lần.
- Kiểm tra xem có `app/(protected)/layout.tsx` hay chưa — nếu chưa, tạo mới route group `(protected)`.
- FAB cần state cho 3 thứ: `fabOpen`, `drawerOpen`, `modalOpen` — dùng `useState` trong layout client component.
- Flow state:
  ```
  FAB collapsed → click → FAB expanded
  FAB expanded → click "Thể Lệ" → close FAB + open Drawer
  FAB expanded → click "Viết KUDOS" → close FAB + open Modal
  FAB expanded → click "×" → close FAB (collapsed)
  Drawer → click "Viết KUDOS" footer → close Drawer + open Modal
  Modal → submit success → close Modal + show toast
  Modal → cancel → close Modal
  ```

## Architecture

```
app/
├── (protected)/
│   ├── layout.tsx              ← NEW: auth-protected layout với FAB + Drawer + Modal
│   ├── page.tsx                ← move từ app/page.tsx (homepage)
│   └── awards/
│       └── page.tsx            ← move từ app/awards/page.tsx
app/components/shared/
└── fab-controller.tsx          ← "use client" — state controller cho FAB + Drawer + Modal
```

**Lưu ý về route group**: Di chuyển `page.tsx` và `awards/` vào `(protected)/` sẽ thay đổi URL path nếu không cẩn thận — route group `(protected)` giữ nguyên URL (không thêm `/protected/` vào path).

## Related Code Files

**Create:**
- `app/(protected)/layout.tsx` — auth check + render children + FAB controller
- `app/components/shared/fab-controller.tsx` — client component quản lý state

**Move (nếu chưa có route group):**
- `app/page.tsx` → `app/(protected)/page.tsx`
- `app/awards/page.tsx` → `app/(protected)/awards/page.tsx`
- `app/awards/` → `app/(protected)/awards/`

**Read for context:**
- `app/page.tsx` — hiểu auth logic hiện tại
- `app/awards/page.tsx` — tương tự
- `middleware.ts` — kiểm tra auth guard hiện tại

## Implementation Steps

1. **Kiểm tra cấu trúc hiện tại**:
   ```bash
   cat app/page.tsx          # xem auth check
   cat middleware.ts         # xem protected routes
   ls app/                   # xem có (protected)/ chưa
   ```

2. **Tạo `fab-controller.tsx`** (`"use client"`):
   ```tsx
   export function FabController() {
     const [fabExpanded, setFabExpanded] = useState(false);
     const [drawerOpen, setDrawerOpen] = useState(false);
     const [modalOpen, setModalOpen] = useState(false);

     const handleRulesClick = () => { setFabExpanded(false); setDrawerOpen(true); };
     const handleWriteKudos = () => { setDrawerOpen(false); setModalOpen(true); };

     return (
       <>
         <FloatingActionButton
           isExpanded={fabExpanded}
           onToggle={() => setFabExpanded(v => !v)}
           onRulesClick={handleRulesClick}
           onWriteKudosClick={() => { setFabExpanded(false); setModalOpen(true); }}
         />
         <TheLeDrqawerDrawer
           isOpen={drawerOpen}
           onClose={() => setDrawerOpen(false)}
           onWriteKudos={handleWriteKudos}
         />
         <VietKudosModal
           isOpen={modalOpen}
           onClose={() => setModalOpen(false)}
         />
       </>
     );
   }
   ```

3. **Tạo `app/(protected)/layout.tsx`**:
   ```tsx
   // Server component — auth check
   import { createServerClient } from '@/utils/supabase/server';
   import { redirect } from 'next/navigation';
   import { FabController } from '@/app/components/shared/fab-controller';

   export default async function ProtectedLayout({ children }) {
     const supabase = await createServerClient();
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) redirect('/login');
     return (
       <>
         {children}
         <FabController />
       </>
     );
   }
   ```

4. **Di chuyển pages vào `(protected)/`**:
   - Kiểm tra xem `app/page.tsx` và `app/awards/page.tsx` có auth redirect riêng không
   - Nếu có → xóa auth check trong page, để layout xử lý (DRY)
   - Move files: `cp app/page.tsx app/(protected)/page.tsx` rồi xóa cũ
   - Tương tự cho `awards/`
   - **Không** thay đổi URL — route group không ảnh hưởng path

5. **Wire server actions vào `VietKudosModal`**:
   - Import `searchProfiles` → `kudos-recipient-field.tsx`
   - Import `getHashtags` → `kudos-hashtag-field.tsx` (gọi lúc mount)
   - Import `submitKudos` → `viet-kudos-modal.tsx` (onSubmit handler)
   - Sau submit success: `onClose()` + show toast notification
   - Toast: dùng `alert()` (minimal) hoặc tạo `toast-notification.tsx` đơn giản

6. **Thêm toast notification** (đơn giản):
   ```tsx
   // Trong viet-kudos-modal.tsx sau submit success:
   // Option A: simple — dùng window.alert (không đẹp)
   // Option B: state-based toast trong fab-controller.tsx
   // Chọn Option B: fab-controller nhận callback onKudosSent → hiện toast 3s
   ```

7. **Verify middleware**: đảm bảo `/`, `/awards` vẫn trong danh sách protected routes

## Todo

- [ ] Đọc `app/page.tsx`, `app/awards/page.tsx`, `middleware.ts` để hiểu auth hiện tại
- [ ] Tạo `app/components/shared/fab-controller.tsx`
- [ ] Tạo `app/(protected)/layout.tsx`
- [ ] Di chuyển `app/page.tsx` → `app/(protected)/page.tsx`
- [ ] Di chuyển `app/awards/` → `app/(protected)/awards/`
- [ ] Xóa auth redirect trùng lặp trong pages (DRY)
- [ ] Wire `searchProfiles` vào recipient field
- [ ] Wire `getHashtags` vào hashtag field
- [ ] Wire `submitKudos` vào modal submit
- [ ] Toast sau submit success
- [ ] `npm run build` — kiểm tra không có lỗi import/route

## Success Criteria

- [ ] FAB xuất hiện trên homepage và awards page
- [ ] Click "Thể Lệ" → drawer mở, FAB đóng
- [ ] Click "Viết KUDOS" → modal mở, FAB đóng
- [ ] Drawer → "Viết KUDOS" → modal mở, drawer đóng
- [ ] Modal submit thành công → insert vào DB, modal đóng, toast hiện
- [ ] `npm run build` pass không lỗi
- [ ] URL không thay đổi (`/` và `/awards` vẫn đúng)

## Risk Assessment

- **Route group migration**: move file sai có thể break routing — commit trước khi move để dễ rollback
- **Duplicate auth check**: nếu page.tsx còn `redirect` riêng → layout redirect trước sẽ không vào đến page — test cẩn thận
- **Toast library**: không dùng thư viện ngoài (YAGNI) — state-based toast đơn giản là đủ

## Next Steps

→ Phase 07 (Tests): unit test server actions + E2E test FAB flow
