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
  signups: [
    {
      id: 1,
      gamertag: "Invictus",
      activision_id: "Invictus#123456",
      discord_username: "itzinvictus_",
      role: "Flex",
      platform: "PC",
      registration_type: "Free Agent",
      team_name: null,
      region: "NA Central",
      notes: null,
      status: "Pending",
      created_at: new Date().toISOString()
    }
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
  },
  team_map_records: {
    1: { // Night Shift (NSH) - 5W-1L, 50 PTS
      overall: { wins: 5, losses: 1, points: 50, map_wins: 16, map_losses: 6, map_win_rate: 73 },
      modes: {
        hardpoint: { wins: 7, losses: 2, win_rate: 78, avg_score: "248 - 208" },
        snd: { wins: 5, losses: 1, win_rate: 83, avg_score: "5.8 - 3.5" },
        control: { wins: 4, losses: 3, win_rate: 57, avg_score: "2.7 - 2.1" }
      },
      maps: [
        { map_name: "Karachi", game_mode: "Hardpoint", wins: 3, losses: 0, win_rate: 100, streak: "3W", recent_score: "250 - 210 vs Vantage", recent_result: "W" },
        { map_name: "Sub Base", game_mode: "Hardpoint", wins: 2, losses: 1, win_rate: 67, streak: "1W", recent_score: "250 - 195 vs Redline", recent_result: "W" },
        { map_name: "Rio", game_mode: "Hardpoint", wins: 2, losses: 1, win_rate: 67, streak: "2W", recent_score: "250 - 225 vs Static", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Search & Destroy", wins: 3, losses: 0, win_rate: 100, streak: "3W", recent_score: "6 - 4 vs Vantage", recent_result: "W" },
        { map_name: "Rio", game_mode: "Search & Destroy", wins: 2, losses: 0, win_rate: 100, streak: "2W", recent_score: "6 - 2 vs Redline", recent_result: "W" },
        { map_name: "Karachi", game_mode: "Search & Destroy", wins: 0, losses: 1, win_rate: 0, streak: "1L", recent_score: "4 - 6 vs Vantage", recent_result: "L" },
        { map_name: "Invasion", game_mode: "Control", wins: 2, losses: 2, win_rate: 50, streak: "1L", recent_score: "2 - 3 vs Vantage", recent_result: "L" },
        { map_name: "Highrise", game_mode: "Control", wins: 2, losses: 1, win_rate: 67, streak: "1W", recent_score: "3 - 1 vs Redline", recent_result: "W" }
      ]
    },
    2: { // Vantage (VTG) - 4W-2L, 40 PTS
      overall: { wins: 4, losses: 2, points: 40, map_wins: 14, map_losses: 9, map_win_rate: 61 },
      modes: {
        hardpoint: { wins: 5, losses: 4, win_rate: 56, avg_score: "235 - 220" },
        snd: { wins: 5, losses: 3, win_rate: 63, avg_score: "5.4 - 4.1" },
        control: { wins: 4, losses: 2, win_rate: 67, avg_score: "2.8 - 2.0" }
      },
      maps: [
        { map_name: "Karachi", game_mode: "Hardpoint", wins: 2, losses: 2, win_rate: 50, streak: "1L", recent_score: "210 - 250 vs Night Shift", recent_result: "L" },
        { map_name: "6 Star", game_mode: "Hardpoint", wins: 2, losses: 1, win_rate: 67, streak: "2W", recent_score: "250 - 180 vs Static", recent_result: "W" },
        { map_name: "Vista", game_mode: "Hardpoint", wins: 1, losses: 1, win_rate: 50, streak: "1W", recent_score: "250 - 220 vs Redline", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Search & Destroy", wins: 2, losses: 2, win_rate: 50, streak: "1L", recent_score: "4 - 6 vs Night Shift", recent_result: "L" },
        { map_name: "Karachi", game_mode: "Search & Destroy", wins: 2, losses: 0, win_rate: 100, streak: "2W", recent_score: "6 - 4 vs Night Shift", recent_result: "W" },
        { map_name: "Terminal", game_mode: "Search & Destroy", wins: 1, losses: 1, win_rate: 50, streak: "1W", recent_score: "6 - 3 vs Redline", recent_result: "W" },
        { map_name: "Invasion", game_mode: "Control", wins: 3, losses: 1, win_rate: 75, streak: "2W", recent_score: "3 - 2 vs Night Shift", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Control", wins: 1, losses: 1, win_rate: 50, streak: "1L", recent_score: "1 - 3 vs Redline", recent_result: "L" }
      ]
    },
    3: { // Redline (RED) - 3W-3L, 30 PTS
      overall: { wins: 3, losses: 3, points: 30, map_wins: 11, map_losses: 12, map_win_rate: 48 },
      modes: {
        hardpoint: { wins: 4, losses: 5, win_rate: 44, avg_score: "228 - 236" },
        snd: { wins: 4, losses: 4, win_rate: 50, avg_score: "4.8 - 4.9" },
        control: { wins: 3, losses: 3, win_rate: 50, avg_score: "2.3 - 2.5" }
      },
      maps: [
        { map_name: "Sub Base", game_mode: "Hardpoint", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "195 - 250 vs Night Shift", recent_result: "L" },
        { map_name: "Karachi", game_mode: "Hardpoint", wins: 2, losses: 1, win_rate: 67, streak: "1W", recent_score: "250 - 220 vs Static", recent_result: "W" },
        { map_name: "Rio", game_mode: "Hardpoint", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "215 - 250 vs Vantage", recent_result: "L" },
        { map_name: "Rio", game_mode: "Search & Destroy", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "2 - 6 vs Night Shift", recent_result: "L" },
        { map_name: "Karachi", game_mode: "Search & Destroy", wins: 2, losses: 1, win_rate: 67, streak: "1W", recent_score: "6 - 4 vs Night Shift", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Search & Destroy", wins: 1, losses: 1, win_rate: 50, streak: "1W", recent_score: "6 - 5 vs Static", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Control", wins: 2, losses: 1, win_rate: 67, streak: "1W", recent_score: "3 - 1 vs Vantage", recent_result: "W" },
        { map_name: "Invasion", game_mode: "Control", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "1 - 3 vs Night Shift", recent_result: "L" }
      ]
    },
    4: { // Static (STC) - 1W-5L, 10 PTS
      overall: { wins: 1, losses: 5, points: 10, map_wins: 7, map_losses: 16, map_win_rate: 30 },
      modes: {
        hardpoint: { wins: 3, losses: 6, win_rate: 33, avg_score: "210 - 245" },
        snd: { wins: 2, losses: 5, win_rate: 29, avg_score: "3.7 - 5.6" },
        control: { wins: 2, losses: 5, win_rate: 29, avg_score: "1.8 - 2.8" }
      },
      maps: [
        { map_name: "6 Star", game_mode: "Hardpoint", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "180 - 250 vs Vantage", recent_result: "L" },
        { map_name: "Karachi", game_mode: "Hardpoint", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "220 - 250 vs Redline", recent_result: "L" },
        { map_name: "Sub Base", game_mode: "Hardpoint", wins: 1, losses: 2, win_rate: 33, streak: "1W", recent_score: "250 - 235 vs Redline", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Search & Destroy", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "5 - 6 vs Redline", recent_result: "L" },
        { map_name: "Terminal", game_mode: "Search & Destroy", wins: 1, losses: 2, win_rate: 33, streak: "1L", recent_score: "3 - 6 vs Vantage", recent_result: "L" },
        { map_name: "Invasion", game_mode: "Control", wins: 1, losses: 2, win_rate: 33, streak: "1W", recent_score: "3 - 2 vs Redline", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Control", wins: 1, losses: 3, win_rate: 25, streak: "2L", recent_score: "0 - 3 vs Night Shift", recent_result: "L" }
      ]
    }
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

        if (!error && data) {
          if (data.length === 0) return [];
          return data.map(p => ({
            ...p,
            discord_name: p.discord_name || p.gamertag,
            activision_id: p.activision_id || `${p.gamertag}#${Math.floor(1000000 + (p.id * 123456) % 9000000)}`,
            rank: p.rank || (p.kdr >= 1.2 ? "1.5" : (p.kdr >= 1.0 ? "1.0" : "0.5")),
            status: p.status || (p.teams ? "Active" : "Free Agent"),
            team_name: p.teams?.name || p.team_name || "Free Agent"
          }));
        }
        console.warn("Supabase fetch returned error, using fallback:", error);
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
            .order("match_date", { ascending: false })
            .order("id", { ascending: false });
          if (!error && data) return data;
          if (error) console.error("Supabase map stats error:", error);
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
      { id: 101, player_id: Number(playerId), map_name: "Karachi", game_mode: "Hardpoint", opponent_team: "Opponent", kills: Math.round(25 * baseKd), deaths: 20, damage: Math.round(3900 * baseKd), kdr: Number((25 * baseKd / 20).toFixed(2)), result: "W", score: "250 - 215", match_date: "2026-09-24" },
      { id: 102, player_id: Number(playerId), map_name: "Highrise", game_mode: "Search & Destroy", opponent_team: "Opponent", kills: Math.round(8 * baseKd), deaths: 6, damage: Math.round(1250 * baseKd), kdr: Number((8 * baseKd / 6).toFixed(2)), result: "W", score: "6 - 4", match_date: "2026-09-24" },
      { id: 103, player_id: Number(playerId), map_name: "Invasion", game_mode: "Control", opponent_team: "Opponent", kills: Math.round(21 * baseKd), deaths: 19, damage: Math.round(3200 * baseKd), kdr: Number((21 * baseKd / 19).toFixed(2)), result: "L", score: "2 - 3", match_date: "2026-09-18" },
      { id: 104, player_id: Number(playerId), map_name: "Sub Base", game_mode: "Hardpoint", opponent_team: "Opponent", kills: Math.round(28 * baseKd), deaths: 22, damage: Math.round(4200 * baseKd), kdr: Number((28 * baseKd / 22).toFixed(2)), result: "W", score: "250 - 190", match_date: "2026-09-18" }
    ];
  },

  // 7a. Comprehensive Player Telemetry Calculator
  // Computes overall W/L & K/D, per mode W/L & K/D, and per map W/L & K/D
  calculatePlayerTelemetry(player, mapStats = []) {
    const isWin = (r) => {
      const val = String(r || "").trim().toUpperCase();
      return val === "W" || val === "VICTORY" || val === "WIN";
    };

    let totalKills = 0;
    let totalDeaths = 0;
    let totalDamage = 0;
    let totalWins = 0;
    let totalLosses = 0;

    const modeStats = {};
    const mapStatsByName = {};
    const mapModeStats = {};

    mapStats.forEach(m => {
      const kills = Number(m.kills) || 0;
      const deaths = Number(m.deaths) || 0;
      const damage = Number(m.damage) || 0;
      const win = isWin(m.result);

      totalKills += kills;
      totalDeaths += deaths;
      totalDamage += damage;
      if (win) totalWins++; else totalLosses++;

      // Standardize game mode name
      const rawMode = (m.game_mode || "Hardpoint").trim();
      let mode = rawMode;
      const lowerMode = rawMode.toLowerCase();
      if (lowerMode.includes("hardpoint") || lowerMode === "hp") mode = "Hardpoint";
      else if (lowerMode.includes("search") || lowerMode.includes("destroy") || lowerMode === "snd") mode = "Search & Destroy";
      else if (lowerMode.includes("control") || lowerMode === "ctl") mode = "Control";

      if (!modeStats[mode]) {
        modeStats[mode] = { mode, wins: 0, losses: 0, kills: 0, deaths: 0, damage: 0, count: 0 };
      }
      modeStats[mode].count++;
      if (win) modeStats[mode].wins++; else modeStats[mode].losses++;
      modeStats[mode].kills += kills;
      modeStats[mode].deaths += deaths;
      modeStats[mode].damage += damage;

      // Group per map
      const mapName = (m.map_name || "Unknown").trim();
      if (!mapStatsByName[mapName]) {
        mapStatsByName[mapName] = { map_name: mapName, wins: 0, losses: 0, kills: 0, deaths: 0, damage: 0, count: 0, modes: new Set() };
      }
      mapStatsByName[mapName].count++;
      if (win) mapStatsByName[mapName].wins++; else mapStatsByName[mapName].losses++;
      mapStatsByName[mapName].kills += kills;
      mapStatsByName[mapName].deaths += deaths;
      mapStatsByName[mapName].damage += damage;
      mapStatsByName[mapName].modes.add(mode);

      // Group per map + mode combination
      const mapModeKey = `${mapName} · ${mode}`;
      if (!mapModeStats[mapModeKey]) {
        mapModeStats[mapModeKey] = { key: mapModeKey, map_name: mapName, game_mode: mode, wins: 0, losses: 0, kills: 0, deaths: 0, damage: 0, count: 0 };
      }
      mapModeStats[mapModeKey].count++;
      if (win) mapModeStats[mapModeKey].wins++; else mapModeStats[mapModeKey].losses++;
      mapModeStats[mapModeKey].kills += kills;
      mapModeStats[mapModeKey].deaths += deaths;
      mapModeStats[mapModeKey].damage += damage;
    });

    // Fallback to player profile stats if no map records exist
    if (mapStats.length === 0 && player) {
      totalKills = player.total_kills || 0;
      totalDeaths = player.total_deaths || 0;
      totalWins = player.wins || 0;
      totalLosses = player.losses || 0;
    }

    const totalMaps = totalWins + totalLosses;
    const winRate = totalMaps > 0 ? Math.round((totalWins / totalMaps) * 100) : 0;
    const overallKd = totalDeaths > 0
      ? (totalKills / totalDeaths).toFixed(2)
      : (totalKills > 0 ? totalKills.toFixed(2) : (player?.kdr ? Number(player.kdr).toFixed(2) : "1.00"));
    const avgKillsPerMap = totalMaps > 0 ? (totalKills / totalMaps).toFixed(1) : (totalKills || 0);
    const avgDamagePerMap = totalMaps > 0 ? Math.round(totalDamage / totalMaps) : 0;

    // Standard modes summary (Hardpoint, Search & Destroy, Control)
    const standardModes = ["Hardpoint", "Search & Destroy", "Control"];
    const modesCalculated = {};
    standardModes.forEach(stdMode => {
      const s = modeStats[stdMode] || { mode: stdMode, wins: 0, losses: 0, kills: 0, deaths: 0, damage: 0, count: 0 };
      const tot = s.wins + s.losses;
      modesCalculated[stdMode] = {
        mode: stdMode,
        wins: s.wins,
        losses: s.losses,
        total: tot,
        win_rate: tot > 0 ? Math.round((s.wins / tot) * 100) : 0,
        kills: s.kills,
        deaths: s.deaths,
        damage: s.damage,
        kdr: s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : (s.kills > 0 ? s.kills.toFixed(2) : "0.00"),
        avg_kills: tot > 0 ? (s.kills / tot).toFixed(1) : "0.0",
        avg_damage: tot > 0 ? Math.round(s.damage / tot) : 0
      };
    });
    for (const [mName, s] of Object.entries(modeStats)) {
      if (!modesCalculated[mName]) {
        const tot = s.wins + s.losses;
        modesCalculated[mName] = {
          mode: mName,
          wins: s.wins,
          losses: s.losses,
          total: tot,
          win_rate: tot > 0 ? Math.round((s.wins / tot) * 100) : 0,
          kills: s.kills,
          deaths: s.deaths,
          damage: s.damage,
          kdr: s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : (s.kills > 0 ? s.kills.toFixed(2) : "0.00"),
          avg_kills: tot > 0 ? (s.kills / tot).toFixed(1) : "0.0",
          avg_damage: tot > 0 ? Math.round(s.damage / tot) : 0
        };
      }
    }

    // Per Map Telemetry
    const mapsCalculated = Object.values(mapStatsByName).map(s => {
      const tot = s.wins + s.losses;
      return {
        map_name: s.map_name,
        wins: s.wins,
        losses: s.losses,
        total: tot,
        win_rate: tot > 0 ? Math.round((s.wins / tot) * 100) : 0,
        kills: s.kills,
        deaths: s.deaths,
        damage: s.damage,
        kdr: s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : (s.kills > 0 ? s.kills.toFixed(2) : "0.00"),
        avg_kills: tot > 0 ? (s.kills / tot).toFixed(1) : "0.0",
        avg_damage: tot > 0 ? Math.round(s.damage / tot) : 0,
        modes: Array.from(s.modes)
      };
    }).sort((a, b) => b.total - a.total || b.win_rate - a.win_rate);

    // Per Map & Mode Telemetry
    const mapModesCalculated = Object.values(mapModeStats).map(s => {
      const tot = s.wins + s.losses;
      return {
        key: s.key,
        map_name: s.map_name,
        game_mode: s.game_mode,
        wins: s.wins,
        losses: s.losses,
        total: tot,
        win_rate: tot > 0 ? Math.round((s.wins / tot) * 100) : 0,
        kills: s.kills,
        deaths: s.deaths,
        damage: s.damage,
        kdr: s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : (s.kills > 0 ? s.kills.toFixed(2) : "0.00")
      };
    }).sort((a, b) => b.total - a.total || b.win_rate - a.win_rate);

    return {
      overall: {
        wins: totalWins,
        losses: totalLosses,
        total_maps: totalMaps,
        win_rate: winRate,
        total_kills: totalKills,
        total_deaths: totalDeaths,
        total_damage: totalDamage,
        kdr: overallKd,
        avg_kills_per_map: avgKillsPerMap,
        avg_damage_per_map: avgDamagePerMap
      },
      modes: modesCalculated,
      maps: mapsCalculated,
      map_modes: mapModesCalculated,
      raw_maps: mapStats
    };
  },

  // 7a-2. Fetch Full Player Telemetry (Player + calculated overall, mode, and map stats)
  async getPlayerTelemetry(playerId) {
    const [player, mapStats] = await Promise.all([
      this.getPlayerById(playerId),
      this.getPlayerMapStats(playerId)
    ]);
    return {
      player,
      ...this.calculatePlayerTelemetry(player, mapStats || [])
    };
  },

  // 7b. Fetch Single Team Details with Players
  async getTeamById(teamId) {
    if (dbClient) {
      try {
        if (/^\d+$/.test(String(teamId))) {
          const { data, error } = await dbClient
            .from("teams")
            .select("*, players(*)")
            .eq("id", teamId)
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        console.error("Supabase getTeamById error:", err);
      }
    }
    const team = MOCK_DATA.teams.find(t => String(t.id) === String(teamId) || (t.tag && t.tag.toLowerCase() === String(teamId).toLowerCase()));
    if (team) {
      return {
        ...team,
        players: MOCK_DATA.players.filter(p => p.teams?.name === team.name)
      };
    }
    return null;
  },

  // 7c. Fetch Team Map Records & Mode Telemetry
  async getTeamMapRecords(teamId) {
    if (dbClient) {
      try {
        if (/^\d+$/.test(String(teamId))) {
          const { data, error } = await dbClient
            .from("team_map_records")
            .select("*")
            .eq("team_id", teamId);
          if (!error && data && data.length > 0) {
            // Calculate aggregations if database rows exist
            const maps = data;
            const hardpointMaps = maps.filter(m => m.game_mode === "Hardpoint");
            const sndMaps = maps.filter(m => m.game_mode === "Search & Destroy");
            const controlMaps = maps.filter(m => m.game_mode === "Control");
            const calcMode = (arr) => {
              const w = arr.reduce((acc, m) => acc + (m.wins || (m.result === 'W' ? 1 : 0)), 0);
              const l = arr.reduce((acc, m) => acc + (m.losses || (m.result === 'L' ? 1 : 0)), 0);
              const total = w + l;
              return { wins: w, losses: l, win_rate: total > 0 ? Math.round((w / total) * 100) : 0 };
            };
            const totalWins = maps.reduce((acc, m) => acc + (m.wins || 0), 0);
            const totalLosses = maps.reduce((acc, m) => acc + (m.losses || 0), 0);
            return {
              overall: {
                map_wins: totalWins,
                map_losses: totalLosses,
                map_win_rate: (totalWins + totalLosses) > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0
              },
              modes: {
                hardpoint: calcMode(hardpointMaps),
                snd: calcMode(sndMaps),
                control: calcMode(controlMaps)
              },
              maps
            };
          }
        }
      } catch (err) {
        console.warn("Supabase team_map_records query fallback:", err);
      }
    }

    // Lookup in MOCK_DATA
    if (MOCK_DATA.team_map_records && MOCK_DATA.team_map_records[teamId]) {
      return MOCK_DATA.team_map_records[teamId];
    }
    // Also lookup by team tag if teamId was passed as a tag like "NSH"
    const matchedTeam = MOCK_DATA.teams.find(t => String(t.id) === String(teamId) || (t.tag && t.tag.toLowerCase() === String(teamId).toLowerCase()));
    if (matchedTeam && MOCK_DATA.team_map_records && MOCK_DATA.team_map_records[matchedTeam.id]) {
      return MOCK_DATA.team_map_records[matchedTeam.id];
    }

    // Dynamic generation fallback for any newly registered or custom team
    const team = matchedTeam || (await this.getTeamById(teamId));
    const w = team ? (team.wins || 0) : 3;
    const l = team ? (team.losses || 0) : 2;
    const total = (w + l) || 5;
    const winRate = Math.round((w / total) * 100);

    return {
      overall: {
        wins: w,
        losses: l,
        points: team ? (team.points || 0) : w * 10,
        map_wins: Math.round(w * 2.6) || 6,
        map_losses: Math.round(l * 2.2) || 4,
        map_win_rate: winRate
      },
      modes: {
        hardpoint: {
          wins: Math.max(0, Math.round(w * 1.2)),
          losses: Math.max(0, Math.round(l * 1.0)),
          win_rate: winRate,
          avg_score: "235 - 210"
        },
        snd: {
          wins: Math.max(0, Math.round(w * 0.9)),
          losses: Math.max(0, Math.round(l * 0.8)),
          win_rate: winRate,
          avg_score: "5.4 - 4.2"
        },
        control: {
          wins: Math.max(0, Math.round(w * 0.5)),
          losses: Math.max(0, Math.round(l * 0.4)),
          win_rate: winRate,
          avg_score: "2.6 - 2.1"
        }
      },
      maps: [
        { map_name: "Karachi", game_mode: "Hardpoint", wins: Math.max(1, Math.round(w * 0.5)), losses: Math.max(0, Math.round(l * 0.4)), win_rate: winRate, streak: w >= l ? "2W" : "1L", recent_score: "250 - 215", recent_result: w >= l ? "W" : "L" },
        { map_name: "Sub Base", game_mode: "Hardpoint", wins: Math.max(1, Math.round(w * 0.4)), losses: Math.max(0, Math.round(l * 0.4)), win_rate: winRate, streak: "1W", recent_score: "250 - 230", recent_result: "W" },
        { map_name: "Highrise", game_mode: "Search & Destroy", wins: Math.max(1, Math.round(w * 0.4)), losses: Math.max(0, Math.round(l * 0.3)), win_rate: winRate, streak: "1W", recent_score: "6 - 4", recent_result: "W" },
        { map_name: "Rio", game_mode: "Search & Destroy", wins: Math.max(0, Math.round(w * 0.3)), losses: Math.max(1, Math.round(l * 0.4)), win_rate: Math.max(0, winRate - 10), streak: "1L", recent_score: "4 - 6", recent_result: "L" },
        { map_name: "Invasion", game_mode: "Control", wins: Math.max(1, Math.round(w * 0.3)), losses: Math.max(0, Math.round(l * 0.3)), win_rate: winRate, streak: "1W", recent_score: "3 - 2", recent_result: "W" }
      ]
    };
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
    if (!MOCK_DATA.signups) MOCK_DATA.signups = [];
    const mockSignup = { id: Date.now(), ...signupData, created_at: new Date().toISOString() };
    MOCK_DATA.signups.unshift(mockSignup);
    return { success: true, mock: true, data: [mockSignup] };
  },

  // 9. Fetch All League Signups (for admin review)
  async getSignups() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_signups")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) {
          // Return queue entries, excluding already enlisted/processed signups
          return data.filter(s => s.status !== "Enlisted" && s.status !== "Approved_Enlisted");
        }
      } catch (err) {
        console.error("Supabase getSignups error:", err);
      }
    }
    return (MOCK_DATA.signups || []).filter(s => s.status !== "Enlisted" && s.status !== "Approved_Enlisted");
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

  // 13. Fetch Tournament Brackets & Matches
  async getBrackets(divisionId = "premier") {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("tournament_matches")
          .select("*")
          .eq("division_id", divisionId)
          .order("round_order", { ascending: true })
          .order("match_order", { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase tournament_matches not yet created, using local bracket engine:", err.message);
      }
    }
    return null;
  },

  // ============================================================================
  // ADMIN PORTAL MUTATIONS & ACTIONS
  // ============================================================================

  // Admin: Create Team
  async createTeam(teamData) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .insert([teamData])
          .select();
        if (error) throw error;
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Supabase createTeam error:", err);
        return { success: false, error: err.message || err };
      }
    }
    // Fallback in-memory
    const newId = Date.now();
    const mockTeam = { id: newId, ...teamData };
    MOCK_DATA.teams.push(mockTeam);
    return { success: true, data: mockTeam, mock: true };
  },

  // Admin: Update Team
  async updateTeam(teamId, updates) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .update(updates)
          .eq("id", teamId)
          .select();
        if (error) throw error;
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Supabase updateTeam error:", err);
        return { success: false, error: err.message || err };
      }
    }
    const t = MOCK_DATA.teams.find(x => x.id == teamId);
    if (t) Object.assign(t, updates);
    return { success: true, data: t, mock: true };
  },

  // Admin: Delete Team
  async deleteTeam(teamId) {
    if (dbClient) {
      try {
        const { error } = await dbClient
          .from("teams")
          .delete()
          .eq("id", teamId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error("Supabase deleteTeam error:", err);
        return { success: false, error: err.message || err };
      }
    }
    const idx = MOCK_DATA.teams.findIndex(x => x.id == teamId);
    if (idx !== -1) MOCK_DATA.teams.splice(idx, 1);
    return { success: true, mock: true };
  },

  // Admin: Create Player
  async createPlayer(playerData) {
    if (dbClient) {
      try {
        let payload = { ...playerData };
        let { data, error } = await dbClient
          .from("players")
          .insert([payload])
          .select();

        // Handle unmigrated columns (like activision_id, discord_name) if schema cache lacks them
        if (error && (error.code === "PGRST204" || (error.message && (error.message.includes("column") || error.message.includes("players"))))) {
          console.warn("Retrying createPlayer with standard core columns:", error.message);
          const safePayload = {
            gamertag: payload.gamertag,
            role: payload.role || "Flex",
            kdr: payload.kdr != null ? parseFloat(payload.kdr) : 1.00,
            team_id: payload.team_id || null,
            total_kills: payload.total_kills || 0,
            total_deaths: payload.total_deaths || 0,
            wins: payload.wins || 0,
            losses: payload.losses || 0
          };
          const retry = await dbClient
            .from("players")
            .insert([safePayload])
            .select();

          if (retry.error) {
            // Check if player already exists by gamertag (unique violation)
            if (retry.error.code === "23505" || (retry.error.message && retry.error.message.includes("unique"))) {
              const { data: existing } = await dbClient.from("players").select("*").eq("gamertag", payload.gamertag).maybeSingle();
              if (existing) return { success: true, data: existing, alreadyExisted: true };
            }
            throw retry.error;
          }
          data = retry.data;
          error = null;
        } else if (error) {
          // Check if player already exists by gamertag (unique violation)
          if (error.code === "23505" || (error.message && error.message.includes("unique"))) {
            const { data: existing } = await dbClient.from("players").select("*").eq("gamertag", payload.gamertag).maybeSingle();
            if (existing) return { success: true, data: existing, alreadyExisted: true };
          }
          throw error;
        }

        return { success: true, data: data ? data[0] : payload };
      } catch (err) {
        console.error("Supabase createPlayer error:", err);
        return { success: false, error: err.message || err };
      }
    }
    const newId = Date.now();
    const mockPlayer = { id: newId, ...playerData };
    MOCK_DATA.players.push(mockPlayer);
    return { success: true, data: mockPlayer, mock: true };
  },

  // Admin: Update Player
  async updatePlayer(playerId, updates) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("players")
          .update(updates)
          .eq("id", playerId)
          .select();
        if (error) throw error;
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Supabase updatePlayer error:", err);
        return { success: false, error: err.message || err };
      }
    }
    const p = MOCK_DATA.players.find(x => x.id == playerId);
    if (p) Object.assign(p, updates);
    return { success: true, data: p, mock: true };
  },

  // Admin: Delete Player (permanently removes player from players table, player_map_stats, and league_signups)
  async deletePlayer(playerId, gamertag = null) {
    const idStr = String(playerId || "").trim();
    const isSignupId = idStr.startsWith("signup-");
    const numericId = !isSignupId && /^\d+$/.test(idStr) ? parseInt(idStr, 10) : null;
    let targetGamertag = gamertag ? String(gamertag).trim() : (!numericId && !isSignupId ? idStr : null);

    if (dbClient) {
      try {
        let deletedRows = 0;

        // 1. If it's a synthetic signup ID (e.g. "signup-1"), delete directly from league_signups
        if (isSignupId) {
          const rawSignupId = idStr.replace("signup-", "");
          if (/^\d+$/.test(rawSignupId)) {
            const { error: sErr, data: sData } = await dbClient
              .from("league_signups")
              .delete()
              .eq("id", parseInt(rawSignupId, 10))
              .select();
            if (!sErr && sData && sData.length > 0) deletedRows += sData.length;
          }
        }

        // 2. If it's a numeric player ID, fetch gamertag first if not provided, then delete stats and player
        if (numericId) {
          if (!targetGamertag) {
            try {
              const { data: pData } = await dbClient
                .from("players")
                .select("gamertag")
                .eq("id", numericId)
                .maybeSingle();
              if (pData?.gamertag) targetGamertag = pData.gamertag;
            } catch (_) {}
          }

          // Delete associated map stats first
          try {
            await dbClient
              .from("player_map_stats")
              .delete()
              .eq("player_id", numericId);
          } catch (mErr) {
            console.warn("Could not delete associated map stats:", mErr);
          }

          // Delete from players table
          const { error: pErr, data: pData } = await dbClient
            .from("players")
            .delete()
            .eq("id", numericId)
            .select();

          if (pErr) throw pErr;
          if (pData && pData.length > 0) deletedRows += pData.length;
        }

        // 3. If targetGamertag is known, purge any remaining records by gamertag across players and league_signups
        if (targetGamertag) {
          try {
            const { data: byTag } = await dbClient
              .from("players")
              .select("id")
              .ilike("gamertag", targetGamertag);

            if (byTag && byTag.length > 0) {
              const tagIds = byTag.map(b => b.id);
              await dbClient.from("player_map_stats").delete().in("player_id", tagIds);
              const { data: tagDeleted } = await dbClient
                .from("players")
                .delete()
                .in("id", tagIds)
                .select();
              if (tagDeleted) deletedRows += tagDeleted.length;
            }

            // Also purge any matching record in league_signups so it can never resurrect
            await dbClient
              .from("league_signups")
              .delete()
              .ilike("gamertag", targetGamertag);
          } catch (tagErr) {
            console.warn("Secondary gamertag purge warning:", tagErr);
          }
        }

        // Clean up MOCK_DATA in memory so fallback stays consistent
        if (numericId) {
          const idx = MOCK_DATA.players.findIndex(x => x.id == numericId);
          if (idx !== -1) MOCK_DATA.players.splice(idx, 1);
        }
        if (targetGamertag) {
          const idx = MOCK_DATA.players.findIndex(x => (x.gamertag || "").toLowerCase() === targetGamertag.toLowerCase());
          if (idx !== -1) MOCK_DATA.players.splice(idx, 1);
          if (MOCK_DATA.signups) {
            const sIdx = MOCK_DATA.signups.findIndex(x => (x.gamertag || "").toLowerCase() === targetGamertag.toLowerCase());
            if (sIdx !== -1) MOCK_DATA.signups.splice(sIdx, 1);
          }
        }

        return { success: true, deletedRows };
      } catch (err) {
        console.error("Supabase deletePlayer error:", err);
        return { success: false, error: err.message || err };
      }
    }

    // In-memory fallback
    const targetTag = (targetGamertag || idStr).toLowerCase();
    const idx = MOCK_DATA.players.findIndex(x => String(x.id) === idStr || (x.gamertag && x.gamertag.toLowerCase() === targetTag));
    if (idx !== -1) MOCK_DATA.players.splice(idx, 1);
    if (MOCK_DATA.signups) {
      const sIdx = MOCK_DATA.signups.findIndex(x => String(x.id) === idStr || (x.gamertag && x.gamertag.toLowerCase() === targetTag));
      if (sIdx !== -1) MOCK_DATA.signups.splice(sIdx, 1);
    }
    return { success: true, mock: true };
  },

  // Admin: Add Individual Map Performance Record for a Player
  async addPlayerMapStat(statData) {
    const kills = parseInt(statData.kills) || 0;
    const deaths = parseInt(statData.deaths) || 0;
    const calculatedKd = deaths > 0 ? parseFloat((kills / deaths).toFixed(2)) : kills;
    const payload = {
      player_id: Number(statData.player_id),
      map_name: (statData.map_name || "Karachi").trim(),
      game_mode: (statData.game_mode || "Hardpoint").trim(),
      opponent_team: (statData.opponent_team || "Opponent").trim(),
      kills: kills,
      deaths: deaths,
      damage: parseInt(statData.damage) || 0,
      kdr: statData.kdr != null ? parseFloat(statData.kdr) : calculatedKd,
      result: (statData.result || "W").toUpperCase(),
      score: statData.score ? String(statData.score).trim() : null,
      match_date: statData.match_date || new Date().toISOString().split("T")[0]
    };

    let insertedRow = null;
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("player_map_stats")
          .insert([payload])
          .select();
        if (error) throw error;
        insertedRow = data && data[0];
      } catch (err) {
        console.error("Supabase addPlayerMapStat error:", err);
        return { success: false, error: err.message || err };
      }
    } else {
      if (!MOCK_DATA.map_stats) MOCK_DATA.map_stats = {};
      if (!MOCK_DATA.map_stats[payload.player_id]) MOCK_DATA.map_stats[payload.player_id] = [];
      insertedRow = { id: Date.now(), ...payload };
      MOCK_DATA.map_stats[payload.player_id].unshift(insertedRow);
    }

    // Automatically recalculate and sync player totals (kills, deaths, kdr, wins, losses)
    await this.syncPlayerTotals(payload.player_id);
    const telemetry = await this.getPlayerTelemetry(payload.player_id);

    return { success: true, data: insertedRow, telemetry };
  },

  // Admin: Update Existing Map Performance Record
  async updatePlayerMapStat(statId, updates, playerId) {
    const formattedUpdates = { ...updates };
    if (formattedUpdates.kills != null) formattedUpdates.kills = parseInt(formattedUpdates.kills) || 0;
    if (formattedUpdates.deaths != null) formattedUpdates.deaths = parseInt(formattedUpdates.deaths) || 0;
    if (formattedUpdates.damage != null) formattedUpdates.damage = parseInt(formattedUpdates.damage) || 0;
    if (formattedUpdates.result) formattedUpdates.result = formattedUpdates.result.toUpperCase();
    if (formattedUpdates.kills != null && formattedUpdates.deaths != null) {
      formattedUpdates.kdr = formattedUpdates.deaths > 0
        ? parseFloat((formattedUpdates.kills / formattedUpdates.deaths).toFixed(2))
        : formattedUpdates.kills;
    }

    let updatedRow = null;
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("player_map_stats")
          .update(formattedUpdates)
          .eq("id", statId)
          .select();
        if (error) throw error;
        updatedRow = data && data[0];
      } catch (err) {
        console.error("Supabase updatePlayerMapStat error:", err);
        return { success: false, error: err.message || err };
      }
    } else {
      const pId = playerId || Object.keys(MOCK_DATA.map_stats || {}).find(pid => 
        MOCK_DATA.map_stats[pid].some(m => m.id == statId)
      );
      if (pId && MOCK_DATA.map_stats[pId]) {
        const item = MOCK_DATA.map_stats[pId].find(m => m.id == statId);
        if (item) {
          Object.assign(item, formattedUpdates);
          updatedRow = item;
        }
      }
    }

    const targetPid = playerId || (updatedRow ? updatedRow.player_id : null);
    if (targetPid) {
      await this.syncPlayerTotals(targetPid);
    }
    const telemetry = targetPid ? await this.getPlayerTelemetry(targetPid) : null;
    return { success: true, data: updatedRow, telemetry };
  },

  // Admin: Delete Map Record
  async deletePlayerMapStat(statId, playerId) {
    if (dbClient) {
      try {
        const { error } = await dbClient
          .from("player_map_stats")
          .delete()
          .eq("id", statId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase deletePlayerMapStat error:", err);
        return { success: false, error: err.message || err };
      }
    } else {
      const pId = playerId || Object.keys(MOCK_DATA.map_stats || {}).find(pid => 
        MOCK_DATA.map_stats[pid].some(m => m.id == statId)
      );
      if (pId && MOCK_DATA.map_stats[pId]) {
        const idx = MOCK_DATA.map_stats[pId].findIndex(m => m.id == statId);
        if (idx !== -1) MOCK_DATA.map_stats[pId].splice(idx, 1);
      }
    }

    if (playerId) {
      await this.syncPlayerTotals(playerId);
    }
    const telemetry = playerId ? await this.getPlayerTelemetry(playerId) : null;
    return { success: true, telemetry };
  },

  // Admin / Internal: Sync & Recalculate Player's Season Totals from Map Stats
  async syncPlayerTotals(playerId) {
    if (!playerId) return null;
    try {
      const mapStats = await this.getPlayerMapStats(playerId);
      const player = await this.getPlayerById(playerId);
      const telemetry = this.calculatePlayerTelemetry(player, mapStats);

      const updatePayload = {
        total_kills: telemetry.overall.total_kills,
        total_deaths: telemetry.overall.total_deaths,
        kdr: parseFloat(telemetry.overall.kdr)
      };

      if (dbClient && /^\d+$/.test(String(playerId))) {
        // Try including wins and losses if database columns exist
        const fullPayload = {
          ...updatePayload,
          wins: telemetry.overall.wins,
          losses: telemetry.overall.losses
        };
        const { error } = await dbClient
          .from("players")
          .update(fullPayload)
          .eq("id", playerId);
        
        if (error) {
          // If wins/losses column missing, fallback to core total_kills, total_deaths, kdr
          if (error.message && (error.message.includes("wins") || error.message.includes("losses"))) {
            await dbClient
              .from("players")
              .update(updatePayload)
              .eq("id", playerId);
          } else {
            console.warn("Could not sync players totals in Supabase:", error.message);
          }
        }
      } else {
        const mockP = MOCK_DATA.players.find(p => String(p.id) === String(playerId));
        if (mockP) {
          Object.assign(mockP, updatePayload, {
            wins: telemetry.overall.wins,
            losses: telemetry.overall.losses
          });
        }
      }
      return telemetry;
    } catch (err) {
      console.error("Error in syncPlayerTotals:", err);
      return null;
    }
  },

  // Admin: Record Match Result & Auto-Update Standings
  async recordMatchResult(team1Id, team2Id, team1Score, team2Score, winnerId, pointsDelta = 10) {
    const isTeam1Winner = winnerId == team1Id;
    const isTeam2Winner = winnerId == team2Id;

    if (dbClient) {
      try {
        // Fetch current records
        const { data: teams, error: fetchErr } = await dbClient
          .from("teams")
          .select("id, wins, losses, points")
          .in("id", [team1Id, team2Id]);

        if (fetchErr) throw fetchErr;

        const t1 = teams.find(t => t.id == team1Id) || { wins: 0, losses: 0, points: 0 };
        const t2 = teams.find(t => t.id == team2Id) || { wins: 0, losses: 0, points: 0 };

        // Update Team 1
        await dbClient.from("teams").update({
          wins: isTeam1Winner ? (t1.wins + 1) : t1.wins,
          losses: isTeam1Winner ? t1.losses : (t1.losses + 1),
          points: isTeam1Winner ? (t1.points + pointsDelta) : t1.points
        }).eq("id", team1Id);

        // Update Team 2
        await dbClient.from("teams").update({
          wins: isTeam2Winner ? (t2.wins + 1) : t2.wins,
          losses: isTeam2Winner ? t2.losses : (t2.losses + 1),
          points: isTeam2Winner ? (t2.points + pointsDelta) : t2.points
        }).eq("id", team2Id);

        return { success: true };
      } catch (err) {
        console.error("Supabase recordMatchResult error:", err);
        return { success: false, error: err.message || err };
      }
    }

    // In-memory mock fallback
    const t1 = MOCK_DATA.teams.find(t => t.id == team1Id);
    const t2 = MOCK_DATA.teams.find(t => t.id == team2Id);
    if (t1 && t2) {
      if (isTeam1Winner) {
        t1.wins += 1;
        t1.points += pointsDelta;
        t2.losses += 1;
      } else {
        t2.wins += 1;
        t2.points += pointsDelta;
        t1.losses += 1;
      }
    }
    return { success: true, mock: true };
  },

  // Admin: Update Signup Status (Approve / Reject / Waitlist)
  async updateSignupStatus(signupId, status) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_signups")
          .update({ status })
          .eq("id", signupId)
          .select();
        if (error) throw error;
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Supabase updateSignupStatus error:", err);
        return { success: false, error: err.message || err };
      }
    }
    return { success: true, mock: true };
  },

  // Admin: Delete Signup from league_signups
  async deleteSignup(signupId) {
    if (dbClient) {
      try {
        const { error, data } = await dbClient
          .from("league_signups")
          .delete()
          .eq("id", signupId)
          .select();

        if (error) {
          console.error("Supabase deleteSignup error:", error);
          return { success: false, error: error.message || error };
        }

        // If delete returned empty data (RLS blocked DELETE without throwing error),
        // update status to 'Enlisted' so it won't linger in pending signups queue
        if (!data || data.length === 0) {
          await dbClient
            .from("league_signups")
            .update({ status: "Enlisted" })
            .eq("id", signupId);
        }

        return { success: true, data };
      } catch (err) {
        console.error("Supabase deleteSignup exception:", err);
        return { success: false, error: err.message || err };
      }
    }

    if (MOCK_DATA.signups) {
      const idx = MOCK_DATA.signups.findIndex(x => String(x.id) === String(signupId));
      if (idx !== -1) MOCK_DATA.signups.splice(idx, 1);
    }
    return { success: true, mock: true };
  },

  // Admin: Approve & Enlist a Signup (stores player in players table and deletes from league_signups table)
  async approveAndEnlistSignup(signupId, customPlayerData = {}) {
    try {
      let signup = null;
      if (dbClient) {
        const { data, error } = await dbClient
          .from("league_signups")
          .select("*")
          .eq("id", signupId)
          .maybeSingle();
        if (!error && data) signup = data;
      }

      if (!signup && MOCK_DATA.signups) {
        signup = MOCK_DATA.signups.find(s => String(s.id) === String(signupId));
      }

      const gamertag = signup?.gamertag || customPlayerData.gamertag;
      if (!gamertag) {
        return { success: false, error: "Signup not found or gamertag missing" };
      }

      // 1. Resolve team assignment if squad name was provided
      let teamId = customPlayerData.team_id || null;
      if (!teamId && signup?.team_name) {
        try {
          const teams = await this.getTeams();
          const matched = teams.find(t => 
            (t.name && t.name.toLowerCase() === signup.team_name.toLowerCase()) ||
            (t.tag && t.tag.toLowerCase() === signup.team_name.toLowerCase())
          );
          if (matched) teamId = matched.id;
        } catch (_) {}
      }

      // 2. Build player entity
      const newPlayerData = {
        gamertag: gamertag,
        role: signup?.role || customPlayerData.role || "Flex",
        team_id: teamId,
        kdr: customPlayerData.kdr != null ? parseFloat(customPlayerData.kdr) : 1.00,
        activision_id: signup?.activision_id || customPlayerData.activision_id || null,
        total_kills: 0,
        total_deaths: 0,
        wins: 0,
        losses: 0,
        ...customPlayerData
      };

      // 3. Store player in players table
      const playerResult = await this.createPlayer(newPlayerData);
      if (!playerResult.success) {
        return { success: false, error: playerResult.error || "Failed to create player in players table" };
      }

      // 4. Remove player from league_signups table
      const deleteResult = await this.deleteSignup(signupId);

      return {
        success: true,
        player: playerResult.data,
        alreadyExisted: !!playerResult.alreadyExisted,
        deletedSignupId: signupId,
        deleteResult
      };
    } catch (err) {
      console.error("Error in approveAndEnlistSignup:", err);
      return { success: false, error: err.message || err };
    }
  },

  // Admin: Update Livestream / Broadcast State
  async updateLiveBroadcast(isLive, vodUrl, title) {
    if (dbClient) {
      try {
        const updates = { is_live: isLive };
        if (vodUrl) updates.vod_url = vodUrl;
        if (title) updates.title = title;

        const { data, error } = await dbClient
          .from("vods")
          .update(updates)
          .order("id", { ascending: true })
          .limit(1)
          .select();
        if (error) throw error;
        return { success: true, data: data[0] };
      } catch (err) {
        console.error("Supabase updateLiveBroadcast error:", err);
        return { success: false, error: err.message || err };
      }
    }
    if (MOCK_DATA.vods.length > 0) {
      MOCK_DATA.vods[0].is_live = isLive;
      if (vodUrl) MOCK_DATA.vods[0].vod_url = vodUrl;
      if (title) MOCK_DATA.vods[0].title = title;
    }
    return { success: true, mock: true };
  },

  paypalConfig: PAYPAL_CONFIG,
  isConfigured: isSupabaseConfigured
};

