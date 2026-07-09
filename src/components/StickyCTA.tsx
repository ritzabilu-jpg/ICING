'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import WhatsAppLink from '@/components/WhatsAppLink';

export default function StickyCTA() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden
                    bg-navy-900/95 backdrop-blur border-t border-ice-500/30
                    px-4 py-3 flex items-center gap-3">
      <Link
        href="/booking"
        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black
                   text-center py-3 rounded-xl text-base transition-colors shadow-lg shadow-orange-500/30"
      >
        {t('sticky_book')}
      </Link>
      <WhatsAppLink
        href="https://wa.me/972552482441"
        source="כפתור סטיקי תחתון"
        className="flex-shrink-0 bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold"
      >
        💬 {t('sticky_whatsapp')}
      </WhatsAppLink>
    </div>
  );
}
