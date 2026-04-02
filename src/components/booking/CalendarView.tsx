'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { Workshop, WorkshopType } from '@/types';

interface CalendarViewProps {
  type: WorkshopType;
  instructorId?: string;
  onSelect: (workshop: Workshop) => void;
  onBack: () => void;
}

const typeLabels: Record<WorkshopType, string> = {
  individual: 'יחידים',
  couple: 'זוגות',
  team: 'קבוצות מאורגנות',
  'one-on-one': 'אחד על אחד',
};

const HE_MONTHS = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
];
const HE_DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

export default function CalendarView({ type, instructorId, onSelect, onBack }: CalendarViewProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate());

  const fetchWorkshops = useCallback(async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const monthStr = `${year}-${String(month+1).padStart(2,'0')}`;
      const params = new URLSearchParams({ month: monthStr, type });
      if (instructorId) params.set('instructorId', instructorId);
      const res = await fetch(`/api/workshops?${params}`);
      if (!res.ok) throw new Error('שגיאה בטעינת הסדנאות');
      const data = await res.json();
      setWorkshops(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה לא צפויה');
    } finally {
      setLoading(false);
    }
  }, [type, instructorId]);

  useEffect(() => {
    fetchWorkshops(viewYear, viewMonth);
  }, [viewYear, viewMonth, fetchWorkshops]);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // Dates with available workshops
  const availableDates = new Set(
    workshops
      .filter(w => w.seats_taken < w.capacity)
      .map(w => w.date_time.slice(0, 10))
  );

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const rows = Math.ceil((firstDay + daysInMonth) / 7);

  const selectedWorkshops = selectedDate
    ? workshops.filter(w => w.date_time.startsWith(selectedDate))
    : [];

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  const formatDateHe = (ymd: string) => {
    const [y, m, d] = ymd.split('-');
    const dt = new Date(Number(y), Number(m)-1, Number(d));
    return dt.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors text-sm"
        >
          ← חזרה
        </button>
        <div>
          <h2 className="text-2xl font-black text-navy-900">בחרו תאריך ושעה</h2>
          <p className="text-slate-500 text-sm">סדנת {typeLabels[type]} — לחצו על תאריך מסומן</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error} — <button onClick={() => fetchWorkshops(viewYear, viewMonth)} className="underline">נסו שנית</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
                aria-label="חודש הבא"
              >›</button>
              <span className="font-black text-navy-900">
                {HE_MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold"
                aria-label="חודש קודם"
              >‹</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {HE_DAYS.map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            {loading ? (
              <div className="h-40 flex items-center justify-center text-slate-400">
                <div className="w-6 h-6 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: rows * 7 }).map((_, i) => {
                  const dayNum = i - firstDay + 1;
                  if (dayNum < 1 || dayNum > daysInMonth) return <div key={i} />;
                  const ymd = toYMD(viewYear, viewMonth, dayNum);
                  const isPast = ymd < todayYMD;
                  const hasWorkshop = availableDates.has(ymd);
                  const isSelected = selectedDate === ymd;
                  const isDisabled = isPast || !hasWorkshop;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (isDisabled) return;
                        setSelectedDate(ymd);
                        setTimeout(() => timeSlotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                      }}
                      disabled={isDisabled}
                      className={`relative mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                        ${isSelected ? 'bg-navy-800 text-white shadow-md'
                          : isPast ? 'text-slate-300 cursor-not-allowed'
                          : !hasWorkshop ? 'text-slate-400 cursor-not-allowed'
                          : 'text-navy-900 hover:bg-ice-100 cursor-pointer'}`}
                    >
                      {dayNum}
                      {hasWorkshop && !isSelected && !isPast && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ice-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-slate-500 justify-end flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-ice-500 rounded-full inline-block" />
                יש סדנאות זמינות
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-200 rounded-full inline-block" />
                אין סדנאות
              </span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div ref={timeSlotsRef} className="lg:col-span-2">
          {!selectedDate ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400 p-8">
                <div className="text-5xl mb-4">📅</div>
                <p className="font-medium">בחרו תאריך בלוח</p>
                <p className="text-sm mt-1">נציג את השעות הזמינות</p>
              </div>
            </div>
          ) : selectedWorkshops.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400 p-8">
                <div className="text-5xl mb-4">😔</div>
                <p className="font-medium">אין סדנאות זמינות בתאריך זה</p>
                <p className="text-sm mt-1">אנא בחרו תאריך אחר</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-navy-900 mb-4 text-sm">{formatDateHe(selectedDate)}</h3>
              <div className="space-y-3">
                {selectedWorkshops.map(w => {
                  const seatsLeft = w.capacity - w.seats_taken;
                  const isFull = seatsLeft === 0;
                  return (
                    <button
                      key={w.id}
                      onClick={() => !isFull && onSelect(w)}
                      disabled={isFull}
                      className={`w-full rounded-2xl border-2 p-4 text-right transition-all
                        focus:outline-none focus:ring-2 focus:ring-ice-400
                        ${isFull
                          ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                          : 'border-ice-200 bg-white hover:border-ice-500 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-black text-navy-900">{formatTime(w.date_time)}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                          ${isFull ? 'bg-red-100 text-red-600'
                            : seatsLeft <= 3 ? 'bg-orange-100 text-orange-600'
                            : 'bg-green-100 text-green-600'}`}>
                          {isFull ? 'מלא' : `${seatsLeft} מקומות`}
                        </span>
                      </div>
                      {w.instructor && (
                        <p className="text-xs text-slate-500 mb-2">מדריך: {w.instructor.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-ice-600 font-black text-lg">₪{w.price}</span>
                        {!isFull && (
                          <span className="text-xs text-ice-600 font-semibold">בחרו → המשיכו</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
