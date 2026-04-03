-- ============================================================
-- חוויות שוויץ המדע – Supabase Database Schema
-- הרץ את כל הסקריפט הזה ב-Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Instructors (no foreign keys, created first)
CREATE TABLE IF NOT EXISTS instructors (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  photo_url    TEXT,
  bio          TEXT DEFAULT '',
  specialties  TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  quote        TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Workshops
CREATE TABLE IF NOT EXISTS workshops (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type         TEXT CHECK (type IN ('individual', 'couple', 'team')) NOT NULL,
  title        TEXT NOT NULL,
  date_time    TIMESTAMPTZ NOT NULL,
  capacity     INTEGER NOT NULL CHECK (capacity > 0),
  seats_taken  INTEGER DEFAULT 0 CHECK (seats_taken >= 0),
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  description  TEXT DEFAULT '',
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT seats_not_exceed_capacity CHECK (seats_taken <= capacity)
);

-- Health declarations (created before bookings for FK direction flexibility)
CREATE TABLE IF NOT EXISTS health_declarations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id            UUID,  -- FK added after bookings
  has_heart_condition   BOOLEAN DEFAULT FALSE NOT NULL,
  has_hypertension      BOOLEAN DEFAULT FALSE NOT NULL,
  is_pregnant           BOOLEAN DEFAULT FALSE NOT NULL,
  has_raynauds          BOOLEAN DEFAULT FALSE NOT NULL,
  has_open_wounds       BOOLEAN DEFAULT FALSE NOT NULL,
  other_conditions      TEXT DEFAULT '',
  participant_name      TEXT NOT NULL,
  signature             TEXT NOT NULL,  -- base64 PNG data URL
  signed_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id       UUID REFERENCES workshops(id) ON DELETE RESTRICT NOT NULL,
  user_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  participants      INTEGER DEFAULT 1 CHECK (participants > 0),
  status            TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  payment_status    TEXT CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid',
  health_form_id    UUID REFERENCES health_declarations(id) ON DELETE SET NULL,
  confirmation_code TEXT UNIQUE NOT NULL,
  notes             TEXT DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from health_declarations back to bookings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_health_booking'
  ) THEN
    ALTER TABLE health_declarations
      ADD CONSTRAINT fk_health_booking
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  position    INTEGER NOT NULL,
  notified    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workshop_id, email)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops (date_time);
