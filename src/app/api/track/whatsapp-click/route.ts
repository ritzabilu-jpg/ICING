import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: Record<string, string> = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const { source = 'לא ידוע', page, name, phone, extra } = body;
  const now = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

  const rows = [
    ['מקור', source],
    ['דף', page || 'לא ידוע'],
    ...(name  ? [['שם',    name]]  : []),
    ...(phone ? [['טלפון', phone]] : []),
    ...(extra ? [['פרטים', extra]] : []),
    ['זמן', now],
  ] as [string, string][];

  const tableRows = rows
    .map(([k, v]) => `<tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;white-space:nowrap">${k}</td><td style="padding:8px 12px">${v}</td></tr>`)
    .join('');

  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px">
    <h2 style="color:#25D366;margin-bottom:16px">💬 לחיצה על כפתור וואטסאפ</h2>
    <table style="border-collapse:collapse;width:100%;border:1px solid #e5e7eb">
      ${tableRows}
    </table>
  </div>`;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'ritzabilu@gmail.com',
        subject: `💬 וואטסאפ – ${source}`,
        html,
      });
    } catch (err) {
      console.error('[track-whatsapp] Resend error:', err);
    }
  } else {
    console.log('[track-whatsapp] click:', { source, page, name, phone });
  }

  return NextResponse.json({ ok: true });
}
