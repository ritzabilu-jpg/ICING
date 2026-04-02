// immersion-slots – returns available immersion time slots with booking counts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const today = new Date().toISOString().split('T')[0];
    const { data: slots, error } = await supabase
      .from('immersion_slots')
      .select('id, slot_date, slot_time, max_participants, notes')
      .gte('slot_date', today)
      .order('slot_date', { ascending: true })
      .order('slot_time', { ascending: true });

    if (error) {
      console.error('immersion-slots GET error:', error.message);
      return NextResponse.json({ slots: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

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
      available: s.max_participants - (counts[s.id] ?? 0),
    }));

    // One slot per date+time — prefer the first available, else first slot
    const byTime = new Map<string, typeof enriched[0]>();
    for (const s of enriched) {
      const key = `${s.slot_date}|${s.slot_time}`;
      const existing = byTime.get(key);
      if (!existing || (s.available > 0 && existing.available <= 0)) {
        byTime.set(key, s);
      }
    }
    const deduped = Array.from(byTime.values());

    return NextResponse.json({ slots: deduped }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('immersion-slots unexpected error:', e);
    return NextResponse.json({ slots: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
