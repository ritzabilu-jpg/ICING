/**
 * send_approved.ts — שולח הודעות מאושרות
 * ⚠️ שולח בפועל. הרצה: npm run agent:send
 */
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function sendWhatsApp(phone: string, msg: string) {
  const { WHATSAPP_TOKEN: t, WHATSAPP_PHONE_ID: pid } = process.env;
  if (!t || !pid) { console.log(`[DRY RUN] → ${phone}:\n${msg}`); return; }
  const res = await fetch(`https://graph.facebook.com/v18.0/${pid}/messages`,{
    method:'POST', headers:{'Authorization':`Bearer ${t}`,'Content-Type':'application/json'},
    body: JSON.stringify({messaging_product:'whatsapp',to:phone.replace(/\D/g,''),type:'text',text:{body:msg}}),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function sendApprovedMessages() {
  const {data,error} = await supabase.from('leads').select('*').eq('status','approved').eq('approved_by_human',true);
  if (error) throw error;
  if (!data?.length) { console.log('אין הודעות מאושרות.'); return; }
  for (const lead of data) {
    if (!lead.phone||!lead.draft_message) { console.warn(`${lead.name} — חסר.`); continue; }
    await sendWhatsApp(lead.phone, lead.draft_message);
    await supabase.from('leads').update({status:'sent',last_sent_message:lead.draft_message,last_contacted_at:new Date().toISOString()}).eq('id',lead.id);
    await supabase.from('lead_activities').insert({lead_id:lead.id,type:'message_sent',description:`נשלח ל-${lead.name}`,payload:{channel:process.env.WHATSAPP_TOKEN?'whatsapp':'dry_run'},performed_by:'agent'});
    console.log(`✅ ${lead.name}`);
  }
}

if (require.main===module) sendApprovedMessages().catch(console.error);
