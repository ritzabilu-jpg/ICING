import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function verifyInstructor(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id');
  if (!visitorId) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('visitor_profiles')
    .select('id, name, role')
    .eq('id', visitorId)
    .maybeSingle();
  if (!data || !['instructor', 'admin'].includes(data.role)) return null;
  return data;
}

export async function GET(req: NextRequest) {
  const user = await verifyInstructor(req);
  if (!user) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('visitor_profiles')
    .select('id, name, phone, email, created_at')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sort by last name (Hebrew)
  const sorted = (data || []).sort((a, b) => {
    const lastA = a.name?.trim().split(' ').pop() ?? '';
    const lastB = b.name?.trim().split(' ').pop() ?? '';
    return lastA.localeCompare(lastB, 'he');
  });

  return NextResponse.json(sorted);
}
