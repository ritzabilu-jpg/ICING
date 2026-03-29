import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY ?? 'lior2026';
  return key === valid;
}

function getWeekBounds(dateStr: string): { weekStart: string; weekEnd: string } {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun...6=Sat
  const sun = new Date(d);
  sun.setDate(d.getDate() - day);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  return { weekStart: fmt(sun), weekEnd: fmt(sat) };
}

// GET /api/admin/schedule-week?key=...&date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
  const { weekStart, weekEnd } = getWeekBounds(dateParam);

  const supabase = createAdminClient();

  const [slotsRes, availRes, instrRes] = await Promise.all([
    supabase
      .from('immersion_slots')
      .select('id, slot_date, slot_time, max_participants, instructor_id, instructor:instructors(name)')
      .gte('slot_date', weekStart)
      .lte('slot_date', weekEnd)
      .order('slot_date', { ascending: true })
      .order('slot_time', { ascending: true }),
    supabase
      .from('instructor_availability')
      .select('instructor_id, day_of_week, from_time, to_time, type'),
    supabase
      .from('instructors')
      .select('id, name'),
  ]);

  const availability = (availRes.data ?? []).filter((a: any) => a.type === 'immersion');
  const instructors  = instrRes.data ?? [];

  const result = (slotsRes.data ?? []).map((s: any) => {
    const slotDate  = new Date(s.slot_date + 'T00:00:00');
    const dayOfWeek = slotDate.getDay();
    const slotTime  = (s.slot_time as string).slice(0, 5);

    const availableInstructors = availability
      .filter((a: any) => {
        if (a.day_of_week !== dayOfWeek) return false;
        const from = (a.from_time as string).slice(0, 5);
        const to   = (a.to_time   as string).slice(0, 5);
        return from <= slotTime && slotTime <= to;
      })
      .map((a: any) => ({
        id:   a.instructor_id,
        name: (instructors as any[]).find(i => i.id === a.instructor_id)?.name ?? '?',
      }));

    return {
      id:                    s.id,
      date:                  s.slot_date,
      time:                  slotTime,
      instructor_id:         s.instructor_id,
      instructor_name:       s.instructor?.name ?? null,
      max_participants:      s.max_participants,
      available_instructors: availableInstructors,
    };
  });

  return NextResponse.json(
    { weekStart, weekEnd, slots: result },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

// PATCH /api/admin/schedule-week — update instructor_id for a slot
export async function PATCH(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { slot_id, instructor_id } = await req.json() as { slot_id: string; instructor_id: string | null };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('immersion_slots')
    .update({ instructor_id })
    .eq('id', slot_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
