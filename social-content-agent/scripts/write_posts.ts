import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface PostDraft {
  idea_id?: string
  platform: 'tiktok'|'instagram_reel'|'instagram_feed'|'facebook'
  hook: string
  caption: string
  on_screen_text?: string[]
  video_script?: string
  cta?: string
  hashtags?: string[]
  visual_direction?: string
  brand_check_result?: object
  brand_score?: number
  status?: string
}

export async function savePost(draft: PostDraft): Promise<string> {
  const { data, error } = await supabase
    .from('social_posts')
    .insert({ ...draft, created_by: 'agent', status: draft.status || 'draft' })
    .select('id').single()

  if (error) { console.error(error.message); throw error }
  console.log(`✅ פוסט נשמר: ${data.id}`)
  return data.id
}

export async function submitForApproval(postId: string, brandScore: number): Promise<void> {
  await supabase.from('social_posts')
    .update({ status: 'pending_approval', brand_score: brandScore })
    .eq('id', postId)

  await supabase.from('content_activities')
    .insert({ post_id: postId, activity: 'submitted_for_approval', actor: 'agent' })

  console.log(`📋 פוסט ${postId} שלוח לאישורך`)
}

export async function approvePost(postId: string): Promise<void> {
  await supabase.from('social_posts')
    .update({ status: 'approved', approved_by_human: true, approved_at: new Date().toISOString() })
    .eq('id', postId)

  await supabase.from('content_activities')
    .insert({ post_id: postId, activity: 'approved', actor: 'human' })

  console.log(`✅ פוסט ${postId} אושר`)
}

export async function getPendingPosts() {
  const { data, error } = await supabase.from('pending_approval').select('*')
  if (error) throw error
  return data || []
}
