import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הזמן סדנה | ICING רחובות',
  description:
    'הזמן סדנת אמבטיות קרח — סדנאות קבוצתיות, זוגיות ואישיות. ' +
    'בליווי מדריך מוסמך CWI. רחובות, סירני 52.',
  alternates: { canonical: 'https://icing.co.il/booking' },
  openGraph: {
    title: 'הזמן סדנת אמבטיות קרח | ICING',
    description: 'סדנאות קבוצתיות, זוגיות ואישיות בליווי מדריך מוסמך. הזמן עכשיו.',
    url: 'https://icing.co.il/booking',
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
