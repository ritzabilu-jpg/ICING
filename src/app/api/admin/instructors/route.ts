import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  if (key && (key === process.env.ADMIN_CODE || key === process.env.ADMIN_KEY)) return true;
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return false;
  const supabase = createAdminClient();
  const { data } = await supabase.from('visitor_profiles').select('role').eq('id', visitorId).maybeSingle();
  return data?.role === 'admin';
}

// GET – list all instructors (admin)
export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST – create instructor
export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const body = await req.json();
  const { name, slug, bio, photo_url, specialties, certifications, quote, facebook_url, phone, email_contact, female, sort_order } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'שם נדרש' }, { status: 400 });

  const supabase = createAdminClient();

  // Auto-generate slug from name if not provided
  const autoSlug = (slug?.trim() || name.trim()
    .toLowerCase()
    .replace(/[\s"'״׳]+/g, '-')
    .replace(/[^\w\u0590-\u05ff-]/g, '')
    .slice(0, 50));

  const { data, error } = await supabase.from('instructors').insert({
    name: name.trim(),
    slug: autoSlug,
    bio: bio?.trim() || '',
    photo_url: photo_url?.trim() || null,
    specialties: Array.isArray(specialties) ? specialties : (specialties?.split(',').map((s: string) => s.trim()).filter(Boolean) || []),
    certifications: Array.isArray(certifications) ? certifications : (certifications?.split(',').map((s: string) => s.trim()).filter(Boolean) || []),
    quote: quote?.trim() || null,
    facebook_url: facebook_url?.trim() || null,
    phone: phone?.trim() || null,
    email_contact: email_contact?.trim() || null,
    female: !!female,
    sort_order: sort_order ?? 99,
    is_active: true,
  }).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH – update instructor
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  // Normalize array fields
  if (fields.specialties && !Array.isArray(fields.specialties)) {
    fields.specialties = fields.specialties.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  if (fields.certifications && !Array.isArray(fields.certifications)) {
    fields.certifications = fields.certifications.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('instructors').update(fields).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE – remove instructor
export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await supabase.from('instructors').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
