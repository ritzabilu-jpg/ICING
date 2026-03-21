import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'נוראדרנלין וטבילת מי קרח | חוויות שוויץ המדע',
  description: 'הסבר מדעי על נוראדרנלין, מערכת העצבים הסימפתטית וההשפעות הפיזיולוגיות של טבילת מי קרח',
};

const articles = [
  {
    num: 1,
    title: 'Plasma norepinephrine responses of man in cold water',
    journal: 'Journal of Applied Physiology',
    url: 'https://journals.physiology.org/doi/abs/10.1152/jappl.1977.43.2.216',
  },
  {
    num: 2,
    title: 'Effects of cold-water immersion on health and wellbeing',
    journal: 'PLOS ONE (סקירת ספרות עדכנית)',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615',
  },
  {
    num: 3,
    title: 'Residual effects of short-term whole-body cold-water immersion on physiological responses',
    journal: 'International Journal of Hyperthermia',
    url: 'https://www.tandfonline.com/doi/full/10.1080/02656736.2021.1915504',
  },
  {
    num: 4,
    title: 'Short-Term Head-Out Whole-Body Cold-Water Immersion Facilitates Positive Affect',
    journal: 'Scientific Reports',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9953392/',
  },
  {
    num: 5,
    title: 'Catecholamine excretion in men exposed to cold',
    journal: 'Journal of Applied Physiology',
    url: 'https://journals.physiology.org/doi/abs/10.1152/jappl.1960.15.3.499',
  },
];

const effects = [
  { icon: '⚡', text: 'הגברת ערנות, אנרגיה ותחושת חיוניות סובייקטיבית — עלייה במצב רוח חיובי וירידה במתח' },
  { icon: '❤️', text: 'כיווץ כלי דם בעור, עלייה בלחץ הדם ובקצב הלב, ושימור חום לאיברים החיוניים' },
  { icon: '🔥', text: 'גיוס משאבים מטבוליים — עלייה בהוצאה אנרגטית ובתרמוגנזה לשמירה על טמפרטורת גוף' },
  { icon: '💊', text: 'השפעה מווסתת דלקת וכאב — קישור לקולטנים שמפחיתים מולקולות פרו-דלקתיות' },
];

