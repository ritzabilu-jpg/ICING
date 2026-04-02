import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/immersion-slots/single?id=UUID
// Returns { slot } — uses anon client (public data)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'נדרש מזהה חלון טבילה' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: slot, error } = await supabase
    .from('immersion_slots')
    .select('id, slot_date, slot_time, max_participants, notes')
    .eq('id', id)
    .single();

  if (error || !slot) {
    return NextResponse.json({ error: 'חלון טבילה לא נמצא' }, { status: 404 });
  }

  return NextResponse.json({ slot });
}
