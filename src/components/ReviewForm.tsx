'use client';

import { useState } from 'react';

const typeOptions = [
  { value: 'individual', label: 'סדנת יחידים' },
  { value: 'couple', label: 'סדנת זוגות' },
  { value: 'team', label: 'סדנת קבוצות' },
  { value: 'immersion', label: 'טבילה אישית' },
];

export default function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('individual');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!name.trim() || !text.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), role: role.trim(), type, rating, text: text.trim() }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'שגיאה בשליחה');
      return;
    }
    setDone(true);
  }

  if (!open) {
    return (
      <div className="mt-12 text-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-ice-600 hover:bg-ice-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-ice-600/20"
        >
          ✍️ כתוב חוות דעת
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-12 max-w-xl mx-auto bg-navy-800 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-white font-bold text-xl mb-2">תודה רבה!</h3>
        <p className="text-slate-400">חוות דעתך נשלחה לאישור. לאחר אישור הנהלה היא תפורסם כאן.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-xl mx-auto bg-navy-800 border border-navy-700 rounded-2xl p-6 md:p-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-xl">✍️ שתף/י את החוויה שלך</h3>
        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 text-xl leading-none">✕</button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">שם מלא *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="לדוגמה: דנה כ."
            className="w-full bg-navy-900 border border-navy-600 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-500 text-sm"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">תפקיד / תחום (אופציונלי)</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="לדוגמה: מנהלת שיווק, ספורטאי חובב..."
            className="w-full bg-navy-900 border border-navy-600 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-500 text-sm"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">סוג חוויה</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full bg-navy-900 border border-navy-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-500 text-sm"
          >
            {typeOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-2">דירוג</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Text */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">חוות הדעת שלך *</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            placeholder="ספר/י על החוויה שלך בסדנה..."
            className="w-full bg-navy-900 border border-navy-600 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ice-500 text-sm resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-4 py-2">{error}</p>}

        <p className="text-slate-500 text-xs">חוות דעתך תועבר לאישור לפני פרסום.</p>

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !text.trim() || loading}
          className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {loading ? 'שולח...' : 'שלח חוות דעת'}
        </button>
      </div>
    </div>
  );
}
