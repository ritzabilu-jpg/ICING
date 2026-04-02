import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const PRICES: Record<string, number> = {
  individual: 300,
  couple: 800,
  'one-on-one': 550,
  team: 0,
};

const TYPE_LABELS: Record<string, string> = {
  individual: 'יחידים',
  couple: 'זוגות',
  team: 'קבוצות מאורגנות',
  'one-on-one': 'אחד על אחד',
};

// GET /api/workshops/single?id=UUID&type=individual
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') ?? 'individual';

  if (!id) {
    return NextResponse.json({ error: 'נדרש מזהה סדנה' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from('instructor_workshops')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: 'סדנה לא נמצאה' }, { status: 404 });
  }

  const typeLabel = TYPE_LABELS[type] ?? '';
  const workshop = {
    id: row.id,
    type,
    title: `סדנת ${typeLabel}`,
    date_time: `${row.workshop_date}T${row.workshop_time}`,
    capacity: row.max_participants || 10,
    seats_taken: 0,
    price: PRICES[type] ?? 300,
    instructor_id: null,
    description: row.notes || '',
    is_active: true,
    instructor: row.instructor_name
      ? { id: row.id, name: row.instructor_name, photo_url: null, bio: '', specialties: [], certifications: [] }
      : undefined,
  };

  return NextResponse.json({ workshop });
}
