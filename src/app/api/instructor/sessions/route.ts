import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getInstructor(visitorId: string) {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('visitor_profiles')
    .select('id, email, role')
    .eq('id', visitorId)
    .maybeSingle();
  if (!profile || !['instructor', 'admin'].includes(profile.role)) return null;

  // Link visitor login to instructor profile via email_contact
  const { data: instructor } = await supabase
    .from('instructors')
    .select('id, name, slug')
    .eq('email_contact', profile.email)
    .maybeSingle();

  return { profile, instructor };
}

export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const linked = await getInstructor(visitorId);
  if (!linked) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { instructor } = linked;
  if (!instructor) {
    return NextResponse.json({ error: 'הפרופיל שלך לא מקושר למדריך. פנה לאדמין.' }, { status: 403 });
  }

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
    };
  });

  const all = [...slotItems, ...workshopItems].sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ sessions: all, instructor });
}
