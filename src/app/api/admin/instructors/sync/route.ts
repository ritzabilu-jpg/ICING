import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { INSTRUCTORS } from '@/data/instructors';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? '';
  if (key && key === process.env.ADMIN_KEY) return true;
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return false;
  const supabase = createAdminClient();
  const { data } = await supabase.from('visitor_profiles').select('role').eq('id', visitorId).single();
  return data?.role === 'admin';
}

// POST – upsert all static instructors into DB
export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });

  const supabase = createAdminClient();

  const rows = INSTRUCTORS.map((inst, i) => ({
    slug: inst.id,
    name: inst.name,
    bio: inst.bio,
    photo_url: inst.photo_url || null,
    specialties: inst.specialties || [],
    certifications: inst.certifications || [],
    quote: inst.quote || null,
    phone: inst.phone || null,
    email_contact: inst.email || null,
    facebook_url: inst.facebook_url || null,
    female: inst.female ?? false,
    sort_order: i + 1,
    is_active: true,
  }));

  const { error } = await supabase
    .from('instructors')
    .upsert(rows, { onConflict: 'slug' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, synced: rows.length });
}
