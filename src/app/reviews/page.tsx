import { createAdminClient } from '@/lib/supabase';
import type { Metadata } from 'next';
import ReviewsContent from '@/components/ReviewsContent';

export const metadata: Metadata = {
  title: 'חוות דעת | חוויות שוויץ המדע',
  description: 'מה אומרים המשתתפים על חוויות הטבילה בקרח שלנו',
};

export const revalidate = 60;

const hardcoded = [
  { id: 'h1', name: 'מיכאל ל.', role: 'מנהל מכירות', text: 'חוויה שלא אשכח. הנשימה המנחה עזרה לי להישאר רגוע בתוך המים. יצאתי עם תחושת הישג וביטחון עצמי שלא הרגשתי כבר שנים.', rating: 5, type: 'individual' },
  { id: 'h2', name: 'שירה ודוד מ.', role: 'זוג מרחובות', text: 'הגענו כזוג ויצאנו הרבה יותר מחוברים. הניסיון המשותף להתגבר על הקור ביחד – מחזק את הקשר בצורה לא רגילה.', rating: 5, type: 'couple' },
  { id: 'h3', name: 'ענת ש.', role: 'מנהלת משאבי אנוש', text: 'הבאתי את הצוות שלי לסדנה ולא האמנתי כמה היא שינתה את הדינמיקה. אנשים שחששו בהתחלה יצאו עם הישגים אישיים שהם מספרים עליהם גם חודשים אחרי.', rating: 5, type: 'team' },
  { id: 'h4', name: 'אורי כ.', role: 'ספורטאי חובב', text: 'המדריכים פשוט מדהימים – מקצועיים, תומכים ויודעים בדיוק מתי לדחוף ומתי לתת מרחב. הרמה המדעית של ההסבר הפתיע אותי לטובה.', rating: 5, type: 'individual' },
  { id: 'h5', name: 'נועה ר.', role: 'עובדת הייטק', text: 'בהתחלה הייתי פחדנית מאוד, אבל תרגול הנשימה לפני הטבילה שינה הכל. יצאתי עם כלים אמיתיים לניהול לחץ – משהו שאני מרגישה בכל יום.', rating: 5, type: 'individual' },
  { id: 'h6', name: 'גיל ב.', role: 'מאמן כושר', text: 'פרוטוקול הטבילה מבוסס מדע אמיתי. הסברים על נוראדרנלין, HPA, ותגובת הקור – בדיוק מה שציפיתי ממרכז מקצועי.', rating: 5, type: 'individual' },
];

async function getApprovedReviews() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('reviews')
      .select('id, name, role, text, rating, type')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const approved = await getApprovedReviews();
  const all = [
    ...approved.map(r => ({ ...r, role: r.role ?? '' })),
    ...hardcoded,
  ];
  return <ReviewsContent reviews={all} />;
}
