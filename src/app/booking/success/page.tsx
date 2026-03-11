'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
      .catch(() => setError('שגיאה בטעינת פרטי ההזמנה'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const formatDateTime = (isoString: string) =>
    new Date(isoString).toLocaleString('he-IL', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent
                          rounded-full animate-spin mx-auto mb-4" />
          <p>טוען פרטי הזמנה...</p>
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
          ההזמנה אושרה!
        </h1>
        <p className="text-xl text-slate-500">
          {wasPaid
            ? 'התשלום התקבל בהצלחה. נשלח אישור למייל שלך.'
            : 'ההזמנה נקלטה בהצלחה. אישור נשלח למייל שלך.'
          }
        </p>
      </div>

      {booking && !error ? (
        <>
          {/* Confirmation code */}
          <div className="bg-navy-900 text-white rounded-3xl p-8 mb-6 text-center">
            <p className="text-slate-400 text-sm mb-2">קוד אישור ההזמנה שלך</p>
            <div className="text-4xl font-black text-ice-400 tracking-widest mb-2">
              {booking.confirmation_code}
            </div>
            <p className="text-slate-500 text-xs">שמרו קוד זה לצורך כניסה לסדנה</p>
          </div>

          {/* Booking details */}
          {booking.workshop && (
            <div className="bg-white rounded-3xl border-2 border-ice-100 p-6 mb-6 shadow-sm">
              <h2 className="font-black text-navy-900 text-lg mb-4">פרטי הסדנה</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">סדנה</span>
                  <span className="font-semibold text-navy-900">{booking.workshop.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">תאריך ושעה</span>
                  <span className="font-semibold text-navy-900 text-left text-xs">
                    {formatDateTime(booking.workshop.date_time)}
                  </span>
                </div>
                {booking.workshop.instructor && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">מדריך</span>
                    <span className="font-semibold text-navy-900">
                      {booking.workshop.instructor.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">משתתפים</span>
                  <span className="font-semibold text-navy-900">{booking.participants}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <span className="font-bold text-navy-900">סה&quot;כ</span>
                  <span className="font-black text-ice-600 text-lg">
                    ₪{booking.workshop.price * booking.participants}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What to bring */}
          <div className="bg-ice-50 rounded-3xl border border-ice-100 p-6 mb-6">
            <h2 className="font-black text-navy-900 mb-4">🧊 מה להביא לסדנה?</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                'בגד ים או בגד ספורט צמוד',
                'מגבת גדולה וחמה',
                'בגדים חמים להחלפה לאחר הסדנה',
                'שתייה חמה בתרמוס (אופציונלי)',
                'להגיע 10 דקות לפני תחילת הסדנה',
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
            <h2 className="font-black mb-4 text-ice-400">📍 מיקום</h2>
            <p className="text-slate-300 mb-1">רחוב סירני 52, חולון</p>
            <p className="text-slate-400 text-sm mb-4">מתחם הבריכה הטיפולית</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://waze.com/ul?ll=32.013,34.777&navigate=yes"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-navy-700 hover:bg-navy-600 text-white
                           py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                🗺️ נווט בWaze
              </a>
              <a
                href="https://maps.google.com/?q=רחוב+סירני+52+חולון"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-navy-700 hover:bg-navy-600 text-white
                           py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                📍 Google Maps
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 mb-8">
          <p>{error || 'לא ניתן לטעון פרטי הזמנה'}</p>
          <p className="text-sm mt-2">בדקו את תיבת המייל שלכם לאישור ההזמנה</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/booking"
          className="flex-1 text-center border-2 border-ice-300 text-ice-600 font-bold
                     py-3 rounded-2xl hover:bg-ice-50 transition-colors"
        >
          הזמינו סדנה נוספת
        </Link>
        <Link
          href="/"
          className="flex-1 text-center bg-navy-900 text-white font-bold
                     py-3 rounded-2xl hover:bg-navy-800 transition-colors"
        >
          חזרה לדף הבית
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
