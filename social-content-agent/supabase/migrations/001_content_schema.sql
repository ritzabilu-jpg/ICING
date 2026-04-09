-- ICING Social Content Agent — DB Schema

CREATE TYPE content_pillar AS ENUM ('science','experience','myth','tips','bts','community');
CREATE TYPE content_platform AS ENUM ('tiktok','instagram_reel','instagram_feed','facebook','all');
CREATE TYPE content_type AS ENUM ('video','carousel','image','text');
CREATE TYPE post_status AS ENUM (
  'idea','draft','brand_check_pass','brand_check_fail',
  'pending_approval','approved','scheduled','published','rejected','archived'
);

-- content_ideas
CREATE TABLE content_ideas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar           content_pillar NOT NULL,
  platform         content_platform NOT NULL DEFAULT 'all',
  angle            TEXT NOT NULL,
  hook_suggestion  TEXT,
  content_type     content_type NOT NULL DEFAULT 'video',
  estimated_effort TEXT CHECK (estimated_effort IN ('low','medium','high')) DEFAULT 'medium',
  notes            TEXT,
  created_by       TEXT NOT NULL DEFAULT 'agent',
  used             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- social_posts
CREATE TABLE social_posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id            UUID REFERENCES content_ideas(id) ON DELETE SET NULL,
  platform           content_platform NOT NULL,
  hook               TEXT NOT NULL,
  caption            TEXT NOT NULL,
  on_screen_text     JSONB DEFAULT '[]',
  video_script       TEXT,
  cta                TEXT,
  hashtags           JSONB DEFAULT '[]',
  visual_direction   TEXT,
  draft_caption      TEXT,
  brand_check_result JSONB,
  brand_score        INTEGER CHECK (brand_score BETWEEN 1 AND 10),
  status             post_status NOT NULL DEFAULT 'draft',
  approved_by_human  BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at        TIMESTAMPTZ,
  scheduled_for      TIMESTAMPTZ,
  published_at       TIMESTAMPTZ,
  notes              TEXT,
  created_by         TEXT NOT NULL DEFAULT 'agent',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- content_calendar
CREATE TABLE content_calendar (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start  DATE NOT NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  platform    content_platform NOT NULL,
  post_id     UUID REFERENCES social_posts(id) ON DELETE SET NULL,
  idea_id     UUID REFERENCES content_ideas(id) ON DELETE SET NULL,
  slot_label  TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- content_activities
CREATE TABLE content_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  activity   TEXT NOT NULL,
  actor      TEXT NOT NULL DEFAULT 'agent',
  payload    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ideas_updated BEFORE UPDATE ON content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- indexes
CREATE INDEX idx_ideas_pillar ON content_ideas(pillar);
CREATE INDEX idx_ideas_platform ON content_ideas(platform);
CREATE INDEX idx_ideas_used ON content_ideas(used);
CREATE INDEX idx_posts_status ON social_posts(status);
CREATE INDEX idx_posts_platform ON social_posts(platform);
CREATE INDEX idx_posts_approved ON social_posts(approved_by_human);
CREATE INDEX idx_calendar_week ON content_calendar(week_start);

-- views
CREATE VIEW pending_approval AS
  SELECT sp.id, sp.platform, sp.hook, sp.caption,
    sp.hashtags, sp.visual_direction, sp.brand_score,
    ci.pillar, ci.angle, sp.created_at
  FROM social_posts sp
  LEFT JOIN content_ideas ci ON ci.id = sp.idea_id
  WHERE sp.status = 'pending_approval' AND sp.approved_by_human = FALSE
  ORDER BY sp.created_at DESC;

CREATE VIEW unused_ideas AS
  SELECT * FROM content_ideas WHERE used = FALSE ORDER BY created_at DESC;

-- RLS
ALTER TABLE content_ideas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar  ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_content_ideas"     ON content_ideas     FOR ALL USING (true);
CREATE POLICY "all_social_posts"      ON social_posts      FOR ALL USING (true);
CREATE POLICY "all_content_calendar"  ON content_calendar  FOR ALL USING (true);
CREATE POLICY "all_content_activities" ON content_activities FOR ALL USING (true);

-- seed data
INSERT INTO content_ideas (pillar, platform, angle, hook_suggestion, content_type, estimated_effort, created_by) VALUES
  ('science','tiktok','מה קורה לגוף ב-8 מעלות — 3 שלבים','הגוף שלך לא מוכן לזה...','video','low','human'),
  ('myth','instagram_reel','מים קרים הם לא רק לספורטאים','חשבתם שזה רק לספורטאים? טעיתם','video','low','human'),
  ('experience','instagram_feed','מה שינתה טבילה אחת בשבילי','נכנסתי למים ב-6 מעלות...','image','medium','human');
