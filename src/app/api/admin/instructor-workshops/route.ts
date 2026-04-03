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
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
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

export async function PUT(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json();
  const { id, instructor_name, workshop_date, workshop_time, max_participants, notes, status,
          immersion_guide_id, workshop_facilitator_id } = body;
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (instructor_name !== undefined) updates.instructor_name = instructor_name;
  if (workshop_date !== undefined) updates.workshop_date = workshop_date;
  if (workshop_time !== undefined) updates.workshop_time = workshop_time;
  if (max_participants !== undefined) updates.max_participants = Number(max_participants);
  if (notes !== undefined) updates.notes = notes;
  if (status !== undefined) updates.status = status;
  if (immersion_guide_id !== undefined) updates.immersion_guide_id = immersion_guide_id;
  if (workshop_facilitator_id !== undefined) updates.workshop_facilitator_id = workshop_facilitator_id;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_workshops')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const id        = req.nextUrl.searchParams.get('id');
  const from_date = req.nextUrl.searchParams.get('from_date');
  const to_date   = req.nextUrl.searchParams.get('to_date');
  const time      = req.nextUrl.searchParams.get('time');

  const supabase = createAdminClient();

  // Single delete
  if (id) {
    const { error } = await supabase.from('instructor_workshops').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Bulk delete by date range
  if (!from_date || !to_date) return NextResponse.json({ error: 'חסרים פרמטרים' }, { status: 400 });

  let q = supabase.from('instructor_workshops').delete({ count: 'exact' })
    .gte('workshop_date', from_date).lte('workshop_date', to_date);
  if (time) q = q.eq('workshop_time', time + ':00');

  const { count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, deleted: count ?? 0 });
}
