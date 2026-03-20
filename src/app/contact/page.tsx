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
            <div className="mt-2 pt-5 border-t border-slate-700 text-center text-slate-500 text-sm space-y-1">
              <p>
                טלפון:{' '}
                <a href="tel:089310715" className="text-cyan-500 hover:text-cyan-400 transition">
                  08-9310715
                </a>
              </p>
              <p>סירני 52, חולון</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
