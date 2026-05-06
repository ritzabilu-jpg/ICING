'use client';

import type { WorkshopType } from '@/types';

interface WorkshopTypeSelectorProps {
  onSelect: (type: WorkshopType) => void;
}

const types = [
  {
    type: 'individual' as WorkshopType,
    icon: '🧊',
    title: 'יחידים בקבוצה',
    description: 'חוויה אישית בתוך קבוצה קטנה ותומכת',
    price: '₪300',
    capacity: 'עד 10 משתתפים',
    duration: '~90 דקות',
    highlight: true,
  },
  {
    type: 'couple' as WorkshopType,
    icon: '❄️',
    title: 'סדנת זוגות',
    description: 'חוויה אינטימית ומחזקת לשניים',
    price: '₪800',
    capacity: '2 משתתפים',
    duration: '~90 דקות',
    highlight: false,
  },
  {
    type: 'one-on-one' as WorkshopType,
    icon: '⭐',
    title: 'סדנה אישית אחד על אחד',
    description: 'מדריך אישי צמוד, תוכנית מותאמת, זמן גמיש',
    price: '₪550',
    capacity: 'משתתף אחד',
    duration: '~90 דקות',
    highlight: false,
  },
  {
    type: 'team' as WorkshopType,
    icon: '🏔️',
    title: 'סדנאות לקבוצות מאורגנות',
    description: 'גיבוש וחוסן לצוותי עבודה, לקבוצות חברתיות וספורט פנאי',
    price: 'לפי הצעה',
    capacity: 'מ-5 משתתפים ומעלה',
    duration: 'לפי הזמנה',
    highlight: false,
    whatsapp: true,
  },
];

export default function WorkshopTypeSelector({ onSelect }: WorkshopTypeSelectorProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-navy-900 mb-2">שלב 1: בחרו סוג סדנה</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {types.map(t => (
          <button
            key={t.type}
            onClick={() => t.whatsapp
              ? window.open('https://wa.me/972552482441', '_blank')
              : onSelect(t.type)
            }
            className={`group relative flex flex-col rounded-3xl border-2 p-7 text-right transition-all duration-300
                         hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4
                         focus:ring-ice-400 active:scale-95
                         ${t.highlight
                           ? 'bg-navy-900 border-ice-500 hover:border-ice-400'
                           : 'bg-white border-ice-100 hover:border-ice-400 shadow-md'
                         }`}
            aria-label={`בחר ${t.title}`}
          >
            {t.highlight && (
              <div className="absolute -top-3 right-1/2 translate-x-1/2">
                <span className="bg-ice-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  הכי פופולרי
                </span>
              </div>
            )}

            {/* Compact view – always visible */}
            <div className="text-4xl mb-4">{t.icon}</div>
            <h3 className={`text-lg font-black mb-2 ${t.highlight ? 'text-white' : 'text-navy-900'}`}>
              {t.title}
            </h3>

            {/* Expanded details – hidden by default, shown on hover */}
            <div className="overflow-hidden max-h-0 group-hover:max-h-96 transition-all duration-300 ease-in-out">
              <p className={`text-sm mb-5 ${t.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                {t.description}
              </p>

              <div className={`border-t pt-4 space-y-1.5 text-sm
                               ${t.highlight ? 'border-navy-700' : 'border-slate-100'}`}>
                <div className={`flex justify-between ${t.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>⏱ {t.duration}</span>
                  <span>👥 {t.capacity}</span>
                </div>
                <div className={`text-xl font-black ${t.highlight ? 'text-ice-400' : 'text-ice-600'}`}>
                  {t.price}
                </div>
              </div>

              <div className={`mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl
                               font-bold text-sm transition-all
                               ${t.highlight
                                 ? 'bg-ice-500 text-white group-hover:bg-ice-400'
                                 : 'bg-navy-900 text-white group-hover:bg-navy-700'
                               }`}>
                {t.whatsapp ? 'צור קשר כדי לתפור לכם סדנה מתאימה' : 'בחרו ועברו לתאריך'}
                <span>{t.whatsapp ? '💬' : '→'}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
