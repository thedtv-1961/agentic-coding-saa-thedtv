# Phase 05 — Server Actions (Recipient Search, Hashtags, Submit Kudos)

## Context Links

- DB schema: `supabase/migrations/20260628000002_create_kudos_system.sql`
- RLS: `supabase/migrations/20260628000005_rls_policies.sql`
- Types: `src/types/database.types.ts`
- Code standards: `docs/code-standards.md` (Server actions pattern)
- Phụ thuộc: Phase 03 (image-upload.ts), Phase 04 (form state)

## Overview

- **Priority**: P1
- **Status**: completed
- **Description**: 3 server actions: tìm kiếm người nhận, lấy danh sách hashtag, submit kudos (insert kudos + kudos_hashtags + kudos_images).

## Key Insights

- RLS `kudos_insert`: `is_anonymous=false → sender_id = auth.uid()`, `is_anonymous=true → sender_id = null`
- `profiles` select policy: `authenticated` — tất cả user đã login có thể tìm người nhận
- `hashtags` chỉ cần SELECT (không insert từ client)
- Submit kudos là 3 bước DB liên tiếp: insert `kudos` → insert `kudos_hashtags` (batch) → insert `kudos_images` (nếu có)
- Nếu bất kỳ bước nào fail → cần rollback toàn bộ (dùng Supabase transaction hoặc xử lý manual)
- Image files đã được upload lên Storage ở Phase 03 trước khi submit form → chỉ lưu URL vào `kudos_images`

## Architecture

```
app/actions/kudos/
├── search-profiles.ts    ← searchProfiles(query: string)
├── get-hashtags.ts       ← getHashtags()
├── submit-kudos.ts       ← submitKudos(payload)
```

Return type convention (từ code-standards.md):
```ts
type ActionResult<T> = { data: T } | { error: string }
```

## Related Code Files

**Create:**
- `app/actions/kudos/search-profiles.ts`
- `app/actions/kudos/get-hashtags.ts`
- `app/actions/kudos/submit-kudos.ts`

**Read for context:**
- `src/types/database.types.ts`
- `utils/supabase/server.ts` (createServerClient pattern)

## Implementation Steps

### 1. `search-profiles.ts`

```ts
'use server'

export async function searchProfiles(query: string) {
  if (!query.trim()) return { data: [] };
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .ilike('full_name', `%${query}%`)
    .limit(10);
  if (error) return { error: error.message };
  return { data: data ?? [] };
}
```

### 2. `get-hashtags.ts`

```ts
'use server'

export async function getHashtags() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, name')
    .order('name');
  if (error) return { error: error.message };
  return { data: data ?? [] };
}
```

### 3. `submit-kudos.ts`

```ts
'use server'

interface SubmitKudosPayload {
  receiverId: string;
  content: string;
  hashtagIds: string[];
  imageUrls: string[];   // public URLs đã upload
  isAnonymous: boolean;
}

export async function submitKudos(payload: SubmitKudosPayload) {
  const supabase = await createServerClient();

  // Lấy user hiện tại
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Chưa đăng nhập' };

  // Validate
  if (!payload.receiverId) return { error: 'Vui lòng chọn người nhận' };
  if (!payload.content.trim()) return { error: 'Vui lòng nhập nội dung lời cảm ơn' };
  if (payload.hashtagIds.length === 0) return { error: 'Vui lòng thêm ít nhất 1 hashtag' };
  if (payload.hashtagIds.length > 5) return { error: 'Tối đa 5 hashtag' };
  if (payload.imageUrls.length > 5) return { error: 'Tối đa 5 ảnh' };

  // Insert kudos
  const { data: kudos, error: kudosError } = await supabase
    .from('kudos')
    .insert({
      sender_id: payload.isAnonymous ? null : user.id,
      receiver_id: payload.receiverId,
      content: payload.content,
      is_anonymous: payload.isAnonymous,
    })
    .select('id')
    .single();
  if (kudosError) return { error: kudosError.message };

  // Insert kudos_hashtags
  const hashtagRows = payload.hashtagIds.map(hid => ({
    kudos_id: kudos.id,
    hashtag_id: hid,
  }));
  const { error: htError } = await supabase.from('kudos_hashtags').insert(hashtagRows);
  if (htError) {
    // Cleanup kudos (best-effort)
    await supabase.from('kudos').delete().eq('id', kudos.id);
    return { error: htError.message };
  }

  // Insert kudos_images (nếu có)
  if (payload.imageUrls.length > 0) {
    const imageRows = payload.imageUrls.map((url, i) => ({
      kudos_id: kudos.id,
      url,
      order_index: i,
    }));
    const { error: imgError } = await supabase.from('kudos_images').insert(imageRows);
    if (imgError) {
      await supabase.from('kudos').delete().eq('id', kudos.id);
      return { error: imgError.message };
    }
  }

  return { data: { id: kudos.id } };
}
```

**Lưu ý rollback**: Supabase JS client chưa có native transaction API — dùng cleanup manual như trên. Nếu cần atomic hơn, dùng Supabase RPC (PostgreSQL function) — ngoài scope plan này.

## Todo

- [ ] Tạo `app/actions/kudos/search-profiles.ts`
- [ ] Tạo `app/actions/kudos/get-hashtags.ts`
- [ ] Tạo `app/actions/kudos/submit-kudos.ts`
- [ ] Verify RLS cho `kudos_insert` policy hoạt động đúng khi `is_anonymous=true`
- [ ] Test thủ công với Supabase Studio

## Success Criteria

- [ ] `searchProfiles("Nguyen")` trả về danh sách profiles match
- [ ] `getHashtags()` trả về toàn bộ hashtags từ DB
- [ ] `submitKudos(...)` insert đúng 3 bảng với data hợp lệ
- [ ] `submitKudos` với `isAnonymous=true` → `sender_id = null` trong DB
- [ ] `submitKudos` với field thiếu → trả về `{ error: "..." }` không crash

## Risk Assessment

- **RLS conflict với anonymous**: `kudos_insert` policy check `is_anonymous=true AND sender_id IS NULL` — verify kỹ trước khi implement
- **Cleanup race condition**: nếu hashtag insert fail và cleanup kudos fail → orphaned kudos row; acceptable risk cho scope này, có thể dùng DB function sau

## Next Steps

→ Phase 06 (Integration): import 3 actions này vào modal form
