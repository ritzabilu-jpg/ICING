import type { Metadata } from 'next';
import Link from 'next/link';
import AuthorSignature from '@/components/AuthorSignature';
import AccordionSection from '@/components/AccordionSection';

export const metadata: Metadata = {
  title: 'מערכת חיסון ודלקת — טבילת מי קרח | ICING',
  description: 'כיצד טבילה במי קרח משפיעה על מערכת החיסון, מדדי דלקת ותהליך ההתאוששות — עם סימוכין ממחקרים peer-reviewed',
};

const articles = [
  {
    num: 1,
    title: 'Cold exposure promotes meningeal immune responses and restrains brain inflammation',
    journal: 'Nature Immunology – Chen K et al. (2024)',
    note: 'חשיפה לקור מפחיתה דלקת מוחית דרך הפעלת תאי T חיסוניים',
    url: 'https://www.nature.com/articles/s41590-024-01756-6',
  },
  {
    num: 2,
    title: 'Cold-water immersion for preventing and treating muscle soreness after exercise',
    journal: 'Cochrane Database – Bleakley C, McDonough S et al. (2012)',
    note: 'הפחתה משמעותית בכאב שרירים ושיפור התאוששות — אחד המחקרים המצוטטים ביותר בתחום',
    url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008262.pub2/full',
  },
  {
    num: 3,
    title: 'Effects of cold-water immersion on health and wellbeing: A systematic review and meta-analysis',
    journal: 'PLOS ONE – Firth J et al. (2023)',
    note: 'סקירה שיטתית: שיפור בבריאות הנפש, הפחתת עייפות ושיפור תגובת מערכת החיסון',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615',
  },
  {
    num: 4,
    title: 'Ice baths trigger robust immune responses, particularly in muscle tissue',
    journal: 'Frontiers in Physiology (2024)',
    note: 'טבילות קרח מפעילות תגובות חיסוניות חזקות ברקמת השריר',
    url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2024.1397593/full',
  },
  {
    num: 5,
    title: 'Cold-water immersion and inflammation: IL-6 and cytokine modulation',
    journal: 'Journal of Applied Physiology',
    note: 'חשיפה חוזרת לקור מפחיתה IL-6 כרוני עד 57% ביחס לקבוצת ביקורת',
    url: 'https://journals.physiology.org/doi/full/10.1152/japplphysiol.00033.2024',
  },
];

const findings = [
  {
    icon: '🛡️',
    title: 'הפחתת IL-6 כרוני',
    text: 'חשיפה חוזרת לקור מפחיתה עד 57% את IL-6 — ציטוקין מרכזי בדלקת כרונית',
    color: 'bg-orange-50 border-orange-200',
    titleColor: 'text-orange-900',
  },
  {
    icon: '⚡',
    title: 'הפעלת כדוריות דם לבנות',
    text: 'גידול במספר תאי NK, לימפוציטים ומונוציטים בשעות שלאחר הטבילה',
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-900',
  },
  {
    icon: '💪',
    title: 'שיפור התאוששות',
    text: 'הפחתת כאב שרירים (DOMS) ושיפור תפקוד שרירי בספורטאים לאחר מאמץ',
    color: 'bg-green-50 border-green-200',
    titleColor: 'text-green-900',
  },
  {
    icon: '🧠',
    title: 'הגנה על מוח',
    text: 'מחקר 2024 הראה שחשיפה לקור מפחיתה דלקת מוחית דרך מנגנוני מערכת החיסון',
    color: 'bg-purple-50 border-purple-200',
    titleColor: 'text-purple-900',
  },
];


