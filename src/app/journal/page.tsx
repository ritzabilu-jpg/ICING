'use client';

import { useEffect, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const INSTRUCTORS = ['ליאור כ"ץ', 'גיא רייבנבך', 'יוסי כהן', 'מירה לוי', 'עצמאי'];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  session_date: string;       // "YYYY-MM-DD"
  session_time: string;       // "HH:MM"
  duration_minutes: number | null;   // null = not yet done (future session)
  temperature_celsius: number | null;
  notes: string;
  instructor: string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const KEY_V2 = 'ice_journal_v2';
const KEY_V1 = 'ice_journal_v1';

function dMinus(d: number) { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0]; }
function dPlus(d: number)  { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; }

const DEMO: Session[] = [
  { id:'1', session_date:dMinus(0),  session_time:'07:30', duration_minutes:14,   temperature_celsius:10.1, notes:'מעט סחרחורת בסוף – נשארתי פחות',   instructor:'ליאור כ"ץ' },
  { id:'2', session_date:dMinus(2),  session_time:'09:00', duration_minutes:20,   temperature_celsius:9.2,  notes:'',                                   instructor:'גיא רייבנבך' },
  { id:'3', session_date:dMinus(4),  session_time:'07:45', duration_minutes:18,   temperature_celsius:10.0, notes:'הרגשתי אנרגטי כל הבוקר אחרי',        instructor:'ליאור כ"ץ' },
  { id:'4', session_date:dMinus(9),  session_time:'08:00', duration_minutes:15,   temperature_celsius:9.8,  notes:'נשימה עזרה מאוד',                     instructor:'עצמאי' },
  { id:'5', session_date:dMinus(11), session_time:'07:30', duration_minutes:12,   temperature_celsius:10.5, notes:'פעם ראשונה – הקור היה חזק',            instructor:'יוסי כהן' },
  { id:'6', session_date:dPlus(3),   session_time:'08:00', duration_minutes:null, temperature_celsius:null, notes:'',                                   instructor:'גיא רייבנבך' },
  { id:'7', session_date:dPlus(7),   session_time:'09:30', duration_minutes:null, temperature_celsius:null, notes:'',                                   instructor:'ליאור כ"ץ' },
];

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return DEMO;
  const raw2 = localStorage.getItem(KEY_V2);
  if (raw2) return JSON.parse(raw2) as Session[];
  // Migrate from v1
  const raw1 = localStorage.getItem(KEY_V1);
  if (raw1) {
    const migrated = (JSON.parse(raw1) as Omit<Session,'instructor'>[]).map(s => ({ ...s, instructor: 'עצמאי' }));
    localStorage.setItem(KEY_V2, JSON.stringify(migrated));
    return migrated;
  }
  localStorage.setItem(KEY_V2, JSON.stringify(DEMO));
  return DEMO;
}

function persist(s: Session[]) { localStorage.setItem(KEY_V2, JSON.stringify(s)); }

// ─── Analytics ────────────────────────────────────────────────────────────────

interface Analytics { curMin: number; prevMin: number; avgTemp: number|null; total: number; }

function computeAnalytics(sessions: Session[]): Analytics {
  const now = new Date(); const ms = 86_400_000;
  const cut1 = new Date(now.getTime() - 7*ms);
  const cut2 = new Date(now.getTime() - 14*ms);
  const cur  = sessions.filter(s => s.duration_minutes && new Date(s.session_date) >= cut1);
  const prev = sessions.filter(s => s.duration_minutes && new Date(s.session_date) >= cut2 && new Date(s.session_date) < cut1);
  const temps = cur.filter(s => s.temperature_celsius !== null).map(s => s.temperature_celsius as number);
  return {
    curMin:   cur.reduce((a,s)=>a+(s.duration_minutes??0),0),
    prevMin:  prev.reduce((a,s)=>a+(s.duration_minutes??0),0),
    avgTemp:  temps.length ? Math.round(temps.reduce((a,b)=>a+b,0)/temps.length*10)/10 : null,
    total:    sessions.filter(s=>s.duration_minutes).length,
  };
}

