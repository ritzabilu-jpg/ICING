-- Migration: checkout v2 columns and payment attempts table
-- Run: supabase db push  (or paste into Supabase SQL editor)

-- Make workshop_id nullable so draft bookings for immersion slots work
ALTER TABLE bookings ALTER COLUMN workshop_id DROP NOT NULL;

-- Add city column (used for participant details in checkout)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';

-- Add checkout columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method TEXT
  CHECK (payment_method IN ('credit','bit','paybox','phone','none'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS session_token TEXT UNIQUE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS callback_window TEXT;

-- Payment attempts tracking
CREATE TABLE IF NOT EXISTS payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('credit','bit','paybox','phone')),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated','success','failed','pending_verification')),
  provider_ref TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
