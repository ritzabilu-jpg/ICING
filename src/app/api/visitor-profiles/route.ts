import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// POST – login or create visitor
export async function POST(req: NextRequest) {
  const { name, phone, code } = await req.json();
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'שם וטלפון נדרשים' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Determine role from code
  let role = 'user';
  if (code) {
    if (code === process.env.ADMIN_CODE) role = 'admin';
    else if (code === process.env.INSTRUCTOR_CODE) role = 'instructor';
    else return NextResponse.json({ error: 'קוד שגוי' }, { status: 401 });
  }

  // Find existing visitor by phone
  const { data: existing } = await supabase
    .from('visitor_profiles')
    .select('*')
    .eq('phone', phone.trim())
    .single();

  if (existing) {
    // Update name if changed, upgrade role if code given
    const updates: Record<string, string> = { name: name.trim() };
    if (role !== 'user') updates.role = role;
    await supabase.from('visitor_profiles').update(updates).eq('id', existing.id);
    return NextResponse.json({ id: existing.id, name: name.trim(), role: role !== 'user' ? role : existing.role });
  }

  // Create new visitor
  const { data, error } = await supabase
    .from('visitor_profiles')
    .insert({ name: name.trim(), phone: phone.trim(), role })
    .select('id, name, role')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// GET – all visitors (instructor/admin only)
export async function GET(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase
    .from('visitor_profiles').select('role').eq('id', visitorId).single();
  if (!me || !['instructor', 'admin'].includes(me.role)) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  }

  const { data } = await supabase
    .from('visitor_profiles')
    .select('id, name, phone, role, created_at')
    .order('name');
  return NextResponse.json(data ?? []);
}
