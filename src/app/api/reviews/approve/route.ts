import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

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

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      return new NextResponse(html('⚠️', 'שגיאה', error.message), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new NextResponse(html('✅', 'חוות הדעת אושרה ופורסמה!', 'חוות הדעת תופיע באתר בביקור הבא של המשתמשים.'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'שגיאה לא ידועה';
    return new NextResponse(html('⚠️', 'שגיאה בשרת', msg), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

function html(icon: string, title: string, body: string) {
  return `<html dir="rtl"><body style="font-family:Arial;text-align:center;padding:60px;background:#0f172a;color:white;">
    <div style="font-size:64px;margin-bottom:16px;">${icon}</div>
    <h1 style="color:#38bdf8;">${title}</h1>
    <p style="color:#94a3b8;">${body}</p>
    <a href="https://icing-blond.vercel.app/#testimonials" style="color:#38bdf8;">← חזרה לאתר</a>
  </body></html>`;
}
