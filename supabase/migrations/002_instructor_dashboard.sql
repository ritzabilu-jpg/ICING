-- ============================================================
-- Migration 002: Instructor Dashboard support
-- Run in Supabase SQL Editor
-- ============================================================

-- Add location field to immersion_slots
ALTER TABLE immersion_slots ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';

-- Add declaration checkboxes directly on bookings
ALTER TABLE immersion_bookings ADD COLUMN IF NOT EXISTS daily_check_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE immersion_bookings ADD COLUMN IF NOT EXISTS yearly_declaration_completed BOOLEAN DEFAULT FALSE;
