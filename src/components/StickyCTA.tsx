'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyCTA() {
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
        הזמן מקום
      </Link>
      <a
        href="https://wa.me/972524500825"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold"
      >
        💬 וואטסאפ
      </a>
    </div>
  );
}
