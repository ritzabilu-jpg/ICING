'use client';
import { useState } from 'react';

export default function PersonalBookingModal() {
  const [open, setOpen] = useState(false);
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
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-4 bg-ice-500 hover:bg-ice-600 text-white font-bold
                   py-4 px-6 rounded-2xl text-lg transition-all hover:scale-105
                   shadow-lg shadow-ice-500/30"
      >
        🧊 לתיאום סדנה אישית
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
             onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-navy-900 mb-2 text-center">
              🧊 סדנה אישית
            </h3>
            <p className="text-slate-500 text-center mb-6 text-sm">
              השאירו פרטים ונחזור אליכם לתיאום
            </p>

            {status === 'done' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-lg font-bold text-navy-900">תודה!</p>
                <p className="text-slate-500 text-sm mt-1">קיבלנו את פרטיכם ונצור קשר בהקדם.</p>
                <button onClick={() => { setOpen(false); setStatus('idle'); setName(''); setPhone(''); }}
                        className="mt-6 btn-primary">
                  סגור
                </button>
              </div>
            ) : (
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
                  <button type="submit" disabled={status === 'sending'}
                          className="flex-1 btn-primary disabled:opacity-50">
                    {status === 'sending' ? 'שולח...' : 'שלח פרטים'}
                  </button>
                  <button type="button" onClick={() => setOpen(false)}
                          className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600
                                     hover:border-slate-300 font-semibold transition-colors">
                    ביטול
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
