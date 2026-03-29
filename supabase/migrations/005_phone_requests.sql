CREATE TABLE IF NOT EXISTS phone_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_hours TEXT NOT NULL,
  product_title TEXT,
  product_date TEXT,
  product_time TEXT,
  booking_id UUID,
  confirmation_code TEXT NOT NULL,
  callback_deadline TIMESTAMPTZ NOT NULL,
  handled_at TIMESTAMPTZ,
  notes TEXT
);
