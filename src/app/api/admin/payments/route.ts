import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const instructorId = req.nextUrl.searchParams.get('instructorId');

  // Fetch bookings with workshop join for instructor info
  let query = supabase
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

  if (instructorId) {
    // Only bookings for workshops by this instructor
    query = query.eq('workshops.instructor_id', instructorId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ bookings: [] });

  // Filter out rows where workshop doesn't match instructor (Supabase doesn't filter inner joins automatically)
  const filtered = instructorId
    ? (data ?? []).filter((b: Record<string, unknown>) => {
        const w = b.workshops as Record<string, unknown> | null;
        return w && w.instructor_id === instructorId;
      })
    : (data ?? []);

  return NextResponse.json({ bookings: filtered });
}
