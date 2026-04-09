/**
 * daily_digest.ts — דוח יומי מ-Supabase
 * הרצה: npm run agent:digest
 */
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateDailyDigest(): Promise<string> {
  const today = new Date(); today.setHours(0,0,0,0);
  const now = new Date().toISOString();
  const h72 = new Date(Date.now()-72*60*60*1000).toISOString();
  const weekAgo = new Date(Date.now()-7*24*60*60*1000).toISOString();

  const [nl,pl,fu,st,bk] = await Promise.all([
    supabase.from('leads').select('*').gte('created_at',today.toISOString()),
    supabase.from('leads').select('id,name,score,heat,draft_message,lead_type')
      .eq('status','pending_approval').eq('approved_by_human',false).order('score',{ascending:false}),
    supabase.from('leads').select('id,name,lead_type').lte('next_follow_up',now).in('status',['sent','replied']),
    supabase.from('leads').select('id,name,created_at').eq('status','new').lte('created_at',h72),
    supabase.from('leads').select('id,name,lead_type').eq('status','booked').gte('updated_at',weekAgo),
  ]);

  const dateStr = today.toLocaleDateString('he-IL',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  let r = `# דוח יומי ICING — ${dateStr}\n\n`;

  r += `## לידים חדשים היום (${nl.data?.length??0})\n`;
  nl.data?.forEach(l=>{ r+=`- **${l.name}** | ${l.lead_type??'לא מסווג'} | ${l.source}\n`; });
  if (!nl.data?.length) r+=`_אין לידים חדשים_\n`;

  r += `\n## ממתינים לאישורך (${pl.data?.length??0})\n`;
  pl.data?.forEach(l=>{
    const e=l.heat==='hot'?'🔥':l.heat==='medium'?'🌤️':'❄️';
    r+=`- ${e} **${l.name}** | ציון: ${l.score} | ${l.lead_type}\n`;
    r+=`  > ${(l.draft_message??'').slice(0,80)}...\n`;
    r+=`  > \`/project:approve-send ${l.id}\`\n\n`;
  });

  r += `\n## follow-up להיום (${fu.data?.length??0})\n`;
  fu.data?.forEach(l=>{ r+=`- **${l.name}** | \`/project:draft-followup ${l.id}\`\n`; });

  r += `\n## ללא מענה 72+ שעות (${st.data?.length??0})\n`;
  st.data?.forEach(l=>{ r+=`- ⚠️ **${l.name}**\n`; });

  r += `\n## המרות השבוע (${bk.data?.length??0})\n`;
  bk.data?.forEach(l=>{ r+=`- ✅ **${l.name}** | ${l.lead_type}\n`; });

  await supabase.from('daily_reports').upsert({
    report_date: today.toISOString().split('T')[0],
    new_leads: nl.data?.length??0, pending_count: pl.data?.length??0,
    booked_count: bk.data?.length??0, summary: r,
  });
  return r;
}

if (require.main===module) generateDailyDigest().then(console.log).catch(console.error);
