import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY ?? 'lior2026';
  return key === valid;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_workshops')
    .select('*')
    .order('workshop_date', { ascending: true })
    .order('workshop_time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json();
  const { workshop_date, workshop_time, instructor_name, notes, max_participants } = body;

  if (!workshop_date || !workshop_time || !instructor_name) {
    return NextResponse.json({ error: 'חסרים שדות חובה' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_workshops')
    .insert({ workshop_date, workshop_time, instructor_name, notes: notes || null, max_participants: max_participants || 10, status: 'pending' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('instructor_workshops').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
