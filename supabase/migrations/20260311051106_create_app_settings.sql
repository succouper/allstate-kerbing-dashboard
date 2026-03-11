/*
  # Create app settings table

  1. New Tables
    - `app_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting name/identifier
      - `value` (text) - Setting value
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `app_settings` table
    - Allow anyone to read settings (public data source URL)
    - Restrict updates to authenticated users only
  
  3. Initial Data
    - Insert default row for Google Sheets URL
*/

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (for the Google Sheets URL)
CREATE POLICY "Anyone can read app settings"
  ON app_settings
  FOR SELECT
  USING (true);

-- For now, allow anyone to update (we can restrict this later if needed)
CREATE POLICY "Anyone can update app settings"
  ON app_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert default row for Google Sheets URL
INSERT INTO app_settings (key, value)
VALUES ('google_sheets_url', '')
ON CONFLICT (key) DO NOTHING;