import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Pillar = 'science'|'experience'|'myth'|'tips'|'bts'|'community'
type Platform = 'tiktok'|'instagram_reel'|'instagram_feed'|'facebook'|'all'

interface Idea {
  pillar: Pillar
  platform: Platform
  angle: string
  hook_suggestion?: string
  content_type?: 'video'|'carousel'|'image'|'text'
  estimated_effort?: 'low'|'medium'|'high'
  notes?: string
}

export async function saveIdeas(ideas: Idea[]): Promise<void> {
  const { data, error } = await supabase
    .from('content_ideas')
    .insert(ideas.map(i => ({ ...i, created_by: 'agent' })))
    .select('id, angle, platform')

  if (error) { console.error(error.message); process.exit(1) }

  console.log(`✅ נשמרו ${data?.length} רעיונות`)
  data?.forEach((r, i) => console.log(`  ${i+1}. [${r.platform}] ${r.angle}`))
}

export async function getUnusedIdeas() {
  const { data, error } = await supabase.from('unused_ideas').select('*').limit(20)
  if (error) throw error
  return data || []
}

export async function markIdeaUsed(ideaId: string): Promise<void> {
  const { error } = await supabase
    .from('content_ideas').update({ used: true }).eq('id', ideaId)
  if (error) throw error
}
