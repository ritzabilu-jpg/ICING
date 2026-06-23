import type { Metadata } from 'next';
import Link from 'next/link';
import AuthorSignature from '@/components/AuthorSignature';
import AccordionSection from '@/components/AccordionSection';

export const metadata: Metadata = {
  title: 'קורטיזול, סטרס וטבילת מי קרח | ICING',
  description: 'הסבר מדעי על קורטיזול, ציר HPA וההשפעה של טבילת מי קרח מבוקרת על ויסות הסטרס',
};

const articles = [
  {
    num: 1,
    title: 'Residual effects of short-term whole-body cold-water immersion on physiological responses',
    journal: 'International Journal of Hyperthermia – Eimontė M et al.',
    note: '14°C, 10 דקות — עלייה בקורטיזול ובהורמוני סטרס',
    url: 'https://www.tandfonline.com/doi/full/10.1080/02656736.2021.1915504',
  },
  {
    num: 2,
    title: 'Cardiovascular and mood responses to an acute bout of cold water immersion',
    journal: 'Journal of Thermal Biology – Reed EL et al.',
    note: '15 דקות טבילה — קורטיזול נמוך יותר 3 שעות אחרי החשיפה',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10842018/',
  },
  {
    num: 3,
    title: 'Cold exposure and hormonal secretion: A review',
    journal: 'International Journal of Circumpolar Health – Pääkkönen T, Leppäluoto J.',
    note: 'סקירת השפעת קור, כולל מים קרים, על קורטיזול והורמוני סטרס',
    url: 'https://www.tandfonline.com/doi/pdf/10.3402/ijch.v61i3.17474',
  },
  {
    num: 4,
    title: 'Cortisol levels after cold exposure are independent of the blood sampling site',
    journal: 'PubMed – Shida A et al.',
    note: 'הדגמת עלייה בקורטיזול בתגובה להיפותרמיה כתגובה סטרסורית',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32069307/',
  },
  {
    num: 5,
    title: 'Effects of cold-water immersion on health and wellbeing: A systematic review and meta-analysis',
    journal: 'PLOS ONE – Firth J et al.',
    note: 'סקירה רחבה על טבילות קרות, סטרס ורווחה נפשית',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615',
  },
];

const phases = [
  {
    phase: 'במהלך הטבילה',
    icon: '🧊',
    color: 'bg-blue-50 border-blue-100',
    titleColor: 'text-blue-800',
    text: 'עלייה זמנית בקורטיזול — הגוף מזהה סטרס חריף ומגייס אנרגיה להתמודדות עם הקור.',
  },
  {
    phase: 'שעות לאחר הטבילה',
    icon: '📉',
    color: 'bg-green-50 border-green-100',
    titleColor: 'text-green-800',
    text: 'כמה מחקרים מצאו רמת קורטיזול נמוכה יותר בהשוואה לרמת הבסיס — תחושת רגיעה ושיקום.',
  },
  {
    phase: 'בטווח הארוך (חשיפה חוזרת)',
    icon: '📈',
    color: 'bg-ice-50 border-ice-100',
    titleColor: 'text-navy-900',
    text: 'הגוף מסתגל — העלייה בקורטיזול לכל טבילה קטנה, ויכולת "ההירגעות" אחרי סטרס משתפרת.',
  },
];


