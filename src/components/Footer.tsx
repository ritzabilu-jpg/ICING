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
                src="/ICINGLOGO.png"
                alt="ICING"
                width={64}
                height={64}
                className="object-contain rounded-full"
              />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              מרכז הטבילה במי קרח. סדנאות מקצועיות ומדעיות לחיזוק חוסן מנטלי,
              שיפור פוקוס והורדת סטרס. בליווי מדריכים מוסמכים CWI.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.tiktok.com/@kallklarhet" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 overflow-hidden rounded-full hover:scale-110 transition-transform" aria-label="טיקטוק">
                <img src="/logo-tiktok.jpg" alt="TikTok" className="w-full h-full object-cover" />
              </a>
              <a href="https://www.facebook.com/groups/1581316102106335" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 overflow-hidden rounded-full hover:scale-110 transition-transform" aria-label="פייסבוק">
                <img src="/logo-facebook.png" alt="Facebook" className="w-full h-full object-cover" />
              </a>
              <a href="https://www.instagram.com/cwirehovot/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 overflow-hidden rounded-full hover:scale-110 transition-transform" aria-label="אינסטגרם">
                <img src="/logo-instagram.jpg" alt="Instagram" className="w-full h-full object-cover" />
              </a>
              <a href="https://wa.me/972524500825" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 overflow-hidden rounded-full hover:scale-110 transition-transform" aria-label="וואטסאפ">
                <img src="/logo-whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover" />
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
                  <p className="text-slate-300">רחוב סירני 52, רחובות</p>
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
                <a href="https://maps.app.goo.gl/c5DjBoYrSFTZnYwF8" target="_blank"
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
