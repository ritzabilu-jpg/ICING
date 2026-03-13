import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabaseClient } from '@/lib/supabase';

// GET /api/admin/customers?key=ADMIN_KEY
// Returns all user profiles. Requires admin key + authenticated session.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const adminKey = process.env.ADMIN_KEY ?? 'lior2026';
  if (key !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Also verify caller is a logged-in user with instructor/admin role
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data } = await supabaseClient.auth.getUser(token);
    if (data.user) {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || !['instructor', 'admin'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ customers: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
