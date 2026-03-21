import { NextRequest, NextResponse } from 'next/server';
/**
/**
 * /api/journal
 * /api/journal
 * REST API for the ice bath journal module.
 * REST API for the ice bath journal module.
 * GET  – fetch all entries (optionally scoped to visitor_id header)
 * GET  – fetch all entries (optionally scoped to visitor_id header)
 * POST – create a new entry
 * POST – create a new entry
 * DELETE – remove an entry by ?id=
 * DELETE – remove an entry by ?id=
 *
 *
 * Uses Supabase (immersion_sessions table) via the service-role admin client.
 * Uses Supabase (immersion_sessions table) via the service-role admin client.
 * No auth required for demo mode; pass x-visitor-id header to scope per user.
 * No auth required for demo mode; pass x-visitor-id header to scope per user.
 */
 */


import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Demo seed data – inserted once if the table is empty for the demo visitor
const DEMO_VISITOR_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_SEEDS = [
  { session_date: '2026-03-08', session_time: '07:30', duration_minutes: 12, temperature_celsius: 10.5, instructor_name: 'demo', notes: 'First time – felt the cold shock strongly' },
  { session_date: '2026-03-10', session_time: '08:00', duration_minutes: 15, temperature_celsius: 9.8,  instructor_name: 'demo', notes: 'Much calmer entry – breathing helped' },
  { session_date: '2026-03-11', session_time: '07:45', duration_minutes: 18, temperature_celsius: 10.0, instructor_name: 'demo', notes: 'Felt energetic all morning after' },
  { session_date: '2026-03-13', session_time: '09:00', duration_minutes: 20, temperature_celsius: 9.2,  instructor_name: 'demo', notes: '' },
  { session_date: '2026-03-14', session_time: '07:30', duration_minutes: 14, temperature_celsius: 10.1, instructor_name: 'demo', notes: 'Slight dizziness at the end – stayed shorter' },
];

// GET – return all entries for the given visitor (or demo visitor)
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const visitorId = req.headers.get('x-visitor-id') || DEMO_VISITOR_ID;

  // Seed demo data once if this is the demo visitor and the table is empty
  if (visitorId === DEMO_VISITOR_ID) {
    const { count } = await supabase
      .from('immersion_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('visitor_id', DEMO_VISITOR_ID);

    if ((count ?? 0) === 0) {
      // Ensure demo visitor profile exists
      await supabase.from('visitor_profiles').upsert(
        { id: DEMO_VISITOR_ID, name: 'Demo User', phone: '0000000000', role: 'user' },
        { onConflict: 'id' }
      );
      // Insert demo sessions
      await supabase.from('immersion_sessions').insert(
        DEMO_SEEDS.map(s => ({ ...s, visitor_id: DEMO_VISITOR_ID }))
      );
    }
  }

  const { data, error } = await supabase
    .from('immersion_sessions')
    .select('id, session_date, session_time, duration_minutes, temperature_celsius, notes')
    .eq('visitor_id', visitorId)
    .order('session_date', { ascending: false })
    .order('session_time', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST – create a new entry
export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const visitorId = req.headers.get('x-visitor-id') || DEMO_VISITOR_ID;

  const { session_date, session_time, duration_minutes, temperature_celsius, notes } = await req.json();

  if (!session_date || !session_time || !duration_minutes) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('immersion_sessions')
    .insert({
      visitor_id: visitorId,
      session_date,
      session_time,
      duration_minutes: Number(duration_minutes),
      temperature_celsius: temperature_celsius ? Number(temperature_celsius) : null,
      instructor_name: '',
      notes: notes || '',
    })
    .select('id, session_date, session_time, duration_minutes, temperature_celsius, notes')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE – remove entry by ?id=
export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase.from('immersion_sessions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
