import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'צור קשר | ICING רחובות',
  description:
    'צור קשר עם צוות ICING — אמבטיות קרח רחובות. ' +
    'טלפון: 08-9310715. כתובת: סירני 52, רחובות.',
  alternates: { canonical: 'https://icing.co.il/contact' },
  openGraph: {
    title: 'צור קשר | ICING',
    description: 'יש לך שאלה? נשמח לעזור. 08-9310715 · סירני 52, רחובות.',
    url: 'https://icing.co.il/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
