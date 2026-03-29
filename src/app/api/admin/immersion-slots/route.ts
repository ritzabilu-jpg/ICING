import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY ?? 'lior2026';
  return key === valid;
}

// GET – all slots with booking counts + instructor name
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: slots } = await supabase
    .from('immersion_slots')
    .select('id, slot_date, slot_time, max_participants, notes, created_at, instructor_id, instructor:instructors(name)')
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  const { data: bookings } = await supabase
    .from('immersion_bookings')
    .select('slot_id, visitor_name, visitor_phone, package_type, created_at');

  const counts: Record<string, number> = {};
  for (const b of (bookings ?? [])) counts[b.slot_id] = (counts[b.slot_id] ?? 0) + 1;

  const enriched = (slots ?? []).map((s: any) => ({
    ...s,
    instructor_name: s.instructor?.name ?? null,
    booked: counts[s.id] ?? 0,
    bookings: (bookings ?? []).filter(b => b.slot_id === s.id),
  }));

  return NextResponse.json({ slots: enriched }, { headers: { 'Cache-Control': 'no-store' } });
}

// POST – bulk-create slots, checks conflicts first
// Returns { status:'ok', count } or { status:'conflicts', conflicts:[], clean:[] }
export async function POST(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json() as {
    from_date?: string; to_date?: string;
    from_time?: string; to_time?: string;
    max_participants?: number; notes?: string;
    location?: string; instructor_id?: string;
  };

  const { from_date, to_date, from_time, to_time, notes, location, instructor_id } = body;
  const max = body.max_participants ?? 1;

  if (!from_date || !to_date || !from_time || !to_time) {
    return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 });
  }

  const [fh, fm] = from_time.split(':').map(Number);
  const [th, tm] = to_time.split(':').map(Number);
  const fromMin = fh * 60 + fm;
  const toMin   = th * 60 + tm;

  if (toMin < fromMin) return NextResponse.json({ error: 'שעת סיום חייבת להיות אחרי שעת התחלה' }, { status: 400 });

  // Build list of all slots to insert
  type SlotRow = { slot_date: string; slot_time: string; max_participants: number; notes: string; location?: string; instructor_id?: string };
  const toInsert: SlotRow[] = [];

  const cursor = new Date(from_date + 'T00:00:00');
  const endDate = new Date(to_date + 'T00:00:00');

  while (cursor <= endDate) {
    const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`;
    for (let m = fromMin; m <= toMin; m += 10) {
      const h   = Math.floor(m / 60).toString().padStart(2, '0');
      const min = (m % 60).toString().padStart(2, '0');
      const row: SlotRow = {
        slot_date: dateStr,
        slot_time: `${h}:${min}`,
        max_participants: max,
        notes: notes ?? '',
      };
      if (location) row.location = location;
      if (instructor_id) row.instructor_id = instructor_id;
      toInsert.push(row);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (toInsert.length === 0) return NextResponse.json({ error: 'לא נוצרו מועדים' }, { status: 400 });
  if (toInsert.length > 500) return NextResponse.json({ error: 'טווח גדול מדי (מקסימום 500 מועדים)' }, { status: 400 });

  const supabase = createAdminClient();

  // Check for conflicts: slots with same date+time already in DB
  const uniqueDates = [...new Set(toInsert.map(s => s.slot_date))];
  const uniqueTimes = [...new Set(toInsert.map(s => s.slot_time + ':00'))]; // HH:MM:SS for DB comparison

  const { data: existing } = await supabase
    .from('immersion_slots')
    .select('id, slot_date, slot_time, instructor_id, instructor:instructors(name)')
    .in('slot_date', uniqueDates)
    .in('slot_time', uniqueTimes);

  // Build lookup map: "date|HH:MM" → existing slot
  const existingMap = new Map<string, { id: string; instructor_id: string | null; instructor_name: string }>();
  for (const e of (existing ?? []) as any[]) {
    const timeShort = (e.slot_time as string).slice(0, 5);
    existingMap.set(`${e.slot_date}|${timeShort}`, {
      id: e.id,
      instructor_id: e.instructor_id,
      instructor_name: e.instructor?.name ?? 'ללא מדריך',
    });
  }

  // Look up new instructor name if provided
  let newInstructorName = 'ללא מדריך';
  if (instructor_id) {
    const { data: instr } = await supabase.from('instructors').select('name').eq('id', instructor_id).maybeSingle();
    if (instr) newInstructorName = (instr as any).name;
  }

  // Split into clean (no conflict) vs conflicts
  type ConflictItem = { date: string; time: string; existingId: string; existingInstructorId: string | null; existingInstructorName: string; newInstructorId: string | null; newInstructorName: string; newSlot: SlotRow };
  const conflicts: ConflictItem[] = [];
  const clean: SlotRow[] = [];

  for (const s of toInsert) {
    const mapKey = `${s.slot_date}|${s.slot_time}`;
    const ex = existingMap.get(mapKey);
    if (ex) {
      conflicts.push({
        date: s.slot_date,
        time: s.slot_time,
        existingId: ex.id,
        existingInstructorId: ex.instructor_id,
        existingInstructorName: ex.instructor_name,
        newInstructorId: instructor_id ?? null,
        newInstructorName,
        newSlot: s,
      });
    } else {
      clean.push(s);
    }
  }

  // If conflicts found → return without saving
  if (conflicts.length > 0) {
    return NextResponse.json({ status: 'conflicts', conflicts, clean, newInstructorName });
  }

  // No conflicts → insert all
  const { error } = await supabase.from('immersion_slots').insert(toInsert as any[]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ status: 'ok', success: true, count: toInsert.length });
}

// PATCH – resolve conflicts: keep or replace each conflicting slot, insert clean slots
export async function PATCH(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json() as {
    resolved: { existingId: string; keepExisting: boolean; newSlot?: Record<string, unknown> }[];
    clean: Record<string, unknown>[];
  };

  const supabase = createAdminClient();
  let count = 0;

  // Process resolved conflicts
  for (const r of (body.resolved ?? [])) {
    if (!r.keepExisting && r.newSlot) {
      await supabase.from('immersion_slots').delete().eq('id', r.existingId);
      await supabase.from('immersion_slots').insert([r.newSlot]);
    }
    count++;
  }

  // Insert clean slots
  if ((body.clean ?? []).length > 0) {
    const { error } = await supabase.from('immersion_slots').insert(body.clean);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    count += body.clean.length;
  }

  return NextResponse.json({ success: true, count });
}

// DELETE – remove single slot (id=) OR bulk by date/time range (from_date=&to_date=&time=)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const id        = searchParams.get('id');
  const from_date = searchParams.get('from_date');
  const to_date   = searchParams.get('to_date');
  const time      = searchParams.get('time');

  const supabase = createAdminClient();

  if (id) {
    const { error } = await supabase.from('immersion_slots').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (!from_date || !to_date) return NextResponse.json({ error: 'חסרים פרמטרים' }, { status: 400 });

  let q = supabase.from('immersion_slots').delete({ count: 'exact' })
    .gte('slot_date', from_date).lte('slot_date', to_date);
  if (time) q = q.eq('slot_time', time + ':00');

  const { count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, deleted: count ?? 0 });
}
