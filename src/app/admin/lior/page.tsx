'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface Booking {
  id: string;
  time_slot: string;
  slot_date: string;
  name: string;
  phone: string;
  created_at: string;
}

const TIME_SLOTS = ['08:00', '09:30', '11:00'];
const MAX = 10;

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/lior-bookings?key=${encodeURIComponent(key)}`);
      const data = await res.json() as { bookings?: Booking[]; error?: string };
      if (!res.ok) {
        setError(res.status === 401 ? 'קוד גישה שגוי' : (data.error ?? 'שגיאה'));
      } else {
        setBookings(data.bookings ?? []);
      }
    } catch {
      setError('שגיאת רשת');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { load(); }, [load]);

  async function deleteBooking(id: string) {
    if (!confirm('למחוק רישום זה?')) return;
    setDeleting(id);
    await fetch(`/api/admin/lior-bookings?key=${encodeURIComponent(key)}&id=${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleting(null);
  }

  function exportCSV() {
    const rows = [['שעה', 'תאריך', 'שם', 'טלפון', 'זמן הרשמה']];
    for (const b of bookings) {
      rows.push([
        b.time_slot,
        b.slot_date,
        b.name,
        b.phone,
        new Date(b.created_at).toLocaleString('he-IL'),
      ]);
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ליאור-הרשמות-19.3.2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold text-red-600">{error}</p>
          <p className="text-slate-500 mt-2 text-sm">
            הוסיפו ?key=הקוד לכתובת הדף
          </p>
        </div>
      </div>
    );
  }

  const totalRegistered = bookings.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900">רשימת נרשמים — ליאור כ&quot;ץ</h1>
          <p className="text-slate-500 mt-1">19.3.2026 · {totalRegistered} נרשמים בסה&quot;כ</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600
                       hover:border-slate-300 font-semibold transition-colors text-sm"
          >
            ↻ רענן
          </button>
          <button
            onClick={exportCSV}
            disabled={totalRegistered === 0}
            className="px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold
                       text-sm hover:bg-navy-700 transition-colors disabled:opacity-40"
          >
            ⬇ ייצוא CSV
          </button>
        </div>
      </div>

      {/* Tables per time slot */}
      {TIME_SLOTS.map(slot => {
        const slotBookings = bookings.filter(b => b.time_slot === slot);
        const count = slotBookings.length;
        const full = count >= MAX;

        return (
          <div key={slot} className="mb-8 bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
            {/* Slot header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-100
                             ${full ? 'bg-red-50' : 'bg-ice-50'}`}>
              <div>
                <span className="text-xl font-black text-navy-900">{slot}</span>
                <span className="text-slate-500 text-sm mr-3">19.3.2026</span>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full
                               ${full
                                 ? 'bg-red-100 text-red-700'
                                 : count === 0
                                   ? 'bg-slate-100 text-slate-500'
                                   : 'bg-ice-100 text-ice-700'}`}>
                {count}/{MAX} {full ? '(מלא)' : 'נרשמו'}
              </span>
            </div>

            {/* Participants table */}
            {count === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">אין נרשמים עדיין</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-right px-6 py-3 font-semibold text-slate-600 w-8">#</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">נרשם ב</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {slotBookings.map((b, i) => (
                    <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-navy-900">{b.name}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        <a href={`tel:${b.phone}`} className="hover:text-ice-600 transition-colors">
                          {b.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(b.created_at).toLocaleString('he-IL', {
                          day: '2-digit', month: '2-digit',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteBooking(b.id)}
                          disabled={deleting === b.id}
                          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-30"
                          title="מחק"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}

      {totalRegistered === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📋</div>
          <p>אין הרשמות עדיין</p>
        </div>
      )}
    </div>
  );
}

export default function AdminLiorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
