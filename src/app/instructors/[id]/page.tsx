import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { INSTRUCTORS } from '@/data/instructors';
import type { Instructor } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

async function fetchInstructor(slug: string): Promise<Instructor | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://icing-blond.vercel.app';
    const res = await fetch(`${baseUrl}/api/instructors`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const match = data.find((d: Record<string, unknown>) => d.slug === slug || d.id === slug);
        if (match) {
          return {
            id: (match.slug as string) || (match.id as string),
            name: match.name as string,
            photo_url: (match.photo_url as string) || null,
            bio: (match.bio as string) || '',
            specialties: (match.specialties as string[]) || [],
            certifications: (match.certifications as string[]) || [],
            quote: match.quote as string | undefined,
            facebook_url: match.facebook_url as string | undefined,
            phone: match.phone as string | undefined,
            email: match.email_contact as string | undefined,
            female: (match.female as boolean) || false,
          };
        }
      }
    }
  } catch {
    // fall through
  }
  // Fallback to static data
  return INSTRUCTORS.find(i => i.id === slug) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const instructor = await fetchInstructor(params.id);
  if (!instructor) return {};
  return {
    title: `${instructor.name} | חוויות שוויץ המדע`,
    description: instructor.bio.split('\n')[0],
  };
}

export default async function InstructorPage({ params }: Props) {
  const instructor = await fetchInstructor(params.id);
  if (!instructor) notFound();

  return (
    <main className="min-h-screen bg-navy-950 py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link href="/instructors" className="inline-flex items-center gap-2 text-ice-400 hover:text-ice-300 text-sm mb-10 transition-colors">
          → חזרה לצוות
        </Link>

        {/* Card */}
        <div className="bg-navy-800 rounded-3xl overflow-hidden border border-navy-700 shadow-2xl">

          {/* Photo + name header */}
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-72 flex-shrink-0 bg-navy-900 flex items-center justify-center">
              {instructor.photo_url ? (
                <Image
                  src={instructor.photo_url}
                  alt={instructor.name}
                  width={400}
                  height={500}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-8xl text-white/20">👤</div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center flex-1">
              <h1 className="text-3xl font-black text-white mb-1">{instructor.name}</h1>
              <p className="text-ice-400 font-semibold mb-6">
                {instructor.female ? 'מדריכה מוסמכת CWI' : 'מדריך מוסמך CWI'}
              </p>

              {instructor.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {instructor.specialties.map(s => (
                    <span key={s} className="bg-ice-500/20 text-ice-300 text-sm font-medium px-3 py-1 rounded-full border border-ice-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {instructor.certifications?.length > 0 && (
                <div className="flex flex-col gap-1">
                  {instructor.certifications.map(c => (
                    <div key={c} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-green-400">✓</span>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="px-8 py-6 border-t border-navy-700">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
              {instructor.bio}
            </p>
          </div>

          {/* Quote */}
          {instructor.quote && (
            <div className="px-8 py-6 border-t border-navy-700">
              <blockquote className="text-ice-300 text-lg italic border-r-4 border-ice-500 pr-5 leading-relaxed">
                &ldquo;{instructor.quote}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-5 bg-navy-900 border-t border-navy-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              {instructor.phone && (
                <a href={`tel:${instructor.phone}`} className="text-slate-300 hover:text-ice-400 text-sm font-semibold transition-colors">
                  📞 {instructor.phone}
                </a>
              )}
              {instructor.email && (
                <a href={`mailto:${instructor.email}`} className="text-slate-300 hover:text-ice-400 text-sm font-semibold transition-colors">
                  ✉️ {instructor.email}
                </a>
              )}
              {instructor.facebook_url && (
                <a href={instructor.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                  📘 פייסבוק
                </a>
              )}
            </div>
            <Link
              href={`/booking?instructorId=${instructor.id}`}
              className="bg-ice-500 hover:bg-ice-400 text-navy-900 font-black py-2.5 px-8 rounded-xl text-sm transition-all"
            >
              הזמן סדנה עם {instructor.name.split(' ')[0]}
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
