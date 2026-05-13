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

  // Fetch workshops for this instructor from instructor_workshops table
  const { data: workshops } = await supabase
    .from('instructor_workshops')
    .select('*')
    .eq('instructor_name', instructor.name)
    .order('workshop_date', { ascending: false })
    .order('workshop_time', { ascending: true });

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
    return {
      id: w.id,
      kind: 'workshop' as const,
      date: w.workshop_date,
      time: w.workshop_time?.slice(0, 5),
      location: '',
      notes: w.notes || '',
      title: `סדנה ${w.workshop_date}`,
      max_participants: w.max_participants || 10,
      participant_count: 0,
      status: (w.status || 'pending') as 'confirmed' | 'pending' | 'cancelled',
      instructor_role: 'workshop_facilitator' as const,
    };
  });

  const all = [...slotItems, ...workshopItems].sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ sessions: all, instructor }, { headers: { 'Cache-Control': 'no-store' } });
}
