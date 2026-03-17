/**
 * /immersion – Book a cold-water immersion session.
 * Packages: single ₪80 | 5-pack ₪350 | 10-pack ₪550
 * Time slots are managed by admins via /admin/lior?key=...
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Slot {
  id: string;
  slot_date: string;
  slot_time: string;
  max_participants: number;
  booked: number;
  available: boolean;
  notes?: string;
}

const PACKAGES = [
  {
    key: 'single',
    title: 'טבילה בודדת',
    price: 80,
    sessions: 1,
    badge: '',
    color: 'border-slate-200 hover:border-ice-400',
    selectedColor: 'border-ice-500 bg-ice-50',
    description:
      'טבילה באמבטיית קרח בהדרכת מדריך מוסמך מתבצעת בסביבה מבוקרת ובטוחה. המשתתף טובל במים הקרח, עד עשר דקות, תוך פיקוח מקצועי על הנתונים הפיזיולוגיים. המדריך מבטיח הסתגלות הדרגתית, שומר על בטיחות המשתתף, ומנחה בטכניקות לפי הצורך לפני, בזמן ואחרי הטבילה.',
  },
  {
    key: '5pack',
    title: 'חבילת 5 טבילות',
    price: 350,
    sessions: 5,
    badge: 'חיסכון של ₪50',
    color: 'border-slate-200 hover:border-ice-400',
    selectedColor: 'border-ice-500 bg-ice-50',
    description: '5 טבילות בהדרכה מקצועית. כל טבילה נקבעת בנפרד לפי לוח הזמנים הזמין.',
  },
  {
    key: '10pack',
    title: 'חבילת 10 טבילות',
    price: 550,
    sessions: 10,
    badge: '🔥 הכי משתלם',
    color: 'border-ice-300 hover:border-ice-500',
    selectedColor: 'border-ice-600 bg-ice-50',
    description: '10 טבילות בהדרכה מקצועית. חבילת השגרה המומלצת להתקדמות ממשית.',
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ImmersionPage() {
  const [slots, setSlots]           = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selectedPkg, setSelectedPkg]   = useState('single');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');
  const router = useRouter();

  useEffect(() => {
    // Pre-fill name from localStorage
    const saved = localStorage.getItem('visitor_name');
    if (saved) setName(saved);

    fetch('/api/immersion-slots')
      .then(r => r.json())
      .then((d: { slots: Slot[] }) => setSlots(d.slots ?? []))
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) { setError('יש לבחור מועד טבילה'); return; }
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/immersion-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: selectedSlot, name, phone, package_type: selectedPkg }),
    });
    const data = await res.json() as { success?: boolean; error?: string };
    setSubmitting(false);

    if (data.success) {
      localStorage.setItem('visitor_name', name);
      setDone(true);
    } else {
      setError(data.error ?? 'שגיאה בהרשמה');
    }
  }

  const pkg = PACKAGES.find(p => p.key === selectedPkg)!;

  if (done) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🧊</div>
          <h1 className="text-2xl font-black text-navy-900 mb-2">הרשמה התקבלה!</h1>
          <p className="text-slate-600 mb-6">
            {name}, נרשמת בהצלחה.<br />
            <span className="font-semibold text-ice-700">{pkg.title} – ₪{pkg.price}</span>
          </p>
          <button onClick={() => router.push('/')}
            className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors">
            חזרה לדף הבית
          </button>
        </div>
      </main>
    );
  }

  // Group slots by date
  const slotsByDate: Record<string, Slot[]> = {};
  for (const s of slots) {
    if (!slotsByDate[s.slot_date]) slotsByDate[s.slot_date] = [];
    slotsByDate[s.slot_date].push(s);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800" dir="rtl">

      {/* Hero */}
      <div className="text-center py-14 px-4">
        <div className="text-5xl mb-4">🧊</div>
        <h1 className="text-4xl font-black text-white mb-2">הזמנת טבילה</h1>
        <p className="text-ice-300 text-lg">בהדרכת מדריך מוסמך · רחובות</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        {/* Package selection */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-black text-navy-900 mb-4">בחר חבילה</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PACKAGES.map(p => (
              <button
                key={p.key}
                onClick={() => setSelectedPkg(p.key)}
                className={`relative text-right p-5 rounded-2xl border-2 transition-all ${
                  selectedPkg === p.key ? p.selectedColor : p.color + ' bg-white'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 right-4 bg-ice-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                )}
                <div className="font-black text-navy-900 text-base mb-1">{p.title}</div>
                <div className="text-3xl font-black text-ice-600">₪{p.price}</div>
                <div className="text-xs text-slate-500 mt-1">{p.sessions} טבילות</div>
              </button>
            ))}
          </div>
          {/* Description */}
          <p className="mt-5 text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-2xl p-4">
            {pkg.description}
          </p>
        </section>

        {/* Time slot selection */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-black text-navy-900 mb-4">בחר מועד לטבילה הראשונה</h2>

          {slotsLoading ? (
            <div className="text-center py-8 text-slate-400">
              <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              טוען מועדים...
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-2">📅</div>
              <p>אין מועדים זמינים כרגע.</p>
              <p className="text-sm mt-1">צרו קשר בוואטסאפ לתיאום.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div key={date}>
                  <p className="text-sm font-bold text-slate-500 mb-3">{formatDate(date)}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {daySlots.map(s => (
                      <button
                        key={s.id}
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          !s.available
                            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                            : selectedSlot === s.id
                            ? 'border-ice-500 bg-ice-50 text-ice-700'
                            : 'border-slate-200 hover:border-ice-400 text-navy-900'
                        }`}
                      >
                        <div className="text-xl font-black">{s.slot_time.slice(0, 5)}</div>
                        <div className="text-xs mt-1 text-slate-500">
                          {s.available
                            ? `${s.max_participants - s.booked} מקומות פנויים`
                            : 'מלא'}
                        </div>
                        {s.notes && <div className="text-xs text-slate-400 mt-0.5">{s.notes}</div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking form */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-black text-navy-900 mb-4">פרטים אישיים</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">שם מלא</label>
              <input
                required value={name} onChange={e => setName(e.target.value)}
                placeholder="שם מלא"
                className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">טלפון</label>
              <input
                required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="05X-XXXXXXX" type="tel"
                className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black
                         text-lg py-4 rounded-2xl transition-all shadow-lg shadow-ice-500/30"
            >
              {submitting ? 'שולח...' : `✅ אישור הרשמה – ₪${pkg.price}`}
            </button>
            <p className="text-center text-xs text-slate-400">התשלום מתבצע במקום לפני הטבילה</p>
          </form>
        </section>

      </div>
    </main>
  );
}
