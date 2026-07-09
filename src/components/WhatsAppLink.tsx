'use client';

import { trackWhatsApp } from '@/lib/trackWhatsApp';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  source: string;
  extras?: { name?: string; phone?: string; extra?: string };
}

export default function WhatsAppLink({ source, extras, onClick, children, ...rest }: Props) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
      onClick={e => {
        trackWhatsApp(source, extras);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
