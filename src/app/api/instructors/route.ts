import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Public endpoint – returns active instructors ordered by sort_order
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructors')
    .select('id,name,slug,bio,specialties,certifications,quote,photo_url,facebook_url,phone,email_contact,female,sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
