import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import WelcomeGreeting from '@/components/WelcomeGreeting';
import HomePageContent from '@/components/HomePageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ICING | סדנאות אמבטיות קרח מקצועיות – רחובות',
};

export default function HomePage() {
  return (
    <>
      <WelcomeGreeting />
      <Hero />
      <HomePageContent />
    </>
  );
}
