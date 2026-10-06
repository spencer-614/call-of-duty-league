-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - ANNOUNCEMENT IMAGE EMBEDDING MIGRATION
-- Run this script in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. Add image_url and image_fit columns to league_announcements if not exists
ALTER TABLE IF EXISTS league_announcements 
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE IF EXISTS league_announcements 
ADD COLUMN IF NOT EXISTS image_fit TEXT DEFAULT 'contain';

-- 2. Verify Table Schema Comments
COMMENT ON COLUMN league_announcements.image_url IS 'Direct URL or Base64 data URI of media graphic embedded with the announcement';
COMMENT ON COLUMN league_announcements.image_fit IS 'Scale/fit mode for display: contain (full visible auto-scaled), cover (cinematic crop), banner (panoramic header)';
