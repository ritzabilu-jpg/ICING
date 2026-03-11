import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תשלום נכשל',
};

export default function PaymentFailedPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-3xl font-black text-navy-900 mb-4">התשלום לא הצליח</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        לצערנו, עיבוד התשלום נכשל. ההזמנה שלך שמורה במערכת וניתן לנסות שנית.
        אם הבעיה נמשכת, אנא צרו קשר בטלפון{' '}
        <a href="tel:089310715" className="text-ice-600 font-bold">08-9310715</a>.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/booking" className="btn-primary">נסו שנית</Link>
        <a href="tel:089310715" className="btn-outline">התקשרו אלינו</a>
      </div>
    </div>
  );
}
