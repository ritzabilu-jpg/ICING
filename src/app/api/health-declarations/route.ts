import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';

const healthSchema = z.object({
  booking_id: z.string().uuid('מזהה הזמנה לא תקין'),
  has_heart_condition: z.boolean(),
  has_hypertension: z.boolean(),
  is_pregnant: z.boolean(),
  has_raynauds: z.boolean(),
  has_open_wounds: z.boolean(),
  other_conditions: z.string().max(500).default(''),
  participant_name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים').max(100),
  signature: z.string().min(50, 'נדרשת חתימה'), // base64 data URL minimum length
});

// Conditions that require doctor approval before participation
const DISQUALIFYING_CONDITIONS = [
  { field: 'has_heart_condition', label: 'מחלת לב' },
  { field: 'is_pregnant', label: 'הריון' },
  { field: 'has_raynauds', label: 'תסמונת ריינו' },
];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const parsed = healthSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check for disqualifying conditions
  const disqualifiers = DISQUALIFYING_CONDITIONS.filter(
    c => (data as Record<string, unknown>)[c.field] === true
  );

  if (disqualifiers.length > 0) {
    return NextResponse.json(
      {
        error: 'נמצאו מצבים המצריכים אישור רופא לפני השתתפות.',
        requiresDoctorApproval: true,
        conditions: disqualifiers.map(c => c.label),
        message:
          'אנו ממליצים להתייעץ עם רופא לפני הטבילה. ' +
          'לפרטים ניתן לצור קשר עם המרכז: 08-9310715',
      },
      { status: 422 }
    );
  }

  const supabase = createAdminClient();

  // Verify the booking exists and belongs to a valid workshop
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', data.booking_id)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
  }

  // Save health declaration
  const { data: declaration, error: insertError } = await supabase
    .from('health_declarations')
    .insert({
      booking_id: data.booking_id,
      has_heart_condition: data.has_heart_condition,
      has_hypertension: data.has_hypertension,
      is_pregnant: data.is_pregnant,
      has_raynauds: data.has_raynauds,
      has_open_wounds: data.has_open_wounds,
      other_conditions: data.other_conditions,
      participant_name: data.participant_name,
      signature: data.signature,
      signed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (insertError || !declaration) {
    console.error('Health declaration insert error:', insertError);
    return NextResponse.json(
      { error: 'שגיאה בשמירת הצהרת הבריאות' },
      { status: 500 }
    );
  }

  // Link health form to booking
  const { error: linkError } = await supabase
    .from('bookings')
    .update({ health_form_id: declaration.id })
    .eq('id', data.booking_id);
  if (linkError) console.error('Health form link error:', linkError);

  return NextResponse.json(
    {
      id: declaration.id,
      message: 'הצהרת הבריאות נשמרה בהצלחה',
    },
    { status: 201 }
  );
}
