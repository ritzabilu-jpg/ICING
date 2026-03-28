import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  return key === (process.env.ADMIN_KEY ?? 'lior2026') || key === (process.env.ADMIN_CODE ?? '');
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const supabase = createAdminClient();

  const [availRes, instrRes] = await Promise.all([
    supabase.from('instructor_availability').select('*').order('instructor_id'),
    supabase.from('instructors').select('id, name, email_contact, slug'),
  ]);

  const instrMap: Record<string, string> = {};
  for (const i of instrRes.data ?? []) instrMap[i.id] = `${i.name} (${i.email_contact ?? 'no-email'}, slug=${i.slug ?? 'no-slug'})`;

  const rows = (availRes.data ?? []).map(r => ({
    instructor_id: r.instructor_id,
    instructor_name: instrMap[r.instructor_id] ?? '❌ ID לא מוכר בטבלת instructors',
    type: r.type,
    day_of_week: r.day_of_week,
    slot_index: r.slot_index,
    from_time: r.from_time,
    to_time: r.to_time,
  }));

  return NextResponse.json({ rows, total: rows.length }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
