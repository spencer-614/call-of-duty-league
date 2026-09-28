-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - ADMIN DATABASE PERMISSIONS & RLS POLICIES
-- Run this in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- Enables the Admin Portal (admin.html) to create, update, and manage teams, players, scores, and brackets.
-- ==============================================================================

-- 0. Ensure players table has wins, losses, activision_id, and discord_name columns
ALTER TABLE players ADD COLUMN IF NOT EXISTS wins INT DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS losses INT DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS activision_id TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS discord_name TEXT;

-- 1. Enable full write access on TEAMS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'teams' AND policyname = 'Enable all access on teams'
    ) THEN
        CREATE POLICY "Enable all access on teams" ON teams
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 2. Enable full write access on PLAYERS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'players' AND policyname = 'Enable all access on players'
    ) THEN
        CREATE POLICY "Enable all access on players" ON players
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 3. Enable full write access on VODS / LIVESTREAMS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vods' AND policyname = 'Enable all access on vods'
    ) THEN
        CREATE POLICY "Enable all access on vods" ON vods
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 4. Enable full write access on PLAYER MAP STATS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'player_map_stats' AND policyname = 'Enable all access on player_map_stats'
    ) THEN
        CREATE POLICY "Enable all access on player_map_stats" ON player_map_stats
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 5. Enable full write access on TOURNAMENT MATCHES & DIVISIONS (if created)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tournament_matches') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'tournament_matches' AND policyname = 'Enable all access on tournament_matches'
        ) THEN
            CREATE POLICY "Enable all access on tournament_matches" ON tournament_matches
                FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tournament_divisions') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'tournament_divisions' AND policyname = 'Enable all access on tournament_divisions'
        ) THEN
            CREATE POLICY "Enable all access on tournament_divisions" ON tournament_divisions
                FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

-- 6. Enable full admin access (INSERT, UPDATE, DELETE) on SIGNUPS
DO $$
BEGIN
    -- Drop old restrictive update-only policy on league_signups if present
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' AND policyname = 'Enable update on league_signups'
    ) THEN
        DROP POLICY "Enable update on league_signups" ON league_signups;
    END IF;

    -- Enable all operations on league_signups (SELECT, INSERT, UPDATE, DELETE)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' AND policyname = 'Enable all access on league_signups'
    ) THEN
        CREATE POLICY "Enable all access on league_signups" ON league_signups
            FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Explicit DELETE policy on league_signups
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' AND policyname = 'Enable delete on league_signups'
    ) THEN
        CREATE POLICY "Enable delete on league_signups" ON league_signups
            FOR DELETE USING (true);
    END IF;

    -- Enable full access on org_signups
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'org_signups') THEN
        IF EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'org_signups' AND policyname = 'Enable update on org_signups'
        ) THEN
            DROP POLICY "Enable update on org_signups" ON org_signups;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'org_signups' AND policyname = 'Enable all access on org_signups'
        ) THEN
            CREATE POLICY "Enable all access on org_signups" ON org_signups
                FOR ALL USING (true) WITH CHECK (true);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'org_signups' AND policyname = 'Enable delete on org_signups'
        ) THEN
            CREATE POLICY "Enable delete on org_signups" ON org_signups
                FOR DELETE USING (true);
        END IF;
    END IF;
END $$;

-- 7. Enable full access on LEAGUE ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS league_announcements (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    tag TEXT DEFAULT 'Official Update',
    tag_color TEXT DEFAULT 'lime',
    link_url TEXT,
    link_text TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE league_announcements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_announcements' 
        AND policyname = 'Allow public read on league_announcements'
    ) THEN
        CREATE POLICY "Allow public read on league_announcements" ON league_announcements
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_announcements' 
        AND policyname = 'Enable all access on league_announcements'
    ) THEN
        CREATE POLICY "Enable all access on league_announcements" ON league_announcements
            FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
