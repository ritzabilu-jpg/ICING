'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';

const healthSchema = z.object({
  participant_name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים').max(100),
  has_heart_condition: z.boolean(),
  has_hypertension: z.boolean(),
  is_pregnant: z.boolean(),
  has_raynauds: z.boolean(),
  has_open_wounds: z.boolean(),
  other_conditions: z.string().max(500).default(''),
});

type HealthFormData = z.infer<typeof healthSchema>;

const contraindications = [
  {
    name: 'has_heart_condition' as const,
    label: 'מחלת לב, הפרעות קצב, או ניתוח לב בעבר',
    severity: 'high',
  },
  {
    name: 'is_pregnant' as const,
    label: 'הריון (בכל שלב)',
    severity: 'high',
  },
  {
    name: 'has_raynauds' as const,
    label: 'תסמונת ריינו (Raynaud\'s Syndrome)',
    severity: 'high',
  },
  {
    name: 'has_hypertension' as const,
    label: 'לחץ דם גבוה לא מטופל',
    severity: 'medium',
  },
  {
    name: 'has_open_wounds' as const,
    label: 'פצעים פתוחים, זיהומים בעור, או אקזמה חמורה',
    severity: 'medium',
  },
];

function HealthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [doctorRequired, setDoctorRequired] = useState<string[] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthFormData>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      has_heart_condition: false,
      has_hypertension: false,
      is_pregnant: false,
      has_raynauds: false,
      has_open_wounds: false,
      other_conditions: '',
    },
  });

  async function onSubmit(data: HealthFormData) {
    setSubmitting(true);
    setServerError(null);
    setDoctorRequired(null);

    try {
      const res = await fetch('/api/health-declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          booking_id: bookingId,
          signature: 'confirmed',
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.requiresDoctorApproval) {
          setDoctorRequired(result.conditions ?? []);
        } else {
          setServerError(result.error || 'שגיאה בשמירת הטופס');
        }
        return;
      }

      router.push(`/booking/success?id=${bookingId}`);
    } catch {
      setServerError('שגיאת תקשורת. אנא בדקו את החיבור ונסו שנית.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!bookingId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-navy-900 mb-3">קישור לא תקין</h1>
        <p className="text-slate-500 mb-6">לא נמצא מזהה הזמנה. אנא חזרו לדף ההזמנות.</p>
        <a href="/booking" className="btn-primary">חזרה להזמנות</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏥</div>
        <h1 className="text-3xl font-black text-navy-900 mb-2">הצהרת בריאות</h1>
        <p className="text-slate-500 leading-relaxed max-w-lg mx-auto">
          מסמך זה נדרש לפני כל השתתפות בסדנה. המידע נשמר בסודיות מלאה ומוגן
          בהתאם לחוק הגנת הפרטיות.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Name */}
        <div>
          <label className="form-label">שם מלא של המשתתף *</label>
          <input
            {...register('participant_name')}
            type="text"
            placeholder="ישראל ישראלי"
            className="input-field"
            autoComplete="name"
          />
          {errors.participant_name && (
            <p className="error-text">{errors.participant_name.message}</p>
          )}
        </div>

        {/* Contraindications */}
        <div className="rounded-2xl overflow-hidden border-2 border-red-200">
          <div className="bg-red-50 px-5 py-4 border-b border-red-200">
            <h2 className="font-bold text-red-800 text-base">
              ⚠️ סמנו אם אחד מהמצבים הבאים חל עליכם:
            </h2>
            <p className="text-red-600 text-xs mt-1">
              מצבים אלה עלולים להוות סיכון בטבילה במי קרח. נא לציין בכנות.
            </p>
          </div>
          <div className="p-5 space-y-3 bg-white">
            {contraindications.map(c => (
              <label key={c.name}
                     className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg
                                hover:bg-red-50 transition-colors">
                <input
                  {...register(c.name)}
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 rounded border-red-300 text-red-500
                             focus:ring-red-400 focus:ring-offset-0 flex-shrink-0"
                />
                <div>
                  <span className="text-slate-700 font-medium text-sm">{c.label}</span>
                  {c.severity === 'high' && (
                    <span className="ms-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                      גבוה
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Other conditions */}
        <div>
          <label className="form-label">מצבים רפואיים נוספים (אופציונלי)</label>
          <textarea
            {...register('other_conditions')}
            placeholder="ציינו כאן כל מצב רפואי נוסף שנראה לכם רלוונטי..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Doctor required warning */}
        {doctorRequired && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
            <h3 className="font-bold text-red-800 mb-2">⛔ נדרש אישור רופא</h3>
            <p className="text-red-700 text-sm mb-3">
              סימנתם מצבים המחייבים אישור רופא לפני השתתפות:
            </p>
            <ul className="text-red-700 text-sm list-disc list-inside space-y-1 mb-4">
              {doctorRequired.map(c => <li key={c}>{c}</li>)}
            </ul>
            <p className="text-sm text-red-600">
              אנא צרו קשר עם המרכז:{' '}
              <a href="tel:089310715" className="font-bold underline">08-9310715</a>
              {' '}לתיאום ואישור.
            </p>
          </div>
        )}

        {serverError && !doctorRequired && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {serverError}
          </div>
        )}

        {/* Declaration notice */}
        <div className="bg-ice-50 border-2 border-ice-200 rounded-2xl p-5 text-sm text-slate-700">
          <p className="font-semibold text-navy-900 mb-1">✍️ הצהרה</p>
          <p>
            בלחיצה על הכפתור אני מצהיר/ה כי המידע שמסרתי למעלה נכון ומדויק,
            ושאני מודע/ת לסיכונים הכרוכים בטבילה במי קרח.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ice-500 hover:bg-ice-600 disabled:bg-slate-300
                     disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl
                     text-lg transition-all hover:scale-105 disabled:hover:scale-100
                     shadow-lg shadow-ice-500/30 flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              שומר ומעביר לתשלום...
            </>
          ) : (
            '✅ אני מאשר/ת שההצהרה נכונה ועובר/ת לתשלום'
          )}
        </button>

        <p className="text-xs text-center text-slate-400">
          ✓ המידע מוצפן ומאובטח | ✓ לא יועבר לצד שלישי | ✓ שמור בהתאם לחוק הגנת הפרטיות
        </p>
      </form>
    </div>
  );
}

export default function HealthFormPage() {
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
      <HealthFormContent />
    </Suspense>
  );
}
