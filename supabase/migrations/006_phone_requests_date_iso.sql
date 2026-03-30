-- Add product_date_iso column to phone_requests
-- This stores the actual booking date/time as ISO string for calendar event generation

ALTER TABLE phone_requests
  ADD COLUMN IF NOT EXISTS product_date_iso TEXT;
