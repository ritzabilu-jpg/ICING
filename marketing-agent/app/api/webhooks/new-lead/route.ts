import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; email?: string; message?: string; source?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }); }

  const { name, phone, email, message, source = 'other' } = body;
  if (!name || !message) {
    return NextResponse.json({ error: 'name and message are required' }, { status: 422 });
  }

  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .insert({ name, phone, email, message, source, status: 'new' })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: lead.id,
    type: 'lead_received',
    description: `ליד חדש התקבל מ-${source}`,
    performed_by: 'system',
  });

  return NextResponse.json({ success: true, lead_id: lead.id });
}
