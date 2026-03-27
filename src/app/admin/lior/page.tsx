'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { ClientEntry } from '@/app/api/admin/clients/route';
import AvailabilityTable, { AvailabilitySlot } from '@/components/AvailabilityTable';

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
  { name: 'ליאור כ"ץ',        phone: null,          facebook: null,                                         email: null },
  { name: 'אורן אלון',        phone: null,          facebook: null,                                         email: null },
  { name: 'איתמר מאיירס',     phone: null,          facebook: null,                                         email: null },
  { name: 'גולן בר נוי',      phone: null,          facebook: null,                                         email: null },
  { name: 'גיא רייבנבך',      phone: '052-8761110', facebook: 'https://www.facebook.com/share/1KpjfpeyKV/', email: null },
  { name: 'גילה גרוס קורנט',  phone: null,          facebook: null,                                         email: null },
  { name: 'ורד פקטור',        phone: null,          facebook: null,                                         email: 'vered79@gmail.com' },
  { name: 'יסמין חמוד',       phone: null,          facebook: null,                                         email: null },
  { name: 'ראם נביס',         phone: null,          facebook: null,                                         email: 'reemne1@gmail.com' },
  { name: 'שיר ממן שמואלי',   phone: null,          facebook: null,                                         email: null },
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

type TabType = 'lior' | 'immersion' | 'clients' | 'instructors' | 'workshops' | 'reviews' | 'manage-instructors' | 'users' | 'availability';

interface InstructorWorkshop {
  id: string;
  workshop_date: string;
  workshop_time: string;
  instructor_name: string;
  notes: string | null;
  status: 'pending' | 'accepted' | 'declined';
  max_participants: number;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  function adminHeaders(extra?: Record<string, string>): Record<string, string> {
    const visitorId = typeof window !== 'undefined' ? (localStorage.getItem('visitor_id') ?? '') : '';
    return { 'x-admin-key': key, 'x-visitor-id': visitorId, ...extra };
  }

  const [tab, setTab] = useState<TabType>('lior');

