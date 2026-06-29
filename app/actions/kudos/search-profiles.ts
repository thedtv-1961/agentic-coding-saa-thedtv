'use server'

import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/src/types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export interface ProfileResult {
  id: string
  full_name: string
  avatar_url: string | null
}

type SearchProfilesResult = { data: ProfileResult[] } | { error: string }

export async function searchProfiles(query: string): Promise<SearchProfilesResult> {
  if (!query.trim()) return { data: [] }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .ilike('full_name', `%${query.trim()}%`)
    .limit(10)

  if (error) return { error: error.message }

  const results: ProfileResult[] = (data ?? []).map((row: Pick<ProfileRow, 'id' | 'full_name' | 'avatar_url'>) => ({
    id: row.id,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
  }))

  return { data: results }
}