// ── Article Schema (GEO — helps ChatGPT/Perplexity cite this page) ─────────────
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "מערכת חיסון ודלקת — טבילת מי קרח",
  "description": "כיצד טבילה במי קרח משפיעה על מערכת החיסון, מדדי דלקת ותהליך ההתאוששות",
  "url": "https://icing.co.il/inflammation",
  "inLanguage": "he",
  "author": {
    "@type": "Organization",
    "name": "ICING",
    "url": "https://icing.co.il"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ICING — אמבטיות קרח",
    "url": "https://icing.co.il"
  },
  "about": "inflammation, immune system, recovery, cold water immersion",
  "isPartOf": {
    "@type": "WebSite",
    "name": "ICING",
    "url": "https://icing.co.il"
  }
};
export default function InflammationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-white" dir="rtl">

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-ice-500/20 text-ice-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            מדע הטבילה
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            מערכת חיסון ודלקת<br />
            <span className="text-ice-400">הקור כמאמן של הגוף</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            טבילה במי קרח לא &quot;מכבה&quot; את מערכת החיסון — היא דווקא מפעילה אותה לרגע, מאתגרת אותה,
            ומאפשרת לה להתאמן. כמו אימון שרירים, גם מערכת החיסון מתחזקת דרך גירוי מבוקר.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-orange-600/30 border border-orange-500/40 rounded-2xl px-6 py-3">
            <span className="text-3xl font-black text-orange-300">57%</span>
            <span className="text-slate-300 text-sm">ירידה ב-IL-6 בחשיפה חוזרת לקור</span>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 px-6 bg-ice-50 border-b border-ice-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-ice-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-navy-900 mb-3">בקצרה</h2>
            <p className="text-slate-600 leading-relaxed">
              מערכת החיסון היא לא רק כלי להגנה מפני פתוגנים — היא גם מווסתת את תהליכי הדלקת
              בגוף. דלקת היא תגובה הכרחית לפציעה ולזיהום, אך דלקת כרונית ברקע קשורה למחלות
              לב, סוכרת, שחיקה ודיכאון. המחקר מראה שחשיפה מבוקרת וחוזרת לקור — כמו טבילת
              מי קרח — יכולה להפחית מדדי דלקת כרונית, לחזק את תגובת מערכת החיסון ולשפר
              את תהליכי ההתאוששות לאחר מאמץ.
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
            <h2 className="text-2xl font-black text-navy-900 mb-5">
              טבילה במי קרח ומערכת החיסון — &quot;דלקת טובה&quot; לעומת דלקת כרונית
            </h2>
            <p className="mb-4">
              כשגוף האדם נכנס למים קרים, מתרחשת תגובת חשיפה חריפה (cold shock response): מערכת
              העצבים הסימפתטית מתעוררת, הלב מאיץ, כלי הדם בפריפריה מתכווצים, והגוף מפנה
              משאבים לאיברים חיוניים. במקביל, מופעלת גם תגובה חיסונית — שחרור ציטוקינים,
              הגברת פעילות כדוריות הדם הלבנות ועלייה זמנית ב-IL-6.
            </p>
            <p className="mb-4">
              ה-IL-6 שמשתחרר בזמן הטבילה הוא לא ה-IL-6 הדלקתי הכרוני הרע — אלא IL-6 חריף
              שמשתחרר ממיוציטים (תאי שריר) ומהווה איתות הסתגלות. תגובה חריפה זו, כשחוזרים
              עליה באופן קבוע, עשויה לגרום להורדת הרמה הכרונית של דלקת ברקע.
            </p>
            <p>
              זהו מנגנון דומל למה שקורה באימון גופני — מאמץ גורם נזק קל ודלקת מקומית,
              ובתגובה הגוף בונה עצמו חזק יותר ומסוגל לווסת דלקת ביתר יעילות.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">מה קורה לכדוריות הדם הלבנות?</h2>
            <p className="mb-4">
              מחקרים מדדו שינויים בספירת תאי מערכת החיסון לאחר טבילות קרח קבועות:
            </p>
            <ul className="space-y-2 mb-4 mr-4">
              {[
                'עלייה בתאי NK (Natural Killer) — תאים שתפקידם לחסל תאים מודבקים וסרטניים',
                'עלייה בלימפוציטים ובמונוציטים בשעות שלאחר הטבילה',
                'שיפור ביכולת הפגוציטוזה (בליעת חיידקים על ידי מקרופאג\'ים)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ice-500 font-bold mt-1 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              חשוב לציין שהשינויים הם זמניים — כלומר, הגוף מגיב לאתגר הקור ואז חוזר לקו
              הבסיס. ההשפעה ארוכת הטווח מגיעה מהצטברות של תגובות חוזרות לאורך שבועות וחודשים.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">התאוששות ספורטיבית: מה המחקר אומר?</h2>
            <p className="mb-4">
              אחד השימושים המחקריים הנרחבים ביותר של טבילת מי קרח הוא בתחום ההתאוששות
              הספורטיבית. סקירת Cochrane — הסטנדרט הגבוה ביותר בסקירות מדעיות — מצאה ש:
            </p>
            <ul className="space-y-2 mb-4 mr-4">
              {[
                'טבילה במים קרים (10–15°C, 10–20 דקות) מפחיתה כאב שרירים (DOMS) באופן מובהק',
                'שיפור בכוח ובתפקוד השרירי בהשוואה למנוחה פסיבית',
                'הפחתת נפח הנזק השרירי (מדדי CK ו-LDH בדם)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ice-500 font-bold mt-1 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              המנגנון: כיווץ כלי הדם מוריד את הזרימה לשריר ומפחית את התגובה הדלקתית המיידית.
              כשהגוף מתחמם לאחר הטבילה, יש הרחבת כלי דם ושטיפה של תוצרי לוואי מטבוליים.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-navy-900 mb-5">הגנה על המוח?</h2>
            <p className="mb-4">
              מחקר מרתק שפורסם ב-2024 ב-<em>Nature Immunology</em> הראה שחשיפה לקור מפעילה
              תגובות חיסוניות בקרום המוח (meninges) שמסייעות לריסון דלקת מוחית. זהו כיוון
              מחקרי חדש שמרמז שטבילת קרח אולי לא רק משפיעה על הגוף — אלא גם מגן על מוח.
            </p>
            <p>
              יש להדגיש שמדובר במחקר מוקדם, עם חלק מהניסויים בעכברים, ועוד לא ניתן להסיק
              מסקנות קליניות מעשיות לגבי בני אדם.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-black text-amber-900 mb-3">⚠️ מה חשוב לסייג</h3>
            <ul className="space-y-2 text-amber-800 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>טבילת קרח ישירות לאחר אימון כוח עשויה לפגוע בבניית שריר (hypertrophy) — כדאי להמתין לפחות שעה</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>אנשים עם מחלות אוטואימוניות, הפרעות בזרימת דם או תרופות מדכאות חיסון — יש להתייעץ עם רופא לפני תחילת פרוטוקול</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 font-bold">•</span>
                <span>ההשפעה החיסונית נובעת בעיקר מחשיפה חוזרת לאורך זמן — טבילה בודדת לא תשנה את מצב מערכת החיסון</span>
              </li>
            </ul>
          </div>

        </div>
      </section>      {/* Author */}
      <section className="px-6">
        <AuthorSignature />
      </section>


      {/* Articles */}
      <section className="bg-navy-900" id="articles">
        <AccordionSection title="המאמרים הרפואיים שעליהם התבסס המאמר הזה" dark fadeColor="#0f172a">
          <div className="max-w-3xl mx-auto px-6 pb-16">
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
        </AccordionSection>
      </section>


      {/* CTA */}
      <section className="py-16 px-6 bg-ice-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-3">רוצה לחזק את מערכת החיסון שלך?</h2>
          <p className="text-ice-100 mb-6">הצטרף לסדנת טבילה מודרכת ותתחיל את הפרוטוקול בצורה נכונה ובטוחה</p>
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
    </>
  );
}
