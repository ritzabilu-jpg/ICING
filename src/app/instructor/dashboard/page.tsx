'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Session {
  id: string;
  kind: 'slot' | 'workshop';
  date: string;
  time: string;
  location: string;
  notes: string;
  title?: string;
  max_participants: number;
  participant_count: number;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface InstructorInfo {
  id: string;
  name: string;
}

type Tab = 'future' | 'past' | 'schedule' | 'clients' | 'journal';

interface JournalSession {
  id: string;
  session_date: string;
  session_time: string;
  temperature_celsius: number | null;
  duration_minutes: number;
  instructor_name: string;
  status?: 'planned' | 'done' | 'cancelled';
  visitor_notes?: string;
  instructor_notes?: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function KindBadge({ kind }: { kind: 'slot' | 'workshop' }) {
  return kind === 'workshop'
    ? <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">סדנה</span>
    : <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">טבילה</span>;
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [visitorId, setVisitorId] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState<InstructorInfo | null>(null);
  const [tab, setTab] = useState<Tab>('future');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [error, setError] = useState('');
  // ── Journal ──
  const [journalSessions, setJournalSessions] = useState<JournalSession[]>([]);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [jDate, setJDate] = useState(new Date().toISOString().split('T')[0]);
  const [jTime, setJTime] = useState('08:00');
  const [jTemp, setJTemp] = useState('');
  const [jDuration, setJDuration] = useState('');
  const [jStatus, setJStatus] = useState<'planned' | 'done' | 'cancelled'>('done');
  const [jNotes, setJNotes] = useState('');
  const [jSaving, setJSaving] = useState(false);
  const [journalTargetId, setJournalTargetId] = useState('');
  const [journalTargetName, setJournalTargetName] = useState('');
  const [journalSearch, setJournalSearch] = useState('');
  const [journalDropdownOpen, setJournalDropdownOpen] = useState(false);
  const journalSearchRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const vid = localStorage.getItem('visitor_id') || '';
    const role = localStorage.getItem('visitor_role') || '';
    const vname = localStorage.getItem('visitor_name') || '';
    if (!vid || !['instructor', 'admin'].includes(role)) {
      router.push('/instructor/login');
      return;
    }
    setVisitorId(vid);
    setName(vname);
  }, [router]);

  useEffect(() => {
    if (!visitorId) return;
    setLoading(true);
    fetch('/api/instructor/sessions', { headers: { 'x-visitor-id': visitorId } })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); }
        else { setSessions(d.sessions || []); setInstructor(d.instructor || null); }
        setLoading(false);
      })
      .catch(() => { setError('שגיאה בטעינת נתונים'); setLoading(false); });
  }, [visitorId]);

  useEffect(() => {
    if (!visitorId || (tab !== 'clients' && tab !== 'journal')) return;
    if (clients.length > 0) return;
    setLoadingClients(true);
    fetch('/api/instructor/clients', { headers: { 'x-visitor-id': visitorId } })
      .then(r => r.json())
      .then(d => { setClients(Array.isArray(d) ? d : []); setLoadingClients(false); })
      .catch(() => setLoadingClients(false));
  }, [visitorId, tab, clients.length]);

  function loadJournal(targetId?: string) {
    const tid = targetId ?? journalTargetId ?? visitorId;
    if (!tid || !visitorId) return;
    setLoadingJournal(true);
    fetch(`/api/immersion-sessions?visitor_id=${tid}`, { headers: { 'x-visitor-id': visitorId } })
      .then(r => r.json())
      .then(d => { setJournalSessions(Array.isArray(d) ? d : []); setLoadingJournal(false); })
      .catch(() => setLoadingJournal(false));
  }

  useEffect(() => {
    if (!visitorId || tab !== 'journal') return;
    if (!journalTargetId) {
      setJournalTargetId(visitorId);
      setJournalTargetName(name);
      loadJournal(visitorId);
    } else {
      loadJournal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorId, tab]);

  function selectJournalTarget(id: string, tname: string) {
    setJournalTargetId(id);
    setJournalTargetName(tname);
    setShowAddJournal(false);
    setJournalSearch('');
    setJournalDropdownOpen(false);
    loadJournal(id);
  }

  async function saveJournalEntry() {
    const targetId = journalTargetId || visitorId;
    if (!jDuration || !targetId) return;
    setJSaving(true);
    await fetch('/api/immersion-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({
        visitor_id: targetId,
        session_date: jDate,
        session_time: jTime,
        temperature_celsius: jTemp ? parseFloat(jTemp) : null,
        duration_minutes: parseInt(jDuration, 10),
        instructor_name: name,
        status: jStatus,
        visitor_notes: jNotes,
      }),
    });
    setJSaving(false);
    setShowAddJournal(false);
    setJTemp(''); setJDuration(''); setJNotes(''); setJStatus('done');
    loadJournal(targetId);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (journalSearchRef.current && !journalSearchRef.current.contains(e.target as Node)) {
        setJournalDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const future = sessions.filter(s => s.date >= today).reverse();
  const past = sessions.filter(s => s.date < today);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthSessions = sessions.filter(s => s.date.startsWith(thisMonth));
  const totalParticipantsMonth = monthSessions.reduce((sum, s) => sum + (s.participant_count || 0), 0);

  const tabs: { key: Tab; label: string; href?: string }[] = [
    { key: 'future', label: `סדנאות עתיד (${future.length})` },
    { key: 'past', label: `סדנאות עבר (${past.length})` },
    { key: 'schedule', label: 'שעות סדנאות' },
    { key: 'clients', label: 'רשימת לקוחות' },
    { key: 'journal', label: '📖 יומן טבילות' },
    { key: 'future', label: 'זמינות שבועית', href: '/instructor/availability' },
  ];

  function sessionHref(s: Session) {
    return `/instructor/session/${s.id}?kind=${s.kind}`;
  }

  function SessionCard({ s }: { s: Session }) {
    return (
      <Link href={sessionHref(s)}
        className="block bg-white rounded-2xl border border-slate-100 p-4 hover:border-[#7dd8f8] transition-colors">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KindBadge kind={s.kind} />
              {s.title && <span className="text-sm font-semibold text-[#0f2942]">{s.title}</span>}
            </div>
            <p className="font-bold text-[#0f2942]">{formatDate(s.date)}</p>
            <p className="text-slate-500 text-sm mt-0.5">
              🕐 {s.time}
              {s.location && <> · 📍 {s.location}</>}
            </p>
            {s.notes && <p className="text-slate-400 text-xs mt-1">{s.notes}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">👥 {s.participant_count}/{s.max_participants}</span>
            <span className="text-[#7dd8f8] text-lg">←</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-[#0f2942] text-white py-5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">שלום {name}!</h1>
            <p className="text-[#7dd8f8] text-sm">{instructor?.name ? `מדריך: ${instructor.name}` : 'דשבורד מדריך'}</p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="bg-[#1a3a5c] rounded-xl px-4 py-2">
              <p className="text-[#7dd8f8] text-xs">סדנאות קרובות</p>
              <p className="text-white font-bold text-xl">{future.length}</p>
            </div>
            <div className="bg-[#1a3a5c] rounded-xl px-4 py-2">
              <p className="text-[#7dd8f8] text-xs">השתתפו החודש</p>
              <p className="text-white font-bold text-xl">{totalParticipantsMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {tabs.map((t, i) =>
            t.href ? (
              <Link key={i} href={t.href}
                className="px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent text-slate-500 hover:text-[#0f2942] transition-colors">
                {t.label}
              </Link>
            ) : (
              <button key={t.key + i} onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key ? 'border-[#7dd8f8] text-[#0f2942]' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {t.label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm">{error}</div>}
        {loading && <p className="text-slate-400 text-center py-12">טוען...</p>}

        {/* Future */}
        {!loading && tab === 'future' && (
          <div className="space-y-3">
            {future.length === 0
              ? <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">אין סדנאות מתוכננות</div>
              : future.map(s => <SessionCard key={s.id} s={s} />)}
          </div>
        )}

        {/* Past */}
        {!loading && tab === 'past' && (
          <div>
            {past.length === 0
              ? <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">אין סדנאות שעברו</div>
              : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">סוג</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">מיקום</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">משתתפים</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {past.map(s => (
                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3"><KindBadge kind={s.kind} /></td>
                          <td className="px-4 py-3 font-medium">
                            {new Date(s.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-mono">{s.time}</td>
                          <td className="px-4 py-3 text-slate-500">{s.location || '—'}</td>
                          <td className="px-4 py-3">{s.participant_count}/{s.max_participants}</td>
                          <td className="px-4 py-3">
                            <Link href={sessionHref(s)} className="text-[#0f2942] text-xs font-semibold underline">פרטים</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* Schedule */}
        {tab === 'schedule' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'סדנאות החודש', value: monthSessions.length },
                { label: 'משתתפים החודש', value: totalParticipantsMonth },
                { label: 'סה״כ סדנאות', value: sessions.length },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                  <p className="text-2xl font-bold text-[#0f2942]">{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f2942] mb-3">לוח סדנאות קרובות</h2>
              {future.length === 0
                ? <p className="text-slate-400 text-sm">אין סדנאות מתוכננות</p>
                : (
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">סוג</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">מיקום</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">רשומים</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">פנויים</th>
                        </tr>
                      </thead>
                      <tbody>
                        {future.map(s => (
                          <tr key={s.id} className="border-b border-slate-50">
                            <td className="px-4 py-3"><KindBadge kind={s.kind} /></td>
                            <td className="px-4 py-3 font-medium">
                              {new Date(s.date).toLocaleDateString('he-IL', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                            </td>
                            <td className="px-4 py-3 font-mono">{s.time}</td>
                            <td className="px-4 py-3 text-slate-500">{s.location || '—'}</td>
                            <td className="px-4 py-3">{s.participant_count}</td>
                            <td className="px-4 py-3 text-green-600 font-semibold">{s.max_participants - s.participant_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Journal */}
        {tab === 'journal' && (
          <div>
            {/* User picker */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-slate-600">יומן של:</span>
                <button
                  onClick={() => selectJournalTarget(visitorId, name)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${journalTargetId === visitorId ? 'bg-[#0f2942] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  שלי
                </button>
                <div className="relative flex-1 min-w-[200px]" ref={journalSearchRef}>
                  <input
                    value={journalSearch}
                    onChange={e => setJournalSearch(e.target.value)}
                    onFocus={() => setJournalDropdownOpen(true)}
                    placeholder="חפש לפי שם או אימייל..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#7dd8f8]"
                  />
                  {journalDropdownOpen && (
                    <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
                      {(() => {
                        const q = journalSearch.toLowerCase();
                        const filtered = clients.filter(c =>
                          c.id !== visitorId &&
                          (q === '' || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
                        );
                        return filtered.length === 0
                          ? <p className="text-center py-3 text-slate-400 text-sm">לא נמצא</p>
                          : filtered.map(c => (
                            <button key={c.id} onMouseDown={() => selectJournalTarget(c.id, c.name)}
                              className="w-full text-right px-4 py-2.5 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-center justify-between gap-3">
                              <span className="font-semibold text-[#0f2942]">{c.name}</span>
                              <span className="text-slate-400 text-xs">{c.email || c.phone || ''}</span>
                            </button>
                          ));
                      })()}
                    </div>
                  )}
                </div>
                {journalTargetId && journalTargetId !== visitorId && (
                  <span className="text-sm font-bold text-[#0f2942] bg-[#e8f4fd] px-3 py-1.5 rounded-xl">
                    📋 {journalTargetName}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            {!loadingJournal && journalSessions.length > 0 && (() => {
              const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
              const weekMin = journalSessions.filter(s => new Date(s.session_date) >= weekAgo).reduce((sum, s) => sum + s.duration_minutes, 0);
              const totalMin = journalSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
              return (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'טבילות סה״כ', value: journalSessions.length },
                    { label: 'דק׳ השבוע', value: weekMin },
                    { label: 'דק׳ סה״כ', value: totalMin },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                      <p className="text-2xl font-bold text-[#0f2942]">{stat.value}</p>
                      <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h2 className="font-bold text-[#0f2942]">
                  {journalTargetId === visitorId ? 'יומן הטבילות האישי שלי' : `יומן טבילות — ${journalTargetName}`}
                </h2>
                <button onClick={() => setShowAddJournal(v => !v)}
                  className="text-sm text-[#7dd8f8] hover:text-[#0f2942] font-semibold transition-colors">
                  {showAddJournal ? 'סגור' : '+ הוסף כניסה'}
                </button>
              </div>

              {showAddJournal && (
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">תאריך</label>
                      <input type="date" value={jDate} onChange={e => setJDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]" /></div>
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">שעה</label>
                      <input type="time" value={jTime} onChange={e => setJTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]" /></div>
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">טמפרטורה (°C)</label>
                      <input type="number" step="0.1" value={jTemp} onChange={e => setJTemp(e.target.value)} placeholder="5.0"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]" /></div>
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">משך (דקות) *</label>
                      <input type="number" value={jDuration} onChange={e => setJDuration(e.target.value)} placeholder="15"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]" /></div>
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">סטטוס</label>
                      <select value={jStatus} onChange={e => setJStatus(e.target.value as 'planned' | 'done' | 'cancelled')}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]">
                        <option value="done">בוצע</option>
                        <option value="planned">מתוכנן</option>
                        <option value="cancelled">בוטל</option>
                      </select></div>
                    <div><label className="block text-slate-600 mb-1 text-xs font-semibold">הערות</label>
                      <input value={jNotes} onChange={e => setJNotes(e.target.value)} placeholder="הערות אישיות..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7dd8f8]" /></div>
                  </div>
                  <button onClick={saveJournalEntry} disabled={!jDuration || jSaving}
                    className="mt-3 bg-[#0f2942] hover:bg-[#1a3a5c] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
                    {jSaving ? 'שומר...' : '+ הוסף'}
                  </button>
                </div>
              )}

              {loadingJournal ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#7dd8f8] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : journalSessions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-4xl mb-2">🏊</p>
                  <p>עדיין אין טבילות מתועדות</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">סטטוס</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">טמפ׳</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">משך</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">הערות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalSessions.map(s => (
                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            {new Date(s.session_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-mono">{s.session_time?.slice(0, 5)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              s.status === 'done' ? 'bg-green-100 text-green-700' :
                              s.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {s.status === 'done' ? 'בוצע' : s.status === 'cancelled' ? 'בוטל' : 'מתוכנן'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#7dd8f8] font-semibold">
                            {s.temperature_celsius != null ? `${s.temperature_celsius}°C` : '—'}
                          </td>
                          <td className="px-4 py-3 font-semibold">{s.duration_minutes} דק׳</td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{s.visitor_notes || s.instructor_notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients */}
        {tab === 'clients' && (
          <div>
            {loadingClients
              ? <p className="text-slate-400 text-center py-12">טוען...</p>
              : (
                <>
                  <p className="text-slate-500 text-sm mb-3">{clients.length} לקוחות · ממוין לפי שם משפחה</p>
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">#</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">אימייל</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c, i) => (
                          <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                            <td className="px-4 py-3 font-medium">{c.name}</td>
                            <td className="px-4 py-3 text-slate-600 font-mono">{c.phone || '—'}</td>
                            <td className="px-4 py-3 text-slate-500">{c.email || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
          </div>
        )}
      </div>
    </main>
  );
}
