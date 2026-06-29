'use server'

import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/src/types/database.types'

type HashtagRow = Database['public']['Tables']['hashtags']['Row']

export interface HashtagResult {
  id: string
  name: string
}

type GetHashtagsResult = { data: HashtagResult[] } | { error: string }

export async function getHashtags(): Promise<GetHashtagsResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, name')
    .order('name')

  if (error) return { error: error.message }

  const results: HashtagResult[] = (data ?? []).map((row: Pick<HashtagRow, 'id' | 'name'>) => ({
    id: row.id,
    name: row.name,
  }))

  return { data: results }
}
