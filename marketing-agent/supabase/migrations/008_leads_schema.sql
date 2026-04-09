-- ICING Marketing Agent — Leads Schema (001)

CREATE TYPE lead_type AS ENUM ('workshop','individual','instructor_course','collaboration','medical_question','other');
CREATE TYPE lead_heat AS ENUM ('hot','medium','cold');
CREATE TYPE lead_status AS ENUM ('new','pending_approval','approved','sent','replied','booked','lost','not_relevant');
CREATE TYPE lead_source AS ENUM ('website_form','whatsapp_direct','instagram','facebook','referral','phone','email','other');

CREATE TABLE IF NOT EXISTS public.leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  phone                 VARCHAR(30),
  email                 VARCHAR(255),
  message               TEXT,
  source                lead_source DEFAULT 'other',
  lead_type             lead_type DEFAULT 'other',
  heat                  lead_heat DEFAULT 'cold',
  score                 INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  score_breakdown       JSONB,
  status                lead_status DEFAULT 'new',
  require_human_review  BOOLEAN DEFAULT false,
  approved_by_human     BOOLEAN DEFAULT false,
  draft_message         TEXT,
  last_sent_message     TEXT,
  last_contacted_at     TIMESTAMPTZ,
  next_follow_up        TIMESTAMPTZ,
  agent_notes           TEXT,
  manual_notes          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type         VARCHAR(50) NOT NULL,
  description  TEXT,
  payload      JSONB,
  performed_by VARCHAR(50) DEFAULT 'agent',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.message_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  lead_type  lead_type,
  heat       lead_heat,
  content    TEXT NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date     DATE NOT NULL UNIQUE,
  new_leads       INTEGER DEFAULT 0,
  pending_count   INTEGER DEFAULT 0,
  sent_count      INTEGER DEFAULT 0,
  booked_count    INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2),
  summary         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_status        ON public.leads(status);
CREATE INDEX idx_leads_heat          ON public.leads(heat);
CREATE INDEX idx_leads_next_followup ON public.leads(next_follow_up);
CREATE INDEX idx_leads_created_at    ON public.leads(created_at DESC);
CREATE INDEX idx_activities_lead_id  ON public.lead_activities(lead_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ language 'plpgsql';

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "access_leads" ON public.leads FOR ALL
  USING (auth.role() IN ('authenticated','service_role'));
CREATE POLICY "access_activities" ON public.lead_activities FOR ALL
  USING (auth.role() IN ('authenticated','service_role'));
CREATE POLICY "access_templates" ON public.message_templates FOR ALL
  USING (auth.role() IN ('authenticated','service_role'));

INSERT INTO public.message_templates (name, lead_type, heat, content) VALUES
('סדנה קבוצתית - חמה','workshop','hot',
 E'היי {name},\nתודה שפנית! נשמע שאתם מחפשים חוויה קבוצתית מיוחדת.\nכמה אנשים בתוכנית לסדנה, ומה התאריכים הנוחים לכם?\nליאור'),
('טבילה פרטית - חמה','individual','hot',
 E'היי {name},\nתודה שפנית!\nמתי נוח לך לקבוע, ומה הניע אותך לפנות דווקא עכשיו?\nליאור'),
('קורס מדריכים','instructor_course','medium',
 E'היי {name},\nתודה על ההתעניינות בקורס המדריכים!\nתוכל לספר לי קצת על הרקע המקצועי שלך?\nליאור'),
('שאלה רפואית','medical_question','medium',
 E'היי {name},\nתודה שפנית — שאלתך חשובה לי.\nאחזור אליך ישירות בקרוב.\nליאור');
