'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function SuccessContent() {
  const { t } = useLanguage();
  const sp = useSearchParams();
  const bookingId = sp.get('bookingId') ?? '';
  const paid = sp.get('paid') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{paid ? '🧊' : '📋'}</div>

        <h1 className="text-2xl font-black text-navy-900 mb-2">
          {paid ? t('csuccess_paid_title') : t('csuccess_pending_title')}
        </h1>

        <p className="text-slate-600 mb-6">
          {paid ? t('csuccess_paid_desc') : t('csuccess_pending_desc')}
        </p>

        {bookingId && (
          <div className="bg-ice-50 border border-ice-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">{t('csuccess_order_num')}</p>
            <p className="font-mono text-navy-900 font-bold text-sm break-all">{bookingId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-ice-600 hover:bg-ice-700 text-white font-black py-3 rounded-2xl transition-colors"
          >
            {t('csuccess_home')}
          </Link>
          <Link
            href="/immersion"
            className="block w-full border-2 border-ice-300 text-ice-700 hover:bg-ice-50 font-bold py-3 rounded-2xl transition-colors"
          >
            {t('csuccess_book_more')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-ice-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
