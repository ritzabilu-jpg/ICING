'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Booking types ────────────────────────────────────────────────────────
interface MyBooking {
  id: string;
  event_type: string;
  title: string;
  status: string;
  payment_status: string;
  confirmation_code: string;
  amount: number | null;
  health_form_id: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: 'מאושר', cls: 'bg-green-100 text-green-700' },
  pending:   { label: 'ממתין', cls: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'בוטל',  cls: 'bg-red-100 text-red-600'   },
};
const PAY_LABELS: Record<string, { label: string; cls: string }> = {
  paid:     { label: '✅ שולם',    cls: 'bg-green-100 text-green-700' },
  unpaid:   { label: '⏳ לא שולם', cls: 'bg-amber-100 text-amber-700' },
  refunded: { label: '↩ הוחזר',   cls: 'bg-slate-100 text-slate-500' },
};

function BookingsTab({ phone, email }: { phone: string; email: string }) {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone && !email) { setLoading(false); return; }
    const params = new URLSearchParams();
    if (phone) params.set('phone', phone);
    if (email) params.set('email', email);
    fetch(`/api/bookings/my?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setBookings(Array.isArray(d.bookings) ? d.bookings : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [phone]);

  if (loading) return <div className="py-8 text-center text-slate-400">טוען...</div>;
  if (!bookings.length) return (
    <div className="py-10 text-center text-slate-400">
      <p className="text-4xl mb-2">📋</p>
      <p>לא נמצאו הזמנות</p>
    </div>
  );

  const totalPaid    = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.amount ?? 0), 0);
  const totalPending = bookings.filter(b => b.payment_status === 'unpaid').reduce((s, b) => s + (b.amount ?? 0), 0);

  return (
    <div dir="rtl">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-slate-500 mb-0.5">שולם</p>
          <p className="font-black text-green-700 text-lg">₪{totalPaid}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-slate-500 mb-0.5">ממתין</p>
          <p className="font-black text-amber-700 text-lg">₪{totalPending}</p>
        </div>
        <div className="bg-ice-50 border border-ice-100 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-slate-500 mb-0.5">סה&quot;כ הזמנות</p>
          <p className="font-black text-navy-900 text-lg">{bookings.length}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" dir="rtl">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <th className="text-right px-3 py-2 font-semibold">סוג</th>
              <th className="text-right px-3 py-2 font-semibold">אירוע</th>
              <th className="text-right px-3 py-2 font-semibold">תאריך</th>
              <th className="text-right px-3 py-2 font-semibold">סטטוס</th>
              <th className="text-right px-3 py-2 font-semibold">תשלום</th>
              <th className="text-right px-3 py-2 font-semibold">סכום</th>
              <th className="text-right px-3 py-2 font-semibold">קוד</th>
              <th className="text-right px-3 py-2 font-semibold">הצהרה</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const st = STATUS_LABELS[b.status]        ?? { label: b.status,         cls: 'bg-slate-100 text-slate-500' };
              const py = PAY_LABELS[b.payment_status]   ?? { label: b.payment_status, cls: 'bg-slate-100 text-slate-500' };
              return (
                <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-3 py-2.5 text-right text-sm">{b.event_type}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-navy-900 max-w-[120px] truncate">{b.title}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500 text-xs">
                    {new Date(b.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                  <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span></td>
                  <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${py.cls}`}>{py.label}</span></td>
                  <td className="px-3 py-2.5 text-right font-bold text-ice-700">{b.amount != null ? `₪${b.amount}` : '—'}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{b.confirmation_code}</td>
                  <td className="px-3 py-2.5 text-center">
                    {b.health_form_id ? <span className="text-green-600">✅</span> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface Session {
  id: string;
  session_date: string;
  session_time: string;
  temperature_celsius: number | null;
  duration_minutes: number;
  instructor_name: string;
  status?: 'planned' | 'done' | 'cancelled';
  visitor_notes?: string;
  instructor_notes?: string;
  photo_url?: string;
}

interface Visitor {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
}

// ─── Add-Session Form (for instructor/admin) ───────────────────────────────
function AddSessionForm({ targetId, onAdded }: { targetId: string; onAdded: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [temp, setTemp] = useState('');
  const [duration, setDuration] = useState('');
  const [instructor, setInstructor] = useState(localStorage.getItem('visitor_name') || '');
  const [status, setStatus] = useState<'planned' | 'done' | 'cancelled'>('planned');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [instructorNotes, setInstructorNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!duration) return;
    setSaving(true);
    await fetch('/api/immersion-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': localStorage.getItem('visitor_id') || '' },
      body: JSON.stringify({
        visitor_id: targetId,
        session_date: date,
        session_time: time,
        temperature_celsius: temp ? parseFloat(temp) : null,
        duration_minutes: parseInt(duration, 10),
        instructor_name: instructor,
        status,
        visitor_notes: visitorNotes,
        instructor_notes: instructorNotes,
        photo_url: photoUrl,
      }),
    });
    setSaving(false);
    onAdded();
  }

  return (
    <div className="bg-ice-50 border border-ice-100 rounded-2xl p-4 mt-4" dir="rtl">
      <h4 className="font-bold text-navy-900 mb-3">הוסף כניסת טבילה</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><label className="block text-slate-600 mb-1">תאריך</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div><label className="block text-slate-600 mb-1">שעה</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div><label className="block text-slate-600 mb-1">טמפרטורה (°C)</label>
          <input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} placeholder="5.0" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div><label className="block text-slate-600 mb-1">משך (דקות) *</label>
          <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="15" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div><label className="block text-slate-600 mb-1">סטטוס</label>
          <select value={status} onChange={e => setStatus(e.target.value as 'planned' | 'done' | 'cancelled')} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400">
            <option value="planned">מתוכנן</option>
            <option value="done">בוצע</option>
            <option value="cancelled">בוטל</option>
          </select></div>
        <div><label className="block text-slate-600 mb-1">תמונת טבילה (URL)</label>
          <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div className="col-span-2"><label className="block text-slate-600 mb-1">שם מדריך</label>
          <input type="text" value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm mt-3">
        <div><label className="block text-slate-600 mb-1">הערות מטביל</label>
          <textarea value={visitorNotes} onChange={e => setVisitorNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
        <div><label className="block text-slate-600 mb-1">הערות מדריך</label>
          <textarea value={instructorNotes} onChange={e => setInstructorNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ice-400" /></div>
      </div>
      <button onClick={save} disabled={!duration || saving}
        className="mt-3 bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
        {saving ? 'שומר...' : '+ הוסף'}
      </button>
    </div>
  );
}

