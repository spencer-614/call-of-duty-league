-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE & ARENA
-- SCRIPT TO REMOVE ALL PLACEHOLDER / SEED TEAMS, PLAYERS, MATCHES & STATS
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query).
-- This script removes all dummy and placeholder data while preserving:
-- 1. All table schemas, constraints, indexes, triggers, and RLS security policies.
-- 2. Real registered user accounts in Supabase Auth (auth.users).
-- 3. Any custom announcements and season settings.
-- ==============================================================================

BEGIN;

-- 1. DELETE PLACEHOLDER PLAYER MAP STATS
DELETE FROM player_map_stats
WHERE player_id IN (
    SELECT id FROM players 
    WHERE gamertag IN (
        'Apex', 'Ghost', 'Viper', 'Blitz', 
        'Specter', 'Havoc', 'Zero', 'Ranger', 
        'Reaper', 'Pulse', 'Nova', 'Shadow', 
        'Titan', 'Flash', 'Echo', 'Phantom', 
        'btc', 'c0m-_-', 'Clix04', 'CoolRanchhh', 'Vortex'
    )
);

-- Also remove any map stats that reference placeholder opponent teams
DELETE FROM player_map_stats
WHERE opponent_team IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs');

-- 2. DELETE PLACEHOLDER VODS
DELETE FROM vods
WHERE title ILIKE '%Night Shift%' 
   OR title ILIKE '%Vantage%' 
   OR title ILIKE '%Redline%' 
   OR title ILIKE '%Static%'
   OR team1_id IN (SELECT id FROM teams WHERE name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs'))
   OR team2_id IN (SELECT id FROM teams WHERE name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs'));

-- 3. DELETE PLACEHOLDER SCHEDULED MATCHES
DELETE FROM scheduled_matches
WHERE team1_name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs')
   OR team2_name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs')
   OR team1_tag IN ('NSH', 'VTG', 'RED', 'STC', 'UND')
   OR team2_tag IN ('NSH', 'VTG', 'RED', 'STC', 'UND');

-- 4. DELETE PLACEHOLDER TEAM MAP RECORDS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_map_records') THEN
        DELETE FROM team_map_records
        WHERE team_id IN (SELECT id FROM teams WHERE name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs'));
    END IF;
END $$;

-- 5. DELETE PLACEHOLDER PLAYERS
DELETE FROM players
WHERE gamertag IN (
    'Apex', 'Ghost', 'Viper', 'Blitz', 
    'Specter', 'Havoc', 'Zero', 'Ranger', 
    'Reaper', 'Pulse', 'Nova', 'Shadow', 
    'Titan', 'Flash', 'Echo', 'Phantom', 
    'btc', 'c0m-_-', 'Clix04', 'CoolRanchhh', 'Vortex'
);

-- 6. DELETE PLACEHOLDER FRANCHISE TEAMS
DELETE FROM teams
WHERE name IN ('Night Shift', 'Vantage', 'Redline', 'Static', 'Underdogs')
   OR tag IN ('NSH', 'VTG', 'RED', 'STC', 'UND');

-- 7. DELETE SAMPLE / SEED LEAGUE SIGNUPS (keeping real user registrations)
DELETE FROM league_signups
WHERE gamertag = 'Invictus' OR discord_username = 'itzinvictus_';

-- ==============================================================================
-- ARENA LADDER SYSTEM PLACEHOLDERS
-- ==============================================================================

-- 8. DELETE LADDER DISPUTES (referencing placeholder ladder matches/teams)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ladder_disputes') THEN
        DELETE FROM ladder_disputes
        WHERE match_id IN (
            SELECT id FROM ladder_matches 
            WHERE team_a_id IN (SELECT id FROM ladder_teams WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL'))
               OR team_b_id IN (SELECT id FROM ladder_teams WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL'))
        )
        OR submitted_by ILIKE '%Apex Predators%'
        OR dispute_reason ILIKE '%Apex Predators%';
    END IF;
END $$;

-- 9. DELETE LADDER MATCHES / CHALLENGES (referencing placeholder ladder teams)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ladder_matches') THEN
        DELETE FROM ladder_matches
        WHERE team_a_id IN (SELECT id FROM ladder_teams WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL'))
           OR team_b_id IN (SELECT id FROM ladder_teams WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL'));
    END IF;
END $$;

-- 10. DELETE LADDER ROSTERS (referencing placeholder ladder teams)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ladder_rosters') THEN
        DELETE FROM ladder_rosters
        WHERE team_id IN (SELECT id FROM ladder_teams WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL'));
    END IF;
END $$;

-- 11. DELETE PLACEHOLDER LADDER TEAMS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ladder_teams') THEN
        DELETE FROM ladder_teams
        WHERE tag IN ('APEX', 'CRIM', 'GPRT', 'VNG', 'SBK', 'RREG', 'DEMN', 'SSD', 'BSR', 'LONE', 'QSG', 'VAL', 'PHNTM', 'NYSL')
           OR name IN (
               'Apex Predators', 'Crimson Syndicate', 'Ghost Protocol', 
               'Vanguard Prime', 'Sub Base Kings', 'Rookie Regime', 
               'Duo Demons', 'Silent Scope Duo', 'Bomb Site Rushers', 
               'Lone Wolf Solo', 'QuickScopeGod', 'Valkyrie Unit',
               'Phantom Five', 'Subliners Academy'
           );
    END IF;
END $$;

-- 12. DELETE PLACEHOLDER ARENA FREE AGENTS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'arena_free_agents') THEN
        DELETE FROM arena_free_agents
        WHERE gamertag IN ('GhostRider', 'Nyx', 'BulletProof', 'Valkyrie', 'StaticPulse', 'LoneReaper');
    END IF;
END $$;

COMMIT;

-- ==============================================================================
-- OPTIONAL: COMPLETE FRESH START (WIPE ALL DATA TABLES)
-- ==============================================================================
-- If you want to wipe ALL teams and players completely (starting 100% empty for new signups),
-- uncomment and run the following lines:
--
-- TRUNCATE TABLE player_map_stats, vods, scheduled_matches, players, teams CASCADE;
-- TRUNCATE TABLE ladder_disputes, ladder_matches, ladder_rosters, ladder_teams, arena_free_agents CASCADE;
