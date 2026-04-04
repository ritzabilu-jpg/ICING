# ICING Marketing Agent — Brand & Project Context

## העסק
שם העסק: ICING (icing.co.il)
תחום: טבילות במי קרח וסדנאות חוויתיות (Cold Water Immersion)
קהל יעד: אנשי עסקים, צוותים ארגוניים, ספורטאים, מתמחים בהתאוששות, חובבי בריאות ותודעה.
שפת תקשורת: עברית בלבד. מסרים אנגליים מותרים רק ב-metadata/SEO.
מיקום: הולון, תל-אביב, ישראל.
כתובת אדמין: /admin/lior

## סוגי מוצרים/שירותים
- טבילה חד-פעמית (individual session)
- סדנה קבוצתית (workshop, 5-30 איש)
- קורס מדריכים (instructor course)
- שיתופי פעולה עסקיים / אירועי חברה

## קול המותג (Brand Voice)
- ישיר, אנושי, לא מכירתי
- מבוסס מדע — אפשר לציין מחקרים, לא שפה רפואית פסקנית
- חם ומזמין — לא קר ואגרסיבי
- אסור: הבטחות רפואיות ("מרפא", "מונע", "מטפל")
- אסור: שליחת הודעות בלי אישור מפורש של המשתמש

## ארכיטקטורת הפרויקט
```
marketing-agent/
├── CLAUDE.md                  ← קונטקסט מלא של המותג
├── STRATEGY.md                ← אסטרטגיית שיווק
├── MEMORY.md                  ← החלטות ותוצאות
├── .claude/
│   ├── commands/              ← פקודות slash
│   │   ├── process-leads.md
│   │   ├── daily-report.md
│   │   ├── write-post.md
│   │   ├── draft-followup.md
│   │   └── approve-send.md
│   └── agents/
│       └── lead-agent.md      ← sub-agent לניהול לידים
├── supabase/migrations/
│   └── 001_leads_schema.sql
├── scripts/
│   ├── classify_lead.ts
│   ├── daily_digest.ts
│   └── send_approved.ts
└── docs/
    ├── lead-types.md
    └── message-templates.md
```

## Stack טכני
- Frontend/Backend: Next.js (App Router) + TypeScript
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Messaging: WhatsApp Business API + Email
- Hosting: Vercel

## כללים קריטיים לכל agent
1. לא שולח הודעות ללא `approved_by_human = true`
2. לא כותב ביטויים רפואיים מחייבים (מרפא, מונע, מטפל)
3. לא משנה תקציבי פרסום
4. כל פעולה נרשמת ב-lead_activities
5. lead_type = 'medical_question' → require_human_review = true תמיד
6. score: 70+ = חם, 40-69 = בינוני, 0-39 = קר
7. follow-up: חם = 2 שעות, בינוני = 24 שעות, קר = 72 שעות

## פקודות מפתח
- `npm run dev` — dev server
- `npm run agent:process` — עיבוד לידים ידני
- `npm run agent:digest` — דוח יומי
- `npx supabase db push` — migration

## מה לא לגעת בו
- `/app/api/webhooks/` — webhook handlers
- `.env.local` — לעולם לא commit
- `supabase/migrations/` — רק migration חדש, לא לשנות ישנים
