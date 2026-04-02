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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month'); // "2025-03"
  const type = searchParams.get('type') ?? 'individual';

  try {
    const supabase = createAdminClient();
    const todayStr = new Date().toISOString().split('T')[0];

    let query = supabase
      .from('instructor_workshops')
      .select('*')
      .neq('status', 'declined')
      .gte('workshop_date', todayStr)
      .order('workshop_date', { ascending: true })
      .order('workshop_time', { ascending: true });

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const firstDay = `${year}-${String(monthNum).padStart(2, '0')}-01`;
      const lastDayDate = new Date(year, monthNum, 0);
      const lastDay = `${year}-${String(monthNum).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;
      query = query.gte('workshop_date', firstDay).lte('workshop_date', lastDay);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Workshops API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const price = PRICES[type] ?? 300;
    const typeLabel = TYPE_LABELS[type] ?? '';

    const workshops = (data ?? []).map(row => ({
      id: row.id,
      type,
      title: `סדנת ${typeLabel}`,
      date_time: `${row.workshop_date}T${row.workshop_time}`,
      capacity: row.max_participants || 10,
      seats_taken: 0,
      price,
      instructor_id: null,
      description: row.notes || '',
      is_active: true,
      instructor: row.instructor_name
        ? { id: row.id, name: row.instructor_name, photo_url: null, bio: '', specialties: [], certifications: [] }
        : undefined,
    }));

    return NextResponse.json(workshops);
  } catch (err) {
    console.error('Workshops API exception:', err);
    return NextResponse.json({ error: 'שגיאה בטעינת הסדנאות' }, { status: 500 });
  }
}
