# פרומפט לבנייה ב-Claude Code
## העתק-הדבק לתוך Claude Code — כולו, כולל כל הפרטים

---

## הוראות למשתמש לפני ההדבקה
1. פתח את תיקיית הפרויקט `marketing-agent` ב-VS Code
2. פתח את Claude Code (Ctrl+Shift+P → Claude Code)
3. הכנס ל-Plan Mode (הקלד `/plan` בתחילת השיחה)
4. הדבק את הפרומפט הבא:

---

## הפרומפט:

```
אני רוצה לבנות Marketing Lead Agent לעסק ICING שלי — עסק לטבילות וסדנאות מי קרח בישראל.

הפרויקט כבר מכיל את הקבצים הבאים שיצרת לי:
- CLAUDE.md — הקשר מלא של המותג
- STRATEGY.md — אסטרטגיה שיווקית
- MEMORY.md — החלטות קודמות
- .claude/agents/lead-agent.md — הגדרת sub-agent
- .claude/commands/*.md — 5 slash commands
- docs/lead-types.md + docs/message-templates.md
- supabase/migrations/001_leads_schema.sql — סכמת DB מלאה
- scripts/classify_lead.ts + daily_digest.ts + send_approved.ts
- package.json + .env.example

לפני שמתחיל: קרא את כל הקבצים האלה. הם מכילים את כל ההקשר שצריך.

---

## Phase 1 — בנה את הגרעין (התחל כאן)

### 1. Webhook Handler — /app/api/webhooks/new-lead/route.ts
- מקבל POST עם: name, phone, email, message, source
- מאמת Supabase webhook signature מה-header 'X-Supabase-Event-Signature'
- שומר ב-leads table עם status='new'
- מוסיף רשומה ב-lead_activities עם type='lead_received'
- מחזיר { success: true, lead_id } — לא שולח כלום
- אין auth על זה (public endpoint)

### 2. Classify API — /app/api/agent/classify/route.ts
- POST עם { lead_id }
- מושך את הליד מ-Supabase
- מריץ classifyLead() מ-scripts/classify_lead.ts לקבלת score, heat, lead_type
- קורא ל-Claude API (Anthropic SDK) לניסוח draft_message בעברית:

  System prompt:
  "אתה עוזר שיווקי של ICING — עסק לטבילות וסדנאות מי קרח בישראל.
  כתוב הודעת מענה ראשונית בעברית לפנייה הבאה. חוקים:
  - 4-6 שורות בלבד
  - פתח בשם הפרטי עם 'היי [שם],'
  - שאלה אחת ברורה בסיום
  - חתום 'ליאור'
  - אסור: ביטויים רפואיים, הבטחות, urgency מלאכותית
  - אם lead_type=medical_question: כתוב רק 'תודה שפנית — אחזור אליך ישירות בקרוב. ליאור'"

  User: "שם: {name} | סוג: {lead_type} | ציון: {score} | פנייה: {message}"

- עדכן leads: lead_type, score, score_breakdown, heat, require_human_review, draft_message, next_follow_up, agent_notes
- שנה status ל-'pending_approval'
- כתוב ל-lead_activities עם type='agent_classification'
- מוגן ב-service role key (Bearer token בheader)

### 3. Admin API — /app/api/admin/leads/route.ts
- GET ?status=pending_approval — מחזיר לידים עם draft
- GET ?status=all — כל הלידים
- PATCH /app/api/admin/leads/[id]/approve/route.ts:
  - עדכן: approved_by_human=true, status='approved'
  - כתוב activity type='approval', performed_by='lior'
- PATCH /app/api/admin/leads/[id]/draft/route.ts:
  - קבל { draft_message } חדש ועדכן
- מוגן: בדוק NEXT_PUBLIC_ADMIN_KEY ב-header

---

## Phase 2 — ממשק אדמין

### 4. Dashboard — /app/admin/lior/page.tsx
דשבורד אדמין עם:
- 4 כרטיסי KPI: לידים חדשים | ממתינים לאישור | נשלחו | הוזמנו
- טבלת לידים עם עמודות: שם, סוג, חום (🔥/🌤️/❄️), ציון, status, תאריך
- פילטר לפי status ו-heat
- Real-time עם Supabase subscription (onLead changes)
- עיצוב: רספונסיבי, RTL, עברית, צבעים: כחול-לבן-אפור

### 5. Lead Card Component — /components/admin/LeadCard.tsx
כרטיס ליד שמציג:
- פרטים מלאים (שם, טלפון, הודעה המקורית)
- draft_message ב-textarea הניתן לעריכה inline
- כפתור "אשר ושלח" → קורא ל-PATCH approve
- כפתור "ערוך" → שמור draft מעודכן
- כפתור "לא רלוונטי" → שנה status ל-not_relevant
- היסטוריית activities בסופו

---

## Phase 3 — אוטומציה

### 6. Cron — /app/api/cron/process-new-leads/route.ts
- מאומת עם header 'Authorization: Bearer {CRON_SECRET}'
- מושך כל leads עם status='new'
- לכל אחד: קורא ל-/api/agent/classify
- מחזיר { processed: N }

### 7. vercel.json
```json
{
  "crons": [
    { "path": "/api/cron/process-new-leads", "schedule": "*/30 * * * *" }
  ]
}
```

---

## כללים טכניים (חשוב!)
- TypeScript strict mode, named exports
- Next.js 15 App Router
- כל API route מאמת credentials לפני פעולה
- .env.local לעולם לא נכנס ל-git (יש .env.example)
- כל פעולת DB מלווה ברשומת lead_activities
- approved_by_human = false → לא שולח הודעה בשום שלב
- lead_type = 'medical_question' → require_human_review = true תמיד

## סדר הבנייה
1. קרא את כל הקבצים הקיימים
2. הצג תוכנית (plan mode)
3. Phase 1 תחילה — webhook + classify + admin API
4. בדוק שה-endpoints עובדים (תן לי פקודות curl לבדיקה)
5. Phase 2 — ממשק
6. Phase 3 — cron

שאל אותי לפני כל פעולה שמוסיפה קובץ חדש לsupabase/migrations או משנה .env.example
```

---

## אחרי ההדבקה — מה לצפות
Claude יציג תוכנית ויבקש אישור לפני כל שלב.
