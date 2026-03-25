'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

const navLinks = [
  { href: '/', label: 'בית' },
  { href: '/booking', label: 'הזמנת מקום' },
  { href: '/instructors', label: 'המדריכים שלנו' },
  { href: '/reviews', label: 'חוות דעת' },
  { href: '/#agenda', label: 'מה מחכה לכם' },
  { href: '/#contact', label: 'צור קשר' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [visitorRole, setVisitorRole] = useState<string>('user');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setVisitorName(localStorage.getItem('visitor_name'));
    setVisitorRole(localStorage.getItem('visitor_role') || 'user');
  }, []);

  function getDashboardHref(role: string) {
    if (role === 'admin') {
      const key = localStorage.getItem('admin_key') || '';
      return `/admin/lior?key=${encodeURIComponent(key)}`;
    }
    if (role === 'instructor') return '/instructor';
    return '/journal';
  }

  function handleLogin(id: string, name: string, role: string) {
    setVisitorName(name);
    setVisitorRole(role);
    setShowLogin(false);
    router.push(getDashboardHref(role));
  }

  function handleLogout() {
    localStorage.removeItem('visitor_id');
    localStorage.removeItem('visitor_name');
    localStorage.removeItem('visitor_role');
    localStorage.removeItem('admin_key');
    setVisitorName(null);
    setVisitorRole('user');
    router.push('/');
  }

  const isStaff = ['instructor', 'admin'].includes(visitorRole);
  const dashboardHref = getDashboardHref(visitorRole);

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy-900 shadow-xl border-b border-ice-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* RIGHT – CWI Ice logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/logo-ice.png" alt="Cold Water Immersion – CWI" width={80} height={52}
                className="object-contain h-10 md:h-12 w-auto" priority />
            </Link>

            {/* CENTER – Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`font-semibold text-sm xl:text-base transition-colors duration-150
                    ${pathname === link.href ? 'text-ice-400' : 'text-slate-200 hover:text-ice-400'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* LEFT – Login + Book CTA + Ice logo + Hamburger */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Login / User area */}
              {visitorName ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={dashboardHref}
                    className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-600 text-slate-200 hover:text-ice-400 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors">
                    <span className="text-ice-400">👤</span>
                    <span className="max-w-[100px] truncate">{visitorName}</span>
                    {isStaff && <span className="text-xs bg-ice-600 text-white px-1.5 py-0.5 rounded-full">{visitorRole === 'admin' ? 'מנהל' : 'מדריך'}</span>}
                  </Link>
                  <button onClick={handleLogout}
                    className="text-slate-400 hover:text-red-400 text-xs transition-colors px-1">
                    יציאה
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)}
                  className="hidden md:inline-flex items-center gap-1.5 bg-navy-700 hover:bg-navy-600 text-slate-200 hover:text-ice-400 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors border border-navy-600">
                  <span>🔑</span> כניסה
                </button>
              )}

              {/* Book CTAs – two separate buttons */}
              <Link href="/immersion"
                className="hidden md:inline-flex items-center gap-1 bg-ice-500 hover:bg-ice-600
                           text-white font-bold px-4 py-2 rounded-xl text-sm transition-all
                           hover:scale-105 shadow-lg shadow-ice-500/30">
                🧊 קבע טבילה
              </Link>
              <Link href="/booking"
                className="hidden md:inline-flex items-center gap-1 bg-navy-700 hover:bg-navy-600
                           text-white font-bold px-4 py-2 rounded-xl text-sm transition-all
                           hover:scale-105 border border-navy-500">
                🏔️ קבע סדנה
              </Link>

              {/* Mobile hamburger */}
              <button className="lg:hidden text-white p-2 rounded-lg hover:bg-navy-700 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'} aria-expanded={menuOpen}>
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="lg:hidden bg-navy-800 border-t border-navy-700 px-4 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-colors
                    ${pathname === link.href ? 'bg-ice-500/20 text-ice-400' : 'text-slate-200 hover:bg-navy-700 hover:text-ice-400'}`}>
                  {link.label}
                </Link>
              ))}
              {visitorName ? (
                <>
                  <Link href={dashboardHref} onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl font-semibold text-ice-400 hover:bg-navy-700 transition-colors">
                    👤 האזור האישי שלי
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="py-3 px-4 rounded-xl text-right font-semibold text-slate-400 hover:bg-navy-700 transition-colors">
                    יציאה
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="py-3 px-4 rounded-xl text-right font-semibold text-slate-200 hover:bg-navy-700 transition-colors">
                  🔑 כניסה למערכת
                </button>
              )}
              <Link href="/immersion" onClick={() => setMenuOpen(false)}
                className="mt-3 w-full text-center bg-ice-500 hover:bg-ice-600 text-white font-bold py-3 rounded-xl transition-all">
                🧊 קבע טבילה
              </Link>
              <Link href="/booking" onClick={() => setMenuOpen(false)}
                className="w-full text-center bg-navy-700 hover:bg-navy-600 text-white font-bold py-3 rounded-xl transition-all border border-navy-500">
                🏔️ קבע סדנה
              </Link>
            </div>
          </nav>
        )}
      </header>

      {showLogin && (
        <LoginModal
          initialName={localStorage.getItem('visitor_name') || ''}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
