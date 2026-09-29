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
  seasonSettings: {
    season_number: 1,
    status_state: "active",
    status_text: "SEASON 1 ACTIVE"
  },
  rulebook: {
    version_tag: "CDL 2026 ALIGNED - V1.4",
    headline: "LEAGUE RULEBOOK & MATCH DIRECTIVES",
    intro_text: "Standardized operational regulations, mandatory custom lobby match settings, and restricted equipment directives for all Frontline Community League sanctioned matches.",
    bulletin_active: false,
    bulletin_text: "⚡ MID-SEASON NOTICE: Review the updated attachment and secondary weapon guidelines below.",
    bulletin_type: "lime",
    
    roster_size: "4 active starters + up to 2 reserves",
    forfeit_map1_min: 10,
    forfeit_series_min: 15,
    series_format: "Best of 5 (Hardpoint, SnD, Control, Hardpoint, SnD)",
    conduct_policy: "Zero tolerance for hardware cheats (Cronus/XIM), macros, wallhacks, or toxic abuse. Violations trigger immediate forfeit and expulsion.",
    
    hardpoint_score_limit: 250,
    hardpoint_time_limit: 5,
    hardpoint_hill_timer: 60,
    hardpoint_respawn_delay: 2.5,
    
    snd_round_win_limit: 6,
    snd_round_length: 1.5,
    snd_bomb_timer: 45,
    snd_plant_time: 5.0,
    snd_defuse_time: 7.5,
    
    control_round_win_limit: 3,
    control_lives: 30,
    control_round_time: 1.5,
    control_capture_extra: 1.0,
    control_respawn_delay: 3.0,
    
    friendly_fire: "Enabled",
    killcam: "Disabled",
    radar: "Sweeping (Standard)",
    mounting: "Disabled",
    third_person: "Disabled",
    
    banned_weapons: "All Shotguns, All LMGs (Light Machine Guns), All Rocket Launchers (RPG, PILA, JOKR), Riot Shield, Battle Rifles (BAS-B, Sidewinder), Burst Rifles (DG-58, FR 5.56), Heavy Snipers in Hardpoint / Control",
    allowed_weapons: "Standard ARs (e.g. MCW), Standard SMGs (Rival-9, Striker), Approved Bolt-Action (SnD Only, Max 1), Standard Combat Knife / Sidearm",
    
    banned_attachments: "All Muzzle Suppressors & Silencers, All Visible Lasers & Hip Lasers, Thermal & Target-Finding Optics, High-Magnification Scopes (>4.0x on AR), Extended Magazines (>30 AR / >40 SMG), Akimbo / Dual Wield Grips, Incendiary / Explosive / Armor-Piercing Ammo, Snake Shot & High Grain Rounds",
    
    banned_equipment: "Claymores & Proximity Mines, C4 & Breacher Drones, Drill Charges & Thermite, Flashbangs & Shock Sticks, Tear Gas & Decoys, Snapshot Grenades",
    allowed_equipment: "Frag Grenade, Semtex Grenade, Stun Grenade (Max 2 per squad), Smoke Grenade (SnD Only, Max 1)",
    
    banned_upgrades_streaks: "Munitions Box & Deployable Cover, Portable Radar & Heartbeat Sensor, Inflatable Decoy & Tactical Camera, All AI Air Streaks (VTOL, Chopper), Sentry Turrets & Wheelson, UAV & Counter-UAV",
    allowed_upgrades_streaks: "Trophy System (Max 2 deployed per squad), Cruise Missile / Hellstorm (500–600 Pts)",
    
    host_rules: "Regional parity: Central host (Chicago/Dallas) for East vs West matchups. Alternating host order (Team A Maps 1/3, Team B Maps 2/4, neutral Map 5).",
    disconnect_rules: "First 30 seconds / pre-combat crash: immediate remake. Mid-game Hardpoint: pause and carry forward scores. Search & Destroy: finish active round, remake with previous round score retained.",
    dispute_rules: "Match dispute tickets must be logged in Discord #match-disputes within 30 minutes with timestamped video (Twitch/YouTube) or scoreboard screenshots."
  },
  announcements: [
    {
      id: 1,
      title: "Season 1 Official Bracket Seeding & Roster Lock",
      message: "Rosters for Season 1 lock this Friday at 11:59 PM EST. Team captains must ensure all player Activision IDs and roles are confirmed in the recruitment terminal before seedings are locked.",
      tag: "Tournament Alert",
      tag_color: "lime",
      link_url: "brackets.html",
      link_text: "View Tournament Brackets ↗",
      is_active: true,
      pinned: true,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
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
  scheduled_matches: [
    {
      id: 1,
      week_number: 1,
      season_type: "preseason",
      week_label: "Preseason Week 1",
      match_number: 1,
      team1_id: 1,
      team1_name: "Night Shift",
      team1_tag: "NSH",
      team1_score: 3,
      team2_id: 3,
      team2_name: "Redline",
      team2_tag: "RED",
      team2_score: 1,
      winner_id: 1,
      winner_name: "Night Shift",
      status: "Completed",
      scheduled_date: "2026-10-09",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: "callofduty",
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      week_number: 1,
      season_type: "preseason",
      week_label: "Preseason Week 1",
      match_number: 2,
      team1_id: 2,
      team1_name: "Vantage",
      team1_tag: "VTG",
      team1_score: 3,
      team2_id: 4,
      team2_name: "Static",
      team2_tag: "STC",
      team2_score: 2,
      winner_id: 2,
      winner_name: "Vantage",
      status: "Completed",
      scheduled_date: "2026-10-09",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: "callofduty",
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      week_number: 2,
      season_type: "preseason",
      week_label: "Preseason Week 2",
      match_number: 3,
      team1_id: 1,
      team1_name: "Night Shift",
      team1_tag: "NSH",
      team1_score: 2,
      team2_id: 2,
      team2_name: "Vantage",
      team2_tag: "VTG",
      team2_score: 1,
      winner_id: null,
      winner_name: null,
      status: "Live",
      scheduled_date: "2026-10-16",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: "callofduty",
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      week_number: 2,
      season_type: "preseason",
      week_label: "Preseason Week 2",
      match_number: 4,
      team1_id: 3,
      team1_name: "Redline",
      team1_tag: "RED",
      team1_score: 0,
      team2_id: 4,
      team2_name: "Static",
      team2_tag: "STC",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-10-16",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: "callofduty",
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      week_number: 3,
      season_type: "regular",
      week_label: "Regular Season Week 1",
      match_number: 5,
      team1_id: 1,
      team1_name: "Night Shift",
      team1_tag: "NSH",
      team1_score: 0,
      team2_id: 4,
      team2_name: "Static",
      team2_tag: "STC",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-10-23",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      week_number: 3,
      season_type: "regular",
      week_label: "Regular Season Week 1",
      match_number: 6,
      team1_id: 2,
      team1_name: "Vantage",
      team1_tag: "VTG",
      team1_score: 0,
      team2_id: 3,
      team2_name: "Redline",
      team2_tag: "RED",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-10-23",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      week_number: 4,
      season_type: "regular",
      week_label: "Regular Season Week 2",
      match_number: 7,
      team1_id: 2,
      team1_name: "Vantage",
      team1_tag: "VTG",
      team1_score: 0,
      team2_id: 4,
      team2_name: "Static",
      team2_tag: "STC",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-10-30",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      week_number: 4,
      season_type: "regular",
      week_label: "Regular Season Week 2",
      match_number: 8,
      team1_id: 1,
      team1_name: "Night Shift",
      team1_tag: "NSH",
      team1_score: 0,
      team2_id: 3,
      team2_name: "Redline",
      team2_tag: "RED",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-10-30",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 9,
      week_number: 5,
      season_type: "regular",
      week_label: "Regular Season Week 3",
      match_number: 9,
      team1_id: 1,
      team1_name: "Night Shift",
      team1_tag: "NSH",
      team1_score: 0,
      team2_id: 2,
      team2_name: "Vantage",
      team2_tag: "VTG",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-06",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      week_number: 5,
      season_type: "regular",
      week_label: "Regular Season Week 3",
      match_number: 10,
      team1_id: 3,
      team1_name: "Redline",
      team1_tag: "RED",
      team1_score: 0,
      team2_id: 4,
      team2_name: "Static",
      team2_tag: "STC",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-06",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 11,
      week_number: 6,
      season_type: "regular",
      week_label: "Regular Season Week 4",
      match_number: 11,
      team1_id: 4,
      team1_name: "Static",
      team1_tag: "STC",
      team1_score: 0,
      team2_id: 1,
      team2_name: "Night Shift",
      team2_tag: "NSH",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-13",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 12,
      week_number: 6,
      season_type: "regular",
      week_label: "Regular Season Week 4",
      match_number: 12,
      team1_id: 3,
      team1_name: "Redline",
      team1_tag: "RED",
      team1_score: 0,
      team2_id: 2,
      team2_name: "Vantage",
      team2_tag: "VTG",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-13",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 13,
      week_number: 7,
      season_type: "regular",
      week_label: "Regular Season Week 5",
      match_number: 13,
      team1_id: 4,
      team1_name: "Static",
      team1_tag: "STC",
      team1_score: 0,
      team2_id: 2,
      team2_name: "Vantage",
      team2_tag: "VTG",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-20",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 14,
      week_number: 7,
      season_type: "regular",
      week_label: "Regular Season Week 5",
      match_number: 14,
      team1_id: 3,
      team1_name: "Redline",
      team1_tag: "RED",
      team1_score: 0,
      team2_id: 1,
      team2_name: "Night Shift",
      team2_tag: "NSH",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-20",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 15,
      week_number: 8,
      season_type: "regular",
      week_label: "Regular Season Week 6",
      match_number: 15,
      team1_id: 2,
      team1_name: "Vantage",
      team1_tag: "VTG",
      team1_score: 0,
      team2_id: 1,
      team2_name: "Night Shift",
      team2_tag: "NSH",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-27",
      scheduled_time: "6:00 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    },
    {
      id: 16,
      week_number: 8,
      season_type: "regular",
      week_label: "Regular Season Week 6",
      match_number: 16,
      team1_id: 4,
      team1_name: "Static",
      team1_tag: "STC",
      team1_score: 0,
      team2_id: 3,
      team2_name: "Redline",
      team2_tag: "RED",
      team2_score: 0,
      winner_id: null,
      winner_name: null,
      status: "Scheduled",
      scheduled_date: "2026-11-27",
      scheduled_time: "7:30 PM EST",
      best_of: 5,
      stream_url: null,
      standings_recorded: false,
      created_at: new Date().toISOString()
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

  // ==========================================
  // LEAGUE ANNOUNCEMENTS & INTEL BROADCAST
  // ==========================================
  async getAnnouncements(includeInactive = false) {
    if (dbClient) {
      try {
        let query = dbClient
          .from("league_announcements")
          .select("*")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (!includeInactive) {
          query = query.eq("is_active", true);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data;
        }
        if (error) {
          console.warn("Supabase league_announcements returned error, falling back to mock:", error.message || error);
        }
      } catch (err) {
        console.warn("Supabase getAnnouncements query error, using fallback:", err);
      }
    }

    let list = Array.isArray(MOCK_DATA.announcements) ? [...MOCK_DATA.announcements] : [];
    if (!includeInactive) {
      list = list.filter(a => a.is_active !== false);
    }
    // Sort pinned first, then newest
    return list.sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  },

  async getLatestAnnouncement() {
    const list = await this.getAnnouncements(false);
    return list && list.length > 0 ? list[0] : null;
  },

  async createAnnouncement(announcementData) {
    const record = {
      title: announcementData.title,
      message: announcementData.message,
      tag: announcementData.tag || "Official Update",
      tag_color: announcementData.tag_color || "lime",
      link_url: announcementData.link_url || null,
      link_text: announcementData.link_text || null,
      is_active: announcementData.is_active !== undefined ? !!announcementData.is_active : true,
      pinned: announcementData.pinned !== undefined ? !!announcementData.pinned : false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_announcements")
          .insert([record])
          .select();
        if (error) throw error;
        if (data && data.length > 0) return { success: true, data: data[0] };
      } catch (err) {
        console.warn("Supabase createAnnouncement error, falling back to mock storage:", err);
      }
    }

    // Fallback Mock Storage
    record.id = Date.now();
    if (!MOCK_DATA.announcements) MOCK_DATA.announcements = [];
    MOCK_DATA.announcements.unshift(record);
    return { success: true, data: record, mock: true };
  },

  async updateAnnouncement(id, updates) {
    const cleanUpdates = { ...updates, updated_at: new Date().toISOString() };
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_announcements")
          .update(cleanUpdates)
          .eq("id", id)
          .select();
        if (error) throw error;
        if (data && data.length > 0) return { success: true, data: data[0] };
      } catch (err) {
        console.warn("Supabase updateAnnouncement error, updating in mock storage:", err);
      }
    }

    if (MOCK_DATA.announcements) {
      const idx = MOCK_DATA.announcements.findIndex(a => String(a.id) === String(id));
      if (idx !== -1) {
        MOCK_DATA.announcements[idx] = { ...MOCK_DATA.announcements[idx], ...cleanUpdates };
        return { success: true, data: MOCK_DATA.announcements[idx], mock: true };
      }
    }
    return { success: false, error: "Announcement not found in memory" };
  },

  async deleteAnnouncement(id) {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_announcements")
          .delete()
          .eq("id", id)
          .select();
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.warn("Supabase deleteAnnouncement error, deleting from mock storage:", err);
      }
    }

    if (MOCK_DATA.announcements) {
      const initLen = MOCK_DATA.announcements.length;
      MOCK_DATA.announcements = MOCK_DATA.announcements.filter(a => String(a.id) !== String(id));
      return { success: true, mock: true, deleted: initLen !== MOCK_DATA.announcements.length };
    }
    return { success: true, mock: true };
  },

  // ==========================================
  // SEASON STATUS & LIFECYCLE SETTINGS
  // ==========================================
  async getSeasonSettings() {
    let cached = null;
    try {
      const saved = localStorage.getItem("frontline_season_settings");
      if (saved) cached = JSON.parse(saved);
    } catch (e) {
      console.warn("Error reading season settings from localStorage:", e);
    }

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .select("*")
          .eq("id", "season")
          .limit(1);

        const row = Array.isArray(data) ? data[0] : data;

        if (!error && row) {
          const settings = {
            season_number: parseInt(row.season_number, 10) || 1,
            status_state: row.status_state || "active",
            status_text: row.status_text || (row.status_state === "coming_soon" ? `SEASON ${row.season_number || 1} COMING SOON` : `SEASON ${row.season_number || 1} ACTIVE`)
          };
          try {
            localStorage.setItem("frontline_season_settings", JSON.stringify(settings));
          } catch (e) {}
          return settings;
        }
      } catch (err) {
        console.warn("Supabase getSeasonSettings query error, using local/fallback:", err);
      }
    }

    if (cached) return cached;
    return { ...MOCK_DATA.seasonSettings };
  },

  async updateSeasonSettings(newSettings) {
    const seasonNumber = parseInt(newSettings.season_number, 10) || 1;
    const statusState = newSettings.status_state === "coming_soon" ? "coming_soon" : "active";
    const statusText = newSettings.status_text || (statusState === "coming_soon" 
      ? `SEASON ${seasonNumber} COMING SOON` 
      : `SEASON ${seasonNumber} ACTIVE`);

    const record = {
      id: "season",
      season_number: seasonNumber,
      status_state: statusState,
      status_text: statusText,
      updated_at: new Date().toISOString()
    };

    // 1. Immediately cache to localStorage for instantaneous sync
    try {
      localStorage.setItem("frontline_season_settings", JSON.stringify(record));
    } catch (e) {}

    // 2. In-memory update
    MOCK_DATA.seasonSettings = { ...record };

    // 3. Immediately apply to current page DOM
    this.applySeasonBadge(record);

    // 4. Persist to Supabase if configured
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .upsert(record)
          .select();

        if (error) {
          console.error("Supabase upsert league_settings error:", error);
          return { success: false, data: record, error: error.message || String(error) };
        }
        return { success: true, data: data?.[0] || record };
      } catch (err) {
        console.error("Supabase updateSeasonSettings network error:", err);
        return { success: false, data: record, error: err.message || String(err) };
      }
    }

    return { success: true, data: record, mock: true };
  },

  applySeasonBadge(settings) {
    if (!settings) return;
    const seasonNum = settings.season_number || 1;
    const isComingSoon = settings.status_state === "coming_soon";
    const labelText = settings.status_text || (isComingSoon ? `SEASON ${seasonNum} COMING SOON` : `SEASON ${seasonNum} ACTIVE`);

    // 1. Update Brand Status badges (Top-left corner across all pages)
    const badges = document.querySelectorAll(".brand-status");
    badges.forEach(badge => {
      if (isComingSoon) {
        badge.classList.add("status-coming-soon");
        badge.classList.remove("status-active");
      } else {
        badge.classList.add("status-active");
        badge.classList.remove("status-coming-soon");
      }
      badge.innerHTML = `
        <span class="nav-beacon"></span>
        <span>${labelText}</span>
      `;
    });

    // 2. Update Floating Hero Tag (next to floating logo emblem on index.html)
    const heroTag = document.getElementById("hero-season-tag") || document.querySelector(".art .tag.top");
    if (heroTag) {
      let topText = `SEASON ${seasonNum}`;
      let boldText = isComingSoon ? "COMING SOON" : "NOW ACTIVE";
      if (settings.status_text) {
        const upper = settings.status_text.toUpperCase().trim();
        if (upper.includes("COMING SOON")) {
          topText = upper.replace("COMING SOON", "").trim() || `SEASON ${seasonNum}`;
          boldText = "COMING SOON";
        } else if (upper.includes("ACTIVE")) {
          topText = upper.replace("ACTIVE", "").trim() || `SEASON ${seasonNum}`;
          boldText = "NOW ACTIVE";
        }
      }
      const boldColor = isComingSoon ? "#ffb300" : "var(--lime)";
      heroTag.innerHTML = `${topText}<b style="color:${boldColor};">${boldText}</b>`;
    }
  },

  // ==============================================================================
  // RULEBOOK & MATCH DIRECTIVES ENGINE
  // ==============================================================================
  async getRulebook() {
    // 1. Try Supabase cloud sync first if configured
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .select("*")
          .eq("id", "rulebook")
          .maybeSingle();

        if (!error && data && data.status_text) {
          try {
            const parsed = JSON.parse(data.status_text);
            MOCK_DATA.rulebook = { ...MOCK_DATA.rulebook, ...parsed };
            try {
              localStorage.setItem("frontline_rulebook_data", JSON.stringify(MOCK_DATA.rulebook));
            } catch (e) {}
            return MOCK_DATA.rulebook;
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Supabase getRulebook query error:", err);
      }
    }

    // 2. Local storage check
    try {
      const saved = localStorage.getItem("frontline_rulebook_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        MOCK_DATA.rulebook = { ...MOCK_DATA.rulebook, ...parsed };
        return MOCK_DATA.rulebook;
      }
    } catch (e) {}

    // 3. Fallback to default
    return MOCK_DATA.rulebook;
  },

  async updateRulebook(newRulebook) {
    const merged = { ...MOCK_DATA.rulebook, ...newRulebook, updated_at: new Date().toISOString() };

    // 1. Immediately cache to localStorage for instantaneous sync
    try {
      localStorage.setItem("frontline_rulebook_data", JSON.stringify(merged));
    } catch (e) {}

    // 2. In-memory update
    MOCK_DATA.rulebook = { ...merged };

    // 3. Immediately apply to current page DOM if on rules.html
    this.applyRulebook(merged);

    // 4. Persist to Supabase if configured
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .upsert({
            id: "rulebook",
            status_text: JSON.stringify(merged),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error("Supabase upsert rulebook error:", error);
          return { success: false, data: merged, error: error.message || String(error) };
        }
        return { success: true, data: merged };
      } catch (err) {
        console.error("Supabase updateRulebook network error:", err);
        return { success: false, data: merged, error: err.message || String(err) };
      }
    }

    return { success: true, data: merged, mock: true };
  },

  applyRulebook(data) {
    if (!data) return;

    // Version badge
    const badgeEl = document.getElementById("ruleset-version-badge");
    if (badgeEl && data.version_tag) badgeEl.textContent = data.version_tag;

    // Headline & Intro
    const headEl = document.getElementById("rulebook-headline");
    if (headEl && data.headline) headEl.innerHTML = data.headline;
    const introEl = document.getElementById("rulebook-intro");
    if (introEl && data.intro_text) introEl.textContent = data.intro_text;

    // Bulletin Banner
    const bulletinEl = document.getElementById("rulebook-bulletin-banner");
    if (bulletinEl) {
      if (data.bulletin_active && data.bulletin_text) {
        bulletinEl.style.display = "block";
        bulletinEl.className = `rule-callout ${data.bulletin_type === "danger" ? "danger" : ""}`;
        bulletinEl.innerHTML = `<strong>OFFICIAL LEAGUE BULLETIN:</strong> ${data.bulletin_text}`;
      } else {
        bulletinEl.style.display = "none";
      }
    }

    // Match Settings Values
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.textContent = val;
    };

    setVal("val-hardpoint-score", `${data.hardpoint_score_limit || 250} POINTS`);
    setVal("val-hardpoint-time", `${data.hardpoint_time_limit || 5} MINUTES (${(data.hardpoint_time_limit || 5) * 60}S)`);
    setVal("val-hardpoint-hill", `${data.hardpoint_hill_timer || 60} SECONDS`);
    setVal("val-hardpoint-respawn", `${data.hardpoint_respawn_delay || 2.5} SECONDS`);

    setVal("val-snd-rounds", `${data.snd_round_win_limit || 6} ROUNDS`);
    setVal("val-snd-time", `${data.snd_round_length || 1.5} MINUTES (${Math.round((data.snd_round_length || 1.5) * 60)}S)`);
    setVal("val-snd-bomb", `${data.snd_bomb_timer || 45} SECONDS`);
    setVal("val-snd-plant", `${data.snd_plant_time || 5.0}S / ${data.snd_defuse_time || 7.5}S`);

    setVal("val-control-rounds", `${data.control_round_win_limit || 3} ROUNDS`);
    setVal("val-control-lives", `${data.control_lives || 30} LIVES`);
    setVal("val-control-time", `${data.control_round_time || 1.5} MINUTES (${Math.round((data.control_round_time || 1.5) * 60)}S)`);
    setVal("val-control-extra", `+${data.control_capture_extra || 1.0} MINUTE`);

    setVal("val-friendly-fire", (data.friendly_fire || "ENABLED").toUpperCase());
    setVal("val-killcam", (data.killcam || "DISABLED").toUpperCase());
    setVal("val-mounting", (data.mounting || "DISABLED").toUpperCase());

    // Regulations
    setVal("val-roster-size", data.roster_size);
    setVal("val-forfeit-map1", `${data.forfeit_map1_min || 10} MIN`);
    setVal("val-forfeit-series", `${data.forfeit_series_min || 15} MIN`);
    setVal("val-series-format", data.series_format);
    setVal("val-conduct-policy", data.conduct_policy);
    setVal("val-host-rules", data.host_rules);
    setVal("val-disconnect-rules", data.disconnect_rules);
    setVal("val-dispute-rules", data.dispute_rules);

    // Banned items lists
    const setTags = (containerId, textList, isBanned) => {
      const container = document.getElementById(containerId);
      if (!container || !textList) return;
      const items = textList.split(",").map(s => s.trim()).filter(Boolean);
      container.innerHTML = items.map(item => `
        <span class="item-tag-pill ${isBanned ? 'banned-pill' : 'allowed-pill'}">
          ${isBanned ? '❌' : '✓'} ${item.replace(/^[❌✓]\s*/, '')}
        </span>
      `).join("");
    };

    setTags("container-banned-weapons", data.banned_weapons, true);
    setTags("container-allowed-weapons", data.allowed_weapons, false);
    setTags("container-banned-attachments", data.banned_attachments, true);
    setTags("container-banned-equipment", data.banned_equipment, true);
    setTags("container-allowed-equipment", data.allowed_equipment, false);
    setTags("container-banned-upgrades", data.banned_upgrades_streaks, true);
    setTags("container-allowed-upgrades", data.allowed_upgrades_streaks, false);
  },

  // ==============================================================================
  // GENERAL DRAFT SYSTEM (WHEEL LOTTERY, GM SCOUTING, & DRAFT ANNOUNCEMENTS)
  // ==============================================================================
  async getDraftState(divisionId = "div-1") {
    const divKey = divisionId || "div-1";
    // 1. Try Supabase cloud sync first if configured
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .select("*")
          .eq("id", `draft_${divKey}`)
          .maybeSingle();
        if (!error && data && data.status_text) {
          try {
            const parsed = JSON.parse(data.status_text);
            return parsed;
          } catch(e) {}
        }
      } catch (err) {
        console.warn("Supabase getDraftState query error:", err);
      }
    }

    // 2. Local storage fallback
    try {
      const local = localStorage.getItem(`frontline_draft_state_${divKey}`) || (divKey === "div-1" ? localStorage.getItem("frontline_draft_state") : null);
      if (local) return JSON.parse(local);
    } catch (e) {}

    // 3. Default Initial Draft State
    return {
      division: divKey,
      draftOrder: [],
      currentRound: 1,
      currentPick: 1,
      onTheClock: null,
      timerSeconds: 120,
      status: "Lottery", // "Lottery", "Live", "Paused", "Completed"
      picks: []
    };
  },

  async saveDraftState(state, divisionId = "div-1") {
    if (!state) return { success: false, error: "Empty state" };
    const divKey = divisionId || state.division || "div-1";
    state.division = divKey;

    // 1. Local persistence
    try {
      localStorage.setItem(`frontline_draft_state_${divKey}`, JSON.stringify(state));
      if (divKey === "div-1") {
        localStorage.setItem("frontline_draft_state", JSON.stringify(state));
      }
    } catch (e) {}

    // 2. Cloud persistence in league_settings if table exists
    if (dbClient) {
      try {
        await dbClient
          .from("league_settings")
          .upsert({
            id: `draft_${divKey}`,
            status_state: state.status || "active",
            status_text: JSON.stringify(state),
            updated_at: new Date().toISOString()
          }, { onConflict: "id" });
      } catch (err) {
        console.warn("Cloud saveDraftState note:", err.message || err);
      }
    }

    return { success: true, data: state };
  },

  async getFreeAgents(divisionId = "div-1") {
    const players = await this.getPlayers();
    let signups = [];
    try {
      signups = await this.getSignups();
    } catch(e) {}

    // Filter free agents from players table
    const faPlayers = (players || []).filter(p => {
      const team = (p.teams?.name || p.team_name || "").toLowerCase();
      const status = (p.status || "").toLowerCase();
      return !p.teams || team === "free agent" || team === "unassigned" || status === "free agent";
    }).map(p => ({
      ...p,
      source: "player",
      isDrafted: false
    }));

    // Filter free agents from signups table
    const faSignups = (signups || []).filter(s => {
      const regType = (s.registration_type || "").toLowerCase();
      return regType.includes("free agent") || !s.team_name;
    }).map(s => ({
      id: `signup-${s.id}`,
      gamertag: s.gamertag,
      discord_name: s.discord_username || s.discord_name || s.gamertag,
      activision_id: s.activision_id || `${s.gamertag}#0000`,
      role: s.role || "Flex",
      platform: s.platform || "PC",
      region: s.region || "NA East",
      notes: s.notes || "Registered via Recruitment Portal",
      rank: "1.0",
      status: "Free Agent",
      kdr: null,
      total_kills: 0,
      total_deaths: 0,
      team_name: "Free Agent",
      source: "signup",
      isDrafted: false
    }));

    // Deduplicate by gamertag
    const seenTags = new Set();
    const merged = [];

    [...faPlayers, ...faSignups].forEach(p => {
      const lower = (p.gamertag || "").toLowerCase().trim();
      if (!lower || seenTags.has(lower)) return;
      seenTags.add(lower);
      merged.push(p);
    });

    // Check draft state for any drafted players in this division
    try {
      const state = await this.getDraftState(divisionId);
      const draftedPicks = state?.picks || [];
      const draftedTags = new Map();
      draftedPicks.forEach(pick => {
        if (pick.player_gamertag) {
          draftedTags.set(pick.player_gamertag.toLowerCase(), pick);
        }
      });

      merged.forEach(p => {
        const tagLower = (p.gamertag || "").toLowerCase();
        if (draftedTags.has(tagLower)) {
          const match = draftedTags.get(tagLower);
          p.isDrafted = true;
          p.draftedBy = match.team_name;
          p.draftRound = match.round;
          p.draftPick = match.pick;
          p.is_autodraft = !!match.is_autodraft;
        }
      });
    } catch(e) {}

    return merged;
  },

  async recordDraftPick(pickData, divisionId = "div-1") {
    const divKey = divisionId || pickData.division || "div-1";
    const state = await this.getDraftState(divKey);
    if (!state.picks) state.picks = [];

    const isAuto = !!pickData.is_autodraft;
    const newPick = {
      id: `pick-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      division: divKey,
      round: pickData.round || state.currentRound || 1,
      pick: pickData.pick || state.currentPick || (state.picks.length + 1),
      team_name: pickData.team_name,
      team_tag: pickData.team_tag || "",
      player_gamertag: pickData.player_gamertag,
      player_role: pickData.player_role || "Flex",
      player_kdr: pickData.player_kdr || null,
      notes: pickData.notes || "",
      is_autodraft: isAuto,
      timestamp: new Date().toISOString()
    };

    state.picks.push(newPick);

    // Calculate next onTheClock team if draftOrder exists
    const order = state.draftOrder || [];
    if (order.length > 0) {
      const nextOverallPick = state.picks.length + 1;
      const numTeams = order.length;
      const roundIndex = Math.floor((nextOverallPick - 1) / numTeams);
      const pickInRound = (nextOverallPick - 1) % numTeams;
      
      // Snake draft logic: odd rounds forward, even rounds backward
      const teamIdx = roundIndex % 2 === 0 ? pickInRound : (numTeams - 1 - pickInRound);
      const nextTeam = order[teamIdx];

      state.currentRound = roundIndex + 1;
      state.currentPick = nextOverallPick;
      state.onTheClock = nextTeam ? nextTeam.name : null;
    } else {
      state.currentPick = (state.currentPick || 1) + 1;
    }

    await this.saveDraftState(state, divKey);

    // Broadcast pick to league_announcements as an official update!
    try {
      const divLabel = divKey === "div-2" ? "Division 2" : (divKey === "div-3" ? "Division 3" : "Division 1");
      const autoBadge = isAuto ? " [AUTO-DRAFT: CLOCK EXPIRED]" : "";
      await this.addAnnouncement({
        title: `DRAFT PICK: [${divLabel}] Round ${newPick.round} Pick #${newPick.pick} - ${newPick.team_name}${autoBadge}`,
        message: `${newPick.team_name} selects ${newPick.player_gamertag} (${newPick.player_role})${isAuto ? ' via automatic system selection' : ''}${newPick.notes ? ` · "${newPick.notes}"` : ""}.`,
        tag: isAuto ? "Auto-Draft" : "Draft Pick",
        tag_color: isAuto ? "amber" : "lime",
        link_url: "draft.html",
        link_text: "View Live Draft HQ ↗",
        pinned: false,
        is_active: true
      });
    } catch (annErr) {
      console.warn("Could not post draft announcement to main board:", annErr);
    }

    return { success: true, pick: newPick, state };
  },

  // ==============================================================================
  // 8-WEEK MATCH SCHEDULING SYSTEM (2 PRESEASON + 6 REGULAR SEASON)
  // ==============================================================================

  // Fetch all scheduled matches with optional filters
  async getScheduledMatches(filters = {}) {
    let matches = [];

    if (dbClient) {
      try {
        let query = dbClient
          .from("scheduled_matches")
          .select("*")
          .order("week_number", { ascending: true })
          .order("id", { ascending: true });

        if (filters.week_number) {
          query = query.eq("week_number", Number(filters.week_number));
        }
        if (filters.season_type) {
          query = query.eq("season_type", filters.season_type);
        }
        if (filters.status) {
          query = query.eq("status", filters.status);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          matches = data;
          try {
            localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Could not fetch scheduled_matches from Supabase, checking local cache:", err);
      }
    }

    // Fallback to localStorage or MOCK_DATA
    if (!matches || matches.length === 0) {
      try {
        const cached = localStorage.getItem("frontline_scheduled_matches");
        if (cached) {
          matches = JSON.parse(cached);
        }
      } catch (e) {}
    }

    if (!matches || matches.length === 0) {
      matches = (MOCK_DATA.scheduled_matches || []).map(m => ({ ...m }));
      try {
        localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
      } catch (e) {}
    }

    // Apply in-memory filters if needed
    if (filters) {
      if (filters.week_number) {
        matches = matches.filter(m => Number(m.week_number) === Number(filters.week_number));
      }
      if (filters.season_type) {
        matches = matches.filter(m => m.season_type === filters.season_type);
      }
      if (filters.status && filters.status !== "all") {
        matches = matches.filter(m => m.status && m.status.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.team_id) {
        const tid = Number(filters.team_id);
        matches = matches.filter(m => Number(m.team1_id) === tid || Number(m.team2_id) === tid);
      }
      if (filters.team_name) {
        const queryTerm = filters.team_name.toLowerCase().trim();
        matches = matches.filter(m => 
          (m.team1_name && m.team1_name.toLowerCase().includes(queryTerm)) ||
          (m.team2_name && m.team2_name.toLowerCase().includes(queryTerm)) ||
          (m.team1_tag && m.team1_tag.toLowerCase().includes(queryTerm)) ||
          (m.team2_tag && m.team2_tag.toLowerCase().includes(queryTerm))
        );
      }
    }

    return matches;
  },

  async getTeams() {
    return this.getStandings();
  },

  // Generate an 8-week randomized schedule: Weeks 1-2 Preseason, Weeks 3-8 Regular Season
  async generate8WeekSchedule(options = {}) {
    let teams = options.teams;
    if (!teams || teams.length === 0) {
      teams = await this.getStandings();
    }
    if (!teams || teams.length < 2) {
      teams = MOCK_DATA.teams || [];
    }
    if (!teams || teams.length < 2) {
      return { success: false, error: "At least 2 active teams are required to generate an 8-week schedule." };
    }

    // Options defaults
    const today = new Date();
    // Default start date to next Friday (or today if Friday)
    const nextFriday = new Date();
    const dayOfWeek = nextFriday.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    nextFriday.setDate(nextFriday.getDate() + (dayOfWeek === 5 ? 0 : daysUntilFriday));
    
    const startDateStr = options.startDate || nextFriday.toISOString().split("T")[0];
    const timeSlots = options.timeSlots || ["6:00 PM EST", "7:15 PM EST", "8:30 PM EST", "9:45 PM EST"];
    const bestOf = options.bestOf || 5;

    // Helper: Fisher-Yates array shuffle
    function shuffleArray(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    // Helper: Generate round-robin rounds using Circle Method
    function generateRoundRobinRounds(teamList) {
      let list = [...teamList];
      if (list.length % 2 !== 0) {
        list.push({ id: null, name: "BYE", tag: "BYE", isBye: true });
      }
      const n = list.length;
      const rounds = [];
      const totalRounds = n - 1;
      const half = n / 2;

      let current = [...list];
      for (let r = 0; r < totalRounds; r++) {
        const roundPairs = [];
        for (let i = 0; i < half; i++) {
          const t1 = current[i];
          const t2 = current[n - 1 - i];
          if (!t1.isBye && !t2.isBye) {
            // Randomly alternate home/away
            const flip = Math.random() > 0.5;
            roundPairs.push(flip ? [t1, t2] : [t2, t1]);
          }
        }
        rounds.push(roundPairs);

        // Rotate
        const fixed = current[0];
        const rest = current.slice(1);
        const last = rest.pop();
        rest.unshift(last);
        current = [fixed, ...rest];
      }
      return rounds;
    }

    // Helper: Collect N randomized rounds across cycles
    function getRounds(count) {
      const collected = [];
      let attempts = 0;
      while (collected.length < count && attempts < 20) {
        attempts++;
        const shuffledTeams = shuffleArray(teams);
        const cycleRounds = shuffleArray(generateRoundRobinRounds(shuffledTeams));
        for (const r of cycleRounds) {
          if (r.length > 0) {
            collected.push(r);
            if (collected.length >= count) break;
          }
        }
      }
      return collected;
    }

    // Preseason: Exactly 2 Weeks (Week 1 and Week 2)
    const preseasonRounds = getRounds(2);
    // Regular Season: Exactly 6 Weeks (Week 3 to Week 8)
    const regularRounds = getRounds(6);

    const generatedMatches = [];
    const baseDate = new Date(startDateStr + "T12:00:00");
    let matchCounter = 1;

    // Build Preseason Weeks (Week 1 & Week 2)
    for (let w = 1; w <= 2; w++) {
      const round = preseasonRounds[w - 1] || [];
      const matchDate = new Date(baseDate);
      matchDate.setDate(baseDate.getDate() + (w - 1) * 7);
      const dateFormatted = matchDate.toISOString().split("T")[0];

      round.forEach((pair, idx) => {
        generatedMatches.push({
          id: Date.now() + matchCounter,
          week_number: w,
          season_type: "preseason",
          week_label: `Preseason Week ${w}`,
          match_number: matchCounter++,
          team1_id: pair[0].id || null,
          team1_name: pair[0].name,
          team1_tag: pair[0].tag || "CDL",
          team1_score: 0,
          team2_id: pair[1].id || null,
          team2_name: pair[1].name,
          team2_tag: pair[1].tag || "CDL",
          team2_score: 0,
          winner_id: null,
          winner_name: null,
          status: "Scheduled",
          scheduled_date: dateFormatted,
          scheduled_time: timeSlots[idx % timeSlots.length],
          best_of: bestOf,
          stream_url: null,
          standings_recorded: false,
          created_at: new Date().toISOString()
        });
      });
    }

    // Build Regular Season Weeks (Weeks 3 to 8, representing Regular Season Weeks 1 to 6)
    for (let rw = 1; rw <= 6; rw++) {
      const weekNum = rw + 2;
      const round = regularRounds[rw - 1] || [];
      const matchDate = new Date(baseDate);
      matchDate.setDate(baseDate.getDate() + (weekNum - 1) * 7);
      const dateFormatted = matchDate.toISOString().split("T")[0];

      round.forEach((pair, idx) => {
        generatedMatches.push({
          id: Date.now() + matchCounter,
          week_number: weekNum,
          season_type: "regular",
          week_label: `Regular Season Week ${rw}`,
          match_number: matchCounter++,
          team1_id: pair[0].id || null,
          team1_name: pair[0].name,
          team1_tag: pair[0].tag || "CDL",
          team1_score: 0,
          team2_id: pair[1].id || null,
          team2_name: pair[1].name,
          team2_tag: pair[1].tag || "CDL",
          team2_score: 0,
          winner_id: null,
          winner_name: null,
          status: "Scheduled",
          scheduled_date: dateFormatted,
          scheduled_time: timeSlots[idx % timeSlots.length],
          best_of: bestOf,
          stream_url: null,
          standings_recorded: false,
          created_at: new Date().toISOString()
        });
      });
    }

    // Save to localStorage immediately
    try {
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify(generatedMatches));
    } catch (e) {}

    // Persist to Supabase if available
    if (dbClient) {
      try {
        // Clear previous schedule
        await dbClient.from("scheduled_matches").delete().gte("id", 0);
        
        // Strip client temporary IDs for Supabase autoincrement
        const dbPayload = generatedMatches.map(({ id, standings_recorded, ...m }) => m);
        const { data, error } = await dbClient.from("scheduled_matches").insert(dbPayload).select();
        if (!error && Array.isArray(data) && data.length > 0) {
          // Update cached matches with database IDs
          try {
            localStorage.setItem("frontline_scheduled_matches", JSON.stringify(data));
          } catch (e) {}
        }
      } catch (cloudErr) {
        console.warn("Could not sync generated schedule to Supabase table (offline or table not yet created):", cloudErr);
      }
    }

    // Broadcast announcement
    try {
      await this.addAnnouncement({
        title: "Official 8-Week Match Schedule Published!",
        message: `The official league schedule has been drawn: 2 weeks of Preseason exhibition clashes followed by 6 weeks of intense Regular Season competition. Head to the Match Schedule to view all matchups!`,
        tag: "Schedule Alert",
        tag_color: "lime",
        link_url: "schedule.html",
        link_text: "View 8-Week Schedule ↗",
        pinned: true,
        is_active: true
      });
    } catch (annErr) {}

    return { success: true, count: generatedMatches.length, matches: generatedMatches };
  },

  // Add a single custom scheduled match
  async createScheduledMatch(matchData) {
    const newMatch = {
      id: matchData.id || Date.now(),
      week_number: Number(matchData.week_number) || 1,
      season_type: matchData.season_type || (Number(matchData.week_number) <= 2 ? "preseason" : "regular"),
      week_label: matchData.week_label || (Number(matchData.week_number) <= 2 ? `Preseason Week ${matchData.week_number}` : `Regular Season Week ${Number(matchData.week_number) - 2}`),
      match_number: matchData.match_number || Date.now(),
      team1_id: matchData.team1_id || null,
      team1_name: matchData.team1_name,
      team1_tag: matchData.team1_tag || "CDL",
      team1_score: Number(matchData.team1_score ?? 0),
      team2_id: matchData.team2_id || null,
      team2_name: matchData.team2_name,
      team2_tag: matchData.team2_tag || "CDL",
      team2_score: Number(matchData.team2_score ?? 0),
      winner_id: matchData.winner_id || null,
      winner_name: matchData.winner_name || null,
      status: matchData.status || "Scheduled",
      scheduled_date: matchData.scheduled_date || new Date().toISOString().split("T")[0],
      scheduled_time: matchData.scheduled_time || "7:00 PM EST",
      best_of: Number(matchData.best_of || 5),
      stream_url: matchData.stream_url || null,
      standings_recorded: false,
      created_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        const { id, standings_recorded, ...dbFields } = newMatch;
        const { data, error } = await dbClient.from("scheduled_matches").insert([dbFields]).select();
        if (!error && Array.isArray(data) && data.length > 0) {
          newMatch.id = data[0].id;
        }
      } catch (err) {
        console.warn("Could not insert custom match to Supabase:", err);
      }
    }

    let matches = await this.getScheduledMatches();
    matches.push(newMatch);
    try {
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
    } catch (e) {}

    return { success: true, match: newMatch };
  },

  // Record/update match score, status, and optionally standings
  async recordScheduledMatchResult(matchId, resultData) {
    const s1 = Number(resultData.team1_score ?? 0);
    const s2 = Number(resultData.team2_score ?? 0);
    const status = resultData.status || (s1 > 0 || s2 > 0 ? "Completed" : "Scheduled");

    let matches = await this.getScheduledMatches();
    const match = matches.find(m => String(m.id) === String(matchId));
    if (!match) {
      return { success: false, error: "Match not found" };
    }

    let winnerId = null;
    let winnerName = null;
    if (s1 > s2) {
      winnerId = match.team1_id;
      winnerName = match.team1_name;
    } else if (s2 > s1) {
      winnerId = match.team2_id;
      winnerName = match.team2_name;
    }

    const updates = {
      team1_score: s1,
      team2_score: s2,
      status: status,
      winner_id: winnerId,
      winner_name: winnerName
    };
    if (resultData.scheduled_date) updates.scheduled_date = resultData.scheduled_date;
    if (resultData.scheduled_time) updates.scheduled_time = resultData.scheduled_time;
    if (resultData.best_of) updates.best_of = Number(resultData.best_of);
    if (resultData.stream_url !== undefined) updates.stream_url = resultData.stream_url;

    // Apply to standings if requested and not already recorded
    const shouldUpdateStandings = resultData.update_standings && !match.standings_recorded && status === "Completed" && winnerId;
    if (shouldUpdateStandings) {
      try {
        await this.recordMatchResult(match.team1_id, match.team2_id, s1, s2, winnerId, resultData.pointsDelta || 10);
        updates.standings_recorded = true;
      } catch (standErr) {
        console.warn("Standings update failed:", standErr);
      }
    }

    // Persist to Supabase
    if (dbClient) {
      try {
        const { standings_recorded, ...dbFields } = updates;
        await dbClient.from("scheduled_matches").update(dbFields).eq("id", matchId);
      } catch (e) {
        console.warn("Supabase scheduled_matches update failed, persisting locally:", e);
      }
    }

    // Update in memory and localStorage
    Object.assign(match, updates);
    try {
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
    } catch (e) {}

    return { success: true, match };
  },

  // Update match details (date, time, teams, stream, etc.)
  async updateScheduledMatch(matchId, updates) {
    let matches = await this.getScheduledMatches();
    const match = matches.find(m => String(m.id) === String(matchId));
    if (!match) return { success: false, error: "Match not found" };

    if (dbClient) {
      try {
        await dbClient.from("scheduled_matches").update(updates).eq("id", matchId);
      } catch (e) {
        console.warn("Supabase update error:", e);
      }
    }

    Object.assign(match, updates);
    try {
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
    } catch (e) {}

    return { success: true, match };
  },

  // Delete a single scheduled match
  async deleteScheduledMatch(matchId) {
    if (dbClient) {
      try {
        await dbClient.from("scheduled_matches").delete().eq("id", matchId);
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
    }

    let matches = await this.getScheduledMatches();
    matches = matches.filter(m => String(m.id) !== String(matchId));
    try {
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify(matches));
    } catch (e) {}

    return { success: true };
  },

  // Clear all scheduled matches
  async clearScheduledMatches() {
    if (dbClient) {
      try {
        await dbClient.from("scheduled_matches").delete().gte("id", 0);
      } catch (e) {
        console.warn("Supabase clear error:", e);
      }
    }

    try {
      localStorage.removeItem("frontline_scheduled_matches");
      localStorage.setItem("frontline_scheduled_matches", JSON.stringify([]));
    } catch (e) {}

    return { success: true };
  },

  // ==========================================
  // STAFF & ADMIN AUTHENTICATION (SUPABASE AUTH)
  // ==========================================
  client: dbClient,
  async getAuthSession() {
    if (!dbClient) return null;
    try {
      const { data } = await dbClient.auth.getSession();
      return data?.session || null;
    } catch (e) {
      return null;
    }
  },

  async signInAdmin(email, password) {
    if (!dbClient) {
      return { success: false, error: "Database client is not connected." };
    }
    try {
      const { data, error } = await dbClient.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      if (error) {
        return { success: false, error: error.message };
      }
      // Security Check: verify this is NOT a regular player account
      const userRole = data.user?.app_metadata?.role || data.user?.user_metadata?.role;
      if (userRole === "player") {
        await dbClient.auth.signOut();
        return {
          success: false,
          error: "Access Denied: This is a Combatant Player account. Staff credentials are required for the Admin Console."
        };
      }
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Sign-in error occurred." };
    }
  },

  async signOutAdmin() {
    if (!dbClient) return { success: true };
    try {
      await dbClient.auth.signOut();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // PLAYER / USER AUTHENTICATION (SUPABASE AUTH)
  // ==========================================
  async signUpPlayer(email, password, gamertag = "") {
    if (!dbClient) {
      return { success: false, error: "Database client is not connected." };
    }
    try {
      const { data, error } = await dbClient.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            gamertag: gamertag.trim() || undefined,
            role: "player"
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresEmailConfirmation: !data.session && !!data.user
      };
    } catch (err) {
      return { success: false, error: err.message || "Account creation failed." };
    }
  },

  async signInPlayer(email, password) {
    if (!dbClient) {
      return { success: false, error: "Database client is not connected." };
    }
    try {
      const { data, error } = await dbClient.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Sign-in error occurred." };
    }
  },

  async signOutPlayer() {
    if (!dbClient) return { success: true };
    try {
      await dbClient.auth.signOut();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  paypalConfig: PAYPAL_CONFIG,
  isConfigured: isSupabaseConfigured
};

// ==============================================================================
// AUTO-INITIALIZE GLOBAL SEASON BADGE ACROSS ALL PAGES
// ==============================================================================
(function initGlobalSeasonBadge() {
  function updateBadge() {
    // 1. Instant check from localStorage (synchronous)
    try {
      const saved = localStorage.getItem("frontline_season_settings");
      if (saved) {
        window.LeagueDB.applySeasonBadge(JSON.parse(saved));
      }
    } catch (e) {}

    // 2. Asynchronous cloud sync from Supabase
    if (window.LeagueDB && typeof window.LeagueDB.getSeasonSettings === "function") {
      window.LeagueDB.getSeasonSettings().then(settings => {
        if (settings) {
          window.LeagueDB.applySeasonBadge(settings);
          try {
            localStorage.setItem("frontline_season_settings", JSON.stringify(settings));
          } catch (e) {}
        }
      }).catch(() => {});
    }
  }

  // Execute immediately without waiting for DOMContentLoaded if elements exist
  updateBadge();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBadge);
  }

  // Cross-tab real-time sync when admin saves in another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "frontline_season_settings" && e.newValue) {
      try {
        window.LeagueDB.applySeasonBadge(JSON.parse(e.newValue));
      } catch (err) {}
    }
  });
})();