// ── Article Schema (GEO — helps ChatGPT/Perplexity cite this page) ─────────────
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "קורטיזול, סטרס וטבילת מי קרח",
  "description": "הסבר מדעי על קורטיזול, ציר HPA וההשפעה של טבילת מי קרח מבוקרת על ויסות הסטרס",
  "url": "https://icing.co.il/cortisol",
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
  "about": "cortisol, stress, HPA axis, cold water immersion",
  "isPartOf": {
    "@type": "WebSite",
    "name": "ICING",
    "url": "https://icing.co.il"
  }
};
export default function CortisolPage() {
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
            קורטיזול וציר HPA<br />
            <span className="text-ice-400">ויסות הסטרס בטבילת קרח</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            קורטיזול הוא הורמון הסטרס המרכזי של הגוף, שעוזר לגייס אנרגיה ולנהל את תגובת הגוף
            למאמץ וללחץ. טבילה במים קרים היא סטרס קצר וחזק — אך בחשיפה מבוקרת וחוזרת,
            היא עשויה לשפר לטווח הארוך את ויסות תגובת הסטרס.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-ice-600/30 border border-ice-500/40 rounded-2xl px-6 py-3">
            <span className="text-3xl font-black text-ice-400">↓ קורטיזול</span>
            <span className="text-slate-300 text-sm">הסתגלות של ציר HPA בחשיפה חוזרת</span>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 px-6 bg-ice-50 border-b border-ice-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-ice-200 p-6 shadow-sm">
            <h2 className="text-lg font-black text-navy-900 mb-3">בקצרה</h2>
            <p className="text-slate-600 leading-relaxed">
              קורטיזול מופרש מבלוטת האדרנל בתגובה להפעלת ציר ה-HPA (היפותלמוס–היפופיזה–אדרנל),
              ותפקידו לסייע בגיוס אנרגיה, בוויסות מערכת החיסון ובהתמודדות עם עומס פיזי ונפשי.
              טבילת מי קרח יכולה לגרום בתחילה לעלייה זמנית בקורטיזול, אך לפי פרוטוקול מבוקר
              לאורך זמן — נמדדת ירידה במדדי סטרס ושיפור במצב רוח.
            </p>
          </div>
        </div>
      </section>

      {/* Three phases */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-navy-900 mb-8">התגובה לאורך הזמן</h2>
          <div className="space-y-4">
            {phases.map(p => (
              <div key={p.phase} className={`rounded-2xl border p-5 ${p.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <h3 className={`font-black text-lg ${p.titleColor}`}>{p.phase}</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Detailed explanation */}
          <h2 className="text-2xl font-black text-navy-900 mt-12 mb-6">הסבר מפורט</h2>
          <div className="space-y-5 text-slate-700 text-[17px] leading-relaxed">
            <p>
              קורטיזול הוא הורמון סטרס המופרש מבלוטת האדרנל בתגובה להפעלת ציר ה-HPA
              (היפותלמוס–היפופיזה–אדרנל), ותפקידו לסייע בגיוס אנרגיה, בוויסות מערכת החיסון
              ובהתמודדות עם עומס פיזי ונפשי. טבילה במים קרים היא סטרסור חריף שיכול לגרום
              בתחילת החשיפה לעלייה זמנית בקורטיזול.
            </p>
            <p>
              לאחר החשיפה, בכמה מחקרים נמצא כי רמת הקורטיזול דווקא נמוכה יותר כמה שעות אחרי
              הטבילה. בטבילה לפי פרוטוקול לאורך זמן, נמדדת ירידה במדדי סטרס ושיפור במצב רוח —
              מה שמרמז שטבילות קרות מבוקרות עשויות לאורך זמן לשפר את ויסות תגובת הסטרס
              ולהוריד את תגובת היתר של ציר ה-HPA.
            </p>
            <p>
              בטווח הארוך, חשיפה חוזרת ומדורגת לקור יכולה להפחית את גודל העלייה בקורטיזול
              בתגובה לכל טבילה (הסתגלות), ובכך לשפר את היכולת הפיזיולוגית ״להירגע״ אחרי סטרס
              ולהתמודד טוב יותר עם עומסים יומיומיים.
            </p>
          </div>

          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed">
            <p className="font-semibold text-navy-900 mb-1">⚠️ חשוב לדעת</p>
            <p>
              מדובר בסטרסור משמעותי. אנשים עם מחלות אדרנל, הפרעות הורמונליות או בעיות לחץ דם
              בלתי מאוזן צריכים להתייעץ עם רופא לפני שמתחילים בפרוטוקול טבילות קרות.
            </p>
          </div>

          <div className="mt-4">
            <a
              href="https://lifestylemedicine.stanford.edu/jumping-into-the-ice-bath-trend-mental-health-benefits-of-cold-water-immersion/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ice-600 hover:text-ice-800 text-sm font-semibold underline"
            >
              Stanford Lifestyle Medicine — Mental health benefits of cold water immersion ↗
            </a>
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
                <a
                  key={a.num}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-ice-500/50
                             rounded-2xl p-5 transition-all group"
                >
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
          <h2 className="text-2xl font-black mb-3">רוצה לאזן את הסטרס שלך?</h2>
          <p className="text-ice-100 mb-6">הצטרף לסדנת טבילה מודרכת ותרגיש את השפעת הקור בעצמך</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 bg-white text-ice-700 font-black px-8 py-3 rounded-2xl
                         hover:bg-ice-50 transition-colors shadow-lg text-lg">
              📅 הזמינו מקום עכשיו
            </Link>
            <Link href="/noradrenaline"
              className="inline-flex items-center gap-2 bg-ice-700 hover:bg-ice-800 text-white font-bold px-6 py-3 rounded-2xl
                         transition-colors text-sm">
              קרא על נוראדרנלין ←
            </Link>
          </div>
        </div>
      </section>

    </main>
    </>
  );
}
