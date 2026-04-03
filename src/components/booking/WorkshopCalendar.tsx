'use client';

import { useState, useEffect, useRef } from 'react';
import type { Workshop, WorkshopType } from '@/types';

const TYPE_LABELS: Record<WorkshopType, string> = {
  individual: 'סדנת יחידים',
  couple: 'סדנת זוגות',
  team: 'סדנאות לקבוצות',
  'one-on-one': 'אחד על אחד',
};

const HEB_MONTHS = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
];
const HEB_DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

interface Props {
  type: WorkshopType;
  onSelect: (workshop: Workshop) => void;
  onBack: () => void;
}

export default function WorkshopCalendar({ type, onSelect, onBack }: Props) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const slotsRef = useRef<HTMLDivElement>(null);

  const todayYMD = toYMD(new Date());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/workshops?type=${type}`)
      .then(r => r.json())
      .then(d => { setWorkshops(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [type]);

  // Dates that have available workshops
  const availableDates = new Set(
    workshops
      .filter(w => w.date_time.slice(0,10) >= todayYMD)
      .map(w => w.date_time.slice(0,10))
  );

  const firstAvailableDate = Array.from(availableDates).sort()[0];

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); }
    else setCalMonth(m => m-1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); }
    else setCalMonth(m => m+1);
  }

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const rows = Math.ceil((firstDay + daysInMonth) / 7);

  const slotsForDate = selectedDate
    ? workshops.filter(w => w.date_time.startsWith(selectedDate) && w.date_time.slice(0,10) >= todayYMD)
    : [];

  function formatTime(iso: string) {
    const t = iso.split('T')[1]?.slice(0,5);
    return t ?? '';
  }

  function formatDateHe(ymd: string) {
    const [y, m, d] = ymd.split('-');
    return new Date(Number(y), Number(m)-1, Number(d))
      .toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  if (loading) return (
    <div className="py-12 text-center text-slate-400">
      <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      טוען סדנאות...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-navy-900">{TYPE_LABELS[type]}</h2>
        <button
          onClick={onBack}
          className="text-sm text-ice-600 hover:text-ice-700 font-semibold border border-ice-200 rounded-xl px-3 py-1.5 hover:bg-ice-50 transition-colors"
        >
          ← שנה סוג
        </button>
      </div>

      {/* Next available */}
      {firstAvailableDate && (
        <div className="bg-ice-50 border border-ice-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-2xl">🏔️</span>
          <div>
            <p className="text-xs text-slate-500 font-semibold">הסדנה הפנויה הקרובה:</p>
            <p className="text-navy-900 font-black text-lg">{formatDateHe(firstAvailableDate)}</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
            aria-label="חודש הבא">‹</button>
          <span className="font-black text-navy-900">{HEB_MONTHS[calMonth]} {calYear}</span>
          <button onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
            aria-label="חודש קודם">›</button>
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
            const dayNum = i - firstDay + 1;
            if (dayNum < 1 || dayNum > daysInMonth) return <div key={i} />;
            const ymd = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
            const isPast = ymd < todayYMD;
            const hasSlot = availableDates.has(ymd);
            const isSelected = selectedDate === ymd;
            const isDisabled = isPast || !hasSlot;
            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(ymd);
                  setTimeout(() => slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                disabled={isDisabled}
                className={`relative mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${isSelected
                    ? 'bg-ice-500 text-white shadow-md'
                    : isPast
                    ? 'text-slate-300 cursor-not-allowed'
                    : !hasSlot
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

        {availableDates.size === 0 && !loading && (
          <p className="text-center text-slate-400 text-sm mt-4">אין סדנאות פתוחות בחודש זה.</p>
        )}
      </div>

      {/* Time slots for selected date */}
      {selectedDate && (
        <div ref={slotsRef} className="space-y-3">
          <p className="text-sm font-bold text-slate-600">שעות זמינות — {formatDateHe(selectedDate)}:</p>
          {slotsForDate.length === 0 ? (
            <p className="text-slate-400 text-sm">אין שעות זמינות לתאריך זה.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {slotsForDate.map(w => (
                <button
                  key={w.id}
                  onClick={() => onSelect(w)}
                  className="bg-white border-2 border-slate-200 hover:border-ice-400 rounded-2xl p-4 text-right transition-all hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-black text-ice-600 group-hover:text-ice-700">
                      {formatTime(w.date_time)}
                    </span>
                    <span className="bg-navy-900 text-white text-xs font-bold px-3 py-1 rounded-xl">
                      ₪{w.price}
                    </span>
                  </div>
                  {w.instructor && (
                    <p className="text-sm text-slate-500">{w.instructor.name}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {w.capacity - w.seats_taken} מקומות פנויים
                  </p>
                  <div className="mt-2 text-xs font-bold text-ice-600 group-hover:text-ice-700">
                    בחר שעה זו ›
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
