'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const INSTRUCTORS = [
  'ליאור כ"ץ',
  'אורן אלוק',
  'איתמר מאיירס',
  'גולן בר נוי',
  'גיא רייבנבך',
  'גילה גרוס קורנט',
  'ורד פקטור',
  'יסמין חמוד',
  'ראם נביס',
  'שיר ממן שמואלי',
  'עצמאי',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  session_date: string;       // "YYYY-MM-DD"
  session_time: string;       // "HH:MM"
  duration_minutes: number | null;   // null = not yet done (future session)
  temperature_celsius: number | null;
  notes: string;
  instructor: string;
  photo_url?: string;
  photo_url_2?: string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const KEY_V2 = 'ice_journal_v2';
const KEY_V1 = 'ice_journal_v1';

function dMinus(d: number) { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString().split('T')[0]; }
function dPlus(d: number)  { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; }

const DEMO: Session[] = [
  { id:'1', session_date:dMinus(0),  session_time:'07:30', duration_minutes:14,   temperature_celsius:5.1, notes:'מעט סחרחורת בסוף – נשארתי פחות',   instructor:'ליאור כ"ץ' },
  { id:'2', session_date:dMinus(2),  session_time:'09:00', duration_minutes:20,   temperature_celsius:4.8,  notes:'',                                   instructor:'גיא רייבנבך' },
  { id:'3', session_date:dMinus(4),  session_time:'07:45', duration_minutes:18,   temperature_celsius:5.0, notes:'הרגשתי אנרגטי כל הבוקר אחרי',        instructor:'ליאור כ"ץ' },
  { id:'4', session_date:dMinus(9),  session_time:'08:00', duration_minutes:15,   temperature_celsius:4.9,  notes:'נשימה עזרה מאוד',                     instructor:'עצמאי' },
  { id:'5', session_date:dMinus(11), session_time:'07:30', duration_minutes:12,   temperature_celsius:5.2, notes:'פעם ראשונה – הקור היה חזק',            instructor:'גילה גרוס קורנט' },
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
  const { t } = useLanguage();
  const diff = a.curMin - a.prevMin;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon:'🧊', label: t('journal_stat_cur_week'),  value:`${a.curMin} ${t('journal_minutes')}`,  sub: diff===0 ? t('journal_upd_same') : `${diff>0?'+':''}${diff} ${t('journal_upd_sub')}`, c:diff>0?'text-green-400':diff<0?'text-red-400':'text-slate-400' },
        { icon:'📅', label: t('journal_stat_prev_week'), value:`${a.prevMin} ${t('journal_minutes')}`, sub: t('journal_upd_sub'), c:'text-slate-400' },
        { icon:'🌡️',label: t('journal_stat_avg_temp'),  value:a.avgTemp!==null?`${a.avgTemp}°C`:'—', sub: t('journal_cur_week'), c:'text-slate-400' },
        { icon:'🏊', label: t('journal_stat_total'),      value:String(a.total),                        sub: t('journal_all_time'), c:'text-slate-400' },
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
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const isFuture = form.session_date > today;

  const set = (f: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
      setForm(p => ({ ...p, [f]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFuture && !form.duration_minutes) { setError(t('journal_duration_required')); return; }
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
        {isFuture ? t('journal_schedule_title') : t('journal_add_title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">{t('journal_date')}</label>
          <input type="date" value={form.session_date} onChange={set('session_date')} required className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">{t('journal_time')}</label>
          <input type="time" value={form.session_time} onChange={set('session_time')} required className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">
            {t('journal_duration')}{isFuture ? '' : ' *'}
          </label>
          <input type="number" min="1" max="120" value={form.duration_minutes} onChange={set('duration_minutes')}
            placeholder={isFuture ? t('journal_duration_future') : '15'} className={inp} />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">{t('journal_temp')}</label>
          <input type="number" step="0.1" min="-5" max="25" value={form.temperature_celsius}
            onChange={set('temperature_celsius')} placeholder="5.0" className={inp} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-400 text-xs font-semibold mb-1.5">{t('journal_instructor')}</label>
          <select value={form.instructor} onChange={set('instructor')} className={inp}>
            {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-slate-400 text-xs font-semibold mb-1.5">{t('journal_notes')}</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2}
          placeholder={t('journal_notes_ph')}
          className={`${inp} resize-none`} />
      </div>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button type="submit"
        className="bg-ice-600 hover:bg-ice-700 text-white font-black px-8 py-3 rounded-xl transition-colors">
        {isFuture ? t('journal_save_future') : t('journal_save')}
      </button>
    </form>
  );
}

// ─── Upcoming sessions ────────────────────────────────────────────────────────

function UpcomingList({ sessions }: { sessions: Session[] }) {
  const { t } = useLanguage();
  if (!sessions.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-white font-black text-lg mb-4">
        {t('journal_upcoming')}
        <span className="text-slate-500 font-normal text-sm mr-2">({sessions.length})</span>
      </h2>
      <div className="grid gap-3">
        {sessions.map(s => (
          <div key={s.id}
            className="bg-navy-800 border border-navy-600 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
            dir="rtl">
            <div className="flex gap-6 flex-wrap items-start">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t('journal_date')}</div>
                <div className="text-white font-black text-sm">
                  {new Date(s.session_date+'T12:00:00').toLocaleDateString('he-IL', { weekday:'long', day:'2-digit', month:'2-digit' })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t('journal_time')}</div>
                <div className="text-white font-semibold text-sm">{s.session_time}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t('journal_instructor')}</div>
                <div className="text-ice-400 font-semibold text-sm">{s.instructor || '—'}</div>
              </div>
              {s.notes && (
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">{t('journal_notes')}</div>
                  <div className="text-slate-300 text-sm">{s.notes}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Past sessions table (last 10 + sum) ─────────────────────────────────────

interface PastTableProps {
  sessions: Session[];
  expandedId: string | null;
  onExpand: (id: string, notes: string) => void;
  onCollapse: () => void;
  editNotes: string;
  setEditNotes: (v: string) => void;
  savingNote: boolean;
  uploadingPhoto: boolean;
  onSave: (id: string, notes: string, photo1?: File, photo2?: File) => void;
  readOnly?: boolean;
}

function PastTable({ sessions, expandedId, onExpand, onCollapse, editNotes, setEditNotes, savingNote, uploadingPhoto, onSave, readOnly }: PastTableProps) {
  const { t } = useLanguage();
  const last10 = sessions.slice(0, 10);
  const totalMin = last10.reduce((a, s) => a + (s.duration_minutes ?? 0), 0);
  const [photoFile1, setPhotoFile1] = useState<File | null>(null);
  const [photoFile2, setPhotoFile2] = useState<File | null>(null);

  if (!last10.length) return (
    <div className="text-center py-16 text-slate-500">
      <p className="text-5xl mb-3">🏊</p>
      <p className="font-semibold">{t('journal_no_sessions')}</p>
      <p className="text-sm mt-1">{t('journal_no_sessions_sub')}</p>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-700">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="bg-navy-800 border-b border-navy-700">
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">{t('journal_col_date')}</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">{t('journal_col_temp')}</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">{t('journal_col_duration')}</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">{t('journal_col_instructor')}</th>
            <th className="text-right px-4 py-3 text-slate-400 font-semibold">{t('journal_col_notes')}</th>
            <th className="px-4 py-3 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {last10.map((s, i) => (
            <>
              <tr key={s.id}
                onClick={() => expandedId === s.id ? onCollapse() : onExpand(s.id, s.notes)}
                className={`border-b border-navy-800 cursor-pointer transition-colors ${expandedId === s.id ? 'bg-navy-700' : i%2===0 ? 'bg-navy-900' : 'bg-navy-900/60'} hover:bg-navy-700/70`}>
                <td className="px-4 py-3 text-white font-mono">
                  {new Date(s.session_date+'T12:00:00').toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                </td>
                <td className="px-4 py-3">
                  {s.temperature_celsius !== null
                    ? <span className="text-cyan-400 font-semibold">{s.temperature_celsius}°</span>
                    : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  {s.duration_minutes
                    ? <><span className="font-black text-ice-400 text-base">{s.duration_minutes}</span><span className="text-slate-500 text-xs mr-1">דק׳</span></>
                    : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs">{s.instructor || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[140px] truncate">
                  {s.notes || <span className="text-slate-600 italic">לחץ להוספת הערה</span>}
                </td>
                <td className="px-3 py-3 text-slate-500 text-xs text-center">
                  {s.photo_url ? '📷' : ''}{expandedId === s.id ? ' ▲' : ' ▼'}
                </td>
              </tr>
              {expandedId === s.id && (
                <tr key={s.id + '_exp'}>
                  <td colSpan={6} className="bg-navy-700 border-b border-navy-600 px-5 py-4">
                    <div className="space-y-3" dir="rtl">
                      {/* Photos display */}
                      {(s.photo_url || s.photo_url_2) && (
                        <div className="flex gap-3 flex-wrap">
                          {s.photo_url && (
                            <img src={s.photo_url} alt="תמונה 1" className="rounded-xl max-h-44 object-cover border border-navy-500" />
                          )}
                          {s.photo_url_2 && (
                            <img src={s.photo_url_2} alt="תמונה 2" className="rounded-xl max-h-44 object-cover border border-navy-500" />
                          )}
                        </div>
                      )}
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">הערות אישיות</label>
                        {readOnly ? (
                          <p className="text-slate-300 text-sm bg-navy-800 rounded-xl px-3 py-2">{editNotes || '—'}</p>
                        ) : (
                          <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3}
                            placeholder="מה הרגשת? מה עבד? מה תשנה בפעם הבאה?"
                            className="w-full bg-navy-800 border border-navy-600 rounded-xl px-3 py-2 text-slate-200 text-sm resize-none focus:outline-none focus:border-[#7dd8f8]" />
                        )}
                      </div>
                      {!readOnly && (
                        <div className="space-y-2">
                          <p className="text-slate-400 text-xs font-semibold">
                            תמונות (עד 2, כל אחת עד 1MB)
                            <span className="text-slate-500 font-normal mr-1">
                              — {[s.photo_url, s.photo_url_2].filter(Boolean).length}/2 קיימות
                            </span>
                          </p>
                          {/* Slot 1 */}
                          {!s.photo_url ? (
                            <div>
                              <label className="block text-slate-500 text-xs mb-1">תמונה 1</label>
                              <input type="file" accept="image/*"
                                onClick={e => e.stopPropagation()}
                                onChange={e => { e.stopPropagation(); setPhotoFile1(e.target.files?.[0] ?? null); }}
                                className="text-slate-300 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-navy-600 file:text-slate-200 file:text-xs" />
                              {photoFile1 && <p className="text-slate-400 text-xs mt-0.5">{photoFile1.name} ({(photoFile1.size/1024).toFixed(0)}KB)</p>}
                              {photoFile1 && photoFile1.size > 1_048_576 && <p className="text-red-400 text-xs mt-0.5">קובץ גדול מדי — מקסימום 1MB</p>}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-xs">תמונה 1 ✓ (קיימת)</p>
                          )}
                          {/* Slot 2 — only shown if slot 1 is filled */}
                          {(s.photo_url || photoFile1) && !s.photo_url_2 && (
                            <div>
                              <label className="block text-slate-500 text-xs mb-1">תמונה 2</label>
                              <input type="file" accept="image/*"
                                onClick={e => e.stopPropagation()}
                                onChange={e => { e.stopPropagation(); setPhotoFile2(e.target.files?.[0] ?? null); }}
                                className="text-slate-300 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-navy-600 file:text-slate-200 file:text-xs" />
                              {photoFile2 && <p className="text-slate-400 text-xs mt-0.5">{photoFile2.name} ({(photoFile2.size/1024).toFixed(0)}KB)</p>}
                              {photoFile2 && photoFile2.size > 1_048_576 && <p className="text-red-400 text-xs mt-0.5">קובץ גדול מדי — מקסימום 1MB</p>}
                            </div>
                          )}
                          {s.photo_url_2 && <p className="text-slate-500 text-xs">תמונה 2 ✓ (קיימת)</p>}
                        </div>
                      )}
                      {!readOnly && (
                        <div className="flex gap-3 items-center flex-wrap">
                          <button onClick={e => {
                              e.stopPropagation();
                              onSave(s.id, editNotes, photoFile1 ?? undefined, photoFile2 ?? undefined);
                              setPhotoFile1(null); setPhotoFile2(null);
                            }}
                            disabled={savingNote
                              || (!!photoFile1 && photoFile1.size > 1_048_576)
                              || (!!photoFile2 && photoFile2.size > 1_048_576)}
                            className="bg-[#7dd8f8] hover:bg-[#5ec5ef] disabled:opacity-40 text-[#0f2942] font-bold px-5 py-2 rounded-xl text-sm transition-colors">
                            {uploadingPhoto ? t('hc_sending') : savingNote ? t('health_saving') : t('journal_save')}
                          </button>
                          <button onClick={e => { e.stopPropagation(); onCollapse(); setPhotoFile1(null); setPhotoFile2(null); }}
                            className="text-slate-400 hover:text-white text-sm transition-colors">{t('dash_close')}</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-navy-700 border-t-2 border-navy-600">
            <td className="px-4 py-3 text-slate-400 font-bold text-xs" colSpan={2}>סה&quot;כ ({last10.length} טבילות)</td>
            <td className="px-4 py-3">
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

const MIGRATION_KEY = 'journal_migrated_v1';

function sortSessions(arr: Session[]) {
  return [...arr].sort((a, b) =>
    (b.session_date + b.session_time).localeCompare(a.session_date + a.session_time)
  );
}

function apiEntryToSession(e: Record<string, unknown>): Session {
  return {
    id: e.id as string,
    session_date: e.session_date as string,
    session_time: ((e.session_time as string) ?? '').slice(0, 5),
    duration_minutes: (e.duration_minutes as number | null) ?? null,
    temperature_celsius: (e.temperature_celsius as number | null) ?? null,
    notes: ((e.visitor_notes ?? e.notes) as string) ?? '',
    instructor: ((e.instructor_name ?? e.instructor) as string) ?? '',
    photo_url: (e.photo_url as string | undefined) ?? undefined,
    photo_url_2: (e.photo_url_2 as string | undefined) ?? undefined,
  };
}

function JournalContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const viewVid = searchParams.get('vid'); // instructor viewing another user's journal
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ready, setReady] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [viewName, setViewName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    let vid = localStorage.getItem('visitor_id') ?? '';
    if (!vid) { vid = crypto.randomUUID(); localStorage.setItem('visitor_id', vid); }
    setVisitorId(vid);

    fetch('/api/instructor/clients', { headers: { 'x-visitor-id': vid } })
      .then(r => { if (r.ok) setIsStaff(true); })
      .catch(() => {});

    // If ?vid= is provided, load that person's journal (instructor view)
    const targetVid = viewVid || vid;
    if (viewVid && viewVid !== vid) {
      fetch(`/api/instructor/clients`, { headers: { 'x-visitor-id': vid } })
        .then(r => r.json())
        .then((clients: Array<{id: string; name: string}>) => {
          const found = clients.find(c => c.id === viewVid);
          if (found) setViewName(found.name);
        }).catch(() => {});
    }

    fetch(`/api/journal?visitor_id=${encodeURIComponent(targetVid)}`)
      .then(r => r.json())
      .then(async (d) => {
        if (d.entries && d.entries.length > 0) {
          setSessions(sortSessions(d.entries.map(apiEntryToSession)));
        } else if (!viewVid && !localStorage.getItem(MIGRATION_KEY)) {
          // Migrate localStorage data to API once (only for own journal)
          const local = localStorage.getItem(KEY_V2);
          if (local) {
            const parsed = JSON.parse(local) as Session[];
            const nonDemo = parsed.filter(s => !['1','2','3','4','5','6','7'].includes(s.id));
            if (nonDemo.length > 0) {
              await Promise.all(nonDemo.map(s =>
                fetch('/api/journal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ visitor_id: vid, session_date: s.session_date, session_time: s.session_time, duration_minutes: s.duration_minutes, temperature_celsius: s.temperature_celsius, notes: s.notes, instructor: s.instructor }),
                })
              ));
              const res2 = await fetch(`/api/journal?visitor_id=${encodeURIComponent(vid)}`);
              const d2 = await res2.json();
              setSessions(sortSessions((d2.entries ?? []).map(apiEntryToSession)));
            }
          }
          localStorage.setItem(MIGRATION_KEY, '1');
        }
        setReady(true);
      })
      .catch(() => { setSessions(loadSessions()); setReady(true); });
  }, []);

  async function handleAdd(s: Session) {
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: visitorId, session_date: s.session_date, session_time: s.session_time, duration_minutes: s.duration_minutes, temperature_celsius: s.temperature_celsius, notes: s.notes, instructor: s.instructor }),
      });
      const d = await res.json();
      if (d.entry) {
        setSessions(prev => sortSessions([apiEntryToSession(d.entry), ...prev]));
        return;
      }
    } catch { /* fallback */ }
    // Offline fallback
    setSessions(prev => sortSessions([s, ...prev]));
  }

  async function handleDelete(id: string) {
    setSessions(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/journal?id=${encodeURIComponent(id)}&visitor_id=${encodeURIComponent(visitorId)}`, { method: 'DELETE' });
    } catch { /* ignore */ }
  }

  async function handleUpdateSession(id: string, notes: string, photoFile1?: File, photoFile2?: File) {
    setSavingNote(true);
    let photo_url: string | undefined;
    let photo_url_2: string | undefined;

    if (photoFile1 || photoFile2) setUploadingPhoto(true);

    if (photoFile1) {
      const fd = new FormData();
      fd.append('file', photoFile1);
      fd.append('session_id', id);
      fd.append('slot', '1');
      try {
        const r = await fetch('/api/upload/session-photo', { method: 'POST', body: fd });
        const d = await r.json();
        if (r.ok) photo_url = d.url;
      } catch { /* ignore */ }
    }

    if (photoFile2) {
      const fd = new FormData();
      fd.append('file', photoFile2);
      fd.append('session_id', id);
      fd.append('slot', '2');
      try {
        const r = await fetch('/api/upload/session-photo', { method: 'POST', body: fd });
        const d = await r.json();
        if (r.ok) photo_url_2 = d.url;
      } catch { /* ignore */ }
    }

    setUploadingPhoto(false);

    try {
      const targetVid = viewVid || visitorId;
      const body: Record<string, unknown> = { id, visitor_id: targetVid, visitor_notes: notes };
      if (photo_url) body.photo_url = photo_url;
      if (photo_url_2) body.photo_url_2 = photo_url_2;
      const res = await fetch('/api/journal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.entry) {
        setSessions(prev => prev.map(s => s.id === id
          ? { ...s, notes, photo_url: photo_url ?? s.photo_url, photo_url_2: photo_url_2 ?? s.photo_url_2 }
          : s));
        setExpandedId(null);
      }
    } catch { /* ignore */ }
    setSavingNote(false);
  }

  const today = new Date().toISOString().split('T')[0];
  const past   = sessions.filter(s => s.session_date <= today);
  const future = sessions.filter(s => s.session_date > today)
    .sort((a, b) => a.session_date.localeCompare(b.session_date));

  return (
    <main className="min-h-screen py-10 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-4xl mx-auto">

        {/* Instructor view banner */}
        {viewVid && (
          <div className="mb-6 bg-blue-900 border border-blue-700 rounded-2xl px-5 py-3 text-center" dir="rtl">
            <p className="text-blue-200 text-sm font-semibold">
              צופה ביומן של: <span className="text-white font-black">{viewName || viewVid}</span>
            </p>
            <button onClick={() => { window.location.href = '/instructor/dashboard'; }}
              className="text-blue-400 hover:text-white text-xs mt-1 underline">חזור לדשבורד מדריך</button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8" dir="rtl">
          <div className="text-5xl mb-3">🧊</div>
          <h1 className="text-3xl font-black text-white mb-1">
            {viewName ? `${t('journal_title')} — ${viewName}` : t('journal_title')}
          </h1>
          <p className="text-slate-400 text-sm">{t('journal_no_sessions_sub')}</p>
        </div>

        {/* Analytics */}
        {ready && <AnalyticsBar a={computeAnalytics(sessions)} />}

        {/* Add form — hidden in instructor view */}
        {!viewVid && <AddForm onAdd={handleAdd} />}

        {/* Upcoming */}
        <div dir="rtl">
          {ready && <UpcomingList sessions={future} />}

          {/* Past — last 10 */}
          <h2 className="text-white font-black text-lg mb-4">
            📋 {t('dash_bookings_title')}
            <span className="text-slate-500 font-normal text-sm mr-2">
              ({Math.min(past.length, 10)} מתוך {past.length})
            </span>
          </h2>
          {ready
            ? <PastTable
                sessions={past}
                expandedId={expandedId}
                onExpand={(id, notes) => { setExpandedId(id); setEditNotes(notes); }}
                onCollapse={() => setExpandedId(null)}
                editNotes={editNotes}
                setEditNotes={setEditNotes}
                savingNote={savingNote}
                uploadingPhoto={uploadingPhoto}
                onSave={handleUpdateSession}
                readOnly={!!viewVid && !isStaff}
              />
            : <div className="text-center py-16 text-slate-500">{t('dash_loading')}</div>}
        </div>

      </div>
    </main>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}><div className="text-white">...</div></div>}>
      <JournalContent />
    </Suspense>
  );
}
