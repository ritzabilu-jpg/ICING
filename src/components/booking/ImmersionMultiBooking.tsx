'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Slot {
  id: string;
  slot_date: string;
  slot_time: string;
  max_participants: number;
  booked: number;
  available: number;
  notes?: string;
}

interface ImmersionMultiBookingProps {
  onBack: () => void;
}

const PACKAGES = [
  { key: 'single',  label: 'טבילה בודדת',       price: 80,  maxDates: 1  },
  { key: '5pack',   label: 'חבילת 5 טבילות',     price: 350, maxDates: 5  },
  { key: '10pack',  label: 'חבילת 10 טבילות',    price: 550, maxDates: 10 },
  { key: 'monthly', label: 'חופשי חודשי',         price: 600, maxDates: 30 },
] as const;

type PackageKey = typeof PACKAGES[number]['key'];

const HEB_MONTHS = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
];
const HEB_DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatSlotDate(dateStr: string, timeStr: string): string {
  const [y, m, day] = dateStr.split('-');
  const time = timeStr.slice(0, 5);
  return `${day}/${m}/${y.slice(2)} ${time}`;
}

export default function ImmersionMultiBooking({ onBack }: ImmersionMultiBookingProps) {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<PackageKey | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // array of YYYY-MM-DD
  const [timeSelections, setTimeSelections] = useState<Record<string, string>>({}); // date -> slot id
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-indexed

  useEffect(() => {
    fetch('/api/immersion-slots')
      .then(r => r.json())
      .then(d => {
        setSlots(d.slots ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const todayYMD = toYMD(new Date());

  const availableSlots = slots.filter(s => s.available > 0 && s.slot_date >= todayYMD);
  const firstAvailable = availableSlots[0];

  // Set of dates that have available slots
  const availableDatesSet = new Set(availableSlots.map(s => s.slot_date));

  const pkg = PACKAGES.find(p => p.key === selectedPkg);
  const maxDates = pkg?.maxDates ?? 1;

  function toggleDate(ymd: string) {
    if (!pkg) return;
    if (ymd < todayYMD) return;
    if (!availableDatesSet.has(ymd)) return;

    setSelectedDates(prev => {
      if (prev.includes(ymd)) {
        // Deselect
        setTimeSelections(ts => { const n = { ...ts }; delete n[ymd]; return n; });
        return prev.filter(d => d !== ymd);
      }
      if (prev.length >= maxDates) return prev; // already at limit
      return [...prev, ymd].sort();
    });
  }

  function setTime(date: string, slotId: string) {
    setTimeSelections(ts => ({ ...ts, [date]: slotId }));
  }

  function prevMonth() {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  }
  function nextMonth() {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  }

  // Build calendar grid
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  // In Israel week starts Sunday (0)
  const startOffset = firstDay.getDay(); // 0=Sun
  const totalCells = startOffset + lastDay.getDate();
  const rows = Math.ceil(totalCells / 7);

  const allDatesSelected = selectedDates.length >= maxDates;

  // Check if all selected dates have a time chosen
  const allTimesSelected = selectedDates.length > 0 &&
    selectedDates.every(d => !!timeSelections[d]);

  function handleCheckout() {
    if (!allTimesSelected || !selectedPkg) return;
    const slotIds = selectedDates.map(d => timeSelections[d]);
    const firstId = slotIds[0];
    const extras = slotIds.slice(1).join(',');
    const url = `/checkout/immersion-${firstId}?pkg=${selectedPkg}${extras ? `&extraSlots=${extras}` : ''}`;
    router.push(url);
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        טוען חלונות טבילה...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-navy-900">טבילות במים קרים</h2>
        <button
          onClick={onBack}
          className="text-sm text-ice-600 hover:text-ice-700 font-semibold border border-ice-200 rounded-xl px-3 py-1.5 hover:bg-ice-50 transition-colors"
        >
          ← שנה סוג
        </button>
      </div>

      {/* First available slot */}
      {firstAvailable && (
        <div className="bg-ice-50 border border-ice-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-2xl">🧊</span>
          <div>
            <p className="text-xs text-slate-500 font-semibold">הטבילה הפנויה הקרובה:</p>
            <p className="text-navy-900 font-black text-lg">
              {formatSlotDate(firstAvailable.slot_date, firstAvailable.slot_time)}
            </p>
          </div>
        </div>
      )}

      {/* Package selector */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-3">בחרו חבילה:</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PACKAGES.map(p => (
            <button
              key={p.key}
              onClick={() => {
                setSelectedPkg(p.key);
                setSelectedDates([]);
                setTimeSelections({});
              }}
              className={`rounded-2xl border-2 p-3 text-center transition-all
                ${selectedPkg === p.key
                  ? 'border-ice-500 bg-ice-50 ring-2 ring-ice-300'
                  : 'border-slate-200 bg-white hover:border-ice-300'
                }`}
            >
              <div className="font-black text-navy-900 text-sm">{p.label}</div>
              <div className="text-ice-600 font-bold text-lg mt-0.5">₪{p.price}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {p.maxDates >= 30 ? 'עד 30 תאריכים' : `${p.maxDates} ${p.maxDates === 1 ? 'תאריך' : 'תאריכים'}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      {selectedPkg && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
              aria-label="חודש הבא"
            >
              ‹
            </button>
            <span className="font-black text-navy-900">
              {HEB_MONTHS[calendarMonth]} {calendarYear}
            </span>
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
              aria-label="חודש קודם"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {HEB_DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: rows * 7 }).map((_, i) => {
              const dayNum = i - startOffset + 1;
              if (dayNum < 1 || dayNum > lastDay.getDate()) {
                return <div key={i} />;
              }
              const ymd = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isPast = ymd < todayYMD;
              const hasSlot = availableDatesSet.has(ymd);
              const isSelected = selectedDates.includes(ymd);
              const isDisabled = isPast || !hasSlot || (!isSelected && allDatesSelected);

              return (
                <button
                  key={i}
                  onClick={() => toggleDate(ymd)}
                  disabled={isDisabled}
                  className={`relative mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${isSelected
                      ? 'bg-ice-500 text-white shadow-md'
                      : isPast
                      ? 'text-slate-300 cursor-not-allowed'
                      : !hasSlot
                      ? 'text-slate-400 cursor-not-allowed'
                      : allDatesSelected
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-navy-900 hover:bg-ice-100 cursor-pointer'
                    }`}
                >
                  {dayNum}
                  {hasSlot && !isSelected && !isPast && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDates.length > 0 && (
            <p className="text-xs text-center text-slate-400 mt-3">
              {selectedDates.length} / {maxDates} תאריכים נבחרו
            </p>
          )}
        </div>
      )}

      {/* Time selection per date */}
      {selectedDates.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-600">בחרו שעה לכל תאריך:</p>
          {selectedDates.map(date => {
            const slotsForDate = availableSlots.filter(s => s.slot_date === date);
            const [y, m, d] = date.split('-');
            const displayDate = `${d}/${m}/${y.slice(2)}`;
            return (
              <div key={date} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <span className="font-bold text-navy-900 text-sm min-w-[70px]">{displayDate}</span>
                <select
                  value={timeSelections[date] ?? ''}
                  onChange={e => setTime(date, e.target.value)}
                  className="flex-1 border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none"
                >
                  <option value="">בחר שעה</option>
                  {slotsForDate.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.slot_time.slice(0, 5)} ({s.available} מקומות פנויים)
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout button */}
      {selectedDates.length > 0 && (
        <button
          onClick={handleCheckout}
          disabled={!allTimesSelected}
          className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-2xl transition-colors shadow-lg"
        >
          המשך לתשלום ›
        </button>
      )}
    </div>
  );
}
