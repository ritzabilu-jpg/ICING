import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyInstructor(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('visitor_profiles')
    .select('id, role')
    .eq('id', visitorId)
    .maybeSingle();
  if (!data || !['instructor', 'admin'].includes(data.role)) return null;
  return data;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const kind = new URL(req.url).searchParams.get('kind') ?? 'slot';
  const supabase = createAdminClient();

  if (kind === 'workshop') {
    const [wsRes, bookingsRes] = await Promise.all([
      supabase.from('workshops').select('*').eq('id', params.id).maybeSingle(),
      supabase.from('bookings').select('*').eq('workshop_id', params.id).order('user_name'),
    ]);
    if (!wsRes.data) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
    const ws = wsRes.data;
    const dt = new Date(ws.date_time);
    return NextResponse.json({
      slot: {
        id: ws.id,
        kind: 'workshop',
        slot_date: dt.toISOString().split('T')[0],
        slot_time: dt.toTimeString().slice(0, 5),
        max_participants: ws.capacity,
        location: '',
        notes: ws.description || '',
        title: ws.title,
      },
      participants: (bookingsRes.data || []).map(b => ({
        id: b.id,
        visitor_name: b.user_name,
        visitor_phone: b.phone,
        daily_check_completed: b.daily_check_completed ?? false,
        yearly_declaration_completed: b.yearly_declaration_completed ?? false,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  }

  // Default: immersion_slot
  const [slotRes, bookingsRes] = await Promise.all([
    supabase.from('immersion_slots').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('immersion_bookings').select('*').eq('slot_id', params.id).order('visitor_name'),
  ]);
  if (!slotRes.data) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
  return NextResponse.json({
    slot: { ...slotRes.data, kind: 'slot' },
    participants: bookingsRes.data || [],
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { booking_id, field, value, kind } = await req.json();
  const allowed = ['daily_check_completed', 'yearly_declaration_completed'];
  if (!booking_id || !allowed.includes(field)) {
    return NextResponse.json({ error: 'נתונים שגויים' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const table = kind === 'workshop' ? 'bookings' : 'immersion_bookings';
  const { error } = await supabase.from(table).update({ [field]: value }).eq('id', booking_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