function AnalyticsBar({ a }: { a: Analytics }) {
  const diff = a.curMin - a.prevMin;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon:'🧊', label:'שבוע נוכחי',     value:`${a.curMin} דק'`,  sub: diff===0?'כמו שבוע שעבר':`${diff>0?'+':''}${diff} משבוע שעבר`, c:diff>0?'text-green-400':diff<0?'text-red-400':'text-slate-400' },
        { icon:'📅', label:'שבוע שעבר',       value:`${a.prevMin} דק'`, sub:'סה"כ דקות טבילה', c:'text-slate-400' },
        { icon:'🌡️',label:'ממוצע טמפרטורה', value:a.avgTemp!==null?`${a.avgTemp}°C`:'—', sub:'שבוע נוכחי', c:'text-slate-400' },
        { icon:'🏊', label:'סה"כ טבילות',    value:String(a.total),    sub:'כל הזמן', c:'text-slate-400' },
      ].map(c => (
        <div key={c.label} className="bg-navy-800 rounded-2xl px-5 py-4 text-right border border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">{c.icon}</span>
            <span className="text-xs text-slate-400 font-medium">{c.label}</span>
          </div>
          <div className="text-2xl font-black text-white mb-0.5">{c.value}</div>
          <div className={`text-xs ${c.c}`}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Add Form ─────────────────────────────────────────────────────────────────

interface FormState {
  session_date: string; session_time: string;
  duration_minutes: string; temperature_celsius: string;
  notes: string; instructor: string;
}

function emptyForm(): FormState {
  return {
    session_date: new Date().toISOString().split('T')[0],
    session_time: new Date().toTimeString().slice(0,5),
    duration_minutes: '', temperature_celsius: '',
    notes: '', instructor: INSTRUCTORS[0],
  };
}

function AddForm({ onAdd }: { onAdd: (s: Session) => void }) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const isFuture = form.session_date > today;

  const set = (f: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
      setForm(p => ({ ...p, [f]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFuture && !form.duration_minutes) { setError('יש להזין משך טבילה'); return; }
    onAdd({
      id: crypto.randomUUID(),
      session_date: form.session_date,
      session_time: form.session_time,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      temperature_celsius: form.temperature_celsius ? Number(form.temperature_celsius) : null,
      notes: form.notes.trim(),
      instructor: form.instructor,
    });
    setForm(emptyForm());
    setError('');
  }

  const inp = 'w-full bg-navy-800 border border-navy-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-ice-400 placeholder:text-slate-500';

  return (
    <form onSubmit={submit} dir="rtl" className="bg-navy-900 border border-navy-700 rounded-3xl p-6 mb-8">
      <h2 className="text-white font-black text-lg mb-5">
        {isFuture ? '📅 קבע טבילה עתידית' : '+ הוסף טבילה'}
      </h2>
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
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">
            משך (דקות){isFuture ? ' — אופציונלי' : ' *'}
          </label>
          <input type="number" min="1" max="120" value={form.duration_minutes} onChange={set('duration_minutes')}
            placeholder={isFuture ? 'יתעדכן לאחר הטבילה' : '15'} className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">טמפרטורה ממוצעת (°C)</label>
          <input type="number" step="0.1" min="-5" max="25" value={form.temperature_celsius}
            onChange={set('temperature_celsius')} placeholder="10.0" className={inp} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">מדריך אחראי</label>
          <select value={form.instructor} onChange={set('instructor')} className={inp}>
            {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
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
        {isFuture ? '📅 שמור תאריך טבילה' : '💾 שמור טבילה'}
      </button>
    </form>
  );
}

// ─── Upcoming sessions ────────────────────────────────────────────────────────

function UpcomingList({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  if (!sessions.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-white font-black text-lg mb-4">
        📅 טבילות קרובות
        <span className="text-slate-500 font-normal text-sm mr-2">({sessions.length})</span>
      </h2>
      <div className="grid gap-3">
        {sessions.map(s => (
          <div key={s.id}
            className="bg-navy-800 border border-navy-600 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
            dir="rtl">
            <div className="flex gap-6 flex-wrap items-start">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">תאריך</div>
                <div className="text-white font-black text-sm">
                  {new Date(s.session_date+'T12:00:00').toLocaleDateString('he-IL', { weekday:'long', day:'2-digit', month:'2-digit' })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">שעה</div>
                <div className="text-white font-semibold text-sm">{s.session_time}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">מדריך</div>
                <div className="text-ice-400 font-semibold text-sm">{s.instructor || '—'}</div>
              </div>
              {s.notes && (
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">הערה</div>
                  <div className="text-slate-300 text-sm">{s.notes}</div>
                </div>
              )}
            </div>
            <button
              onClick={() => { if (confirm('לבטל טבילה זו?')) onDelete(s.id); }}
              className="text-slate-600 hover:text-red-400 text-lg flex-shrink-0 transition-colors"
              title="בטל">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Past sessions table (last 10 + sum) ─────────────────────────────────────

function PastTable({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  const last10 = sessions.slice(0, 10);
  const totalMin = last10.reduce((a, s) => a + (s.duration_minutes ?? 0), 0);

  if (!last10.length) return (
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
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">טמפ&apos; (°C)</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">משך (דק&apos;)</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">מדריך</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">הערות</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {last10.map((s, i) => (
            <tr key={s.id}
              className={`border-b border-navy-800 hover:bg-navy-800/50 transition-colors ${i%2===0?'bg-navy-900':'bg-navy-900/60'}`}>
              <td className="px-4 py-3 text-white font-mono text-right">
                {new Date(s.session_date+'T12:00:00').toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'2-digit' })}
              </td>
              <td className="px-4 py-3 text-right">
                {s.temperature_celsius !== null
                  ? <span className="text-cyan-400 font-semibold">{s.temperature_celsius}°</span>
                  : <span className="text-slate-600">—</span>}
              </td>
              <td className="px-4 py-3 text-right">
                {s.duration_minutes
                  ? <span className="font-black text-ice-400 text-base">{s.duration_minutes}</span>
                  : <span className="text-slate-600">—</span>}
              </td>
              <td className="px-4 py-3 text-slate-300 text-xs text-right">{s.instructor || '—'}</td>
              <td className="px-4 py-3 text-slate-400 text-xs max-w-[160px] truncate text-right">
                {s.notes || <span className="text-slate-600 italic">אין הערות</span>}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => { if (confirm('למחוק רשומה זו?')) onDelete(s.id); }}
                  className="text-slate-600 hover:text-red-400 transition-colors text-lg" title="מחק">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-navy-700 border-t-2 border-navy-600">
            <td className="px-4 py-3 text-slate-400 font-bold text-right text-xs" colSpan={2}>
              סה&quot;כ ({last10.length} טבילות)
            </td>
            <td className="px-4 py-3 text-right">
              <span className="font-black text-ice-300 text-base">{totalMin}</span>
              <span className="text-slate-400 text-xs mr-1">דק&apos;</span>
            </td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { setSessions(loadSessions()); setReady(true); }, []);

  function handleAdd(s: Session) {
    const updated = [s, ...sessions].sort((a, b) =>
      (b.session_date + b.session_time).localeCompare(a.session_date + a.session_time)
    );
    persist(updated);
    setSessions(updated);
  }

  function handleDelete(id: string) {
    const updated = sessions.filter(s => s.id !== id);
    persist(updated);
    setSessions(updated);
  }

  const today = new Date().toISOString().split('T')[0];
  const past   = sessions.filter(s => s.session_date <= today);
  const future = sessions.filter(s => s.session_date > today)
    .sort((a, b) => a.session_date.localeCompare(b.session_date));

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
        {ready && <AnalyticsBar a={computeAnalytics(sessions)} />}

        {/* Add form */}
        <AddForm onAdd={handleAdd} />

        {/* Upcoming */}
        <div dir="rtl">
          {ready && <UpcomingList sessions={future} onDelete={handleDelete} />}

          {/* Past — last 10 */}
          <h2 className="text-white font-black text-lg mb-4">
            📋 10 טבילות אחרונות
            <span className="text-slate-500 font-normal text-sm mr-2">
              ({Math.min(past.length, 10)} מתוך {past.length})
            </span>
          </h2>
          {ready
            ? <PastTable sessions={past} onDelete={handleDelete} />
            : <div className="text-center py-16 text-slate-500">טוען...</div>}
        </div>

      </div>
    </main>
  );
}
