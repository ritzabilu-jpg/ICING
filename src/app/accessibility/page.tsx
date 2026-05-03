import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'הצהרת נגישות – ICING',
  description: 'הצהרת נגישות של אתר ICING בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות',
};

export default function AccessibilityPage() {
  const updateDate = '21 במרץ 2026';

  return (
    <main id="main-content" className="min-h-screen bg-white py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-black text-navy-900 mb-2">הצהרת נגישות</h1>
        <p className="text-slate-500 text-sm mb-10">עודכן לאחרונה: {updateDate}</p>

        {/* Who we are */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">אודות הנגישות באתר</h2>
          <p className="text-slate-600 leading-relaxed">
            ICING מחויבת לנגישות דיגיטלית לאנשים עם מוגבלות.
            אנו פועלים לעמוד בדרישות תקן ישראלי 5568 (המבוסס על WCAG 2.1 ברמה AA),
            בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג–2013.
          </p>
        </section>

        {/* What we did */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-4">מה נעשה לשיפור הנגישות</h2>
          <ul className="space-y-2 text-slate-600">
            {[
              'האתר מוצג בעברית עם כיוון RTL מלא (right-to-left)',
              'כל הדפים כוללים מבנה כותרות היררכי (H1, H2, H3)',
              'לכל התמונות יש תיאור חלופי (alt text)',
              'לכפתורים ולקישורים עם אייקון בלבד הוגדר aria-label',
              'האתר ניתן לניווט מלא מקלדת',
              'מוגדר skip-to-content לדילוג ישיר לתוכן הראשי',
              'גופן וגודל טקסט מינימלי 16px',
              'ניגודיות צבעים עומדת בדרישות WCAG AA',
              'הטפסים כוללים תוויות (labels) ברורות לכל שדה',
              'שגיאות טופס מוצגות בצורה ברורה ומוסברות',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Known issues */}
        <section className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">מגבלות נגישות ידועות</h2>
          <ul className="space-y-2 text-slate-600">
            {[
              'מפת Google Maps המוטמעת בדף הבית אינה נגישה במלואה לקוראי מסך — ניתן להשתמש בקישור Waze החלופי',
              'תוכן מסויים בסרגל הניווט עשוי להיות מוגבל בגרסאות ישנות של דפדפנים',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-10 bg-navy-900 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">פנייה בנושא נגישות</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            נתקלתם בבעיית נגישות? אנחנו כאן לעזור. ניתן לפנות לרכז הנגישות שלנו:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="text-ice-400">📞</span>
              <a href="tel:089310715" className="hover:text-ice-400 transition-colors">08-9310715</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-ice-400">✉️</span>
              <a href="mailto:ritzabilu@gmail.com" className="hover:text-ice-400 transition-colors">
                ritzabilu@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-ice-400">📍</span>
              <span>רחוב סירני 52, רחובות</span>
            </li>
          </ul>
          <p className="text-slate-400 text-sm mt-4">
            נשתדל להשיב לכל פנייה בנושא נגישות תוך 5 ימי עבודה.
          </p>
        </section>

        {/* Legal */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">בסיס חוקי</h2>
          <p className="text-slate-600 leading-relaxed">
            הצהרה זו מבוססת על תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
            התשע&quot;ג–2013, ועל תקן ישראלי 5568 הדרישות לנגישות תכנים באינטרנט.
            האתר מתעדכן באופן שוטף להתאמה לדרישות הנגישות.
          </p>
        </section>

        <div className="border-t border-slate-200 pt-6 flex gap-4 text-sm">
          <Link href="/" className="text-ice-600 hover:text-ice-800 font-semibold">← חזרה לדף הבית</Link>
          <Link href="/contact" className="text-ice-600 hover:text-ice-800 font-semibold">צור קשר</Link>
        </div>
      </div>
    </main>
  );
}
