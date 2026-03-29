import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkKey(key: string | null) {
  const valid = process.env.ADMIN_KEY ?? 'lior2026';
  return key === valid;
}

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('phone_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

// PATCH – mark as handled
export async function PATCH(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key');
  if (!checkKey(key)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { id, handled } = await req.json() as { id: string; handled: boolean };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('phone_requests')
    .update({ handled_at: handled ? new Date().toISOString() : null })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
