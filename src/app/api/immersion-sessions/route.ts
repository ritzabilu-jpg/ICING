import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabaseClient } from '@/lib/supabase';

// GET /api/immersion-sessions?userId=xxx&range=week|month|year
// Returns sessions for a user. Caller must be the user themselves, or an admin.
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // Verify caller identity via Authorization header (Supabase JWT)
  const authHeader = req.headers.get('Authorization');
  let callerId: string | null = null;
  let callerRole: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data } = await supabaseClient.auth.getUser(token);
    if (data.user) {
      callerId = data.user.id;
      // Get role from profiles table
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from('profiles')
        .select('role')
        .eq('id', callerId)
        .single();
      callerRole = profile?.role ?? 'user';
    }
  }

  // Allow only: self or instructor/admin
  const isAllowed =
    callerId === userId ||
    callerRole === 'instructor' ||
    callerRole === 'admin';

  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('immersion_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .order('session_time', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}

// POST /api/immersion-sessions
// Body: { userId, sessionDate, sessionTime, instructorName, temperatureCelsius, durationMinutes, notes }
// Caller must be instructor or admin.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const { data: userData } = await supabaseClient.auth.getUser(token);
  if (!userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (!profile || !['instructor', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json() as {
    userId: string;
    sessionDate: string;
    sessionTime?: string;
    instructorName?: string;
    temperatureCelsius?: number;
    durationMinutes: number;
    notes?: string;
  };

  const { error } = await admin.from('immersion_sessions').insert({
    user_id: body.userId,
    session_date: body.sessionDate,
    session_time: body.sessionTime ?? null,
    instructor_name: body.instructorName ?? '',
    temperature_celsius: body.temperatureCelsius ?? null,
    duration_minutes: body.durationMinutes,
    notes: body.notes ?? '',
    recorded_by: userData.user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If there's an active subscription, increment sessions_used
  const { data: sub } = await admin
    .from('subscriptions')
    .select('id, sessions_used, sessions_total')
    .eq('user_id', body.userId)
    .or('valid_until.is.null,valid_until.gte.' + new Date().toISOString().slice(0, 10))
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (sub && sub.sessions_used < sub.sessions_total) {
    await admin
      .from('subscriptions')
      .update({ sessions_used: sub.sessions_used + 1 })
      .eq('id', sub.id);
  }

  return NextResponse.json({ success: true });
}
