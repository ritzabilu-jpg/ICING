# חוויות שוויץ המדע – אפליקציית WEB

אפליקציית PWA למרכז הטבילה במי קרח, רחובות.

## הפעלה מהירה

### דרישות מוקדמות
- **Node.js 18+** – [הורידו כאן](https://nodejs.org/en/download)
- חשבון **Supabase** – [supabase.com](https://supabase.com) (חינמי)
- חשבון **Resend** – [resend.com](https://resend.com) (חינמי לשלב ה-MVP)

### 1. התקנת תלויות
```bash
npm install
```

### 2. הגדרת משתני סביבה
ערכו את קובץ `.env.local` עם הנתונים שלכם:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
RESEND_API_KEY=re_YOUR_KEY
EMAIL_FROM=noreply@yourdomain.co.il
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. הקמת בסיס הנתונים בSupabase
1. צרו פרויקט חדש ב-[supabase.com](https://supabase.com)
2. עברו ל-**SQL Editor**
3. הדביקו והריצו את תוכן `supabase/schema.sql`
4. העתיקו את `Project URL`, `anon key` ו-`service role key` ל-.env.local

### 4. הפעלת שרת הפיתוח
```bash
npm run dev
```
פתחו [http://localhost:3000](http://localhost:3000)

---

## מבנה הפרויקט

```
src/
├── app/
│   ├── page.tsx                    # דף הבית
│   ├── layout.tsx                  # Layout עם שני לוגואים (Header + Footer)
│   ├── globals.css                 # RTL + Tailwind
│   ├── booking/
│   │   ├── page.tsx                # תהליך ההזמנה (3 שלבים)
│   │   ├── success/page.tsx        # דף אישור הזמנה
│   │   └── failed/page.tsx         # דף כישלון תשלום
│   ├── health-form/page.tsx        # הצהרת בריאות + חתימה
│   ├── instructors/page.tsx        # עמוד המדריכים
│   └── api/
│       ├── workshops/route.ts      # GET סדנאות לפי חודש/סוג
│       ├── bookings/route.ts       # POST הזמנה חדשה + GET לפי ID
│       ├── health-declarations/    # POST הצהרת בריאות
│       └── waitlist/route.ts       # POST הצטרפות לרשימת המתנה
├── components/
│   ├── Header.tsx                  # שני לוגואים (RTL: ימין + שמאל)
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── WorkshopCard.tsx
│   ├── InstructorCard.tsx
│   ├── TestimonialsSection.tsx
│   └── booking/
│       ├── WorkshopTypeSelector.tsx
│       ├── CalendarView.tsx
│       ├── BookingForm.tsx
│       └── StepIndicator.tsx
├── lib/
│   ├── supabase.ts                 # supabaseClient + createAdminClient
│   ├── email.ts                    # Resend – אישור הזמנה
│   └── payment.ts                  # Tranzila URL builder
└── types/index.ts                  # TypeScript interfaces
```

## לוגואים
- `public/logo-havayot.png` – לוגו חוויות (מוצג בצד ימין בכל מסך)
- `public/logo-ice.png` – לוגו CWI/קרח (מוצג בצד שמאל בכל מסך)

## פיתוח עתידי (Phase 2)
- פרופיל משתמש + היסטוריית סדנאות
- פאנל ניהול (Admin Dashboard)
- תזכורות SMS אוטומטיות
- מאמרים רפואיים + מאגר מחקרי
- מנויים וכרטיסיות
- מערכת ביקורות ודירוגים

## אבטחה
- HTTPS/TLS על כל התקשורת
- `SUPABASE_SERVICE_ROLE_KEY` – שרת בלבד, לעולם לא קוד לקוח
- RLS (Row Level Security) על כל טבלאות Supabase
- Zod validation על כל ה-API routes
- תשלום דרך Tranzila hosted page (ללא עומס PCI DSS)
