# ICING Marketing Agent

Marketing Lead Agent לעסק ICING — טבילות וסדנאות מי קרח.

## תוכן הפרויקט
- **CLAUDE.md** — הקשר מותג לClaude
- **STRATEGY.md** — אסטרטגיית שיווק
- **MEMORY.md** — החלטות ותוצאות
- **.claude/commands/** — 5 פקודות slash
- **.claude/agents/** — sub-agent לניהול לידים
- **supabase/migrations/** — סכמת DB
- **scripts/** — TypeScript utilities
- **docs/** — מדריכי סיווג ותבניות

## התחלה מהירה

### 1. הכן סביבה
```bash
cp .env.example .env.local
# עדכן את כל הערכים ב-.env.local
```

### 2. הרץ migration ב-Supabase
```bash
npx supabase db push
```

### 3. בנה עם Claude Code
פתח VS Code → Claude Code → הדבק את `PROMPT_TO_BUILD.md`

### 4. פקודות שיווק יומיות
```
/project:daily-report        # דוח יומי
/project:process-leads       # עיבוד לידים חדשים
/project:write-post [נושא]   # כתיבת פוסט
/project:draft-followup [id] # follow-up לליד
/project:approve-send [id]   # אישור שליחה
```

## flow בסיסי
```
פנייה מאתר → Supabase webhook → lead_agent מסווג →
draft_message מוכן → אישורך → שליחה
```

## כללי ברזל
- לא שולח הודעות בלי approved_by_human = true
- שאלות רפואיות → require_human_review = true תמיד
- כל פעולה נרשמת ב-lead_activities
