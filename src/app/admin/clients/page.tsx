'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ClientEntry } from '@/app/api/admin/clients/route';

const HEALTH_KEY = 'admin_health_checks_v1';
function loadHC(): Record<string, { daily: boolean; general: boolean }> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(HEALTH_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveHC(data: Record<string, { daily: boolean; general: boolean }>) {
  localStorage.setItem(HEALTH_KEY, JSON.stringify(data));
}

function ClientsContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') ?? '';

  const [clients, setClients]   = useState<ClientEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<string>('all');
  const [hc, setHC]             = useState<Record<string, { daily: boolean; general: boolean }>>({});

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/clients?key=${encodeURIComponent(key)}`);
      const data = await res.json() as { clients?: ClientEntry[]; error?: string };
      if (!res.ok) setError(res.status === 401 ? 'קוד גישה שגוי' : (data.error ?? 'שגיאה'));
      else setClients(data.clients ?? []);
    } catch { setError('שגיאת רשת'); }
    finally { setLoading(false); }
  }, [key]);

  useEffect(() => { load(); setHC(loadHC()); }, [load]);

  function toggle(clientId: string, field: 'daily' | 'general') {
    const updated = { ...hc, [clientId]: { ...(hc[clientId] ?? { daily: false, general: false }), [field]: !hc[clientId]?.[field] } };
    setHC(updated); saveHC(updated);
  }

  function exportCSV() {
    const rows = [['שם', 'טלפון', 'אימייל', 'עיר', 'סוג', 'תאריך', 'שעה', 'בריאות יומית', 'הצהרה כללית']];
    for (const c of filtered) {
      const h = hc[c.id] ?? { daily: false, general: false };
      rows.push([c.name, c.phone, c.email??'', c.city??'', c.type, c.date, c.time, h.daily?'✓':'', h.general?'✓':'']);
    }
    const csv = rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'לקוחות.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const types = ['all', ...Array.from(new Set(clients.map(c => c.type)))];

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.name.includes(search) || c.phone.includes(search) || (c.email??'').includes(search);
    const matchType = filter === 'all' || c.type === filter;
    return matchSearch && matchType;
  });

  if (!loading && error === 'קוד גישה שגוי') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-xl font-bold text-red-600">{error}</p>
          <p className="text-slate-500 mt-2 text-sm">הוסיפו ?key=הקוד לכתובת הדף</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900">👥 רשימת לקוחות</h1>
          <p className="text-slate-500 text-sm mt-1">כל הלקוחות מכל מקורות ההזמנות</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={load}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 font-semibold text-sm">
            ↻ רענן
          </button>
          <button onClick={exportCSV} disabled={filtered.length === 0}
            className="px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold text-sm hover:bg-navy-700 disabled:opacity-40">
            ⬇ ייצוא CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 חיפוש שם / טלפון / מייל"
          className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ice-400 w-56"
        />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ice-400">
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'כל הסוגים' : t}</option>)}
        </select>
        {(search || filter !== 'all') && (
          <span className="text-xs text-slate-500">{filtered.length} תוצאות</span>
        )}
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'סה"כ לקוחות',          value: clients.length,                          color: 'text-navy-900' },
            { label: 'בריאות יומית אושרה',   value: clients.filter(c=>hc[c.id]?.daily).length,   color: 'text-ice-600' },
            { label: 'הצהרה כללית אושרה',    value: clients.filter(c=>hc[c.id]?.general).length, color: 'text-green-600' },
            { label: 'ממתינים לאישור',        value: clients.filter(c=>!hc[c.id]?.general).length, color: 'text-orange-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 text-right">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-2">👥</div>
          <p>{search || filter !== 'all' ? 'לא נמצאו לקוחות' : 'אין לקוחות עדיין'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm" dir="rtl">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-right px-4 py-3 font-semibold text-slate-600 w-8">#</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">שם</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">טלפון</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">אימייל</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">סוג</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">תאריך · שעה</th>
                <th className="text-center px-3 py-3 font-semibold text-slate-600" title="בריאות יומית">🧊 יומית</th>
                <th className="text-center px-3 py-3 font-semibold text-slate-600" title="הצהרה כללית">📋 כללית</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const h = hc[c.id] ?? { daily: false, general: false };
                return (
                  <tr key={c.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${!h.general ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-4 py-3 text-slate-400 font-mono text-right">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-navy-900 text-right">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-right text-xs">
                      <a href={`tel:${c.phone}`} className="hover:text-ice-600">{c.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs text-right">
                      {c.email ? <a href={`mailto:${c.email}`} className="hover:text-ice-600">{c.email}</a> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full font-semibold">{c.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-right text-xs whitespace-nowrap">
                      {c.date}{c.time ? ` · ${c.time}` : ''}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input type="checkbox" checked={h.daily}
                        onChange={() => toggle(c.id, 'daily')}
                        className="w-4 h-4 accent-ice-500 cursor-pointer" title="בריאות יומית" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input type="checkbox" checked={h.general}
                        onChange={() => toggle(c.id, 'general')}
                        className="w-4 h-4 accent-green-500 cursor-pointer" title="הצהרה כללית (שנתית)" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-right">
            💡 צ&apos;ק-בוקסים נשמרים בדפדפן זה בלבד. שורות כתומות = הצהרה כללית טרם אושרה.
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminClientsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ClientsContent />
    </Suspense>
  );
}
