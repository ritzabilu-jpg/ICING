'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2800);
    const hideTimer = setTimeout(() => setVisible(false), 3200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-400"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <Image
        src="/ICINGLOGO.png"
        alt="ICING"
        width={220}
        height={220}
        className="w-48 h-48 md:w-64 md:h-64 object-contain"
        priority
      />
    </div>
  );
}
