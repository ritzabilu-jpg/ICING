import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { resolveInstructor } from '@/lib/instructor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ bookings: [] }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) return NextResponse.json({ bookings: [] }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      user_name,
      email,
      phone,
      participants,
      status,
      payment_method,
      payment_status,
      confirmation_code,
      created_at,
      callback_window,
      workshop_id,
      workshops (
        id,
        title,
        date_time,
        instructor_id,
        instructors ( id, name )
      )
    `)
    .neq('email', 'pending@checkout.tmp')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ bookings: [] });

  // Return only bookings for this instructor's workshops
  const filtered = (data ?? []).filter((b: Record<string, unknown>) => {
    const w = b.workshops as Record<string, unknown> | null;
    return w && w.instructor_id === inst.instructorId;
  });

  return NextResponse.json({ bookings: filtered });
}