// ==============================================================================
// STEALTH ADMIN ACCESS TRIGGER
// ==============================================================================
(function setupStealthAdminTrigger() {
  if (window.__stealthAdminTriggerInstalled) return;
  window.__stealthAdminTriggerInstalled = true;

  let keyBuffer = "";

  function triggerAdminRedirect() {
    if (window.location.pathname.endsWith("admin.html")) return;
    window.location.href = "admin.html";
  }

  // Use capture phase on window so nothing intercepts or prevents the event
  window.addEventListener(
    "keydown",
    (e) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.isContentEditable);

      const key = (e.key || "").toLowerCase();
      const code = e.code || "";

      // 1. Classic Call of Duty console key: Tilde / Backtick ` or ~ (when not in a text box)
      if (!isInput && (key === "`" || key === "~" || code === "Backquote")) {
        e.preventDefault();
        triggerAdminRedirect();
        return;
      }

      // 2. Secret word: typing "admin" anywhere on page (when not in a text box)
      if (!isInput && key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        keyBuffer += key;
        if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
        if (keyBuffer.endsWith("admin")) {
          keyBuffer = "";
          triggerAdminRedirect();
          return;
        }
      }

      // 3. Ctrl + Shift + L (L for League / Login - completely free of browser conflicts)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === "l" || code === "KeyL")) {
        e.preventDefault();
        triggerAdminRedirect();
        return;
      }

      // 4. Alt + A (Simple, fast, no browser conflict)
      if (e.altKey && !e.ctrlKey && !e.shiftKey && (key === "a" || code === "KeyA")) {
        e.preventDefault();
        triggerAdminRedirect();
        return;
      }

      // 5. Ctrl + Alt + A
      if ((e.ctrlKey || e.metaKey) && e.altKey && (key === "a" || code === "KeyA")) {
        e.preventDefault();
        triggerAdminRedirect();
        return;
      }
    },
    true
  );
})();

