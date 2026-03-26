import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { INSTRUCTORS } from '@/data/instructors';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  if (key && (key === process.env.ADMIN_KEY || key === process.env.ADMIN_CODE)) return true;
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return false;
  const supabase = createAdminClient();
  const { data } = await supabase.from('visitor_profiles').select('role').eq('id', visitorId).single();
  return data?.role === 'admin';
}

// POST – sync all static instructors into DB (update existing by slug, insert new)
export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });

  const supabase = createAdminClient();

  // Fetch existing slugs
  const { data: existing } = await supabase.from('instructors').select('id, slug');
  const slugToId: Record<string, string> = {};
  for (const row of existing ?? []) {
    if (row.slug) slugToId[row.slug] = row.id;
  }

  let synced = 0;
  const errors: string[] = [];

  for (let i = 0; i < INSTRUCTORS.length; i++) {
    const inst = INSTRUCTORS[i];
    const row = {
      slug: inst.id,
      name: inst.name,
      bio: inst.bio || '',
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
    };

    const existingId = slugToId[inst.id];
    if (existingId) {
      const { error } = await supabase.from('instructors').update(row).eq('id', existingId);
      if (error) errors.push(`${inst.name}: ${error.message}`);
      else synced++;
    } else {
      const { error } = await supabase.from('instructors').insert(row);
      if (error) errors.push(`${inst.name}: ${error.message}`);
      else synced++;
    }
  }

  if (errors.length > 0) return NextResponse.json({ ok: false, synced, errors }, { status: 207 });
  return NextResponse.json({ ok: true, synced });
}
