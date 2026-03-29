import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// POST: create a new draft booking (pending, with session_token)
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const { product_type, product_id } = body as { product_type?: string; product_id?: string };

  if (!product_type || !product_id) {
    return NextResponse.json({ error: 'חסרים שדות: product_type, product_id' }, { status: 400 });
  }
  if (!['workshop', 'immersion'].includes(product_type)) {
    return NextResponse.json({ error: 'product_type לא תקין' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const sessionToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  const confirmationCode = randomBytes(4).toString('hex').toUpperCase();

  let bookingData: Record<string, unknown>;

  if (product_type === 'workshop') {
    bookingData = {
      workshop_id: product_id,
      user_name: 'טרם הוזן',
      email: 'pending@checkout.tmp',
      phone: '000',
      participants: 1,
      status: 'pending',
      payment_status: 'unpaid',
      confirmation_code: confirmationCode,
      session_token: sessionToken,
      expires_at: expiresAt,
    };
  } else {
    // immersion – stored in immersion_bookings but we need a bookings row for session tracking
    // We insert a placeholder workshop booking as draft. Actual immersion booking is created on confirm.
    bookingData = {
      user_name: 'טרם הוזן',
      email: 'pending@checkout.tmp',
      phone: '000',
      participants: 1,
      status: 'pending',
      payment_status: 'unpaid',
      confirmation_code: confirmationCode,
      session_token: sessionToken,
      expires_at: expiresAt,
      // Store immersion slot id in callback_window field temporarily
      callback_window: `immersion:${product_id}`,
    };
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select('id, session_token, expires_at')
    .single();

  if (error || !booking) {
    console.error('Draft booking error:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת הזמנה זמנית' }, { status: 500 });
  }

  return NextResponse.json({
    booking_id: booking.id,
    session_token: booking.session_token,
    expires_at: booking.expires_at,
  });
}

// PATCH: update participant info on an existing draft booking
export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const {
    booking_id,
    session_token,
    user_name,
    email,
    phone,
    city,
    participants,
  } = body as {
    booking_id?: string;
    session_token?: string;
    user_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    participants?: number;
  };

  if (!booking_id || !session_token) {
    return NextResponse.json({ error: 'חסרים booking_id ו-session_token' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Validate session token
  const { data: existing, error: fetchError } = await supabase
    .from('bookings')
    .select('id, session_token, expires_at')
    .eq('id', booking_id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
  }
  if (existing.session_token !== session_token) {
    return NextResponse.json({ error: 'אסימון לא תקין' }, { status: 403 });
  }
  if (existing.expires_at && new Date(existing.expires_at) < new Date()) {
    return NextResponse.json({ error: 'פג תוקף ההזמנה הזמנית' }, { status: 410 });
  }

  const updates: Record<string, unknown> = {};
  if (user_name) updates.user_name = user_name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (city !== undefined) updates.city = city;
  if (participants !== undefined) updates.participants = participants;

  const { error: updateError } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', booking_id);

  if (updateError) {
    console.error('Draft PATCH error:', updateError);
    return NextResponse.json({ error: 'שגיאה בעדכון ההזמנה' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
