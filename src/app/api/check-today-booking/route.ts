// check-today-booking – checks if a visitor (by name) has a booking for today,
// check-today-booking – checks if a visitor (by name) has a booking for today,
// and whether they already submitted a health check.
// and whether they already submitted a health check.
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name      = searchParams.get('name')?.trim();
  const visitorId = searchParams.get('visitor_id');

  if (!name) return NextResponse.json({ hasBookingToday: false, healthCheckFilled: false });

  // Format today to match lior_bookings slot_date  e.g. "19.3.2026"
  const now = new Date();
  const todayFormatted = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  const todayISO       = now.toISOString().split('T')[0]; // for health_checks table

  const supabase = createAdminClient();

  // Does this name have a lior_booking for today?
  const { data: booking } = await supabase
    .from('lior_bookings')
    .select('id')
    .eq('slot_date', todayFormatted)
    .ilike('name', name)
    .maybeSingle();

  const hasBookingToday = !!booking;
  if (!hasBookingToday) return NextResponse.json({ hasBookingToday: false, healthCheckFilled: false });

  // Has the visitor already filled the health check today?
  let healthCheckFilled = false;
  if (visitorId) {
    const { data: hc } = await supabase
      .from('daily_health_checks')
      .select('id')
      .eq('visitor_id', visitorId)
      .eq('check_date', todayISO)
      .maybeSingle();
    healthCheckFilled = !!hc;
  }

  return NextResponse.json({ hasBookingToday, healthCheckFilled });
}
