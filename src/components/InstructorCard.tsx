import Image from 'next/image';
import Link from 'next/link';
import type { Instructor } from '@/types';

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-ice-100 overflow-hidden
                    hover:shadow-2xl hover:border-ice-300 transition-all duration-300 hover:-translate-y-1">
      <div className="flex gap-0">
        {/* Photo */}
        <div className="w-36 sm:w-44 flex-shrink-0 bg-gradient-to-b from-navy-900 to-ice-800
                        relative overflow-hidden">
          {instructor.photo_url ? (
            <Image
              src={instructor.photo_url}
              alt={instructor.name}
              width={176}
              height={220}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-white/30">
              👤
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-black text-navy-900 mb-0.5">{instructor.name}</h3>
            <p className="text-ice-600 text-sm font-semibold">מדריך מוסמך CWI</p>
          </div>

          {instructor.bio && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {instructor.bio}
            </p>
          )}

          {/* Specialties */}
          {instructor.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {instructor.specialties.slice(0, 3).map(s => (
                <span key={s} className="bg-ice-50 text-ice-700 text-xs font-medium
                                         px-2.5 py-1 rounded-full border border-ice-200">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Certifications */}
          {instructor.certifications?.length > 0 && (
            <div className="mt-auto">
              {instructor.certifications.slice(0, 2).map(c => (
                <div key={c} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="text-green-500">✓</span>
                  {c}
                </div>
              ))}
            </div>
          )}

          {instructor.quote && (
            <blockquote className="mt-3 text-slate-400 text-xs italic border-r-2 border-ice-300 pr-3">
              &ldquo;{instructor.quote}&rdquo;
            </blockquote>
          )}
        </div>
      </div>

      {/* Footer: contact + book */}
      <div className="px-6 py-4 bg-ice-50 border-t border-ice-100 flex flex-col gap-2">
        {/* Phone / Facebook */}
        <div className="flex gap-3 flex-wrap">
          {instructor.phone && (
            <a href={`tel:${instructor.phone}`}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-ice-700 font-semibold">
              📞 {instructor.phone}
            </a>
          )}
          {instructor.facebook_url && (
            <a href={instructor.facebook_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold">
              📘 פייסבוק
            </a>
          )}
        </div>
        <Link
          href={`/booking?instructorId=${instructor.id}`}
          className="w-full text-center block bg-navy-900 hover:bg-navy-800
                     text-white font-bold py-2.5 rounded-xl text-sm transition-all"
        >
          הזמן סדנה עם {instructor.name.split(' ')[0]}
        </Link>
      </div>
    </div>
  );
}
