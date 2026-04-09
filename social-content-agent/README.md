# ICING Social Content Agent

Agent ליצירת פוסטים לסושיאל מדיה — TikTok, Instagram, Facebook — עבור ICING.

## שימוש יומיומי ב-Claude Code

```bash
/project:ideas                        # ייצור 15 רעיונות
/project:ideas רק TikTok             # רעיונות ספציפיים
/project:write-reel תגובת הגוף לקרה  # script לרילס
/project:write-post <id> instagram_reel
/project:weekly-calendar 2026-04-07
/project:approve-post <post_id>
```

## ממשק אדמין
```
http://localhost:3001/admin/content         # ראשי
http://localhost:3001/admin/content/review  # אישור מהיר
http://localhost:3001/admin/content/digest  # דוח שבועי
```

## Setup
1. `.env.example` → `.env.local` + מלא ערכי Supabase
2. הרץ SQL: supabase/migrations/001_content_schema.sql
3. `npm install && npm run dev`
4. העתק PROMPT_TO_BUILD.md ל-Claude Code

## Stack
Claude Code + Next.js 15 + Supabase + TypeScript
