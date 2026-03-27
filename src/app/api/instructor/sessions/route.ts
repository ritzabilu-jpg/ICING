import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyInstructor(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('visitor_profiles')
    .select('id, name, role')
    .eq('id', visitorId)
    .maybeSingle();
  if (!data || !['instructor', 'admin'].includes(data.role)) return null;
  return data;
}

export async function GET(req: NextRequest) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: slots, error } = await supabase
    .from('immersion_slots')
    .select('*')
    .order('slot_date', { ascending: false })
    .order('slot_time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: bookings } = await supabase.from('immersion_bookings').select('slot_id');
  const countMap: Record<string, number> = {};
  bookings?.forEach(b => { countMap[b.slot_id] = (countMap[b.slot_id] || 0) + 1; });

  const result = (slots || []).map(s => ({ ...s, participant_count: countMap[s.id] || 0 }));
  return NextResponse.json(result);
}
