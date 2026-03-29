import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY ?? 'lior2026';
  return key === valid;
}

function getWeekBounds(dateStr: string): { monday: string; sunday: string } {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun...6=Sat
  // Week: Sunday to Saturday (Israel convention)
  const sun = new Date(d);
  sun.setDate(d.getDate() - day);
  const sat = new Date(sun);
  sat.setDate(sun.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  return { monday: fmt(sun), sunday: fmt(sat) };
}

// GET /api/admin/schedule-week?key=...&date=YYYY-MM-DD
// Returns all immersion slots for the week containing `date`, with instructor names
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
  const { monday: weekStart, sunday: weekEnd } = getWeekBounds(dateParam);

  const supabase = createAdminClient();

  const { data: slots } = await supabase
    .from('immersion_slots')
    .select('id, slot_date, slot_time, max_participants, instructor_id, instructor:instructors(name)')
    .gte('slot_date', weekStart)
    .lte('slot_date', weekEnd)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  const result = (slots ?? []).map((s: any) => ({
    id: s.id,
    date: s.slot_date,
    time: (s.slot_time as string).slice(0, 5),
    instructor_id: s.instructor_id,
    instructor_name: s.instructor?.name ?? null,
    max_participants: s.max_participants,
  }));

  return NextResponse.json(
    { weekStart, weekEnd, slots: result },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
