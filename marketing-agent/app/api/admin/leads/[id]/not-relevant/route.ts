import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ status: 'not_relevant' })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: id,
    type: 'marked_not_relevant',
    description: 'סומן כלא רלוונטי',
    performed_by: 'lior',
  });

  return NextResponse.json({ success: true });
}
