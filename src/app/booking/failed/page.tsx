import type { Metadata } from 'next';
import PaymentFailedContent from '@/components/PaymentFailedContent';

export const metadata: Metadata = {
  title: 'תשלום נכשל',
};

export default function PaymentFailedPage() {
  return <PaymentFailedContent />;
}
