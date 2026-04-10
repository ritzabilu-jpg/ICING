import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone') ?? '';
  const email = req.nextUrl.searchParams.get('email') ?? '';
  if (!phone && !email) return NextResponse.json({ bookings: [] }, { status: 400 });

  const supabase = createAdminClient();

  let query = supabase
    .from('bookings')
    .select(`
      id,
      user_name,
      phone,
      email,
      participants,
      status,
      payment_status,
      payment_method,
      confirmation_code,
      callback_window,
      created_at,
      health_form_id,
      workshop_id,
      workshops (
        id,
        title,
        type,
        date_time,
        price
      )
    `)
    .neq('email', 'pending@checkout.tmp')
    .order('created_at', { ascending: false });

  // Build OR filter: match by phone OR email (whichever are provided)
  const orParts: string[] = [];
  if (phone) orParts.push(`phone.eq.${phone}`);
  if (email) orParts.push(`email.eq.${email}`);
  query = query.or(orParts.join(','));

  const { data, error } = await query;

  if (error) {
    console.error('bookings/my error:', error);
    return NextResponse.json({ bookings: [] });
  }

  const bookings = (data ?? []).map((b) => {
    const w = b.workshops as { id: string; title: string; type: string; date_time: string; price: number } | null;
    const cw = (b.callback_window as string | null) ?? '';
    const isImmersion = cw.startsWith('immersion:');
    const isWorkshop = !!w;

    return {
      id: b.id,
      user_name: b.user_name,
      type: isImmersion ? 'immersion' : (isWorkshop ? 'workshop' : 'unknown'),
      title: isImmersion
        ? 'טבילה במים קרים'
        : (w?.title ?? 'סדנה'),
      event_type: isImmersion ? '🧊 טבילה' : `🏔️ ${w?.type ?? 'סדנה'}`,
      date: isImmersion
        ? null  // slot date would need a separate query
        : (w?.date_time ?? null),
      status: b.status,
      payment_status: b.payment_status,
      payment_method: b.payment_method ?? null,
      confirmation_code: b.confirmation_code,
      amount: w ? w.price * (b.participants ?? 1) : null,
      participants: b.participants,
      health_form_id: b.health_form_id,
      created_at: b.created_at,
    };
  });

  return NextResponse.json({ bookings });
}
