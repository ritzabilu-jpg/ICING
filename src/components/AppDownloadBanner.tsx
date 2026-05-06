'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const STORAGE_KEY = 'icing_app_banner_seen';

export default function AppDownloadBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only on first visit, after 3 seconds
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 animate-fade-in-up">
      <div className="max-w-md mx-auto bg-navy-900 border border-ice-500/30 rounded-2xl shadow-2xl shadow-navy-900/60 overflow-hidden">
        {/* Top bar */}
        <div className="bg-gradient-to-l from-ice-600 to-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/ICINGLOGO-icon.png" alt="ICING" width={40} height={40}
              className="rounded-full object-contain" />
            <div>
              <p className="text-white font-black text-sm leading-tight">{t('app_banner_title')}</p>
              <p className="text-ice-200 text-xs leading-tight mt-0.5">{t('app_banner_desc')}</p>
            </div>
          </div>
          <button onClick={dismiss} aria-label="סגור"
            className="text-ice-300 hover:text-white text-xl leading-none w-7 h-7 flex items-center justify-center">
            ✕
          </button>
        </div>

        {/* Buttons */}
        <div className="px-4 py-3 flex gap-2 items-center bg-navy-900">
          <Link href="/app" onClick={dismiss}
            className="flex-1 flex items-center justify-center gap-2 bg-ice-500 hover:bg-ice-600
                       text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            iOS
          </Link>
          <Link href="/app" onClick={dismiss}
            className="flex-1 flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-600
                       text-white font-bold py-2.5 rounded-xl text-sm transition-colors border border-navy-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.523 15.341 5.68 22.107a1.213 1.213 0 0 1-1.759-1.082V2.975c0-.96 1.04-1.527 1.759-1.083l11.843 6.766a1.214 1.214 0 0 1 0 2.083zM3 3.875v16.25L13.28 12 3 3.875z"/>
            </svg>
            Android
          </Link>
          <button onClick={dismiss}
            className="text-slate-400 hover:text-slate-300 text-xs px-2 transition-colors whitespace-nowrap">
            {t('app_banner_dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}
