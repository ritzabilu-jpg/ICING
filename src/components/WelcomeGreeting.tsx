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
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ─── Mandatory banner (booking today, health check not yet filled) ────────────

function MandatoryHealthBanner({ name }: { name: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <div className="bg-amber-50 border-b-2 border-amber-400 py-4 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-amber-900 font-black text-sm">⚠️ {t('greeting_mandatory_title').replace('{name}', name)}</p>
          <p className="text-amber-700 text-xs mt-0.5">{t('greeting_mandatory_desc')}</p>
        </div>
        <button
          onClick={() => router.push('/health-check')}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-black px-5 py-2 rounded-xl transition-colors animate-pulse"
        >
          📋 {t('greeting_mandatory_btn')}
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
  const { t } = useLanguage();
  return (
    <div className="bg-ice-50 border-b border-ice-200 py-3 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-navy-900 font-semibold text-sm">
          {t('greeting_return_text').replace('{name}', name)}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/booking"
            className="bg-ice-600 hover:bg-ice-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
            📅 {t('greeting_book_btn')}
          </Link>
          <Link href="/journal"
            className="bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
            📖 {t('greeting_journal_btn')}
          </Link>
          {hasBookingToday && (
            <Link href="/health-check"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
              ✅ {t('greeting_health_btn')}
            </Link>
          )}
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none pr-1"
            aria-label={t('a11y_close')}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WelcomeGreeting() {
  const [name, setName]                  = useState<string | null>(null);
  const [showBanner, setShowBanner]      = useState(true);
  const [hasBookingToday, setHasBooking] = useState(false);
  const [healthCheckFilled, setHCFilled] = useState(true);

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
    }
  }, []);

  if (name && showBanner) {
    if (hasBookingToday && !healthCheckFilled)
      return <MandatoryHealthBanner name={name} />;
    return <ReturnBanner name={name} hasBookingToday={hasBookingToday} onClose={() => setShowBanner(false)} />;
  }
  return null;
}
