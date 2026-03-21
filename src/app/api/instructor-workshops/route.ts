import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const instructor = req.nextUrl.searchParams.get('instructor');
  if (!instructor) return NextResponse.json({ error: 'חסר שם מדריך' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('instructor_workshops')
    .select('*')
    .eq('instructor_name', instructor)
    .order('workshop_date', { ascending: true })
    .order('workshop_time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const instructor = req.nextUrl.searchParams.get('instructor');
  if (!id || !instructor) return NextResponse.json({ error: 'חסרים פרמטרים' }, { status: 400 });

  const body = await req.json();
  const { status } = body;
  if (!['accepted', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'סטטוס לא תקין' }, { status: 400 });
  }

  const supabase = createAdminClient();
  // Verify this workshop belongs to this instructor before updating
  const { data: existing } = await supabase
    .from('instructor_workshops')
    .select('id, instructor_name')
    .eq('id', id)
    .eq('instructor_name', instructor)
    .single();

  if (!existing) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });

  const { data, error } = await supabase
    .from('instructor_workshops')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
