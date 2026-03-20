import { NextRequest, NextResponse } from 'next/server';

function validateIsraeliPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+972|972|0)(5[0-9]|7[2-9]|[23489])[0-9]{7}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const { name, phone, email, message } = body as {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };

  const errors: string[] = [];

  if (!name || name.trim().length < 2) {
    errors.push('שם חייב להכיל לפחות 2 תווים');
  }
  if (!phone || !validateIsraeliPhone(phone.trim())) {
    errors.push('מספר טלפון ישראלי לא תקין');
  }
  if (!message || message.trim().length < 5) {
    errors.push('הודעה חייבת להכיל לפחות 5 תווים');
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(', ') }, { status: 422 });
  }

  const safeName = name!.trim();
  const safePhone = phone!.trim();
  const safeEmail = email?.trim() || '';
  const safeMessage = message!.trim();

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'ritzabilu@gmail.com',
        subject: `פנייה חדשה מ-${safeName}`,
        html: `<div dir="rtl"><h2>פנייה חדשה מהאתר</h2><p><b>שם:</b> ${safeName}</p><p><b>טלפון:</b> ${safePhone}</p><p><b>מייל:</b> ${safeEmail || 'לא הוזן'}</p><p><b>הודעה:</b> ${safeMessage}</p></div>`,
      });
    } catch (err) {
      console.error('[contact] Resend error:', err);
      return NextResponse.json({ error: 'שגיאה בשליחת המייל, נסה שוב מאוחר יותר' }, { status: 500 });
    }
  } else {
    console.log('[contact] RESEND_API_KEY not set – logging form submission:', {
      name: safeName,
      phone: safePhone,
      email: safeEmail || 'לא הוזן',
      message: safeMessage,
    });
  }

  return NextResponse.json({ ok: true });
}
