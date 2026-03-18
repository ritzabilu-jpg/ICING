/**
 * /immersion – Book a cold-water immersion session.
 * Packages: single ₪80 | 5-pack ₪350 | 10-pack ₪550
 * Time slots are managed by admins via /admin/lior?key=...
 */
'use client';

import { useState, useEffect, useMemo } from 'react';
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
    description:
      'טבילה באמבטיית קרח בהדרכת מדריך מוסמך. בסביבה מבוקרת ובטוחה, עד עשר דקות, תוך פיקוח מקצועי.',
  },
  {
    key: '5pack',
    title: 'חבילת 5 טבילות',
    price: 350,
    sessions: 5,
    badge: 'חיסכון של ₪50',
    description: '5 טבילות בהדרכה מקצועית. כל טבילה נקבעת בנפרד לפי לוח הזמנים הזמין.',
  },
  {
    key: '10pack',
    title: 'חבילת 10 טבילות',
    price: 550,
    sessions: 10,
    badge: '🔥 הכי משתלם',
    description: '10 טבילות בהדרכה מקצועית. חבילת השגרה המומלצת להתקדמות ממשית.',
  },
];

const HE_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const HE_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function formatDateHe(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy-800 text-white text-sm font-black shrink-0">
      {n}
    </span>
  );
}

