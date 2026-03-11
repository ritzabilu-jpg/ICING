import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'חוויות שוויץ המדע | אמבטיות קרח חולון',
    template: '%s | חוויות שוויץ המדע',
  },
  description:
    'סדנאות אמבטיות קרח מקצועיות ומדעיות בחולון. יחידים, זוגות וצוותים. ' +
    'בליווי מדריכים מוסמכים CWI. חיזוק חוסן מנטלי, שיפור פוקוס, הורדת סטרס.',
  keywords: [
    'אמבטיות קרח', 'טבילה במי קרח', 'cold water immersion', 'חולון',
    'חוסן מנטלי', 'סדנאות קרח', 'שוויץ המדע', 'CWI',
  ],
  authors: [{ name: 'חוויות שוויץ המדע' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'שוויץ המדע',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'חוויות שוויץ המדע',
    title: 'חוויות שוויץ המדע | אמבטיות קרח חולון',
    description: 'סדנאות אמבטיות קרח מקצועיות. נכנסים לקרח – יוצאים חדים וחסינים.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo-havayot.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-navy-900 antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
