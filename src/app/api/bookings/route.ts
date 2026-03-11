import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';
import { sendBookingConfirmation } from '@/lib/email';
import { randomBytes } from 'crypto';

const bookingSchema = z.object({
  workshop_id: z.string().uuid('מזהה סדנה לא תקין'),
  user_name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים').max(100),
  email: z.string().email('כתובת מייל לא תקינה'),
  phone: z.string().min(9, 'מספר טלפון לא תקין').max(15),
  participants: z.number().int().min(1, 'לפחות משתתף אחד').max(20),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  // 1. Atomic seat reservation using Postgres function (prevents double-booking)
  const { data: reserved, error: rpcError } = await supabase.rpc('reserve_seat', {
    p_workshop_id: data.workshop_id,
    p_participants: data.participants,
  });

  if (rpcError) {
    console.error('reserve_seat error:', rpcError);
    return NextResponse.json(
      { error: 'שגיאה בהזמנת מקום. אנא נסו שנית.' },
      { status: 500 }
    );
  }

  if (!reserved) {
    return NextResponse.json(
      { error: 'אין מקומות פנויים בסדנה זו. אנא בחרו מועד אחר.' },
      { status: 409 }
    );
  }

  // 2. Generate unique confirmation code
  const confirmationCode = randomBytes(4).toString('hex').toUpperCase();

  // 3. Create booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      workshop_id: data.workshop_id,
      user_name: data.user_name,
      email: data.email,
      phone: data.phone,
      participants: data.participants,
      status: 'pending',
      payment_status: 'unpaid',
      confirmation_code: confirmationCode,
    })
    .select('*, workshop:workshops(id, title, type, date_time, price)')
    .single();

  if (bookingError || !booking) {
    // Rollback seat count
    await supabase.rpc('release_seat', {
      p_workshop_id: data.workshop_id,
      p_participants: data.participants,
    }).catch(console.error);

    console.error('Booking insert error:', bookingError);
    return NextResponse.json(
      { error: 'שגיאה ביצירת ההזמנה. הסדנה לא חויבה.' },
      { status: 500 }
    );
  }

  const workshop = booking.workshop as {
    id: string; title: string; type: string; date_time: string; price: number;
  };

  // 4. Send confirmation email (fire-and-forget – non-blocking)
  sendBookingConfirmation({
    to: data.email,
    userName: data.user_name,
    workshopTitle: workshop.title,
    workshopType: workshop.type,
    dateTime: new Date(workshop.date_time).toLocaleString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    confirmationCode,
    participants: data.participants,
    totalPrice: workshop.price * data.participants,
    location: 'רחוב סירני 52, חולון – מתחם הבריכה הטיפולית',
  }).catch(err => console.error('Email send failed (non-critical):', err));

  return NextResponse.json(
    {
      booking: {
        id: booking.id,
        confirmation_code: confirmationCode,
        workshop_id: data.workshop_id,
        status: 'pending',
        payment_status: 'unpaid',
      },
      message: 'ההזמנה נקלטה בהצלחה! אישור נשלח למייל שלך.',
    },
    { status: 201 }
  );
}

// GET: Retrieve a booking by confirmation code (for success page)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const code = searchParams.get('code');

  if (!id && !code) {
    return NextResponse.json({ error: 'נדרש מזהה הזמנה' }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from('bookings')
    .select('*, workshop:workshops(id, title, type, date_time, price, instructor:instructors(name))')
    .limit(1);

  if (id) query = query.eq('id', id);
  if (code) query = query.eq('confirmation_code', code.toUpperCase());

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
  }

  return NextResponse.json(data);
}
