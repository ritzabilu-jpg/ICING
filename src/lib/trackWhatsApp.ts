export function trackWhatsApp(source: string, extras?: { name?: string; phone?: string; extra?: string }) {
  const page = typeof window !== 'undefined' ? window.location.pathname : undefined;
  fetch('/api/track/whatsapp-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, page, ...extras }),
  }).catch(() => {});
}
