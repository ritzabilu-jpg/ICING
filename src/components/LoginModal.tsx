'use client';

import { useState } from 'react';

interface Props {
  initialName?: string;
  onClose: () => void;
  onLogin: (id: string, name: string, role: string) => void;
}

export default function LoginModal({ initialName = '', onClose, onLogin }: Props) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendOtp() {
    if (!email.trim()) return;
    setLoading(true); setError('');
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'שגיאה בשליחת הקוד'); return; }
    setStep('otp');
  }

  async function verifyOtp() {
    if (!otp.trim()) return;
    setLoading(true); setError('');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), code: otp.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'קוד שגוי'); return; }
    localStorage.setItem('visitor_id', data.id);
    localStorage.setItem('visitor_name', data.name);
    localStorage.setItem('visitor_role', data.role);
    localStorage.setItem('visitor_email', data.email || '');
    if (data.role === 'admin') {
      try {
        const kr = await fetch('/api/auth/admin-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitor_id: data.id }),
        });
        const kd = await kr.json();
        if (kd.key) localStorage.setItem('admin_key', kd.key);
      } catch {}
    }
    onLogin(data.id, data.name, data.role);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" dir="rtl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-navy-900">
            {step === 'email' ? 'כניסה / הרשמה' : 'אמת את האימייל'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">X</button>
        </div>

        {step === 'email' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="הכנס שמך"
                autoFocus
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-ice-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-ice-400"
              />
            </div>
            <p className="text-xs text-slate-400 text-center">נשלח אליך קוד אימות חד-פעמי באימייל</p>
            {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={!email.trim() || loading}
              className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'שולח קוד...' : 'שלח קוד לאימייל'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 text-center">
              שלחנו קוד 6 ספרות לכתובת<br />
              <strong className="text-navy-900">{email}</strong>
            </p>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">קוד אימות</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-ice-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}
            <button
              onClick={verifyOtp}
              disabled={otp.length < 6 || loading}
              className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'מאמת...' : 'כניסה'}
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="w-full text-sm text-slate-400 hover:text-slate-600"
            >
              חזור / שלח קוד חדש
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
