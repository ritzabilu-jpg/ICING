-- ============================================================
-- Migration 004: Instructor Availability Schedule
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS instructor_availability (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  type          TEXT CHECK (type IN ('workshop','immersion')) NOT NULL,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  slot_index    INTEGER NOT NULL CHECK (slot_index BETWEEN 0 AND 2),
  from_time     TIME,
  to_time       TIME,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(instructor_id, type, day_of_week, slot_index)
);

CREATE TABLE IF NOT EXISTS instructor_blocked_dates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  from_date     DATE NOT NULL,
  to_date       DATE NOT NULL,
  reason        TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_blocked_instructor ON instructor_blocked_dates(instructor_id);
