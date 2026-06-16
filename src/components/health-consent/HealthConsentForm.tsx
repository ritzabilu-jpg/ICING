'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  HEALTH_QUESTIONS,
  ACKNOWLEDGMENTS,
  ICING_BUSINESS,
  detectBlockingAnswers,
} from '@/lib/health-consent-config';
import {
  healthConsentSchema,
  HealthConsentFormData,
  getDefaultValues,
  buildSubmissionPayload,
} from '@/lib/health-consent-schema';

// ── Shared input class ────────────────────────────────────────────────────────
const inputCls =
  'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition placeholder-slate-400';
const labelCls = 'block text-sm font-semibold text-slate-700 mb-1';
const errCls   = 'text-red-500 text-sm mt-1';
const cardCls  = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8';
const sectionNumCls = 'flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex-shrink-0';

// ── Field wrapper helper ──────────────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessState({ wasBlocked }: { wasBlocked: boolean }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className={`max-w-lg w-full rounded-2xl p-8 text-center border-2 ${wasBlocked ? 'bg-orange-50 border-orange-300' : 'bg-green-50 border-green-300'}`}>
        <div className="text-5xl mb-4">{wasBlocked ? '⏳' : '✓'}</div>
        {wasBlocked ? (
          <>
            <h2 className="text-xl font-black text-orange-800 mb-3">
              הטופס התקבל — נדרשת בדיקה פרטנית
            </h2>
            <p className="text-orange-700 mb-4">
              על בסיס המידע שנמסר, לא ניתן להשלים הרשמה אוטומטית לטבילה.
              יש צורך בבדיקה פרטנית ו/או באישור רפואי מראש.
            </p>
            <p className="text-orange-700 font-semibold">
              יש ליצור קשר עם הצוות לצורך בירור לפני קביעת טבילה:
            </p>
            <a href={`tel:${ICING_BUSINESS.phone}`} className="inline-block mt-3 bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl">
              {ICING_BUSINESS.phone}
            </a>
          </>
        ) : (
          <>
            <h2 className="text-xl font-black text-green-800 mb-3">
              הטופס התקבל בהצלחה
            </h2>
            <p className="text-green-700">
              הטופס התקבל ונשלח לבדיקה. אישור סופי להשתתפות יינתן לאחר בחינת
              הנתונים על ידי צוות {ICING_BUSINESS.name}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main form component ───────────────────────────────────────────────────────
export default function HealthConsentForm() {
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [wasBlocked, setWasBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HealthConsentFormData>({
    resolver: zodResolver(healthConsentSchema),
    defaultValues: getDefaultValues(),
    mode: 'onBlur',
  });

  // ── Derived state ────────────────────────────────────────────────────────────
  const answersWatched = watch('answers') as Record<string, { answer?: string; detail?: string }>;
  const blockingQuestions = detectBlockingAnswers(answersWatched || {});
  const isBlocked = blockingQuestions.length > 0;
  const yesAnswers = HEALTH_QUESTIONS.filter(q => answersWatched?.[q.id]?.answer === 'yes');

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: HealthConsentFormData) => {
    setSubmitState('submitting');
    const payload = buildSubmissionPayload(data);
    try {
      const res = await fetch('/api/health-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setWasBlocked(payload.was_blocked);
        setSubmitState('success');
      } else {
        setSubmitState('error');
      }
    } catch {
      setSubmitState('error');
    }
  };

  if (submitState === 'success') return <SuccessState wasBlocked={wasBlocked} />;

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* ── Print styles ─────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12px; color: #000; }
          .bg-white { box-shadow: none !important; border: 1px solid #ccc !important; }
          input[type=radio], input[type=checkbox] { appearance: auto; }
        }
      `}</style>

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <div className="text-center pb-4 border-b border-slate-100">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">
          {ICING_BUSINESS.name} · {ICING_BUSINESS.address}
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">
          שאלון בריאות, הצהרת משתתף והסכמה מדעת<br />
          לפני טבילה במי קרח
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          חשיפה למים קרים כרוכה בתגובה פיזיולוגית משמעותית ואינה מתאימה לכל אדם.
          השתתפות כפופה לבחינת תשובות השאלון. {ICING_BUSINESS.name} רשאית לדחות,
          לעכב, או לדרוש אישור רפואי טרם השתתפות, לפי שיקול דעתה הבלעדי.
        </p>
      </div>

      {/* ── Section 2: Safety notice ──────────────────────────────────────── */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
        <h2 className="font-black text-amber-900 text-base mb-3 flex items-center gap-2">
          <span>⚠</span> הודעת בטיחות חשובה — נא לקרוא בעיון לפני מילוי הטופס
        </h2>
        <ul className="space-y-1.5 text-sm text-amber-800 list-none">
          {[
            'טבילה במים קרים עלולה לגרום לעומס לבבי-נשימתי חריף, לרבות עלייה חדה בקצב הלב ובלחץ הדם.',
            'השתתפות אסורה או מחייבת אישור רפואי מוקדם במצבים: מחלת לב, הפרעת קצב, לחץ דם לא מאוזן, אי ספיקת לב, רגישות לקור, הריון, ומצבים נוספים המפורטים בשאלון.',
            'בכל מקרה של כאב בחזה, קוצר נשימה חמור, עילפון, בלבול, דפיקות לב חריגות, נימול קיצוני, או כל מצוקה חריגה — יש להפסיק מיידית ולדווח לצוות.',
          ].map((txt, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-600 mt-0.5 flex-shrink-0">•</span>
              <span>{txt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── FORM ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* ── Section 3: Personal details ──────────────────────────────────── */}
        <fieldset className={cardCls}>
          <legend className="sr-only">פרטים אישיים</legend>
          <div className="flex items-center gap-3 mb-5">
            <span className={sectionNumCls}>1</span>
            <h2 className="text-lg font-black text-slate-800">פרטים אישיים</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="שם מלא" required error={errors.fullName?.message}>
              <input
                {...register('fullName')}
                type="text"
                className={inputCls}
                placeholder="שם פרטי ושם משפחה"
                autoComplete="name"
              />
            </Field>

            <Field label="מספר תעודת זהות / דרכון" error={errors.idNumber?.message}>
              <input
                {...register('idNumber')}
                type="text"
                className={inputCls}
                placeholder="אופציונלי"
                inputMode="numeric"
              />
            </Field>

            <Field label="תאריך לידה" required error={errors.birthDate?.message}>
              <input
                {...register('birthDate')}
                type="date"
                className={inputCls}
                max={new Date().toISOString().split('T')[0]}
              />
            </Field>

            <Field label="טלפון נייד" required error={errors.phone?.message}>
              <input
                {...register('phone')}
                type="tel"
                className={inputCls}
                placeholder="0521234567"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
              />
            </Field>

            <Field label="דוא\"ל" required error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                className={inputCls}
                placeholder="name@example.com"
                autoComplete="email"
                dir="ltr"
              />
            </Field>

            <div /> {/* grid spacer */}

            <Field label="שם איש/ת קשר לחירום" required error={errors.emergencyName?.message}>
              <input
                {...register('emergencyName')}
                type="text"
                className={inputCls}
                placeholder="שם מלא"
              />
            </Field>

            <Field label="טלפון איש/ת קשר לחירום" required error={errors.emergencyPhone?.message}>
              <input
                {...register('emergencyPhone')}
                type="tel"
                className={inputCls}
                placeholder="0521234567"
                inputMode="tel"
                dir="ltr"
              />
            </Field>
          </div>

          {/* Age confirmation */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                {...register('isOver18')}
                type="checkbox"
                className="mt-0.5 w-5 h-5 rounded border-slate-300 accent-teal-600 flex-shrink-0"
              />
              <span className="text-sm text-slate-700 font-medium">
                <span className="text-red-500 ml-1">*</span>
                אני מאשר/ת כי גילי 18 שנים ומעלה
              </span>
            </label>
            {errors.isOver18 && <p className={`${errCls} mt-1`}>{errors.isOver18.message}</p>}
          </div>
        </fieldset>

        {/* ── Section 4: Health questionnaire ──────────────────────────────── */}
        <fieldset className={cardCls}>
          <legend className="sr-only">שאלון בריאות</legend>
          <div className="flex items-center gap-3 mb-2">
            <span className={sectionNumCls}>2</span>
            <h2 className="text-lg font-black text-slate-800">שאלון בריאות</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 pr-11">
            יש לענות על כל השאלות. במקרה של ספק — בחר "כן" ופרט.
          </p>

          <div className="space-y-5">
            {HEALTH_QUESTIONS.map(q => {
              const fieldAnswer = (answersWatched as any)?.[q.id]?.answer;
              const fieldErr = (errors.answers as any)?.[q.id]?.answer?.message as string | undefined;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    fieldAnswer === 'yes'
                      ? q.isBlocking
                        ? 'border-red-300 bg-red-50'
                        : 'border-amber-300 bg-amber-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-800 mb-3">
                    <span className="font-black text-teal-600 ml-1.5">{q.num}.</span>
                    {q.text}
                    <span className="text-red-500 mr-1">*</span>
                  </p>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        {...register(`answers.${q.id}.answer` as any)}
                        type="radio"
                        value="no"
                        className="w-4 h-4 accent-teal-600"
                      />
                      לא
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        {...register(`answers.${q.id}.answer` as any)}
                        type="radio"
                        value="yes"
                        className="w-4 h-4 accent-red-500"
                      />
                      כן
                    </label>
                  </div>

                  {fieldErr && <p className={errCls}>{fieldErr}</p>}

                  {fieldAnswer === 'yes' && (
                    <div className="mt-3">
                      <textarea
                        {...register(`answers.${q.id}.detail` as any)}
                        rows={2}
                        placeholder={q.detailPrompt}
                        className={`${inputCls} text-sm`}
                      />
                      {q.isBlocking && (
                        <p className="text-red-600 text-xs font-semibold mt-1">
                          תשובה זו מצריכה בדיקה פרטנית ו/או אישור רפואי לפני טבילה.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* ── Blocking alert ─────────────────────────────────────────────────── */}
        {isBlocked && (
          <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5">
            <h3 className="font-black text-red-800 text-base mb-2">
              נדרשת בדיקה לפני טבילה
            </h3>
            <p className="text-red-700 text-sm mb-3">
              על בסיס המידע שנמסר, לא ניתן להשלים הרשמה אוטומטית לטבילה.
              יש צורך בבדיקה פרטנית ו/או באישור רפואי מראש.
            </p>
            <p className="text-red-700 text-sm font-semibold mb-2">שאלות שדורשות בירור:</p>
            <ul className="text-sm text-red-700 space-y-1">
              {blockingQuestions.map(q => (
                <li key={q.id} className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{q.num}. {q.text}</span>
                </li>
              ))}
            </ul>
            <p className="text-red-700 text-sm font-semibold mt-3">
              יש ליצור קשר עם הצוות לצורך בירור לפני קביעת טבילה:{' '}
              <a href={`tel:${ICING_BUSINESS.phone}`} className="underline">{ICING_BUSINESS.phone}</a>
            </p>
            <p className="text-red-600 text-xs mt-2">
              ניתן להמשיך ולמלא את הטופס — הוא יישלח לבדיקה ידנית של הצוות.
            </p>
          </div>
        )}

        {/* ── Yes answers summary ───────────────────────────────────────────── */}
        {yesAnswers.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 no-print">
            <h3 className="font-bold text-slate-700 text-sm mb-3">
              סיכום תשובות "כן" לפני שליחה:
            </h3>
            <div className="space-y-2">
              {yesAnswers.map(q => {
                const detail = (answersWatched as any)?.[q.id]?.detail;
                return (
                  <div key={q.id} className={`text-xs rounded-lg p-2.5 ${q.isBlocking ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    <span className="font-bold">{q.num}.</span> {q.text}
                    {detail && <p className="mt-0.5 opacity-80">פרוט: {detail}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Section 5: Acknowledgments ───────────────────────────────────── */}
        <fieldset className={cardCls}>
          <legend className="sr-only">הצהרות חובה</legend>
          <div className="flex items-center gap-3 mb-5">
            <span className={sectionNumCls}>3</span>
            <h2 className="text-lg font-black text-slate-800">הצהרות חובה</h2>
          </div>

          <div className="space-y-4">
            {ACKNOWLEDGMENTS.map((text, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  {...register(`acknowledgments.${i}` as any)}
                  type="checkbox"
                  className="mt-0.5 w-5 h-5 rounded border-slate-300 accent-teal-600 flex-shrink-0"
                />
                <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                  <span className="text-red-500 ml-1">*</span>{text}
                </span>
              </label>
            ))}
          </div>

          {(errors.acknowledgments as any)?.message && (
            <p className={`${errCls} mt-3`}>{(errors.acknowledgments as any).message}</p>
          )}
        </fieldset>

        {/* ── Section 6: Privacy notice ─────────────────────────────────────── */}
        <fieldset className={cardCls}>
          <legend className="sr-only">הודעת פרטיות</legend>
          <div className="flex items-center gap-3 mb-4">
            <span className={sectionNumCls}>4</span>
            <h2 className="text-lg font-black text-slate-800">הודעת פרטיות</h2>
          </div>

          <div className="text-sm text-slate-600 space-y-3 leading-relaxed bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
            {/* LEGAL: Review privacy notice with counsel under PPPA 5741-1981 and amendments */}
            <p>
              <strong className="text-slate-800">מטרת האיסוף:</strong> המידע נאסף לצורך בדיקת התאמה להשתתפות,
              ניהול בטיחות, תיעוד משפטי-עסקי, יצירת קשר, ומעקב תפעולי.
            </p>
            <p>
              <strong className="text-slate-800">בעל הנתונים:</strong> {ICING_BUSINESS.fullName},
              {' '}{ICING_BUSINESS.address}. לפניות:{' '}
              <a href={`mailto:${ICING_BUSINESS.email}`} className="text-teal-600 underline dir-ltr">{ICING_BUSINESS.email}</a>
              {' '}· {ICING_BUSINESS.phone}.
            </p>
            <p>
              <strong className="text-slate-800">מסירה לצדדים שלישיים:</strong> המידע יועבר רק לגורמים
              המורשים, ולספקי שירות הנדרשים לצורך הפעלה, ביטחון, ציות לדין, וניהול המערכת.
            </p>
            <p>
              <strong className="text-slate-800">השלכות אי-מסירה:</strong> מסירת המידע נדרשת לשם הערכת
              ההשתתפות. אי-מסירה עלולה למנוע את האפשרות להשתתף.
            </p>
            <p>
              <strong className="text-slate-800">זכויות:</strong> בהתאם לדין, ניתן לפנות בבקשה לעיון
              ותיקון מידע בכתובת הדוא"ל לעיל.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              {...register('privacyConsent')}
              type="checkbox"
              className="mt-0.5 w-5 h-5 rounded border-slate-300 accent-teal-600 flex-shrink-0"
            />
            <span className="text-sm text-slate-700 font-medium">
              <span className="text-red-500 ml-1">*</span>
              קראתי את הודעת הפרטיות ואני מסכים/ה לאיסוף, שמירה ושימוש במידע כמפורט.
            </span>
          </label>
          {errors.privacyConsent && (
            <p className={`${errCls} mt-1`}>{errors.privacyConsent.message}</p>
          )}
        </fieldset>

        {/* ── Section 7: Consent text ───────────────────────────────────────── */}
        <div className={`${cardCls} bg-slate-50`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={sectionNumCls}>5</span>
            <h2 className="text-lg font-black text-slate-800">הסכמה מדעת</h2>
          </div>
          {/* LEGAL: This paragraph is a business draft. Review with counsel. */}
          <p className="text-sm text-slate-600 leading-relaxed">
            אני מבין/ה את אופי הטבילה במים קרים ואת הסיכונים הפיזיולוגיים הכרוכים בה.
            השתתפותי היא מרצוני החופשי בלבד. {ICING_BUSINESS.name} מסתמכת על הצהרותיי
            ועל נכונות המידע שמסרתי. {ICING_BUSINESS.name} רשאית לסרב להשתתפות מטעמי
            בטיחות, ללא מתן נימוקים. במקרה של תסמינים חריגים בזמן הטבילה —
            הפעילות תופסק מיידית ואדווח לצוות.
          </p>
        </div>

        {/* ── Section 8: Signature ──────────────────────────────────────────── */}
        <fieldset className={cardCls}>
          <legend className="sr-only">חתימה דיגיטלית</legend>
          <div className="flex items-center gap-3 mb-5">
            <span className={sectionNumCls}>6</span>
            <h2 className="text-lg font-black text-slate-800">חתימה דיגיטלית</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="שם מלא לחתימה" required error={errors.signatureName?.message}>
              <input
                {...register('signatureName')}
                type="text"
                className={`${inputCls} border-teal-300`}
                placeholder="הקלד/י שמך המלא"
              />
            </Field>
            <Field label="תאריך">
              <input
                {...register('signatureDate')}
                type="date"
                className={`${inputCls} bg-slate-50`}
                readOnly
              />
            </Field>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-sm text-teal-800">
            הקלדת שמי ואישור הטופס מהווים חתימה אלקטרונית על כל תוכנו,
            בהתאם לחוק חתימה אלקטרונית (במידה ויחול).
          </div>
        </fieldset>

        {/* ── Pre-submit confirmation + submit ──────────────────────────────── */}
        <div className={cardCls}>
          <label className="flex items-start gap-3 cursor-pointer select-none mb-5">
            <input
              {...register('preSubmitConfirmation')}
              type="checkbox"
              className="mt-0.5 w-5 h-5 rounded border-slate-300 accent-teal-600 flex-shrink-0"
            />
            <span className="text-sm text-slate-700 font-medium">
              <span className="text-red-500 ml-1">*</span>
              אני מאשר/ת שלפני מילוי הטופס קיבלתי הזדמנות לשאול שאלות ולקבל הבהרות.
            </span>
          </label>
          {errors.preSubmitConfirmation && (
            <p className={`${errCls} mb-3`}>{errors.preSubmitConfirmation.message}</p>
          )}

          {submitState === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              אירעה שגיאה בשליחה. נא לנסות שוב או לפנות לצוות.
            </div>
          )}

          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white font-black text-base py-3.5 rounded-xl transition-colors"
          >
            {submitState === 'submitting' ? 'שולח טופס...' : 'שלח טופס וחתימה'}
          </button>

          <p className="text-xs text-slate-400 text-center mt-3">
            כל השדות המסומנים ב-<span className="text-red-500">*</span> הם שדות חובה
          </p>
        </div>

      </form>
    </div>
  );
}
