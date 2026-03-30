import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const sessionId = formData.get('session_id') as string | null;

  if (!file || !sessionId) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
  if (file.size > 1_048_576) return NextResponse.json({ error: 'קובץ גדול מדי (מקסימום 1MB)' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'קובץ חייב להיות תמונה' }, { status: 400 });

  const supabase = createAdminClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `sessions/${sessionId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from('session-photos')
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from('session-photos').getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
