# Phase 01 — Route Setup + Auth + Data Layer

## Overview
- **Priority**: P1
- **Status**: todo
- **Effort**: ~45 phút

## Context Links
- Plan: `plans/260628-1800-awards-page/plan.md`
- DB types: `src/types/database.types.ts`
- Award types: `types/awards.ts`
- Middleware: `middleware.ts`
- MoMorph screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD

## Key Insights
- Route `/awards` chưa tồn tại — chỉ có `app/awards/` chưa được tạo
- Middleware hiện chỉ protect `/` và `/login`. Cần thêm auth guard cho `/awards`
- `types/awards.ts` type `Award` thiếu `award_value` và `recipient_count` — cần bổ sung để render detail cards
- DB table `awards` đã có: `id, category, title, description, award_value, recipient_count, year`
- Shared Header/Footer đã có tại `app/components/shared/`

## Requirements

**Functional:**
- Route `/awards` tồn tại và trả về page
- Unauthenticated users bị redirect về `/login`
- Data fetch: lấy tất cả awards năm 2025, bao gồm `award_value` và `recipient_count`
- Type `Award` phản ánh đúng shape từ DB

**Non-functional:**
- Server Component (no "use client" ở page level)
- Không duplicate logic auth — tận dụng pattern của `app/page.tsx`

## Architecture

```
app/
  awards/
    page.tsx          ← Server Component, auth guard, data fetch
middleware.ts         ← Thêm /awards vào auth guard

types/
  awards.ts           ← Bổ sung award_value, recipient_count vào Award type
```

## Related Code Files

**Đọc để tham khảo:**
- `app/page.tsx` — pattern auth guard + data fetch homepage
- `middleware.ts` — auth guard logic
- `types/awards.ts` — Award type hiện tại
- `src/types/database.types.ts` — DB schema reference

**Tạo mới:**
- `app/awards/page.tsx`

**Sửa:**
- `middleware.ts` — thêm `/awards` vào guard
- `types/awards.ts` — bổ sung fields

## Implementation Steps

1. **Mở rộng `Award` type** (`types/awards.ts`):
   - Thêm `award_value: string` và `recipient_count: number` vào type
   - `AWARD_META` không đổi

2. **Thêm auth guard cho `/awards`** (`middleware.ts`):
   - Copy pattern của guard cho `/` — nếu không có user → redirect `/login`
   - Đặt cùng chỗ với guard `/` để dễ đọc

3. **Tạo `app/awards/page.tsx`**:
   - Server Component
   - Fetch awards từ Supabase: `select("id,category,title,description,award_value,recipient_count")` với `.eq("year", 2025)`
   - Sort theo `CATEGORY_ORDER` (đã có trong `awards-section.tsx`)
   - Render layout cơ bản: `<Header />`, main content placeholder, `<Footer />`
   - Pass `awards` data xuống các components (phase 02 và 03 sẽ fill)

## Todo

- [ ] Bổ sung `award_value`, `recipient_count` vào `Award` type
- [ ] Thêm auth guard `/awards` vào `middleware.ts`
- [ ] Tạo `app/awards/page.tsx` với data fetch + layout skeleton
- [ ] Chạy `npm run build` để xác nhận không có type error

## Success Criteria
- Truy cập `/awards` khi chưa login → redirect về `/login`
- Truy cập `/awards` khi đã login → page render (dù chưa có nội dung đầy đủ)
- `npm run build` pass

## Risk Assessment
- **Low**: Middleware pattern đơn giản, đã có sẵn cho `/`
- **Low**: Type extension không breaking — chỉ thêm fields
