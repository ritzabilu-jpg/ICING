import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const key = req.nextUrl.searchParams.get('key');
  const validKey = process.env.ADMIN_KEY ?? 'lior2026';

  if (!id || key !== validKey) {
    return new NextResponse('לא מורשה', { status: 401 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('reviews')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) {
    return new NextResponse(`שגיאה: ${error.message}`, { status: 500 });
  }

  return new NextResponse(`
    <html dir="rtl"><body style="font-family:Arial;text-align:center;padding:60px;background:#0f172a;color:white;">
      <div style="font-size:64px;margin-bottom:16px;">✅</div>
      <h1 style="color:#38bdf8;">חוות הדעת אושרה ופורסמה!</h1>
      <p style="color:#94a3b8;">חוות הדעת תופיע באתר בביקור הבא של המשתמשים.</p>
      <a href="https://icing-blond.vercel.app/#testimonials" style="color:#38bdf8;">← חזרה לאתר</a>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
