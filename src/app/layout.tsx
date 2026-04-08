import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import SplashScreen from '@/components/SplashScreen';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.icing.co.il'),
  title: {
    default: 'ICING | סדנאות אמבטיות קרח מקצועיות – רחובות',
    template: 'ICING | %s',
  },
  description:
    'סדנאות טבילה במים קרים מבוססות מחקר, בליווי מדריכים מוסמכים CWI. ' +
    'ליחידים, זוגות וקבוצות. +127% נוראדרנלין, 500+ משתתפים מרוצים. הזמינו עכשיו.',
  keywords: [
    'אמבטיות קרח', 'טבילה במי קרח', 'cold water immersion', 'רחובות',
    'חוסן מנטלי', 'סדנאות קרח', 'ICING', 'CWI', 'Wim Hof', 'טבילה קרה',
  ],
  authors: [{ name: 'ICING' }],
  manifest: '/manifest.json',
  alternates: { canonical: 'https://www.icing.co.il' },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ICING',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.icing.co.il',
    locale: 'he_IL',
    siteName: 'ICING',
    title: 'ICING | סדנאות אמבטיות קרח',
    description: 'הירדמו לקרח, התעוררו חדים. סדנאות מקצועיות ומבוססות מחקר.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ICING – אמבטיות קרח' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICING | סדנאות אמבטיות קרח',
    description: 'הירדמו לקרח, התעוררו חדים. סדנאות מקצועיות ומבוססות מחקר.',
    images: ['/og-image.jpg'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "ICING — אמבטיות קרח",
              "description": "סדנאות טבילה במים קרים מבוססות מחקר",
              "url": "https://www.icing.co.il",
              "telephone": "08-9310715",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "רחוב סירני 52",
                "addressLocality": "רחובות",
                "addressCountry": "IL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 31.9006165,
                "longitude": 34.8199625
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens": "07:00",
                "closes": "20:00"
              },
              "priceRange": "₪300-₪800",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "500"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-navy-900 antialiased">
        <a href="#main-content"
           className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-ice-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:shadow-lg">
          דלג לתוכן הראשי
        </a>
        <SplashScreen />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <AccessibilityWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
