-- ─────────────────────────────────────────────────────────────────────────────
-- add_health_consent_forms.sql
-- Health consent / pre-immersion declaration form storage
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS health_consent_forms (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL    DEFAULT now(),

  -- Personal details
  full_name                TEXT        NOT NULL,
  id_number                TEXT,
  birth_date               DATE        NOT NULL,
  phone                    TEXT        NOT NULL,
  email                    TEXT        NOT NULL,
  emergency_contact_name   TEXT        NOT NULL,
  emergency_contact_phone  TEXT        NOT NULL,
  is_over_18               BOOLEAN     NOT NULL    DEFAULT false,

  -- Health questionnaire (JSONB array of {id, num, text, answer, detail, is_blocking})
  health_answers           JSONB       NOT NULL    DEFAULT '[]',

  -- Blocking logic
  was_blocked              BOOLEAN     NOT NULL    DEFAULT false,
  blocking_reasons         TEXT[],                 -- question IDs that triggered hard-stop

  -- Consent
  acknowledgments          JSONB       NOT NULL    DEFAULT '[]', -- boolean[]
  privacy_consent          BOOLEAN     NOT NULL    DEFAULT false,
  signature_name           TEXT        NOT NULL,
  signature_date           DATE        NOT NULL,
  pre_submit_confirmation  BOOLEAN     NOT NULL    DEFAULT false,

  -- Admin workflow
  status                   TEXT        NOT NULL    DEFAULT 'pending',
  -- values: 'pending' | 'approved' | 'requires_review' | 'rejected'
  admin_notes              TEXT,

  -- Optional metadata
  session_date             DATE,
  coach_name               TEXT,
  branch                   TEXT,
  lead_source              TEXT
);

-- Speed up common admin queries
CREATE INDEX IF NOT EXISTS health_consent_forms_created_at_idx
  ON health_consent_forms (created_at DESC);

CREATE INDEX IF NOT EXISTS health_consent_forms_status_idx
  ON health_consent_forms (status);

CREATE INDEX IF NOT EXISTS health_consent_forms_full_name_idx
  ON health_consent_forms (full_name);

-- Row-level security: block direct anon access; all writes go through service-role API
ALTER TABLE health_consent_forms ENABLE ROW LEVEL SECURITY;

-- No public policies — only the service-role key (createAdminClient) can read/write
