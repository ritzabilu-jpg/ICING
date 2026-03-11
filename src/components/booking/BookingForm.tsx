'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Workshop } from '@/types';

interface BookingFormProps {
  workshop: Workshop;
  onBack: () => void;
}

const bookingSchema = z.object({
  user_name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים').max(100),
  email: z.string().email('כתובת מייל לא תקינה'),
  phone: z
    .string()
    .min(9, 'מספר טלפון לא תקין')
    .max(15)
    .regex(/^[\d+\-\s]+$/, 'מספר טלפון לא תקין'),
  participants: z.number().int().min(1, 'לפחות משתתף אחד'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const typeLabels: Record<string, string> = {
  individual: 'סדנת יחידים',
  couple: 'סדנת זוגות',
  team: 'סדנת קבוצות',
};

export default function BookingForm({ workshop, onBack }: BookingFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const maxParticipants = workshop.capacity - workshop.seats_taken;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: workshop.type === 'couple' ? 2 : 1,
    },
  });

  const participants = watch('participants');
  const totalPrice = workshop.price * (participants || 1);

  const formatDateTime = (isoString: string) =>
    new Date(isoString).toLocaleString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  async function onSubmit(formData: BookingFormData) {
    if (!agreed) {
      setServerError('יש לאשר את תנאי ההשתתפות');
      return;
    }
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshop_id: workshop.id,
          ...formData,
          participants: Number(formData.participants),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || 'שגיאה בהגשת ההזמנה');
        return;
      }

      // Redirect to health declaration form
      router.push(
        `/health-form?bookingId=${result.booking.id}&workshopId=${workshop.id}`
      );
    } catch {
      setServerError('שגיאת תקשורת. אנא בדקו את החיבור ונסו שנית.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors"
        >
          ← חזרה
        </button>
        <div>
          <h2 className="text-2xl font-black text-navy-900">שלב 3: פרטים ותשלום</h2>
          <p className="text-slate-500 text-sm">מלאו את פרטיכם להשלמת ההזמנה</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Full name */}
            <div>
              <label className="form-label">שם מלא *</label>
              <input
                {...register('user_name')}
                type="text"
                placeholder="ישראל ישראלי"
                className="input-field"
                autoComplete="name"
              />
              {errors.user_name && <p className="error-text">{errors.user_name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">כתובת מייל *</label>
              <input
                {...register('email')}
                type="email"
                placeholder="israel@example.com"
                className="input-field"
                autoComplete="email"
                dir="ltr"
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">טלפון *</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="050-0000000"
                className="input-field"
                autoComplete="tel"
                dir="ltr"
              />
              {errors.phone && <p className="error-text">{errors.phone.message}</p>}
            </div>

            {/* Participants */}
            {workshop.type !== 'couple' && (
              <div>
                <label className="form-label">מספר משתתפים *</label>
                <select
                  {...register('participants', { valueAsNumber: true })}
                  className="input-field"
                >
                  {[...Array(Math.min(maxParticipants, workshop.type === 'individual' ? 10 : 20))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                {errors.participants && (
                  <p className="error-text">{errors.participants.message}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  נותרו {maxParticipants} מקומות בסדנה זו
                </p>
              </div>
            )}

            {/* Terms */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 text-ice-500
                             focus:ring-ice-400 focus:ring-offset-0 flex-shrink-0"
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  אני מאשר/ת שקראתי את{' '}
                  <a href="/terms" target="_blank" className="text-ice-600 underline">תנאי ההשתתפות</a>
                  {' '}ואת{' '}
                  <a href="/privacy" target="_blank" className="text-ice-600 underline">מדיניות הביטולים</a>.
                  {' '}אמלא טופס הצהרת בריאות בשלב הבא לפני השלמת ההזמנה.
                </span>
              </label>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !agreed}
              className="w-full bg-ice-500 hover:bg-ice-600 disabled:bg-slate-300
                         disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl
                         text-lg transition-all hover:scale-105 disabled:hover:scale-100
                         shadow-lg shadow-ice-500/30 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  שולח הזמנה...
                </>
              ) : (
                <>
                  המשיכו למילוי טופס בריאות ←
                </>
              )}
            </button>
          </form>
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-navy-900 rounded-3xl p-6 text-white sticky top-24">
            <h3 className="font-black text-lg mb-5 text-ice-400">סיכום ההזמנה</h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">סוג הסדנה</span>
                <span className="font-semibold">{typeLabels[workshop.type] || workshop.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">תאריך ושעה</span>
                <span className="font-semibold text-left text-xs">
                  {formatDateTime(workshop.date_time)}
                </span>
              </div>
              {workshop.instructor && (
                <div className="flex justify-between">
                  <span className="text-slate-400">מדריך</span>
                  <span className="font-semibold">{workshop.instructor.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">משתתפים</span>
                <span className="font-semibold">{participants || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">מחיר ליחיד</span>
                <span className="font-semibold">₪{workshop.price}</span>
              </div>
            </div>

            <div className="border-t border-navy-700 pt-4 flex justify-between items-center">
              <span className="font-bold text-slate-300">סה&quot;כ</span>
              <span className="text-3xl font-black text-ice-400">₪{totalPrice}</span>
            </div>

            <div className="mt-4 bg-ice-500/10 rounded-xl p-3 text-xs text-ice-300 border border-ice-500/20">
              💳 תשלום יבוצע לאחר מילוי טופס הצהרת בריאות
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
