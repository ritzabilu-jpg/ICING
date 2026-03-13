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
-- Auth & User Profiles
-- ============================================================

-- Extended profile per auth user
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT DEFAULT '',
  phone        TEXT DEFAULT '',
  role         TEXT NOT NULL DEFAULT 'user', -- 'user' | 'instructor' | 'admin'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.phone::text, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- Immersion Sessions Journal
-- ============================================================
CREATE TABLE IF NOT EXISTS immersion_sessions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date        DATE NOT NULL,
  session_time        TIME,
  instructor_name     TEXT DEFAULT '',
  temperature_celsius DECIMAL(4,1),
  duration_minutes    INTEGER NOT NULL DEFAULT 0,
  notes               TEXT DEFAULT '',
  recorded_by         UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS immersion_sessions_user_date ON immersion_sessions(user_id, session_date DESC);

ALTER TABLE immersion_sessions ENABLE ROW LEVEL SECURITY;
-- Users read their own sessions; instructors/admins write via service role (API)
CREATE POLICY "users_own_sessions" ON immersion_sessions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Subscriptions / Membership Packages
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name        TEXT NOT NULL,
  sessions_total   INTEGER NOT NULL,
  sessions_used    INTEGER NOT NULL DEFAULT 0,
  valid_until      DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id ON subscriptions(user_id);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
