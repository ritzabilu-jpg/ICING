-- ============================================================
-- Migration 003: Per-instructor slot assignment
-- Run in Supabase SQL Editor
-- ============================================================

-- Link immersion_slots to a specific instructor
ALTER TABLE immersion_slots
  ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL;

-- Add declaration checkboxes to workshop bookings as well
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS daily_check_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS yearly_declaration_completed BOOLEAN DEFAULT FALSE;
