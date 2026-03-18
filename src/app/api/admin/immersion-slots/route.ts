// admin/immersion-slots – manage immersion time slots (add range / delete)
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY || process.env.INSTRUCTOR_CODE || 'lior2026';
  return key === valid;
}

// GET – all slots with booking counts (admin view, includes past)
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: slots } = await supabase
    .from('immersion_slots')
    .select('id, slot_date, slot_time, max_participants, notes, created_at')
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  const { data: bookings } = await supabase
    .from('immersion_bookings')
    .select('slot_id, visitor_name, visitor_phone, package_type, created_at');

  const counts: Record<string, number> = {};
  for (const b of (bookings ?? [])) counts[b.slot_id] = (counts[b.slot_id] ?? 0) + 1;

  const enriched = (slots ?? []).map(s => ({
    ...s,
    booked: counts[s.id] ?? 0,
    bookings: (bookings ?? []).filter(b => b.slot_id === s.id),
  }));

  return NextResponse.json({ slots: enriched });
}

// POST – bulk-create slots from a date/time range (10-minute intervals)
// Body: { from_date, to_date, from_time, to_time, max_participants, notes }
export async function POST(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const body = await req.json() as {
    from_date?: string; to_date?: string;
    from_time?: string; to_time?: string;
    max_participants?: number; notes?: string;
  };

  const { from_date, to_date, from_time, to_time, notes } = body;
  const max = body.max_participants ?? 10;

  if (!from_date || !to_date || !from_time || !to_time) {
    return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 });
  }

  // Build list of all slots to insert
  const toInsert: { slot_date: string; slot_time: string; max_participants: number; notes: string }[] = [];

  const [fh, fm] = from_time.split(':').map(Number);
  const [th, tm] = to_time.split(':').map(Number);
  const fromMin = fh * 60 + fm;
  const toMin   = th * 60 + tm;

  if (toMin < fromMin) return NextResponse.json({ error: 'שעת סיום חייבת להיות אחרי שעת התחלה' }, { status: 400 });

  // Iterate over each day in the range
  const cursor = new Date(from_date + 'T00:00:00');
  const endDate = new Date(to_date + 'T00:00:00');

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split('T')[0];

    for (let m = fromMin; m <= toMin; m += 10) {
      const h   = Math.floor(m / 60).toString().padStart(2, '0');
      const min = (m % 60).toString().padStart(2, '0');
      toInsert.push({
        slot_date: dateStr,
        slot_time: `${h}:${min}`,
        max_participants: max,
        notes: notes ?? '',
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  if (toInsert.length === 0) return NextResponse.json({ error: 'לא נוצרו מועדים' }, { status: 400 });
  if (toInsert.length > 500) return NextResponse.json({ error: 'טווח גדול מדי (מקסימום 500 מועדים)' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('immersion_slots').insert(toInsert);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, count: toInsert.length });
}

// DELETE – remove a slot
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const id  = searchParams.get('id');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('immersion_slots').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
