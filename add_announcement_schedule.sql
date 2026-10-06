-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - ANNOUNCEMENT SCHEDULING MIGRATION
-- Run this script in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. Add scheduled_for column to league_announcements if not exists
ALTER TABLE IF EXISTS league_announcements 
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;

-- 2. Verify Table Schema Comments
COMMENT ON COLUMN league_announcements.scheduled_for IS 'Target release timestamp. If NULL or <= NOW(), the announcement is immediately live on the homepage.';
