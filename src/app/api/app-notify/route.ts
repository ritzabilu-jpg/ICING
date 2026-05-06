import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone?.trim()) return NextResponse.json({ error: 'phone required' }, { status: 400 });

    const supabase = createAdminClient();
    await supabase.from('app_waitlist').upsert(
      { phone: phone.trim(), created_at: new Date().toISOString() },
      { onConflict: 'phone' }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
