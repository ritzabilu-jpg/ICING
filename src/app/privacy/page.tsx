import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'תנאי שימוש – ICING',
  description: 'תנאי השימוש של ICING – הזמנות, ביטולים, אחריות ומדיניות',
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-black text-navy-900 mb-2">תנאי שימוש</h1>
        <p className="text-slate-500 text-sm mb-10">עודכן לאחרונה: מרץ 2026</p>

        {/* 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">1. ברוכים הבאים</h2>
          <p className="text-slate-600 leading-relaxed">
            ברוך הבא לאתר האינטרנט של <strong>ICING</strong> (להלן: &quot;האתר&quot;, &quot;אנחנו&quot;, &quot;העסק&quot;),
            הממוקמת ברחוב סירני 52, רחובות, מתחם הבריכה הטיפולית.
          </p>
          <p className="text-slate-600 leading-relaxed mt-3">
            השימוש באתר זה — לרבות צפייה בתכנים, הגשת בקשת הזמנה, יצירת קשר, או כל פעולה אחרת —
            מהווה הסכמה מלאה לתנאי השימוש המפורטים במסמך זה. אם אינך מסכים/ה לתנאים אלו, אנא הימנע/י משימוש באתר.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">2. מהות האתר והשירותים</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            האתר משמש להצגת מידע על סדנאות אמבטיות קרח מקצועיות ומדעיות, לקבלת בקשות הזמנה ולתיאום טבילות אישיות
            עם מדריכים מוסמכים CWI (Cold Water Immersion). השירותים ניתנים פיזית במתחם ICING ברחובות.
          </p>
          <ul className="space-y-2 text-slate-600">
            {[
              'סדנת יחידים – חוויה בקבוצה קטנה, עד 10 משתתפים',
              'סדנת זוגות – חוויה זוגית אינטימית',
              'סדנה אישית – הדרכה פרטית אחד על אחד',
              'סדנת קבוצות – לצוותי עבודה ואירגונים',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-ice-500 mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">3. כשירות לשימוש</h2>
          <p className="text-slate-600 leading-relaxed">
            השימוש באתר ורכישת שירותים מותרת לבני <strong>18 ומעלה</strong> בלבד.
            בני 15–17 רשאים להשתתף בסדנאות באישור וחתימת הורים.
          </p>
          <p className="text-slate-600 leading-relaxed mt-3">
            בהגשת בקשת הזמנה, המשתמש/ת מצהיר/ה כי הוא/היא כשיר/ה לבצע פעולות משפטיות מחייבות.
          </p>
        </section>

        {/* 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-4">4. הזמנה ותשלום</h2>

          <h3 className="font-bold text-navy-900 mb-2">4.1 תהליך ההזמנה</h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            הזמנת מקום בסדנה מתחילה בהגשת פרטי ההזמנה דרך האתר. לאחר קבלת הפרטים, נציג מטעם ICING
            יצור קשר טלפוני לאישור ההזמנה ולהשלמת פרטי התשלום.
            <strong> ההזמנה תחשב מאושרת רק לאחר השלמת התשלום</strong> וקבלת אישור בכתב (SMS / דוא&quot;ל / WhatsApp).
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <p className="text-amber-800 text-sm">
              ⚠️ <strong>לתשומת לבך:</strong> הגשת הבקשה באתר <strong>אינה</strong> שומרת מקום באופן מיידי.
              שמירת המקום מותנית באישור ותשלום בפועל.
            </p>
          </div>

          <h3 className="font-bold text-navy-900 mb-3">4.2 מחירים</h3>
          <p className="text-slate-600 leading-relaxed mb-3">כל המחירים המוצגים באתר <strong>כוללים מע&quot;מ</strong> בהתאם לדרישות החוק:</p>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white">
                  <th className="px-4 py-2 text-right font-semibold rounded-tr-lg">סוג סדנה</th>
                  <th className="px-4 py-2 text-right font-semibold rounded-tl-lg">מחיר</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  ['סדנת יחידים', '₪300 למשתתף'],
                  ['סדנת זוגות', '₪800 לשניים'],
                  ['סדנה אישית', '₪550 לאדם'],
                  ['סדנת קבוצות', 'מחיר מותאם לפי גודל הקבוצה'],
                ].map(([type, price], i) => (
                  <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 border-b border-slate-100">{type}</td>
                    <td className="px-4 py-2 border-b border-slate-100">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 leading-relaxed mb-5">
            ICING שומרת לעצמה את הזכות לעדכן מחירים בכל עת.
            המחיר התקף הוא המחיר שאושר בשיחת הטלפון ולפני ביצוע החיוב בפועל.
          </p>

          <h3 className="font-bold text-navy-900 mb-2">4.3 אמצעי תשלום</h3>
          <p className="text-slate-600 leading-relaxed">
            התשלום מתבצע בטלפון באמצעות כרטיס אשראי. פרטי כרטיס האשראי אינם נשמרים על ידי העסק לאחר השלמת העסקה.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-4">5. מדיניות ביטול והחזרים</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            בהתאם לחוק הגנת הצרכן, תשמ&quot;א‑1981, ולנוהלי העסק:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white">
                  <th className="px-4 py-2 text-right font-semibold rounded-tr-lg">מועד הביטול</th>
                  <th className="px-4 py-2 text-right font-semibold rounded-tl-lg">תנאי ההחזר</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  ['עד 48 שעות לפני הסדנה', 'החזר כספי מלא'],
                  ['בין 24 ל‑48 שעות לפני הסדנה', 'זיכוי מלא לסדנה עתידית'],
                  ['פחות מ‑24 שעות לפני הסדנה', 'ללא החזר כספי'],
                  ['אי‑הגעה ללא הודעה', 'ללא החזר'],
                ].map(([timing, policy], i) => (
                  <tr key={timing} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2 border-b border-slate-100 font-medium">{timing}</td>
                    <td className="px-4 py-2 border-b border-slate-100">{policy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            <strong>ביטולים יש לבצע בכתב בלבד</strong> – באמצעות הודעת WhatsApp למספר 052‑4500825 או בדוא&quot;ל,
            עם ציון שם מלא ומועד הסדנה.
          </p>
          <div className="bg-ice-50 border border-ice-200 rounded-xl p-4">
            <p className="text-slate-700 text-sm leading-relaxed">
              📌 בהתאם לסעיף 14ג לחוק הגנת הצרכן, עסקה שנוצרה מרחוק ניתנת לביטול תוך 14 ימים מיום ביצוע העסקה,
              ובלבד שהסדנה לא התקיימה. במקרה של ביטול כאמור, יוחזר הסכום בניכוי דמי ביטול בגובה 5% מסכום העסקה
              או ₪100 – לפי הנמוך מביניהם.
            </p>
          </div>
        </section>

        {/* 6 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-4">6. הצהרת בריאות ואחריות משתתף</h2>

          <h3 className="font-bold text-navy-900 mb-3">6.1 התאמות רפואיות</h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            השתתפות בסדנאות אמבטיות קרח עשויה להיות אסורה במצבים רפואיים מסוימים. <strong>אין להשתתף</strong> בסדנאות במקרים הבאים:
          </p>
          <ul className="space-y-1.5 text-slate-600 mb-4">
            {[
              'מחלות לב לא מאוזנות',
              'לחץ דם גבוה לא מטופל',
              'הריון',
              'תסמונת ריינו',
              'פצעים פתוחים',
              'מחלות חריפות (חום, זיהום פעיל)',
              'מצבים רפואיים אחרים בהם הרופא האישי מתנגד לחשיפה לקור',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-600 font-semibold">חובה לדווח למדריך על כל מצב רפואי לפני תחילת הסדנה.</p>

          <h3 className="font-bold text-navy-900 mt-5 mb-2">6.2 טופס הצהרת בריאות דיגיטלי</h3>
          <p className="text-slate-600 leading-relaxed mb-2">
            לפני כל השתתפות ראשונה, כל משתתף/ת נדרש/ת לחתום דיגיטלית על טופס הצהרת בריאות.
            החתימה הדיגיטלית מהווה הצהרה משפטית מחייבת לכל דבר ועניין, ומאשרת כי:
          </p>
          <ul className="space-y-1.5 text-slate-600">
            {[
              'המשתתף/ת קרא/ה והבין/ה את כל האזהרות הרפואיות',
              'אין מניעה רפואית ידועה להשתתפות',
              'המשתתף/ת מסכים/ה להשתתף באחריותו/ה האישית',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-navy-900 mt-5 mb-2">6.3 אחריות אישית</h3>
          <p className="text-slate-600 leading-relaxed">
            ההשתתפות בסדנאות היא <strong>על אחריות המשתתף/ת בלבד</strong>. ICING והמדריכים פועלים לפי
            פרוטוקולי בטיחות מחמירים ומוסמכים, אך אינם אחראים לתוצאות רפואיות הנובעות מהשתתפות בניגוד להוראות
            הרופא האישי או להנחיות שניתנו במהלך הסדנה.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">7. הגבלת אחריות</h2>
          <ul className="space-y-2 text-slate-600">
            {[
              'תוצאות הסדנה עשויות להשתנות בין משתתף למשתתף ואינן מובטחות',
              'העסק לא יישא באחריות לנזקים עקיפים, תוצאתיים או מיוחדים שאינם נובעים ישירות מרשלנות העסק',
              'האחריות המרבית של ICING מוגבלת לסכום ששולם בפועל עבור הסדנה הרלוונטית',
              'המידע המדעי המוצג באתר (על נוראדרנלין, קורטיזול, מערכת העצבים ועוד) הוא חינוכי ואינפורמטיבי בלבד, ואינו מהווה ייעוץ או המלצה רפואית',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">8. קניין רוחני</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            כל התכנים באתר — לרבות טקסטים, עיצובים, לוגואים, תמונות, מידע מדעי, שמות המותג &quot;ICING&quot;
            ו‑&quot;שוויץ המדע&quot; — הם רכוש ICING או ניתנו לשימוש ברישיון כדין.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <strong>אין</strong> להעתיק, לשכפל, להפיץ, לפרסם מחדש, לתרגם או לעשות כל שימוש מסחרי בתכנים אלו
            ללא אישור מפורש בכתב.
          </p>
        </section>

        {/* 9 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">9. שימוש מותר באתר</h2>
          <p className="text-slate-600 leading-relaxed mb-3">השימוש באתר מותר למטרות אישיות וחוקיות בלבד. אסור:</p>
          <ul className="space-y-1.5 text-slate-600">
            {[
              'להשתמש באתר למטרות בלתי חוקיות',
              'להחדיר קוד זדוני, וירוסים, או כל תוכנה שעלולה לפגוע בפעילות האתר',
              'לנסות לגשת ללא הרשאה לחלקים מוגנים של האתר',
              'לפרסם או להעביר תוכן פוגעני, שקרי, או שעלול להטעות',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 10 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">10. קישורים חיצוניים</h2>
          <p className="text-slate-600 leading-relaxed">
            האתר עשוי לכלול קישורים לאתרים חיצוניים (לדוגמה: Waze, Google Maps, רשתות חברתיות).
            ICING אינה אחראית לתוכן, מדיניות הפרטיות, או שיטות הפעולה של אתרים אלו.
          </p>
        </section>

        {/* 11 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">11. שינויים בתנאי השימוש</h2>
          <p className="text-slate-600 leading-relaxed">
            ICING שומרת לעצמה את הזכות לעדכן תנאי שימוש אלו בכל עת. השינויים ייכנסו לתוקף עם פרסומם
            באתר. המשך השימוש באתר לאחר פרסום שינויים מהווה הסכמה לתנאים המעודכנים.
          </p>
        </section>

        {/* 12 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-navy-900 mb-3">12. דין וסמכות שיפוט</h2>
          <p className="text-slate-600 leading-relaxed">
            תנאי שימוש אלו יפורשו ויחולו עליהם דיני מדינת ישראל בלבד.
            כל מחלוקת שתנבע מתנאים אלו תובא לפתרון בפני הערכאות המוסמכות במחוז מרכז, ישראל.
          </p>
        </section>

        {/* 13 */}
        <section className="mb-10 bg-navy-900 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">13. יצירת קשר</h2>
          <p className="text-slate-300 mb-4">לכל שאלה בנוגע לתנאי שימוש אלו:</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="text-ice-400">📍</span>
              <span>רחוב סירני 52, רחובות – מתחם הבריכה הטיפולית</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-ice-400">📞</span>
              <a href="tel:089310715" className="hover:text-ice-400 transition-colors">08‑9310715 | 08‑9310716</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-ice-400">💬</span>
              <a href="https://wa.me/972552482441" target="_blank" rel="noopener noreferrer"
                className="hover:text-ice-400 transition-colors">WhatsApp: 052‑4500825</a>
            </li>
          </ul>
        </section>

        <p className="text-slate-400 text-sm text-center mb-8">© 2026 ICING. כל הזכויות שמורות.</p>

        <div className="border-t border-slate-200 pt-6 flex gap-4 text-sm">
          <Link href="/" className="text-ice-600 hover:text-ice-800 font-semibold">← חזרה לדף הבית</Link>
          <Link href="/contact" className="text-ice-600 hover:text-ice-800 font-semibold">צור קשר</Link>
        </div>
      </div>
    </main>
  );
}
