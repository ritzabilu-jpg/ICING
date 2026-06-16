import type { Metadata } from 'next';
import { Suspense } from 'react';
import HealthConsentForm from '@/components/health-consent/HealthConsentForm';
import { ICING_BUSINESS } from '@/lib/health-consent-config';

export const metadata: Metadata = {
  title: `שאלון בריאות והסכמה מדעת | ${ICING_BUSINESS.name}`,
  description: 'מילוי שאלון בריאות והצהרת משתתף לפני טבילה במי קרח ב-ICING.CO.IL',
  robots: { index: false, follow: false }, // keep medical form off search engines
};

export default function HealthConsentPage() {
  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <HealthConsentForm />
      </Suspense>
    </main>
  );
}
