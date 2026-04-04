import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const { draft_message } = await req.json();
  if (!draft_message) return NextResponse.json({ error: 'draft_message required' }, { status: 422 });

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ draft_message })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: id,
    type: 'draft_edited',
    description: 'טקסט הודעה עודכן ידנית',
    performed_by: 'lior',
  });

  return NextResponse.json({ success: true });
}