export default function NoradrenalinePage() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-ice-500/20 text-ice-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            מדע הטבילה
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            נוראדרנלין<br />
            <span className="text-ice-400">וטבילת מי קרח</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            נוראדרנלין הוא חומר של מערכת העצבים הסימפתטית שמגביר ערנות, קצב לב ולחץ דם
            ומכין את הגוף ל״מצב חירום״. בטבילה במי קרח הקור החד מפעיל במהירות את מערכת
            הסטרס וגורם לעלייה חדה וקצרה בנוראדרנלין בדם.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-ice-600/30 border border-ice-500/40 rounded-2xl px-6 py-3">
            <span className="text-3xl font-black text-ice-400">+127%</span>
            <span className="text-slate-300 text-sm">עלייה ממוצעת בנוראדרנלין בטבילה ב-5°C</span>
          </div>
        </div>
      </section>

      {/* Summary box */}
      <section className="py-12 px-6 bg-ice-50 border-b border-ice-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-ice-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-navy-900 mb-3">בקצרה</h2>
            <p className="text-slate-600 leading-relaxed">
              נוראדרנלין הוא נוירוטרנסמיטר והורמון לחץ מרכזי שמופרש ממערכת העצבים הסימפתטית
              וממדולת האדרנל. טבילת מי קרח גורמת לעלייה חדה ומהירה ברמתו בדם כחלק מ״תגובת שוק״
              (cold shock response). עלייה זו קשורה לעלייה בערנות, בלחץ הדם ובקצב הלב, לגיוס
              אנרגטי מואץ ולוויסות דלקת וכאב — והיא חולפת יחסית מהר לאחר היציאה מהמים
              וההתחממות מחדש.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed explanation */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-navy-900 mb-6">הסבר מפורט</h2>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5 text-[17px]">
            <p>
              נוראדרנלין הוא חומר של מערכת העצבים הסימפתטית הפועל גם כנוירוטרנסמיטר במוח וגם
              כהורמון בדם, ותפקידו להכין את הגוף למצב של ״דריכות ולחץ״ — העלאת קצב לב, כיווץ
              כלי דם בעור, שחרור סוכר לדם והגברת ערנות ומיקוד. בטבילה במים קרים מאוד (מי קרח)
              הגוף חווה גירוי חד של קור שגורם להפעלה מיידית של המערכת הסימפתטית ולהפרשה ניכרת
              של נוראדרנלין לדם, כבר בדקות הראשונות של החשיפה.
            </p>
            <p>
              במחקרי טבילה במים בסביבות 5°C נמצא כי רמת הנוראדרנלין בפלזמה כמעט מוכפלת לאחר
              כ-2 דקות טבילה, וממשיכה לעלות עד פי 3–4 מרמת הבסיס במהלך חשיפה ממושכת, יחד עם
              עלייה ניכרת בקצב חילוף החומרים. גם חשיפה קרה קצרה יותר (כמה דקות) מספיקה כדי
              לגרום לעלייה חדה בנוראדרנלין ובשאר קטכולאמינים בדם ובשתן. לאחר סיום הטבילה
              וההתחממות, רמת הנוראדרנלין חוזרת בהדרגה לבסיס תוך עשרות דקות — אך יש אפקט
              מצטבר לאורך זמן עם אימון חוזר.
            </p>
          </div>

          {/* Effects grid */}
          <h3 className="text-xl font-black text-navy-900 mt-10 mb-5">
            המשמעות הפיזיולוגית של העלייה בנוראדרנלין
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {effects.map(e => (
              <div key={e.icon} className="flex gap-3 bg-ice-50 rounded-2xl p-4 border border-ice-100">
                <span className="text-2xl flex-shrink-0">{e.icon}</span>
                <p className="text-slate-700 text-sm leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-600 text-sm leading-relaxed">
            <p className="font-semibold text-navy-900 mb-2">⚠️ שימו לב</p>
            <p>
              מדובר בתגובה סטרסורית משמעותית למערכת הלב-כלי הדם והעצבים. יש להתאים את
              הטבילות למצב בריאותי אישי ולהימנע מחשיפה קיצונית בקרב אנשים עם מחלות לב,
              יתר לחץ דם בלתי מאוזן או גורמי סיכון אחרים.
            </p>
          </div>

          <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-slate-600 text-sm leading-relaxed">
            <p>
              מבחינה סובייקטיבית, רבים מדווחים לאחר טבילות חוזרות על תחושת חדות מנטלית,
              רגיעה לאחר החשיפה ושיפור בתחושת רווחה. חלק מהשפעות אלה מיוחסות לעלייה החדה
              אך הזמנית בנוראדרנלין ולשינויים נלווים בקישוריות מוחית ובקורטיזול.
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6 bg-navy-900" id="articles">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-2">מאמרים מדעיים</h2>
          <p className="text-slate-400 text-sm mb-8">מחקרים peer-reviewed בנושא נוראדרנלין וטבילת מי קרח</p>
          <div className="space-y-4">
            {articles.map(a => (
              <a
                key={a.num}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-ice-500/50
                           rounded-2xl p-5 transition-all group"
              >
                <span className="text-ice-400 font-black text-lg flex-shrink-0 w-6">{a.num}.</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug group-hover:text-ice-300 transition-colors">
                    {a.title}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">{a.journal}</p>
                </div>
                <span className="text-slate-500 group-hover:text-ice-400 mr-auto flex-shrink-0 transition-colors">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-ice-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-3">רוצה לחוות את זה בגוף?</h2>
          <p className="text-ice-100 mb-6">הצטרף לסדנת טבילה מודרכת ותרגיש את ההשפעות בעצמך</p>
          <Link href="/booking"
            className="inline-flex items-center gap-2 bg-white text-ice-700 font-black px-8 py-3 rounded-2xl
                       hover:bg-ice-50 transition-colors shadow-lg text-lg">
            📅 הזמינו מקום עכשיו
          </Link>
        </div>
      </section>

    </main>
  );
}
