import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const PACKAGE_SESSIONS: Record<string, number> = {
  single: 1,
  '5pack': 5,
  '10pack': 10,
  monthly: 30,
};

export async function GET(req: NextRequest) {
  const vid = req.nextUrl.searchParams.get('vid');
  if (!vid) return NextResponse.json({ error: 'חסר vid' }, { status: 400 });

  const supabase = createAdminClient();

  // Get visitor phone
  const { data: visitor } = await supabase
    .from('visitor_profiles')
    .select('phone')
    .eq('id', vid)
    .single();

  if (!visitor) return NextResponse.json({ error: 'מבקר לא נמצא' }, { status: 404 });

  const today = new Date().toISOString().split('T')[0];

  // Next upcoming session (from immersion_sessions logged by instructor)
  const { data: upcoming } = await supabase
    .from('immersion_sessions')
    .select('session_date, session_time')
    .eq('visitor_id', vid)
    .gte('session_date', today)
    .order('session_date', { ascending: true })
    .order('session_time', { ascending: true })
    .limit(1);

  // Count past sessions used
  const { count: usedCount } = await supabase
    .from('immersion_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('visitor_id', vid)
    .lt('session_date', today);

  // Most recent package from immersion_bookings (match by phone)
  let packageType: string | null = null;
  let packageTotal = 0;
  if (visitor.phone) {
    const { data: latestBooking } = await supabase
      .from('immersion_bookings')
      .select('package_type, created_at')
      .eq('visitor_phone', visitor.phone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestBooking) {
      packageType = latestBooking.package_type;
      packageTotal = PACKAGE_SESSIONS[latestBooking.package_type] ?? 0;
    }
  }

  const sessionsUsed = usedCount ?? 0;
  const remaining = packageTotal > 0 ? Math.max(0, packageTotal - sessionsUsed) : null;

  const nextSession = upcoming?.[0] ?? null;

  return NextResponse.json({
    next_date: nextSession?.session_date ?? null,
    next_time: nextSession?.session_time ?? null,
    package_type: packageType,
    sessions_used: sessionsUsed,
    sessions_total: packageTotal,
    sessions_remaining: remaining,
  });
}
