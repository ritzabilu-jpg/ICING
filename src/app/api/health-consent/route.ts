import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  return key === (process.env.ADMIN_KEY ?? 'lior2026');
}

// ── POST — submit health consent form ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic presence check
    if (!body.full_name || !body.phone) {
      return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('health_consent_forms')
      .insert([body])
      .select('id')
      .single();

    if (error) {
      console.error('health-consent POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error('health-consent POST exception:', e);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}

// ── GET — fetch all forms (admin only) ───────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!checkKey(key)) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('health_consent_forms')
    .select('id, created_at, full_name, birth_date, phone, email, was_blocked, blocking_reasons, status, health_answers, acknowledgments, privacy_consent, signature_name, signature_date, id_number, emergency_contact_name, emergency_contact_phone, coach_name, session_date, branch, admin_notes')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ forms: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

// ── PATCH — update form status (admin only) ───────────────────────────────────
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!checkKey(key)) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'חסר מזהה' }, { status: 400 });

  const body = await req.json() as { status?: string; admin_notes?: string };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('health_consent_forms')
    .update({ status: body.status, admin_notes: body.admin_notes })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
