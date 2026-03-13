'use client';

import { useState, useEffect } from 'react';

interface SlotInfo {
  label: string;
  date: string;
  count: number;
  full: boolean;
}

interface Props {
  onBack: () => void;
}

export default function LiorSlotBooking({ onBack }: Props) {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/lior-slots')
      .then(r => r.json())
      .then((d: { slots: SlotInfo[] }) => setSlots(d.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lior-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, timeLabel: selectedSlot }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setStatus('done');
        // Update local slot count
        setSlots(prev =>
          prev.map(s =>
            s.label === selectedSlot
              ? { ...s, count: s.count + 1, full: s.count + 1 >= 10 }
              : s,
          ),
        );
      } else {
        setErrorMsg(data.error ?? 'שגיאה. נסו שוב.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('שגיאת רשת. נסו שוב.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-black text-navy-900 mb-3">נרשמתם בהצלחה!</h2>
        <p className="text-slate-500 mb-2">
          <span className="font-semibold">{name}</span> — {selectedSlot}, 19.3.2026
        </p>
        <p className="text-slate-400 text-sm mb-8">ליאור יצור קשר לפרטים נוספים.</p>
        <button onClick={onBack} className="btn-primary">
          חזרה לסוגי הסדנאות
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border-2 border-ice-200 shadow-xl p-8">
        <div className="text-5xl text-center mb-3">🧊</div>
        <h2 className="text-2xl font-black text-navy-900 mb-1 text-center">סדנה עם ליאור כ&quot;ץ</h2>
        <p className="text-slate-500 text-center text-sm mb-6">יום שישי 19.3.2026 · בחרו שעה פנויה</p>

        {/* Time slots */}
        <div className="space-y-3 mb-6">
          {loading ? (
            <div className="text-center text-slate-400 py-6">
              <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              טוען מועדים...
            </div>
          ) : (
            slots.map(slot => (
              <button
                key={slot.label}
                disabled={slot.full}
                onClick={() => setSelectedSlot(slot.label)}
                className={`w-full flex items-center justify-between rounded-2xl border-2 px-5 py-4 transition-all
                  ${slot.full
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : selectedSlot === slot.label
                      ? 'border-ice-500 bg-ice-50 ring-2 ring-ice-400'
                      : 'border-ice-100 bg-white hover:border-ice-400 hover:shadow-md'
                  }`}
              >
                <div className="text-right">
                  <div className="text-xl font-black text-navy-900">{slot.label}</div>
                  <div className="text-sm text-slate-500">{slot.date}</div>
                </div>
                <div className="text-left">
                  {slot.full ? (
                    <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      מלא
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">
                      {slot.count}/{10} נרשמו
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Booking form — shown after selecting a slot */}
        {selectedSlot && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 pt-6">
            <p className="text-sm font-semibold text-navy-800 text-center">
              בחרתם: <span className="text-ice-600">{selectedSlot}, 19.3.2026</span>
            </p>
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
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {status === 'sending' ? 'שומר...' : 'אישור הרשמה'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600
                           hover:border-slate-300 font-semibold transition-colors"
              >
                חזרה
              </button>
            </div>
          </form>
        )}

        {!selectedSlot && !loading && (
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
            >
              ← חזרה לסוגי הסדנאות
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
