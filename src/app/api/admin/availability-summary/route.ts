import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const INSTRUCTOR_COLORS = [
  '#3B82F6', // כחול
  '#10B981', // ירוק
  '#8B5CF6', // סגול
  '#F59E0B', // כתום
  '#EF4444', // אדום
  '#14B8A6', // טורקיז
];

function checkAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  return key === (process.env.ADMIN_KEY ?? 'lior2026') || key === (process.env.ADMIN_CODE ?? '');
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const supabase = createAdminClient();

  const { data: instructors, error: iErr } = await supabase
    .from('instructors')
    .select('id, name')
    .order('name');

  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 });
  if (!instructors || instructors.length === 0) return NextResponse.json({ instructors: [] });

  const instructorIds = instructors.map(i => i.id);

  const [slotsRes, blockedRes] = await Promise.all([
    supabase.from('instructor_availability').select('*').in('instructor_id', instructorIds),
    supabase.from('instructor_blocked_dates').select('*').in('instructor_id', instructorIds).order('from_date'),
  ]);

  const allSlots = slotsRes.data ?? [];
  const allBlocked = blockedRes.data ?? [];

  const result = instructors.map((inst, idx) => ({
    id: inst.id,
    name: inst.name,
    color: INSTRUCTOR_COLORS[idx % INSTRUCTOR_COLORS.length],
    slots: allSlots.filter(s => s.instructor_id === inst.id),
    blocked: allBlocked.filter(b => b.instructor_id === inst.id),
  }));

  return NextResponse.json({ instructors: result });
}
