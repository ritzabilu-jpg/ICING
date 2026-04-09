import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CalendarEntry {
  week_start: string
  day_of_week: number
  platform: 'tiktok'|'instagram_reel'|'instagram_feed'|'facebook'
  post_id?: string
  idea_id?: string
  slot_label?: string
  notes?: string
}

export async function saveCalendarWeek(entries: CalendarEntry[]): Promise<void> {
  const { error } = await supabase.from('content_calendar').insert(entries)
  if (error) { console.error(error.message); throw error }
  console.log(`✅ תוכנית שבועית נשמרה — ${entries.length} רשומות`)
}

export async function getWeekCalendar(weekStart: string) {
  const { data, error } = await supabase
    .from('content_calendar')
    .select(`*, social_posts(id,platform,hook,status,approved_by_human), content_ideas(id,pillar,angle)`)
    .eq('week_start', weekStart)
    .order('day_of_week')
  if (error) throw error
  return data || []
}

export async function printWeeklyDigest(weekStart: string): Promise<void> {
  const calendar = await getWeekCalendar(weekStart)
  const days = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']

  console.log(`\n📅 תוכנית תוכן — שבוע ${weekStart}\n`)
  for (const e of calendar) {
    const approved = e.social_posts?.approved_by_human ? '✅' : '⏳'
    console.log(`${days[e.day_of_week].padEnd(8)} | ${e.platform.padEnd(18)} | ${approved}`)
    if (e.content_ideas?.angle) console.log(`         | "${e.content_ideas.angle}"`)
  }
}
