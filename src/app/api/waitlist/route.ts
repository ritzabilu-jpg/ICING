import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const waitlistSchema = z.object({
  workshop_id: z.string().uuid(),
  email: z.string().email('כתובת מייל לא תקינה'),
  phone: z.string().min(9).max(15).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'גוף הבקשה אינו JSON תקין' }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'נתונים לא תקינים', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  // Get current max position
  const { data: lastEntry } = await supabase
    .from('waitlist')
    .select('position')
    .eq('workshop_id', data.workshop_id)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (lastEntry?.position ?? 0) + 1;

  const { data: entry, error } = await supabase
    .from('waitlist')
    .insert({
      workshop_id: data.workshop_id,
      email: data.email,
      phone: data.phone ?? null,
      position: nextPosition,
    })
    .select('id, position')
    .single();

  if (error) {
    // Unique constraint: already on waitlist
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'כתובת המייל כבר רשומה ברשימת ההמתנה לסדנה זו' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: `נרשמת בהצלחה למקום ${entry.position} ברשימת ההמתנה. נעדכן אותך ברגע שיתפנה מקום!`,
      position: entry.position,
    },
    { status: 201 }
  );
}
