/**
 * /journal – Ice Bath Journal Module
 * Stores all data in localStorage (no backend needed).
 *
 * Layout: Analytics bar → Add form → Sessions table
 */

'use client';

import { useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  session_date: string;   // "YYYY-MM-DD"
  session_time: string;   // "HH:MM"
  duration_minutes: number;
  temperature_celsius: number | null;
  notes: string;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = 'ice_journal_v1';

// Demo data seeded on first visit
function todayMinus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

const DEMO_SESSIONS: Session[] = [
  { id: '1', session_date: todayMinus(0), session_time: '07:30', duration_minutes: 14, temperature_celsius: 10.1, notes: 'מעט סחרחורת בסוף – נשארתי פחות' },
  { id: '2', session_date: todayMinus(2), session_time: '09:00', duration_minutes: 20, temperature_celsius: 9.2,  notes: '' },
  { id: '3', session_date: todayMinus(4), session_time: '07:45', duration_minutes: 18, temperature_celsius: 10.0, notes: 'הרגשתי אנרגטי כל הבוקר אחרי' },
  { id: '4', session_date: todayMinus(9), session_time: '08:00', duration_minutes: 15, temperature_celsius: 9.8,  notes: 'נשימה עזרה מאוד' },
  { id: '5', session_date: todayMinus(11), session_time: '07:30', duration_minutes: 12, temperature_celsius: 10.5, notes: 'פעם ראשונה – הקור היה חזק' },
];

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return DEMO_SESSIONS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // first visit – seed demo data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SESSIONS));
    return DEMO_SESSIONS;
  }
  return JSON.parse(raw) as Session[];
}

function persistSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ─── Analytics calculation ────────────────────────────────────────────────────

interface Analytics {
  currentWeekMinutes: number;
  prevWeekMinutes: number;
  currentWeekAvgTemp: number | null;
  totalSessions: number;
}

function computeAnalytics(sessions: Session[]): Analytics {
  const now = new Date();
  const msDay = 86_400_000;
  const cutCurrent = new Date(now.getTime() - 7 * msDay);
  const cutPrev    = new Date(now.getTime() - 14 * msDay);

  const currentWeek = sessions.filter(s => new Date(s.session_date) >= cutCurrent);
  const prevWeek    = sessions.filter(s => {
    const d = new Date(s.session_date);
    return d >= cutPrev && d < cutCurrent;
  });

  const currentWeekMinutes = currentWeek.reduce((sum, s) => sum + s.duration_minutes, 0);
  const prevWeekMinutes    = prevWeek.reduce((sum, s) => sum + s.duration_minutes, 0);

  const temps = currentWeek.filter(s => s.temperature_celsius !== null).map(s => s.temperature_celsius as number);
  const currentWeekAvgTemp = temps.length
    ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length * 10) / 10
    : null;

  return { currentWeekMinutes, prevWeekMinutes, currentWeekAvgTemp, totalSessions: sessions.length };
}

// ─── Analytics Bar ────────────────────────────────────────────────────────────

