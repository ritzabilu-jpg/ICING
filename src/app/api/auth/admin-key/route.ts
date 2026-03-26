import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Returns ADMIN_CODE to verified admin visitors only
export async function POST(req: NextRequest) {
  const { visitor_id } = await req.json();
  if (!visitor_id) return NextResponse.json({ error: 'חסר visitor_id' }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('visitor_profiles')
    .select('role')
    .eq('id', visitor_id)
    .single();

  if (data?.role !== 'admin') return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });

  return NextResponse.json({ key: process.env.ADMIN_CODE ?? '' });
}
