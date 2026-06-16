// ─────────────────────────────────────────────────────────────────────────────
// health-consent-config.ts
// Questions, legal texts, and pure utility functions for the health consent form.
//
// LEGAL NOTE: This file contains a business draft for internal use.
// All user-facing copy MUST be reviewed by qualified Israeli legal counsel
// (including an attorney experienced in privacy law / health data under
// Israeli law) before the form is used with real participants.
// Replace ICING_BUSINESS constants with verified legal entity details.
// ─────────────────────────────────────────────────────────────────────────────

// ── Business / data-controller details ───────────────────────────────────────
// LEGAL: Verify business name, registration number, address, and contact
// details with the operating entity before publishing.
export const ICING_BUSINESS = {
  name: 'ICING',
  fullName: 'ICING Cold Water Immersion',
  email: 'info@icing.co.il',
  phone: '08-9310715',
  address: 'סירני 52, חולון',
  website: 'https://icing.co.il',
} as const;

// ── Health question definition ────────────────────────────────────────────────
export interface HealthQuestion {
  id: string;
  num: number;
  text: string;
  /** If true and answer is "yes" → hard-stop blocking logic fires */
  isBlocking: boolean;
  detailPrompt: string;
}

// ── 12 Health questions ───────────────────────────────────────────────────────
// Questions 1–7, 9 are blocking.
// Questions 8, 10–12 require review but not automatic hard-stop.
export const HEALTH_QUESTIONS: HealthQuestion[] = [
  {
    id: 'q1_heart',
    num: 1,
    text: 'האם אובחנת אי פעם במחלת לב, הפרעת קצב, תעוקת חזה, אי ספיקת לב, או בעיה קרדיווסקולרית אחרת?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q2_bp',
    num: 2,
    text: 'האם יש לך לחץ דם גבוה שאינו מאוזן, או אירוע חריג בלחץ הדם?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q3_neuro',
    num: 3,
    text: 'האם חווית עילפון, אובדן הכרה, סחרחורת משמעותית, פרכוס, או אירוע נוירולוגי לא מוסבר?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q4_resp',
    num: 4,
    text: 'האם יש לך אסתמה לא מאוזנת, COPD, קוצר נשימה משמעותי, או מחלת ריאות פעילה?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q5_cold',
    num: 5,
    text: 'האם יש לך רגישות חריגה לקור, תסמונת ריינו, אורטיקריה מקור, או בעיה רפואית אחרת המחמירה בחשיפה לקור?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q6_recent',
    num: 6,
    text: 'האם עברת לאחרונה ניתוח, אשפוז, פציעה משמעותית, זיהום, מחלת חום, או הליך רפואי משמעותי?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q7_vascular',
    num: 7,
    text: 'האם ידוע לך על מחלת כלי דם, הפרעת קרישה, DVT/תסחיף, או בעיית זרימת דם?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q8_diabetes',
    num: 8,
    text: 'האם יש לך סוכרת עם נוירופתיה או ירידה בתחושה?',
    isBlocking: false,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q9_pregnancy',
    num: 9,
    text: 'האם את בהיריון או קיים חשד להיריון?',
    isBlocking: true,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q10_meds',
    num: 10,
    text: 'האם אתה נוטל תרופות העלולות להשפיע על קצב הלב, לחץ דם, הכרה, שיווי משקל, תגובת גוף לקור, או יכולת דיווח על מצוקה?',
    isBlocking: false,
    detailPrompt: 'נא לציין שם התרופה/ות ומינון',
  },
  {
    id: 'q11_prohibited',
    num: 11,
    text: 'האם הונחית בעבר שלא לבצע חשיפה לקור קיצוני או מאמץ דומה?',
    isBlocking: false,
    detailPrompt: 'נא לפרט בקצרה',
  },
  {
    id: 'q12_other',
    num: 12,
    text: 'האם קיימת כל מגבלה רפואית, נפשית, או תפקודית אחרת שחשוב לדווח עליה טרם טבילה?',
    isBlocking: false,
    detailPrompt: 'נא לפרט בקצרה',
  },
];

// ── 7 Required acknowledgments ────────────────────────────────────────────────
// LEGAL: Review wording carefully. These form part of the informed consent.
export const ACKNOWLEDGMENTS = [
  'אני מצהיר/ה כי כל המידע שמסרתי בטופס זה נכון, מלא ומעודכן לפי מיטב ידיעתי.',
  'ידוע לי כי טבילה במי קרח כרוכה בחשיפה לקור קיצוני ובתגובות גופניות מיידיות, לרבות עומס לבבי-נשימתי, ואינה מתאימה לכל אדם.',
  'ידוע לי כי שאלון זה אינו מחליף ייעוץ רפואי, בדיקה רפואית או אבחון רפואי.',
  'ידוע לי כי ICING רשאית, לפי שיקול דעתה, למנוע השתתפות, להפסיק השתתפות, או לדרוש אישור רפואי כתנאי לטבילה.',
  'אני מתחייב/ת לדווח מיידית לצוות על כל שינוי במצבי הרפואי או על כל תחושת מצוקה, כאב בחזה, קוצר נשימה, סחרחורת, בלבול, דפיקות לב, נימול חריג או כל תסמין חריג אחר.',
  'ידוע לי כי האחריות למסירת מידע רפואי נכון ומלא חלה עליי.',
  'אני מסכים/ה לפעול בהתאם לכל הנחיות הבטיחות, הכניסה, היציאה וההשגחה של צוות ICING.',
] as const;

export type AcknowledgmentIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ── Answer record type used in pure functions ─────────────────────────────────
export type AnswerRecord = Record<string, { answer?: string; detail?: string }>;

// ── Pure: detect which blocking questions were answered "yes" ─────────────────
export function detectBlockingAnswers(
  answers: AnswerRecord,
  questions: HealthQuestion[] = HEALTH_QUESTIONS,
): HealthQuestion[] {
  return questions.filter(q => q.isBlocking && answers[q.id]?.answer === 'yes');
}

// ── Pure: validate all required acknowledgments are checked ───────────────────
export function validateAcknowledgments(acks: boolean[]): boolean {
  return acks.length === ACKNOWLEDGMENTS.length && acks.every(Boolean);
}

// ── Submission status ─────────────────────────────────────────────────────────
export type ConsentFormStatus = 'pending' | 'approved' | 'requires_review' | 'rejected';

export const STATUS_LABELS: Record<ConsentFormStatus, string> = {
  pending: 'ממתין לבדיקה',
  approved: 'אושר',
  requires_review: 'דרוש בירור',
  rejected: 'נדחה',
};

export const STATUS_COLORS: Record<ConsentFormStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  requires_review: 'bg-orange-100 text-orange-800',
  rejected: 'bg-red-100 text-red-800',
};
