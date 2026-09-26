// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - SUPABASE CLIENT CONFIGURATION
// ==============================================================================
// 1. Go to your Supabase project dashboard (https://supabase.com/dashboard)
// 2. Click "Project Settings" (gear icon) -> "API"
// 3. Copy your "Project URL" and "anon public" API key and paste them below:
// ==============================================================================

const RAW_SUPABASE_URL = "https://sllilxkbmxheclhgstcq.supabase.co/rest/v1/"; // e.g. https://xyzcompany.supabase.co
// Sanitize URL by removing trailing /rest/v1 or trailing slash so Supabase SDK routes properly
const SUPABASE_URL = RAW_SUPABASE_URL ? RAW_SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "") : "";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbGlseGtibXhoZWNsaGdzdGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTkzMjYsImV4cCI6MjEwNTk3NTMyNn0.SKF3AueHX_70LQHeRrRlMvKvJ4coH_1kgg60zsp1LDM"; // e.g. eyJhbGciOi...

// Helper to determine if actual Supabase credentials have been entered
const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL &&
    SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
  );
};

// PayPal League Configuration
// Replace paypalUsername with your PayPal.me username (e.g. 'frontlineleague' for paypal.me/frontlineleague/25)
// or replace receiverEmail with your PayPal email.
const PAYPAL_CONFIG = {
  entryFeeUSD: 25.00,
  paypalUsername: "frontlinecdl", 
  receiverEmail: "admin@frontlineleague.com"
};

