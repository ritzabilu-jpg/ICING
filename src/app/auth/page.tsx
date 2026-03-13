'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase';
import Image from 'next/image';

type Step = 'select' | 'phone-enter' | 'phone-verify';

function formatIsraeliPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('972')) return '+' + digits;
  if (digits.startsWith('0')) return '+972' + digits.slice(1);
  return '+972' + digits;
}

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('select');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendOTP() {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await supabaseClient.auth.signInWithOtp({
      phone: formatIsraeliPhone(phone),
    });
    setLoading(false);
    if (error) setError('שגיאה בשליחת הקוד: ' + error.message);
    else setStep('phone-verify');
  }

  async function verifyOTP() {
    if (!otp.trim()) return;
    setLoading(true);
    setError('');
    const { data, error } = await supabaseClient.auth.verifyOtp({
      phone: formatIsraeliPhone(phone),
      token: otp.trim(),
      type: 'sms',
    });
    if (error) {
      setLoading(false);
      setError('קוד שגוי או פג תוקף. נסו שוב.');
      return;
    }
    // Update full name if provided
    if (name.trim() && data.user) {
      await supabaseClient.auth.updateUser({ data: { full_name: name.trim() } });
      // Also upsert profile
      await supabaseClient.from('profiles').upsert({
        id: data.user.id,
        full_name: name.trim(),
        phone: formatIsraeliPhone(phone),
      });
    }
    setLoading(false);
    router.push('/profile');
  }

  async function signInWithGoogle() {
    setLoading(true);
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profile` },
    });
  }

  async function signInWithFacebook() {
    setLoading(true);
    await supabaseClient.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/profile` },
    });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/logo-ice.png" alt="לוגו" width={80} height={80} className="mx-auto mb-4 rounded-2xl" />
          <h1 className="text-2xl font-black text-navy-900">כניסה / הרשמה</h1>
          <p className="text-slate-500 text-sm mt-1">חוויות שוויץ המדע</p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-ice-100 shadow-xl p-7">

          {/* Step: select method */}
          {step === 'select' && (
            <div className="space-y-3">
              {/* Phone */}
              <button
                onClick={() => setStep('phone-enter')}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2
                           border-ice-200 hover:border-ice-400 bg-white transition-all font-semibold text-navy-900"
              >
                <span className="text-2xl">📱</span>
                <span>כניסה עם טלפון (OTP)</span>
              </button>

              {/* Google */}
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2
                           border-slate-200 hover:border-slate-400 bg-white transition-all font-semibold text-navy-900 disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>כניסה עם Google</span>
              </button>

              {/* Facebook */}
              <button
                onClick={signInWithFacebook}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2
                           border-slate-200 hover:border-blue-300 bg-white transition-all font-semibold text-navy-900 disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>כניסה עם Facebook</span>
              </button>
            </div>
          )}

          {/* Step: enter phone */}
          {step === 'phone-enter' && (
            <div className="space-y-4">
              <button onClick={() => setStep('select')} className="text-slate-400 text-sm hover:text-slate-600">
                ← חזרה
              </button>
              <h2 className="text-lg font-black text-navy-900">הכניסו מספר טלפון</h2>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-1">שם מלא</label>
                <input
                  type="text"
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
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="050-0000000"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3
                             focus:border-ice-400 focus:outline-none text-navy-900 text-left"
                  dir="ltr"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={sendOTP}
                disabled={loading || !phone.trim()}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'שולח קוד...' : 'שלחו קוד אימות'}
              </button>
            </div>
          )}

          {/* Step: verify OTP */}
          {step === 'phone-verify' && (
            <div className="space-y-4">
              <button onClick={() => setStep('phone-enter')} className="text-slate-400 text-sm hover:text-slate-600">
                ← חזרה
              </button>
              <h2 className="text-lg font-black text-navy-900">הכניסו קוד אימות</h2>
              <p className="text-slate-500 text-sm">
                שלחנו קוד SMS ל-{phone}
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3
                           focus:border-ice-400 focus:outline-none text-navy-900 text-center text-2xl tracking-widest"
                dir="ltr"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'מאמת...' : 'אמתו וכנסו'}
              </button>
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                שלחו קוד מחדש
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
