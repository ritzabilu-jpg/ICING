import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const sessionId = formData.get('session_id') as string | null;
  const slot = (formData.get('slot') as string | null) ?? '1'; // '1' or '2'

  if (!file || !sessionId) return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
  if (file.size > 1_048_576) return NextResponse.json({ error: 'קובץ גדול מדי (מקסימום 1MB)' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'קובץ חייב להיות תמונה' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `sessions/${sessionId}${slot === '2' ? '_2' : ''}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true, resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve(result as { secure_url: string });
      }
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
