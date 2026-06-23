import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הזמן טבילה במי קרח | ICING רחובות',
  description:
    'הזמן מקום לטבילה במי קרח בליווי מדריך מוסמך CWI. ' +
    'כניסה בודדת, מנוי 5 כניסות או 10 כניסות. רחובות, סירני 52.',
  alternates: { canonical: 'https://icing.co.il/immersion' },
  openGraph: {
    title: 'הזמן טבילה במי קרח | ICING',
    description: 'כניסה בודדת ₪80 · מנוי 5 כניסות ₪350 · מנוי 10 כניסות ₪550. הזמן עכשיו.',
    url: 'https://icing.co.il/immersion',
  },
};

export default function ImmersionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
