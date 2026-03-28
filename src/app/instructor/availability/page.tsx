'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AvailabilityTable, { AvailabilitySlot } from '@/components/AvailabilityTable';

interface BlockedDate {
  id: string;
  from_date: string;
  to_date: string;
  reason: string;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function InstructorAvailabilityPage() {
  const router = useRouter();
  const [visitorId, setVisitorId] = useState('');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Date range picker state
  const [calendarRange, setCalendarRange] = useState<[Date | null, Date | null]>([null, null]);
  const [showCal, setShowCal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [addingBlock, setAddingBlock] = useState(false);
  // Edit blocked date state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFrom, setEditFrom] = useState('');
  const [editTo, setEditTo] = useState('');
  const [editReason, setEditReason] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const vid = localStorage.getItem('visitor_id') ?? '';
    const role = localStorage.getItem('visitor_role') ?? '';
    if (!vid || !['instructor', 'admin'].includes(role)) { router.push('/instructor/login'); return; }
    setVisitorId(vid);
  }, [router]);

  useEffect(() => {
    if (!visitorId) return;
    fetch('/api/instructor/availability', { headers: { 'x-visitor-id': visitorId } })
      .then(r => r.json())
      .then(d => {
        setSlots(d.slots ?? []);
        setBlocked(d.blocked ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [visitorId]);

  async function save() {
    setSaving(true); setSaveMsg('');
    const res = await fetch('/api/instructor/availability', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({ slots }),
    });
    const d = await res.json();
    setSaveMsg(res.ok ? `✅ נשמר (${d.saved} שורות) — instructor_id: ${d.instructor_id?.slice(0,8) ?? '?'}…` : `❌ ${d.error}`);
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 8000);
  }

  async function clearAll() {
    if (!confirm('למחוק את כל שעות הזמינות שלך?')) return;
    const res = await fetch('/api/instructor/availability', {
      method: 'DELETE', headers: { 'x-visitor-id': visitorId },
    });
    if (res.ok) { setSlots([]); setSaveMsg('✅ כל הזמינות נמחקה'); setTimeout(() => setSaveMsg(''), 4000); }
  }

  async function clearDay(day: number) {
    if (!confirm(`למחוק את כל השעות של ${['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','מוצ"ש'][day]}?`)) return;
    const res = await fetch(`/api/instructor/availability?day=${day}`, {
      method: 'DELETE', headers: { 'x-visitor-id': visitorId },
    });
    if (res.ok) { setSlots(prev => prev.filter(s => s.day_of_week !== day)); }
  }

  async function addBlocked() {
    if (!calendarRange[0]) return;
    setAddingBlock(true);
    const from = calendarRange[0].toISOString().split('T')[0];
    const to = (calendarRange[1] ?? calendarRange[0]).toISOString().split('T')[0];
    const res = await fetch('/api/instructor/availability/blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({ from_date: from, to_date: to, reason: blockReason }),
    });
    if (res.ok) {
      const d = await res.json();
      setBlocked(prev => [...prev, d].sort((a, b) => a.from_date.localeCompare(b.from_date)));
      setCalendarRange([null, null]);
      setBlockReason('');
      setShowCal(false);
    }
    setAddingBlock(false);
  }

  async function removeBlocked(id: string) {
    const res = await fetch(`/api/instructor/availability/blocked?id=${id}`, {
      method: 'DELETE', headers: { 'x-visitor-id': visitorId },
    });
    if (res.ok) setBlocked(prev => prev.filter(b => b.id !== id));
  }

  function startEdit(b: BlockedDate) {
    setEditingId(b.id);
    setEditFrom(b.from_date);
    setEditTo(b.to_date);
    setEditReason(b.reason);
  }

  async function saveEdit(id: string) {
    if (!editFrom || !editTo) return;
    setSavingEdit(true);
    const res = await fetch('/api/instructor/availability/blocked', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({ id, from_date: editFrom, to_date: editTo, reason: editReason }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBlocked(prev => prev.map(b => b.id === id ? updated : b).sort((a, b) => a.from_date.localeCompare(b.from_date)));
      setEditingId(null);
    }
    setSavingEdit(false);
  }

  if (loading) return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <p className="text-slate-400">טוען...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="bg-[#0f2942] text-white py-5 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">שעות זמינות שבועיות</h1>
          <p className="text-slate-400 text-sm mt-0.5">הגדר את שעות הזמינות שלך לסדנאות ולטבילות</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* Workshop availability */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0f2942] mb-4">סדנאות — שעות פוטנציאליות</h2>
          <AvailabilityTable
            type="workshop"
            title=""
            data={slots}
            onChange={setSlots}
          />
        </div>

        {/* Immersion availability */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0f2942] mb-4">הטבלות — שעות פוטנציאליות</h2>
          <AvailabilityTable
            type="immersion"
            title=""
            data={slots}
            onChange={setSlots}
          />
        </div>

        {/* Save + Clear buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={save} disabled={saving}
            className="bg-[#0f2942] hover:bg-[#1a3a5c] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            {saving ? 'שומר...' : 'שמור שעות זמינות'}
          </button>
          <button onClick={clearAll}
            className="border-2 border-red-300 text-red-500 hover:bg-red-50 font-semibold px-5 py-3 rounded-xl text-sm transition-colors">
            נקה הכל
          </button>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-semibold">נקה יום:</span>
            {['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'].map((d, i) => (
              <button key={i} onClick={() => clearDay(i)}
                className="text-xs border border-slate-300 text-slate-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500 px-2 py-1 rounded-lg transition-colors">
                {d}
              </button>
            ))}
          </div>
          {saveMsg && <span className={`text-sm font-semibold ${saveMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</span>}
        </div>

        {/* Blocked dates */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0f2942] mb-1">תאריכים שבהם לא אהיה (חופש או סיבה אחרת)</h2>
          <p className="text-slate-400 text-xs mb-4">בחר.י תאריכים בהם תעדר.י</p>

          {/* Existing blocked ranges */}
          {blocked.length > 0 && (
            <div className="mb-4 space-y-2">
              {blocked.map(b => (
                <div key={b.id} className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                  {editingId === b.id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap items-center">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                          <span>מ:</span>
                          <input type="date" value={editFrom} onChange={e => setEditFrom(e.target.value)}
                            className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-400" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                          <span>עד:</span>
                          <input type="date" value={editTo} onChange={e => setEditTo(e.target.value)}
                            className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-400" />
                        </div>
                        <input value={editReason} onChange={e => setEditReason(e.target.value)}
                          placeholder="סיבה (אופציונלי)"
                          className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-400 flex-1 min-w-[120px]" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(b.id)} disabled={savingEdit}
                          className="text-xs bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-3 py-1 rounded-lg transition-colors">
                          {savingEdit ? '...' : 'שמור'}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-2 py-1">ביטול</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-sm font-semibold text-orange-800">
                          {b.from_date === b.to_date ? fmtDate(b.from_date) : `${fmtDate(b.from_date)} — ${fmtDate(b.to_date)}`}
                        </span>
                        {b.reason && <span className="text-xs text-orange-600 mr-2">({b.reason})</span>}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => startEdit(b)}
                          className="text-xs text-[#0f2942] hover:text-[#1a3a5c] font-semibold">עריכה</button>
                        <button onClick={() => removeBlocked(b.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-semibold">מחק</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new blocked range */}
          <button onClick={() => setShowCal(s => !s)}
            className="text-sm font-semibold text-[#0f2942] border-2 border-[#0f2942] px-4 py-2 rounded-xl hover:bg-[#0f2942] hover:text-white transition-colors mb-4">
            {showCal ? 'סגור לוח שנה' : '+ הוסף תאריכים חסומים'}
          </button>

          {showCal && (
            <div className="space-y-3">
              <div className="flex justify-center" dir="ltr">
                <Calendar
                  selectRange
                  value={calendarRange}
                  onChange={(val) => setCalendarRange(val as [Date, Date])}
                  locale="he-IL"
                  className="rounded-2xl border-slate-200 shadow-sm"
                />
              </div>
              {calendarRange[0] && (
                <div className="flex gap-3 items-center flex-wrap">
                  <span className="text-sm font-semibold text-slate-700">
                    {calendarRange[1] && calendarRange[1].toDateString() !== calendarRange[0].toDateString()
                      ? `${fmtDate(calendarRange[0].toISOString().split('T')[0])} — ${fmtDate(calendarRange[1].toISOString().split('T')[0])}`
                      : fmtDate(calendarRange[0].toISOString().split('T')[0])}
                  </span>
                  <input value={blockReason} onChange={e => setBlockReason(e.target.value)}
                    placeholder="סיבה (אופציונלי)"
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#7dd8f8]" />
                  <button onClick={addBlocked} disabled={addingBlock}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-xl text-sm transition-colors">
                    {addingBlock ? '...' : 'הוסף'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center pb-10">
          <Link href="/instructor/dashboard" className="inline-flex items-center gap-2 bg-[#0f2942] hover:bg-[#1a3a5c] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
            ← חזרה לדשבורד
          </Link>
        </div>
      </div>
    </main>
  );
}
