'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Slot {
  id: string;
  slot_date: string;
  slot_time: string;
  max_participants: number;
  location: string;
  notes: string;
}

interface Participant {
  id: string;
  visitor_name: string;
  visitor_phone: string;
  package_type: string;
  daily_check_completed: boolean;
  yearly_declaration_completed: boolean;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function Check({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
        checked
          ? 'bg-green-100 border-green-400 text-green-600'
          : 'bg-red-50 border-red-300 text-transparent'
      }`}
    >
      {checked ? '✓' : ''}
    </button>
  );
}

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [visitorId, setVisitorId] = useState('');
  const [slot, setSlot] = useState<Slot | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const vid = localStorage.getItem('visitor_id') || '';
    const role = localStorage.getItem('visitor_role') || '';
    if (!vid || !['instructor', 'admin'].includes(role)) {
      router.push('/instructor/login');
      return;
    }
    setVisitorId(vid);
  }, [router]);

  useEffect(() => {
    if (!visitorId || !id) return;
    setLoading(true);
    fetch(`/api/instructor/session/${id}`, { headers: { 'x-visitor-id': visitorId } })
      .then(r => r.json())
      .then(d => {
        setSlot(d.slot);
        setParticipants(d.participants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [visitorId, id]);

  async function toggleCheck(bookingId: string, field: 'daily_check_completed' | 'yearly_declaration_completed', current: boolean) {
    setUpdating(bookingId + field);
    const res = await fetch(`/api/instructor/session/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({ booking_id: bookingId, field, value: !current }),
    });
    if (res.ok) {
      setParticipants(prev =>
        prev.map(p => p.id === bookingId ? { ...p, [field]: !current } : p)
      );
    }
    setUpdating(null);
  }

  if (loading) return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <p className="text-slate-400">טוען...</p>
    </main>
  );

  if (!slot) return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <p className="text-slate-400">סדנה לא נמצאה</p>
    </main>
  );

  const today = new Date().toISOString().split('T')[0];
  const isPast = slot.slot_date < today;
  const dailyDone = participants.filter(p => p.daily_check_completed).length;
  const yearlyDone = participants.filter(p => p.yearly_declaration_completed).length;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-[#0f2942] text-white py-5 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/instructor/dashboard" className="text-[#7dd8f8] text-sm mb-3 inline-block">← חזרה לדשבורד</Link>
          <h1 className="text-xl font-bold">{formatDate(slot.slot_date)}</h1>
          <p className="text-slate-300 text-sm mt-1">
            🕐 {slot.slot_time?.slice(0, 5)}
            {slot.location && <> · 📍 {slot.location}</>}
            {isPast && <span className="mr-2 text-xs bg-slate-700 px-2 py-0.5 rounded-full">עבר</span>}
          </p>
          {slot.notes && <p className="text-slate-400 text-xs mt-1">{slot.notes}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-green-100 border-2 border-green-400 inline-block" /> מלא
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-red-50 border-2 border-red-300 inline-block" /> ריק
          </span>
        </div>

        {/* Participants table */}
        {participants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
            אין רשומים לסדנה זו
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">#</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                  <th className="text-center px-3 py-3 font-semibold text-slate-600">הצהרה שנתית</th>
                  <th className="text-center px-3 py-3 font-semibold text-slate-600">הצהרה יומית</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{p.visitor_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono">{p.visitor_phone}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center" style={{ opacity: updating === p.id + 'yearly_declaration_completed' ? 0.5 : 1 }}>
                        <Check
                          checked={p.yearly_declaration_completed}
                          label="הצהרה שנתית"
                          onClick={() => toggleCheck(p.id, 'yearly_declaration_completed', p.yearly_declaration_completed)}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center" style={{ opacity: updating === p.id + 'daily_check_completed' ? 0.5 : 1 }}>
                        <Check
                          checked={p.daily_check_completed}
                          label="הצהרה יומית"
                          onClick={() => toggleCheck(p.id, 'daily_check_completed', p.daily_check_completed)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary footer */}
            <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 flex flex-wrap gap-4 text-sm">
              <span className="font-semibold text-[#0f2942]">סה״כ: {participants.length} משתתפים</span>
              <span className="text-green-600">הצהרה שנתית: {yearlyDone}/{participants.length}</span>
              <span className="text-green-600">הצהרה יומית: {dailyDone}/{participants.length}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
