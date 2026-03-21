// immersion-bookings – POST to book an immersion slot
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { slot_id, name, phone, package_type } = await req.json() as {
      slot_id?: string; name?: string; phone?: string; package_type?: string;
    };

    if (!slot_id || !name?.trim() || !phone?.trim() || !package_type) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check slot capacity
    const { data: slot } = await supabase
      .from('immersion_slots')
      .select('max_participants')
      .eq('id', slot_id)
      .single();

    if (!slot) return NextResponse.json({ error: 'מועד לא נמצא' }, { status: 404 });

    const { count } = await supabase
      .from('immersion_bookings')
      .select('*', { count: 'exact', head: true })
      .eq('slot_id', slot_id);

    if ((count ?? 0) >= slot.max_participants) {
      return NextResponse.json({ error: 'המועד מלא' }, { status: 409 });
    }

    const { error } = await supabase.from('immersion_bookings').insert({
      slot_id,
      visitor_name: name.trim(),
      visitor_phone: phone.trim(),
      package_type,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
