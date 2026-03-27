import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getInstructorId(visitorId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('visitor_profiles').select('email, role').eq('id', visitorId).maybeSingle();
  if (!profile || !['instructor', 'admin'].includes(profile.role)) return null;
  const { data: inst } = await supabase
    .from('instructors').select('id').eq('email_contact', profile.email).maybeSingle();
  return inst?.id ?? null;
}

export async function POST(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = await getInstructorId(visitorId);
  if (!instructorId) return NextResponse.json({ error: 'פרופיל מדריך לא נמצא' }, { status: 403 });

  const { from_date, to_date, reason } = await req.json();
  if (!from_date || !to_date) return NextResponse.json({ error: 'תאריכים חסרים' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_blocked_dates')
    .insert({ instructor_id: instructorId, from_date, to_date, reason: reason ?? '' })
    .select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const visitorId = req.headers.get('x-visitor-id') ?? '';
  if (!visitorId) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  const instructorId = await getInstructorId(visitorId);
  if (!instructorId) return NextResponse.json({ error: 'פרופיל מדריך לא נמצא' }, { status: 403 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'חסר id' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('instructor_blocked_dates')
    .delete().eq('id', id).eq('instructor_id', instructorId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
