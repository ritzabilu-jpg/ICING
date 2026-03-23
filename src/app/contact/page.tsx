'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const initialForm: FormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'שגיאה בשליחה, נסה שוב');
      } else {
        setSuccess(true);
        setForm(initialForm);
      }
    } catch {
      setErrorMsg('שגיאת רשת, בדוק את החיבור ונסה שוב');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-xl bg-[#0f172a] border border-slate-700 text-slate-100 placeholder-slate-500 px-4 py-3 text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition';

  return (
    <main className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-[#1e293b] rounded-3xl shadow-2xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">צור קשר</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            נשמח לענות על כל שאלה – מלאו את הטופס ונחזור אליכם בהקדם.
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <span className="text-5xl">✅</span>
            <p className="text-xl font-semibold text-cyan-400">ההודעה נשלחה בהצלחה!</p>
            <p className="text-slate-400 text-sm">ניצור איתך קשר בהקדם.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-slate-500 hover:text-cyan-400 underline transition"
            >
              שלח הודעה נוספת
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" dir="rtl">
            {/* שם מלא */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-slate-300 text-sm font-medium">
                שם מלא <span className="text-cyan-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="ישראל ישראלי"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* טלפון */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-slate-300 text-sm font-medium">
                טלפון <span className="text-cyan-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="050-0000000"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                dir="ltr"
              />
            </div>

            {/* מייל */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-slate-300 text-sm font-medium">
                מייל <span className="text-slate-500 font-normal text-xs">(אופציונלי)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                dir="ltr"
              />
            </div>

            {/* הודעה */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-slate-300 text-sm font-medium">
                הודעה <span className="text-cyan-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="כתבו את הודעתכם כאן..."
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-1 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] font-bold text-base transition-colors duration-200 shadow-lg shadow-cyan-900/40"
            >
              {submitting ? 'שולח...' : 'שליחה'}
            </button>

            {/* Contact info */}
            <div className="mt-2 pt-5 border-t border-slate-700 text-center text-slate-500 text-sm space-y-3">
              <p>
                טלפון:{' '}
                <a href="tel:089310715" className="text-cyan-500 hover:text-cyan-400 transition">
                  08-9310715
                </a>
              </p>
              <p>סירני 52, חולון</p>
              <div className="flex gap-3 pt-1">
                <a
                  href="https://www.google.com/maps/place/%D7%9E%D7%AA%D7%A0%22%D7%A1+%D7%97%D7%95%D7%95%D7%99%D7%95%D7%AA+%D7%A9%D7%95%D7%95%D7%99%D7%A5+%D7%94%D7%9E%D7%93%D7%A2%E2%80%AD/@31.900446,34.8231278,17.5z/data=!4m6!3m5!1s0x1502b65515e7aaab:0xb26bcc81189c0b68!8m2!3d31.9006165!4d34.8199625!16s%2Fg%2F1ydkhrmny?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIPD2ASoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 rounded-2xl text-sm transition-all shadow border border-slate-200"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.5 1 24 1 15.2 1 7.7 6.1 4.1 13.5l7 5.4C12.9 13.1 18 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.5c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z" />
                    <path fill="#FBBC05" d="M11.1 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.4 10.3l7.7-5.7z"/>
                    <path fill="#EA4335" d="M24 47c5.4 0 10-1.8 13.3-4.8l-7-5.4c-1.8 1.2-4 1.9-6.3 1.9-5.9 0-10.9-4-12.7-9.4l-7.7 5.7C7.5 42 15.1 47 24 47z"/>
                  </svg>
                  Google Maps
                </a>
                <a
                  href="https://www.waze.com/en/live-map/directions/%D7%97%D7%99%D7%99%D7%9D-%D7%A1%D7%99%D7%A8%D7%A0%D7%99-52-%D7%A8%D7%97%D7%95%D7%91%D7%95%D7%AA?place=w.22806847.228199542.169287"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 bg-[#05c8f7] hover:bg-[#04b0d9] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="23" fill="#33CCFF" stroke="white" strokeWidth="2"/>
                    <path d="M24 10c-7.7 0-14 6.3-14 14 0 5.2 2.8 9.7 7 12.2L24 38l7-1.8c4.2-2.5 7-7 7-12.2 0-7.7-6.3-14-14-14z" fill="white"/>
                    <circle cx="19" cy="25" r="2.5" fill="#33CCFF"/>
                    <circle cx="29" cy="25" r="2.5" fill="#33CCFF"/>
                    <path d="M19 30c1.3 1.5 3 2.5 5 2.5s3.7-1 5-2.5" stroke="#33CCFF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Waze
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
