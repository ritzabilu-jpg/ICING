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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const [slotRes, bookingsRes] = await Promise.all([
    supabase.from('immersion_slots').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('immersion_bookings').select('*').eq('slot_id', params.id).order('visitor_name'),
  ]);

  if (!slotRes.data) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
  return NextResponse.json({ slot: slotRes.data, participants: bookingsRes.data || [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { booking_id, field, value } = await req.json();
  const allowed = ['daily_check_completed', 'yearly_declaration_completed'];
  if (!booking_id || !allowed.includes(field)) {
    return NextResponse.json({ error: 'נתונים שגויים' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('immersion_bookings')
    .update({ [field]: value })
    .eq('id', booking_id)
    .eq('slot_id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
