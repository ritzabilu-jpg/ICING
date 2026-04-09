# 🚀 ICING Social Content Agent — Build Prompt for Claude Code

העתק את כל הטקסט הזה ל-Claude Code ב-Plan Mode.

---

אני מפתח את ICING — עסק לטבילות וסדנאות מי קרח (icing.co.il).
אני רוצה לבנות Social Content Agent מלא שמייצר פוסטים לTikTok, Instagram ו-Facebook בעברית.

**קרא תחילה את כל הקבצים:**
- CLAUDE.md, STRATEGY.md, MEMORY.md
- templates/*.md, docs/*.md
- .claude/agents/*.md, .claude/commands/*.md

**לאחר הקריאה, בנה שלב אחר שלב:**

---

### שלב 1: Supabase Schema
הרץ את supabase/migrations/001_content_schema.sql.
ודא שנוצרו: content_ideas, social_posts, content_calendar, content_activities, views.

---

### שלב 2: Admin Dashboard — /admin/content
Next.js App Router, RTL, עברית, dir="rtl".

**4 טאבים:**

**טאב "רעיונות":**
- רשימת content_ideas (pillar badge, platform, angle, effort, used flag)
- מסנן לפי pillar ו-platform
- כפתור "כתוב פוסט" לכל רעיון

**טאב "פוסטים":**
- רשימת social_posts עם status badge צבעוני:
  - draft = אפור, pending_approval = כתום, approved = ירוק, rejected = אדום
- filter לפי status ו-platform

**טאב "לאישור" (הכי חשוב):**
- מציג pending_approval view
- כל פוסט מוצג בכרטיס עם:
  - platform badge
  - hook (גדול ובולט)
  - caption מלא
  - hashtags
  - visual_direction (אם יש)
  - brand_score (1-10 עם צבע)
  - שלושה כפתורים: ✅ אשר (ירוק) | ✏️ ערוך (כתום) | ❌ דחה (אדום)
- Approve: PATCH /api/content/posts/[id]/approve
- Reject: PATCH /api/content/posts/[id]/reject
- Edit: inline editing של caption

**טאב "לוח שבועי":**
- date picker לבחירת שבוע
- טבלה 7 ימים × פלטפורמות
- כל תא מציג: pillar icon, angle, status

---

### שלב 3: API Routes

**POST /api/content/ideas**
Body: `{ ideas: Idea[] }`
שמור ב-content_ideas, החזר ids.

**POST /api/content/posts**
Body: `{ idea_id, platform, post_data }`
שמור ב-social_posts status='draft', החזר post_id.

**PATCH /api/content/posts/[id]/approve**
Headers: Authorization: Bearer $CRON_SECRET
Update: approved_by_human=true, status='approved', approved_at=now()
Insert ל-content_activities: activity='approved', actor='human'

**PATCH /api/content/posts/[id]/reject**
Update: status='rejected'
Insert ל-content_activities: activity='rejected', actor='human'

**GET /api/content/pending**
החזר pending_approval view עם pagination.

**GET /api/content/calendar?week=YYYY-MM-DD**
החזר content_calendar join עם posts ו-ideas.

**POST /api/content/calendar**
Body: `{ entries: CalendarEntry[] }`
שמור content_calendar.

---

### שלב 4: Review Interface — /admin/content/review
ממשק אישור מהיר "Tinder-style":
- מציג פוסט אחד בכל פעם מ-pending_approval
- כפתורים גדולים: ✅ אשר / ❌ דחה / ✏️ ערוך
- אחרי פעולה → טוען הפוסט הבא אוטומטית
- Counter: "נותרו X פוסטים לאישור"

---

### שלב 5: Weekly Digest Page — /admin/content/digest
- query param: ?week=YYYY-MM-DD
- מציג סיכום שבועי:
  - כמה פוסטים approved
  - כמה pending_approval
  - כמה ideas שלא נכתבו
  - לוח שבועי ויזואלי

---

### כללי פיתוח
- TypeScript + Next.js 15 App Router
- Supabase JS עם service role ב-server components
- UI מינימלי ופונקציונלי — לא צריך עיצוב מפואר
- RTL, עברית, dir="rtl" על כל דף
- Server Actions לאופרציות כתיבה
- לא לפרסם לרשתות חברתיות אוטומטית — רק לסמן approved

---

### לאחר הבנייה הצג:
1. רשימת כל הקבצים שנוצרו
2. הוראות הפעלה: npm install && npm run dev
3. URL: http://localhost:3001/admin/content
4. הוראות לרצת ה-SQL schema ב-Supabase

אם יש שאלות לפני שמתחיל — שאל. אחרת, תתחיל עם שלב 1.
