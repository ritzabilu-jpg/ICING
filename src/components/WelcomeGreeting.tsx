'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WelcomeGreeting() {
  const [name, setName] = useState<string | null>(null);
  const [showAsk, setShowAsk] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showThanks, setShowThanks] = useState(false);
  const [inputName, setInputName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('visitor_name');
    if (saved) {
      setName(saved);
    } else {
      const t = setTimeout(() => setShowAsk(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  function saveName() {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    localStorage.setItem('visitor_name', trimmed);
    setName(trimmed);
    setShowAsk(false);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveName();
  }

  if (!mounted) return null;

  // ברכת תודה קצרה לאחר שמירת השם
  if (showThanks && name) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-ice-600 text-white rounded-2xl px-5 py-4 shadow-xl animate-slide-up text-right">
        <p className="font-bold text-lg">שלום {name}! 👋</p>
        <p className="text-sm text-ice-100">שמחים להכיר אותך</p>
      </div>
    );
  }

  // בנר למבקר חוזר
  if (name && showBanner) {
    return (
      <div className="w-full bg-gradient-to-l from-ice-50 to-sky-50 border-b border-ice-200 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap" dir="rtl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <span className="font-bold text-navy-900 text-lg">שלום {name}!</span>
              <span className="text-slate-600 mr-2 text-sm">ברוך שובך — נעים לראותך שוב</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-auto">
            <Link
              href="/booking"
              className="bg-ice-600 hover:bg-ice-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              📅 קבע טבילה
            </Link>
            <Link
              href="/booking?type=workshop"
              className="bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              🏔️ קבע סדנה
            </Link>
            <button
              onClick={() => setShowBanner(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors text-lg font-light mr-1"
              aria-label="סגור"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  // כרטיסיית שאלת שם למבקר חדש
  if (showAsk) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl p-5 w-72 animate-slide-up border border-slate-100" dir="rtl">
        <button
          onClick={() => setShowAsk(false)}
          className="absolute top-3 left-3 text-slate-300 hover:text-slate-500 text-lg"
          aria-label="סגור"
        >
          ✕
        </button>
        <div className="text-3xl mb-3 text-center">👋</div>
        <p className="font-bold text-navy-900 text-lg mb-1 text-center">שמחים להכיר!</p>
        <p className="text-slate-500 text-sm mb-4 text-center">מה שמך? נוכל לפנות אליך אישית</p>
        <input
          type="text"
          value={inputName}
          onChange={e => setInputName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הכנס שמך כאן..."
          autoFocus
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-right text-sm focus:outline-none focus:ring-2 focus:ring-ice-400 mb-3"
        />
        <button
          onClick={saveName}
          disabled={!inputName.trim()}
          className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold py-2 rounded-xl transition-colors text-sm"
        >
          שמור
        </button>
      </div>
    );
  }

  return null;
}
