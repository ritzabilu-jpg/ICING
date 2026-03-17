// admin/immersion-slots – manage immersion time slots (add / delete)
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY || process.env.INSTRUCTOR_CODE || 'admin123';
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

// POST – add a new slot
export async function POST(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { slot_date, slot_time, max_participants, notes } = await req.json() as {
    slot_date?: string; slot_time?: string; max_participants?: number; notes?: string;
  };

  if (!slot_date || !slot_time) {
    return NextResponse.json({ error: 'תאריך ושעה נדרשים' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('immersion_slots')
    .insert({ slot_date, slot_time, max_participants: max_participants ?? 10, notes: notes ?? '' })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
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
