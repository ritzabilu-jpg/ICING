'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { ClientEntry } from '@/app/api/admin/clients/route';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string; time_slot: string; slot_date: string;
  name: string; phone: string; created_at: string;
}

interface ImmersionSlot {
  id: string; slot_date: string; slot_time: string;
  max_participants: number; notes: string; booked: number;
  bookings: { visitor_name: string; visitor_phone: string; package_type: string; created_at: string }[];
}

const TIME_SLOTS = ['08:00', '09:30', '11:00'];
const MAX = 10;

const PKG_LABELS: Record<string, string> = {
  single: 'בודדת', '5pack': 'חבילת 5', '10pack': 'חבילת 10',
};

const DEMO_INSTRUCTORS = [
  { name: 'ליאור כ"ץ',   phone: null,          facebook: null,                                       email: 'lior@example.com' },
  { name: 'גיא רייבנבך', phone: '052-8761110', facebook: 'https://www.facebook.com/share/1KpjfpeyKV/', email: null },
  { name: 'יוסי כהן',    phone: null,          facebook: null,                                       email: null },
  { name: 'מירה לוי',    phone: null,          facebook: null,                                       email: null },
];

const HEALTH_KEY = 'admin_health_checks_v1';

function loadHealthChecks(): Record<string, { daily: boolean; general: boolean }> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(HEALTH_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveHealthChecks(data: Record<string, { daily: boolean; general: boolean }>) {
  localStorage.setItem(HEALTH_KEY, JSON.stringify(data));
}

// ─── Admin Content ────────────────────────────────────────────────────────────

type TabType = 'lior' | 'immersion' | 'clients' | 'instructors';

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  const [tab, setTab] = useState<TabType>('lior');

  // ── Lior workshop bookings ──
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loadingL, setLoadingL]   = useState(true);
  const [errorL, setErrorL]       = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);

  // ── Immersion slots ──
  const [slots, setSlots]         = useState<ImmersionSlot[]>([]);
  const [loadingS, setLoadingS]   = useState(false);
  const [errorS, setErrorS]       = useState('');
  const [newDate, setNewDate]     = useState('');
  const [newTime, setNewTime]     = useState('');
  const [newMax, setNewMax]       = useState(10);
  const [newNotes, setNewNotes]   = useState('');
  const [addingSlot, setAddingSlot] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  // ── Clients ──
  const [clients, setClients]     = useState<ClientEntry[]>([]);
  const [loadingC, setLoadingC]   = useState(false);
  const [errorC, setErrorC]       = useState('');
  const [healthChecks, setHealthChecks] = useState<Record<string, { daily: boolean; general: boolean }>>({});
  const [clientSearch, setClientSearch] = useState('');

  // ── Instructors ──
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  // ── Load functions ──────────────────────────────────────────────────────────

  const loadLior = useCallback(async () => {
    setLoadingL(true); setErrorL('');
    try {
      const res = await fetch(`/api/admin/lior-bookings?key=${encodeURIComponent(key)}`);
      const data = await res.json() as { bookings?: Booking[]; error?: string };
      if (!res.ok) setErrorL(res.status === 401 ? 'קוד גישה שגוי' : (data.error ?? 'שגיאה'));
      else setBookings(data.bookings ?? []);
    } catch { setErrorL('שגיאת רשת'); }
    finally { setLoadingL(false); }
  }, [key]);

  const loadSlots = useCallback(async () => {
    setLoadingS(true); setErrorS('');
    try {
      const res = await fetch(`/api/admin/immersion-slots?key=${encodeURIComponent(key)}`);
      const data = await res.json() as { slots?: ImmersionSlot[]; error?: string };
      if (!res.ok) setErrorS(data.error ?? 'שגיאה');
      else setSlots(data.slots ?? []);
    } catch { setErrorS('שגיאת רשת'); }
    finally { setLoadingS(false); }
  }, [key]);

  const loadClients = useCallback(async () => {
    setLoadingC(true); setErrorC('');
    try {
      const res = await fetch(`/api/admin/clients?key=${encodeURIComponent(key)}`);
      const data = await res.json() as { clients?: ClientEntry[]; error?: string };
      if (!res.ok) setErrorC(data.error ?? 'שגיאה');
      else setClients(data.clients ?? []);
    } catch { setErrorC('שגיאת רשת'); }
    finally { setLoadingC(false); }
  }, [key]);

  useEffect(() => { loadLior(); setHealthChecks(loadHealthChecks()); }, [loadLior]);
  useEffect(() => { if (tab === 'immersion') loadSlots(); }, [tab, loadSlots]);
  useEffect(() => { if (tab === 'clients') loadClients(); }, [tab, loadClients]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function deleteBooking(id: string) {
    if (!confirm('למחוק רישום זה?')) return;
    setDeleting(id);
    await fetch(`/api/admin/lior-bookings?key=${encodeURIComponent(key)}&id=${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleting(null);
  }

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setAddingSlot(true);
    const res = await fetch(`/api/admin/immersion-slots?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_date: newDate, slot_time: newTime, max_participants: newMax, notes: newNotes }),
    });
    if (res.ok) { setNewDate(''); setNewTime(''); setNewNotes(''); await loadSlots(); }
    setAddingSlot(false);
  }

  async function deleteSlot(id: string) {
    if (!confirm('למחוק מועד זה? כל ההרשמות אליו יימחקו.')) return;
    await fetch(`/api/admin/immersion-slots?key=${encodeURIComponent(key)}&id=${id}`, { method: 'DELETE' });
    setSlots(prev => prev.filter(s => s.id !== id));
  }

  function toggleHealth(clientId: string, field: 'daily' | 'general') {
    const updated = { ...healthChecks, [clientId]: { ...(healthChecks[clientId] ?? { daily: false, general: false }), [field]: !healthChecks[clientId]?.[field] } };
    setHealthChecks(updated);
    saveHealthChecks(updated);
  }

  function exportCSV() {
    const rows = [['שעה', 'תאריך', 'שם', 'טלפון', 'זמן הרשמה']];
    for (const b of bookings)
      rows.push([b.time_slot, b.slot_date, b.name, b.phone, new Date(b.created_at).toLocaleString('he-IL')]);
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `לקוחות.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function getInviteMessage(instructor: typeof DEMO_INSTRUCTORS[0]) {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://icing-blond.vercel.app'}/admin/lior?key=${key}`;
    return `שלום ${instructor.name},\n\nמוזמן/ת לצפות בלוח ניהול הסדנאות והלקוחות שלך:\n${url}\n\nבברכה,\nצוות חוויות שוויץ המדע`;
  }

  // ── Auth check ───────────────────────────────────────────────────────────────
  if (!loadingL && errorL === 'קוד גישה שגוי') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold text-red-600">{errorL}</p>
          <p className="text-slate-500 mt-2 text-sm">הוסיפו ?key=הקוד לכתובת הדף</p>
        </div>
      </div>
    );
  }

  const filteredClients = clients.filter(c =>
    !clientSearch || c.name.includes(clientSearch) || c.phone.includes(clientSearch)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">

      <h1 className="text-3xl font-black text-navy-900 mb-6">לוח אדמין</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200 flex-wrap">
        {([
          ['lior',        '📋 סדנת ליאור כ"ץ'],
          ['immersion',   '🧊 מועדי טבילה'],
          ['clients',     '👥 לקוחות'],
          ['instructors', '📧 מדריכים'],
        ] as [TabType, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 font-bold text-sm rounded-t-xl transition-colors ${
              tab === t
                ? 'bg-white border-2 border-b-white border-slate-200 -mb-px text-navy-900'
                : 'text-slate-500 hover:text-navy-900'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Lior workshop ── */}
      {tab === 'lior' && (
        loadingL ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <p className="text-slate-500">19.3.2026 · {bookings.length} נרשמים בסה&quot;כ</p>
              <div className="flex gap-3">
                <button onClick={loadLior}
                  className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-semibold text-sm">
                  ↻ רענן
                </button>
                <button onClick={exportCSV} disabled={bookings.length === 0}
                  className="px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-700 disabled:opacity-40">
                  ⬇ ייצוא CSV
                </button>
              </div>
            </div>

            {TIME_SLOTS.map(slot => {
              const slotBookings = bookings.filter(b => b.time_slot === slot);
              const count = slotBookings.length;
              const full  = count >= MAX;
              return (
                <div key={slot} className="mb-8 bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
                  <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 ${full ? 'bg-red-50' : 'bg-ice-50'}`}>
                    <div>
                      <span className="text-xl font-black text-navy-900">{slot}</span>
                      <span className="text-slate-500 text-sm mr-3">19.3.2026</span>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${full ? 'bg-red-100 text-red-700' : count === 0 ? 'bg-slate-100 text-slate-500' : 'bg-ice-100 text-ice-700'}`}>
                      {count}/{MAX} {full ? '(מלא)' : 'נרשמו'}
                    </span>
                  </div>
                  {count === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">אין נרשמים עדיין</div>
                  ) : (
                    <table className="w-full text-sm" dir="rtl">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-right px-6 py-3 font-semibold text-slate-600 w-8">#</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">בריאות יומית</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">הצהרה כללית</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">נרשם ב</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {slotBookings.map((b, i) => {
                          const hc = healthChecks[b.id] ?? { daily: false, general: false };
                          return (
                            <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-3 text-slate-400 font-mono text-right">{i + 1}</td>
                              <td className="px-4 py-3 font-semibold text-navy-900 text-right">{b.name}</td>
                              <td className="px-4 py-3 text-slate-600 font-mono text-right">
                                <a href={`tel:${b.phone}`} className="hover:text-ice-600">{b.phone}</a>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" checked={hc.daily}
                                  onChange={() => toggleHealth(b.id, 'daily')}
                                  className="w-4 h-4 accent-ice-500 cursor-pointer" title="הצהרת בריאות יומית" />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" checked={hc.general}
                                  onChange={() => toggleHealth(b.id, 'general')}
                                  className="w-4 h-4 accent-green-500 cursor-pointer" title="הצהרת בריאות כללית" />
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-xs text-right">
                                {new Date(b.created_at).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => deleteBooking(b.id)} disabled={deleting === b.id}
                                  className="text-red-400 hover:text-red-600 disabled:opacity-30" title="מחק">✕</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </>
        )
      )}

      {/* ── TAB: Immersion slots ── */}
      {tab === 'immersion' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-navy-900 mb-4">➕ הוסף מועד טבילה</h2>
            <form onSubmit={addSlot} className="grid sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">תאריך</label>
                <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">שעה</label>
                <input type="time" required value={newTime} onChange={e => setNewTime(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">מקס׳ משתתפים</label>
                <input type="number" min={1} max={20} value={newMax} onChange={e => setNewMax(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">הערה (אופציונלי)</label>
                <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="למשל: קבוצת בוקר"
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <button type="submit" disabled={addingSlot}
                className="sm:col-span-4 bg-ice-600 hover:bg-ice-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {addingSlot ? 'מוסיף...' : '+ הוסף מועד'}
              </button>
            </form>
          </div>

          {loadingS ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : errorS ? (
            <p className="text-red-500 text-sm font-semibold">{errorS}</p>
          ) : slots.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <div className="text-4xl mb-2">📅</div>
              <p>אין מועדים. הוסף מועד ראשון למעלה.</p>
            </div>
          ) : (
            slots.map(s => (
              <div key={s.id} className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-ice-50">
                  <div>
                    <span className="text-xl font-black text-navy-900">
                      {new Date(s.slot_date + 'T00:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <span className="text-slate-500 text-sm mr-3">· {s.slot_time.slice(0, 5)}</span>
                    {s.notes && <span className="text-slate-400 text-xs">· {s.notes}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      s.booked >= s.max_participants ? 'bg-red-100 text-red-700' :
                      s.booked === 0 ? 'bg-slate-100 text-slate-500' : 'bg-ice-100 text-ice-700'}`}>
                      {s.booked}/{s.max_participants}
                    </span>
                    <button onClick={() => setExpandedSlot(expandedSlot === s.id ? null : s.id)}
                      className="text-slate-500 hover:text-navy-900 text-sm font-semibold">
                      {expandedSlot === s.id ? 'סגור ▲' : 'הצג ▼'}
                    </button>
                    <button onClick={() => deleteSlot(s.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 rounded-lg border border-red-200 hover:border-red-400">
                      מחק
                    </button>
                  </div>
                </div>
                {expandedSlot === s.id && (
                  s.bookings.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">אין נרשמים עדיין</div>
                  ) : (
                    <table className="w-full text-sm" dir="rtl">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-right px-6 py-3 font-semibold text-slate-600 w-8">#</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">בריאות יומית</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">הצהרה כללית</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">חבילה</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">נרשם ב</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.bookings.map((b, i) => {
                          const bid = `imm-${s.id}-${i}`;
                          const hc = healthChecks[bid] ?? { daily: false, general: false };
                          return (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="px-6 py-3 text-slate-400 font-mono text-right">{i + 1}</td>
                              <td className="px-4 py-3 font-semibold text-navy-900 text-right">{b.visitor_name}</td>
                              <td className="px-4 py-3 font-mono text-right">
                                <a href={`tel:${b.visitor_phone}`} className="hover:text-ice-600 text-slate-600">{b.visitor_phone}</a>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" checked={hc.daily} onChange={() => toggleHealth(bid, 'daily')}
                                  className="w-4 h-4 accent-ice-500 cursor-pointer" />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" checked={hc.general} onChange={() => toggleHealth(bid, 'general')}
                                  className="w-4 h-4 accent-green-500 cursor-pointer" />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="bg-ice-100 text-ice-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                  {PKG_LABELS[b.package_type] ?? b.package_type}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-xs text-right">
                                {new Date(b.created_at).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB: Clients ── */}
      {tab === 'clients' && (
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-black text-navy-900">רשימת לקוחות מלאה</h2>
            <div className="flex gap-3 items-center">
              <input
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                placeholder="🔍 חיפוש שם / טלפון"
                className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ice-400 w-48"
                dir="rtl"
              />
              <button onClick={loadClients}
                className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-semibold text-sm">
                ↻ רענן
              </button>
              <a href={`/admin/clients?key=${encodeURIComponent(key)}`}
                className="px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-700"
                target="_blank" rel="noopener noreferrer">
                🔗 עמוד מלא
              </a>
            </div>
          </div>

          {loadingC ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : errorC ? (
            <div className="text-center py-10 text-red-500">{errorC}</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-2">👥</div>
              <p>{clientSearch ? 'לא נמצאו לקוחות' : 'אין לקוחות עדיין'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
              <div className="px-6 py-3 bg-ice-50 border-b border-slate-100 text-xs text-slate-500">
                {filteredClients.length} לקוחות | ✓ בריאות יומית · ✓ הצהרה כללית — סמן ידנית לאחר אימות
              </div>
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 w-8">#</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">סוג</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">🧊 יומית</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">📋 כללית</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((c, i) => {
                    const hc = healthChecks[c.id] ?? { daily: false, general: false };
                    return (
                      <tr key={c.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors`}>
                        <td className="px-4 py-3 text-slate-400 font-mono text-right">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-navy-900 text-right">{c.name}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-right">
                          <a href={`tel:${c.phone}`} className="hover:text-ice-600">{c.phone}</a>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full font-semibold">{c.type}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-right text-xs">{c.date} {c.time && `· ${c.time}`}</td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" checked={hc.daily}
                            onChange={() => toggleHealth(c.id, 'daily')}
                            className="w-4 h-4 accent-ice-500 cursor-pointer" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" checked={hc.general}
                            onChange={() => toggleHealth(c.id, 'general')}
                            className="w-4 h-4 accent-green-500 cursor-pointer" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Instructors ── */}
      {tab === 'instructors' && (
        <div className="space-y-5">
          <p className="text-slate-500 text-sm">שלח למדריכים קישור כניסה לניהול הסדנאות ולצפייה ברשימת לקוחות.</p>

          {DEMO_INSTRUCTORS.map(inst => (
            <div key={inst.name} className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-black text-navy-900 mb-1">{inst.name}</h3>
                  <div className="flex gap-4 flex-wrap text-sm">
                    {inst.phone && (
                      <a href={`tel:${inst.phone}`} className="text-slate-600 hover:text-ice-600 font-semibold">
                        📞 {inst.phone}
                      </a>
                    )}
                    {inst.facebook && (
                      <a href={inst.facebook} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold">
                        📘 פייסבוק
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setInviteEmail(inviteEmail === inst.name ? null : inst.name)}
                  className="bg-navy-900 hover:bg-navy-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                  📧 שלח הזמנה
                </button>
              </div>

              {inviteEmail === inst.name && (
                <div className="mt-4 bg-ice-50 border border-ice-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">העתק והעבר למדריך:</p>
                  {inst.email && (
                    <a href={`mailto:${inst.email}?subject=${encodeURIComponent('הזמנה לניהול לוח הסדנאות')}&body=${encodeURIComponent(getInviteMessage(inst))}`}
                      className="inline-block mb-3 text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700">
                      פתח ב-Gmail ↗
                    </a>
                  )}
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap bg-white border border-slate-200 rounded-xl p-3 font-sans leading-relaxed">
                    {getInviteMessage(inst)}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(getInviteMessage(inst))}
                    className="mt-2 text-xs text-slate-500 hover:text-navy-900 font-semibold">
                    📋 העתק ללוח
                  </button>
                </div>
              )}
            </div>
          ))}
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
