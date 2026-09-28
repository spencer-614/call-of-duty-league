-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - ADMIN DATABASE PERMISSIONS & RLS POLICIES
-- Run this in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- Enables the Admin Portal (admin.html) to create, update, and manage teams, players, scores, and brackets.
-- ==============================================================================

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

-- 6. Enable admin status updates on SIGNUPS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' AND policyname = 'Enable update on league_signups'
    ) THEN
        CREATE POLICY "Enable update on league_signups" ON league_signups
            FOR UPDATE USING (true) WITH CHECK (true);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'org_signups') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'org_signups' AND policyname = 'Enable update on org_signups'
        ) THEN
            CREATE POLICY "Enable update on org_signups" ON org_signups
                FOR UPDATE USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;
