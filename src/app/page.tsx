import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import WorkshopCard from '@/components/WorkshopCard';
import TestimonialsSection from '@/components/TestimonialsSection';

export const revalidate = 60; // re-fetch reviews every 60 seconds
import WelcomeGreeting from '@/components/WelcomeGreeting';

export const metadata: Metadata = {
  title: 'חוויות שוויץ המדע | אמבטיות קרח רחובות',
};

const workshopTypes = [
  {
    type: 'individual' as const,
    icon: '🧊',
    title: 'סדנת יחידים',
    subtitle: 'בתוך קבוצה קטנה ותומכת',
    description:
      'חוויה אישית עוצמתית בתוך קבוצה של עד 10 משתתפים. תרגול נשימה מודרך, ' +
      'הכנה מנטלית, וטבילה בליווי מדריך מוסמך. מתאים לכל רמת ניסיון.',
    price: '₪300',
    priceNote: 'למשתתף',
    duration: 'כ-90 דקות',
    capacity: 'עד 10 משתתפים',
    highlight: true,
    features: [
      { icon: '🫁', text: '20 דקות תרגול נשימה מנחה' },
      { icon: '🧊', text: 'טבילה מלאה ב-10-12 מעלות' },
      { icon: '🧠', text: 'פרוטוקול מבוסס מדעית' },
      { icon: '☕', text: 'שתייה חמה + שיתוף לאחר' },
      { icon: '📸', text: 'צילום קבוצתי זיכרון' },
    ],
  },
  {
    type: 'couple' as const,
    icon: '❄️',
    title: 'סדנת זוגות',
    subtitle: 'חוויה אינטימית ומחזקת',
    description:
      'חוויה זוגית בלתי נשכחת. תמיכה הדדית בתוך המים, חיזוק הקשר הרגשי, ' +
      'ויצירת זיכרון משותף של גבורה. מושלם לזוגות שרוצים הרפתקה אחרת.',
    price: '₪800',
    priceNote: 'לשניים',
    duration: 'כ-90 דקות',
    capacity: '2 משתתפים בלבד',
    highlight: false,
    features: [
      { icon: '💑', text: 'הדרכה פרטית לשניים' },
      { icon: '🫁', text: 'תרגול נשימה משותף' },
      { icon: '🧊', text: 'טבילה בתמיכה הדדית' },
      { icon: '🕯️', text: 'אווירה אינטימית ואישית' },
      { icon: '📸', text: 'תמונות זיכרון לזוג' },
    ],
  },
  {
    type: 'one-on-one' as const,
    icon: '⭐',
    title: 'סדנה אישית אחד על אחד',
    subtitle: 'הדרכה פרטית ומותאמת אישית',
    description:
      'מדריך אישי צמוד לכל אורך הסדנה. תוכנית מותאמת בדיוק לצרכים ולמטרות שלך, ' +
      'בגמישות מלאה בתיאום המועד. החוויה האינטנסיבית והיעילה ביותר.',
    price: '₪550',
    priceNote: 'לאדם',
    duration: 'כ-90 דקות',
    capacity: 'משתתף אחד בלבד',
    highlight: false,
    features: [
      { icon: '🎯', text: 'מדריך אישי צמוד לכל הסדנה' },
      { icon: '📋', text: 'תוכנית מותאמת אישית' },
      { icon: '🕐', text: 'גמישות מלאה בתיאום מועד' },
      { icon: '🫁', text: 'תרגול נשימה + טבילה מלאה' },
      { icon: '📞', text: 'ליווי והמשך אחרי הסדנה' },
    ],
  },
  {
    type: 'team' as const,
    icon: '🏔️',
    title: 'סדנת קבוצות',
    subtitle: 'לצוותי עבודה ואירגונים',
    description:
      'גיבוש צוות עוצמתי, מניעת שחיקה, ובניית חוסן מנטלי קבוצתי. ' +
      'ניסיון שיוצר סיפורים ומחזק ביטחון עצמי קולקטיבי. מחיר מותאם לגודל הקבוצה.',
    price: 'מחיר מיוחד',
    priceNote: 'לפי גודל הקבוצה',
    duration: 'לפי הזמנה',
    capacity: 'מ-5 עד 20+ משתתפים',
    highlight: false,
    features: [
      { icon: '🤝', text: 'Team Building אמיתי' },
      { icon: '🛡️', text: 'חוסן מנטלי קבוצתי' },
      { icon: '🏢', text: 'מנגנוני מניעת שחיקה' },
      { icon: '📊', text: 'סיכום ובריפינג לאחר' },
      { icon: '🎓', text: 'סרטיפיקט השתתפות' },
    ],
  },
];