// Initialize Supabase Client if library is loaded and configured
let dbClient = null;
if (window.supabase && isSupabaseConfigured()) {
  dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Fallback Mock Data (displayed if Supabase credentials have not been configured yet)
const MOCK_DATA = {
  teams: [
    { id: 1, name: "Night Shift", tag: "NSH", wins: 5, losses: 1, points: 50 },
    { id: 2, name: "Vantage", tag: "VTG", wins: 4, losses: 2, points: 40 },
    { id: 3, name: "Redline", tag: "RED", wins: 3, losses: 3, points: 30 },
    { id: 4, name: "Static", tag: "STC", wins: 1, losses: 5, points: 10 }
  ],
  players: [
    { id: 1, gamertag: "Apex", discord_name: "Apex", activision_id: "Apex#8392014", role: "SMG", rank: "1.5", status: "Active", kdr: 1.28, total_kills: 342, total_deaths: 267, teams: { name: "Night Shift", tag: "NSH" } },
    { id: 2, gamertag: "Ghost", discord_name: "Ghost", activision_id: "Ghost#4920111", role: "Main AR", rank: "1.0", status: "Active", kdr: 1.15, total_kills: 298, total_deaths: 259, teams: { name: "Night Shift", tag: "NSH" } },
    { id: 3, gamertag: "Viper", discord_name: "Viper", activision_id: "Viper#9382012", role: "Flex", rank: "1.0", status: "Active", kdr: 1.05, total_kills: 275, total_deaths: 262, teams: { name: "Night Shift", tag: "NSH" } },
    { id: 4, gamertag: "Blitz", discord_name: "Blitz", activision_id: "Blitz#1928374", role: "SMG", rank: "0.5", status: "Active", kdr: 0.98, total_kills: 250, total_deaths: 255, teams: { name: "Night Shift", tag: "NSH" } },
    { id: 5, gamertag: "Specter", discord_name: "Specter", activision_id: "Specter#7492810", role: "Main AR", rank: "1.5", status: "Active", kdr: 1.22, total_kills: 310, total_deaths: 254, teams: { name: "Vantage", tag: "VTG" } },
    { id: 6, gamertag: "Havoc", discord_name: "Havoc", activision_id: "Havoc#6291038", role: "SMG", rank: "1.0", status: "Active", kdr: 1.10, total_kills: 290, total_deaths: 263, teams: { name: "Vantage", tag: "VTG" } },
    { id: 7, gamertag: "Zero", discord_name: "Zero", activision_id: "Zero#8192039", role: "Flex", rank: "0.5", status: "Active", kdr: 1.02, total_kills: 260, total_deaths: 255, teams: { name: "Vantage", tag: "VTG" } },
    { id: 8, gamertag: "Ranger", discord_name: "Ranger", activision_id: "Ranger#3918274", role: "SMG", rank: "0.5", status: "Active", kdr: 0.95, total_kills: 230, total_deaths: 242, teams: { name: "Vantage", tag: "VTG" } },
    { id: 9, gamertag: "Reaper", discord_name: "Reaper", activision_id: "Reaper#2918374", role: "Main AR", rank: "1.5", status: "Active", kdr: 1.18, total_kills: 305, total_deaths: 258, teams: { name: "Redline", tag: "RED" } },
    { id: 10, gamertag: "Pulse", discord_name: "Pulse", activision_id: "Pulse#8472910", role: "SMG", rank: "1.0", status: "Active", kdr: 1.04, total_kills: 280, total_deaths: 270, teams: { name: "Redline", tag: "RED" } },
    { id: 11, gamertag: "Titan", discord_name: "Titan", activision_id: "Titan#3829104", role: "Main AR", rank: "1.0", status: "Active", kdr: 1.06, total_kills: 265, total_deaths: 250, teams: { name: "Static", tag: "STC" } },
    { id: 12, gamertag: "Flash", discord_name: "Flash", activision_id: "Flash#1948201", role: "SMG", rank: "0.5", status: "Active", kdr: 0.94, total_kills: 235, total_deaths: 250, teams: { name: "Static", tag: "STC" } },
    // Free Agents & Community entries from Directory
    { id: 13, gamertag: "btc", discord_name: "btc", activision_id: "btc#4380973", role: "Flex", rank: "0.5", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 14, gamertag: "c0m-_-", discord_name: "c0m-_-", activision_id: "c0m#1095449", role: "SMG", rank: "0.5", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 15, gamertag: "Clix04", discord_name: "Clix04", activision_id: "[LFT]Maddengamer04#2877956", role: "Main AR", rank: "0.5", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 16, gamertag: "CoolRanchhh", discord_name: "CoolRanchhh", activision_id: "CoolRanch#7450412", role: "SMG", rank: "0.5", status: "Active", kdr: 0.54, total_kills: 142, total_deaths: 263, teams: { name: "Underdogs", tag: "UND" }, team_name: "Underdogs" },
    { id: 17, gamertag: "Vortex", discord_name: "Vortex", activision_id: "Vortex#8291034", role: "Flex", rank: "1.0", status: "Pending", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Unassigned" },
    { id: 18, gamertag: "Shadow", discord_name: "Shadow", activision_id: "Shadow#9102938", role: "Sniper", rank: "0.5", status: "Former", kdr: 1.12, total_kills: 410, total_deaths: 366, teams: null, team_name: "Retired" }
  ],
  vods: [
    {
      id: 1,
      title: "Frontline Championship — Night Shift vs Vantage",
      stage: "Grand Finals",
      is_live: true,
      team1_score: 3,
      team2_score: 1,
      team1: { name: "Night Shift" },
      team2: { name: "Vantage" },
      vod_url: "callofduty"
    },
    {
      id: 2,
      title: "Redline vs Static — Week 3 Hardpoint Clash",
      stage: "Week 3",
      is_live: false,
      team1_score: 3,
      team2_score: 2,
      team1: { name: "Redline" },
      team2: { name: "Static" },
      vod_url: "https://twitch.tv/callofduty"
    }
  ],
  map_stats: {
    1: [ // Apex (Night Shift)
      { id: 1, map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Vantage", kills: 32, deaths: 21, damage: 4820, kdr: 1.52, result: "W", score: "250 - 210", match_date: "2026-09-24" },
      { id: 2, map_name: "Highrise", game_mode: "Search & Destroy", opponent_team: "Vantage", kills: 9, deaths: 5, damage: 1450, kdr: 1.80, result: "W", score: "6 - 4", match_date: "2026-09-24" },
      { id: 3, map_name: "Invasion", game_mode: "Control", opponent_team: "Vantage", kills: 24, deaths: 19, damage: 3610, kdr: 1.26, result: "L", score: "2 - 3", match_date: "2026-09-24" },
      { id: 4, map_name: "Sub Base", game_mode: "Hardpoint", opponent_team: "Redline", kills: 29, deaths: 22, damage: 4390, kdr: 1.32, result: "W", score: "250 - 195", match_date: "2026-09-18" },
      { id: 5, map_name: "Rio", game_mode: "Search & Destroy", opponent_team: "Redline", kills: 11, deaths: 4, damage: 1820, kdr: 2.75, result: "W", score: "6 - 2", match_date: "2026-09-18" }
    ],
    2: [ // Ghost (Night Shift)
      { id: 6, map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Vantage", kills: 26, deaths: 18, damage: 4410, kdr: 1.44, result: "W", score: "250 - 210", match_date: "2026-09-24" },
      { id: 7, map_name: "Highrise", game_mode: "Search & Destroy", opponent_team: "Vantage", kills: 7, deaths: 6, damage: 1200, kdr: 1.17, result: "W", score: "6 - 4", match_date: "2026-09-24" },
      { id: 8, map_name: "Invasion", game_mode: "Control", opponent_team: "Vantage", kills: 21, deaths: 20, damage: 3450, kdr: 1.05, result: "L", score: "2 - 3", match_date: "2026-09-24" },
      { id: 9, map_name: "Sub Base", game_mode: "Hardpoint", opponent_team: "Redline", kills: 27, deaths: 19, damage: 4100, kdr: 1.42, result: "W", score: "250 - 195", match_date: "2026-09-18" }
    ],
    5: [ // Specter (Vantage)
      { id: 10, map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Night Shift", kills: 29, deaths: 24, damage: 4650, kdr: 1.21, result: "L", score: "210 - 250", match_date: "2026-09-24" },
      { id: 11, map_name: "Highrise", game_mode: "Search & Destroy", opponent_team: "Night Shift", kills: 8, deaths: 7, damage: 1310, kdr: 1.14, result: "L", score: "4 - 6", match_date: "2026-09-24" },
      { id: 12, map_name: "Invasion", game_mode: "Control", opponent_team: "Night Shift", kills: 27, deaths: 18, damage: 4120, kdr: 1.50, result: "W", score: "3 - 2", match_date: "2026-09-24" },
      { id: 13, map_name: "6 Star", game_mode: "Hardpoint", opponent_team: "Static", kills: 34, deaths: 21, damage: 5100, kdr: 1.62, result: "W", score: "250 - 180", match_date: "2026-09-17" }
    ],
    9: [ // Reaper (Redline)
      { id: 14, map_name: "Sub Base", game_mode: "Hardpoint", opponent_team: "Night Shift", kills: 26, deaths: 25, damage: 4120, kdr: 1.04, result: "L", score: "195 - 250", match_date: "2026-09-18" },
      { id: 15, map_name: "Rio", game_mode: "Search & Destroy", opponent_team: "Night Shift", kills: 6, deaths: 7, damage: 980, kdr: 0.86, result: "L", score: "2 - 6", match_date: "2026-09-18" },
      { id: 16, map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Static", kills: 31, deaths: 20, damage: 4750, kdr: 1.55, result: "W", score: "250 - 220", match_date: "2026-09-11" }
    ]
  }
};

// Unified Data Access API
window.LeagueDB = {
  // 1. Fetch Teams Standings
  async getStandings() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .select("*")
          .order("points", { ascending: false })
          .order("wins", { ascending: false });
        if (!error && data && data.length > 0) return data;
        console.warn("Supabase fetch returned empty/error, using fallback:", error);
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }
    return MOCK_DATA.teams;
  },

  // 1b. Fetch Teams with their Roster of Players
  async getTeamsWithPlayers() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .select("*, players(*)")
          .order("points", { ascending: false });
        if (!error && data && data.length > 0) return data;
        console.warn("Supabase fetch returned empty/error, using fallback:", error);
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }
    return MOCK_DATA.teams.map(team => ({
      ...team,
      players: MOCK_DATA.players.filter(p => p.teams?.name === team.name)
    }));
  },

  // 2. Fetch Players with Team info & Directory details
  async getPlayers() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("players")
          .select("*, teams(name, tag)")
          .order("kdr", { ascending: false });

        let signups = [];
        try {
          const { data: sData } = await dbClient
            .from("league_signups")
            .select("*")
            .order("created_at", { ascending: false });
          if (sData) signups = sData;
        } catch (_) {}

        if (!error && data && data.length > 0) {
          const existingTags = new Set(data.map(p => (p.gamertag || "").toLowerCase()));
          const signupEntries = signups
            .filter(s => s.gamertag && !existingTags.has(s.gamertag.toLowerCase()))
            .map((s, idx) => ({
              id: `signup-${s.id || idx}`,
              gamertag: s.gamertag,
              discord_name: s.discord_username || s.gamertag,
              activision_id: s.activision_id || "—",
              role: s.role || "Flex",
              rank: "0.5",
              status: s.registration_type === "Free Agent" ? "Free Agent" : (s.status || "Pending"),
              kdr: null,
              total_kills: 0,
              total_deaths: 0,
              teams: s.team_name ? { name: s.team_name, tag: s.team_name.substring(0, 3).toUpperCase() } : null,
              team_name: s.team_name || (s.registration_type === "Free Agent" ? "Free Agent" : "Unassigned")
            }));

          return [
            ...data.map(p => ({
              ...p,
              discord_name: p.discord_name || p.gamertag,
              activision_id: p.activision_id || `${p.gamertag}#${Math.floor(1000000 + (p.id * 123456) % 9000000)}`,
              rank: p.rank || (p.kdr >= 1.2 ? "1.5" : (p.kdr >= 1.0 ? "1.0" : "0.5")),
              status: p.status || (p.teams ? "Active" : "Free Agent"),
              team_name: p.teams?.name || p.team_name || "Free Agent"
            })),
            ...signupEntries
          ];
        }
        console.warn("Supabase fetch returned empty/error, using fallback:", error);
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }
    return MOCK_DATA.players;
  },

  // 3. Fetch All VODs / Matches
  async getVODs() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("vods")
          .select("*, team1:team1_id(name), team2:team2_id(name)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) return data;
        console.warn("Supabase fetch returned empty/error, using fallback:", error);
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }
    return MOCK_DATA.vods;
  },

  // 4. Fetch Active LIVE Streams Only
  async getLiveStreams() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("vods")
          .select("*, team1:team1_id(name), team2:team2_id(name)")
          .eq("is_live", true)
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase live query error:", err);
      }
    }
    return MOCK_DATA.vods.filter(v => v.is_live);
  },

  // 5. Fetch Past Recorded VODs Only
  async getPastVODs() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("vods")
          .select("*, team1:team1_id(name), team2:team2_id(name)")
          .eq("is_live", false)
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase VODs query error:", err);
      }
    }
    return MOCK_DATA.vods.filter(v => !v.is_live);
  },

  // Helper to format Twitch embed URLs with automatic parent hostname
  getTwitchEmbedUrl(input) {
    if (!input) return "";
    let host = window.location.hostname;
    if (!host || host === "") host = "localhost";

    if (input.includes("player.twitch.tv")) {
      const url = new URL(input);
      if (!url.searchParams.has("parent")) url.searchParams.set("parent", host);
      return url.toString();
    }
    const videoMatch = input.match(/videos\/(\d+)/);
    if (videoMatch) {
      return `https://player.twitch.tv/?video=${videoMatch[1]}&parent=${host}&autoplay=false`;
    }
    const clipMatch = input.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/) || input.match(/\/clip\/([A-Za-z0-9_-]+)/);
    if (clipMatch) {
      return `https://clips.twitch.tv/embed?clip=${clipMatch[1]}&parent=${host}`;
    }
    const channelUrlMatch = input.match(/twitch\.tv\/([A-Za-z0-9_]+)/);
    if (channelUrlMatch) {
      return `https://player.twitch.tv/?channel=${channelUrlMatch[1]}&parent=${host}&autoplay=false`;
    }
    if (/^\d+$/.test(input.trim())) {
      return `https://player.twitch.tv/?video=${input.trim()}&parent=${host}&autoplay=false`;
    }
    const cleanChannel = input.replace(/[@#]/g, "").trim();
    return `https://player.twitch.tv/?channel=${cleanChannel}&parent=${host}&autoplay=false`;
  },

  // 6. Fetch Single Player Details
  async getPlayerById(playerId) {
    if (dbClient) {
      try {
        if (/^\d+$/.test(String(playerId))) {
          const { data, error } = await dbClient
            .from("players")
            .select("*, teams(name, tag)")
            .eq("id", playerId)
            .single();
          if (!error && data) return data;
        } else if (String(playerId).startsWith("signup-")) {
          const rawId = String(playerId).replace("signup-", "");
          const { data, error } = await dbClient
            .from("league_signups")
            .select("*")
            .eq("id", rawId)
            .single();
          if (!error && data) {
            return {
              id: playerId,
              gamertag: data.gamertag,
              discord_name: data.discord_username || data.gamertag,
              activision_id: data.activision_id || "—",
              role: data.role || "Flex",
              rank: "0.5",
              status: data.registration_type === "Free Agent" ? "Free Agent" : (data.status || "Pending"),
              kdr: null,
              total_kills: 0,
              total_deaths: 0,
              team_name: data.team_name || "Free Agent"
            };
          }
        }
      } catch (err) {
        console.error("Supabase getPlayerById error:", err);
      }
    }
    return MOCK_DATA.players.find(p => String(p.id) === String(playerId));
  },

  // 7. Fetch Individual Map Stats for a specific player
  async getPlayerMapStats(playerId) {
    if (dbClient) {
      try {
        if (/^\d+$/.test(String(playerId))) {
          const { data, error } = await dbClient
            .from("player_map_stats")
            .select("*")
            .eq("player_id", playerId)
            .order("match_date", { ascending: false });
          if (!error && data && data.length > 0) return data;
        }
      } catch (err) {
        console.error("Supabase map stats error:", err);
      }
    }
    if (MOCK_DATA.map_stats && MOCK_DATA.map_stats[playerId]) {
      return MOCK_DATA.map_stats[playerId];
    }
    const player = MOCK_DATA.players.find(p => String(p.id) === String(playerId));
    if (!player || player.kdr == null) {
      return [];
    }
    const baseKd = Number(player.kdr || 1.0);
    return [
      { id: 101, map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Opponent", kills: Math.round(25 * baseKd), deaths: 20, damage: Math.round(3900 * baseKd), kdr: Number((25 * baseKd / 20).toFixed(2)), result: "W", score: "250 - 215", match_date: "2026-09-24" },
      { id: 102, map_name: "Highrise", game_mode: "Search & Destroy", opponent_team: "Opponent", kills: Math.round(8 * baseKd), deaths: 6, damage: Math.round(1250 * baseKd), kdr: Number((8 * baseKd / 6).toFixed(2)), result: "W", score: "6 - 4", match_date: "2026-09-24" },
      { id: 103, map_name: "Invasion", game_mode: "Control", opponent_team: "Opponent", kills: Math.round(21 * baseKd), deaths: 19, damage: Math.round(3200 * baseKd), kdr: Number((21 * baseKd / 19).toFixed(2)), result: "L", score: "2 - 3", match_date: "2026-09-18" },
      { id: 104, map_name: "Sub Base", game_mode: "Hardpoint", opponent_team: "Opponent", kills: Math.round(28 * baseKd), deaths: 22, damage: Math.round(4200 * baseKd), kdr: Number((28 * baseKd / 22).toFixed(2)), result: "W", score: "250 - 190", match_date: "2026-09-18" }
    ];
  },

  // 8. Submit League Registration / Signup
  async submitSignup(signupData) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_signups")
          .insert([signupData])
          .select();
        if (error) {
          console.error("Supabase insert error:", error);
          return { success: false, error: error.message || error };
        }
        return { success: true, data };
      } catch (err) {
        console.error("Supabase signup error:", err);
        return { success: false, error: err.message || err };
      }
    }
    // Fallback simulation if dbClient is not ready
    console.log("Mock signup submission (no Supabase client active):", signupData);
    return { success: true, mock: true, data: [signupData] };
  },

  // 9. Fetch All League Signups (for admin review)
  async getSignups() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_signups")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase getSignups error:", err);
      }
    }
    return [];
  },

  // 10. Submit Organization / Team Buy-In Application ($25 entry)
  async submitOrgSignup(orgData) {
    // Generate unique reference code if not provided (e.g. FRT-ORG-4921)
    if (!orgData.reference_code) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      orgData.reference_code = `FRT-ORG-${randNum}`;
    }
    orgData.entry_fee_amount = PAYPAL_CONFIG.entryFeeUSD || 25.00;
    orgData.payment_method = "PayPal";
    orgData.payment_status = orgData.payment_status || "Pending Payment";

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("org_signups")
          .insert([orgData])
          .select();
        if (error) {
          console.error("Supabase org insert error:", error);
          return { success: false, error: error.message || error };
        }
        return { success: true, data: data[0] || orgData, reference_code: orgData.reference_code };
      } catch (err) {
        console.error("Supabase org signup error:", err);
        return { success: false, error: err.message || err };
      }
    }

    // Fallback simulation if dbClient is not ready
    console.log("Mock Org signup submission (simulated):", orgData);
    return { success: true, mock: true, data: orgData, reference_code: orgData.reference_code };
  },

  // 11. Update Organization Payment Record (e.g., after PayPal transaction)
  async updateOrgPaymentStatus(referenceCode, transactionId) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("org_signups")
          .update({
            payment_status: "Paid",
            paypal_transaction_id: transactionId || "VERIFIED-MANUAL",
            approval_status: "Approved"
          })
          .eq("reference_code", referenceCode)
          .select();
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error("Supabase update payment status error:", err);
        return { success: false, error: err.message || err };
      }
    }
    return { success: true, mock: true };
  },

  // 12. Fetch All Org Signups
  async getOrgSignups() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("org_signups")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase getOrgSignups error:", err);
      }
    }
    return [];
  },

  paypalConfig: PAYPAL_CONFIG,
  isConfigured: isSupabaseConfigured
};

