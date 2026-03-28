import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  if (key && key === process.env.ADMIN_CODE) return true;
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return false;
  const supabase = createAdminClient();
  const { data } = await supabase.from('visitor_profiles').select('role').eq('id', visitorId).single();
  return data?.role === 'admin';
}

// GET – list all registered users
export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('visitor_profiles')
    .select('id, name, phone, email, role, created_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
}

// PATCH – assign role to user by email or id
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const { email, id, role } = await req.json();
  const validRoles = ['user', 'instructor', 'admin'];
  if (!role || !validRoles.includes(role)) return NextResponse.json({ error: 'תפקיד לא תקין' }, { status: 400 });
  if (!email && !id) return NextResponse.json({ error: 'נדרש אימייל או id' }, { status: 400 });

  const supabase = createAdminClient();
  const query = supabase.from('visitor_profiles').update({ role });
  const { data, error } = id
    ? await query.eq('id', id).select('id, name, email, role').maybeSingle()
    : await query.eq('email', email.trim().toLowerCase()).select('id, name, email, role').limit(1).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  return NextResponse.json(data);
}

// DELETE – remove instructor or admin user only
export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: user } = await supabase.from('visitor_profiles').select('role').eq('id', id).maybeSingle();
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  if (!['instructor', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'ניתן למחוק רק מדריכים ואדמינים' }, { status: 403 });
  }

  const { error } = await supabase.from('visitor_profiles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
