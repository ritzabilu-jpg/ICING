import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import WelcomeGreeting from '@/components/WelcomeGreeting';
import HomePageContent from '@/components/HomePageContent';
import TestimonialsSection from '@/components/TestimonialsSection';
import AccordionSection from '@/components/AccordionSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ICING | סדנאות אמבטיות קרח מקצועיות – רחובות',
};

export default function HomePage() {
  const testimonialsSlot = (
    <section id="testimonials" className="bg-ice-50 border-b border-slate-100">
      <AccordionSection title="מה אומרים המשתתפים" fadeColor="#f0f9ff" defaultOpen>
        <div className="pb-4">
          <TestimonialsSection />
        </div>
      </AccordionSection>
    </section>
  );

  return (
    <>
      <WelcomeGreeting />
      <Hero />
      <HomePageContent testimonialsSlot={testimonialsSlot} />
    </>
  );
}
