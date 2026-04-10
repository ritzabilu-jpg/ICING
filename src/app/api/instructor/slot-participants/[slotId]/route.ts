import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { resolveInstructor } from '@/lib/instructor';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slotId: string } }
) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ participants: [] }, { status: 401 });

  const inst = await resolveInstructor(visitorId);
  if (!inst) return NextResponse.json({ participants: [] }, { status: 403 });

  const supabase = createAdminClient();
  const slotId = params.slotId;

  // Fetch bookings where callback_window = 'immersion:{slotId}'
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      user_name,
      phone,
      status,
      payment_status,
      payment_method,
      confirmation_code,
      health_form_id
    `)
    .eq('callback_window', `immersion:${slotId}`)
    .neq('email', 'pending@checkout.tmp')
    .order('created_at', { ascending: true });

  if (!bookings?.length) {
    return NextResponse.json({ participants: [] });
  }

  // Fetch daily health checks for today for each participant by phone
  const today = new Date().toISOString().split('T')[0];
  const phones = bookings.map(b => b.phone).filter(Boolean);

  // Check health declarations (annual) - by health_form_id
  const healthFormIds = bookings
    .map(b => b.health_form_id)
    .filter(Boolean) as string[];

  const { data: annualForms } = healthFormIds.length
    ? await supabase
        .from('health_declarations')
        .select('id, signed_at')
        .in('id', healthFormIds)
    : { data: [] };

  const annualMap = new Map((annualForms ?? []).map(f => [f.id, f.signed_at]));

  // Check daily health checks by phone
  const { data: dailyChecks } = phones.length
    ? await supabase
        .from('daily_health_checks')
        .select('phone, created_at')
        .in('phone', phones)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
    : { data: [] };

  const dailyMap = new Map((dailyChecks ?? []).map(d => [d.phone, true]));

  const participants = bookings.map(b => ({
    booking_id: b.id,
    name: b.user_name,
    phone: b.phone,
    payment_status: b.payment_status,
    payment_method: b.payment_method ?? null,
    confirmation_code: b.confirmation_code,
    booking_status: b.status,
    has_annual_health: !!b.health_form_id && annualMap.has(b.health_form_id),
    annual_health_date: b.health_form_id ? annualMap.get(b.health_form_id) ?? null : null,
    has_daily_health: dailyMap.has(b.phone) ?? false,
  }));

  return NextResponse.json({ participants });
}
