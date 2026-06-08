import type { Metadata } from 'next';
import Link from 'next/link';
import AuthorSignature from '@/components/AuthorSignature';

export const metadata: Metadata = {
  title: 'דופמין, מוטיבציה וטבילות קרח | ICING',
  description: 'מה המדע באמת אומר על דופמין, מוטיבציה וטבילה במי קרח – מחקרים, סייגים והסבר מלא',
};

const articles = [
  {
    num: 1,
    title: 'Plasma catecholamine and cardiovascular responses to cold water immersion',
    journal: 'European Journal of Applied Physiology – Srámek P et al.',
    note: 'עלייה של ~250% בדופמין ו-~530% בנוראדרנלין בטבילה ב-14°C שעה',
    url: 'https://link.springer.com/article/10.1007/s004210050065',
  },
  {
    num: 2,
    title: 'Short-Term Head-Out Whole-Body Cold-Water Immersion Facilitates Positive Affect',
    journal: 'Scientific Reports (2023)',
    note: 'שיפור ב-positive affect ובחיבוריות מוחית פרה-פרונטלית לאחר טבילה קצרה',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9953392/',
  },
  {
    num: 3,
    title: 'Effects of cold-water immersion on health and wellbeing: A systematic review and meta-analysis',
    journal: 'PLOS ONE – Firth J et al. (2025)',
    note: 'מטא-אנליזה: 11 מחקרים, 3177 משתתפים – שיפור בסטרס, שינה, אנרגיה',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615',
  },
  {
    num: 4,
    title: 'Cold water therapy and neuropsychiatric effects: a review',
    journal: 'Journal of Psychiatric Research',
    note: 'הפעלה של דופמין, נוראדרנלין, סרוטונין, בטא-אנדורפינים וקורטיזול',
    url: 'https://pubmed.ncbi.nlm.nih.gov/17993252/',
  },
];

const findings = [
  {
    icon: '⚡',
    title: 'עלייה חדה בקטכולאמינים',
    text: '+250% דופמין, +530% נוראדרנלין — הפעלה עוצמתית של המערכת הסימפתטית',
    color: 'bg-purple-50 border-purple-200',
    titleColor: 'text-purple-900',
  },
  {
    icon: '🧠',
    title: 'שינוי בחיבוריות מוחית',
    text: 'שיפור בחיבוריות אזורים פרה-פרונטליים ורשתות קשב — מצב "ON" של ערנות ומיקוד',
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-900',
  },
  {
    icon: '📉',
    title: 'הפחתת סטרס לאורך זמן',
    text: 'ירידה במדדי סטרס עד 12 שעות לאחר החשיפה, שיפור איכות שינה ותחושת אנרגיה',
    color: 'bg-green-50 border-green-200',
    titleColor: 'text-green-900',
  },
  {
    icon: '🔄',
    title: 'לולאת תגמול',
    text: 'אתגר → שחרור דופמין ו"היי" טבעי → חיזוק הרצון לחזור — מנגנון מוטיבציה עצמי',
    color: 'bg-orange-50 border-orange-200',
    titleColor: 'text-orange-900',
  },
];

