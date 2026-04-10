import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? 'lior2026';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (req.headers.get('x-admin-key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'JSON לא תקין' }, { status: 400 }); }

  const { status, payment_status, payment_method, notes } = body as {
    status?: string;
    payment_status?: string;
    payment_method?: string;
    notes?: string;
  };

  const updates: Record<string, unknown> = {};
  if (status !== undefined)         updates.status = status;
  if (payment_status !== undefined) updates.payment_status = payment_status;
  if (payment_method !== undefined) updates.payment_method = payment_method;
  if (notes !== undefined)          updates.notes = notes;

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: 'אין שדות לעדכון' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', params.id);

  if (error) {
    console.error('admin/bookings PATCH error:', error);
    return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
