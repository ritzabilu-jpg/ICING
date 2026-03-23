import { createAdminClient } from '@/lib/supabase';
import ReviewForm from './ReviewForm';

const hardcoded = [
  {
    name: 'מיכאל ל.',
    role: 'מנהל מכירות',
    text: 'חוויה שלא אשכח. הנשימה המנחה עזרה לי להישאר רגוע בתוך המים. יצאתי עם תחושת הישג וביטחון עצמי שלא הרגשתי כבר שנים.',
    rating: 5,
    type: 'individual',
  },
  {
    name: 'שירה ודוד מ.',
    role: 'זוג מרחובות',
    text: 'הגענו כזוג ויצאנו הרבה יותר מחוברים. הניסיון המשותף להתגבר על הקור ביחד – מחזק את הקשר בצורה לא רגילה.',
    rating: 5,
    type: 'couple',
  },
  {
    name: 'ענת ש.',
    role: 'מנהלת משאבי אנוש',
    text: 'הבאתי את הצוות שלי לסדנה ולא האמנתי כמה היא שינתה את הדינמיקה. אנשים שחששו בהתחלה יצאו עם הישגים אישיים שהם מספרים עליהם גם חודשים אחרי.',
    rating: 5,
    type: 'team',
  },
  {
    name: 'אורי כ.',
    role: 'ספורטאי חובב',
    text: 'המדריכים פשוט מדהימים – מקצועיים, תומכים ויודעים בדיוק מתי לדחוף ומתי לתת מרחב. הרמה המדעית של ההסבר הפתיע אותי לטובה.',
    rating: 5,
    type: 'individual',
  },
  {
    name: 'נועה ר.',
    role: 'עובדת הייטק',
    text: 'בהתחלה הייתי פחדנית מאוד, אבל תרגול הנשימה לפני הטבילה שינה הכל. יצאתי עם כלים אמיתיים לניהול לחץ – משהו שאני מרגישה בכל יום.',
    rating: 5,
    type: 'individual',
  },
  {
    name: 'גיל ב.',
    role: 'מאמן כושר',
    text: 'פרוטוקול הטבילה מבוסס מדע אמיתי. הסברים על נוראדרנלין, HPA, ותגובת הקור – בדיוק מה שציפיתי ממרכז מקצועי.',
    rating: 5,
    type: 'individual',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">★</span>
      ))}
    </div>
  );
}

const typeLabel: Record<string, string> = {
  individual: 'סדנת יחידים',
  couple: 'סדנת זוגות',
  team: 'סדנת קבוצות',
  immersion: 'טבילה אישית',
};

type Review = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  type: string;
};

async function getApprovedReviews(): Promise<Review[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('reviews')
      .select('id, name, role, text, rating, type')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function TestimonialsSection() {
  const approved = await getApprovedReviews();
  const all = [
    ...approved.map(r => ({ ...r, role: r.role ?? '' })),
    ...hardcoded,
  ];

  return (
    <section id="testimonials" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center text-white mb-4">
          מה אומרים המשתתפים?
        </h2>
        <p className="text-xl text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          מאות משתתפים שינו את הדרך שבה הם מתמודדים עם אתגרים
        </p>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((t, i) => (
            <div
              key={i}
              className="bg-navy-800 rounded-2xl p-6 border border-navy-700
                         hover:border-ice-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <StarRating count={t.rating} />
                <span className="text-xs bg-ice-500/20 text-ice-400 px-3 py-1 rounded-full font-medium">
                  {typeLabel[t.type] ?? t.type}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ice-500/30 rounded-full flex items-center justify-center
                                text-ice-400 font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  {t.role && <p className="text-slate-500 text-xs">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '98%', label: 'שביעות רצון' },
            { value: '500+', label: 'משתתפים' },
            { value: '4.9/5', label: 'דירוג ממוצע' },
            { value: '85%', label: 'חוזרים לסדנה' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-ice-400 mb-1">{s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Review submission form */}
        <ReviewForm />
      </div>
    </section>
  );
}
