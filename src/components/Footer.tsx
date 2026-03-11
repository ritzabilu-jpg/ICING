import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/logo-havayot.png"
                alt="חוויות שוויץ המדע"
                width={120}
                height={48}
                className="object-contain"
              />
              <Image
                src="/logo-ice.png"
                alt="CWI"
                width={60}
                height={48}
                className="object-contain"
              />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              מרכז הטבילה במי קרח. סדנאות מקצועיות ומדעיות לחיזוק חוסן מנטלי,
              שיפור פוקוס והורדת סטרס. בליווי מדריכים מוסמכים CWI.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-navy-700 hover:bg-ice-500 rounded-full flex items-center
                            justify-center transition-colors" aria-label="פייסבוק">
                <span className="text-lg">f</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-navy-700 hover:bg-ice-500 rounded-full flex items-center
                            justify-center transition-colors text-sm font-bold" aria-label="אינסטגרם">
                IG
              </a>
              <a href="https://wa.me/972893107150" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-navy-700 hover:bg-green-600 rounded-full flex items-center
                            justify-center transition-colors text-xs font-bold" aria-label="וואטסאפ">
                WA
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">ניווט מהיר</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'דף הבית' },
                { href: '/booking', label: 'הזמנת מקום' },
                { href: '/instructors', label: 'הצוות שלנו' },
                { href: '/#workshop-types', label: 'סוגי הסדנאות' },
                { href: '/#agenda', label: 'מה מחכה לכם' },
                { href: '/#faq', label: 'שאלות נפוצות' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                        className="text-slate-400 hover:text-ice-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">פרטי קשר</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-ice-400 mt-0.5">📍</span>
                <div>
                  <p className="text-slate-300">רחוב סירני 52, חולון</p>
                  <p className="text-slate-500 text-sm">מתחם הבריכה הטיפולית</p>
                </div>
              </li>
              <li>
                <a href="tel:089310715"
                   className="flex items-center gap-3 text-slate-300 hover:text-ice-400 transition-colors">
                  <span className="text-ice-400">📞</span>
                  08-9310715
                </a>
              </li>
              <li>
                <a href="tel:089310716"
                   className="flex items-center gap-3 text-slate-300 hover:text-ice-400 transition-colors">
                  <span className="text-ice-400">📞</span>
                  08-9310716
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/holon-sireni-52" target="_blank"
                   rel="noopener noreferrer"
                   className="text-ice-400 hover:text-ice-300 text-sm underline transition-colors">
                  פתח ב-Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-700 mt-12 pt-8 flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} חוויות שוויץ המדע. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              תנאי שימוש
            </Link>
            <Link href="/accessibility" className="hover:text-slate-300 transition-colors">
              נגישות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
