'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AppPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/app-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
    } catch {}
    setSent(true);
    setLoading(false);
  }

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
        </svg>
      ),
      title: t('app_feat1_title'),
      desc: t('app_feat1_desc'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
          <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      ),
      title: t('app_feat2_title'),
      desc: t('app_feat2_desc'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      title: t('app_feat3_title'),
      desc: t('app_feat3_desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800">

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-ice-500/30 border-2 border-ice-500/40">
                <Image src="/ICINGLOGO-icon.png" alt="ICING" width={112} height={112}
                  className="object-cover w-full h-full" />
              </div>
              <span className="absolute -bottom-2 -left-2 bg-ice-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                BETA
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('app_page_title')}
          </h1>
          <p className="text-ice-200 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
            {t('app_page_sub')}
          </p>

          {/* Store buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <button disabled
              className="flex items-center gap-3 bg-white/10 border border-white/20 text-white
                         px-6 py-3.5 rounded-2xl opacity-60 cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white shrink-0">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <div className="text-right">
                <div className="text-xs text-white/70 leading-none">{t('app_coming_note')}</div>
                <div className="text-base font-bold leading-tight">{t('app_ios_btn')}</div>
              </div>
            </button>

            <button disabled
              className="flex items-center gap-3 bg-white/10 border border-white/20 text-white
                         px-6 py-3.5 rounded-2xl opacity-60 cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white shrink-0">
                <path d="M3.18 23.76a1.5 1.5 0 0 0 2.07.54l9.64-5.57-2.45-2.44-9.26 7.47zm17.42-11.2L17.1 10.4l-3.04 3.04 3.04 3.04 3.52-2.03a1.5 1.5 0 0 0 0-2.6zM1.22.81A1.5 1.5 0 0 0 1 1.5v21a1.5 1.5 0 0 0 .22.69l.11.11L13.8 12.01v-.3L1.33.7l-.11.11zm4.03 2.53 12.38 7.14-2.44 2.44-9.94-9.58z"/>
              </svg>
              <div className="text-right">
                <div className="text-xs text-white/70 leading-none">{t('app_coming_note')}</div>
                <div className="text-base font-bold leading-tight">{t('app_android_btn')}</div>
              </div>
            </button>
          </div>

          <p className="text-ice-400/60 text-sm">{t('app_coming_note')}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-navy-800/60 border border-navy-700/50 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-ice-500/20 text-ice-400 flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Admin push notifications note */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto bg-ice-500/10 border border-ice-500/30 rounded-2xl p-6 flex items-start gap-4">
          <div className="text-ice-400 shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.93 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">הודעות מהמנהל — ישירות אליך</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              מדריכי ומנהלי ICING ישלחו הודעות פוש ישירות לכל מורידי האפליקציה — על מפגשים מיוחדים, הנחות, ומבצעים — הכל מלוח הניהול במקום אחד.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist form */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-2">{t('app_notify_title')}</h2>
          <p className="text-slate-400 text-sm mb-6">{t('app_coming_note')}</p>

          {sent ? (
            <div className="bg-ice-500/20 border border-ice-500/40 rounded-2xl py-6 px-4">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-ice-300 font-bold">{t('app_notify_sent')}</p>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t('app_notify_ph')}
                dir="ltr"
                className="flex-1 bg-navy-800 border border-navy-600 text-white placeholder-slate-500
                           rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ice-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-ice-500 hover:bg-ice-600 text-white font-bold px-5 py-3 rounded-xl
                           text-sm transition-colors disabled:opacity-60 whitespace-nowrap">
                {loading ? '...' : t('app_notify_btn')}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
