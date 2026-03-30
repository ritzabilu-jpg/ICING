import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function fmtICS(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('phone_requests')
    .select('id, name, preferred_hours, confirmation_code, callback_deadline, product_title, product_date_iso')
    .eq('confirmation_code', params.code)
    .single();

  if (!data) return new NextResponse('Not found', { status: 404 });

  // Use actual booking date when available, else fall back to callback deadline
  const start = data.product_date_iso
    ? new Date(data.product_date_iso)
    : new Date(data.callback_deadline);
  const end   = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

  const summary = data.product_title ?? 'ICING – הזמנה';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ICING//Booking//HE',
    'BEGIN:VEVENT',
    `UID:${data.id}@icing.co.il`,
    `DTSTAMP:${fmtICS(new Date())}`,
    `DTSTART:${fmtICS(start)}`,
    `DTEND:${fmtICS(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:קוד אישור: ${data.confirmation_code}${data.preferred_hours ? `\\nשעות מועדפות לשיחה: ${data.preferred_hours}` : ''}`,
    'LOCATION:רחובות',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="icing-callback.ics"',
    },
  });
}
