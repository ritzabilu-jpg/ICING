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

// ספציפי לפי שם מדריך
const INSTRUCTOR_COLOR_BY_NAME: Record<string, string> = {
  'גיא רייבנבך':   '#FBBF24', // צהוב
  'איתמר מאיירס':  '#F472B6', // ורוד
  'ליאור כ"ץ':     '#38BDF8', // תכלת
  'אורן אלון':     '#A16207', // חום
  'גולן בר נוי':   '#6B7280', // אפור
};

function checkAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  return key === (process.env.ADMIN_KEY ?? 'lior2026') || key === (process.env.ADMIN_CODE ?? '');
}

// POST is never CDN-cached — use this from the admin dashboard
export async function POST(req: NextRequest) {
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

  // Build lookup maps O(n) instead of repeated O(n×m) filters
  const slotsByInstructor: Record<string, typeof slotsRes.data> = {};
  const blockedByInstructor: Record<string, typeof blockedRes.data> = {};
  for (const s of slotsRes.data ?? []) {
    (slotsByInstructor[s.instructor_id] ??= []).push(s);
  }
  for (const b of blockedRes.data ?? []) {
    (blockedByInstructor[b.instructor_id] ??= []).push(b);
  }

  const result = instructors.map((inst, idx) => ({
    id: inst.id,
    name: inst.name,
    color: INSTRUCTOR_COLOR_BY_NAME[inst.name] ?? INSTRUCTOR_COLORS[idx % INSTRUCTOR_COLORS.length],
    slots: slotsByInstructor[inst.id] ?? [],
    blocked: blockedByInstructor[inst.id] ?? [],
  }));

  return NextResponse.json({ instructors: result }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
