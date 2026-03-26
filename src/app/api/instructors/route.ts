import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { INSTRUCTORS } from '@/data/instructors';

export const dynamic = 'force-dynamic';

// Public endpoint – returns active instructors (DB merged with static fallback)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('instructors')
      .select('id,name,slug,bio,specialties,certifications,quote,photo_url,facebook_url,phone,email_contact,female,sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    const dbList = (data ?? []).map((r: any) => ({ ...r, id: r.slug || r.id, email: r.email_contact }));
    const dbIds = new Set(dbList.map((i: any) => i.id));
    const dbNames = new Set(dbList.map((i: any) => i.name));
    const staticOnly = INSTRUCTORS.filter(i => !dbIds.has(i.id) && !dbNames.has(i.name));
    const merged = [...dbList, ...staticOnly];
    const LIOR = 'ליאור כ"ץ';
    merged.sort((a, b) => {
      if (a.name === LIOR) return -1;
      if (b.name === LIOR) return 1;
      return a.name.localeCompare(b.name, 'he');
    });
    return NextResponse.json(merged);
  } catch {
    return NextResponse.json(INSTRUCTORS);
  }
}
