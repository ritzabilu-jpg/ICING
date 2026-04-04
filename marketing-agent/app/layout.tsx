import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ICING — Marketing Agent',
  description: 'ניהול לידים ושיווק',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc', color: '#1e293b' }}>
        {children}
      </body>
    </html>
  );
}