  // ── Lior workshop bookings ──
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loadingL, setLoadingL]   = useState(true);
  const [errorL, setErrorL]       = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);

  // ── Immersion slots ──
  const [slots, setSlots]           = useState<ImmersionSlot[]>([]);
  const [loadingS, setLoadingS]     = useState(false);
  const [errorS, setErrorS]         = useState('');
  const [fromDate, setFromDate]     = useState('');
  const [toDate, setToDate]         = useState('');
  const [fromTime, setFromTime]     = useState('');
  const [toTime, setToTime]         = useState('');
  const [newMax, setNewMax]         = useState(10);
  const [newNotes, setNewNotes]     = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newInstructorId, setNewInstructorId] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);
  const [addSlotMsg, setAddSlotMsg] = useState('');
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  // ── Clients ──
  const [clients, setClients]     = useState<ClientEntry[]>([]);
  const [loadingC, setLoadingC]   = useState(false);
  const [errorC, setErrorC]       = useState('');
  const [healthChecks, setHealthChecks] = useState<Record<string, { daily: boolean; general: boolean }>>({});
  const [clientSearch, setClientSearch] = useState('');

  // ── Instructors ──
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  // ── Instructor workshops ──
  const [iworkshops, setIworkshops]     = useState<InstructorWorkshop[]>([]);
  const [loadingW, setLoadingW]         = useState(false);
  const [wDate, setWDate]               = useState('');
  const [wTime, setWTime]               = useState('09:00');
  const [wInstructor, setWInstructor]   = useState(DEMO_INSTRUCTORS[0].name);
  const [wNotes, setWNotes]             = useState('');
  const [wMax, setWMax]                 = useState(10);
  const [addingW, setAddingW]           = useState(false);
  const [wMsg, setWMsg]                 = useState('');

  // ── Instructor CRUD ──
  interface DbInstructor { id: string; name: string; slug: string | null; bio: string; photo_url: string | null; specialties: string[]; certifications: string[]; quote: string | null; facebook_url: string | null; phone: string | null; email_contact: string | null; female: boolean; sort_order: number; is_active: boolean; }
  const [dbInstructors, setDbInstructors] = useState<DbInstructor[]>([]);
  const [loadingDbI, setLoadingDbI] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<DbInstructor | null>(null);
  const [editSpecialtiesStr, setEditSpecialtiesStr] = useState('');
  const [editCertificationsStr, setEditCertificationsStr] = useState('');
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [instrForm, setInstrForm] = useState({ name: '', slug: '', bio: '', photo_url: '', specialties: '', certifications: '', quote: '', facebook_url: '', phone: '', email_contact: '', female: false, sort_order: 99 });
  const [instrMsg, setInstrMsg] = useState('');
  // ── Users ──
  interface UserEntry { id: string; name: string; email: string | null; phone: string | null; role: string; created_at: string; }
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loadingU, setLoadingU] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [roleEmail, setRoleEmail] = useState('');
  const [roleValue, setRoleValue] = useState('instructor');
  const [roleMsg, setRoleMsg] = useState('');
  // ── Availability ──
  const [availInstructorId, setAvailInstructorId] = useState('');
  const [availSlots, setAvailSlots] = useState<AvailabilitySlot[]>([]);
  const [availBlocked, setAvailBlocked] = useState<{ id: string; from_date: string; to_date: string; reason: string }[]>([]);
  const [availSaving, setAvailSaving] = useState(false);
  const [availMsg, setAvailMsg] = useState('');

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

  const loadWorkshops = useCallback(async () => {
    setLoadingW(true);
    try {
      const res = await fetch(`/api/admin/instructor-workshops?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setIworkshops(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoadingW(false);
  }, [key]);

  const loadDbInstructors = useCallback(async () => {
    setLoadingDbI(true);
    try {
      const res = await fetch('/api/admin/instructors', { headers: adminHeaders() });
      const data = await res.json();
      setDbInstructors(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoadingDbI(false);
  }, [key]);

  const loadUsers = useCallback(async () => {
    setLoadingU(true);
    try {
      const res = await fetch('/api/admin/users', { headers: adminHeaders() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoadingU(false);
  }, [key]);

  useEffect(() => { loadLior(); setHealthChecks(loadHealthChecks()); }, [loadLior]);
  useEffect(() => { if (tab === 'immersion') loadSlots(); }, [tab, loadSlots]);
  useEffect(() => { if (tab === 'clients') loadClients(); }, [tab, loadClients]);
  useEffect(() => { if (tab === 'workshops') loadWorkshops(); }, [tab, loadWorkshops]);
  useEffect(() => { if (tab === 'manage-instructors') loadDbInstructors(); }, [tab, loadDbInstructors]);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, loadUsers]);
  useEffect(() => { if (tab === 'availability') loadDbInstructors(); }, [tab, loadDbInstructors]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function deleteBooking(id: string) {
    if (!confirm('למחוק רישום זה?')) return;
    setDeleting(id);
    await fetch(`/api/admin/lior-bookings?key=${encodeURIComponent(key)}&id=${id}`, { method: 'DELETE' });
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleting(null);
  }

  // Compute preview slot count for range form
  function previewSlotCount(): number {
    if (!fromDate || !toDate || !fromTime || !toTime) return 0;
    const [fh, fm] = fromTime.split(':').map(Number);
    const [th, tm] = toTime.split(':').map(Number);
    const fromMin = fh * 60 + fm;
    const toMin   = th * 60 + tm;
    if (toMin < fromMin) return 0;
    const stepsPerDay = Math.floor((toMin - fromMin) / 10) + 1;
    const d1 = new Date(fromDate + 'T00:00:00');
    const d2 = new Date(toDate   + 'T00:00:00');
    const days = Math.max(0, Math.round((d2.getTime() - d1.getTime()) / 86400000)) + 1;
    return stepsPerDay * days;
  }

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!fromDate || !toDate || !fromTime || !toTime) return;
    setAddingSlot(true); setAddSlotMsg('');
    const res = await fetch(`/api/admin/immersion-slots?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_date: fromDate, to_date: toDate, from_time: fromTime, to_time: toTime, max_participants: newMax, notes: newNotes, location: newLocation, instructor_id: newInstructorId || undefined }),
    });
    const data = await res.json() as { success?: boolean; count?: number; error?: string };
    if (res.ok) {
      setAddSlotMsg(`✅ נוצרו ${data.count} מועדים בהצלחה`);
      setFromDate(''); setToDate(''); setFromTime(''); setToTime(''); setNewNotes(''); setNewLocation(''); setNewInstructorId('');
      await loadSlots();
    } else {
      setAddSlotMsg(`❌ ${data.error ?? 'שגיאה'}`);
    }
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

  async function addWorkshop(e: React.FormEvent) {
    e.preventDefault();
    if (!wDate || !wTime || !wInstructor) return;
    setAddingW(true); setWMsg('');
    const res = await fetch(`/api/admin/instructor-workshops?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshop_date: wDate, workshop_time: wTime, instructor_name: wInstructor, notes: wNotes, max_participants: wMax }),
    });
    const data = await res.json();
    if (res.ok) {
      setWMsg('✅ הזמנה נשלחה בהצלחה');
      setWDate(''); setWNotes('');
      await loadWorkshops();
    } else {
      setWMsg(`❌ ${data.error ?? 'שגיאה'}`);
    }
    setAddingW(false);
  }

  async function deleteWorkshop(id: string) {
    if (!confirm('למחוק סדנה זו?')) return;
    await fetch(`/api/admin/instructor-workshops?key=${encodeURIComponent(key)}&id=${id}`, { method: 'DELETE' });
    setIworkshops(prev => prev.filter(w => w.id !== id));
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
          ['workshops',   '🏊 סדנאות מדריכים'],
          ['clients',     '👥 לקוחות'],
          ['manage-instructors', '🏊 ניהול מדריכים'],
          ['users',        '👤 משתמשים'],
          ['availability', '📅 זמינות מדריכים'],
          ['instructors',  '📧 הזמנות מדריכים'],
          ['reviews',      '✍️ חוות דעת'],
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
            <h2 className="text-lg font-black text-navy-900 mb-1">➕ הוסף מועדי טבילה</h2>
            <p className="text-xs text-slate-400 mb-4">המערכת תיצור מועדים בהפרשים של 10 דקות בין השעות שתזין</p>
            <form onSubmit={addSlot} className="space-y-3">
              {/* Row 1: date range */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מתאריך</label>
                  <input type="date" required value={fromDate} onChange={e => setFromDate(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">עד תאריך</label>
                  <input type="date" required value={toDate} onChange={e => setToDate(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              {/* Row 2: time range */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">משעה</label>
                  <input type="time" required value={fromTime} onChange={e => setFromTime(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">עד שעה</label>
                  <input type="time" required value={toTime} onChange={e => setToTime(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              {/* Row 3: max + notes */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מקס׳ משתתפים לכל מועד</label>
                  <input type="number" min={1} max={20} value={newMax} onChange={e => setNewMax(Number(e.target.value))}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">הערה (אופציונלי)</label>
                  <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="למשל: קבוצת בוקר"
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              {/* Row 4: location + instructor */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מיקום</label>
                  <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="למשל: חולון סירני 52"
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">מדריך אחראי</label>
                  <select value={newInstructorId} onChange={e => setNewInstructorId(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
                    <option value="">— ללא מדריך ספציפי —</option>
                    {dbInstructors.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Preview */}
              {previewSlotCount() > 0 && (
                <div className="bg-ice-50 border border-ice-200 rounded-xl px-4 py-2 text-sm text-ice-700 font-semibold">
                  יוצרו <strong>{previewSlotCount()}</strong> מועדים (כל 10 דקות, {fromTime}–{toTime}, {fromDate} עד {toDate})
                </div>
              )}
              <button type="submit" disabled={addingSlot || previewSlotCount() === 0}
                className="w-full bg-ice-600 hover:bg-ice-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                {addingSlot ? 'יוצר מועדים...' : `+ צור ${previewSlotCount() > 0 ? previewSlotCount() + ' ' : ''}מועדים`}
              </button>
              {addSlotMsg && (
                <p className={`text-sm font-semibold text-center ${addSlotMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {addSlotMsg}
                </p>
              )}
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

      {/* ── TAB: Instructor Workshops ── */}
      {tab === 'workshops' && (
        <div className="space-y-8">
          {/* Add form */}
          <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-6">
            <h2 className="text-xl font-black text-navy-900 mb-1 text-right">+ שלח הזמנת סדנה למדריך</h2>
            <p className="text-slate-500 text-sm mb-5 text-right">בחר תאריך, שעה ומדריך — ההזמנה תופיע בדשבורד המדריך</p>
            <form onSubmit={addWorkshop} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 text-right">תאריך *</label>
                <input type="date" value={wDate} onChange={e => setWDate(e.target.value)} required
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ice-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 text-right">שעה *</label>
                <input type="time" value={wTime} onChange={e => setWTime(e.target.value)} required
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ice-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 text-right">מדריך *</label>
                <select value={wInstructor} onChange={e => setWInstructor(e.target.value)} required
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ice-400 bg-white">
                  {DEMO_INSTRUCTORS.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 text-right">מקס&apos; משתתפים</label>
                <input type="number" value={wMax} onChange={e => setWMax(Number(e.target.value))} min={1} max={100}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ice-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1 text-right">הערות (אופציונלי)</label>
                <input type="text" value={wNotes} onChange={e => setWNotes(e.target.value)} placeholder="למשל: בריכה חיצונית, תל אביב"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ice-400" />
              </div>
              <div className="col-span-2">
                <button type="submit" disabled={addingW || !wDate || !wTime}
                  className="w-full bg-navy-900 hover:bg-navy-700 disabled:opacity-40 text-white font-black py-3 rounded-xl text-sm transition-colors">
                  {addingW ? 'שולח...' : '📨 שלח הזמנה למדריך'}
                </button>
                {wMsg && <p className={`mt-2 text-sm text-center font-semibold ${wMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{wMsg}</p>}
              </div>
            </form>
          </div>

          {/* Workshops table */}
          <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-navy-900">כל הסדנאות</h2>
              <button onClick={loadWorkshops} className="text-sm text-ice-600 hover:text-ice-800 font-semibold">↻ רענן</button>
            </div>
            {loadingW ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : iworkshops.length === 0 ? (
              <div className="text-center py-12 text-slate-400">אין סדנאות עדיין</div>
            ) : (
              <table className="w-full text-sm" dir="rtl">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">שם מדריך</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">הערות</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">מס&apos; נרשמים</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">תשובת מדריך</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {iworkshops.map(w => (
                    <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold">
                        {new Date(w.workshop_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-mono">{w.workshop_time?.slice(0, 5)}</td>
                      <td className="px-4 py-3">{w.instructor_name}</td>
                      <td className="px-4 py-3 text-slate-400">{w.notes || '—'}</td>
                      <td className="px-4 py-3 text-center">{w.max_participants}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          w.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          w.status === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {w.status === 'accepted' ? '✅ אישר' : w.status === 'declined' ? '❌ דחה' : '⏳ ממתין'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteWorkshop(w.id)}
                          className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Reviews ── */}
      {tab === 'reviews' && (
        <div className="text-center py-10">
          <p className="text-slate-500 mb-6">ניהול חוות דעת — אישור ודחייה לפרסום באתר</p>
          <a
            href={`/admin/reviews?key=${encodeURIComponent(
              typeof window !== 'undefined' ? (localStorage.getItem('admin_key') || 'lior2026') : 'lior2026'
            )}`}
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-700 text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg">
            ✍️ פתח דשבורד חוות דעת
          </a>
        </div>
      )}

      {/* ── TAB: Manage Instructors ── */}
      {tab === 'manage-instructors' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-black text-navy-900">ניהול מדריכים</h2>
            <div className="flex gap-2">
              <button onClick={async () => {
                if (!confirm('לסנכרן את כל המדריכים מהקוד לבסיס הנתונים? פעולה זו תעדכן מדריכים קיימים ותוסיף חסרים.')) return;
                const res = await fetch('/api/admin/instructors/sync', { method: 'POST', headers: adminHeaders() });
                const data = await res.json();
                if (data.synced > 0) { alert(`סונכרנו ${data.synced} מדריכים בהצלחה${data.errors?.length ? '\n\nשגיאות:\n' + data.errors.join('\n') : ''}`); await loadDbInstructors(); }
                else alert('שגיאה: ' + (data.error || data.errors?.join('\n') || 'לא ידוע'));
              }} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                🔄 סנכרן מדריכים
              </button>
              <button onClick={() => { setShowAddInstructor(v => !v); setInstrMsg(''); setEditingInstructor(null); }}
                className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                {showAddInstructor ? 'סגור' : '+ הוסף מדריך'}
              </button>
            </div>
          </div>

          {showAddInstructor && (
            <div className="bg-ice-50 border border-ice-200 rounded-2xl p-5">
              <h3 className="font-bold text-navy-900 mb-4">מדריך חדש</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {(['name', 'slug', 'photo_url', 'phone', 'email_contact', 'facebook_url', 'quote'] as (keyof typeof instrForm)[]).map(field => (
                  <div key={field}>
                    <label className="block text-slate-600 mb-1">{field}</label>
                    <input type="text" value={instrForm[field] as string}
                      onChange={e => setInstrForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" />
                  </div>
                ))}
                <div>
                  <label className="block text-slate-600 mb-1">סדר תצוגה</label>
                  <input type="number" value={instrForm.sort_order}
                    onChange={e => setInstrForm(prev => ({ ...prev, sort_order: parseInt(e.target.value)||99 }))}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id="female-new" checked={instrForm.female}
                    onChange={e => setInstrForm(prev => ({ ...prev, female: e.target.checked }))} className="w-4 h-4" />
                  <label htmlFor="female-new" className="text-slate-600">מדריכה (נקבה)</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 mb-1">ביוגרפיה</label>
                  <textarea value={instrForm.bio} rows={3}
                    onChange={e => setInstrForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">התמחויות (פסיק)</label>
                  <input type="text" value={instrForm.specialties} placeholder="יוגה, נשימה"
                    onChange={e => setInstrForm(prev => ({ ...prev, specialties: e.target.value }))}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">הסמכות (פסיק)</label>
                  <input type="text" value={instrForm.certifications} placeholder="CWI Instructor Certified"
                    onChange={e => setInstrForm(prev => ({ ...prev, certifications: e.target.value }))}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" />
                </div>
              </div>
              {instrMsg && <p className={`mt-3 text-sm font-semibold ${instrMsg.startsWith('X') ? 'text-red-600' : 'text-green-700'}`}>{instrMsg}</p>}
              <button onClick={async () => {
                if (!instrForm.name.trim()) return;
                setInstrMsg('');
                const res = await fetch('/api/admin/instructors', {
                  method: 'POST',
                  headers: adminHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify(instrForm),
                });
                const data = await res.json();
                if (!res.ok) { setInstrMsg('X ' + (data.error || 'שגיאה')); return; }
                setInstrMsg('V נוסף בהצלחה: ' + data.name);
                setInstrForm({ name: '', slug: '', bio: '', photo_url: '', specialties: '', certifications: '', quote: '', facebook_url: '', phone: '', email_contact: '', female: false, sort_order: 99 });
                await loadDbInstructors();
              }} className="mt-4 bg-navy-900 hover:bg-navy-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
                הוסף
              </button>
            </div>
          )}

          {loadingDbI ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : dbInstructors.length === 0 ? (
            <p className="text-slate-400 text-center py-8">אין מדריכים בבסיס הנתונים. לחץ על "🔄 סנכרן מדריכים" להוספתם.</p>
          ) : (
            <div className="space-y-3">
              {dbInstructors.map(inst => (
                <div key={inst.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  {editingInstructor?.id === inst.id ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <label className="block text-slate-500 mb-1">שם</label>
                          <input type="text" value={editingInstructor.name}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">slug (URL)</label>
                          <input type="text" value={editingInstructor.slug || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, slug: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">תמונה URL</label>
                          <input type="text" value={editingInstructor.photo_url || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, photo_url: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">טלפון</label>
                          <input type="text" value={editingInstructor.phone || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, phone: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">אימייל</label>
                          <input type="text" value={editingInstructor.email_contact || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, email_contact: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">Facebook</label>
                          <input type="text" value={editingInstructor.facebook_url || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, facebook_url: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-slate-500 mb-1">ביוגרפיה</label>
                          <textarea value={editingInstructor.bio || ''} rows={3}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, bio: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">התמחויות (פסיק)</label>
                          <input type="text" value={editSpecialtiesStr}
                            onChange={e => setEditSpecialtiesStr(e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">הסמכות (פסיק)</label>
                          <input type="text" value={editCertificationsStr}
                            onChange={e => setEditCertificationsStr(e.target.value)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-slate-500 mb-1">ציטוט</label>
                          <input type="text" value={editingInstructor.quote || ''}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, quote: e.target.value } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={editingInstructor.female}
                              onChange={e => setEditingInstructor(prev => prev ? { ...prev, female: e.target.checked } : null)} className="w-4 h-4" />
                            מדריכה (נקבה)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" checked={editingInstructor.is_active}
                              onChange={e => setEditingInstructor(prev => prev ? { ...prev, is_active: e.target.checked } : null)} className="w-4 h-4" />
                            פעיל
                          </label>
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">סדר</label>
                          <input type="number" value={editingInstructor.sort_order}
                            onChange={e => setEditingInstructor(prev => prev ? { ...prev, sort_order: parseInt(e.target.value) || 0 } : null)}
                            className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          const payload = {
                            ...editingInstructor,
                            specialties: editSpecialtiesStr.split(',').map((s: string) => s.trim()).filter(Boolean),
                            certifications: editCertificationsStr.split(',').map((s: string) => s.trim()).filter(Boolean),
                          };
                          const res = await fetch('/api/admin/instructors', {
                            method: 'PATCH',
                            headers: adminHeaders({ 'Content-Type': 'application/json' }),
                            body: JSON.stringify(payload),
                          });
                          if (res.ok) { setEditingInstructor(null); await loadDbInstructors(); }
                          else { const d = await res.json(); alert('שגיאה בשמירה: ' + (d.error || res.status)); }
                        }} className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-4 py-1.5 rounded-lg text-sm transition-colors">
                          שמור
                        </button>
                        <button onClick={() => setEditingInstructor(null)}
                          className="text-slate-400 hover:text-slate-600 text-sm px-3">
                          ביטול
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        {inst.photo_url && (
                          <img src={inst.photo_url} alt={inst.name}
                            className="w-12 h-12 rounded-full object-cover" />
                        )}
                        <div>
                          <h3 className="font-bold text-navy-900">{inst.name}</h3>
                          <p className="text-xs text-slate-400">
                            {inst.slug || 'ללא slug'} · {inst.is_active ? 'פעיל' : 'לא פעיל'} · סדר: {inst.sort_order}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingInstructor(inst); setEditSpecialtiesStr((inst.specialties || []).join(', ').replace(/\|/g, ', ')); setEditCertificationsStr((inst.certifications || []).join(', ').replace(/\|/g, ', ')); }}
                          className="bg-navy-100 hover:bg-navy-200 text-navy-900 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors">
                          עריכה
                        </button>
                        <button onClick={async () => {
                          if (!confirm('למחוק מדריך זה?')) return;
                          await fetch(`/api/admin/instructors?id=${inst.id}`, {
                            method: 'DELETE',
                            headers: adminHeaders(),
                          });
                          await loadDbInstructors();
                        }} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors">
                          מחק
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Users ── */}
      {tab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-black text-navy-900 mb-4">הגדרת תפקיד למשתמש</h2>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-semibold text-slate-700 mb-1">אימייל משתמש</label>
                <input type="email" value={roleEmail} onChange={e => setRoleEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-400 text-right" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">תפקיד</label>
                <select value={roleValue} onChange={e => setRoleValue(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-400">
                  <option value="user">משתמש רגיל</option>
                  <option value="instructor">מדריך</option>
                  <option value="admin">אדמין</option>
                </select>
              </div>
              <button onClick={async () => {
                if (!roleEmail.trim()) return;
                setRoleMsg('');
                const res = await fetch('/api/admin/users', {
                  method: 'PATCH',
                  headers: adminHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify({ email: roleEmail.trim(), role: roleValue }),
                });
                const data = await res.json();
                if (!res.ok) { setRoleMsg('שגיאה: ' + (data.error || 'לא נמצא')); return; }
                setRoleMsg('עודכן: ' + (data.name || data.email));
                setRoleEmail('');
                await loadUsers();
              }} className="bg-navy-900 hover:bg-navy-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                עדכן תפקיד
              </button>
            </div>
            {roleMsg && <p className={`mt-2 text-sm font-semibold ${roleMsg.startsWith('ש') ? 'text-red-600' : 'text-green-700'}`}>{roleMsg}</p>}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-900">משתמשים רשומים ({users.length})</h2>
              <button onClick={loadUsers} className="text-sm text-slate-400 hover:text-navy-900 font-semibold">רענן</button>
            </div>
            <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
              placeholder="חיפוש לפי שם / אימייל..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ice-400 text-right text-sm" />
            {loadingU ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {users
                  .filter(u => !userSearch || (u.name || '').includes(userSearch) || (u.email || '').includes(userSearch))
                  .map(u => (
                    <div key={u.id} className="flex items-center justify-between py-3 gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email || u.phone || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'instructor' ? 'bg-ice-100 text-ice-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role === 'admin' ? 'אדמין' : u.role === 'instructor' ? 'מדריך' : 'משתמש'}
                        </span>
                        <select defaultValue={u.role} onChange={async e => {
                          const res = await fetch('/api/admin/users', {
                            method: 'PATCH',
                            headers: adminHeaders({ 'Content-Type': 'application/json' }),
                            body: JSON.stringify({ id: u.id, role: e.target.value }),
                          });
                          if (res.ok) await loadUsers();
                        }} className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none">
                          <option value="user">משתמש</option>
                          <option value="instructor">מדריך</option>
                          <option value="admin">אדמין</option>
                        </select>
                        {['instructor', 'admin'].includes(u.role) && (
                          <button onClick={async () => {
                            if (!confirm(`למחוק את ${u.name}?`)) return;
                            const res = await fetch(`/api/admin/users?id=${u.id}`, {
                              method: 'DELETE', headers: adminHeaders(),
                            });
                            if (res.ok) await loadUsers();
                            else { const d = await res.json(); alert('שגיאה: ' + (d.error || res.status)); }
                          }} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-lg transition-colors">
                            מחק
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Availability ── */}
      {tab === 'availability' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-lg font-bold text-navy-900 mb-4">זמינות שבועית — לפי מדריך</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">בחר מדריך</label>
              <select value={availInstructorId} onChange={async e => {
                const id = e.target.value;
                setAvailInstructorId(id);
                setAvailSlots([]); setAvailBlocked([]); setAvailMsg('');
                if (!id) return;
                const res = await fetch(`/api/admin/instructor-availability?instructor_id=${id}&key=${encodeURIComponent(key)}`);
                const d = await res.json();
                setAvailSlots(d.slots ?? []);
                setAvailBlocked(d.blocked ?? []);
              }} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ice-400 bg-white min-w-56">
                <option value="">— בחר מדריך —</option>
                {dbInstructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            {availInstructorId && (
              <div className="space-y-6">
                <AvailabilityTable type="workshop" title="סדנאות — שעות פוטנציאליות" data={availSlots} onChange={setAvailSlots} />
                <AvailabilityTable type="immersion" title="הטבלות — שעות פוטנציאליות" data={availSlots} onChange={setAvailSlots} />

                <div className="flex items-center gap-4">
                  <button onClick={async () => {
                    setAvailSaving(true); setAvailMsg('');
                    const res = await fetch(`/api/admin/instructor-availability?instructor_id=${availInstructorId}&key=${encodeURIComponent(key)}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ slots: availSlots }),
                    });
                    const d = await res.json();
                    setAvailMsg(res.ok ? `✅ נשמר (${d.saved} שורות)` : `❌ ${d.error}`);
                    setAvailSaving(false);
                    setTimeout(() => setAvailMsg(''), 3000);
                  }} disabled={availSaving}
                    className="bg-navy-900 hover:bg-navy-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                    {availSaving ? 'שומר...' : 'שמור זמינות'}
                  </button>
                  {availMsg && <span className={`text-sm font-semibold ${availMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{availMsg}</span>}
                </div>

                {availBlocked.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">תאריכים חסומים</h3>
                    <div className="space-y-2">
                      {availBlocked.map(b => (
                        <div key={b.id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm">
                          <span className="font-mono font-semibold text-orange-800">
                            {b.from_date} — {b.to_date}
                            {b.reason && <span className="text-orange-600 font-normal mr-2">({b.reason})</span>}
                          </span>
                          <button onClick={async () => {
                            await fetch(`/api/admin/instructor-availability?id=${b.id}&key=${encodeURIComponent(key)}`, { method: 'DELETE' });
                            setAvailBlocked(prev => prev.filter(x => x.id !== b.id));
                          }} className="text-xs text-red-400 hover:text-red-600 font-semibold">מחק</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
