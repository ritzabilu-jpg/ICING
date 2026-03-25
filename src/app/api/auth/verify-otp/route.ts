import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'אימייל וקוד נדרשים' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('visitor_profiles')
    .select('id, name, role, email, otp_code, otp_expires_at')
    .eq('email', normalizedEmail)
    .single();

  if (!profile) return NextResponse.json({ error: 'אימייל לא נמצא' }, { status: 401 });
  if (profile.otp_code !== code.trim()) return NextResponse.json({ error: 'קוד שגוי' }, { status: 401 });
  if (!profile.otp_expires_at || new Date(profile.otp_expires_at) < new Date()) {
    return NextResponse.json({ error: 'הקוד פג תוקף – שלח קוד חדש' }, { status: 401 });
  }

  // Clear OTP
  await supabase.from('visitor_profiles')
    .update({ otp_code: null, otp_expires_at: null })
    .eq('id', profile.id);

  return NextResponse.json({ id: profile.id, name: profile.name, role: profile.role, email: profile.email });
}
