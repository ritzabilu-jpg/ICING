// ─────────────────────────────────────────────────────────────────────────────
// health-consent-schema.ts
// Zod validation schema + TypeScript types for the health consent form.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { HEALTH_QUESTIONS, detectBlockingAnswers } from './health-consent-config';

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
  fullName:  z.string().min(2, 'שם מלא נדרש (לפחות 2 תווים)'),
  idNumber:  z.string().optional(),
  birthDate: z.string().min(1, 'תאריך לידה נדרש'),
  phone:     z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין (דוגמה: 0521234567)'),
  email:     z.string().email('כתובת דוא"ל לא תקינה').optional().or(z.literal('')),

  // Health answers (dynamic from HEALTH_QUESTIONS)
  answers: z.object(answersShape),

  // Single combined acknowledgment
  acknowledgments: z.boolean().refine(v => v, { message: 'יש לאשר את ההצהרות' }),

  // Privacy consent
  privacyConsent: z.boolean().refine(v => v, { message: 'נדרשת הסכמה להודעת הפרטיות' }),

  // Typed signature
  signatureName: z.string().min(2, 'נדרשת הקלדת שם לצורך חתימה'),
  signatureDate: z.string(),

  // Optional metadata (hidden fields)
  sessionDate: z.string().optional(),
  coachName:   z.string().optional(),
  branch:      z.string().optional(),
  leadSource:  z.string().optional(),
});

export type HealthConsentFormData = z.infer<typeof healthConsentSchema>;

// ── Default values for useForm ────────────────────────────────────────────────
export function getDefaultValues(): HealthConsentFormData {
  const today = new Date().toISOString().split('T')[0];
  return {
    fullName:        '',
    idNumber:        '',
    birthDate:       '',
    phone:           '',
    email:           '',
    answers: Object.fromEntries(
      HEALTH_QUESTIONS.map(q => [q.id, { answer: '', detail: '' }])
    ) as unknown as HealthConsentFormData['answers'],
    acknowledgments: false,
    privacyConsent:  false,
    signatureName:   '',
    signatureDate:   today,
    sessionDate:     '',
    coachName:       '',
    branch:          '',
    leadSource:      '',
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
    full_name:        data.fullName,
    id_number:        data.idNumber || null,
    birth_date:       data.birthDate,
    phone:            data.phone,
    email:            data.email || null,
    health_answers: HEALTH_QUESTIONS.map(q => ({
      id:          q.id,
      num:         q.num,
      text:        q.text,
      answer:      answers[q.id]?.answer || 'no',
      detail:      answers[q.id]?.detail || '',
      is_blocking: q.isBlocking,
    })),
    was_blocked:      wasBlocked,
    blocking_reasons: blockingQuestions.map(q => q.id),
    acknowledgments:  data.acknowledgments,
    privacy_consent:  data.privacyConsent,
    signature_name:   data.signatureName,
    signature_date:   data.signatureDate,
    session_date:     data.sessionDate || null,
    coach_name:       data.coachName   || null,
    branch:           data.branch      || null,
    lead_source:      data.leadSource  || null,
    status: wasBlocked ? 'requires_review' : (hasReviewNeeded ? 'requires_review' : 'pending'),
  };
}
