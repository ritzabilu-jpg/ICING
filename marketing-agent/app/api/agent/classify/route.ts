import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase';
import { classifyLead, type LeadInput } from '@/scripts/classify_lead';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function checkAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace('Bearer ', '');
  return token === process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { lead_id } = await req.json();
  if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 422 });

  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', lead_id)
    .single();

  if (error || !lead) return NextResponse.json({ error: 'lead not found' }, { status: 404 });

  const input: LeadInput = {
    id: lead.id,
    name: lead.name,
    message: lead.message ?? '',
    phone: lead.phone,
    email: lead.email,
    source: lead.source ?? 'other',
    created_at: lead.created_at,
  };

  const classification = classifyLead(input);

  // Claude API — ניסוח draft message
  let draft_message = classification.draft_message;
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: `אתה עוזר שיווקי של ICING — עסק לטבילות וסדנאות מי קרח בישראל.
כתוב הודעת מענה ראשונית בעברית לפנייה הבאה. חוקים:
- 4-6 שורות בלבד
- פתח בשם הפרטי עם 'היי [שם],'
- שאלה אחת ברורה בסיום
- חתום 'ליאור'
- אסור: ביטויים רפואיים, הבטחות, urgency מלאכותית
- אם lead_type=medical_question: כתוב רק 'תודה שפנית — אחזור אליך ישירות בקרוב. ליאור'`,
      messages: [{
        role: 'user',
        content: `שם: ${lead.name} | סוג: ${classification.lead_type} | ציון: ${classification.score} | פנייה: ${lead.message}`,
      }],
    });
    const block = response.content[0];
    if (block.type === 'text') draft_message = block.text;
  } catch (e) {
    console.error('Claude API error:', e);
  }

  const next_follow_up = new Date(
    Date.now() + classification.follow_up_hours * 60 * 60 * 1000
  ).toISOString();

  await supabaseAdmin.from('leads').update({
    lead_type: classification.lead_type,
    score: classification.score,
    score_breakdown: classification.score_breakdown,
    heat: classification.heat,
    require_human_review: classification.require_human_review,
    draft_message,
    next_follow_up,
    agent_notes: classification.agent_notes,
    status: 'pending_approval',
  }).eq('id', lead_id);

  await supabaseAdmin.from('lead_activities').insert({
    lead_id,
    type: 'agent_classification',
    description: classification.summary,
    payload: { score: classification.score, heat: classification.heat, lead_type: classification.lead_type },
    performed_by: 'agent',
  });

  return NextResponse.json({ success: true, classification, draft_message });
}