const benefits = [
  {
    icon: '🧠',
    title: 'חוסן מנטלי',
    description:
      'טבילה חוזרת מאמנת את מערכת העצבים להתמודד עם לחץ, ' +
      'פחד ואי-ודאות. המוח לומד "אני יכול" ברמה מולקולרית.',
    stat: '+127%',
    statLabel: 'עלייה בנוראדרנלין',
    link: '/noradrenaline',
  },
  {
    icon: '🎯',
    title: 'שיפור פוקוס',
    description:
      'הנוראדרנלין המשתחרר בטבילה משפר ערנות, ריכוז ותפקוד ' +
      'קוגניטיבי. אפקט נמשך שעות לאחר הסדנה.',
    stat: '↑ 40%',
    statLabel: 'שיפור בריכוז',
    link: '/noradrenaline',
  },
  {
    icon: '💆',
    title: 'הורדת סטרס',
    description:
      'חשיפה חוזרת מאזנת את ציר HPA ומפחיתה רמות קורטיזול בטווח הארוך. ' +
      'הגוף לומד להגיב לסטרס בצורה מבוקרת יותר.',
    stat: '↓ קורטיזול',
    statLabel: 'הסתגלות של ציר HPA',
    link: '/cortisol',
  },
];

const agendaSteps = [
  { time: '15 דק\'', icon: '👋', title: 'קבלת פנים ותדריך', description: 'היכרות עם הקבוצה, הסבר על התהליך, מילוי טופס בריאות' },
  { time: '20 דק\'', icon: '🫁', title: 'תרגול נשימה', description: 'טכניקות נשימה מתקדמות להרגעת מערכת העצבים לפני הטבילה' },
  { time: '35 דק\'', icon: '🧊', title: 'טבילה מודרכת', description: 'טבילות בליווי מדריך צמוד, 3-5 דקות ב-10-12 מעלות' },
  { time: '15 דק\'', icon: '☕', title: 'התחממות ושיתוף', description: 'התחממות הדרגתית, שתייה חמה, שיתוף חוויות בקבוצה' },
  { time: '5 דק\'', icon: '📸', title: 'סיכום ותמונות', description: 'הנחיות להמשך היום, צילום קבוצתי לזיכרון' },
];

const faqs = [
  {
    q: 'האם צריך ניסיון קודם?',
    a: 'לא! הסדנאות מתאימות לכל רמת ניסיון. המדריכים מסבירים הכל מהתחלה.',
  },
  {
    q: 'מה הגיל המינימלי?',
    a: 'גיל 18+ לסדנאות הרגילות. צעירים מגיל 16 בליווי הורה ובאישור מנהל.',
  },
  {
    q: 'מה להביא?',
    a: 'בגד ים, מגבת גדולה, בגדים חמים להחלפה. שתייה חמה בתרמוס – אופציונלי.',
  },
  {
    q: 'מתי לא כדאי להגיע?',
    a: 'מחלות לב לא מאוזנות, הריון, ל"ד גבוה לא מטופל, תסמונת ריינו, פצעים פתוחים. ספרו לנו מראש בכל מצב רפואי.',
  },
  {
    q: 'מה מדיניות הביטולים?',
    a: 'ביטול עד 48 שעות – החזר מלא. 24-48 שעות – זיכוי לסדנה. פחות מ-24 שעות – ללא החזר.',
  },
  {
    q: 'כמה פעמים אפשר להגיע בשבוע?',
    a: 'מומלץ להתחיל בפעם אחת בשבוע ולהתקדם לפי תגובת הגוף. ישנם לקוחות שמגיעים 2-3 פעמים בשבוע.',
  },
];

