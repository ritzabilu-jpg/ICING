import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// GET – check if visitor filled health check today
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const visitorId = searchParams.get('visitor_id') || req.headers.get('x-visitor-id');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  if (!visitorId) return NextResponse.json({ filled: false });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('daily_health_checks')
    .select('id, submitted_at')
    .eq('visitor_id', visitorId)
    .eq('check_date', date)
    .single();

  return NextResponse.json({ filled: !!data, submitted_at: data?.submitted_at ?? null });
}

// GET all checks for a date (instructor/admin)
export async function POST(req: NextRequest) {
  const requesterId = req.headers.get('x-visitor-id');
  if (!requesterId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from('visitor_profiles').select('role').eq('id', requesterId).single();
  if (!me) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });

  const body = await req.json();
  const { feels_healthy, no_fever, feeling_good } = body;

  if (!feels_healthy || !no_fever || !feeling_good) {
    return NextResponse.json({ error: 'יש לאשר את כל ההצהרות' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_health_checks')
    .upsert({
      visitor_id: requesterId,
      check_date: today,
      feels_healthy,
      no_fever,
      feeling_good,
      submitted_at: new Date().toISOString(),
    }, { onConflict: 'visitor_id,check_date' })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
}
