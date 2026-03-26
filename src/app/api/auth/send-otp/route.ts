import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  if (!email?.trim()) return NextResponse.json({ error: 'אימייל נדרש' }, { status: 400 });

  const normalizedEmail = email.trim().toLowerCase();
  const otp = generateOTP();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const supabase = createAdminClient();

  // Check if visitor already exists by email
  const { data: existing } = await supabase
    .from('visitor_profiles')
    .select('id, name')
    .eq('email', normalizedEmail)
    .single();

  if (existing) {
    // Update OTP on existing record
    await supabase.from('visitor_profiles')
      .update({ otp_code: otp, otp_expires_at: expires.toISOString() })
      .eq('id', existing.id);
  } else {
    // Create new visitor with email only (phone optional)
    const safeName = name?.trim() || normalizedEmail.split('@')[0];
    const { error } = await supabase.from('visitor_profiles')
      .insert({ email: normalizedEmail, name: safeName, role: 'user', otp_code: otp, otp_expires_at: expires.toISOString() });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send OTP via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'noreply@icing.co.il',
        to: normalizedEmail,
        subject: `קוד האימות שלך: ${otp}`,
        html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:400px;margin:auto;padding:20px">
          <h2 style="color:#0f172a">ICING – טבילה במי קרח 🧊</h2>
          <p>קוד האימות שלך:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0284c7;text-align:center;padding:20px;background:#f0f9ff;border-radius:12px;margin:20px 0">
            ${otp}
          </div>
          <p style="color:#64748b;font-size:14px">הקוד תקף ל-10 דקות. אל תשתף אותו עם אחרים.</p>
        </div>`,
      });
    } catch (err) {
      console.error('[send-otp] Resend error:', err);
      // Don't fail – OTP is still in DB
    }
  } else {
    // Development: log to console
    console.log(`[send-otp] OTP for ${normalizedEmail}: ${otp}`);
  }

  return NextResponse.json({ ok: true });
}