export default function HomePage() {
  return (
    <>
      <WelcomeGreeting />
      <Hero />

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title">למה אמבטיות קרח?</h2>
          <p className="section-subtitle">
            שינויים ביוכימיים מוכחים מדעית שמתרחשים בגופך בכל טבילה
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map(b => (
              <Link key={b.title} href={b.link || '#'}
                   className="rounded-3xl bg-gradient-to-b from-ice-50 to-white
                              border-2 border-ice-100 p-8 hover:border-ice-300
                              hover:shadow-lg transition-all duration-300 group block">
                <div className="text-5xl mb-5">{b.icon}</div>
                <h3 className="text-xl font-black text-navy-900 mb-3 group-hover:text-ice-700 transition-colors">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{b.description}</p>
                <div className="border-t border-ice-100 pt-4">
                  <div className="text-2xl font-black text-ice-600">{b.stat}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    {b.statLabel}
                    <span className="text-ice-400 group-hover:translate-x-[-3px] transition-transform">← קרא עוד</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Types */}
      <section id="workshop-types" className="py-24 bg-ice-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title">סוגי הסדנאות</h2>
          <p className="section-subtitle">
            בחרו את הפורמט המתאים לכם
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {workshopTypes.map(w => (
              <WorkshopCard key={w.type} {...w} />
            ))}
          </div>

        </div>
      </section>

      {/* Agenda Section */}
      <section id="agenda" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="section-title">מה מחכה לכם בסדנה?</h2>
          <p className="section-subtitle">
            סדנה בת כ-90 דקות מתוכננת ומבוצעת בקפידה
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-ice-200 hidden sm:block" />

            <div className="space-y-6">
              {agendaSteps.map((step, i) => (
                <div key={i} className="relative flex gap-6 items-start sm:pe-0">
                  {/* Icon circle */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white border-2
                                  border-ice-300 rounded-full flex items-center justify-center
                                  text-2xl shadow-sm">
                    {step.icon}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100
                                  shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-navy-900">{step.title}</h3>
                      <span className="text-xs bg-ice-100 text-ice-700 px-2 py-0.5 rounded-full font-medium">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA after agenda */}
          <div className="mt-12 text-center">
            <Link href="/booking" className="btn-primary text-lg px-10 py-4">
              הזמינו מקום עכשיו
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="section-title">שאלות נפוצות</h2>
          <p className="section-subtitle">
            כל מה שרציתם לדעת לפני שמגיעים
          </p>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border-2 border-ice-100 rounded-2xl overflow-hidden
                           hover:border-ice-300 transition-colors"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer
                                    font-semibold text-navy-900 list-none">
                  {faq.q}
                  <span className="text-ice-500 group-open:rotate-180 transition-transform duration-200 text-xl">
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-ice-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-white mb-4">
            איך מגיעים אלינו?
          </h2>
          <p className="text-xl text-center text-slate-400 mb-16 max-w-xl mx-auto">
            ממוקמים בלב רחובות, נגישים בתחבורה ציבורית ובחניה פרטית
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <div className="bg-navy-800 rounded-3xl p-8 border border-navy-700 flex-1">
                <h3 className="text-xl font-bold text-white mb-6">פרטי התקשרות</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">📍</span>
                    <div>
                      <p className="text-white font-semibold">רחוב סירני 52, רחובות</p>
                      <p className="text-slate-400 text-sm">מתחם הבריכה הטיפולית</p>
                    </div>
                  </div>
                  <a href="tel:089310715"
                     className="flex items-center gap-4 text-slate-300 hover:text-ice-400 transition-colors">
                    <span className="text-2xl">📞</span>
                    <span className="font-semibold text-lg">08-9310715</span>
                  </a>
                  <a href="tel:089310716"
                     className="flex items-center gap-4 text-slate-300 hover:text-ice-400 transition-colors">
                    <span className="text-2xl">📞</span>
                    <span className="font-semibold text-lg">08-9310716</span>
                  </a>
                  <Link href="/contact"
                     className="flex items-center gap-4 text-slate-300 hover:text-ice-400 transition-colors">
                    <span className="text-2xl">✉️</span>
                    <span className="text-sm underline">שלח לנו הודעה</span>
                  </Link>
                </div>
              </div>

              <Link
                href="/booking"
                className="flex items-center justify-center gap-3 w-full
                           bg-ice-500 hover:bg-ice-600 text-white font-bold
                           py-5 rounded-2xl text-xl transition-all hover:scale-105
                           shadow-xl shadow-ice-500/30"
              >
                <span>🧊</span>
                הזמינו מקום עכשיו
              </Link>
            </div>

            {/* Google Maps + Waze */}
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl overflow-hidden flex-1 min-h-72 shadow-2xl border border-navy-700">
                <iframe
                  src="https://maps.google.com/maps?q=חיים+סירני+52+רחובות&output=embed&hl=he"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מיקום חוויות שוויץ המדע – רחוב סירני 52, רחובות"
                />
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.google.com/maps/place/%D7%9E%D7%AA%D7%A0%22%D7%A1+%D7%97%D7%95%D7%95%D7%99%D7%95%D7%AA+%D7%A9%D7%95%D7%95%D7%99%D7%A5+%D7%94%D7%9E%D7%93%D7%A2%E2%80%AD/@31.900446,34.8231278,17.5z/data=!4m6!3m5!1s0x1502b65515e7aaab:0xb26bcc81189c0b68!8m2!3d31.9006165!4d34.8199625!16s%2Fg%2F1ydkhrmny?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIPD2ASoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1
                             bg-white hover:bg-slate-100 text-slate-800 font-bold
                             py-4 rounded-2xl text-lg transition-all hover:scale-105
                             shadow-lg border border-slate-200"
                >
                  <span className="text-2xl">📍</span>
                  Google Maps
                </a>
                <a
                  href="https://waze.com/ul?ll=31.9006165,34.8199625&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1
                             bg-[#05c8f7] hover:bg-[#04b0d9] text-white font-bold
                             py-4 rounded-2xl text-lg transition-all hover:scale-105
                             shadow-lg"
                >
                  <span className="text-2xl">🗺️</span>
                  Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
