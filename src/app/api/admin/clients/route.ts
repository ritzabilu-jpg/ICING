import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const PKG_LABELS: Record<string, string> = {
  single: 'טבילה בודדת', '5pack': 'חבילת 5', '10pack': 'חבילת 10',
};
const WORKSHOP_LABELS: Record<string, string> = {
  individual: 'סדנת יחידים', couple: 'סדנת זוגות',
  team: 'סדנת קבוצות', 'one-on-one': 'אחד על אחד',
};

export interface ClientEntry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  type: string;
  date: string;
  time: string;
  source: 'lior' | 'immersion' | 'workshop';
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') ?? '';
  const validKey = process.env.ADMIN_KEY ?? 'lior2026';
  if (key !== validKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const clients: ClientEntry[] = [];

  // ── Lior workshop bookings ──────────────────────────────────────────────────
  try {
    const { data } = await supabase
      .from('lior_bookings')
      .select('*')
      .order('created_at', { ascending: false });
    for (const b of (data ?? [])) {
      clients.push({
        id: b.id,
        name: b.name,
        phone: b.phone,
        email: null,
        city: null,
        type: 'סדנת ליאור כ"ץ',
        date: b.slot_date ?? '',
        time: b.time_slot ?? '',
        source: 'lior',
      });
    }
  } catch { /* table may not exist yet */ }

  // ── Immersion bookings ──────────────────────────────────────────────────────
  try {
    const { data } = await supabase
      .from('immersion_bookings')
      .select('*, immersion_slots(slot_date, slot_time)')
      .order('created_at', { ascending: false });
    for (const b of (data ?? [])) {
      clients.push({
        id: b.id,
        name: b.visitor_name,
        phone: b.visitor_phone ?? '',
        email: null,
        city: null,
        type: PKG_LABELS[b.package_type] ?? 'טבילה',
        date: (b as { immersion_slots?: { slot_date?: string } }).immersion_slots?.slot_date ?? '',
        time: (b as { immersion_slots?: { slot_time?: string } }).immersion_slots?.slot_time?.slice(0,5) ?? '',
        source: 'immersion',
      });
    }
  } catch { /* table may not exist yet */ }

  // ── Workshop bookings ───────────────────────────────────────────────────────
  try {
    const { data } = await supabase
      .from('bookings')
      .select('*, workshops(type, date_time)')
      .order('created_at', { ascending: false });
    for (const b of (data ?? [])) {
      const dt = (b as { workshops?: { date_time?: string } }).workshops?.date_time ?? '';
      clients.push({
        id: b.id,
        name: b.user_name,
        phone: b.phone ?? '',
        email: b.email ?? null,
        city: null,
        type: WORKSHOP_LABELS[(b as { workshops?: { type?: string } }).workshops?.type ?? ''] ?? 'סדנה',
        date: dt.split('T')[0] ?? '',
        time: dt.split('T')[1]?.slice(0,5) ?? '',
        source: 'workshop',
      });
    }
  } catch { /* table may not exist yet */ }

  return NextResponse.json({ clients }, { headers: { 'Cache-Control': 'no-store' } });
}
