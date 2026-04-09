'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

interface ImmersionSummary {
  next_date: string | null;
  next_time: string | null;
  sessions_remaining: number | null;
  sessions_total: number;
}

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

const navLinks = [
  { href: '/', label: 'בית' },
  { href: '/booking', label: 'הזמנת מקום' },
  { href: '/instructors', label: 'המדריכים שלנו' },
  { href: '/science', label: 'המדע' },
  { href: '/reviews', label: 'חוות דעת' },
  { href: '/#contact', label: 'צור קשר' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [visitorRole, setVisitorRole] = useState<string>('user');
  const [immersionSummary, setImmersionSummary] = useState<ImmersionSummary | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Accessibility state
  const [a11yOpen, setA11yOpen] = useState(false);
  const [fontSize, setFontSize] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [underline, setUnderline] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('a11y');
    if (saved) {
      const p = JSON.parse(saved);
      setFontSize(p.fontSize ?? 0);
      setContrast(p.contrast ?? false);
      setUnderline(p.underline ?? false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = fontSize === 0 ? '' : fontSize === 1 ? '110%' : '125%';
    contrast ? root.classList.add('a11y-contrast') : root.classList.remove('a11y-contrast');
    underline ? root.classList.add('a11y-underline') : root.classList.remove('a11y-underline');
    localStorage.setItem('a11y', JSON.stringify({ fontSize, contrast, underline }));
  }, [fontSize, contrast, underline]);

  useEffect(() => {
    const name = localStorage.getItem('visitor_name');
    const role = localStorage.getItem('visitor_role') || 'user';
    const vid = localStorage.getItem('visitor_id');
    setVisitorName(name);
    setVisitorRole(role);

    if (vid && role === 'user') {
      fetch(`/api/visitor/immersion-summary?vid=${vid}`)
        .then(r => r.ok ? r.json() : null)
        .then((d: ImmersionSummary | null) => { if (d) setImmersionSummary(d); })
        .catch(() => {});
    }
  }, []);

  function getDashboardHref(role: string) {
    if (role === 'admin') {
      const key = localStorage.getItem('admin_key') || '';
      return `/admin/lior?key=${encodeURIComponent(key)}`;
    }
    if (role === 'instructor') return '/instructor/dashboard';
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

  // Shared icon button classes
  const iconBtn = 'flex items-center justify-center w-9 h-9 rounded-xl bg-navy-700 hover:bg-navy-600 text-white transition-colors border border-navy-600';

  return (
    <>
      {/* Global accessibility styles */}
      <style>{`
        .a11y-contrast { filter: contrast(1.5) !important; background: #000 !important; color: #fff !important; }
        .a11y-underline a { text-decoration: underline !important; }
      `}</style>

      <header className="sticky top-0 z-50 bg-navy-900 shadow-xl border-b border-ice-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* RIGHT – CWI Ice logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/ICINGLOGO-icon.png" alt="ICING" width={88} height={88}
                className="object-contain h-[68px] md:h-[82px] w-auto rounded-full" priority />
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

            {/* LEFT – Login + Book CTA + WhatsApp + A11y + Hamburger */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Login / User area */}
              {visitorName ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={dashboardHref}
                    className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-600 text-slate-200 hover:text-ice-400 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors">
                    <span className="text-ice-400">👤</span>
                    <span className="max-w-[100px] truncate">{visitorName}</span>
                    {isStaff && <span className="text-xs bg-ice-600 text-white px-1.5 py-0.5 rounded-full">{visitorRole === 'admin' ? 'מנהל' : 'מדריך'}</span>}
                    {!isStaff && immersionSummary?.next_date && (
                      <span className="flex items-center gap-1 text-xs bg-ice-900/60 text-ice-300 border border-ice-700/40 px-2 py-0.5 rounded-full">
                        🧊 {formatShortDate(immersionSummary.next_date)}
                        {immersionSummary.sessions_remaining !== null && (
                          <span className="text-ice-400 font-bold">· נשארו {immersionSummary.sessions_remaining}</span>
                        )}
                      </span>
                    )}
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

              {/* WhatsApp icon */}
              <a href="https://wa.me/972524500825" target="_blank" rel="noopener noreferrer"
                aria-label="וואטסאפ"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-600 hover:bg-slate-500 text-white transition-colors shadow-md shadow-slate-900/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.67 4.797 1.836 6.789L2 30l7.418-1.812A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.608l-.422-.25-4.402 1.074 1.115-4.29-.276-.44A11.56 11.56 0 0 1 4.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.338-8.655c-.347-.174-2.055-1.013-2.374-1.129-.32-.116-.552-.174-.784.174-.232.347-.9 1.129-1.103 1.361-.202.232-.405.26-.752.087-.347-.174-1.466-.54-2.791-1.722-1.032-.92-1.728-2.056-1.93-2.403-.203-.347-.022-.534.152-.707.157-.155.347-.405.52-.608.174-.202.232-.347.347-.578.116-.232.058-.434-.029-.608-.087-.174-.784-1.89-1.074-2.588-.283-.679-.57-.587-.784-.598l-.668-.011c-.232 0-.608.087-.926.434-.319.347-1.218 1.19-1.218 2.9s1.247 3.363 1.42 3.595c.174.232 2.455 3.748 5.949 5.256.831.359 1.48.573 1.985.734.834.266 1.594.228 2.194.138.669-.1 2.055-.84 2.345-1.652.29-.811.29-1.507.203-1.652-.087-.144-.319-.232-.666-.405z"/>
                </svg>
              </a>

              {/* Accessibility button + dropdown panel */}
              <div className="relative">
                <button
                  onClick={() => setA11yOpen(o => !o)}
                  aria-label="פתח תפריט נגישות"
                  aria-expanded={a11yOpen}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-700 hover:bg-blue-600 text-white transition-colors shadow-md shadow-blue-900/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white" className="w-4 h-4" aria-hidden="true">
                    <circle cx="60" cy="12" r="10"/>
                    <path d="M83 64H69L63 41a5 5 0 0 0-5-4H40a5 5 0 0 0-5 5v20a5 5 0 0 0 10 0V47h9l6 23a5 5 0 0 0 5 4h18a5 5 0 0 0 0-10z"/>
                    <path d="M51 68a18 18 0 1 1-18-18v-10a28 28 0 1 0 28 28h-10z"/>
                  </svg>
                </button>

                {a11yOpen && (
                  <div
                    role="dialog"
                    aria-label="תפריט נגישות"
                    dir="rtl"
                    className="absolute top-full mt-2 left-0 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-black text-navy-900 text-base">אפשרויות נגישות</h2>
                      <button onClick={() => setA11yOpen(false)} aria-label="סגור"
                        className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">גודל טקסט</p>
                      <div className="flex gap-2">
                        {[{ label: 'רגיל', val: 0 }, { label: 'גדול', val: 1 }, { label: 'גדול מאוד', val: 2 }].map(opt => (
                          <button key={opt.val} onClick={() => setFontSize(opt.val)}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors
                              ${fontSize === opt.val ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <button onClick={() => setContrast(c => !c)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
                          ${contrast ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
                        <span>ניגודיות גבוהה</span><span>{contrast ? '✓' : ''}</span>
                      </button>
                      <button onClick={() => setUnderline(u => !u)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors
                          ${underline ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}>
                        <span>הדגשת קישורים</span><span>{underline ? '✓' : ''}</span>
                      </button>
                    </div>
                    <button onClick={() => { setFontSize(0); setContrast(false); setUnderline(false); }}
                      className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline transition-colors mb-3">
                      איפוס הגדרות
                    </button>
                    <div className="border-t border-slate-100 pt-3 space-y-1">
                      <Link href="/accessibility" onClick={() => setA11yOpen(false)}
                        className="block text-sm text-blue-700 hover:underline">הצהרת נגישות</Link>
                      <a href="tel:089310715" className="block text-sm text-blue-700 hover:underline">
                        פנייה בנושא נגישות: 08-9310715
                      </a>
                    </div>
                  </div>
                )}
              </div>

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
