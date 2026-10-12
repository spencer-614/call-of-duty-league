-- ==============================================================================
-- FRONTLINE CALL OF DUTY LEAGUE - TOURNAMENT PLAYERS TABLE MIGRATION
-- ==============================================================================
-- Creates the dedicated public.tournament_players table for players who sign in
-- with Discord for open tournaments. Keeps them separate from franchised league
-- free agents (public.league_signups) and draft boards.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tournament_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    gamertag TEXT NOT NULL,
    discord_name TEXT,
    discord_id TEXT,
    activision_id TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'Tournament Player',
    status TEXT DEFAULT 'Active',
    team_name TEXT DEFAULT 'Free Agent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid lookup by gamertag, discord handle, or auth user ID
CREATE INDEX IF NOT EXISTS idx_tournament_players_gamertag ON public.tournament_players (gamertag);
CREATE INDEX IF NOT EXISTS idx_tournament_players_discord ON public.tournament_players (discord_name);
CREATE INDEX IF NOT EXISTS idx_tournament_players_user ON public.tournament_players (user_id);

-- Row Level Security (RLS) policies allowing public read & writes
ALTER TABLE public.tournament_players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all tournament_players" ON public.tournament_players;
CREATE POLICY "Allow public all tournament_players" ON public.tournament_players FOR ALL USING (true) WITH CHECK (true);
