# Process New Leads

עבד את כל הלידים עם status='new' בטבלת leads.

לכל ליד:
1. קרא פרטים מ-Supabase
2. הפעל lead-agent לסיווג וניקוד
3. עדכן: lead_type, score, heat, draft_message, next_follow_up, require_human_review
4. שנה status ל-'pending_approval'
5. הוסף רשומה ב-lead_activities עם type='agent_classification'
6. הצג סיכום

בסיום הצג טבלה:
| שם | סוג | חום | score | פעולה הבאה | טעון סקירה ידנית |
