import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { INSTRUCTORS } from '@/data/instructors';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return INSTRUCTORS.map(i => ({ id: i.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const instructor = INSTRUCTORS.find(i => i.id === params.id);
  if (!instructor) return {};
  return {
    title: `${instructor.name} | חוויות שוויץ המדע`,
    description: instructor.bio.split('\n')[0],
  };
}

export default function InstructorPage({ params }: Props) {
  const instructor = INSTRUCTORS.find(i => i.id === params.id);
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
            <div className="w-full sm:w-64 flex-shrink-0 bg-gradient-to-b from-navy-900 to-ice-900 relative min-h-[280px]">
              {instructor.photo_url ? (
                <Image
                  src={instructor.photo_url}
                  alt={instructor.name}
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl text-white/20">👤</div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center flex-1">
              <h1 className="text-3xl font-black text-white mb-1">{instructor.name}</h1>
              <p className="text-ice-400 font-semibold mb-6">
                {instructor.female ? 'מדריכה מוסמכת CWI' : 'מדריך מוסמך CWI'}
              </p>

              {/* Specialties */}
              {instructor.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {instructor.specialties.map(s => (
                    <span key={s} className="bg-ice-500/20 text-ice-300 text-sm font-medium px-3 py-1 rounded-full border border-ice-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Certifications */}
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

          {/* Extra content placeholder */}
          <div className="px-8 py-6 border-t border-navy-700 min-h-[80px]">
            {/* מקום לתוכן נוסף בעתיד */}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-navy-900 border-t border-navy-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-4">
              {instructor.phone && (
                <a href={`tel:${instructor.phone}`} className="text-slate-300 hover:text-ice-400 text-sm font-semibold transition-colors">
                  📞 {instructor.phone}
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
