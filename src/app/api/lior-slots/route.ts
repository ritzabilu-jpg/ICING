import { NextRequest, NextResponse } from 'next/server';
import { getSlotOccupancy, addBookingToSheet } from '@/lib/googleSheets';

// GET /api/lior-slots — returns availability of all 3 time slots
export async function GET() {
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

    // Re-check slot availability before writing
    const slots = await getSlotOccupancy();
    const slot = slots.find(s => s.label === timeLabel);
    if (!slot) {
      return NextResponse.json({ error: 'מועד לא תקין' }, { status: 400 });
    }
    if (slot.full) {
      return NextResponse.json({ error: 'המועד מלא' }, { status: 409 });
    }

    const result = await addBookingToSheet(timeLabel, name.trim(), phone.trim());

    if (!result.sheetsConfigured) {
      // Sheets not set up yet — still treat as success so UX works
      console.warn('Google Sheets not configured. Booking not persisted to sheet.');
      return NextResponse.json({ success: true, warning: 'הגיליון לא מוגדר — ההזמנה לא נשמרה בגיליון' });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
