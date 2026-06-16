// ─────────────────────────────────────────────────────────────────────────────
// health-consent-schema.ts
// Zod validation schema + TypeScript types for the health consent form.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { HEALTH_QUESTIONS, ACKNOWLEDGMENTS, detectBlockingAnswers } from './health-consent-config';

// ── Per-question answer schema ────────────────────────────────────────────────
const healthAnswerSchema = z.object({
  answer: z.string().min(1, 'נדרשת תשובה').refine(
    v => v === 'yes' || v === 'no',
    { message: 'נדרשת תשובה' }
  ),
  detail: z.string().optional(),
});

// ── Build dynamic answers shape from question IDs ─────────────────────────────
const answersShape = Object.fromEntries(
  HEALTH_QUESTIONS.map(q => [q.id, healthAnswerSchema])
) as Record<string, typeof healthAnswerSchema>;

// ── Main schema ───────────────────────────────────────────────────────────────
export const healthConsentSchema = z.object({

  // Personal information
  fullName:       z.string().min(2, 'שם מלא נדרש (לפחות 2 תווים)'),
  idNumber:       z.string().optional(),
  birthDate:      z.string().min(1, 'תאריך לידה נדרש'),
  phone:          z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין (דוגמה: 0521234567)'),
  email:          z.string().email('כתובת דוא"ל לא תקינה'),
  emergencyName:  z.string().min(2, 'שם איש קשר לחירום נדרש'),
  emergencyPhone: z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון איש קשר לא תקין'),
  isOver18:       z.boolean().refine(v => v, { message: 'נדרש אישור — המשתתף/ת מעל גיל 18' }),

  // Health answers (dynamic from HEALTH_QUESTIONS)
  answers: z.object(answersShape),

  // 7 required acknowledgments
  acknowledgments: z
    .array(z.boolean())
    .length(ACKNOWLEDGMENTS.length, 'יש לאשר את כל ההצהרות')
    .refine(arr => arr.every(Boolean), { message: 'יש לאשר את כל ההצהרות' }),

  // Privacy consent
  privacyConsent: z.boolean().refine(v => v, { message: 'נדרשת הסכמה להודעת הפרטיות' }),

  // Typed signature
  signatureName: z.string().min(2, 'נדרשת הקלדת שם לצורך חתימה'),
  signatureDate:  z.string(),

  // Pre-submit opportunity to ask questions
  preSubmitConfirmation: z.boolean().refine(v => v, { message: 'נדרש אישור' }),

  // Optional metadata (hidden fields)
  sessionDate:  z.string().optional(),
  coachName:    z.string().optional(),
  branch:       z.string().optional(),
  leadSource:   z.string().optional(),
});

export type HealthConsentFormData = z.infer<typeof healthConsentSchema>;

// ── Default values for useForm ────────────────────────────────────────────────
export function getDefaultValues(): HealthConsentFormData {
  const today = new Date().toISOString().split('T')[0];
  return {
    fullName: '',
    idNumber: '',
    birthDate: '',
    phone: '',
    email: '',
    emergencyName: '',
    emergencyPhone: '',
    isOver18: false,
    answers: Object.fromEntries(
      HEALTH_QUESTIONS.map(q => [q.id, { answer: '', detail: '' }])
    ) as HealthConsentFormData['answers'],
    acknowledgments: new Array(ACKNOWLEDGMENTS.length).fill(false),
    privacyConsent: false,
    signatureName: '',
    signatureDate: today,
    preSubmitConfirmation: false,
    sessionDate: '',
    coachName: '',
    branch: '',
    leadSource: '',
  };
}

// ── Build Supabase/API submission payload ─────────────────────────────────────
export function buildSubmissionPayload(data: HealthConsentFormData) {
  const answers = data.answers as Record<string, { answer?: string; detail?: string }>;
  const blockingQuestions = detectBlockingAnswers(answers);
  const wasBlocked = blockingQuestions.length > 0;
  const hasReviewNeeded = HEALTH_QUESTIONS.some(
    q => !q.isBlocking && answers[q.id]?.answer === 'yes'
  );

  return {
    full_name:              data.fullName,
    id_number:              data.idNumber || null,
    birth_date:             data.birthDate,
    phone:                  data.phone,
    email:                  data.email,
    emergency_contact_name: data.emergencyName,
    emergency_contact_phone: data.emergencyPhone,
    is_over_18:             data.isOver18,
    health_answers: HEALTH_QUESTIONS.map(q => ({
      id:     q.id,
      num:    q.num,
      text:   q.text,
      answer: answers[q.id]?.answer || 'no',
      detail: answers[q.id]?.detail || '',
      is_blocking: q.isBlocking,
    })),
    was_blocked:      wasBlocked,
    blocking_reasons: blockingQuestions.map(q => q.id),
    acknowledgments:  data.acknowledgments,
    privacy_consent:  data.privacyConsent,
    signature_name:   data.signatureName,
    signature_date:   data.signatureDate,
    pre_submit_confirmation: data.preSubmitConfirmation,
    session_date:     data.sessionDate || null,
    coach_name:       data.coachName   || null,
    branch:           data.branch      || null,
    lead_source:      data.leadSource  || null,
    status: wasBlocked ? 'requires_review' : (hasReviewNeeded ? 'requires_review' : 'pending'),
  };
}
