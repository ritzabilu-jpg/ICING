import { NextRequest, NextResponse } from 'next/server';
import { getSlotOccupancy, addBookingToSheet, LIOR_TIME_SLOTS } from '@/lib/googleSheets';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const MAX_PARTICIPANTS = 10;

// GET /api/lior-slots — returns availability of all 3 time slots
export async function GET() {
  // Primary source: Supabase (fast + reliable)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT')) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from('lior_bookings')
        .select('time_slot');

      if (data) {
        const counts: Record<string, number> = {};
        for (const row of data) counts[row.time_slot] = (counts[row.time_slot] ?? 0) + 1;

        const slots = LIOR_TIME_SLOTS.map(s => ({
          label: s.label,
          date: s.date,
          count: counts[s.label] ?? 0,
          full: (counts[s.label] ?? 0) >= MAX_PARTICIPANTS,
        }));
        return NextResponse.json({ slots });
      }
    }
  } catch {
    // fall through to Google Sheets fallback
  }

  // Fallback: Google Sheets
  const slots = await getSlotOccupancy();
  return NextResponse.json({ slots });
}

// POST /api/lior-slots — books a slot (name + phone + timeLabel)
export async function POST(req: NextRequest) {
  try {
    const { name, phone, timeLabel } = await req.json() as {
      name?: string;
      phone?: string;
      timeLabel?: string;
    };

    if (!name?.trim() || !phone?.trim() || !timeLabel?.trim()) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // Check slot availability from Supabase
    let currentCount = 0;
    let supabaseOk = false;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT')) {
        const supabase = createAdminClient();
        const { count } = await supabase
          .from('lior_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('time_slot', timeLabel);

        currentCount = count ?? 0;
        supabaseOk = true;
      }
    } catch {
      // fall through
    }

    if (currentCount >= MAX_PARTICIPANTS) {
      return NextResponse.json({ error: 'המועד מלא' }, { status: 409 });
    }

    // Save to Supabase
    if (supabaseOk) {
      try {
        const supabase = createAdminClient();
        const { error } = await supabase.from('lior_bookings').insert({
          time_slot: timeLabel,
          slot_date: '19.3.2026',
          name: trimmedName,
          phone: trimmedPhone,
        });
        if (error) {
          console.error('Supabase insert error:', error);
          return NextResponse.json({ error: 'שגיאה בשמירת ההרשמה' }, { status: 500 });
        }
      } catch (e) {
        console.error('Supabase error:', e);
        return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
      }
    }

    // Also sync to Google Sheets (best-effort, non-blocking)
    addBookingToSheet(timeLabel, trimmedName, trimmedPhone).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
