'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const LOCALE_MAP: Record<string, string> = {
  he: 'he-IL', en: 'en-US', ar: 'ar-SA', ru: 'ru-RU',
};

interface BookingData {
  id: string;
  confirmation_code: string;
  user_name: string;
  participants: number;
  status: string;
  workshop?: {
    title: string;
    type: string;
    date_time: string;
    price: number;
    instructor?: { name: string };
  };
}

function SuccessContent() {
  const { t, lang } = useLanguage();
  const locale = LOCALE_MAP[lang] ?? 'he-IL';
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const wasPaid = searchParams.get('paid') === 'true';

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    fetch(`/api/bookings?id=${bookingId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setBooking(data);
      })
      .catch(() => setError(t('bsuccess_load_error')))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const formatDateTime = (isoString: string) =>
    new Date(isoString).toLocaleString(locale, {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent
                          rounded-full animate-spin mx-auto mb-4" />
          <p>{t('bsuccess_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center
                        mx-auto mb-6 text-5xl">
          ✅
        </div>
        <h1 className="text-4xl font-black text-navy-900 mb-3">
          {t('bsuccess_title')}
        </h1>
        <p className="text-xl text-slate-500">
          {wasPaid ? t('bsuccess_paid_sub') : t('bsuccess_pending_sub')}
        </p>
      </div>

      {booking && !error ? (
        <>
          {/* Confirmation code */}
          <div className="bg-navy-900 text-white rounded-3xl p-8 mb-6 text-center">
            <p className="text-slate-400 text-sm mb-2">{t('bsuccess_code_label')}</p>
            <div className="text-4xl font-black text-ice-400 tracking-widest mb-2">
              {booking.confirmation_code}
            </div>
            <p className="text-slate-500 text-xs">{t('bsuccess_code_save')}</p>
          </div>

          {/* Booking details */}
          {booking.workshop && (
            <div className="bg-white rounded-3xl border-2 border-ice-100 p-6 mb-6 shadow-sm">
              <h2 className="font-black text-navy-900 text-lg mb-4">{t('bsuccess_details_title')}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('bsuccess_workshop_col')}</span>
                  <span className="font-semibold text-navy-900">{booking.workshop.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('bsuccess_datetime_col')}</span>
                  <span className="font-semibold text-navy-900 text-left text-xs">
                    {formatDateTime(booking.workshop.date_time)}
                  </span>
                </div>
                {booking.workshop.instructor && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('bsuccess_instructor_col')}</span>
                    <span className="font-semibold text-navy-900">
                      {booking.workshop.instructor.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('bsuccess_participants_col')}</span>
                  <span className="font-semibold text-navy-900">{booking.participants}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <span className="font-bold text-navy-900">{t('bsuccess_total_col')}</span>
                  <span className="font-black text-ice-600 text-lg">
                    ₪{booking.workshop.price * booking.participants}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What to bring */}
          <div className="bg-ice-50 rounded-3xl border border-ice-100 p-6 mb-6">
            <h2 className="font-black text-navy-900 mb-4">🧊 {t('bsuccess_bring_title')}</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                t('bsuccess_bring1'), t('bsuccess_bring2'), t('bsuccess_bring3'),
                t('bsuccess_bring4'), t('bsuccess_bring5'),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-ice-500 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="bg-navy-900 text-white rounded-3xl p-6 mb-8">
            <h2 className="font-black mb-4 text-ice-400">📍 {t('bsuccess_location_title')}</h2>
            <p className="text-slate-300 mb-1">{t('bsuccess_address')}</p>
            <p className="text-slate-400 text-sm mb-4">{t('bsuccess_complex')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://waze.com/ul?ll=31.9006165,34.8199625&navigate=yes"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-navy-700 hover:bg-navy-600 text-white
                           py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                🗺️ {t('bsuccess_waze')}
              </a>
              <a
                href="https://maps.google.com/?q=רחוב+סירני+52+רחובות"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-navy-700 hover:bg-navy-600 text-white
                           py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                📍 {t('bsuccess_gmaps')}
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 mb-8">
          <p>{error || t('bsuccess_load_error')}</p>
          <p className="text-sm mt-2">{t('bsuccess_check_email')}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/booking"
          className="flex-1 text-center border-2 border-ice-300 text-ice-600 font-bold
                     py-3 rounded-2xl hover:bg-ice-50 transition-colors"
        >
          {t('bsuccess_book_another')}
        </Link>
        <Link
          href="/"
          className="flex-1 text-center bg-navy-900 text-white font-bold
                     py-3 rounded-2xl hover:bg-navy-800 transition-colors"
        >
          {t('bsuccess_home')}
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent
                          rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
