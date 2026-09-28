-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - SEASON SETTINGS TABLE & PERMISSIONS
-- Run this script in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. Create League Settings Table
CREATE TABLE IF NOT EXISTS league_settings (
    id TEXT PRIMARY KEY,                             -- Key identifier: 'season'
    season_number INT DEFAULT 1,                     -- Current or upcoming season number (1, 2, 3...)
    status_state TEXT DEFAULT 'active',              -- 'active' or 'coming_soon'
    status_text TEXT DEFAULT 'SEASON 1 ACTIVE',       -- Computed display text e.g. 'SEASON 1 ACTIVE' or 'SEASON 2 COMING SOON'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE league_settings ENABLE ROW LEVEL SECURITY;

-- 3. Allow Public Read Access (so all website visitors fetch current season status)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_settings' 
        AND policyname = 'Allow public read on league_settings'
    ) THEN
        CREATE POLICY "Allow public read on league_settings" ON league_settings
            FOR SELECT USING (true);
    END IF;
END $$;

-- 4. Enable Full Admin Write Access (INSERT, UPDATE, UPSERT from admin console)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_settings' 
        AND policyname = 'Enable all access on league_settings'
    ) THEN
        CREATE POLICY "Enable all access on league_settings" ON league_settings
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 5. Seed default Season 1 Active if empty
INSERT INTO league_settings (id, season_number, status_state, status_text)
VALUES ('season', 1, 'active', 'SEASON 1 ACTIVE')
ON CONFLICT (id) DO NOTHING;