interface CalendarProps {
  slots: Slot[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
}

function Calendar({ slots, selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const maxYear = currentMonth + 3 >= 12
    ? currentYear + 1
    : currentYear;
  const maxMonth = (currentMonth + 3) % 12;

  const isBeforeMin = viewYear < currentYear || (viewYear === currentYear && viewMonth <= currentMonth);
  const isAfterMax = viewYear > maxYear || (viewYear === maxYear && viewMonth >= maxMonth);

  function prevMonth() {
    if (isBeforeMin) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (isAfterMax) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const availableDates = useMemo(() => {
    const s = new Set<string>();
    for (const sl of slots) {
      if (sl.available) s.add(sl.slot_date);
    }
    return s;
  }, [slots]);

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Pad start: Sunday is column 0 in Hebrew convention
  const cells: (number | null)[] = Array(firstDayOfMonth).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad end to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        {/* RTL: next month is on the left → use › (right arrow visually = next) on LEFT side */}
        <button
          onClick={nextMonth}
          disabled={isAfterMax}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-navy-800 hover:bg-ice-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="חודש הבא"
        >
          ‹
        </button>
        <span className="font-black text-navy-900 text-base">
          {HE_MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={prevMonth}
          disabled={isBeforeMin}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-navy-800 hover:bg-ice-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="חודש קודם"
        >
          ›
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {HE_DAYS.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateKey = toDateKey(viewYear, viewMonth, day);
          const cellDate = new Date(viewYear, viewMonth, day);
          const isPast = cellDate < today;
          const hasSlots = availableDates.has(dateKey);
          const isSelected = selectedDate === dateKey;
          const isDisabled = isPast || !hasSlots;

          let cls =
            'w-full aspect-square rounded-xl text-sm font-semibold flex items-center justify-center transition-all ';
          if (isSelected) {
            cls += 'bg-navy-800 text-white shadow-md';
          } else if (isDisabled) {
            cls += 'text-slate-300 cursor-not-allowed';
          } else {
            cls += 'bg-ice-100 border border-ice-300 text-navy-900 hover:bg-ice-200 cursor-pointer';
          }

          return (
            <button
              key={dateKey}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectDate(dateKey)}
              className={cls}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-slate-500 justify-end flex-wrap">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded-md bg-ice-100 border border-ice-300" />
          פנוי
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded-md bg-navy-800" />
          נבחר
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded-md bg-slate-100 border border-slate-200" />
          אין מועדים
        </span>
      </div>
    </div>
  );
}

export default function ImmersionPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  // Step state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedPkg, setSelectedPkg] = useState('single');

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('visitor_name');
    if (saved) setName(saved);

    fetch('/api/immersion-slots')
      .then(r => r.json())
      .then((d: { slots: Slot[] }) => setSlots(d.slots ?? []))
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, []);

  const slotsForDate = useMemo(
    () => slots.filter(s => s.slot_date === selectedDate),
    [slots, selectedDate],
  );

  // When date changes, reset slot selection
  function handleSelectDate(d: string) {
    setSelectedDate(d);
    setSelectedSlotId('');
  }

  const pkg = PACKAGES.find(p => p.key === selectedPkg)!;
  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlotId) { setError('יש לבחור מועד טבילה'); return; }
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/immersion-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot_id: selectedSlotId,
        name,
        phone,
        package_type: selectedPkg,
      }),
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

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🧊</div>
          <h1 className="text-2xl font-black text-navy-900 mb-2">הרשמה התקבלה!</h1>
          <p className="text-slate-600 mb-6">
            {name}, נרשמת בהצלחה.
            <br />
            <span className="font-semibold text-ice-700">{pkg.title} – ₪{pkg.price}</span>
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            חזרה לדף הבית
          </button>
        </div>
      </main>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800" dir="rtl">

      {/* Hero */}
      <div className="text-center py-14 px-4">
        <div className="text-5xl mb-4">🧊</div>
        <h1 className="text-4xl font-black text-white mb-2">קבע מועד לטבילה</h1>
        <p className="text-ice-300 text-lg">בהדרכת מדריך מוסמך · חולון</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

        {/* ── Step 1: Calendar ──────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <StepBadge n={1} />
            <h2 className="text-xl font-black text-navy-900">בחר תאריך</h2>
          </div>

          {slotsLoading ? (
            <div className="text-center py-8 text-slate-400">
              <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              טוען מועדים...
            </div>
          ) : (
            <Calendar
              slots={slots}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
        </section>

        {/* ── Step 2: Time slots (only after date selected) ─────────────────── */}
        {selectedDate && (
          <section className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={2} />
              <div>
                <h2 className="text-xl font-black text-navy-900">בחר שעה</h2>
                <p className="text-sm text-slate-500 mt-0.5">{formatDateHe(selectedDate)}</p>
              </div>
            </div>

            {slotsForDate.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-4xl mb-2">📅</div>
                <p>אין מועדים זמינים בתאריך זה.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slotsForDate.map(s => (
                  <button
                    key={s.id}
                    disabled={!s.available}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      !s.available
                        ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                        : selectedSlotId === s.id
                        ? 'border-ice-500 bg-ice-50 text-ice-700'
                        : 'border-slate-200 hover:border-ice-400 text-navy-900'
                    }`}
                  >
                    <div className="text-lg font-black">{s.slot_time.slice(0, 5)}</div>
                    <div className="text-xs mt-1 text-slate-500 leading-tight">
                      {s.available
                        ? `${s.max_participants - s.booked} פנויים`
                        : 'מלא'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Step 3: Package (only after slot selected) ────────────────────── */}
        {selectedSlotId && (
          <section className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={3} />
              <h2 className="text-xl font-black text-navy-900">בחר חבילה</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {PACKAGES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPkg(p.key)}
                  className={`relative text-right p-5 rounded-2xl border-2 transition-all ${
                    selectedPkg === p.key
                      ? 'border-ice-500 bg-ice-50'
                      : 'border-slate-200 hover:border-ice-400 bg-white'
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

            <p className="mt-5 text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-2xl p-4">
              {pkg.description}
            </p>
          </section>
        )}

        {/* ── Step 4: Personal details + summary (only after slot selected) ─── */}
        {selectedSlotId && (
          <section className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge n={4} />
              <h2 className="text-xl font-black text-navy-900">פרטים אישיים</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">שם מלא</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="שם מלא"
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">טלפון</label>
                <input
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05X-XXXXXXX"
                  type="tel"
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              {/* Summary card */}
              <div className="bg-ice-50 border border-ice-200 rounded-2xl p-4 text-sm space-y-2">
                <div className="font-black text-navy-900 mb-1 text-base">סיכום הזמנה</div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">תאריך</span>
                  <span>{formatDateHe(selectedDate)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">שעה</span>
                  <span>{selectedSlot?.slot_time.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">חבילה</span>
                  <span>{pkg.title}</span>
                </div>
                <div className="border-t border-ice-200 pt-2 flex justify-between font-black text-navy-900 text-base">
                  <span>סה״כ לתשלום</span>
                  <span>₪{pkg.price}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black
                           text-lg py-4 rounded-2xl transition-all shadow-lg shadow-ice-500/30"
              >
                {submitting ? 'שולח...' : `✅ אישור הרשמה – ₪${pkg.price}`}
              </button>
              <p className="text-center text-xs text-slate-400">התשלום מתבצע במקום לפני הטבילה</p>
            </form>
          </section>
        )}

      </div>
    </main>
  );
}
