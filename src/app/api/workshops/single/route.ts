import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/workshops/single?id=UUID
// Returns { workshop } with instructor join — uses anon client (public data)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'נדרש מזהה סדנה' }, { status: 400 });
  }

  const { data: workshop, error } = await supabaseClient
    .from('workshops')
    .select('id, type, title, date_time, capacity, seats_taken, price, description, instructor:instructors(id, name, photo_url)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !workshop) {
    return NextResponse.json({ error: 'סדנה לא נמצאה' }, { status: 404 });
  }

  return NextResponse.json({ workshop });
}
