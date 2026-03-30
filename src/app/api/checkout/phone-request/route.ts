import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getCallbackDeadline(now: Date): Date {
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, 5=Fri, 6=Sat
  const hour = now.getHours();
  const isWeekend = day === 5 || day === 6 || (day === 4 && hour >= 12);

  if (isWeekend) {
    // Find next Sunday 18:00 Israel time
    const nextSun = new Date(now);
    const daysToSun = day === 0 ? 7 : (7 - day);
    nextSun.setDate(now.getDate() + daysToSun);
    nextSun.setHours(18, 0, 0, 0);
    return nextSun;
  }

  // Within 24 hours
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

function formatDeadlineHebrew(deadline: Date): string {
  const day = deadline.getDay();
  const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const d = String(deadline.getDate()).padStart(2, '0');
  const m = String(deadline.getMonth() + 1).padStart(2, '0');
  const h = String(deadline.getHours()).padStart(2, '0');
  const min = String(deadline.getMinutes()).padStart(2, '0');
  return `יום ${hebrewDays[day]} ${d}/${m} עד שעה ${h}:${min}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name: string;
    phone: string;
    email: string;
    preferred_hours: string;
    product_title?: string;
    product_date?: string;
    product_time?: string;
    product_date_iso?: string;
    booking_id?: string;
  };

  const now = new Date();
  const deadline = getCallbackDeadline(now);
  const deadlineStr = formatDeadlineHebrew(deadline);

  // Use actual booking date for calendar if available
  const bookingDate = body.product_date_iso ? new Date(body.product_date_iso) : null;
  const calStart = bookingDate ?? deadline;
  const calEnd = new Date(calStart.getTime() + 60 * 60 * 1000);

  // Generate confirmation code
  const confirmation_code = 'PH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('phone_requests')
    .insert([{
      name: body.name,
      phone: body.phone,
      email: body.email,
      preferred_hours: body.preferred_hours,
      product_title: body.product_title ?? null,
      product_date: body.product_date ?? null,
      product_time: body.product_time ?? null,
      product_date_iso: body.product_date_iso ?? null,
      booking_id: body.booking_id ?? null,
      confirmation_code,
      callback_deadline: deadline.toISOString(),
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build calendar links (use actual booking date if available, else callback deadline)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://icing.co.il';
  function fmtGCal(d: Date) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  const calTitle  = body.product_title ? body.product_title : 'ICING – הזמנה';
  const gcTitle   = encodeURIComponent(calTitle);
  const gcDetails = encodeURIComponent(`שעות מועדפות לשיחה: ${body.preferred_hours}\nקוד: ${confirmation_code}`);
  const gcLoc     = encodeURIComponent('רחובות');
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcTitle}&dates=${fmtGCal(calStart)}/${fmtGCal(calEnd)}&details=${gcDetails}&location=${gcLoc}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${gcTitle}&startdt=${calStart.toISOString()}&enddt=${calEnd.toISOString()}&body=${gcDetails}&location=${gcLoc}`;
  const icsUrl = `${baseUrl}/api/calendar/${confirmation_code}`;

  // Send email confirmation
  try {
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY && body.email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'ICING <noreply@icing.co.il>',
          to: [body.email],
          subject: `אישור פנייה – ${confirmation_code}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0f2942;">שלום ${body.name},</h2>
              <p>קיבלנו את פנייתך ונחזור אליך <strong style="color: #e05c2e;">${deadlineStr}</strong>.</p>
              ${body.product_title ? `<p>פרטי ההזמנה: <strong>${body.product_title}</strong>${body.product_date ? ` – ${body.product_date}` : ''}${body.product_time ? ` ${body.product_time}` : ''}</p>` : ''}
              <p>שעות מועדפות לחזרה: <strong>${body.preferred_hours}</strong></p>

              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">קוד אישור פנייה</p>
                <p style="margin: 4px 0 0; font-size: 24px; font-weight: 900; font-family: monospace; color: #0f2942;">${confirmation_code}</p>
              </div>

              <p style="color: #475569; font-size: 13px; font-weight: bold; margin-bottom: 8px;">הוסף ליומן שלך:</p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 0 6px 0 0;">
                    <a href="${googleUrl}" target="_blank"
                      style="display:inline-block; background:#4285F4; color:white; font-weight:bold; font-size:13px; padding:10px 16px; border-radius:8px; text-decoration:none;">
                      📅 Google Calendar
                    </a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="${outlookUrl}" target="_blank"
                      style="display:inline-block; background:#0078D4; color:white; font-weight:bold; font-size:13px; padding:10px 16px; border-radius:8px; text-decoration:none;">
                      📅 Outlook
                    </a>
                  </td>
                  <td style="padding: 0 0 0 6px;">
                    <a href="${icsUrl}"
                      style="display:inline-block; background:#1d4ed8; color:white; font-weight:bold; font-size:13px; padding:10px 16px; border-radius:8px; text-decoration:none;">
                      📥 Apple / .ics
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 13px;">שמור את קוד האישור לעיון עתידי.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px;">ICING – חוויות שוויץ המדע | רחובות</p>
            </div>
          `,
        }),
      });
    }
  } catch {
    // Email failure doesn't block the response
  }

  void data;

  return NextResponse.json({
    success: true,
    confirmation_code,
    callback_deadline: deadline.toISOString(),
    deadline_str: deadlineStr,
  });
}
