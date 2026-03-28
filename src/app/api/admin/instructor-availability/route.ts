import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  return key === (process.env.ADMIN_KEY ?? 'lior2026') || key === (process.env.ADMIN_CODE ?? '');
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = new URL(req.url).searchParams.get('instructor_id');
  if (!instructorId) return NextResponse.json({ error: 'חסר instructor_id' }, { status: 400 });

  const supabase = createAdminClient();
  const [slotsRes, blockedRes] = await Promise.all([
    supabase.from('instructor_availability').select('*').eq('instructor_id', instructorId),
    supabase.from('instructor_blocked_dates').select('*').eq('instructor_id', instructorId).order('from_date'),
  ]);
  return NextResponse.json({ slots: slotsRes.data ?? [], blocked: blockedRes.data ?? [] });
}

export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = new URL(req.url).searchParams.get('instructor_id');
  if (!instructorId) return NextResponse.json({ error: 'חסר instructor_id' }, { status: 400 });

  const { slots } = await req.json() as {
    slots: { type: string; day_of_week: number; slot_index: number; from_time: string | null; to_time: string | null }[]
  };

  const supabase = createAdminClient();
  const rows = slots
    .filter(s => s.from_time || s.to_time)
    .map(s => ({
      instructor_id: instructorId,
      type: s.type,
      day_of_week: s.day_of_week,
      slot_index: s.slot_index,
      from_time: s.from_time || null,
      to_time: s.to_time || null,
      updated_at: new Date().toISOString(),
    }));

  await supabase.from('instructor_availability').delete().eq('instructor_id', instructorId);
  if (rows.length > 0) {
    const { error } = await supabase.from('instructor_availability').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, saved: rows.length });
}

export async function POST(req: NextRequest) {
  // Add blocked date for a specific instructor (admin only)
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = new URL(req.url).searchParams.get('instructor_id');
  if (!instructorId) return NextResponse.json({ error: 'חסר instructor_id' }, { status: 400 });

  const { from_date, to_date, reason } = await req.json();
  if (!from_date || !to_date) return NextResponse.json({ error: 'תאריכים חסרים' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_blocked_dates')
    .insert({ instructor_id: instructorId, from_date, to_date, reason: reason ?? '' })
    .select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const instructorId = searchParams.get('instructor_id');
  const day = searchParams.get('day'); // day_of_week to clear (optional)

  const supabase = createAdminClient();

  // Delete a blocked date by id
  if (id) {
    const { error } = await supabase.from('instructor_blocked_dates').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Clear availability for instructor (optionally filtered by day)
  if (instructorId) {
    let query = supabase.from('instructor_availability').delete({ count: 'exact' }).eq('instructor_id', instructorId);
    if (day !== null) query = query.eq('day_of_week', parseInt(day));
    const { error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, deleted: count ?? 0 });
  }

  return NextResponse.json({ error: 'חסר id או instructor_id' }, { status: 400 });
}
