import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  return key === (process.env.ADMIN_KEY ?? 'lior2026') || key === (process.env.ADMIN_CODE ?? '');
}

function isBlocked(dateStr: string, blocked: { from_date: string; to_date: string }[]) {
  return blocked.some(b => dateStr >= b.from_date && dateStr <= b.to_date);
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
}

export interface ProposedSlot {
  key: string;
  date: string;
  time: string;
  from_time: string;
  to_time: string;
  instructor_id: string;
  type: 'immersion' | 'workshop';
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });

  const { instructor_id, from_date, to_date, type } = await req.json() as {
    instructor_id: string;
    from_date: string;
    to_date: string;
    type: 'immersion' | 'workshop';
  };

  if (!instructor_id || !from_date || !to_date || !type) {
    return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const [slotsRes, blockedRes] = await Promise.all([
    supabase.from('instructor_availability')
      .select('*')
      .eq('instructor_id', instructor_id)
      .eq('type', type),
    supabase.from('instructor_blocked_dates')
      .select('*')
      .eq('instructor_id', instructor_id),
  ]);

  const availSlots = slotsRes.data ?? [];
  const blocked = blockedRes.data ?? [];

  const proposed: ProposedSlot[] = [];

  const cursor = new Date(from_date + 'T00:00:00');
  const endDate = new Date(to_date + 'T00:00:00');

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split('T')[0];
    // JS getDay(): 0=Sunday ... 6=Saturday  == our day_of_week mapping
    const dow = cursor.getDay();

    if (!isBlocked(dateStr, blocked)) {
      const daySlots = availSlots.filter(s => s.day_of_week === dow && s.from_time && s.to_time);

      for (const slot of daySlots) {
        const [fh, fm] = slot.from_time.split(':').map(Number);
        const [th, tm] = slot.to_time.split(':').map(Number);
        const fromMin = fh * 60 + fm;
        const toMin = th * 60 + tm;

        if (type === 'immersion') {
          // Generate 10-minute intervals
          for (let m = fromMin; m <= toMin; m += 10) {
            const timeStr = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
            proposed.push({
              key: `${dateStr}_${timeStr}`,
              date: dateStr,
              time: timeStr,
              from_time: slot.from_time,
              to_time: slot.to_time,
              instructor_id,
              type,
            });
          }
        } else {
          // Workshop: single entry per availability window
          proposed.push({
            key: `${dateStr}_${slot.slot_index}_${slot.from_time}`,
            date: dateStr,
            time: slot.from_time,
            from_time: slot.from_time,
            to_time: slot.to_time,
            instructor_id,
            type,
          });
        }
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  if (proposed.length > 1000) {
    return NextResponse.json({ error: 'טווח גדול מדי — מקסימום 1000 מועדים בפעם אחת' }, { status: 400 });
  }

  return NextResponse.json({ proposed, count: proposed.length });
}
