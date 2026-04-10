import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? 'lior2026';

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const phone = req.nextUrl.searchParams.get('phone');
  const name  = req.nextUrl.searchParams.get('name');

  const supabase = createAdminClient();

  let query = supabase
    .from('bookings')
    .select(`
      id,
      user_name,
      email,
      phone,
      participants,
      status,
      payment_status,
      payment_method,
      confirmation_code,
      callback_window,
      notes,
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

  if (phone) query = query.ilike('phone', `%${phone}%`);
  if (name)  query = query.ilike('user_name', `%${name}%`);

  const { data, error } = await query;

  if (error) {
    console.error('admin/bookings error:', error);
    return NextResponse.json({ bookings: [] });
  }

  const bookings = (data ?? []).map((b) => {
    const w = b.workshops as { id: string; title: string; type: string; date_time: string; price: number } | null;
    const cw = (b.callback_window as string | null) ?? '';
    const isImmersion = cw.startsWith('immersion:');

    return {
      id: b.id,
      user_name: b.user_name,
      email: b.email,
      phone: b.phone,
      type: isImmersion ? 'immersion' : 'workshop',
      event_type: isImmersion ? '🧊 טבילה' : `🏔️ ${w?.type ?? 'סדנה'}`,
      title: isImmersion ? 'טבילה במים קרים' : (w?.title ?? 'סדנה'),
      date: w?.date_time ?? null,
      participants: b.participants,
      status: b.status,
      payment_status: b.payment_status,
      payment_method: b.payment_method ?? null,
      confirmation_code: b.confirmation_code,
      amount: w ? w.price * (b.participants ?? 1) : null,
      health_form_id: b.health_form_id,
      notes: b.notes,
      created_at: b.created_at,
    };
  });

  return NextResponse.json({ bookings });
}
