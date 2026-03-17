import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase';
import InstructorCard from '@/components/InstructorCard';
import type { Instructor } from '@/types';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'הצוות שלנו – מדריכים מוסמכים',
  description:
    'הכירו את צוות המדריכים המוסמכים של חוויות שוויץ המדע. ' +
    'כולם בעלי הסמכת CWI ועברו קורס הכשרה מקצועי.',
};

// Static fallback instructors when Supabase is not configured
const DEMO_INSTRUCTORS: Instructor[] = [
  {
    id: '1',
    name: 'יוסי כהן',
    photo_url: null,
    bio: 'מדריך אימון קר מוסמך עם 5 שנות ניסיון בשיטת Cold Water Immersion. מתמחה בליווי ספורטאים ואנשי עסקים לשיפור ביצועים.',
    specialties: ['אימון קר', 'טכניקות נשימה', 'ביצועי שיא'],
    certifications: ['CWI Instructor Level 2', 'מאמן כושר מוסמך'],
    quote: 'הקור הוא המאמן הכנה ביותר שתמצא. הוא לא משקר.',
  },
  {
    id: '2',
    name: 'מירה לוי',
    photo_url: null,
    bio: 'פיזיותרפיסטית וחוקרת השפעות הקור על מערכת העצבים. מביאה גישה מדעית ומבוססת מחקר לכל סדנה.',
    specialties: ['פיזיותרפיה', 'שיקום', 'מדע הקור'],
    certifications: ['פיזיותרפיה B.Sc.', 'CWI Instructor Certified'],
    quote: 'כאשר הגוף מתמודד עם אי-נוחות בצורה מבוקרת, הנפש מתחזקת.',
  },
  {
    id: '3',
    name: 'ליאור כ"ץ',
    photo_url: '/lior-katz.jpg',
    bio: 'פיזיותרפיסט מ-2001, גיטריסט ומדריך קורס מדריכי טבילה במי קרח. מנחה תהליכי התפתחות יכולת אישית דרך הטבילה.',
    specialties: ['גיבוש צוותים', 'הדרכת חוסן מנטלי', 'קורס מדריכים'],
    certifications: ['CWI Group Instructor', 'קורס מנחה קבוצות'],
    quote: 'אנחנו נבנים מחוץ לאיזור הנוחות. כאן במי הקרח, זה המקום האידיאלי בשביל זה.',
  },
  {
    id: '4',
    name: 'גיא רייבנבך',
    photo_url: '/guy-ravnbach.jpg',
    bio: 'בעל תואר ראשון בחינוך גופני, מדריך קארטה בעל ניסיון עם טכניקות נשימה, הרפיה, מדיטציה וצ׳י קונג. מעביר את הסדנאות בעברית ואנגלית לפי העדפה.',
    specialties: ['טכניקות נשימה', 'מדיטציה', 'צ׳י קונג'],
    certifications: ['תואר ראשון חינוך גופני', 'CWI Instructor Certified'],
    quote: 'במפגש עם הקור אנו לומדים לא להילחם, אלא להרפות — ומתוך ההרפיה נוצר כוח שקט שעוזר לנו להתמודד עם אתגרי החיים.',
    facebook_url: 'https://www.facebook.com/share/1KpjfpeyKV/',
    phone: '052-8761110',
  },
];

export default async function InstructorsPage() {
  let instructors: Instructor[] = DEMO_INSTRUCTORS;

  // Try to load from Supabase if configured
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT')) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        instructors = data as Instructor[];
      }
    }
  } catch {
    // Fall back to demo data silently
  }

  return (
    <div className="py-16">
      {/* Hero */}
      <div className="bg-navy-900 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            הצוות שלנו
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            מדריכים מוסמכים שעברו קורס הכשרה מקצועי בן יום מלא, כולל תיאוריה,
            מעשי ומבחן מסכם בנושאי בטיחות קריטיים
          </p>
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
              תרגול מעשי, ומבחן מסכם עם צ&apos;ק-ליסט בטיחות קריטי.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: '📚',
                  title: 'תיאוריה רפואית',
                  description: 'Cold Shock Response, תרמורגולציה, הורמזיס, פרוטוקולי בטיחות',
                },
                {
                  icon: '🧊',
                  title: 'תרגול מעשי',
                  description: 'הדרכת קבוצות, ניהול סיכונים, טיפול בחירום',
                },
                {
                  icon: '✅',
                  title: 'מבחן מסכם',
                  description: 'תיאורטי + צ\'ק-ליסט מעשי עם דגש על בטיחות',
                },
              ].map(item => (
                <div key={item.title} className="text-center p-5 bg-white rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              ))}
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
