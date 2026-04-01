'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Workshop, WorkshopType } from '@/types';
import WorkshopTypeSelector from '@/components/booking/WorkshopTypeSelector';
import CalendarView from '@/components/booking/CalendarView';
import StepIndicator from '@/components/booking/StepIndicator';
import OneOnOneContactForm from '@/components/booking/OneOnOneContactForm';
import ImmersionMultiBooking from '@/components/booking/ImmersionMultiBooking';

type BookingMode = 'immersions' | 'workshops' | null;
type BookingStep = 1 | 2;

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get('type') as WorkshopType | null;
  const instructorId = searchParams.get('instructorId') ?? undefined;

  const [mode, setMode] = useState<BookingMode>(null);
  const [step, setStep] = useState<BookingStep>(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<WorkshopType | null>(initialType);

  const isOneOnOne = selectedType === 'one-on-one';

  function resetMode() {
    setMode(null);
    setStep(1);
    setSelectedType(null);
  }

  // Mode selection screen
  if (mode === null) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-navy-900 text-center mb-2">הזמינו חוויה</h1>
        <p className="text-slate-500 text-center mb-10">בחרו את סוג הפעילות שמתאים לכם</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Immersions card */}
          <button
            onClick={() => setMode('immersions')}
            className="group flex flex-col items-center rounded-3xl border-2 border-ice-200 bg-white p-8 text-center
                       shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-ice-400 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-ice-300"
          >
            <div className="text-5xl mb-4">🧊</div>
            <h2 className="text-xl font-black text-navy-900 mb-2">טבילות</h2>
            <p className="text-slate-500 text-sm">בחר תאריכים עתידיים לטבילות במי הקרח</p>
            <div className="mt-6 bg-navy-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl
                            group-hover:bg-navy-700 transition-colors">
              בחר חבילה ותאריכים ›
            </div>
          </button>

          {/* Workshops card */}
          <button
            onClick={() => setMode('workshops')}
            className="group flex flex-col items-center rounded-3xl border-2 border-ice-200 bg-white p-8 text-center
                       shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-ice-400 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-ice-300"
          >
            <div className="text-5xl mb-4">🏔️</div>
            <h2 className="text-xl font-black text-navy-900 mb-2">סדנאות</h2>
            <p className="text-slate-500 text-sm">בחר מתוך סוגי הסדנאות השונים</p>
            <div className="mt-6 bg-navy-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl
                            group-hover:bg-navy-700 transition-colors">
              בחר סדנה ›
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Immersions mode
  if (mode === 'immersions') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <ImmersionMultiBooking onBack={resetMode} />
      </div>
    );
  }

  // Workshops mode
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={resetMode}
          className="text-sm text-ice-600 hover:text-ice-700 font-semibold border border-ice-200 rounded-xl px-3 py-1.5 hover:bg-ice-50 transition-colors"
        >
          ← שנה סוג
        </button>
      </div>

      <StepIndicator
        current={isOneOnOne ? 2 : step}
        labels={['בחרו סדנה', 'בחרו תאריך', 'פרטים ותשלום']}
      />

      {step === 1 && (
        <WorkshopTypeSelector
          onSelect={(type) => {
            setSelectedType(type);
            setStep(2);
          }}
        />
      )}

      {step === 2 && isOneOnOne && (
        <OneOnOneContactForm onBack={() => { setSelectedType(null); setStep(1); }} />
      )}

      {step === 2 && selectedType && !isOneOnOne && (
        <CalendarView
          type={selectedType}
          instructorId={instructorId}
          onSelect={(workshop: Workshop) => {
            router.push(`/checkout/workshop-${workshop.id}`);
          }}
          onBack={() => {
            setSelectedType(null);
            setStep(1);
          }}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-slate-400">
            <div className="w-10 h-10 border-2 border-ice-500 border-t-transparent
                            rounded-full animate-spin mx-auto mb-4" />
            <p>טוען...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
