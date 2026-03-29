import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

type PaymentMethod = 'credit' | 'bit' | 'paybox' | 'phone';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const { booking_id, session_token, payment_method, callback_window } = body as {
    booking_id?: string;
    session_token?: string;
    payment_method?: PaymentMethod;
    callback_window?: string;
  };

  if (!booking_id || !session_token || !payment_method) {
    return NextResponse.json({ error: 'חסרים שדות חובה' }, { status: 400 });
  }

  const validMethods: PaymentMethod[] = ['credit', 'bit', 'paybox', 'phone'];
  if (!validMethods.includes(payment_method)) {
    return NextResponse.json({ error: 'אמצעי תשלום לא תקין' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch and validate booking + session token
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, session_token, expires_at, status, confirmation_code, user_name, email, participants')
    .eq('id', booking_id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
  }
  if (booking.session_token !== session_token) {
    return NextResponse.json({ error: 'אסימון לא תקין' }, { status: 403 });
  }
  if (booking.expires_at && new Date(booking.expires_at) < new Date()) {
    return NextResponse.json({ error: 'פג תוקף ההזמנה הזמנית' }, { status: 410 });
  }

  // Determine new status based on payment method
  // credit: pending (Tranzila will confirm via webhook)
  // bit/paybox: pending_verification (manual admin verification)
  // phone: pending (admin will call back)
  const newStatus = payment_method === 'credit' ? 'pending' : 'pending';

  const updates: Record<string, unknown> = {
    payment_method,
    status: newStatus,
  };
  if (callback_window) updates.callback_window = callback_window;

  const { error: updateError } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', booking_id);

  if (updateError) {
    console.error('Confirm update error:', updateError);
    return NextResponse.json({ error: 'שגיאה באישור ההזמנה' }, { status: 500 });
  }

  // Log payment attempt
  await supabase.from('payment_attempts').insert({
    booking_id,
    method: payment_method,
    amount: 0, // price updated by draft PATCH; actual amount not carried here
    status: payment_method === 'credit' ? 'initiated' : 'pending_verification',
  });

  return NextResponse.json({
    success: true,
    confirmation_code: booking.confirmation_code,
    booking_id,
    payment_method,
  });
}
