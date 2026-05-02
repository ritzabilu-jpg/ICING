'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGS } from '@/lib/i18n/translations';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGS.find(l => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="בחר שפה"
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-navy-700
                   hover:bg-navy-600 text-white text-lg transition-colors border border-navy-600"
        title={current.label}
      >
        🌐
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-2xl
                        border border-slate-200 overflow-hidden min-w-[140px]"
             dir="ltr">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-right
                          transition-colors hover:bg-ice-50
                          ${lang === l.code ? 'bg-ice-50 text-ice-700 font-bold' : 'text-slate-700'}`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && <span className="mr-auto text-ice-500 text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