CREATE INDEX IF NOT EXISTS idx_workshops_type ON workshops (type);
CREATE INDEX IF NOT EXISTS idx_workshops_active ON workshops (is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_workshop ON bookings (workshop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings (confirmation_code);

-- ============================================================
-- ATOMIC SEAT RESERVATION FUNCTION
-- Prevents double-booking via row-level lock
-- ============================================================
CREATE OR REPLACE FUNCTION reserve_seat(p_workshop_id UUID, p_participants INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  -- Lock the workshop row to prevent concurrent modifications
  SELECT (capacity - seats_taken) INTO v_available
  FROM workshops
  WHERE id = p_workshop_id AND is_active = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF v_available >= p_participants THEN
    UPDATE workshops
    SET seats_taken = seats_taken + p_participants
    WHERE id = p_workshop_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Rollback function (called if booking insert fails after seat reservation)
CREATE OR REPLACE FUNCTION release_seat(p_workshop_id UUID, p_participants INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE workshops
  SET seats_taken = GREATEST(0, seats_taken - p_participants)
  WHERE id = p_workshop_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Public read on workshops and instructors
DROP POLICY IF EXISTS "workshops_public_read" ON workshops;
CREATE POLICY "workshops_public_read" ON workshops
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "instructors_public_read" ON instructors;
CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT USING (is_active = TRUE);

-- Anyone can insert bookings (API validates before insert)
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
CREATE POLICY "bookings_public_insert" ON bookings
  FOR INSERT WITH CHECK (TRUE);

-- Anyone can insert waitlist entries
DROP POLICY IF EXISTS "waitlist_public_insert" ON waitlist;
CREATE POLICY "waitlist_public_insert" ON waitlist
  FOR INSERT WITH CHECK (TRUE);

-- Note: All reads of bookings and health_declarations go through
-- API Routes using the service role key (bypasses RLS)

-- ============================================================
-- SEED DATA – Instructors
-- ============================================================
INSERT INTO instructors (name, bio, specialties, certifications, quote) VALUES
(
  'יוסי כהן',
  'מדריך אימון קר מוסמך עם 5 שנות ניסיון בשיטת Cold Water Immersion. ' ||
  'מתמחה בליווי ספורטאים ואנשי עסקים לשיפור ביצועים מנטליים ופיזיים.',
  ARRAY['אימון קר', 'טכניקות נשימה', 'ביצועי שיא', 'מיינדפולנס'],
  ARRAY['CWI Instructor Level 2', 'מאמן כושר מוסמך (מכון וינגייט)'],
  'הקור הוא המאמן הכנה ביותר שתמצא. הוא לא משקר.'
),
(
  'מירה לוי',
  'פיזיותרפיסטית וחוקרת השפעות הקור על מערכת העצבים. מביאה גישה מדעית ' ||
  'ומבוססת מחקר לכל סדנה, עם דגש על בטיחות ושיקום.',
  ARRAY['פיזיותרפיה', 'שיקום', 'מדע הקור', 'נשימה טיפולית'],
  ARRAY['פיזיותרפיה B.Sc.', 'CWI Instructor Certified'],
  'כאשר הגוף מתמודד עם אי-נוחות בצורה מבוקרת, הנפש מתחזקת.'
),
(
  'אמיר שלום',
  'לשעבר קצין ייחודי, היום מדריך חוסן מנטלי לצוותי עבודה ואנשי מפתח. ' ||
  'מתמחה בגיבוש קבוצות ובניית ביטחון עצמי קולקטיבי תחת לחץ.',
  ARRAY['גיבוש צוותים', 'חוסן מנטלי', 'מנהיגות', 'ביצועים תחת לחץ'],
  ARRAY['CWI Group Instructor', 'קורס מנחה קבוצות מוסמך'],
  'חוסן לא בנוי ברגעי נוחות. הוא נבנה בדיוק ברגעים כאלה.'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA – Sample upcoming workshops
-- (Update dates to be in the future!)
-- ============================================================
DO $$
DECLARE
  v_instructor_id UUID;
BEGIN
  SELECT id INTO v_instructor_id FROM instructors WHERE name = 'יוסי כהן' LIMIT 1;

  INSERT INTO workshops (type, title, date_time, capacity, price, instructor_id, description)
  VALUES
  (
    'individual',
    'סדנת יחידים – טבילת קרח בקבוצה',
    NOW() + INTERVAL '3 days' + TIME '09:00',
    10, 300, v_instructor_id,
    'סדנה מלאה הכוללת תרגול נשימה, הכנה מנטלית וטבילה מודרכת.'
  ),
  (
    'individual',
    'סדנת יחידים – טבילת קרח בקבוצה',
    NOW() + INTERVAL '7 days' + TIME '09:00',
    10, 300, v_instructor_id,
    'סדנה מלאה הכוללת תרגול נשימה, הכנה מנטלית וטבילה מודרכת.'
  ),
  (
    'individual',
    'סדנת יחידים – טבילת קרח בקבוצה',
    NOW() + INTERVAL '10 days' + TIME '18:00',
    10, 300, v_instructor_id,
    'סדנת ערב – טבילה מודרכת עם הקבוצה.'
  ),
  (
    'couple',
    'סדנת זוגות – חוויה זוגית אינטימית',
    NOW() + INTERVAL '5 days' + TIME '11:00',
    2, 800, v_instructor_id,
    'חוויה זוגית בלתי נשכחת. הדרכה פרטית לשניים.'
  )
  ON CONFLICT DO NOTHING;
END $$;


-- ============================================================
-- Lior Katz personal session bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS lior_bookings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_slot  TEXT NOT NULL,   -- '08:00' | '09:30' | '11:00'
  slot_date  TEXT NOT NULL DEFAULT '19.3.2026',
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slot count queries
CREATE INDEX IF NOT EXISTS lior_bookings_time_slot ON lior_bookings(time_slot);

-- RLS: service role only (no public access)
ALTER TABLE lior_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- מערכת משתמשים פשוטה (ללא Supabase Auth)
-- ============================================================

CREATE TABLE IF NOT EXISTS visitor_profiles (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      TEXT NOT NULL,
  phone     TEXT UNIQUE NOT NULL,
  role      TEXT NOT NULL DEFAULT 'user', -- 'user' | 'instructor' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS immersion_sessions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id              UUID NOT NULL REFERENCES visitor_profiles(id) ON DELETE CASCADE,
  session_date            DATE NOT NULL,
  session_time            TIME NOT NULL,
  temperature_celsius     DECIMAL(4,1),
  duration_minutes        INTEGER NOT NULL DEFAULT 0,
  instructor_name         TEXT DEFAULT '',
  instructor_notes        TEXT DEFAULT '',
  visitor_notes           TEXT DEFAULT '',
  photo_url               TEXT,
  status                  TEXT CHECK(status IN ('planned','done','cancelled')) DEFAULT 'planned',
  logged_by               UUID REFERENCES visitor_profiles(id) ON DELETE SET NULL,
  logged_at               TIMESTAMPTZ DEFAULT NOW(),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_imm_visitor ON immersion_sessions(visitor_id, session_date DESC);

CREATE TABLE IF NOT EXISTS daily_health_checks (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id                UUID NOT NULL REFERENCES visitor_profiles(id) ON DELETE CASCADE,
  check_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  check_type                TEXT CHECK(check_type IN ('daily','yearly')) NOT NULL DEFAULT 'daily',
  feels_healthy             BOOLEAN NOT NULL DEFAULT false,
  no_fever                  BOOLEAN NOT NULL DEFAULT false,
  feeling_good              BOOLEAN NOT NULL DEFAULT false,
  submitted_by              UUID REFERENCES visitor_profiles(id) ON DELETE SET NULL,
  submitted_at              TIMESTAMPTZ DEFAULT NOW(),
  yearly_expires_at         DATE,
  UNIQUE(visitor_id, check_date, check_type)
);
CREATE INDEX IF NOT EXISTS idx_hc_date ON daily_health_checks(check_date, visitor_id);
CREATE INDEX IF NOT EXISTS idx_hc_yearly_expiry ON daily_health_checks(yearly_expires_at);

-- Immersion event participants (checklist per event for instructors/admin)
CREATE TABLE IF NOT EXISTS immersion_event_participants (
  id                             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type                     TEXT CHECK(event_type IN ('workshop','immersion_slot')) NOT NULL,
  event_id                       UUID NOT NULL,
  visitor_id                     UUID NOT NULL REFERENCES visitor_profiles(id) ON DELETE CASCADE,
  daily_check_completed          BOOLEAN DEFAULT FALSE,
  yearly_declaration_completed   BOOLEAN DEFAULT FALSE,
  daily_checked_at               TIMESTAMPTZ,
  yearly_checked_at              TIMESTAMPTZ,
  created_at                     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_type, event_id, visitor_id)
);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON immersion_event_participants(event_type, event_id);

-- ============================================================
-- Immersion Slots & Bookings (managed by admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS immersion_slots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_date        DATE NOT NULL,
  slot_time        TIME NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 10,
  notes            TEXT DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS immersion_bookings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id        UUID NOT NULL REFERENCES immersion_slots(id) ON DELETE CASCADE,
  visitor_name   TEXT NOT NULL,
  visitor_phone  TEXT NOT NULL,
  package_type   TEXT NOT NULL CHECK (package_type IN ('single','5pack','10pack')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Phase 2: Email OTP Auth + Role Management + Instructor CRUD
-- Run these in Supabase SQL Editor (idempotent)
-- ============================================================

-- Make phone nullable (allow email-only registration)
ALTER TABLE visitor_profiles ALTER COLUMN phone DROP NOT NULL;

-- Add email + OTP fields
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS otp_code TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ;

-- Unique index on email (nulls are not considered duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS visitor_profiles_email_unique
  ON visitor_profiles(email) WHERE email IS NOT NULL;

-- Instructors: add missing fields for full management
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS slug         TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS phone        TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS email_contact TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS female        BOOLEAN DEFAULT FALSE;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS sort_order    INTEGER DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS instructors_slug_unique
  ON instructors(slug) WHERE slug IS NOT NULL;

-- Seed the real instructors (safe upsert by slug)
INSERT INTO instructors (name, slug, bio, specialties, certifications, quote, photo_url, female, sort_order, is_active) VALUES
(
  'גילה גרוס קורנט', 'gila-gross',
  'סדנה בדגש חוסן רגשי, לקחת את הניצחון האתגר, לחיי היום יום לבניית חוסן מנטלי. מעבירה את הסדנאות בעברית ואנגלית.',
  ARRAY['חוסן רגשי','חוסן מנטלי','טכניקות נשימה','הידרותרפיסטית','מוסמכת וואטסו','מדריכת שחיה','מדריכת אקווה ג''ים'],
  ARRAY['הידרותרפיסטית מוסמכת','CWI Instructor Certified'],
  'בין השקט של הקרח לעוצמה של הגוף, לבנות חוסן מנטלי, שקט פנימי ואנרגיה חדשה.',
  '/gila-gross.jpg', TRUE, 1, TRUE
),
(
  'יסמין חמוד', 'yasmin-hamoud',
  'מטפלת ומנחה סדנאות טבילה בבריכת קרח, מורה ליוגה, מאמנת ומדריכת שחייה.' || chr(10) ||
  'מלווה יחידים וקבוצות בתהליכים של חיזוק חוסן מנטלי דרך נשימה, תנועה וחשיפה מבוקרת לקור.' || chr(10) ||
  'מעבירה סדנת יוגה דינמית בשילוב תרגילי נשימה ומיינדפולנס.',
  ARRAY['מיינדפולנס','יוגה','Rebirthing'],
  ARRAY['CWI Instructor Certified','הידרותרפיסטית מוסמכת'],
  'להרפות בתוך הקור – ולמצוא בו כוח.',
  '/yasmin-hamoud.jpg', TRUE, 2, TRUE
),
(
  'ורד פקטור', 'vered-factor',
  'מדריכת שחייה והידרותרפיסטית.' || chr(10) ||
  'מעבירה סדנאות עם דגשים ליתרונות התרגול וההשפעה החיובית בגילאי 40-55 לגברים ולנשים.',
  ARRAY['הידרותרפיה','מדריכת שחייה','גילאי 40-55'],
  ARRAY['הידרותרפיסטית מוסמכת','CWI Instructor Certified'],
  'היכולת להישאר בתוך אי נוחות, היא שריר שאפשר לאמן וזה משפיע באופן מפתיע לטובה, על איזורים לא צפויים בחיים.',
  '/vered-factor.jpg', TRUE, 3, TRUE
),
(
  'ליאור כ"ץ', 'lior-katz',
  'פיזיותרפיסט מ-2001, גיטריסט ומדריך קורס מדריכי טבילה במי קרח. מנחה תהליכי התפתחות יכולת אישית דרך הטבילה.',
  ARRAY['גיבוש צוותים','הדרכת חוסן מנטלי','קורס מדריכים'],
  ARRAY['פיזיותרפיסט מוסמך משרד הבריאות','CWI Group Instructor','מנחה קורס מדריכים'],
  'אנחנו נבנים מחוץ לאיזור הנוחות. כאן במי הקרח, זה המקום האידיאלי בשביל זה.',
  '/lior-katz.jpg', FALSE, 4, TRUE
),
(
  'גיא רייבנבך', 'guy-ravnbach',
  'בעל תואר ראשון בחינוך גופני, מדריך קארטה בעל ניסיון עם טכניקות נשימה, הרפיה, מדיטציה וצ''י קונג.',
  ARRAY['טכניקות נשימה','מדיטציה','צ''י קונג'],
  ARRAY['תואר ראשון חינוך גופני','CWI Instructor Certified'],
  'במפגש עם הקור אנו לומדים לא להילחם, אלא להרפות — ומתוך ההרפיה נוצר כוח שקט שעוזר לנו להתמודד עם אתגרי החיים.',
  '/guy-ravnbach.jpg', FALSE, 5, TRUE
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, bio = EXCLUDED.bio, specialties = EXCLUDED.specialties,
  certifications = EXCLUDED.certifications, quote = EXCLUDED.quote,
  photo_url = EXCLUDED.photo_url, female = EXCLUDED.female,
  sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active;

-- Update Guy's facebook_url and phone
UPDATE instructors SET facebook_url = 'https://www.facebook.com/share/1KpjfpeyKV/', phone = '052-8761110'
WHERE slug = 'guy-ravnbach';

UPDATE instructors SET email_contact = 'vered79@gmail.com' WHERE slug = 'vered-factor';

-- ============================================================
-- Migration: Dual-role instructor assignment for workshops
-- ============================================================

-- Add roles column to instructors
ALTER TABLE instructors
  ADD COLUMN IF NOT EXISTS roles text[] DEFAULT ARRAY['immersion_guide', 'workshop_facilitator'];

-- Add dual-role columns to instructor_workshops
ALTER TABLE instructor_workshops
  ADD COLUMN IF NOT EXISTS immersion_guide_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS workshop_facilitator_id UUID REFERENCES instructors(id) ON DELETE SET NULL;

-- Backfill: if existing instructor_name matches a known instructor, set both IDs
-- (run manually after adding columns if needed)
-- UPDATE instructor_workshops iw
--   SET immersion_guide_id = i.id, workshop_facilitator_id = i.id
--   FROM instructors i
--   WHERE iw.instructor_name = i.name
--   AND iw.immersion_guide_id IS NULL;
