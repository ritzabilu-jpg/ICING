import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getInstructorId(visitorId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('visitor_profiles')
    .select('email, role')
    .eq('id', visitorId)
    .maybeSingle();
  if (!profile || !['instructor', 'admin'].includes(profile.role)) return null;
  const { data: inst } = await supabase
    .from('instructors')
    .select('id')
    .eq('email_contact', profile.email)
    .maybeSingle();
  return inst?.id ?? null;
}

export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = await getInstructorId(visitorId);
  if (!instructorId) return NextResponse.json({ error: 'פרופיל מדריך לא נמצא' }, { status: 403 });

  const supabase = createAdminClient();
  const [slotsRes, blockedRes] = await Promise.all([
    supabase.from('instructor_availability').select('*').eq('instructor_id', instructorId),
    supabase.from('instructor_blocked_dates').select('*').eq('instructor_id', instructorId).order('from_date'),
  ]);
  return NextResponse.json({ slots: slotsRes.data ?? [], blocked: blockedRes.data ?? [] });
}

export async function PUT(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = await getInstructorId(visitorId);
  if (!instructorId) return NextResponse.json({ error: 'פרופיל מדריך לא נמצא' }, { status: 403 });

  const { slots } = await req.json() as {
    slots: { type: string; day_of_week: number; slot_index: number; from_time: string | null; to_time: string | null }[]
  };

  const supabase = createAdminClient();
  // Delete existing and re-insert (upsert by unique key)
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

  // Delete all then insert non-empty
  await supabase.from('instructor_availability').delete().eq('instructor_id', instructorId);
  if (rows.length > 0) {
    const { error } = await supabase.from('instructor_availability').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, saved: rows.length });
}
