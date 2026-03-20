'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Workshop {
  id: string;
  workshop_date: string;
  workshop_time: string;
  instructor_name: string;
  notes: string | null;
  status: 'pending' | 'accepted' | 'declined';
  max_participants: number;
  created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

const STATUS_LABEL: Record<string, string> = {
  pending: '⏳ ממתין לתשובה',
  accepted: '✅ אישרתי',
  declined: '❌ דחיתי',
};
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-700',
};

export default function InstructorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async (instructorName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor-workshops?instructor=${encodeURIComponent(instructorName)}`);
      const data = await res.json();
      setWorkshops(Array.isArray(data) ? data : []);
    } catch {
      setError('שגיאה בטעינת הנתונים');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('visitor_name') || '';
    const role = localStorage.getItem('visitor_role') || 'user';
    if (!storedName || !['instructor', 'admin'].includes(role)) {
      router.push('/');
      return;
    }
    setName(storedName);
    load(storedName);
  }, [router, load]);

  async function respond(id: string, status: 'accepted' | 'declined') {
    setResponding(id);
    const res = await fetch(`/api/instructor-workshops?id=${id}&instructor=${encodeURIComponent(name)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setWorkshops(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    }
    setResponding(null);
  }

  const pending   = workshops.filter(w => w.status === 'pending');
  const upcoming  = workshops.filter(w => w.status === 'accepted' && w.workshop_date >= today);
  const past      = workshops.filter(w => w.workshop_date < today).sort((a, b) => b.workshop_date.localeCompare(a.workshop_date));

  if (loading) return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <p className="text-slate-400">טוען...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header bar */}
      <div className="bg-navy-900 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">שלום {name}! 🏊</h1>
            <p className="text-slate-400 text-sm mt-0.5">דשבורד מדריך</p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="bg-navy-800 rounded-xl px-4 py-2">
              <p className="text-ice-400 text-xs">הזמנות ממתינות</p>
              <p className="text-white font-bold text-xl">{pending.length}</p>
            </div>
            <div className="bg-navy-800 rounded-xl px-4 py-2">
              <p className="text-ice-400 text-xs">סדנאות קרובות</p>
              <p className="text-white font-bold text-xl">{upcoming.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3">{error}</p>}

        {/* ── Pending invitations ── */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-navy-900 mb-3">📬 הזמנות שממתינות לתשובתך</h2>
            <div className="space-y-3">
              {pending.map(w => (
                <div key={w.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-navy-900 text-base">📅 {formatDate(w.workshop_date)}</p>
                      <p className="text-navy-700 mt-0.5">🕐 {w.workshop_time?.slice(0, 5)} · עד {w.max_participants} משתתפים</p>
                      {w.notes && <p className="text-slate-500 text-sm mt-1">💬 {w.notes}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => respond(w.id, 'accepted')}
                        disabled={responding === w.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        {responding === w.id ? '...' : '✅ כן, אני פנוי'}
                      </button>
                      <button
                        onClick={() => respond(w.id, 'declined')}
                        disabled={responding === w.id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        {responding === w.id ? '...' : '❌ לא יכול'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Upcoming accepted ── */}
        <section>
          <h2 className="text-lg font-bold text-navy-900 mb-3">🗓️ סדנאות קרובות שאישרתי</h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-400">
              אין סדנאות קרובות
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(w => (
                <div key={w.id} className="bg-white rounded-2xl border border-green-100 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy-900">{formatDate(w.workshop_date)}</p>
                    <p className="text-sm text-navy-700">🕐 {w.workshop_time?.slice(0, 5)} · {w.max_participants} משתתפים</p>
                    {w.notes && <p className="text-xs text-slate-400 mt-0.5">{w.notes}</p>}
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">✅ מאושר</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Past workshops ── */}
        {past.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-navy-900 mb-3">📋 סדנאות שעברו</h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">סטטוס</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">הערות</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map(w => (
                    <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">{new Date(w.workshop_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                      <td className="px-4 py-3 font-mono">{w.workshop_time?.slice(0, 5)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLOR[w.status]}`}>
                          {STATUS_LABEL[w.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{w.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
