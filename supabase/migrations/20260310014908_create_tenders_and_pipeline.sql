-- AllState Kerbing Tender Management System
-- 
-- 1. New Tables
--    - tenders: All tender data including project details, budget, location, dates
--    - pipeline_data: Pipeline tracking (status, owner, deadlines, notes)
-- 
-- 2. Security
--    - Enable RLS on both tables
--    - Public read access (internal tool, no auth required initially)

CREATE TABLE IF NOT EXISTS tenders (
  id integer PRIMARY KEY,
  name text NOT NULL,
  location text DEFAULT '',
  builder text DEFAULT '',
  budget text DEFAULT '',
  budget_min decimal DEFAULT 0,
  budget_max decimal DEFAULT 0,
  distance text DEFAULT '',
  distance_km decimal DEFAULT 0,
  category text DEFAULT 'Other',
  closes text DEFAULT '',
  closes_sort integer DEFAULT 99999999,
  region text DEFAULT '',
  tender_site text DEFAULT '',
  tender_type text DEFAULT '',
  kerb_relevance text DEFAULT '',
  urgent boolean DEFAULT false,
  gc boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id integer NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  status text DEFAULT '',
  owner text DEFAULT '',
  deadline date,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tender_id)
);

ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tenders"
  ON tenders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert tenders"
  ON tenders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update tenders"
  ON tenders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete tenders"
  ON tenders FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Public can read pipeline_data"
  ON pipeline_data FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert pipeline_data"
  ON pipeline_data FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update pipeline_data"
  ON pipeline_data FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete pipeline_data"
  ON pipeline_data FOR DELETE
  TO anon
  USING (true);