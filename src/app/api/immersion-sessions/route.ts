import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET – sessions for a visitor
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const visitorId = searchParams.get('visitor_id');
  const all = searchParams.get('all');
  const requesterId = req.headers.get('x-visitor-id');
  if (!requesterId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from('visitor_profiles').select('role').eq('id', requesterId).single();

  if (!me) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });

  const isStaff = ['instructor', 'admin'].includes(me.role);

  if (all === 'true' || all === '1') {
    if (!isStaff) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
    const { data, error } = await supabase
      .from('immersion_sessions')
      .select('*')
      .order('session_date', { ascending: false })
      .order('session_time', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  const targetVisitorId = visitorId || requesterId;
  if (targetVisitorId !== requesterId && !isStaff) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('immersion_sessions')
    .select('*')
    .eq('visitor_id', targetVisitorId)
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
    .insert({ visitor_id, session_date, session_time, temperature_celsius, duration_minutes, instructor_name: instructor_name || '', instructor_notes: body.instructor_notes || '', visitor_notes: body.visitor_notes || '', photo_url: body.photo_url || null, status: body.status || 'planned', logged_by: requesterId })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH – update existing immersion session (instructor/admin only)
export async function PATCH(req: NextRequest) {
  const requesterId = req.headers.get('x-visitor-id');
  if (!requesterId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from('visitor_profiles').select('role').eq('id', requesterId).single();
  if (!me || !['instructor', 'admin'].includes(me.role)) {
    return NextResponse.json({ error: 'רק מדריכים ומנהלים יכולים לערוך נתונים' }, { status: 403 });
  }

  const body = await req.json();
  const { id, temperature_celsius, duration_minutes, instructor_notes, visitor_notes, photo_url, status } = body;
  if (!id) return NextResponse.json({ error: 'חסר מזהה ישיבה' }, { status: 400 });

  const updatePayload: Record<string, unknown> = {};
  if (temperature_celsius !== undefined) updatePayload.temperature_celsius = temperature_celsius;
  if (duration_minutes !== undefined) updatePayload.duration_minutes = duration_minutes;
  if (instructor_notes !== undefined) updatePayload.instructor_notes = instructor_notes;
  if (visitor_notes !== undefined) updatePayload.visitor_notes = visitor_notes;
  if (photo_url !== undefined) updatePayload.photo_url = photo_url;
  if (status !== undefined) updatePayload.status = status;
  updatePayload.logged_by = requesterId;
  updatePayload.logged_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('immersion_sessions')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

