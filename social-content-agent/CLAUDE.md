# ICING Social Content Agent — Brand & Context

## העסק
שם: ICING (icing.co.il)
תחום: טבילות במי קרח וסדנאות חוויתיות — Cold Water Immersion
שפת תוכן: עברית בלבד
מיקום: הולון, תל-אביב

## קול המותג
- אמיתי, ישיר, לא מכירתי
- מבוסס מדע — אפשר להזכיר מחקרים בקצרה
- חם, אנרגטי, מעורר סקרנות
- מדבר בגוף ראשון ("נכנסנו למים ב-8 מעלות...")
- **אסור לחלוטין**: הבטחות רפואיות ("מרפא", "מונע", "מטפל", "מחלה")
- **אסור**: urgency מלאכותית

## עמודי תוכן (Content Pillars)
1. **מדע** — מה קורה לגוף/לנפש במים קרים, מחקרים, דופמין, קורטיזול
2. **חוויה** — behind the scenes, תגובות לקוחות, רגעים בסדנה
3. **myth-busting** — "לא צריך להיות ספורטאי", "קר זה לא רק גברים"
4. **טיפים** — הכנה לטבילה, נשימה, תזונה לפני
5. **behind the scenes** — הכנות, שאלות מהקהל, תהליך
6. **community** — שאלות לקהל, polls, testimonials

## פלטפורמות
| פלטפורמה | סגנון | אורך caption | hashtags |
|---|---|---|---|
| TikTok | אותנטי, מהיר | 2-4 שורות | 3-5 |
| Instagram Reels | ויזואלי, inspirational | 4-8 שורות | 8-12 |
| Instagram Feed | storytelling | 6-10 שורות | 10-15 |
| Facebook | הסברי, קהילתי | 8-15 שורות | 3-5 |

## ארכיטקטורה
```
social-content-agent/
├── CLAUDE.md
├── STRATEGY.md
├── MEMORY.md
├── .env.example
├── package.json
├── PROMPT_TO_BUILD.md
├── README.md
├── .claude/
│   ├── commands/ (ideas, write-post, write-reel, weekly-calendar, approve-post)
│   └── agents/ (idea-agent, writer-agent, brand-check-agent)
├── supabase/migrations/001_content_schema.sql
├── scripts/ (generate_ideas.ts, write_posts.ts, weekly_calendar.ts)
├── docs/ (content-pillars.md, platform-rules.md)
└── templates/ (tiktok.md, instagram_reel.md, instagram_feed.md, facebook.md)
```

## כללים קשיחים
1. לא לכתוב הבטחות רפואיות
2. לא לפרסם בלי approved_by_human = true
3. שפה: עברית, לא מיקסים עברית-אנגלית באמצע משפט
