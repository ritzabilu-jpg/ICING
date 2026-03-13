import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabaseClient } from '@/lib/supabase';

// GET /api/subscriptions?userId=xxx
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: userData } = await supabaseClient.auth.getUser(token);
  if (!userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();

  // Allow self or instructor/admin
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  const isAllowed =
    userData.user.id === userId ||
    ['instructor', 'admin'].includes(profile?.role ?? '');

  if (!isAllowed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await admin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscriptions: data ?? [] });
}

// POST /api/subscriptions — admin only: add subscription to user
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: userData } = await supabaseClient.auth.getUser(token);
  if (!userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (!['admin'].includes(profile?.role ?? '')) {
    return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
  }

  const body = await req.json() as {
    userId: string;
    planName: string;
    sessionsTotal: number;
    validUntil?: string;
  };

  const { error } = await admin.from('subscriptions').insert({
    user_id: body.userId,
    plan_name: body.planName,
    sessions_total: body.sessionsTotal,
    sessions_used: 0,
    valid_until: body.validUntil ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
