'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'בית' },
  { href: '/booking', label: 'הזמנת מקום' },
  { href: '/instructors', label: 'המדריכים שלנו' },
  { href: '/#agenda', label: 'מה מחכה לכם' },
  { href: '/#contact', label: 'צור קשר' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-xl border-b border-ice-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* RIGHT side – Havayot logo (RTL: first child = right) */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo-havayot.png"
              alt="חוויות שוויץ המדע"
              width={130}
              height={52}
              className="object-contain h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* CENTER – Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm xl:text-base transition-colors duration-150
                  ${pathname === link.href
                    ? 'text-ice-400'
                    : 'text-slate-200 hover:text-ice-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* LEFT side – CWI/Ice logo + Book CTA + Mobile menu (RTL: last child = left) */}
          <div className="flex items-center gap-3">
            {/* CTA button – desktop only */}
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center bg-ice-500 hover:bg-ice-600
                         text-white font-bold px-5 py-2 rounded-xl text-sm transition-all
                         hover:scale-105 shadow-lg shadow-ice-500/30"
            >
              הזמינו עכשיו
            </Link>

            {/* Ice/CWI logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo-ice.png"
                alt="Cold Water Immersion – CWI"
                width={70}
                height={52}
                className="object-contain h-10 md:h-12 w-auto"
                priority
              />
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-navy-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={menuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300
                  ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all duration-300
                  ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300
                  ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="lg:hidden bg-navy-800 border-t border-navy-700 px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-4 rounded-xl font-semibold transition-colors
                  ${pathname === link.href
                    ? 'bg-ice-500/20 text-ice-400'
                    : 'text-slate-200 hover:bg-navy-700 hover:text-ice-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="mt-3 w-full text-center bg-ice-500 hover:bg-ice-600 text-white
                         font-bold py-3 rounded-xl transition-all"
            >
              הזמינו מקום עכשיו
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
