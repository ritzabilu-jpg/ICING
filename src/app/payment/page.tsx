'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const PHONE = '089310715';

function PaymentContent() {
  const { t } = useLanguage();
  const sp = useSearchParams();
  const bookingId = sp.get('bookingId') ?? '';
  const total     = sp.get('total')     ?? '0';
  const name      = sp.get('name')      ?? '';
  const email     = sp.get('email')     ?? '';
  const phone     = sp.get('phone')     ?? '';
  const type      = sp.get('type')      ?? '';
  const date      = sp.get('date')      ?? '';

  const tranzilaUrl = bookingId
    ? `https://direct.tranzila.com/${process.env.NEXT_PUBLIC_TRANZILA_SUPPLIER ?? 'icing'}/iframenew.php?` +
      new URLSearchParams({
        sum: total,
        currency: '1',
        tranmode: 'A',
        nologo: '1',
        lang: 'heb',
        cred_type: '1',
        email,
        contact: name,
        pdesc: `טבילה/סדנה – ${type}`,
        successUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://icing.co.il'}/booking/success?id=${bookingId}&paid=true`,
        failUrl: `${typeof window !== 'undefined' ? window.location.origin : 'https://icing.co.il'}/booking/failed?id=${bookingId}`,
      }).toString()
    : '#';

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💳</div>
          <h1 className="text-3xl font-black text-[#0f2942]">{t('payment_title')}</h1>
          {date && <p className="text-slate-500 mt-1 text-sm">{type} · {date}</p>}
        </div>

        {/* Total badge */}
        <div className="bg-[#0f2942] text-white rounded-2xl px-6 py-4 text-center mb-8 shadow-lg">
          <p className="text-slate-400 text-sm mb-1">{t('payment_amount')}</p>
          <p className="text-4xl font-black text-cyan-400">₪{total}</p>
          {name && <p className="text-slate-300 text-sm mt-1">{name}</p>}
        </div>

        {/* Phone only */}
        <div className="space-y-4">
          <a href={`tel:${PHONE}`}
            className="flex items-center gap-4 bg-white border-2 border-slate-200 hover:border-green-500 rounded-2xl px-6 py-5 transition-all hover:shadow-md group">
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
              📞
            </div>
            <div className="flex-1">
              <p className="font-black text-[#0f2942] text-lg">{t('payment_phone')}</p>
              <p className="text-slate-400 text-sm">{PHONE.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')}</p>
            </div>
            <span className="text-slate-300 group-hover:text-green-500 text-xl transition-colors">←</span>
          </a>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link href="/booking" className="text-slate-400 hover:text-slate-600 text-sm underline">
            {t('payment_back')}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
