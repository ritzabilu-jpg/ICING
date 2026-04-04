/**
 * classify_lead.ts — מסווג ליד וחושב score
 */
export type LeadType = 'workshop'|'individual'|'instructor_course'|'collaboration'|'medical_question'|'other';
export type LeadHeat = 'hot'|'medium'|'cold';

export interface LeadInput {
  id: string; name: string; message: string;
  phone?: string; email?: string; source: string; created_at: string;
}
export interface ScoreBreakdown {
  urgency: number; group_size: number; specificity: number;
  contact_quality: number; budget_signal: number;
}
export interface ClassificationResult {
  lead_id: string; summary: string; lead_type: LeadType;
  score: number; score_breakdown: ScoreBreakdown; heat: LeadHeat;
  next_action: string; follow_up_hours: 2|24|72;
  draft_message: string; require_human_review: boolean; agent_notes: string;
}

export function detectLeadType(message: string): LeadType {
  const m = message.toLowerCase();
  const check = (words: string[]) => words.some(w => m.includes(w));
  if (check(['כאב','מחלה','לב','לחץ דם','סוכרת','פציעה','כרוני','רפואי','מגבלה','מותר לי'])) return 'medical_question';
  if (check(['סדנה','קבוצה','צוות','חברה','אירוע','עובדים','גיבוש'])) return 'workshop';
  if (check(['מדריך','קורס','הסמכה','ללמד'])) return 'instructor_course';
  if (check(['שיתוף','שותפות','הפניה','פיזיותרפיסט','מרפאה'])) return 'collaboration';
  if (check(['אני','לי','פרטי','יחיד','לבד'])) return 'individual';
  return 'other';
}

export function calculateScore(lead: LeadInput): ScoreBreakdown {
  const m = lead.message.toLowerCase();
  const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  const urgency = ['בקרוב','דחוף','השבוע','תאריך',...MONTHS].some(w=>m.includes(w)) ? 15 : m.length>100 ? 10 : 5;
  const gw = ['צוות','קבוצה','אנשים','עובדים'];
  const group_size = gw.some(w=>m.includes(w)) && /\d+/.test(m) ? 20 : gw.some(w=>m.includes(w)) ? 12 : 0;
  const specificity = ['מה המחיר','כמה עולה','מה כולל','כמה זמן'].some(w=>m.includes(w)) ? 18 : m.length>80 ? 12 : 5;
  const contact_quality = (lead.phone?.length??0)>8 && lead.email?.includes('@') ? 20
    : (lead.phone?.length??0)>8 || lead.email?.includes('@') ? 10 : 2;
  const budget_signal = ['תקציב','מחיר','עלות','חשבונית','חברה משלמת'].some(w=>m.includes(w)) ? 15 : 5;
  return { urgency, group_size, specificity, contact_quality, budget_signal };
}

export function classifyLead(lead: LeadInput): ClassificationResult {
  const lead_type = detectLeadType(lead.message);
  const score_breakdown = calculateScore(lead);
  const score = Object.values(score_breakdown).reduce((a,b)=>a+b,0);
  const heat: LeadHeat = score>=70?'hot':score>=40?'medium':'cold';
  const require_human_review = lead_type==='medical_question' || score<20;
  const follow_up_hours: 2|24|72 = heat==='hot'?2:heat==='medium'?24:72;
  const next_action = require_human_review ? 'נדרשת סקירה ידנית'
    : heat==='hot' ? 'שלח מענה תוך 2 שעות'
    : heat==='medium' ? 'follow-up תוך 24 שעות' : 'follow-up בעוד 72 שעות';
  const agent_notes = lead_type==='medical_question'
    ? 'מילות מפתח רפואיות — נדרש מענה ידני.'
    : score<20 ? 'ציון נמוך — כדאי לברר לפני שליחה.' : '';
  return {
    lead_id: lead.id,
    summary: `${lead.name} | ${lead_type} | ${heat} | ${score}/100`,
    lead_type, score, score_breakdown, heat, next_action, follow_up_hours,
    draft_message: `[ה-agent ינסח לפי תבנית ${lead_type}/${heat}]`,
    require_human_review, agent_notes,
  };
}
