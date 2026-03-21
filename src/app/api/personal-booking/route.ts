import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { name, phone } = await req.json();

  if (!name || !phone) {
    return NextResponse.json({ error: 'שם וטלפון נדרשים' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: 'AHITOFEL@GMAIL.COM',
        subject: `🧊 בקשת סדנה אישית – ${name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #0f172a;">🧊 בקשה חדשה לסדנה אישית</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">שם</td>
                <td style="padding: 12px 8px; color: #0f172a; font-size: 18px;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">טלפון</td>
                <td style="padding: 12px 8px; color: #0f172a; font-size: 18px;">
                  <a href="tel:${phone}" style="color: #0ea5e9;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">מחיר</td>
                <td style="padding: 12px 8px; color: #0f172a;">₪500</td>
              </tr>
            </table>
            <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
              נשלח מאתר חוויות שוויץ המדע
            </p>
          </div>
        `,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Personal booking email error:', err);
    return NextResponse.json({ error: 'שגיאה בשליחת המייל' }, { status: 500 });
  }
}
