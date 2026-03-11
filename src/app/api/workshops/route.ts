import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month'); // format: "2025-03"
  const type = searchParams.get('type');
  const instructorId = searchParams.get('instructorId');

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from('workshops')
      .select('*, instructor:instructors(id, name, photo_url, specialties)')
      .eq('is_active', true)
      .order('date_time', { ascending: true });

    if (month) {
      // Get the first and last day of the given month
      const [year, monthNum] = month.split('-').map(Number);
      const firstDay = new Date(year, monthNum - 1, 1).toISOString();
      const lastDay = new Date(year, monthNum, 0, 23, 59, 59).toISOString();
      query = query.gte('date_time', firstDay).lte('date_time', lastDay);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (instructorId) {
      query = query.eq('instructor_id', instructorId);
    }

    // Only show upcoming workshops
    query = query.gte('date_time', new Date().toISOString());

    const { data, error } = await query;

    if (error) {
      console.error('Workshops API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('Workshops API exception:', err);
    return NextResponse.json({ error: 'שגיאה בטעינת הסדנאות' }, { status: 500 });
  }
}
