'use client';

import { useState, useEffect } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  dark?: boolean;
  /** Tailwind bg class of the parent section, used to match the fade colour */
  fadeColor?: string; // e.g. '#ffffff', '#f0f9ff'
  /** If window.location.hash matches this value, open automatically */
  openOnHash?: string;
  children: React.ReactNode;
}

function OpenPill({ open, dark }: { open: boolean; dark: boolean }) {
  const pill = dark
    ? 'border-white/30 text-white/80 hover:bg-white/10'
    : 'border-ice-300 text-ice-600 bg-ice-50 hover:bg-ice-100';

  return open ? (
    <div className={`inline-flex justify-center mt-4 ${dark ? 'text-white/50' : 'text-ice-300'}`}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none"
           stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
           className="rotate-180">
        <polyline points="1,1 10,10 19,1" />
      </svg>
    </div>
  ) : (
    <div className={`inline-flex items-center gap-2 mt-4 border rounded-full px-5 py-2
                     transition-colors duration-150 animate-bounce ${pill}`}>
      <span className="text-xs font-bold tracking-wide">לחץ לפתיחה</span>
      <svg width="14" height="9" viewBox="0 0 14 9" fill="none"
           stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1,1 7,8 13,1" />
      </svg>
    </div>
  );
}

export default function AccordionSection({ title, subtitle, dark = false, fadeColor, openOnHash, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openOnHash && window.location.hash === `#${openOnHash}`) {
      setOpen(true);
    }
  }, [openOnHash]);

  // Gradient from transparent → section background colour
  const gradientEnd = fadeColor ?? (dark ? '#0f172a' : '#ffffff');

  return (
    <>
      {/* ── Header / trigger ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full text-center py-10 px-6 select-none transition-colors duration-150
                    ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
      >
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <h2 className={`text-4xl font-black mb-1 transition-colors
                          ${dark
                            ? 'text-white'
                            : open ? 'text-ice-700' : 'text-navy-900'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
          )}
          <OpenPill open={open} dark={dark} />
        </div>
      </button>

      {/* ── Content with peek-fade when closed ── */}
      <div className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out
                       ${open ? 'max-h-[9999px]' : 'max-h-[5.5rem]'}`}>
        {children}

        {/* Fade overlay — only when closed */}
        {!open && (
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, ${gradientEnd})`,
            }}
          />
        )}
      </div>
    </>
  );
}
