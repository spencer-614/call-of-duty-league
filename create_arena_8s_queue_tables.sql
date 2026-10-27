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

-- Seed default 8's Leaderboard Roster with accurate initial CDL MMR ratings
INSERT INTO public.arena_8s_leaderboard (id, gamertag, activision_id, role, elo, tier, wins, losses, matches_played, streak, avatar_url)
VALUES
    ('lead_hydra', 'HyDra', 'HyDra#5512', 'Entry SMG', 1370, 'Apex Elite', 28, 7, 35, '5W', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    ('lead_simp', 'Simp', 'Simp#7712', 'Entry SMG', 1360, 'Apex Elite', 25, 8, 33, '3W', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'),
    ('lead_abezy', 'aBeZy', 'aBeZy#1111', 'Entry SMG', 1355, 'Apex Elite', 24, 9, 33, '2W', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    ('lead_shotzzy', 'Shotzzy', 'Shotzzy#4021', 'Entry SMG', 1350, 'Apex Elite', 22, 9, 31, '2W', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'),
    ('lead_scrap', 'Scrap', 'Scrap#2144', 'Main AR', 1345, 'Apex Elite', 21, 10, 31, '1W', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
    ('lead_dashy', 'Dashy', 'Dashy#1999', 'Main AR', 1340, 'Apex Elite', 20, 10, 30, '4W', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
    ('lead_cleanx', 'CleanX', 'CleanX#9102', 'Entry SMG', 1335, 'Commander', 19, 11, 30, '2W', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'),
    ('lead_cellium', 'Cellium', 'Cellium#3312', 'Flex', 1330, 'Commander', 19, 11, 30, '1L', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80'),
    ('lead_drazah', 'Drazah', 'Drazah#8821', 'Flex', 1330, 'Commander', 18, 12, 30, '1W', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
    ('lead_envoy', 'Envoy', 'Envoy#3141', 'Entry SMG', 1325, 'Commander', 18, 12, 30, '3W', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'),
    ('lead_pred', 'Pred', 'Pred#9941', 'Entry SMG', 1320, 'Commander', 17, 13, 30, '1L', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
    ('lead_ghosty', 'Ghosty', 'Ghosty#6621', 'Flex', 1320, 'Commander', 17, 13, 30, '2W', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
    ('lead_insight', 'Insight', 'Insight#4192', 'Main AR', 1315, 'Commander', 16, 14, 30, '1W', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80'),
    ('lead_kenny', 'Kenny', 'Kenny#8812', 'Flex', 1310, 'Commander', 16, 14, 30, '1L', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'),
    ('lead_gwinn', 'Gwinn', 'Gwinn#5514', 'Entry SMG', 1310, 'Commander', 15, 15, 30, '2W', 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=150&auto=format&fit=crop&q=80'),
    ('lead_sib', 'Sib', 'Sib#7718', 'Flex', 1310, 'Commander', 15, 15, 30, '1W', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80'),
    ('lead_kismet', 'KiSMET', 'KiSMET#4412', 'Entry SMG', 1305, 'Commander', 15, 15, 30, '1L', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
    ('lead_attach', 'Attach', 'Attach#7821', 'Main AR', 1305, 'Commander', 14, 16, 30, '1W', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80'),
    ('lead_skyz', 'Skyz', 'Skyz#2214', 'Main AR', 1300, 'Commander', 14, 16, 30, '2L', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'),
    ('lead_standy', 'Standy', 'Standy#9912', 'Entry SMG', 1285, 'Warlord', 13, 17, 30, '1L', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (gamertag) DO NOTHING;

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

