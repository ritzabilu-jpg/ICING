'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HEALTH_QUESTIONS,
  STATUS_LABELS,
  STATUS_COLORS,
  ConsentFormStatus,
} from '@/lib/health-consent-config';

// ── Types ─────────────────────────────────────────────────────────────────────
interface HealthAnswer {
  id: string; num: number; text: string;
  answer: string; detail: string; is_blocking: boolean;
}

interface ConsentForm {
  id: string;
  created_at: string;
  full_name: string;
  birth_date: string;
  phone: string;
  email: string;
  id_number: string | null;
  was_blocked: boolean;
  blocking_reasons: string[];
  status: ConsentFormStatus;
  health_answers: HealthAnswer[];
  signature_name: string;
  signature_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  coach_name: string | null;
  session_date: string | null;
  branch: string | null;
  admin_notes: string | null;
}

type SortField = 'date' | 'name';

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function DetailModal({ form, onClose, onStatusChange, adminKey }: {
  form: ConsentForm;
  onClose: () => void;
  onStatusChange: (id: string, status: ConsentFormStatus, notes: string) => void;
  adminKey: string;
}) {
  const [notes, setNotes] = useState(form.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const save = async (status: ConsentFormStatus) => {
    setSaving(true);
    await fetch(`/api/health-consent?key=${encodeURIComponent(adminKey)}&id=${form.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    onStatusChange(form.id, status, notes);
    setSaving(false);
  };

  const yesAnswers = (form.health_answers || []).filter(a => a.answer === 'yes');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-black text-slate-900 text-lg">{form.full_name}</h2>
            <p className="text-sm text-slate-500">{formatDate(form.created_at)} · {form.phone}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Personal */}
          <section>
            <h3 className="font-bold text-slate-700 text-sm mb-2">פרטים אישיים</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['שם', form.full_name],
                ['ת.ז.', form.id_number || '—'],
                ['תאריך לידה', formatDate(form.birth_date)],
                ['טלפון', form.phone],
                ['דוא"ל', form.email],
                ['איש קשר חירום', `${form.emergency_contact_name} ${form.emergency_contact_phone}`],
                ['מדריך', form.coach_name || '—'],
                ['תאריך סשן', form.session_date ? formatDate(form.session_date) : '—'],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2">
                  <span className="text-slate-500 block text-xs">{k}</span>
                  <span className="font-medium text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Yes answers */}
          {yesAnswers.length > 0 && (
            <section>
              <h3 className="font-bold text-slate-700 text-sm mb-2">
                תשובות "כן" ({yesAnswers.length})
              </h3>
              <div className="space-y-2">
                {yesAnswers.map(a => (
                  <div key={a.id} className={`rounded-lg p-3 text-sm ${a.is_blocking ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <p className="font-semibold text-slate-800">{a.num}. {a.text}</p>
                    {a.detail && <p className="text-slate-600 mt-1 text-xs">פרוט: {a.detail}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admin notes */}
          <section>
            <h3 className="font-bold text-slate-700 text-sm mb-2">הערות מנהל</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="הוסף הערה..."
            />
          </section>

          {/* Status buttons */}
          <section className="flex flex-wrap gap-2">
            {(['approved', 'requires_review', 'rejected', 'pending'] as ConsentFormStatus[]).map(s => (
              <button
                key={s}
                disabled={saving}
                onClick={() => save(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                  form.status === s
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Main admin component ──────────────────────────────────────────────────────
function HealthConsentAdmin() {
  const searchParams = useSearchParams();
  const adminKey = searchParams.get('key') ?? '';

  const [forms, setForms] = useState<ConsentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [filterStatus, setFilterStatus] = useState<ConsentFormStatus | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/health-consent?key=${encodeURIComponent(adminKey)}`, {
        cache: 'no-store',
      });
      if (res.status === 401) { setError('גישה אסורה — יש להזין מפתח תקין'); return; }
      const data = await res.json() as { forms?: ConsentForm[]; error?: string };
      if (data.error) { setError(data.error); return; }
      setForms(data.forms ?? []);
    } catch {
      setError('שגיאת רשת');
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: string, status: ConsentFormStatus, notes: string) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, status, admin_notes: notes } : f));
    if (selectedForm?.id === id) setSelectedForm(f => f ? { ...f, status, admin_notes: notes } : f);
  };

  // Filter + sort
  const sorted = [...forms]
    .filter(f => filterStatus === 'all' || f.status === filterStatus)
    .sort((a, b) =>
      sortField === 'date'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : a.full_name.localeCompare(b.full_name, 'he')
    );

  if (!adminKey) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm">
          <p className="font-bold text-red-700">יש להעביר מפתח גישה ב-URL</p>
          <p className="text-red-600 text-sm mt-1">דוגמה: /admin/health-consent?key=lior2026</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      {selectedForm && (
        <DetailModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
          onStatusChange={handleStatusChange}
          adminKey={adminKey}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900">שאלוני בריאות והסכמה מדעת</h1>
            <p className="text-sm text-slate-500">{sorted.length} רשומות</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by status */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as ConsentFormStatus | 'all')}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="all">כל הסטטוסים</option>
              {(Object.entries(STATUS_LABELS) as [ConsentFormStatus, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>

            {/* Sort toggle */}
            <button
              onClick={() => setSortField(s => s === 'date' ? 'name' : 'date')}
              className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-teal-400 transition-colors font-medium text-slate-700"
            >
              <span>⇅</span>
              {sortField === 'date' ? 'מיין לפי שם' : 'מיין לפי תאריך'}
            </button>

            <button
              onClick={load}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-slate-50 transition-colors text-slate-700"
            >
              רענן
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-8 py-4">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-16 text-slate-400">אין רשומות</div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['תאריך הגשה', 'שם מלא', 'טלפון', 'חסום?', 'כן (שאלות)', 'סטטוס', 'פעולה'].map(h => (
                      <th key={h} className="text-right text-xs font-bold text-slate-500 uppercase px-4 py-3 tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sorted.map(f => {
                    const yesCount = (f.health_answers || []).filter(a => a.answer === 'yes').length;
                    return (
                      <tr
                        key={f.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedForm(f)}
                      >
                        <td className="px-4 py-3 font-mono text-slate-600 text-xs">{formatDate(f.created_at)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{f.full_name}</td>
                        <td className="px-4 py-3 text-slate-600 dir-ltr">{f.phone}</td>
                        <td className="px-4 py-3">
                          {f.was_blocked
                            ? <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">חסום</span>
                            : <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">פנוי</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          {yesCount > 0
                            ? <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{yesCount} כן</span>
                            : <span className="text-slate-400 text-xs">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[f.status] || 'bg-slate-100 text-slate-600'}`}>
                            {STATUS_LABELS[f.status] || f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-teal-600 hover:text-teal-800 text-xs font-bold underline"
                            onClick={e => { e.stopPropagation(); setSelectedForm(f); }}
                          >
                            פתח
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {sorted.map(f => {
                const yesCount = (f.health_answers || []).filter(a => a.answer === 'yes').length;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedForm(f)}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 cursor-pointer active:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{f.full_name}</p>
                        <p className="text-xs text-slate-500">{f.phone} · {formatDate(f.created_at)}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[f.status] || 'bg-slate-100 text-slate-600'}`}>
                        {STATUS_LABELS[f.status] || f.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {f.was_blocked && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">חסום</span>}
                      {yesCount > 0 && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{yesCount} כן</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HealthConsentAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HealthConsentAdmin />
    </Suspense>
  );
}
