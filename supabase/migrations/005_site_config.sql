-- Site-wide key/value configuration
CREATE TABLE IF NOT EXISTS site_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- RLS: anyone can read, only authenticated users can write
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read site_config"
  ON site_config FOR SELECT USING (true);

CREATE POLICY "auth write site_config"
  ON site_config FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Default hero banner values
INSERT INTO site_config (key, value) VALUES
  ('hero_line1',  'SMASH'),
  ('hero_line2',  'IT.'),
  ('hero_tagline', 'Smasheria di Lamezia Terme. Doppia patty pressata sulla piastra, crosta caramellata, pane brioche tostato al burro. Senza compromessi.')
ON CONFLICT (key) DO NOTHING;
