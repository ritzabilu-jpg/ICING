import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'המדע מאחורי טבילת מי קרח | ICING',
  description: 'הבסיס המדעי לטבילה במי קרח — נוראדרנלין, קורטיזול, דופמין, מערכת החיסון ועוד, עם סימוכין ממחקרים peer-reviewed',
};

const stats = [
  { value: '+127%', label: 'נוראדרנלין', sub: 'טבילה ב-5°C' },
  { value: '+250%', label: 'דופמין', sub: 'לאחר הטבילה' },
  { value: '↓ קורטיזול', label: 'סטרס', sub: 'בחשיפה חוזרת' },
  { value: '57%', label: 'ירידה ב-IL-6', sub: 'מדדי דלקת' },
];

const topics = [
  {
    icon: '⚡',
    title: 'נוראדרנלין',
    description: 'ערנות, אנרגיה ותגובת "דריכות ולחץ". עלייה של עד פי 3–4 בטבילה.',
    href: '/noradrenaline',
    available: true,
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    titleColor: 'text-blue-900',
  },
  {
    icon: '🧠',
    title: 'קורטיזול וסטרס',
    description: 'ויסות ציר HPA, הפחתת סטרס כרוני ושיפור יכולת ההתמודדות.',
    href: '/cortisol',
    available: true,
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    titleColor: 'text-green-900',
  },
  {
    icon: '😊',
    title: 'דופמין ומוטיבציה',
    description: 'עלייה של 250% בדופמין — השפעה על מצב רוח, מוטיבציה ותחושת סיפוק.',
    href: '/dopamine',
    available: true,
    color: 'bg-purple-50 border-purple-200',
    titleColor: 'text-purple-900',
  },
  {
    icon: '🛡️',
    title: 'מערכת חיסון ודלקת',
    description: 'הפחתת מדדי דלקת, שיפור ריקוברי ותגובת מערכת החיסון.',
    href: '/inflammation',
    available: false,
    color: 'bg-orange-50 border-orange-200',
    titleColor: 'text-orange-900',
  },
  {
    icon: '🔥',
    title: 'שריפת שומן חום',
    description: 'הפעלת רקמת שומן חום (BAT) ועלייה בשריפת קלוריות.',
    href: '/brown-fat',
    available: false,
    color: 'bg-red-50 border-red-200',
    titleColor: 'text-red-900',
  },
  {
    icon: '🌊',
    title: 'מערכת העצבים הווגאלית',
    description: 'חיזוק עצב הוואגוס, שיפור ויסות עצמי ורגיעה לאחר סטרס.',
    href: '/vagus-nerve',
    available: false,
    color: 'bg-teal-50 border-teal-200',
    titleColor: 'text-teal-900',
  },
];

const articles = [
  {
    num: 1,
    title: 'Deliberate cold exposure causes significant increases in dopamine and norepinephrine',
    journal: 'iScience – Søberg S, Löfgren J et al. (2021)',
    note: 'עלייה של +250% בדופמין ו-+530% בנוראדרנלין לאחר טבילה ב-14°C',
    url: 'https://www.cell.com/iscience/fulltext/S2589-0042(21)01070-0',
  },
  {
    num: 2,
    title: 'Cold shock response and its physiological consequences',
    journal: 'Experimental Physiology – Tipton MJ et al. (2017)',
    note: 'סקירה מקיפה של תגובת cold shock — קצב לב, נשימה, לחץ דם',
    url: 'https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/EP086283',
  },
  {
    num: 3,
    title: 'Effects of cold-water immersion on health and wellbeing: A systematic review and meta-analysis',
    journal: 'PLOS ONE – Firth J et al. (2023)',
    note: 'סקירה שיטתית: שיפור בבריאות הנפש, הפחתת עייפות וכאב',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615',
  },
  {
    num: 4,
    title: 'Cold-water immersion for preventing and treating muscle soreness after exercise',
    journal: 'Cochrane Database – Bleakley C, McDonough S et al. (2012)',
    note: 'הפחתה משמעותית בכאב שרירים ושיפור ריקוברי בספורטאים',
    url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008262.pub2/full',
  },
  {
    num: 5,
    title: 'Plasma norepinephrine responses of man in cold water',
    journal: 'Journal of Applied Physiology – Martineau L, Jacobs I. (1977)',
    note: 'מחקר המקור למדידת נוראדרנלין בטבילת מי קרח',
    url: 'https://journals.physiology.org/doi/abs/10.1152/jappl.1977.43.2.216',
  },
  {
    num: 6,
    title: 'Cardiovascular and mood responses to an acute bout of cold water immersion',
    journal: 'Journal of Thermal Biology – Reed EL et al. (2024)',
    note: 'שיפור מצב רוח וירידה בקורטיזול שעות לאחר הטבילה',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10842018/',
  },
];

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-ice-500/20 text-ice-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            מדע הטבילה
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            הבסיס המדעי<br />
            <span className="text-ice-400">לטבילה במי קרח</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            טבילה מבוקרת במי קרח היא אחת ההתערבויות הפשוטות ביותר עם השפעות פיזיולוגיות
            מתועדות — מעלייה חדה בהורמוני ערנות ומצב רוח, ועד שיפור בוויסות הסטרס,
            הפחתת דלקת וחיזוק מערכת החיסון.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-ice-600 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black">{s.value}</div>
                <div className="font-bold mt-0.5">{s.label}</div>
                <div className="text-ice-200 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics grid */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-navy-900 mb-2">נושאים מדעיים</h2>
          <p className="text-slate-500 text-sm mb-8">לחץ על נושא לקריאה מפורטת עם סימוכין</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map(t => (
              t.available ? (
                <Link key={t.title} href={t.href}
                  className={`rounded-2xl border-2 p-5 transition-all cursor-pointer ${t.color} group`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-ice-600 text-xs font-bold bg-ice-100 px-2 py-0.5 rounded-full">קרא עוד ←</span>
                  </div>
                  <h3 className={`font-black text-lg mb-1 ${t.titleColor}`}>{t.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{t.description}</p>
                </Link>
              ) : (
                <div key={t.title}
                  className={`rounded-2xl border-2 p-5 opacity-55 ${t.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full">בקרוב</span>
                  </div>
                  <h3 className={`font-black text-lg mb-1 ${t.titleColor}`}>{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Key research */}
      <section className="py-16 px-6 bg-navy-900" id="articles">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-2">מחקרי מפתח</h2>
          <p className="text-slate-400 text-sm mb-8">מאמרים peer-reviewed שעליהם מבוסס הפרוטוקול שלנו</p>
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

      {/* CTA */}
      <section className="py-16 px-6 bg-ice-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-3">רוצה לחוות את המדע בגוף?</h2>
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
