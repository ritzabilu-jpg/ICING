import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('id')
    .eq('status', 'new');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads?.length) return NextResponse.json({ processed: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  let processed = 0;

  for (const lead of leads) {
    try {
      await fetch(`${baseUrl}/api/agent/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ lead_id: lead.id }),
      });
      processed++;
    } catch (e) {
      console.error(`Failed to classify lead ${lead.id}:`, e);
    }
  }

  return NextResponse.json({ processed });
}
