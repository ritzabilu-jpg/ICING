'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface CustomerProfile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

interface ImmersionSession {
  id: string;
  session_date: string;
  session_time: string | null;
  instructor_name: string;
  temperature_celsius: number | null;
  duration_minutes: number;
  notes: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  sessions_total: number;
  sessions_used: number;
  valid_until: string | null;
}

function AdminCustomersContent() {
  const searchParams = useSearchParams();
  const adminKey = searchParams.get('key') ?? '';

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState('');

  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [sessions, setSessions] = useState<ImmersionSession[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Add session form
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionTime: '',
    instructorName: '',
    temperatureCelsius: '',
    durationMinutes: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Add subscription form
  const [showSubForm, setShowSubForm] = useState(false);
  const [subForm, setSubForm] = useState({ planName: 'חבילת 10 טבילות', sessionsTotal: '10', validUntil: '' });
  const [savingSub, setSavingSub] = useState(false);

  // Verify admin via Supabase auth + admin key
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setAuthError('יש להתחבר תחילה'); setLoadingCustomers(false); return; }
      setAuthToken(session.access_token);
      setAuthUser(session.user);
    });
  }, []);

  const loadCustomers = useCallback(async (token: string) => {
    // Fetch all profiles via admin endpoint (requires admin key)
    const res = await fetch(`/api/admin/customers?key=${encodeURIComponent(adminKey)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setAuthError(res.status === 401 ? 'קוד גישה שגוי' : 'שגיאה'); setLoadingCustomers(false); return; }
    const d = await res.json() as { customers: CustomerProfile[] };
    setCustomers(d.customers ?? []);
    setLoadingCustomers(false);
  }, [adminKey]);

  useEffect(() => {
    if (authToken) loadCustomers(authToken);
  }, [authToken, loadCustomers]);

  const loadCustomerData = useCallback(async (customerId: string) => {
    if (!authToken) return;
    setLoadingSessions(true);
    setSessions([]);
    setSubscriptions([]);

    const headers = { Authorization: `Bearer ${authToken}` };
    const [sessRes, subRes] = await Promise.all([
      fetch(`/api/immersion-sessions?userId=${customerId}`, { headers }),
      fetch(`/api/subscriptions?userId=${customerId}`, { headers }),
    ]);

    if (sessRes.ok) {
      const d = await sessRes.json() as { sessions: ImmersionSession[] };
      setSessions(d.sessions);
    }
    if (subRes.ok) {
      const d = await subRes.json() as { subscriptions: Subscription[] };
      setSubscriptions(d.subscriptions);
    }
    setLoadingSessions(false);
  }, [authToken]);

  useEffect(() => {
    if (selectedCustomer) loadCustomerData(selectedCustomer.id);
  }, [selectedCustomer, loadCustomerData]);

  async function addSession() {
    if (!selectedCustomer || !authToken) return;
    setSaving(true);
    setSaveError('');
    const res = await fetch('/api/immersion-sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedCustomer.id,
        sessionDate: form.sessionDate,
        sessionTime: form.sessionTime || undefined,
        instructorName: form.instructorName,
        temperatureCelsius: form.temperatureCelsius ? parseFloat(form.temperatureCelsius) : undefined,
        durationMinutes: parseInt(form.durationMinutes) || 0,
        notes: form.notes,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowAddForm(false);
      setForm({ sessionDate: new Date().toISOString().slice(0, 10), sessionTime: '', instructorName: authUser?.user_metadata?.full_name ?? '', temperatureCelsius: '', durationMinutes: '', notes: '' });
      loadCustomerData(selectedCustomer.id);
    } else {
      const d = await res.json() as { error?: string };
      setSaveError(d.error ?? 'שגיאה');
    }
  }

  async function addSubscription() {
    if (!selectedCustomer || !authToken) return;
    setSavingSub(true);
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedCustomer.id,
        planName: subForm.planName,
        sessionsTotal: parseInt(subForm.sessionsTotal) || 10,
        validUntil: subForm.validUntil || undefined,
      }),
    });
    setSavingSub(false);
    if (res.ok) { setShowSubForm(false); loadCustomerData(selectedCustomer.id); }
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold text-red-600">{authError}</p>
        </div>
      </div>
    );
  }

  if (loadingCustomers) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-black text-navy-900">לקוחות</h1>
        <span className="text-slate-400 text-sm">{customers.length} משתמשים רשומים</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer list */}
        <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-ice-50">
            <h2 className="font-black text-navy-900">רשימת לקוחות</h2>
          </div>
          <div className="divide-y divide-slate-50 max-h-[70vh] overflow-y-auto">
            {customers.length === 0 && (
              <p className="text-center text-slate-400 py-8 text-sm">אין לקוחות עדיין</p>
            )}
            {customers.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCustomer(c); setShowAddForm(false); setShowSubForm(false); }}
                className={`w-full text-right px-5 py-4 hover:bg-slate-50 transition-colors
                  ${selectedCustomer?.id === c.id ? 'bg-ice-50 border-r-4 border-ice-500' : ''}`}
              >
                <div className="font-semibold text-navy-900">{c.full_name || 'ללא שם'}</div>
                <div className="text-slate-400 text-xs mt-0.5">{c.phone}</div>
                <div className="text-slate-400 text-xs">{c.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Customer detail */}
        <div className="lg:col-span-2">
          {!selectedCustomer ? (
            <div className="flex items-center justify-center h-64 text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              בחרו לקוח מהרשימה
            </div>
          ) : (
            <div className="space-y-5">
              {/* Header */}
              <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-black text-navy-900">{selectedCustomer.full_name || 'ללא שם'}</h3>
                  <p className="text-slate-500 text-sm">{selectedCustomer.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowSubForm(!showSubForm); setShowAddForm(false); }}
                    className="px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-700 transition-colors"
                  >
                    + מינוי
                  </button>
                  <button
                    onClick={() => { setShowAddForm(!showAddForm); setShowSubForm(false); }}
                    className="px-4 py-2 rounded-xl bg-ice-500 text-white text-sm font-semibold hover:bg-ice-400 transition-colors"
                  >
                    + טבילה
                  </button>
                </div>
              </div>

              {/* Add subscription form */}
              {showSubForm && (
                <div className="bg-white rounded-3xl border-2 border-navy-200 shadow-sm p-5 space-y-3">
                  <h4 className="font-black text-navy-900">הוספת מינוי</h4>
                  <input value={subForm.planName} onChange={e => setSubForm(p => ({ ...p, planName: e.target.value }))}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" placeholder="שם החבילה" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">מספר טבילות</label>
                      <input type="number" value={subForm.sessionsTotal} onChange={e => setSubForm(p => ({ ...p, sessionsTotal: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">תוקף עד (אופציונלי)</label>
                      <input type="date" value={subForm.validUntil} onChange={e => setSubForm(p => ({ ...p, validUntil: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" />
                    </div>
                  </div>
                  <button onClick={addSubscription} disabled={savingSub}
                    className="btn-primary text-sm disabled:opacity-50">
                    {savingSub ? 'שומר...' : 'שמור מינוי'}
                  </button>
                </div>
              )}

              {/* Add session form */}
              {showAddForm && (
                <div className="bg-white rounded-3xl border-2 border-ice-200 shadow-sm p-5 space-y-3">
                  <h4 className="font-black text-navy-900">הוספת טבילה</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">תאריך</label>
                      <input type="date" value={form.sessionDate} onChange={e => setForm(p => ({ ...p, sessionDate: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">שעה</label>
                      <input type="time" value={form.sessionTime} onChange={e => setForm(p => ({ ...p, sessionTime: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">מדריך</label>
                      <input value={form.instructorName} onChange={e => setForm(p => ({ ...p, instructorName: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" placeholder="שם המדריך" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">טמפרטורה (°C)</label>
                      <input type="number" step="0.1" value={form.temperatureCelsius} onChange={e => setForm(p => ({ ...p, temperatureCelsius: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" placeholder="לדוגמה 8.5" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">דקות טבילה</label>
                      <input type="number" value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" placeholder="3" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">הערות</label>
                      <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-ice-400 focus:outline-none text-sm" placeholder="הערה חופשית" />
                    </div>
                  </div>
                  {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                  <button onClick={addSession} disabled={saving || !form.sessionDate || !form.durationMinutes}
                    className="btn-primary text-sm disabled:opacity-50">
                    {saving ? 'שומר...' : 'שמור טבילה'}
                  </button>
                </div>
              )}

              {/* Subscriptions */}
              {subscriptions.length > 0 && (
                <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-5">
                  <h4 className="font-black text-navy-900 mb-3">מינויים</h4>
                  <div className="space-y-2">
                    {subscriptions.map(s => {
                      const remaining = s.sessions_total - s.sessions_used;
                      const active = !s.valid_until || new Date(s.valid_until) >= new Date();
                      return (
                        <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl
                          ${active ? 'bg-ice-50 border border-ice-200' : 'bg-slate-50 border border-slate-200 opacity-60'}`}>
                          <div>
                            <span className="font-semibold text-navy-900 text-sm">{s.plan_name}</span>
                            {s.valid_until && <span className="text-slate-400 text-xs mr-2">עד {new Date(s.valid_until).toLocaleDateString('he-IL')}</span>}
                          </div>
                          <div className="text-sm">
                            <span className="font-bold text-ice-600">{remaining}</span>
                            <span className="text-slate-400">/{s.sessions_total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sessions table */}
              <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-ice-50 flex items-center justify-between">
                  <h4 className="font-black text-navy-900">יומן טבילות</h4>
                  <span className="text-slate-400 text-sm">{sessions.length} כניסות</span>
                </div>
                {loadingSessions ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8 text-sm">אין טבילות רשומות</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-right px-5 py-3 font-semibold text-slate-600">תאריך</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">מדריך</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">°C</th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600">דקות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map(s => (
                          <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-semibold text-navy-900">
                              {new Date(s.session_date).toLocaleDateString('he-IL')}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{s.session_time?.slice(0, 5) ?? '—'}</td>
                            <td className="px-4 py-3 text-slate-600">{s.instructor_name || '—'}</td>
                            <td className="px-4 py-3 text-slate-600">{s.temperature_celsius ?? '—'}</td>
                            <td className="px-4 py-3 font-bold text-ice-600">{s.duration_minutes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminCustomersContent />
    </Suspense>
  );
}