export default function DopaminePage() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-ice-500/20 text-ice-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            מדע הטבילה
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            דופמין ומוטיבציה<br />
            <span className="text-ice-400">מה המדע באמת אומר?</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            דופמין הוא לא רק "הורמון האושר" — הוא מערכת עדינה שמסמנת למוח: שווה להשקיע מאמץ.
            טבילה קרה מפעילה מערכות דופמין ונוראדרנלין בצורה חזקה ומהירה.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-purple-600/30 border border-purple-500/40 rounded-2xl px-6 py-3">
            <span className="text-3xl font-black text-purple-300">+250%</span>
            <span className="text-slate-300 text-sm">עלייה בדופמין בטבילה ב-14°C</span>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 px-6 bg-ice-50 border-b border-ice-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-ice-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-navy-900 mb-3">בקצרה</h2>
            <p className="text-slate-600 leading-relaxed">
              דופמין הוא נושא-עצב מרכזי האחראי על תחושת אנרגיה, מוטיבציה ו"דרייב". כשמדברים על
              טבילות קרח בהקשר של מיקוד ואנרגיה — מדברים על האופן שבו חשיפה קרה מפעילה
              מערכות דופמין ונוראדרנלין בגוף ובמוח. המחקר מראה עלייה חדה בקטכולאמינים בדם,
              שינויים בחיבוריות מוחית ושיפור עקבי בתחושת ערנות וסטרס — בסיס חזק למוטיבציה יומיומית.
            </p>
          </div>
        </div>
      </section>

      {/* Key findings */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-navy-900 mb-8">ממצאים עיקריים</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {findings.map(f => (
              <div key={f.title} className={`rounded-2xl border p-5 ${f.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className={`font-black text-base ${f.titleColor}`}>{f.title}</h3>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed */}
      <section className="py-4 px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-10 text-slate-700 text-[17px] leading-relaxed">

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">מה קורה לדופמין בזמן טבילה?</h2>
            <p className="mb-4">
              במחקר קלאסי שפורסם ב-<em>European Journal of Applied Physiology</em>, טבילה של שעה במים
              ב-14°C גרמה לעלייה חדה ברמות הדופמין והנוראדרנלין בדם — עד מאות אחוזים מעל קו
              הבסיס (עלייה של כ-250% בדופמין וכ-530% בנוראדרנלין). זהו אחד המקורות העיקריים
              לטענה הפופולרית שטבילת קרח "מזניקה את הדופמין".
            </p>
            <p>
              חשוב להדגיש: המדידה היא של קטכולאמינים בדם (פריפריה), ולא ישירות במוח — אך
              היא משקפת הפעלה חזקה של המערכת הסימפתטית והורמונלית שמקושרת לערנות, מיקוד ומוטיבציה.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">המוח בטבילה: מצב "ON"</h2>
            <p className="mb-4">
              מחקרי הדמיה מוחית עדכניים הראו שלאחר טבילת מים קרים קצרה יש שיפור ב-positive affect
              (רגשות חיוביים) ושינויים בחיבוריות בין אזורים פרה-פרונטליים ורשתות קשב במוח —
              כלומר, המוח עובר למצב "ON": יותר ערני, יותר ממוקד, ועם פחות מחשבות שליליות.
            </p>
            <p>
              גם כאן, הדופמין לא נמדד ישירות, אבל החוקרים מסבירים את האפקט דרך העלייה הידועה
              בקטכולאמינים (דופמין ונוראדרנלין) והגברת arousal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">האם זה מעלה מוטיבציה?</h2>
            <p className="mb-4">
              מטא-אנליזה גדולה שפורסמה ב-PLOS ONE ב-2025, שכללה 11 מחקרים ו-3,177 משתתפים, מצאה
              שטבילות במים קרים (7–15°C, בין חצי דקה לשעתיים) יכולות:
            </p>
            <ul className="space-y-2 mb-4 mr-4">
              {[
                'להפחית מדדי סטרס כ-12 שעות אחרי החשיפה',
                'לשפר איכות שינה ואיכות חיים',
                'לעודד שינויים חיוביים בתחושת אנרגיה וערנות',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ice-500 font-bold mt-1 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              בנוסף, טבילה קרה מפעילה לא רק דופמין ונוראדרנלין, אלא גם סרוטונין, בטא-אנדורפינים
              וקורטיזול — שילוב שיכול לתרום לוויסות רגשי טוב יותר, חוסן מול סטרס ותחושת
              תגמול אחרי התמודדות עם גירוי קשה. עבור רבים, עצם הבחירה להיכנס למים קרים,
              העמידה באתגר והיציאה ממנו יוצרים לולאת תגמול: התנהגות מאתגרת → שחרור דופמין
              ו"היי" טבעי → חיזוק הרצון לחזור.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-black text-amber-900 mb-3">⚠️ מה חשוב לסייג</h3>
            <ul className="space-y-2 text-amber-800 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>רוב המחקרים מתבססים על מדידת דופמין בדם, לא ישירות במוח — יש להיזהר מפרשנות יתר</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>עדיין אין מחקרי Q1 שבודקים ישירות: טבילה קרה → שינוי בדופמין במוח (PET/MRS) → שינוי מוכח במדדי מוטיבציה</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>יחד עם זאת, הצטברות הנתונים תומכת בטענה שטבילה קרה יכולה להיות כלי יעיל לשיפור תחושת המוטיבציה — כשנעשית בצורה הדרגתית, בטוחה ומותאמת אישית</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6 bg-navy-900" id="articles">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-2">מאמרים מדעיים</h2>
          <p className="text-slate-400 text-sm mb-8">מחקרים peer-reviewed בנושא דופמין, מוטיבציה וטבילת מי קרח</p>
          <div className="space-y-4">
            {articles.map(a => (
              <a key={a.num} href={a.url} target="_blank" rel="noopener noreferrer"
                className="flex gap-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-ice-500/50
                           rounded-2xl p-5 transition-all group">
                <span className="text-ice-400 font-black text-lg flex-shrink-0 w-6">{a.num}.</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm leading-snug group-hover:text-ice-300 transition-colors">
                    {a.title}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">{a.journal}</p>
                  {a.note && <p className="text-ice-400/70 text-xs mt-1 italic">{a.note}</p>}
                </div>
                <span className="text-slate-500 group-hover:text-ice-400 flex-shrink-0 transition-colors">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="px-6">
        <AuthorSignature />
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-ice-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-3">רוצה לחוות את הדרייב בעצמך?</h2>
          <p className="text-ice-100 mb-6">הצטרף לסדנת טבילה מודרכת ותרגיש את ההשפעות בגוף</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 bg-white text-ice-700 font-black px-8 py-3 rounded-2xl
                         hover:bg-ice-50 transition-colors shadow-lg text-lg">
              📅 הזמינו מקום עכשיו
            </Link>
            <Link href="/science"
              className="inline-flex items-center gap-2 bg-ice-700 hover:bg-ice-800 text-white font-bold px-6 py-3 rounded-2xl
                         transition-colors text-sm">
              ← חזרה למדע הטבילה
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
