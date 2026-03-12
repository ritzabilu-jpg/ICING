import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import WorkshopCard from '@/components/WorkshopCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import PersonalBookingModal from '@/components/PersonalBookingModal';

export const metadata: Metadata = {
  title: 'חוויות שוויץ המדע | אמבטיות קרח חולון',
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
  },
  {
    icon: '🎯',
    title: 'שיפור פוקוס',
    description:
      'הנוראדרנלין המשתחרר בטבילה משפר ערנות, ריכוז ותפקוד ' +
      'קוגניטיבי. אפקט נמשך שעות לאחר הסדנה.',
    stat: '↑ 40%',
    statLabel: 'שיפור בריכוז',
  },
  {
    icon: '💆',
    title: 'הורדת סטרס',
    description:
      'חשיפה חוזרת מאזנת את ציר HPA ומפחיתה רמות קורטיזול בטווח הארוך. ' +
      'הגוף לומד להגיב לסטרס בצורה מבוקרת יותר.',
    stat: '↓ קורטיזול',
    statLabel: 'הסתגלות של ציר HPA',
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
              <div key={b.title}
                   className="rounded-3xl bg-gradient-to-b from-ice-50 to-white
                              border-2 border-ice-100 p-8 hover:border-ice-300
                              hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-5">{b.icon}</div>
                <h3 className="text-xl font-black text-navy-900 mb-3">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{b.description}</p>
                <div className="border-t border-ice-100 pt-4">
                  <div className="text-2xl font-black text-ice-600">{b.stat}</div>
                  <div className="text-xs text-slate-500">{b.statLabel}</div>
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {workshopTypes.map(w => (
              <WorkshopCard key={w.type} {...w} />
            ))}
          </div>

          {/* Personal Workshop Card */}
          <div className="mt-10 max-w-md mx-auto bg-white rounded-3xl border-2 border-ice-300
                          shadow-xl p-8 text-center">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-2xl font-black text-navy-900 mb-1">סדנה אישית</h3>
            <p className="text-slate-500 text-sm mb-4">הדרכה אחד על אחד – בזמן שמתאים לך</p>
            <div className="text-4xl font-black text-ice-600 mb-1">₪500</div>
            <p className="text-xs text-slate-400 mb-4">לאדם · זמן ומועד גמישים</p>
            <ul className="text-sm text-slate-600 space-y-2 mb-6 text-right">
              {['מדריך אישי צמוד לכל אורך הסדנה','תוכנית מותאמת לצרכים שלך','גמישות מלאה בתיאום',
                'כולל תרגול נשימה + טבילה'].map(f => (
                <li key={f} className="flex items-center gap-2 justify-end">
                  <span>{f}</span><span className="text-ice-500">✓</span>
                </li>
              ))}
            </ul>
            <PersonalBookingModal />
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
            ממוקמים בלב חולון, נגישים בתחבורה ציבורית ובחניה פרטית
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact info */}
            <div className="space-y-8">
              <div className="bg-navy-800 rounded-3xl p-8 border border-navy-700">
                <h3 className="text-xl font-bold text-white mb-6">פרטי התקשרות</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">📍</span>
                    <div>
                      <p className="text-white font-semibold">רחוב סירני 52, חולון</p>
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
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScIsDk-_iYWYKqmiOSuXrfUqlFQcwL158lJzK5j88wKfcHnzg/viewform"
                     target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-4 text-slate-300 hover:text-ice-400 transition-colors">
                    <span className="text-2xl">📋</span>
                    <span className="text-sm underline">טופס הרשמה מהיר</span>
                  </a>
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

            {/* Google Maps */}
            <div className="rounded-3xl overflow-hidden h-80 lg:h-96 shadow-2xl border border-navy-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.0!2d34.7765!3d32.0127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAwJzQ1LjciTiAzNMKwNDYnMzUuNCJF!5e0!3m2!1siw!2sil!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום חוויות שוויץ המדע – רחוב סירני 52, חולון"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
