import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET  /api/journal?visitor_id=xxx          → entries for that visitor (from immersion_sessions)
// POST /api/journal                          → user adds own entry
// DELETE /api/journal?id=xxx&visitor_id=xxx  → user deletes own entry

export async function GET(req: NextRequest) {
  const visitorId = req.nextUrl.searchParams.get('visitor_id');
  if (!visitorId) return NextResponse.json({ entries: [] });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('immersion_sessions')
    .select('*')
    .eq('visitor_id', visitorId)
    .order('session_date', { ascending: false })
    .order('session_time', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    visitor_id: string;
    session_date: string;
    session_time: string;
    duration_minutes?: number | null;
    temperature_celsius?: number | null;
    notes?: string;
    instructor?: string;
  };

  if (!body.visitor_id || !body.session_date || !body.session_time) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('immersion_sessions')
    .insert({
      visitor_id: body.visitor_id,
      session_date: body.session_date,
      session_time: body.session_time,
      duration_minutes: body.duration_minutes ?? null,
      temperature_celsius: body.temperature_celsius ?? null,
      visitor_notes: body.notes ?? '',
      instructor_name: body.instructor ?? '',
      status: body.duration_minutes ? 'done' : 'planned',
      logged_by: body.visitor_id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const visitorId = req.nextUrl.searchParams.get('visitor_id');
  if (!id || !visitorId) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('immersion_sessions')
    .delete()
    .eq('id', id)
    .eq('visitor_id', visitorId); // safety: only own entries

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as {
    id: string;
    visitor_id: string;
    visitor_notes?: string;
    photo_url?: string;
  };
  if (!body.id || !body.visitor_id) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });

  const supabase = createAdminClient();
  const update: Record<string, unknown> = {};
  if (body.visitor_notes !== undefined) update.visitor_notes = body.visitor_notes;
  if (body.photo_url !== undefined) update.photo_url = body.photo_url;

  const { data, error } = await supabase
    .from('immersion_sessions')
    .update(update)
    .eq('id', body.id)
    .eq('visitor_id', body.visitor_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}
