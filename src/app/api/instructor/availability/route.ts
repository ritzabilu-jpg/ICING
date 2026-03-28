import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { resolveInstructor } from '@/lib/instructor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) {
    return NextResponse.json({ error: 'פרופיל מדריך לא נמצא — ודא שהאימייל מוגדר ב-instructors.email_contact' }, { status: 403 });
  }

  const supabase = createAdminClient();
  const [slotsRes, blockedRes] = await Promise.all([
    supabase.from('instructor_availability').select('*').eq('instructor_id', inst.instructorId),
    supabase.from('instructor_blocked_dates').select('*').eq('instructor_id', inst.instructorId).order('from_date'),
  ]);
  return NextResponse.json({ slots: slotsRes.data ?? [], blocked: blockedRes.data ?? [], instructor_id: inst.instructorId });
}

export async function PUT(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) {
    return NextResponse.json({ error: `פרופיל מדריך לא נמצא — ודא שהאימייל מוגדר ב-instructors.email_contact` }, { status: 403 });
  }

  const { slots } = await req.json() as {
    slots: { type: string; day_of_week: number; slot_index: number; from_time: string | null; to_time: string | null }[]
  };

  const supabase = createAdminClient();
  const rows = slots
    .filter(s => s.from_time || s.to_time)
    .map(s => ({
      instructor_id: inst.instructorId,
      type: s.type,
      day_of_week: s.day_of_week,
      slot_index: s.slot_index,
      from_time: s.from_time || null,
      to_time: s.to_time || null,
      updated_at: new Date().toISOString(),
    }));

  await supabase.from('instructor_availability').delete().eq('instructor_id', inst.instructorId);
  if (rows.length > 0) {
    const { error } = await supabase.from('instructor_availability').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, saved: rows.length, instructor_id: inst.instructorId });
}

export async function DELETE(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) return NextResponse.json({ error: 'פרופיל מדריך לא נמצא' }, { status: 403 });

  const day = new URL(req.url).searchParams.get('day');
  const supabase = createAdminClient();
  let query = supabase.from('instructor_availability').delete().eq('instructor_id', inst.instructorId);
  if (day !== null) query = (query as any).eq('day_of_week', parseInt(day));
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
