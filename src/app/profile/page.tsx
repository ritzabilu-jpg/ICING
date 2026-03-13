'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Session {
  id: string;
  session_date: string;
  session_time: string | null;
  instructor_name: string;
  temperature_celsius: number | null;
  duration_minutes: number;
  notes: string;
  created_at: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  sessions_total: number;
  sessions_used: number;
  valid_until: string | null;
}

type StatsRange = 'week' | 'month' | 'year';

function calcStats(sessions: Session[], range: StatsRange): { count: number; minutes: number } {
  const now = new Date();
  const cutoff = new Date(now);
  if (range === 'week') cutoff.setDate(now.getDate() - 7);
  else if (range === 'month') cutoff.setMonth(now.getMonth() - 1);
  else cutoff.setFullYear(now.getFullYear() - 1);

  const filtered = sessions.filter(s => new Date(s.session_date) >= cutoff);
  return {
    count: filtered.length,
    minutes: filtered.reduce((sum, s) => sum + s.duration_minutes, 0),
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [statsRange, setStatsRange] = useState<StatsRange>('month');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (u: User) => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const token = session?.access_token;
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch profile
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('full_name, role')
      .eq('id', u.id)
      .single();
    setProfile(profileData);

    // Fetch sessions
    const sessRes = await fetch(`/api/immersion-sessions?userId=${u.id}`, { headers });
    if (sessRes.ok) {
      const d = await sessRes.json() as { sessions: Session[] };
      setSessions(d.sessions);
    }

    // Fetch subscriptions
    const subRes = await fetch(`/api/subscriptions?userId=${u.id}`, { headers });
    if (subRes.ok) {
      const d = await subRes.json() as { subscriptions: Subscription[] };
      setSubscriptions(d.subscriptions);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) { router.push('/auth'); return; }
      setUser(u);
      load(u);
    });
  }, [load, router]);

  async function signOut() {
    await supabaseClient.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email || user?.phone || 'משתמש';
  const stats = calcStats(sessions, statsRange);

  // Active subscription
  const activeSub = subscriptions.find(s =>
    !s.valid_until || new Date(s.valid_until) >= new Date()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900">שלום, {displayName} 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">{user?.phone ?? user?.email ?? ''}</p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600
                     hover:border-slate-300 font-semibold text-sm transition-colors"
        >
          יציאה
        </button>
      </div>

      {/* Subscription card */}
      {activeSub ? (
        <div className="bg-navy-900 rounded-3xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm">מינוי פעיל</p>
            <p className="text-white text-xl font-black">{activeSub.plan_name}</p>
            {activeSub.valid_until && (
              <p className="text-slate-400 text-sm mt-1">
                בתוקף עד {new Date(activeSub.valid_until).toLocaleDateString('he-IL')}
              </p>
            )}
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-ice-400">
              {activeSub.sessions_total - activeSub.sessions_used}
            </div>
            <div className="text-slate-400 text-sm">טבילות נותרו</div>
            <div className="text-slate-500 text-xs mt-0.5">
              מתוך {activeSub.sessions_total} בחבילה
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-ice-50 border-2 border-ice-100 rounded-3xl p-5 mb-8 text-center">
          <p className="text-slate-500">אין מינוי פעיל · פנו אלינו לרכישת חבילה</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-lg font-black text-navy-900">סטטיסטיקת טבילות</h2>
          <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden text-sm font-semibold">
            {(['week', 'month', 'year'] as StatsRange[]).map(r => (
              <button
                key={r}
                onClick={() => setStatsRange(r)}
                className={`px-4 py-2 transition-colors
                  ${statsRange === r ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {r === 'week' ? 'שבוע' : r === 'month' ? 'חודש' : 'שנה'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-ice-50 rounded-2xl">
            <div className="text-3xl font-black text-ice-600">{stats.count}</div>
            <div className="text-slate-500 text-sm mt-1">טבילות</div>
          </div>
          <div className="text-center p-4 bg-ice-50 rounded-2xl">
            <div className="text-3xl font-black text-ice-600">{stats.minutes}</div>
            <div className="text-slate-500 text-sm mt-1">דקות כולל</div>
          </div>
        </div>
      </div>

      {/* Journal table */}
      <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-ice-50">
          <h2 className="text-lg font-black text-navy-900">יומן טבילות</h2>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">🧊</div>
            <p>אין טבילות רשומות עדיין</p>
            <p className="text-xs mt-1">המדריך יוסיף את הנתונים לאחר כל סדנה</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">תאריך</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">שעה</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">מדריך</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">טמפרטורה</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">דקות</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-navy-900">
                      {new Date(s.session_date).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.session_time?.slice(0, 5) ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{s.instructor_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.temperature_celsius != null ? `${s.temperature_celsius}°C` : '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-ice-600">{s.duration_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
