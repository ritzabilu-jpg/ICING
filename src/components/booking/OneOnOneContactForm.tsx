'use client';

import { useState } from 'react';

interface Props {
  onBack: () => void;
}

export default function OneOnOneContactForm({ onBack }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/personal-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-black text-navy-900 mb-3">תודה!</h2>
        <p className="text-slate-500 mb-8">קיבלנו את פרטיכם ונצור קשר בהקדם לתיאום המועד.</p>
        <button onClick={onBack} className="btn-primary">
          חזרה לסוגי הסדנאות
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl border-2 border-ice-200 shadow-xl p-8">
        <div className="text-5xl text-center mb-4">⭐</div>
        <h2 className="text-2xl font-black text-navy-900 mb-1 text-center">סדנה אישית אחד על אחד</h2>
        <p className="text-slate-500 text-center text-sm mb-2">₪550 · מדריך אישי · זמן גמיש</p>
        <p className="text-slate-500 text-center text-sm mb-8">
          השאירו פרטים ונחזור אליכם לתיאום המועד המתאים
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-1">שם מלא</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3
                         focus:border-ice-400 focus:outline-none text-navy-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-1">טלפון</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="050-0000000"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3
                         focus:border-ice-400 focus:outline-none text-navy-900"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm text-center">שגיאה בשליחה. נסו שוב.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {status === 'sending' ? 'שולח...' : 'שלח פרטים לתיאום'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600
                         hover:border-slate-300 font-semibold transition-colors"
            >
              חזרה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