// ─── Session Journal Table ────────────────────────────────────────────────
function SessionTable({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) return (
    <div className="text-center py-10 text-slate-400">
      <p className="text-4xl mb-2">🏊</p>
      <p>עדיין אין טבילות מתועדות</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">סטטוס</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">טמפרטורה</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">משך טבילה</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600">שם מדריך</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-right">
                {new Date(s.session_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </td>
              <td className="px-4 py-3 text-right font-mono">{s.session_time?.slice(0, 5)}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold">
                {s.status === 'done' ? 'בוצע' : s.status === 'cancelled' ? 'בוטל' : 'מתוכנן'}
              </td>
              <td className="px-4 py-3 text-right text-ice-700 font-semibold">
                {s.temperature_celsius != null ? `${s.temperature_celsius}°C` : '—'}
              </td>
              <td className="px-4 py-3 text-right font-semibold">{s.duration_minutes} דק&apos;</td>
              <td className="px-4 py-3 text-right text-slate-500">{s.instructor_name || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Staff: Clients List ───────────────────────────────────────────────────
function ClientsTab({ myId }: { myId: string }) {
  const [clients, setClients] = useState<Visitor[]>([]);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [healthChecks, setHealthChecks] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetch('/api/visitor-profiles', { headers: { 'x-visitor-id': myId } })
      .then(r => r.json()).then(d => setClients(Array.isArray(d) ? d.filter((c: Visitor) => c.id !== myId) : []));
  }, [myId]);

  async function selectClient(client: Visitor) {
    setSelected(client);
    setShowAddForm(false);
    const [sessRes, hcRes] = await Promise.all([
      fetch(`/api/immersion-sessions?visitor_id=${client.id}`, { headers: { 'x-visitor-id': myId } }),
      fetch(`/api/daily-health-check?visitor_id=${client.id}&date=${today}`),
    ]);
    const [sess, hc] = await Promise.all([sessRes.json(), hcRes.json()]);
    setSessions(Array.isArray(sess) ? sess : []);
    setHealthChecks(prev => ({ ...prev, [client.id]: hc.filled }));
  }

  return (
    <div dir="rtl">
      {!selected ? (
        <div>
          <h3 className="font-bold text-navy-900 mb-4 text-lg">רשימת לקוחות</h3>
          {clients.length === 0 ? (
            <p className="text-slate-400 text-center py-8">אין לקוחות רשומים עדיין</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {clients.map(c => (
                <button key={c.id} onClick={() => selectClient(c)}
                  className="w-full flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors text-right">
                  <div>
                    <p className="font-semibold text-navy-900">{c.name}</p>
                    <p className="text-sm text-slate-400">{c.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                      ${healthChecks[c.id] ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {healthChecks[c.id] ? '✓ מילא היום' : '⚠ לא מילא'}
                    </span>
                    <span className="text-slate-300">◀</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-ice-600 hover:text-ice-800 mb-4 text-sm font-semibold">
            ▶ חזור לרשימה
          </button>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-navy-900 text-lg">{selected.name}</h3>
              <p className="text-sm text-slate-400">{selected.phone}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold
              ${healthChecks[selected.id] ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {healthChecks[selected.id] ? '✅ מילא הצהרת בריאות להיום' : '⚠️ לא מילא הצהרת בריאות היום'}
            </span>
          </div>
          <SessionTable sessions={sessions} />
          <button onClick={() => setShowAddForm(v => !v)}
            className="mt-4 text-ice-600 hover:text-ice-800 text-sm font-semibold underline">
            {showAddForm ? 'סגור טופס' : '+ הוסף כניסת טבילה'}
          </button>
          {showAddForm && (
            <AddSessionForm targetId={selected.id} onAdded={() => selectClient(selected)} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [visitorRole, setVisitorRole] = useState('user');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [healthFilled, setHealthFilled] = useState(false);
  const [tab, setTab] = useState<'journal' | 'bookings' | 'clients'>('bookings');
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const id = localStorage.getItem('visitor_id');
    const name = localStorage.getItem('visitor_name') || '';
    const role = localStorage.getItem('visitor_role') || 'user';
    if (!id) { router.push('/'); return; }
    setVisitorId(id);
    setVisitorName(name);
    setVisitorRole(role);
    try {
      const profile = JSON.parse(localStorage.getItem('client_profile_v1') || '{}');
      setVisitorPhone(profile.phone || '');
    } catch { /* ignore */ }
    setVisitorEmail(localStorage.getItem('visitor_email') || '');

    Promise.all([
      fetch(`/api/immersion-sessions?visitor_id=${id}`, { headers: { 'x-visitor-id': id } }).then(r => r.json()),
      fetch(`/api/daily-health-check?visitor_id=${id}&date=${today}`).then(r => r.json()),
    ]).then(([sessions, hc]) => {
      setSessions(Array.isArray(sessions) ? sessions : []);
      setHealthFilled(hc.filled);
    });
  }, [router, today]);

  // Stats
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekMinutes = sessions
    .filter(s => new Date(s.session_date) >= weekAgo)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  const isStaff = ['instructor', 'admin'].includes(visitorRole);

  if (!visitorId) return null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      {/* Top bar */}
      <div className="bg-navy-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">שלום {visitorName}! 👋</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {isStaff ? (visitorRole === 'admin' ? '👑 מנהל מערכת' : '🏊 מדריך') : 'האזור האישי שלך'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Health check alert */}
              {!healthFilled && (
                <Link href="/health-check"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-xl animate-pulse transition-colors">
                  ⚠️ מלא הצהרת בריאות
                </Link>
              )}
              {healthFilled && (
                <span className="flex items-center gap-1.5 bg-green-600/30 text-green-300 text-sm font-semibold px-4 py-2 rounded-xl">
                  ✅ הצהרת בריאות מולאה
                </span>
              )}
              <Link href="/booking"
                className="bg-ice-500 hover:bg-ice-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                📅 הזמן טבילה
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-6 mt-5 flex-wrap">
            <div className="bg-navy-800 rounded-xl px-5 py-3 text-center">
              <p className="text-ice-400 text-xs mb-0.5">שבוע אחרון</p>
              <p className="text-white font-bold text-xl">{weekMinutes} <span className="text-sm font-normal">דק&apos;</span></p>
            </div>
            <div className="bg-navy-800 rounded-xl px-5 py-3 text-center">
              <p className="text-ice-400 text-xs mb-0.5">סה&quot;כ כל הזמן</p>
              <p className="text-white font-bold text-xl">{totalMinutes} <span className="text-sm font-normal">דק&apos;</span></p>
            </div>
            <div className="bg-navy-800 rounded-xl px-5 py-3 text-center">
              <p className="text-ice-400 text-xs mb-0.5">סה&quot;כ טבילות</p>
              <p className="text-white font-bold text-xl">{sessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'bookings', label: '📋 הזמנות' },
            { key: 'journal',  label: '📖 יומן טבילות' },
            ...(isStaff ? [{ key: 'clients', label: '👥 לקוחות' }] : []),
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'journal' | 'bookings' | 'clients')}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors
                ${tab === t.key ? 'bg-ice-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'clients' && isStaff ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <ClientsTab myId={visitorId} />
          </div>
        ) : tab === 'bookings' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">📋 הזמנות שלי</h2>
            <BookingsTab phone={visitorPhone} email={visitorEmail} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Journal */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy-900">📖 יומן הטבילות</h2>
                {isStaff && (
                  <button onClick={() => setShowAddForm(v => !v)}
                    className="text-sm text-ice-600 hover:text-ice-800 font-semibold underline">
                    {showAddForm ? 'סגור' : '+ הוסף כניסה'}
                  </button>
                )}
              </div>
              {showAddForm && isStaff && (
                <AddSessionForm targetId={visitorId} onAdded={() => {
                  fetch(`/api/immersion-sessions?visitor_id=${visitorId}`, { headers: { 'x-visitor-id': visitorId } })
                    .then(r => r.json()).then(d => setSessions(Array.isArray(d) ? d : []));
                  setShowAddForm(false);
                }} />
              )}
              <SessionTable sessions={sessions} />
            </div>

            {/* Upcoming bookings link */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-navy-900 mb-3">📅 הזמנות עתידיות</h2>
              <p className="text-slate-500 text-sm mb-4">להזמנת טבילה או סדנה הקלק/י על הכפתור:</p>
              <Link href="/booking"
                className="inline-flex items-center gap-2 bg-ice-600 hover:bg-ice-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                📅 הזמן טבילה / סדנה
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
