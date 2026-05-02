'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PaymentFailedContent() {
  const { t } = useLanguage();
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-3xl font-black text-navy-900 mb-4">{t('failed_title')}</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        {t('failed_desc')}{' '}
        <a href="tel:089310715" className="text-ice-600 font-bold">08-9310715</a>.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/booking" className="btn-primary">{t('failed_retry')}</Link>
        <a href="tel:089310715" className="btn-outline">{t('failed_call')}</a>
      </div>
    </div>
  );
}
