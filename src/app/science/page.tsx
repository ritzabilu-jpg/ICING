import type { Metadata } from 'next';
import ScienceContent from '@/components/ScienceContent';

export const metadata: Metadata = {
  title: 'המדע מאחורי טבילת מי קרח | ICING',
  description: 'הבסיס המדעי לטבילה במי קרח — נוראדרנלין, קורטיזול, דופמין, מערכת החיסון ועוד, עם סימוכין ממחקרים peer-reviewed',
};

export default function SciencePage() {
  return <ScienceContent />;
}
