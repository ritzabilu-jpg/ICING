/**
 * WelcomeGreeting – identifies returning vs new visitors via localStorage.
 * - Booking TODAY + health check not filled → mandatory amber banner (no close).
 * - Returning, no mandatory action → normal banner (optional health-check link if booking today).
 * - New visitor → name-ask card after 2s delay.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Mandatory banner (booking today, health check not yet filled) ────────────

function MandatoryHealthBanner({ name }: { name: string }) {
  const router = useRouter();
  return (
    <div className="bg-amber-50 border-b-2 border-amber-400 py-4 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-amber-900 font-black text-sm">⚠️ שלום {name}! יש לך טבילה היום.</p>
          <p className="text-amber-700 text-xs mt-0.5">חובה למלא הצהרת בריאות לפני הטבילה</p>
        </div>
        <button
          onClick={() => router.push('/health-check')}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-black px-5 py-2 rounded-xl transition-colors animate-pulse"
        >
          📋 מלא הצהרת בריאות עכשיו
        </button>
      </div>
    </div>
  );
}

// ─── Normal returning visitor banner ─────────────────────────────────────────

function ReturnBanner({
  name,
  hasBookingToday,
  onClose,
}: {
  name: string;
  hasBookingToday: boolean;
  onClose: () => void;
}) {
  return (
    <div className="bg-ice-50 border-b border-ice-200 py-3 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-navy-900 font-semibold text-sm">
          שלום <span className="text-ice-700 font-black">{name}</span>! ברוך שובך 👋
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/booking"
            className="bg-ice-600 hover:bg-ice-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
            📅 קבע טבילה / סדנה
          </Link>
          <Link href="/journal"
            className="bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
            📖 יומן טבילות
          </Link>
          {/* Optional link – shown only if they have a booking today (health check already filled) */}
          {hasBookingToday && (
            <Link href="/health-check"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
              ✅ הצהרת בריאות
            </Link>
          )}
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none pr-1"
            aria-label="סגור">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New visitor name card ────────────────────────────────────────────────────

function AskNameCard({ onSave }: { onSave: (name: string) => void }) {
  const [input, setInput] = useState('');

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) onSave(input.trim());
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white shadow-2xl rounded-2xl p-5 w-72 animate-slide-up" dir="rtl">
      <p className="text-navy-900 font-black text-sm mb-1">👋 שמחים להכיר!</p>
      <p className="text-slate-500 text-xs mb-3">מה שמך? נציג לך ברכה אישית בביקורים הבאים.</p>
      <form onSubmit={save} className="flex gap-2">
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="שמך..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-ice-400"
        />
        <button type="submit"
          className="bg-ice-600 hover:bg-ice-700 text-white text-sm font-bold px-4 rounded-lg transition-colors">
          שמור
        </button>
      </form>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WelcomeGreeting() {
  const [name, setName]                  = useState<string | null>(null);
  const [showAsk, setShowAsk]            = useState(false);
  const [showBanner, setShowBanner]      = useState(true);
  const [hasBookingToday, setHasBooking] = useState(false);
  const [healthCheckFilled, setHCFilled] = useState(true); // optimistic default

  useEffect(() => {
    const saved     = localStorage.getItem('visitor_name');
    const visitorId = localStorage.getItem('visitor_id');

    if (saved) {
      setName(saved);
      const params = new URLSearchParams({ name: saved });
      if (visitorId) params.set('visitor_id', visitorId);

      fetch(`/api/check-today-booking?${params}`)
        .then(r => r.json())
        .then((d: { hasBookingToday: boolean; healthCheckFilled: boolean }) => {
          setHasBooking(d.hasBookingToday);
          setHCFilled(d.healthCheckFilled);
        })
        .catch(() => {});
    } else {
      const t = setTimeout(() => setShowAsk(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  function handleSave(newName: string) {
    localStorage.setItem('visitor_name', newName);
    setName(newName);
    setShowAsk(false);
  }

  if (name && showBanner) {
    if (hasBookingToday && !healthCheckFilled)
      return <MandatoryHealthBanner name={name} />;
    return <ReturnBanner name={name} hasBookingToday={hasBookingToday} onClose={() => setShowBanner(false)} />;
  }
  if (showAsk) return <AskNameCard onSave={handleSave} />;
  return null;
}
