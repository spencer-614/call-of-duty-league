-- ==============================================================================
-- FRONTLINE ARENA - ARENA 8's MATCHMAKING QUEUE & LOBBY SCHEMA
-- ==============================================================================
-- Powers the Arena 8's queue, NeatQueue-style Captains Draft, Active Match Lobby,
-- MW4 6v6 Map Rotation Series (Hardpoint, Search & Destroy, Hijack), and 8's Player MMR Leaderboard.
-- ==============================================================================

-- 1. ARENA 8'S LIVE QUEUE TABLE
CREATE TABLE IF NOT EXISTS public.arena_8s_queues (
    id TEXT PRIMARY KEY DEFAULT 'queue_default',
    queue_name TEXT NOT NULL DEFAULT 'Frontline Arena 8s (MW4 4v4)',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'drafting', 'in_match'
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_players INT NOT NULL DEFAULT 8,
    active_match_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default queue record if missing
INSERT INTO public.arena_8s_queues (id, queue_name, status, players, max_players)
VALUES ('queue_default', 'Frontline Arena 8s (MW4 4v4)', 'open', '[]'::jsonb, 8)
ON CONFLICT (id) DO NOTHING;

-- 2. ARENA 8'S MATCH SESSIONS & CAPTAINS DRAFT TABLE
CREATE TABLE IF NOT EXISTS public.arena_8s_matches (
    id TEXT PRIMARY KEY,
    match_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'drafting', -- 'drafting', 'in_progress', 'completed', 'cancelled'
    format TEXT NOT NULL DEFAULT '4v4 MW4 Variant',
    draft_mode TEXT NOT NULL DEFAULT 'captains', -- 'captains' or 'random'
    captain_a JSONB,
    captain_b JSONB,
    team_a JSONB NOT NULL DEFAULT '[]'::jsonb,
    team_b JSONB NOT NULL DEFAULT '[]'::jsonb,
    draft_pool JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_pick_team TEXT DEFAULT 'team_a',
    pick_turn INT DEFAULT 1,
    coin_flip_winner TEXT DEFAULT 'team_a',
    host_player JSONB,
    maps JSONB NOT NULL DEFAULT '[]'::jsonb,
    series_score JSONB NOT NULL DEFAULT '{"team_a": 0, "team_b": 0}'::jsonb,
    winning_team TEXT,
    chat_messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_arena_8s_matches_status ON public.arena_8s_matches (status);
CREATE INDEX IF NOT EXISTS idx_arena_8s_matches_created ON public.arena_8s_matches (created_at DESC);

-- 3. ARENA 8'S MMR LEADERBOARD & RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.arena_8s_leaderboard (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    gamertag TEXT NOT NULL UNIQUE,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
    activision_id TEXT,
    elo INT DEFAULT 1200,
    tier TEXT DEFAULT 'Specialist',
    role TEXT DEFAULT 'Flex',
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    matches_played INT DEFAULT 0,
    streak TEXT DEFAULT '—',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arena_8s_lead_elo ON public.arena_8s_leaderboard (elo DESC);
CREATE INDEX IF NOT EXISTS idx_arena_8s_lead_gamertag ON public.arena_8s_leaderboard (LOWER(gamertag));

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.arena_8s_queues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all arena_8s_queues" ON public.arena_8s_queues;
CREATE POLICY "Allow public all arena_8s_queues" ON public.arena_8s_queues FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.arena_8s_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all arena_8s_matches" ON public.arena_8s_matches;
CREATE POLICY "Allow public all arena_8s_matches" ON public.arena_8s_matches FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.arena_8s_leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all arena_8s_leaderboard" ON public.arena_8s_leaderboard;
CREATE POLICY "Allow public all arena_8s_leaderboard" ON public.arena_8s_leaderboard FOR ALL USING (true) WITH CHECK (true);

