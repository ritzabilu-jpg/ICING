import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET – sessions for a visitor
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const visitorId = searchParams.get('visitor_id') || req.headers.get('x-visitor-id');
  const requesterId = req.headers.get('x-visitor-id');
  if (!visitorId || !requesterId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();

  // Allow user to read own sessions, or instructor/admin to read any
  if (visitorId !== requesterId) {
    const { data: me } = await supabase
      .from('visitor_profiles').select('role').eq('id', requesterId).single();
    if (!me || !['instructor', 'admin'].includes(me.role)) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from('immersion_sessions')
    .select('*')
    .eq('visitor_id', visitorId)
    .order('session_date', { ascending: false })
    .order('session_time', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST – add session (instructor/admin only)
export async function POST(req: NextRequest) {
  const requesterId = req.headers.get('x-visitor-id');
  if (!requesterId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from('visitor_profiles').select('role').eq('id', requesterId).single();
  if (!me || !['instructor', 'admin'].includes(me.role)) {
    return NextResponse.json({ error: 'רק מדריכים ומנהלים יכולים להוסיף כניסות' }, { status: 403 });
  }

  const body = await req.json();
  const { visitor_id, session_date, session_time, temperature_celsius, duration_minutes, instructor_name, notes } = body;

  if (!visitor_id || !session_date || !session_time || !duration_minutes) {
    return NextResponse.json({ error: 'שדות חסרים' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('immersion_sessions')
    .insert({ visitor_id, session_date, session_time, temperature_celsius, duration_minutes, instructor_name: instructor_name || '', notes: notes || '' })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
