-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - DISCORD BOT REGISTRATION MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. Add discord_user_id column if it doesn't already exist
ALTER TABLE league_signups 
ADD COLUMN IF NOT EXISTS discord_user_id TEXT;

-- 2. Add Unique Constraint on discord_user_id (prevents duplicate player registrations)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'league_signups_discord_user_id_unique'
    ) THEN
        ALTER TABLE league_signups 
        ADD CONSTRAINT league_signups_discord_user_id_unique UNIQUE (discord_user_id);
    END IF;
END $$;

-- 3. Create index for high-speed lookups by discord_user_id
CREATE INDEX IF NOT EXISTS idx_league_signups_discord_user_id 
ON league_signups (discord_user_id);

-- 4. HARDEN SECURITY: Ensure public 'anon' website callers cannot forge discord_user_id
-- Website visitors submit free agent signups where discord_user_id is NULL.
-- The official Discord Bot submits verified discord_user_id via the secure Edge Function (service_role).
DO $$
BEGIN
    -- Drop old wide-open insert policy if present
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' 
        AND policyname = 'Allow public insert on league_signups'
    ) THEN
        DROP POLICY "Allow public insert on league_signups" ON league_signups;
    END IF;

    -- Replace with secure policy: anon can only insert when discord_user_id IS NULL
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' 
        AND policyname = 'Allow public website insert without discord_id'
    ) THEN
        CREATE POLICY "Allow public website insert without discord_id" ON league_signups
            FOR INSERT WITH CHECK (discord_user_id IS NULL);
    END IF;

    -- Public read policy (allows standings/players to view status)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'league_signups' 
        AND policyname = 'Allow public read on league_signups'
    ) THEN
        CREATE POLICY "Allow public read on league_signups" ON league_signups
            FOR SELECT USING (true);
    END IF;
END $$;
