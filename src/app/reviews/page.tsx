import { createAdminClient } from '@/lib/supabase';
import type { Metadata } from 'next';
import ReviewForm from '@/components/ReviewForm';

export const metadata: Metadata = {
  title: 'חוות דעת | חוויות שוויץ המדע',
  description: 'מה אומרים המשתתפים על חוויות הטבילה בקרח שלנו',
};

export const revalidate = 60;

const typeLabel: Record<string, string> = {
  individual: 'סדנת יחידים',
  couple: 'סדנת זוגות',
  team: 'סדנת קבוצות',
  immersion: 'טבילה אישית',
};

const hardcoded = [
  { id: 'h1', name: 'מיכאל ל.', role: 'מנהל מכירות', text: 'חוויה שלא אשכח. הנשימה המנחה עזרה לי להישאר רגוע בתוך המים. יצאתי עם תחושת הישג וביטחון עצמי שלא הרגשתי כבר שנים.', rating: 5, type: 'individual' },
  { id: 'h2', name: 'שירה ודוד מ.', role: 'זוג מרחובות', text: 'הגענו כזוג ויצאנו הרבה יותר מחוברים. הניסיון המשותף לנגוס ולהתגבר על הקור ביחד – מחזק את הקשר בצורה לא רגילה.', rating: 5, type: 'couple' },
  { id: 'h3', name: 'ענת ש.', role: 'מנהלת משאבי אנוש', text: 'הבאתי את הצוות שלי לסדנה ולא האמנתי כמה היא שינתה את הדינמיקה. אנשים שחששו בהתחלה יצאו עם הישגים אישיים שהם מספרים עליהם גם חודשים אחרי.', rating: 5, type: 'team' },
  { id: 'h4', name: 'אורי כ.', role: 'ספורטאי חובב', text: 'המדריכים פשוט מדהימים – מקצועיים, תומכים ויודעים בדיוק מתי לדחוף ומתי לתת מרחב. הרמה המדעית של ההסבר הפתיע אותי לטובה.', rating: 5, type: 'individual' },
  { id: 'h5', name: 'נועה ר.', role: 'עובדת הייטק', text: 'בהתחלה הייתי פחדנית מאוד, אבל תרגול הנשימה לפני הטבילה שינה הכל. יצאתי עם כלים אמיתיים לניהול לחץ – משהו שאני מרגישה בכל יום.', rating: 5, type: 'individual' },
  { id: 'h6', name: 'גיל ב.', role: 'מאמן כושר', text: 'פרוטוקול הטבילה מבוסס מדע אמיתי. הסברים על נוראדרנלין, HPA, ותגובת הקור – בדיוק מה שציפיתי ממרכז מקצועי.', rating: 5, type: 'individual' },
];

async function getApprovedReviews() {
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

export default async function ReviewsPage() {
  const approved = await getApprovedReviews();
  const all = [
    ...approved.map(r => ({ ...r, role: r.role ?? '' })),
    ...hardcoded,
  ];

  return (
    <main id="main-content" className="min-h-screen bg-navy-950 py-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
          מה אומרים המשתתפים?
        </h1>
        <p className="text-xl text-center text-slate-400 mb-4 max-w-2xl mx-auto">
          מאות משתתפים שינו את הדרך שבה הם מתמודדים עם אתגרים
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
          {[
            { value: '98%', label: 'שביעות רצון' },
            { value: '500+', label: 'משתתפים' },
            { value: '4.9/5', label: 'דירוג ממוצע' },
            { value: '85%', label: 'חוזרים לסדנה' },
          ].map(s => (
            <div key={s.label} className="text-center bg-navy-800 rounded-2xl py-6 border border-navy-700">
              <div className="text-3xl font-black text-ice-400 mb-1">{s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {all.map((r, i) => (
            <div key={r.id ?? i}
              className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-ice-500/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs bg-ice-500/20 text-ice-400 px-3 py-1 rounded-full font-medium">
                  {typeLabel[r.type] ?? r.type}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ice-500/30 rounded-full flex items-center justify-center text-ice-400 font-bold text-sm flex-shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  {r.role && <p className="text-slate-500 text-xs">{r.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center text-white mb-8">שתף את החוויה שלך</h2>
          <ReviewForm />
        </div>
      </div>
    </main>
  );
}
