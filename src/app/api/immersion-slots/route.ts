// immersion-slots – returns available immersion time slots with booking counts
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    const today = new Date().toISOString().split('T')[0];
    const { data: slots, error } = await supabase
      .from('immersion_slots')
      .select('id, slot_date, slot_time, max_participants, notes')
      .gte('slot_date', today)
      .order('slot_date', { ascending: true })
      .order('slot_time', { ascending: true });

    if (error) return NextResponse.json({ slots: [] }, { headers: { 'Cache-Control': 'no-store' } });

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

    return NextResponse.json({ slots: enriched }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ slots: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
