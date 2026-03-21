import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role, type, rating, text } = body;

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'שם וחוות דעת הם שדות חובה' }, { status: 400 });
  }
  if (text.trim().length < 10) {
    return NextResponse.json({ error: 'חוות הדעת קצרה מדי' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert({ name: name.trim(), role: role?.trim() || null, type: type || 'individual', rating: rating || 5, text: text.trim(), status: 'pending' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send approval email to admin
  const adminKey = process.env.ADMIN_KEY ?? 'lior2026';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://icing-blond.vercel.app';
  const approveUrl = `${baseUrl}/api/reviews/approve?id=${data.id}&key=${encodeURIComponent(adminKey)}`;

  const typeLabels: Record<string, string> = {
    individual: 'סדנת יחידים',
    couple: 'סדנת זוגות',
    team: 'סדנת קבוצות',
    immersion: 'טבילה אישית',
  };

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ritzabilu@gmail.com',
      subject: `✍️ חוות דעת חדשה ממתינה לאישור – ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0f172a;">חוות דעת חדשה ממתינה לאישור</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px; color: #64748b; width: 100px;">שם:</td><td style="padding: 8px; font-weight: bold;">${name}</td></tr>
            ${role ? `<tr><td style="padding: 8px; color: #64748b;">תפקיד:</td><td style="padding: 8px;">${role}</td></tr>` : ''}
            <tr><td style="padding: 8px; color: #64748b;">סוג:</td><td style="padding: 8px;">${typeLabels[type] ?? type}</td></tr>
            <tr><td style="padding: 8px; color: #64748b;">דירוג:</td><td style="padding: 8px;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</td></tr>
          </table>
          <div style="background: #f8fafc; border-right: 4px solid #0ea5e9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; color: #1e293b; line-height: 1.7;">"${text}"</p>
          </div>
          <a href="${approveUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
            ✅ אשר ופרסם חוות דעת
          </a>
          <p style="margin-top: 16px; color: #94a3b8; font-size: 12px;">לחיצה על הקישור תפרסם את חוות הדעת באתר מיידית.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
