'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
  const { t } = useLanguage();
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
        setErrorMsg(data.error || t('contact_error_general'));
      } else {
        setSuccess(true);
        setForm(initialForm);
      }
    } catch {
      setErrorMsg(t('contact_error_network'));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-xl bg-navy-900/60 border border-navy-700 text-slate-100 placeholder-slate-500 px-4 py-3 text-base focus:outline-none focus:border-ice-500 focus:ring-1 focus:ring-ice-500/30 transition';

  return (
    <main className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4 py-16"
          style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0a1929 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-lg bg-navy-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-ice-500/15 border border-ice-500/30
                          flex items-center justify-center text-3xl mx-auto mb-4">
            ✉️
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{t('contact_page_title')}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t('contact_page_sub')}
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30
                            flex items-center justify-center text-4xl">✅</div>
            <p className="text-xl font-bold text-white">{t('contact_success_title')}</p>
            <p className="text-slate-400 text-sm">{t('contact_success_sub')}</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-slate-500 hover:text-ice-400 underline transition"
            >
              {t('contact_send_another')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" dir="rtl">
            {/* שם מלא */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-slate-300 text-sm font-medium">
                {t('contact_field_name')} <span className="text-ice-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={t('contact_name_ph')}
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* טלפון */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-slate-300 text-sm font-medium">
                {t('contact_field_phone')} <span className="text-ice-400">*</span>
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
                {t('contact_field_email')} <span className="text-slate-500 font-normal text-xs">({t('contact_required')})</span>
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
                {t('contact_field_message')} <span className="text-ice-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder={t('contact_message_ph')}
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
              className="w-full mt-1 py-3.5 rounded-2xl bg-gradient-to-l from-ice-600 to-ice-500
                         hover:from-ice-500 hover:to-ice-400 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-bold text-base transition-all duration-200 shadow-lg shadow-ice-900/40
                         hover:shadow-ice-500/30 hover:scale-[1.02] active:scale-100"
            >
              {submitting ? t('contact_sending_btn') : t('contact_send_btn')}
            </button>

            {/* Contact info */}
            <div className="mt-2 pt-5 border-t border-white/10 text-center text-slate-500 text-sm space-y-1">
              <p>
                {t('contact_phone_label')}:{' '}
                <a href="tel:089310715" className="text-ice-400 hover:text-ice-300 transition">
                  08-9310715
                </a>
              </p>
              <p>{t('contact_address_info')}</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