function AnalyticsBar({ a }: { a: Analytics }) {
  const diff = a.currentWeekMinutes - a.prevWeekMinutes;
  const cards = [
    { icon: '🧊', label: 'שבוע נוכחי',     value: `${a.currentWeekMinutes} דק'`, sub: diff === 0 ? 'כמו שבוע שעבר' : `${diff > 0 ? '+' : ''}${diff} משבוע שעבר`, subColor: diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-slate-400' },
    { icon: '📅', label: 'שבוע שעבר',       value: `${a.prevWeekMinutes} דק'`,   sub: 'סה"כ דקות טבילה',        subColor: 'text-slate-400' },
    { icon: '🌡️', label: 'ממוצע טמפרטורה', value: a.currentWeekAvgTemp !== null ? `${a.currentWeekAvgTemp}°C` : '—', sub: 'שבוע נוכחי', subColor: 'text-slate-400' },
    { icon: '🏊', label: 'סה"כ טבילות',    value: String(a.totalSessions),       sub: 'כל הזמן',                subColor: 'text-slate-400' },
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

function emptyForm(): FormState {
  return {
    session_date: new Date().toISOString().split('T')[0],
    session_time: new Date().toTimeString().slice(0, 5),
    duration_minutes: '',
    temperature_celsius: '',
    notes: '',
  };
}

function AddForm({ onAdd }: { onAdd: (s: Session) => void }) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState('');

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.duration_minutes) { setError('יש להזין משך טבילה'); return; }
    const newSession: Session = {
      id: crypto.randomUUID(),
      session_date: form.session_date,
      session_time: form.session_time,
      duration_minutes: Number(form.duration_minutes),
      temperature_celsius: form.temperature_celsius ? Number(form.temperature_celsius) : null,
      notes: form.notes.trim(),
    };
    onAdd(newSession);
    setForm(emptyForm());
    setError('');
  }

  const inp = 'w-full bg-navy-800 border border-navy-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ice-400 placeholder:text-slate-500';

  return (
    <form onSubmit={submit} dir="rtl" className="bg-navy-900 border border-navy-700 rounded-3xl p-6 mb-8">
      <h2 className="text-white font-black text-lg mb-5">+ הוסף טבילה חדשה</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">תאריך</label>
          <input type="date" value={form.session_date} onChange={set('session_date')} required className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">שעה</label>
          <input type="time" value={form.session_time} onChange={set('session_time')} required className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">משך (דקות) *</label>
          <input type="number" min="1" max="120" value={form.duration_minutes} onChange={set('duration_minutes')}
            placeholder="15" required className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">טמפרטורה ממוצעת (°C)</label>
          <input type="number" step="0.1" min="-5" max="25" value={form.temperature_celsius}
            onChange={set('temperature_celsius')} placeholder="10.0" className={inp} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-slate-400 text-xs font-semibold mb-1.5">הערות (אופציונלי)</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2}
          placeholder="הרגשתי טוב, מעט סחרחורת בסוף..."
          className={`${inp} resize-none`} />
      </div>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button type="submit"
        className="bg-ice-600 hover:bg-ice-700 text-white font-black px-8 py-3 rounded-xl transition-colors">
        💾 שמור טבילה
      </button>
    </form>
  );
}

// ─── Sessions Table ───────────────────────────────────────────────────────────

function SessionTable({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
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
              className={`border-b border-navy-800 transition-colors hover:bg-navy-800/50 ${i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-900/60'}`}>
              <td className="px-4 py-3 text-white font-mono text-right">
                {new Date(s.session_date + 'T12:00:00').toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </td>
              <td className="px-4 py-3 text-slate-300 font-mono text-right">{s.session_time?.slice(0, 5)}</td>
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
                <button onClick={() => { if (confirm('למחוק רשומה זו?')) onDelete(s.id); }}
                  className="text-slate-600 hover:text-red-400 transition-colors text-lg" title="מחק">
                  ✕
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setSessions(loadSessions());
    setReady(true);
  }, []);

  function handleAdd(s: Session) {
    const updated = [s, ...sessions].sort((a, b) =>
      (b.session_date + b.session_time).localeCompare(a.session_date + a.session_time)
    );
    persistSessions(updated);
    setSessions(updated);
  }

  function handleDelete(id: string) {
    const updated = sessions.filter(s => s.id !== id);
    persistSessions(updated);
    setSessions(updated);
  }

  const analytics = computeAnalytics(sessions);

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8" dir="rtl">
          <div className="text-5xl mb-3">🧊</div>
          <h1 className="text-3xl font-black text-white mb-1">יומן טבילות קרח</h1>
          <p className="text-slate-400 text-sm">עקוב, נתח והשתפר</p>
        </div>

        {/* Analytics */}
        {ready && <AnalyticsBar a={analytics} />}

        {/* Add form */}
        <AddForm onAdd={handleAdd} />

        {/* Table */}
        <div dir="rtl">
          <h2 className="text-white font-black text-lg mb-4">
            📋 כל הטבילות
            <span className="text-slate-500 font-normal text-sm mr-2">({sessions.length})</span>
          </h2>
          {ready
            ? <SessionTable sessions={sessions} onDelete={handleDelete} />
            : <div className="text-center py-16 text-slate-500">טוען...</div>
          }
        </div>
      </div>
    </main>
  );
}
