/**
 * /journal
 * Ice Bath Journal Module – single-screen web app.
 *
 * Layout (top → bottom):
 *   1. Analytics summary bar  (current week / previous week / avg temp)
 *   2. Add-entry form         (date, time, duration, temperature, notes)
 *   3. Sessions table         (all entries, newest first, with delete)
 *
 * Data source: /api/journal  (GET / POST / DELETE)
 * Auth: reads visitor_id from localStorage; falls back to demo mode.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  session_date: string;   // "YYYY-MM-DD"
  session_time: string;   // "HH:MM:SS"
  duration_minutes: number;
  temperature_celsius: number | null;
  notes: string;
}

interface Analytics {
  currentWeekMinutes: number;
  prevWeekMinutes: number;
  currentWeekAvgTemp: number | null;
  totalSessions: number;
}

// ─── Analytics calculation ────────────────────────────────────────────────────

function computeAnalytics(sessions: Session[]): Analytics {
  const now = new Date();
  const startOfCurrent = new Date(now); startOfCurrent.setDate(now.getDate() - 6); startOfCurrent.setHours(0, 0, 0, 0);
  const startOfPrev    = new Date(now); startOfPrev.setDate(now.getDate() - 13);   startOfPrev.setHours(0, 0, 0, 0);

  const currentWeek = sessions.filter(s => {
    const d = new Date(s.session_date);
    return d >= startOfCurrent && d <= now;
  });

  const prevWeek = sessions.filter(s => {
    const d = new Date(s.session_date);
    return d >= startOfPrev && d < startOfCurrent;
  });

  const currentWeekMinutes = currentWeek.reduce((sum, s) => sum + s.duration_minutes, 0);
  const prevWeekMinutes    = prevWeek.reduce((sum, s) => sum + s.duration_minutes, 0);

  const tempsThisWeek = currentWeek.filter(s => s.temperature_celsius !== null).map(s => s.temperature_celsius as number);
  const currentWeekAvgTemp = tempsThisWeek.length
    ? Math.round((tempsThisWeek.reduce((a, b) => a + b, 0) / tempsThisWeek.length) * 10) / 10
    : null;

  return { currentWeekMinutes, prevWeekMinutes, currentWeekAvgTemp, totalSessions: sessions.length };
}

// ─── Analytics Bar ────────────────────────────────────────────────────────────

function AnalyticsBar({ analytics }: { analytics: Analytics }) {
  const { currentWeekMinutes, prevWeekMinutes, currentWeekAvgTemp, totalSessions } = analytics;
  const diff = currentWeekMinutes - prevWeekMinutes;

  const cards = [
    {
      label: 'שבוע נוכחי',
      value: `${currentWeekMinutes} דק'`,
      sub: diff === 0 ? 'כמו שבוע שעבר' : diff > 0 ? `+${diff} דק' משבוע שעבר` : `${diff} דק' משבוע שעבר`,
      subColor: diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-slate-400',
      icon: '🧊',
    },
    {
      label: 'שבוע שעבר',
      value: `${prevWeekMinutes} דק'`,
      sub: 'סה"כ דקות טבילה',
      subColor: 'text-slate-400',
      icon: '📅',
    },
    {
      label: 'ממוצע טמפרטורה',
      value: currentWeekAvgTemp !== null ? `${currentWeekAvgTemp}°C` : '—',
      sub: 'שבוע נוכחי',
      subColor: 'text-slate-400',
      icon: '🌡️',
    },
    {
      label: 'סה"כ טבילות',
      value: String(totalSessions),
      sub: 'כל הזמן',
      subColor: 'text-slate-400',
      icon: '🏊',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map(c => (
        <div key={c.label} className="bg-navy-800 rounded-2xl px-5 py-4 text-right border border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">{c.icon}</span>
            <span className="text-xs text-slate-400 font-medium">{c.label}</span>
          </div>
          <div className="text-2xl font-black text-white mb-0.5">{c.value}</div>
          <div className={`text-xs ${c.subColor}`}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Add Entry Form ───────────────────────────────────────────────────────────

interface FormState {
  session_date: string;
  session_time: string;
  duration_minutes: string;
  temperature_celsius: string;
  notes: string;
}

const emptyForm = (): FormState => ({
  session_date: new Date().toISOString().split('T')[0],
  session_time: new Date().toTimeString().slice(0, 5),
  duration_minutes: '',
  temperature_celsius: '',
  notes: '',
});

function AddForm({ onAdd }: { onAdd: (s: Session) => void }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.duration_minutes) { setError('יש להזין משך טבילה'); return; }
    setSaving(true);
    setError('');
    const visitorId = (typeof window !== 'undefined' && localStorage.getItem('visitor_id')) || undefined;
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(visitorId ? { 'x-visitor-id': visitorId } : {}),
      },
      body: JSON.stringify({
        session_date: form.session_date,
        session_time: form.session_time,
        duration_minutes: Number(form.duration_minutes),
        temperature_celsius: form.temperature_celsius ? Number(form.temperature_celsius) : null,
        notes: form.notes,
      }),
    });
    setSaving(false);
    if (!res.ok) { setError('שגיאה בשמירה'); return; }
    const data: Session = await res.json();
    onAdd(data);
    setForm(emptyForm());
  }

  const inputCls = 'w-full bg-navy-800 border border-navy-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ice-400 placeholder:text-slate-500';

  return (
    <form onSubmit={submit} dir="rtl" className="bg-navy-900 border border-navy-700 rounded-3xl p-6 mb-8">
      <h2 className="text-white font-black text-lg mb-5">+ הוסף טבילה חדשה</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">תאריך</label>
          <input type="date" value={form.session_date} onChange={set('session_date')} required className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">שעה</label>
          <input type="time" value={form.session_time} onChange={set('session_time')} required className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">משך (דקות) *</label>
          <input type="number" min="1" max="120" value={form.duration_minutes} onChange={set('duration_minutes')}
            placeholder="15" required className={inputCls} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">טמפרטורה ממוצעת (°C)</label>
          <input type="number" step="0.1" min="-5" max="25" value={form.temperature_celsius} onChange={set('temperature_celsius')}
            placeholder="10.0" className={inputCls} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-slate-400 text-xs font-semibold mb-1.5">הערות (אופציונלי)</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2}
          placeholder="הרגשתי טוב, מעט סחרחורת בסוף..."
          className={`${inputCls} resize-none`} />
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button type="submit" disabled={saving}
        className="bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-black px-8 py-3 rounded-xl transition-colors">
        {saving ? 'שומר...' : '💾 שמור טבילה'}
      </button>
    </form>
  );
}

// ─── Sessions Table ───────────────────────────────────────────────────────────

function SessionTable({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('למחוק רשומה זו?')) return;
    setDeleting(id);
    await fetch(`/api/journal?id=${id}`, { method: 'DELETE' });
    setDeleting(null);
    onDelete(id);
  }

  if (!sessions.length) return (
    <div className="text-center py-16 text-slate-500">
      <p className="text-5xl mb-3">🏊</p>
      <p className="font-semibold">עדיין אין טבילות מתועדות</p>
      <p className="text-sm mt-1">הוסף את הטבילה הראשונה שלך למעלה</p>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-700">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="bg-navy-800 border-b border-navy-700">
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">תאריך</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">שעה</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">משך (דק&apos;)</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">טמפ&apos; (°C)</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">הערות</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={s.id}
              className={`border-b border-navy-800 transition-colors hover:bg-navy-800/50
                ${i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-900/60'}`}>
              <td className="px-4 py-3 text-white font-mono text-right">
                {new Date(s.session_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </td>
              <td className="px-4 py-3 text-slate-300 font-mono text-right">
                {s.session_time?.slice(0, 5)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="font-black text-ice-400 text-base">{s.duration_minutes}</span>
              </td>
              <td className="px-4 py-3 text-right">
                {s.temperature_celsius !== null
                  ? <span className="text-cyan-400 font-semibold">{s.temperature_celsius}°</span>
                  : <span className="text-slate-600">—</span>}
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate text-right">
                {s.notes || <span className="text-slate-600 italic">אין הערות</span>}
              </td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                  className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-30 text-lg"
                  title="מחק">
                  {deleting === s.id ? '⏳' : '✕'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [sessions, setSessions]   = useState<Session[]>([]);
  const [loading, setLoading]     = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const visitorId = typeof window !== 'undefined' ? localStorage.getItem('visitor_id') : null;

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/journal', {
      headers: visitorId ? { 'x-visitor-id': visitorId } : {},
    });
    const data = await res.json();
    setSessions(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [visitorId]);

  useEffect(() => {
    setIsDemoMode(!visitorId);
    fetchSessions();
  }, [fetchSessions, visitorId]);

  const analytics = computeAnalytics(sessions);

  return (
    <main className="min-h-screen bg-navy-950 py-10 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8" dir="rtl">
          <div className="text-5xl mb-3">🧊</div>
          <h1 className="text-3xl font-black text-white mb-1">יומן טבילות קרח</h1>
          <p className="text-slate-400 text-sm">עקוב, נתח והשתפר</p>
          {isDemoMode && (
            <div className="mt-3 inline-block bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs px-4 py-1.5 rounded-full">
              מצב דמו — כניסה למערכת תציג את הנתונים שלך
            </div>
          )}
        </div>

        {/* Analytics */}
        {!loading && <AnalyticsBar analytics={analytics} />}

        {/* Add form */}
        <AddForm onAdd={s => setSessions(prev => [s, ...prev])} />

        {/* Table */}
        <div dir="rtl">
          <h2 className="text-white font-black text-lg mb-4">
            📋 כל הטבילות
            <span className="text-slate-500 font-normal text-sm mr-2">({sessions.length})</span>
          </h2>
          {loading
            ? <div className="text-center py-16 text-slate-500">טוען...</div>
            : <SessionTable sessions={sessions} onDelete={id => setSessions(prev => prev.filter(s => s.id !== id))} />
          }
        </div>
      </div>
    </main>
  );
}
