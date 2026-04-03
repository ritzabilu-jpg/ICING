import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { resolveInstructor } from '@/lib/instructor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) return NextResponse.json({ error: 'הפרופיל שלך לא מקושר למדריך. פנה לאדמין.' }, { status: 403 });

  const instructor = { id: inst.instructorId, name: inst.instructorName, slug: inst.instructorSlug };

  const supabase = createAdminClient();

  // Fetch immersion slots for this instructor
  const { data: slots } = await supabase
    .from('immersion_slots')
    .select('*')
    .eq('instructor_id', instructor.id)
    .order('slot_date', { ascending: false })
    .order('slot_time', { ascending: true });

  // Fetch workshops for this instructor
  const { data: workshops } = await supabase
    .from('workshops')
    .select('*')
    .eq('instructor_id', instructor.id)
    .order('date_time', { ascending: false });

  // Count immersion bookings per slot
  const { data: slotBookings } = await supabase.from('immersion_bookings').select('slot_id');
  const slotCount: Record<string, number> = {};
  slotBookings?.forEach(b => { slotCount[b.slot_id] = (slotCount[b.slot_id] || 0) + 1; });

  const slotItems = (slots || []).map(s => ({
    id: s.id,
    kind: 'slot' as const,
    date: s.slot_date,
    time: s.slot_time?.slice(0, 5),
    location: s.location || '',
    notes: s.notes || '',
    max_participants: s.max_participants,
    participant_count: slotCount[s.id] || 0,
    status: 'confirmed' as const,
    instructor_role: 'immersion_guide' as const,
  }));

  const workshopItems = (workshops || []).map(w => {
    const dt = new Date(w.date_time);
    return {
      id: w.id,
      kind: 'workshop' as const,
      date: dt.toISOString().split('T')[0],
      time: dt.toTimeString().slice(0, 5),
      location: '',
      notes: w.description || '',
      title: w.title,
      max_participants: w.capacity,
      participant_count: w.seats_taken || 0,
      status: (w.status || 'confirmed') as 'confirmed' | 'pending' | 'cancelled',
      instructor_role: 'workshop_facilitator' as const,
    };
  });

  const all = [...slotItems, ...workshopItems].sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ sessions: all, instructor }, { headers: { 'Cache-Control': 'no-store' } });
}
