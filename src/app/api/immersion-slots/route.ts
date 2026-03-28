// immersion-slots – returns available immersion time slots with booking counts
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Get all slots (future + today) with booking counts
    const today = new Date().toISOString().split('T')[0];
    const { data: slots, error } = await supabase
      .from('immersion_slots')
      .select('id, slot_date, slot_time, max_participants, notes')
      .limit(5);

    if (error) return NextResponse.json({ slots: [], _error: error.message }, { headers: { 'Cache-Control': 'no-store' } });

    // Count bookings per slot
    const { data: bookingCounts } = await supabase
      .from('immersion_bookings')
      .select('slot_id');

    const counts: Record<string, number> = {};
    for (const b of (bookingCounts ?? [])) {
      counts[b.slot_id] = (counts[b.slot_id] ?? 0) + 1;
    }

    const enriched = (slots ?? []).map(s => ({
      ...s,
      booked: counts[s.id] ?? 0,
      available: (counts[s.id] ?? 0) < s.max_participants,
    }));

    const _url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').slice(8, 32);
    return NextResponse.json({ slots: enriched, _today: today, _count: enriched.length, _url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ slots: [], _catch: String(e) }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
