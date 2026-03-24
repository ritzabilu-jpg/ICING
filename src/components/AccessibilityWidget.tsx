'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AccessibilityWidget() {
  const [open, setOpen]         = useState(false);
  const [fontSize, setFontSize] = useState(0);   // 0=normal, 1=+1, 2=+2
  const [contrast, setContrast] = useState(false);
  const [underline, setUnderline] = useState(false);

  // Restore saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('a11y');
    if (saved) {
      const p = JSON.parse(saved);
      setFontSize(p.fontSize ?? 0);
      setContrast(p.contrast ?? false);
      setUnderline(p.underline ?? false);
    }
  }, []);

  // Apply preferences to document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = fontSize === 0 ? '' : fontSize === 1 ? '110%' : '125%';
    if (contrast) {
      root.classList.add('a11y-contrast');
    } else {
      root.classList.remove('a11y-contrast');
    }
    if (underline) {
      root.classList.add('a11y-underline');
    } else {
      root.classList.remove('a11y-underline');
    }
    localStorage.setItem('a11y', JSON.stringify({ fontSize, contrast, underline }));
  }, [fontSize, contrast, underline]);

  function reset() {
    setFontSize(0);
    setContrast(false);
    setUnderline(false);
  }

  return (
    <>
      {/* Global styles for accessibility modes */}
      <style>{`
        .a11y-contrast { filter: contrast(1.5) !important; background: #000 !important; color: #fff !important; }
        .a11y-underline a { text-decoration: underline !important; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-600
                   text-white shadow-2xl flex items-center justify-center transition-all
                   focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 9.5l-4-.5-1-3h-4l-1 3-4 .5.5 2 3.5-.5v3l-2 5h2l1.5-4h1l1.5 4h2l-2-5V11l3.5.5.5-2z"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="תפריט נגישות"
          dir="rtl"
          className="fixed bottom-24 left-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-navy-900 text-base">אפשרויות נגישות</h2>
            <button onClick={() => setOpen(false)} aria-label="סגור תפריט נגישות"
              className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">גודל טקסט</p>
            <div className="flex gap-2">
              {[
                { label: 'רגיל', val: 0 },
                { label: 'גדול', val: 1 },
                { label: 'גדול מאוד', val: 2 },
              ].map(opt => (
                <button key={opt.val} onClick={() => setFontSize(opt.val)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors
                    ${fontSize === opt.val
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 mb-4">
            <button onClick={() => setContrast(c => !c)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
                ${contrast ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
              <span>ניגודיות גבוהה</span>
              <span>{contrast ? '✓' : ''}</span>
            </button>

            <button onClick={() => setUnderline(u => !u)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
                ${underline ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
              <span>הדגשת קישורים</span>
              <span>{underline ? '✓' : ''}</span>
            </button>
          </div>

          {/* Reset */}
          <button onClick={reset}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline transition-colors mb-3">
            איפוס הגדרות
          </button>

          {/* Links */}
          <div className="border-t border-slate-100 pt-3 space-y-1">
            <Link href="/accessibility" onClick={() => setOpen(false)}
              className="block text-sm text-blue-700 hover:underline">
              הצהרת נגישות
            </Link>
            <a href="tel:089310715"
              className="block text-sm text-blue-700 hover:underline">
              פנייה בנושא נגישות: 08-9310715
            </a>
          </div>
        </div>
      )}
    </>
  );
}
