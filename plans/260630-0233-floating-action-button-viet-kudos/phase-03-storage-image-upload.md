# Phase 03 — Supabase Storage + Image Upload Utilities

## Context Links

- DB schema: `supabase/migrations/20260628000002_create_kudos_system.sql`
- RLS: `supabase/migrations/20260628000005_rls_policies.sql`
- Supabase Storage docs: context7 → `@supabase/supabase-js` storage API

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: Tạo Supabase Storage bucket `kudos-images`, migration RLS policy, và utility hooks/functions cho upload ảnh (max 5, validate format + size).

## Key Insights

- `kudos_images` table đã có: `id`, `kudos_id`, `url`, `order_index` — DB trigger giới hạn max 5 ảnh/kudos
- Cần Supabase Storage bucket `kudos-images` (public read, auth write)
- Upload flow: chọn file → validate → upload lên Storage → lấy public URL → lưu vào state (chưa insert DB, đợi submit form)
- Delete flow: xóa khỏi state (nếu chưa submit) hoặc xóa cả Storage + DB (nếu đã submit — ngoài scope plan này)
- Constraints: max 5 ảnh, accepted formats: JPG/PNG/WEBP, max 5MB/ảnh

## Requirements

**Migration mới:**
```sql
-- bucket kudos-images (public)
insert into storage.buckets (id, name, public)
values ('kudos-images', 'kudos-images', true);

-- RLS: authenticated users upload vào folder riêng của mình
create policy "kudos_images_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'kudos-images');

create policy "kudos_images_select"
  on storage.objects for select to authenticated
  using (bucket_id = 'kudos-images');
```

**Utilities:**
- `uploadKudosImage(file: File, userId: string): Promise<string>` — trả về public URL
- `validateImageFile(file: File): { valid: boolean; error?: string }` — validate format + size
- `getKudosImageUrl(path: string): string` — helper lấy public URL từ path

## Architecture

```
supabase/migrations/
└── 20260630000015_kudos_images_storage.sql   ← bucket + RLS

app/lib/kudos/
├── image-upload.ts     ← uploadKudosImage, validateImageFile, getKudosImageUrl
```

## Related Code Files

**Create:**
- `supabase/migrations/20260630000015_kudos_images_storage.sql`
- `app/lib/kudos/image-upload.ts`

## Implementation Steps

1. Kiểm tra bucket hiện có:
   ```bash
   supabase status  # hoặc MCP supabase__list_extensions để xác nhận local running
   ```
2. Tạo migration `20260630000015_kudos_images_storage.sql`:
   - Insert bucket `kudos-images` với `public = true`
   - RLS policy cho upload (authenticated) và select (authenticated)
   - File size limit: 5MB (5242880 bytes) — set qua `file_size_limit` trong bucket config
3. Apply migration: `supabase db reset` hoặc `supabase migration up`
4. Tạo `app/lib/kudos/image-upload.ts`:
   ```ts
   const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
   const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
   const MAX_IMAGES = 5;

   export function validateImageFile(file: File): { valid: boolean; error?: string } {
     if (!ACCEPTED_TYPES.includes(file.type))
       return { valid: false, error: 'Chỉ hỗ trợ JPG, PNG, WEBP' };
     if (file.size > MAX_SIZE_BYTES)
       return { valid: false, error: 'Ảnh tối đa 5MB' };
     return { valid: true };
   }

   export async function uploadKudosImage(file: File, userId: string): Promise<string> {
     const supabase = createBrowserClient(...);
     const path = `${userId}/${Date.now()}-${file.name}`;
     const { error } = await supabase.storage
       .from('kudos-images')
       .upload(path, file, { cacheControl: '3600', upsert: false });
     if (error) throw new Error(error.message);
     const { data } = supabase.storage.from('kudos-images').getPublicUrl(path);
     return data.publicUrl;
   }
   ```
5. Export hằng số `MAX_IMAGES` để dùng trong form validation

## Todo

- [ ] Tạo migration `20260630000015_kudos_images_storage.sql`
- [ ] Apply migration local (`supabase db reset` hoặc `supabase migration up`)
- [ ] Tạo `app/lib/kudos/image-upload.ts` với validate + upload functions
- [ ] Verify bucket accessible qua Supabase Studio `http://127.0.0.1:54323`

## Success Criteria

- [ ] Bucket `kudos-images` tồn tại trong local Supabase
- [ ] `validateImageFile` reject file sai format/quá size
- [ ] `uploadKudosImage` upload thành công và trả về public URL
- [ ] Public URL accessible (không cần auth để xem ảnh)

## Risk Assessment

- **supabase start chưa chạy**: cần Docker + `supabase start` trước khi apply migration
- **Bucket đã tồn tại**: dùng `ON CONFLICT DO NOTHING` trong migration để idempotent

## Next Steps

→ Phase 04 (Viết KUDOS Modal): import `uploadKudosImage`, `validateImageFile`, `MAX_IMAGES`
