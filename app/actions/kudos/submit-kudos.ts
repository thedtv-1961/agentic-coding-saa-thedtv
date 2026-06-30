'use server'

import { createClient } from '@/utils/supabase/server'

export interface SubmitKudosPayload {
  receiverId: string
  title: string
  content: string
  hashtagIds: string[]
  imageUrls: string[]
  isAnonymous: boolean
}

type SubmitKudosResult = { data: { id: string } } | { error: string }

export async function submitKudos(payload: SubmitKudosPayload): Promise<SubmitKudosResult> {
  // Validate inputs before hitting DB
  if (!payload.receiverId) return { error: 'Vui lòng chọn người nhận' }
  if (!payload.title.trim()) return { error: 'Vui lòng nhập danh hiệu' }
  if (!payload.content.trim()) return { error: 'Vui lòng nhập nội dung lời cảm ơn' }
  if (payload.hashtagIds.length === 0) return { error: 'Vui lòng thêm ít nhất 1 hashtag' }
  if (payload.hashtagIds.length > 5) return { error: 'Tối đa 5 hashtag' }
  if (payload.imageUrls.length > 5) return { error: 'Tối đa 5 ảnh' }

  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  // Step 1: Insert kudos row
  const { data: kudos, error: kudosError } = await supabase
    .from('kudos')
    .insert({
      sender_id: payload.isAnonymous ? null : user.id,
      receiver_id: payload.receiverId,
      title: payload.title.trim(),
      content: payload.content.trim(),
      is_anonymous: payload.isAnonymous,
    })
    .select('id')
    .single()

  if (kudosError) return { error: kudosError.message }

  // Step 2: Insert kudos_hashtags (batch)
  const hashtagRows = payload.hashtagIds.map((hid) => ({
    kudos_id: kudos.id,
    hashtag_id: hid,
  }))

  const { error: htError } = await supabase.from('kudos_hashtags').insert(hashtagRows)
  if (htError) {
    // Best-effort cleanup — acceptable risk per plan (no native transaction in JS client)
    await supabase.from('kudos').delete().eq('id', kudos.id)
    return { error: htError.message }
  }

  // Step 3: Insert kudos_images (optional)
  if (payload.imageUrls.length > 0) {
    const imageRows = payload.imageUrls.map((url, i) => ({
      kudos_id: kudos.id,
      url,
      order_index: i,
    }))

    const { error: imgError } = await supabase.from('kudos_images').insert(imageRows)
    if (imgError) {
      // Best-effort cleanup of kudos row (cascade deletes hashtags via FK)
      await supabase.from('kudos').delete().eq('id', kudos.id)
      return { error: imgError.message }
    }
  }

  return { data: { id: kudos.id } }
}
