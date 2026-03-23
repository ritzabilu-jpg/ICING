import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const key = req.nextUrl.searchParams.get('key');
    const validKey = process.env.ADMIN_KEY ?? 'lior2026';

    if (!id || key !== validKey) {
      return new NextResponse(html('❌', 'לא מורשה', 'הקישור אינו תקין או פג תוקפו.'), {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const action = req.nextUrl.searchParams.get('action') ?? 'approve';
    const newStatus = action === 'reject' ? 'rejected' : 'approved';

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('reviews')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      return new NextResponse(html('⚠️', 'שגיאה', error.message), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (action === 'reject') {
      return NextResponse.json({ ok: true, status: 'rejected' });
    }
    return NextResponse.json({ ok: true, status: 'approved' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'שגיאה לא ידועה';
    return new NextResponse(html('⚠️', 'שגיאה בשרת', msg), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

function html(icon: string, title: string, body: string) {
  return `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="font-family:Arial,sans-serif;direction:rtl;text-align:right;padding:60px 24px;background:#0f172a;color:white;margin:0;">
    <div style="max-width:480px;margin:0 auto;text-align:center;">
      <div style="font-size:64px;margin-bottom:16px;">${icon}</div>
      <h1 style="color:#38bdf8;margin-bottom:12px;">${title}</h1>
      <p style="color:#94a3b8;margin-bottom:32px;direction:rtl;">${body}</p>
      <a href="https://icing-blond.vercel.app/#testimonials" style="color:#38bdf8;text-decoration:none;">חזרה לאתר →</a>
    </div>
  </body></html>`;
}
