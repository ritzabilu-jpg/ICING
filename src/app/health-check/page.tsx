'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HealthCheckPage() {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [feelsHealthy, setFeelsHealthy] = useState(false);
  const [noFever, setNoFever] = useState(false);
  const [feelingGood, setFeelingGood] = useState(false);
  const [alreadyFilled, setAlreadyFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('visitor_id');
    const name = localStorage.getItem('visitor_name') || '';
    if (!id) { router.push('/'); return; }
    setVisitorId(id);
    setVisitorName(name);

    // Check if already filled today
    fetch(`/api/daily-health-check?visitor_id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.filled) setAlreadyFilled(true); });
  }, [router]);

  async function handleSubmit() {
    if (!feelsHealthy || !noFever || !feelingGood || !visitorId) return;
    setLoading(true);
    const res = await fetch('/api/daily-health-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-visitor-id': visitorId },
      body: JSON.stringify({ feels_healthy: feelsHealthy, no_fever: noFever, feeling_good: feelingGood }),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  const today = new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (alreadyFilled || submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">הצהרת הבריאות הוגשה</h1>
          <p className="text-slate-500 mb-6">תודה {visitorName}! אתה מוכן לטבילה להיום.</p>
          <p className="text-sm text-slate-400 mb-6">{today}</p>
          <button onClick={() => router.push('/dashboard')}
            className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            חזור לדשבורד
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800 flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🧊</div>
          <h1 className="text-2xl font-bold text-navy-900">הצהרת בריאות יומית</h1>
          <p className="text-slate-500 text-sm mt-1">{today}</p>
          {visitorName && <p className="text-ice-600 font-semibold mt-2">שלום {visitorName}</p>}
        </div>

        <div className="bg-ice-50 rounded-2xl p-5 mb-6 border border-ice-100">
          <p className="text-sm text-slate-600 mb-4 font-medium">
            לפני כל טבילה יש לאשר את הדברים הבאים:
          </p>
          <div className="space-y-4">
            {[
              { checked: feelsHealthy, set: setFeelsHealthy, label: 'אני מרגיש/ה בריא/ה כיום', icon: '💪' },
              { checked: noFever, set: setNoFever, label: 'אין לי חום (מתחת ל-37.5°C)', icon: '🌡️' },
              { checked: feelingGood, set: setFeelingGood, label: 'אני מרגיש/ה טוב ומסוגל/ת לטבילה', icon: '✨' },
            ].map(({ checked, set, label, icon }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <div onClick={() => set(!checked)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${checked ? 'bg-ice-600 border-ice-600' : 'border-slate-300 hover:border-ice-400'}`}>
                  {checked && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-navy-900 font-medium group-hover:text-ice-700 transition-colors">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!feelsHealthy || !noFever || !feelingGood || loading}
          className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 disabled:cursor-not-allowed
                     text-white font-bold py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-lg shadow-ice-500/30">
          {loading ? 'שולח...' : '✅ אני מצהיר/ה ומאשר/ת — קדימה לטבילה!'}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          אם אינך מרגיש/ה טוב, אנא הימנע/י מהטבילה ופנה/י לצוות
        </p>
      </div>
    </main>
  );
}
