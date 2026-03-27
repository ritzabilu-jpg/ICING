'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'otp';

export default function InstructorLogin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendOtp() {
    setError('');
    if (!email.trim()) return setError('נא להזין אימייל');
    setLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) return setError(d.error || 'שגיאה בשליחת קוד');
    setStep('otp');
  }

  async function verifyOtp() {
    setError('');
    if (!otp.trim()) return setError('נא להזין קוד');
    setLoading(true);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp.trim() }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) return setError(d.error || 'קוד שגוי');
    if (!['instructor', 'admin'].includes(d.role)) {
      return setError('אין לך הרשאת מדריך. פנה לאדמין.');
    }
    localStorage.setItem('visitor_id', d.id);
    localStorage.setItem('visitor_role', d.role);
    localStorage.setItem('visitor_name', d.name);
    router.push('/instructor/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#0f2942] flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#0f2942] mb-1 text-center">כניסת מדריך</h1>
        <p className="text-slate-500 text-sm text-center mb-6">כניסה עם אימייל וקוד חד-פעמי</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="האימייל שלך"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendOtp()}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:border-[#7dd8f8]"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-[#0f2942] hover:bg-[#1a3a5c] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'שולח...' : 'שלח קוד'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-600 text-sm text-center">קוד נשלח לאימייל {email}</p>
            <input
              type="text"
              placeholder="הכנס קוד 6 ספרות"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-[#7dd8f8]"
              maxLength={6}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-[#0f2942] hover:bg-[#1a3a5c] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'מאמת...' : 'כניסה'}
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              className="w-full text-slate-400 text-sm"
            >
              שנה אימייל
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
