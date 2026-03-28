import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccessibilityWidget from '@/components/AccessibilityWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://icing-blond.vercel.app'),
  title: {
    default: 'ICING - CWI - טבילה במי קרח',
    template: 'ICING | %s',
  },
  description:
    'סדנאות אמבטיות קרח מקצועיות ומדעיות ברחובות. יחידים, זוגות וצוותים. ' +
    'בליווי מדריכים מוסמכים CWI. חיזוק חוסן מנטלי, שיפור פוקוס, הורדת סטרס.',
  keywords: [
    'אמבטיות קרח', 'טבילה במי קרח', 'cold water immersion', 'רחובות',
    'חוסן מנטלי', 'סדנאות קרח', 'ICING', 'CWI',
  ],
  authors: [{ name: 'ICING' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ICING',
  },
  openGraph: {
    type: 'website',
    url: 'https://icing-blond.vercel.app',
    locale: 'he_IL',
    siteName: 'ICING',
    title: 'ICING | אמבטיות קרח',
    description: 'סדנאות אמבטיות קרח מקצועיות. נכנסים לקרח – יוצאים חדים וחסינים.',
    images: [
      {
        url: 'https://icing-blond.vercel.app/logo-ice.png',
        alt: 'ICING – אמבטיות קרח רחובות',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICING | אמבטיות קרח',
    description: 'סדנאות אמבטיות קרח מקצועיות. נכנסים לקרח – יוצאים חדים וחסינים.',
    images: ['https://icing-blond.vercel.app/logo-ice.png'],
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
        <link rel="apple-touch-icon" href="/logo-ice.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-navy-900 antialiased">
        <a href="#main-content"
           className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-ice-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:shadow-lg">
          דלג לתוכן הראשי
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
