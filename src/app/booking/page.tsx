'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Workshop, WorkshopType } from '@/types';
import WorkshopTypeSelector from '@/components/booking/WorkshopTypeSelector';
import CalendarView from '@/components/booking/CalendarView';
import BookingForm from '@/components/booking/BookingForm';
import StepIndicator from '@/components/booking/StepIndicator';
import OneOnOneContactForm from '@/components/booking/OneOnOneContactForm';
import LiorSlotBooking from '@/components/booking/LiorSlotBooking';

type BookingStep = 1 | 2 | 3;

function BookingContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as WorkshopType | null;
  const instructorId = searchParams.get('instructorId') ?? undefined;

  const [step, setStep] = useState<BookingStep>(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<WorkshopType | null>(initialType);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const isOneOnOne = selectedType === 'one-on-one';
  const isLiorSlots = selectedType === 'lior-slots';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <StepIndicator
        current={isOneOnOne || isLiorSlots ? 2 : step}
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

      {step === 2 && isLiorSlots && (
        <LiorSlotBooking onBack={() => { setSelectedType(null); setStep(1); }} />
      )}

      {step === 2 && selectedType && !isOneOnOne && !isLiorSlots && (
        <CalendarView
          type={selectedType}
          instructorId={instructorId}
          onSelect={(workshop) => {
            setSelectedWorkshop(workshop);
            setStep(3);
          }}
          onBack={() => {
            setSelectedType(null);
            setStep(1);
          }}
        />
      )}

      {step === 3 && selectedWorkshop && (
        <BookingForm
          workshop={selectedWorkshop}
          onBack={() => {
            setSelectedWorkshop(null);
            setStep(2);
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
