import type { Metadata } from 'next';
import InstructorCard from '@/components/InstructorCard';
import Link from 'next/link';
import { INSTRUCTORS } from '@/data/instructors';
import { createAdminClient } from '@/lib/supabase';
import type { Instructor } from '@/types';

export const metadata: Metadata = {
  title: 'הצוות שלנו – מדריכים מוסמכים',
  description:
    'הכירו את צוות המדריכים המוסמכים של ICING. ' +
    'כולם בעלי הסמכת CWI ועברו קורס הכשרה מקצועי.',
};

async function fetchInstructors(): Promise<Instructor[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    const dbList = (data ?? []).map((r: any) => ({ ...r, id: r.slug || r.id, email: r.email_contact }));
    const dbIds = new Set(dbList.map((i: Instructor) => i.id));
    const staticOnly = INSTRUCTORS.filter(i => !dbIds.has(i.id));
    return [...dbList, ...staticOnly];
  } catch {
    return INSTRUCTORS;
  }
}

export default async function InstructorsPage() {
  const instructors: Instructor[] = await fetchInstructors();

  return (
    <div className="py-16">
      {/* Hero */}
      <div className="bg-navy-900 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white">
            הצוות שלנו
          </h1>
        </div>
      </div>

      {/* Instructors grid */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {instructors.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>

        {/* Certification info */}
        <div className="bg-ice-50 rounded-3xl border-2 border-ice-100 p-8 md:p-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-navy-900 mb-4 text-center">
              🎓 הסמכת CWI Instructor
            </h2>
            <p className="text-slate-600 text-center mb-8 leading-relaxed">
              כל המדריכים שלנו עברו קורס הכשרה ייעודי הכולל תיאוריה רפואית,
              תרגול מעשי, ונבחנו על בטיחות, הדרכה והחומר המדעי בנושא הטבילה במים קרים ונשימות ב־CWI.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '📚', title: 'תיאוריה רפואית', description: 'Cold Shock Response, תרמורגולציה, הורמזיס, פרוטוקולי בטיחות' },
                { icon: '🧊', title: 'תרגול מעשי', description: 'הדרכת קבוצות, ניהול סיכונים, טיפול בחירום' },
                { icon: '✅', title: 'מבחן מסכם', description: 'מבחנים מסכמים וסטאז׳ כדרישה להסמכה' },
              ].map(item => (
                <div key={item.title} className="text-center p-5 bg-white rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-ice-200 text-center flex flex-wrap items-center justify-center gap-3">
              <span className="text-slate-700 text-base font-semibold">רוצה לשמוע פרטים על קורס מדריכי CWI - טבילה במי קרח ונשימה? צור קשר כאן</span>
              <a href="https://wa.me/972524500825" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition-all"
                aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/booking" className="btn-primary text-lg px-10 py-4">
            הזמינו סדנה עם הצוות שלנו
          </Link>
        </div>
      </div>
    </div>
  );
}
