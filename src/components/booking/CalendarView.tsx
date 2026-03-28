'use client';

import { useEffect, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import type { Workshop, WorkshopType } from '@/types';

interface CalendarViewProps {
  type: WorkshopType;
  instructorId?: string;
  onSelect: (workshop: Workshop) => void;
  onBack: () => void;
}

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const typeLabels: Record<WorkshopType, string> = {
  individual: 'יחידים',
  couple: 'זוגות',
  team: 'קבוצות מאורגנות',
  'one-on-one': 'אחד על אחד',
};

export default function CalendarView({ type, instructorId, onSelect, onBack }: CalendarViewProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchWorkshops = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const month = format(date, 'yyyy-MM');
      const params = new URLSearchParams({ month, type });
      if (instructorId) params.set('instructorId', instructorId);

      const res = await fetch(`/api/workshops?${params.toString()}`);
      if (!res.ok) throw new Error('שגיאה בטעינת הסדנאות');
      const data = await res.json();
      setWorkshops(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה לא צפויה');
    } finally {
      setLoading(false);
    }
  }, [type, instructorId]);

  useEffect(() => {
    fetchWorkshops(currentMonth);
  }, [currentMonth, fetchWorkshops]);

  // Days with available workshops
  const datesWithWorkshops = new Set(
    workshops
      .filter(w => w.seats_taken < w.capacity)
      .map(w => format(new Date(w.date_time), 'yyyy-MM-dd'))
  );

  const selectedDayWorkshops = selectedDate
    ? workshops.filter(w => isSameDay(new Date(w.date_time), selectedDate))
    : [];

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  const formatDateHebrew = (date: Date) =>
    date.toLocaleDateString('he-IL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors"
        >
          ← חזרה
        </button>
        <div>
          <h2 className="text-2xl font-black text-navy-900">שלב 2: בחרו תאריך ושעה</h2>
          <p className="text-slate-500 text-sm">
            סדנת {typeLabels[type]} – לחצו על תאריך עם נקודה כחולה
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error} — <button onClick={() => fetchWorkshops(currentMonth)} className="underline">נסו שנית</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent
                                rounded-full animate-spin mx-auto mb-3" />
                טוען מועדים זמינים...
              </div>
            </div>
          ) : (
            <div dir="rtl" className="calendar-rtl-wrapper">
              <Calendar
                locale="he-IL"
                value={selectedDate}
                onClickDay={(date) => setSelectedDate(date)}
                onActiveStartDateChange={({ activeStartDate }) => {
                  if (activeStartDate) setCurrentMonth(activeStartDate);
                }}
                minDate={new Date()}
                formatDay={(_, date) =>
                  `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
                }
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  const dateStr = format(date, 'yyyy-MM-dd');
                  if (datesWithWorkshops.has(dateStr)) {
                    return (
                      <div className="flex justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 bg-ice-500 rounded-full" />
                      </div>
                    );
                  }
                  return null;
                }}
                tileDisabled={({ date, view }) => {
                  if (view !== 'month') return false;
                  if (date < new Date()) return true;
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return !datesWithWorkshops.has(dateStr);
                }}
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return 'cal-day-uniform';
                  if (selectedDate && isSameDay(date, selectedDate)) return 'cal-day-uniform react-calendar__tile--active';
                  return 'cal-day-uniform';
                }}
              />
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-ice-500 rounded-full" />
              <span>יש סדנאות זמינות</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-200 rounded-full" />
              <span>אין סדנאות / תאריך עבר</span>
            </div>
          </div>
        </div>

        {/* Time slots for selected day */}
        <div className="lg:col-span-2">
          {!selectedDate ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400 p-8">
                <div className="text-5xl mb-4">📅</div>
                <p className="font-medium">בחרו תאריך בלוח השנה</p>
                <p className="text-sm mt-1">נציג את השעות הזמינות</p>
              </div>
            </div>
          ) : selectedDayWorkshops.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400 p-8">
                <div className="text-5xl mb-4">😔</div>
                <p className="font-medium">אין סדנאות זמינות ב{formatDateHebrew(selectedDate)}</p>
                <p className="text-sm mt-1">אנא בחרו תאריך אחר</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-navy-900 mb-4 text-sm">
                {formatDateHebrew(selectedDate)}
              </h3>
              <div className="space-y-3">
                {selectedDayWorkshops.map(w => {
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
                        <span className="text-xl font-black text-navy-900">
                          {formatTime(w.date_time)}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                          ${isFull
                            ? 'bg-red-100 text-red-600'
                            : seatsLeft <= 3
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                          {isFull ? 'מלא' : `${seatsLeft} מקומות`}
                        </span>
                      </div>

                      {w.instructor && (
                        <p className="text-xs text-slate-500 mb-2">
                          מדריך: {w.instructor.name}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-ice-600 font-black text-lg">₪{w.price}</span>
                        {!isFull && (
                          <span className="text-xs text-ice-600 font-semibold">
                            בחרו → מלאו פרטים
                          </span>
                        )}
                      </div>

                      {isFull && (
                        <p className="text-xs text-slate-400 mt-1">
                          הסדנה מלאה – ניתן להצטרף לרשימת המתנה
                        </p>
                      )}
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
