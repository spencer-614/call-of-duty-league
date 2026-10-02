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
  window.dbClient = dbClient;
  window.supabaseClient = dbClient;
}
window.SUPABASE_CONFIG = { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };

// Fallback Mock Data (displayed if Supabase credentials have not been configured yet)
const MOCK_DATA = {
  teams: [
    { id: 1, name: "Night Shift", tag: "NSH", division: "Division 1 (Pro)", wins: 5, losses: 1, points: 50 },
    { id: 2, name: "Vantage", tag: "VTG", division: "Division 1 (Pro)", wins: 4, losses: 2, points: 40 },
    { id: 3, name: "Redline", tag: "RED", division: "Division 2 (Challengers)", wins: 3, losses: 3, points: 30 },
    { id: 4, name: "Static", tag: "STC", division: "Division 2 (Challengers)", wins: 1, losses: 5, points: 10 },
    { id: 5, name: "Underdogs", tag: "UND", division: "Open Division", wins: 2, losses: 4, points: 20 }
  ],
  players: [
    { id: 1, gamertag: "Apex", discord_name: "Apex", activision_id: "Apex#8392014", role: "SMG", rank: "1.5", skill_rank: "1.5", division: "Division 1 (Pro)", status: "Active", kdr: 1.28, total_kills: 342, total_deaths: 267, teams: { name: "Night Shift", tag: "NSH", division: "Division 1 (Pro)" } },
    { id: 2, gamertag: "Ghost", discord_name: "Ghost", activision_id: "Ghost#4920111", role: "Main AR", rank: "1.0", skill_rank: "1.0", division: "Division 1 (Pro)", status: "Active", kdr: 1.15, total_kills: 298, total_deaths: 259, teams: { name: "Night Shift", tag: "NSH", division: "Division 1 (Pro)" } },
    { id: 3, gamertag: "Viper", discord_name: "Viper", activision_id: "Viper#9382012", role: "Flex", rank: "1.0", skill_rank: "1.0", division: "Division 1 (Pro)", status: "Active", kdr: 1.05, total_kills: 275, total_deaths: 262, teams: { name: "Night Shift", tag: "NSH", division: "Division 1 (Pro)" } },
    { id: 4, gamertag: "Blitz", discord_name: "Blitz", activision_id: "Blitz#1928374", role: "SMG", rank: "0.5", skill_rank: "0.5", division: "Division 1 (Pro)", status: "Active", kdr: 0.98, total_kills: 250, total_deaths: 255, teams: { name: "Night Shift", tag: "NSH", division: "Division 1 (Pro)" } },
    { id: 5, gamertag: "Specter", discord_name: "Specter", activision_id: "Specter#7492810", role: "Main AR", rank: "1.5", skill_rank: "1.5", division: "Division 1 (Pro)", status: "Active", kdr: 1.22, total_kills: 310, total_deaths: 254, teams: { name: "Vantage", tag: "VTG", division: "Division 1 (Pro)" } },
    { id: 6, gamertag: "Havoc", discord_name: "Havoc", activision_id: "Havoc#6291038", role: "SMG", rank: "1.0", skill_rank: "1.0", division: "Division 1 (Pro)", status: "Active", kdr: 1.10, total_kills: 290, total_deaths: 263, teams: { name: "Vantage", tag: "VTG", division: "Division 1 (Pro)" } },
    { id: 7, gamertag: "Zero", discord_name: "Zero", activision_id: "Zero#8192039", role: "Flex", rank: "0.5", skill_rank: "0.5", division: "Division 1 (Pro)", status: "Active", kdr: 1.02, total_kills: 260, total_deaths: 255, teams: { name: "Vantage", tag: "VTG", division: "Division 1 (Pro)" } },
    { id: 8, gamertag: "Ranger", discord_name: "Ranger", activision_id: "Ranger#3918274", role: "SMG", rank: "0.5", skill_rank: "0.5", division: "Division 1 (Pro)", status: "Active", kdr: 0.95, total_kills: 230, total_deaths: 242, teams: { name: "Vantage", tag: "VTG", division: "Division 1 (Pro)" } },
    { id: 9, gamertag: "Reaper", discord_name: "Reaper", activision_id: "Reaper#2918374", role: "Main AR", rank: "1.5", skill_rank: "1.5", division: "Division 2 (Challengers)", status: "Active", kdr: 1.18, total_kills: 305, total_deaths: 258, teams: { name: "Redline", tag: "RED", division: "Division 2 (Challengers)" } },
    { id: 10, gamertag: "Pulse", discord_name: "Pulse", activision_id: "Pulse#8472910", role: "SMG", rank: "1.0", skill_rank: "1.0", division: "Division 2 (Challengers)", status: "Active", kdr: 1.04, total_kills: 280, total_deaths: 270, teams: { name: "Redline", tag: "RED", division: "Division 2 (Challengers)" } },
    { id: 11, gamertag: "Titan", discord_name: "Titan", activision_id: "Titan#3829104", role: "Main AR", rank: "1.0", skill_rank: "1.0", division: "Division 2 (Challengers)", status: "Active", kdr: 1.06, total_kills: 265, total_deaths: 250, teams: { name: "Static", tag: "STC", division: "Division 2 (Challengers)" } },
    { id: 12, gamertag: "Flash", discord_name: "Flash", activision_id: "Flash#1948201", role: "SMG", rank: "0.5", skill_rank: "0.5", division: "Division 2 (Challengers)", status: "Active", kdr: 0.94, total_kills: 235, total_deaths: 250, teams: { name: "Static", tag: "STC", division: "Division 2 (Challengers)" } },
    // Free Agents & Community entries from Directory
    { id: 13, gamertag: "btc", discord_name: "btc", activision_id: "btc#4380973", role: "Flex", rank: "0.5", skill_rank: "0.5", division: "Free Agent", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 14, gamertag: "c0m-_-", discord_name: "c0m-_-", activision_id: "c0m#1095449", role: "SMG", rank: "1.0", skill_rank: "1.0", division: "Free Agent", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 15, gamertag: "Clix04", discord_name: "Clix04", activision_id: "[LFT]Maddengamer04#2877956", role: "Main AR", rank: "1.5", skill_rank: "1.5", division: "Free Agent", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 16, gamertag: "CoolRanchhh", discord_name: "CoolRanchhh", activision_id: "CoolRanch#7450412", role: "SMG", rank: "0.5", skill_rank: "0.5", division: "Open Division", status: "Active", kdr: 0.54, total_kills: 142, total_deaths: 263, teams: { name: "Underdogs", tag: "UND", division: "Open Division" }, team_name: "Underdogs" },
    { id: 17, gamertag: "Vortex", discord_name: "Vortex", activision_id: "Vortex#8291034", role: "Flex", rank: "1.0", skill_rank: "1.0", division: "Free Agent", status: "Free Agent", kdr: null, total_kills: 0, total_deaths: 0, teams: null, team_name: "Free Agent" },
    { id: 18, gamertag: "Shadow", discord_name: "Shadow", activision_id: "Shadow#9102938", role: "Sniper", rank: "0.5", skill_rank: "0.5", division: "Free Agent", status: "Free Agent", kdr: 1.12, total_kills: 410, total_deaths: 366, teams: null, team_name: "Free Agent" }
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
  staffRoles: [
    { id: 1, email: "admin@frontlineleague.com", display_name: "League Director", role: "commissioner", notes: "Primary commissioner" },
    { id: 2, email: "referee@frontlineleague.com", display_name: "Head Referee", role: "referee", notes: "Match scoring & map stats" },
    { id: 3, email: "roster@frontlineleague.com", display_name: "Roster GM", role: "roster_manager", notes: "Squad rosters & enlistment" },
    { id: 4, email: "recruiter@frontlineleague.com", display_name: "Recruitment Lead", role: "recruiter", notes: "Signup queue & free agents" },
    { id: 5, email: "broadcast@frontlineleague.com", display_name: "Media Crew", role: "broadcaster", notes: "Livestreams & announcements" }
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
    dispute_rules: "Match dispute tickets must be logged in Discord #match-disputes within 30 minutes with timestamped video (Twitch/YouTube) or scoreboard screenshots.",

    rules_list: [
      {
        id: "rule_1_1",
        section: "league",
        tag: "§ 1.1",
        title: "Roster Composition & Combatant Eligibility",
        badge: "4V4 SQUAD",
        badge_type: "lime",
        description: "All official Frontline League matches are contested in a 4v4 format across permitted cross-platform systems (PC, PlayStation, Xbox).",
        bullets: [
          "Roster Size: Each franchise team may register four (4) active starting players and up to two (2) designated reserve/substitute players.",
          "Player Verification: All players must have a verified Frontline Combatant Account with their active Activision ID (including tag numbers) and Discord handle logged in the league database.",
          "Cross-Team Roster Lock: A player may not compete for more than one franchise team within the same division during the regular season without an official front-office trade approved by the League Director."
        ]
      },
      {
        id: "rule_1_2",
        section: "league",
        tag: "§ 1.2",
        title: "Match Scheduling & 10-Minute Forfeit Grace Period",
        badge: "STRICT DEADLINE",
        badge_type: "warn",
        description: "Match fixtures are published weekly on the official Schedule HQ. Team captains bear primary responsibility for confirming match start times.",
        bullets: [
          "Discord Check-In: Both team captains must check into the designated Discord match thread at least fifteen (15) minutes prior to the scheduled broadcast start time.",
          "Map 1 Forfeit (10 Min): If a team does not have four players present in the custom lobby ten (10) minutes after scheduled start time, Map 1 is officially forfeited.",
          "Series Forfeit (15 Min): If a team fails to field four players fifteen (15) minutes past scheduled match time, the entire Best-of-5 series is forfeited as a 3–0 loss.",
          "Emergency Reschedule: Reschedule requests must be submitted to league administrators at least twenty-four (24) hours in advance and mutually agreed upon in writing by both captains."
        ]
      },
      {
        id: "rule_1_3",
        section: "league",
        tag: "§ 1.3",
        title: "Best-of-5 Match Sequence & Map Vetoes",
        badge: "BO5 ROTATION",
        badge_type: "lime",
        description: "All regular season and playoff matches follow the standardized 5-map competitive rotation:",
        callout: "<strong>Official Best-of-5 Order:</strong><br />• Map 1: <strong>Hardpoint</strong><br />• Map 2: <strong>Search & Destroy</strong><br />• Map 3: <strong>Control</strong><br />• Map 4: <strong>Hardpoint</strong> (if required)<br />• Map 5: <strong>Search & Destroy</strong> (decider)",
        callout_type: "info",
        bullets: [
          "Higher Seed Privilege: The higher-seeded team (or coin-flip winner in Week 1) selects whether to choose Map 1 host/side or initiate map vetos.",
          "No Repeated Maps: No map may be played more than once in the same Best-of-5 series."
        ]
      },
      {
        id: "rule_1_4",
        section: "league",
        tag: "§ 1.4",
        title: "Standings Points & Tiebreaker Hierarchy",
        badge: "SCORING MATRIX",
        badge_type: "lime",
        description: "Standings and postseason tournament seedings are determined strictly by the following hierarchy:",
        bullets: [
          "Match Series Wins: Primary rank sorted by total series won (3 pts per win, 0 pts per loss).",
          "Map Differential (Net +/-): Total maps won minus total maps lost across all played matches.",
          "Head-to-Head Record: Direct series and map score between tied squads.",
          "Total Maps Won: Cumulative volume of map victories."
        ]
      },
      {
        id: "rule_1_5",
        section: "league",
        tag: "§ 1.5",
        title: "Competitive Integrity, Hardware & Conduct",
        badge: "ZERO TOLERANCE",
        badge_type: "warn",
        callout: "<strong>CRITICAL WARNING:</strong> Any use of hardware-based aim adapters (Cronus Zen, XIM, Titan), strike-pack recoil macros, third-party wallhacks, or memory injection triggers immediate permanent disqualification and player expulsion from the Frontline League.",
        callout_type: "danger",
        bullets: [
          "PC Verification: PC combatants are required to run official anti-cheat background monitoring and must be able to provide Discord screen share or gameplay recording if requested by referees.",
          "Communication Conduct: Racial slurs, hate speech, severe harassment, or intentional stream-sniping in broadcasted matches results in immediate match forfeit and minimum 2-week player suspension."
        ]
      },
      {
        id: "rule_4_1",
        section: "host",
        tag: "§ 4.1",
        title: "Dedicated Server & Host Selection Protocol",
        badge: "NEUTRAL SERVER",
        badge_type: "lime",
        description: "All series must be hosted on dedicated servers providing equitable ping for both teams.",
        bullets: [
          "Regional Parity: If an NA East squad faces an NA West squad, the custom match must be hosted on a Central data center (e.g. Chicago, Dallas, or Kansas City) to balance ping latency.",
          "Alternating Host Order:<br />• Map 1: Team A Host (Higher seed choice)<br />• Map 2: Team B Host<br />• Map 3: Team A Host<br />• Map 4: Team B Host (if necessary)<br />• Map 5: Neutral Central Server Host (Decider)",
          "Ping Disparity Cap: If a player demonstrates persistent packet loss or latency exceeding 120ms due to host misrouting, captains must remake the lobby on an alternate neutral server."
        ]
      },
      {
        id: "rule_4_2",
        section: "host",
        tag: "§ 4.2",
        title: "Disconnection & Remake Protocol",
        badge: "EVIDENCE MANDATORY",
        badge_type: "warn",
        description: "In the event a combatant disconnects or crashes during an active map, referees enforce the following protocols:",
        bullets: [
          "First 30 Seconds / Pre-Combat: If a player disconnects prior to first blood or before the game clock reaches thirty (30) seconds, the lobby is immediately terminated and remade with identical rosters and classes.",
          "Mid-Game Hardpoint Crash: The remaining players continue until the current hill timer expires. The game is paused/ended, and a remake is launched with previous points recorded and carried forward to reach the 250-point target.",
          "Search & Destroy Crash: The round in progress must be completed (no mid-round pauses). The lobby is remade for remaining rounds, retaining the exact round tally before the disconnect.",
          "Player Re-entry Window: A disconnected player has up to five (5) minutes to rejoin the lobby before the squad must substitute a registered reserve player or proceed 3v4."
        ]
      },
      {
        id: "rule_4_3",
        section: "host",
        tag: "§ 4.3",
        title: "Match Disputes & Proof Submission",
        badge: "DISCORD REFS",
        badge_type: "lime",
        description: "Match dispute tickets must be logged in the official Discord #match-disputes channel within thirty (30) minutes of series conclusion. All claims must include timestamped video recordings (Twitch/YouTube VOD) or clear scoreboard screenshots. Referees will not accept unsubstantiated hearsay."
      }
    ]
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
  client: dbClient,
  getClient() {
    if (window.dbClient) return window.dbClient;
    if (window.supabaseClient) return window.supabaseClient;
    if (window.supabase && window.SUPABASE_CONFIG) {
      window.dbClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key);
      return window.dbClient;
    }
    return null;
  },

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
          .select("*, teams(name, tag, division)")
          .order("kdr", { ascending: false });

        if (!error && data) {
          if (data.length === 0) return [];
          return data.map(p => {
            const isFreeAgent = !p.teams || (p.team_name && (p.team_name.toLowerCase() === 'free agent' || p.team_name.toLowerCase() === 'unassigned')) || p.status === 'Free Agent';
            const division = p.division || p.teams?.division || (isFreeAgent ? 'Free Agent' : (p.kdr >= 1.15 ? 'Division 1 (Pro)' : (p.kdr >= 1.0 ? 'Division 2 (Challengers)' : 'Open Division')));
            const calculatedRank = p.rank || (p.kdr >= 1.2 ? "1.5" : (p.kdr >= 1.0 ? "1.0" : "0.5"));
            return {
              ...p,
              discord_name: p.discord_name || p.gamertag,
              activision_id: p.activision_id || `${p.gamertag}#${Math.floor(1000000 + (p.id * 123456) % 9000000)}`,
              rank: calculatedRank,
              skill_rank: p.skill_rank || calculatedRank,
              status: p.status || (isFreeAgent ? "Free Agent" : "Active"),
              team_name: p.teams?.name || p.team_name || (isFreeAgent ? "Free Agent" : "Squad"),
              division: division,
              is_free_agent: isFreeAgent
            };
          });
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
    if (!signupData || !signupData.gamertag) {
      return { success: false, error: "Gamertag is required for signup" };
    }

    const cleanGamertag = String(signupData.gamertag).trim();
    const cleanActivision = signupData.activision_id ? String(signupData.activision_id).trim() : null;
    const cleanDiscord = signupData.discord_username ? String(signupData.discord_username).trim() : cleanGamertag;
    const cleanRole = signupData.role || "Flex";
    const cleanPlatform = signupData.platform || "PC";
    const cleanRegion = signupData.region || "NA East";
    const cleanRegType = signupData.registration_type || "Free Agent";
    const cleanTeamName = signupData.team_name ? String(signupData.team_name).trim() : null;
    const cleanNotes = signupData.notes ? String(signupData.notes).trim() : null;
    const cleanStatus = signupData.status || "Pending";
    const timestamp = signupData.created_at || new Date().toISOString();

    // Prepare clean payload strictly adhering to Supabase league_signups schema
    const cleanPayload = {
      gamertag: cleanGamertag,
      activision_id: cleanActivision,
      discord_username: cleanDiscord,
      role: cleanRole,
      platform: cleanPlatform,
      region: cleanRegion,
      registration_type: cleanRegType,
      team_name: cleanTeamName,
      notes: cleanNotes,
      status: cleanStatus
    };

    if (signupData.user_id) {
      cleanPayload.user_id = signupData.user_id;
    }
    if (signupData.discord_user_id) {
      cleanPayload.discord_user_id = signupData.discord_user_id;
    }

    let remoteSaved = false;
    let savedData = null;

    if (dbClient) {
      try {
        // Check if an existing pending signup with this gamertag already exists
        const { data: existingRows } = await dbClient
          .from("league_signups")
          .select("id, status")
          .ilike("gamertag", cleanGamertag)
          .limit(1);

        if (existingRows && existingRows.length > 0 && existingRows[0].status === "Pending") {
          // Update existing pending signup
          const { data, error } = await dbClient
            .from("league_signups")
            .update(cleanPayload)
            .eq("id", existingRows[0].id)
            .select();
          if (!error && data && data.length > 0) {
            remoteSaved = true;
            savedData = data[0];
          }
        } else {
          // Insert new signup
          const { data, error } = await dbClient
            .from("league_signups")
            .insert([cleanPayload])
            .select();
          if (!error && data && data.length > 0) {
            remoteSaved = true;
            savedData = data[0];
          } else if (error) {
            console.warn("Supabase signup insert notice:", error.message || error);
          }
        }
      } catch (err) {
        console.warn("Supabase signup exception:", err);
      }
    }

    // Always persist to localStorage for cross-tab sync and local reliability
    const recordId = savedData?.id || signupData.id || ("signup_" + Date.now());
    const finalRecord = {
      id: recordId,
      ...cleanPayload,
      created_at: timestamp
    };

    try {
      const localSignups = JSON.parse(localStorage.getItem("frontline_league_signups")) || [];
      const filtered = localSignups.filter(s =>
        String(s.id) !== String(recordId) &&
        String(s.gamertag || "").toLowerCase() !== cleanGamertag.toLowerCase()
      );
      filtered.unshift(finalRecord);
      localStorage.setItem("frontline_league_signups", JSON.stringify(filtered));
    } catch (e) {}

    // Update in-memory MOCK_DATA
    if (!MOCK_DATA.signups) MOCK_DATA.signups = [];
    const mockIdx = MOCK_DATA.signups.findIndex(s =>
      String(s.id) === String(recordId) ||
      String(s.gamertag || "").toLowerCase() === cleanGamertag.toLowerCase()
    );
    if (mockIdx >= 0) {
      MOCK_DATA.signups[mockIdx] = finalRecord;
    } else {
      MOCK_DATA.signups.unshift(finalRecord);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("frontline_signups_updated", { detail: finalRecord }));
    }

    return { success: true, data: savedData || finalRecord };
  },

  // 9. Fetch All League Signups (for admin review)
  async getSignups() {
    let remoteSignups = [];
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_signups")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          remoteSignups = data.filter(s => s.status !== "Enlisted" && s.status !== "Approved_Enlisted");
        }
      } catch (err) {
        console.warn("Supabase getSignups error:", err);
      }
    }

    // Local storage signups
    let localSignups = [];
    try {
      localSignups = (JSON.parse(localStorage.getItem("frontline_league_signups")) || [])
        .filter(s => s.status !== "Enlisted" && s.status !== "Approved_Enlisted");
    } catch (e) {}

    // Also include any registered combatant accounts that haven't been enlisted yet
    let registeredAccounts = [];
    try {
      const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      registeredAccounts = accounts
        .filter(a => a.status !== "Enlisted" && a.status !== "Approved_Enlisted")
        .map(a => ({
          id: a.id || ("acc_" + a.gamertag),
          gamertag: a.gamertag,
          activision_id: a.activision_id || `${a.gamertag}#1234567`,
          discord_username: a.discord || a.gamertag,
          role: a.role || "Starter",
          platform: "Crossplay",
          region: "NA East",
          registration_type: a.tag ? `[${a.tag}] Squad Recruit` : "Free Agent",
          team_name: a.team_name || null,
          notes: `[Account: ${a.email || 'Registered User'}] Website combatant registration`,
          status: "Pending",
          created_at: a.created_at || new Date().toISOString()
        }));
    } catch (e) {}

    // In-memory mock signups
    const memorySignups = (MOCK_DATA.signups || []).filter(s => s.status !== "Enlisted" && s.status !== "Approved_Enlisted");

    // Merge all sources without duplicates (prefer remote, then local, then registered accounts, then memory)
    const combined = [];
    const seenGamertags = new Set();

    function addSignups(list) {
      for (const s of list) {
        if (!s || !s.gamertag) continue;
        const key = String(s.gamertag).trim().toLowerCase();
        if (!seenGamertags.has(key)) {
          seenGamertags.add(key);
          combined.push(s);
        }
      }
    }

    addSignups(remoteSignups);
    addSignups(localSignups);
    addSignups(registeredAccounts);
    addSignups(memorySignups);

    return combined;
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
  async deleteSignup(signupId, gamertagParam = null) {
    let targetGamertag = gamertagParam;

    // If targetGamertag not provided, look it up from localStorage or MOCK_DATA
    if (!targetGamertag) {
      try {
        const localSignups = JSON.parse(localStorage.getItem("frontline_league_signups")) || [];
        const found = localSignups.find(s => String(s.id) === String(signupId) || String(s.gamertag || "").toLowerCase() === String(signupId).toLowerCase());
        if (found) targetGamertag = found.gamertag;
      } catch (_) {}
    }
    if (!targetGamertag && MOCK_DATA.signups) {
      const found = MOCK_DATA.signups.find(s => String(s.id) === String(signupId) || String(s.gamertag || "").toLowerCase() === String(signupId).toLowerCase());
      if (found) targetGamertag = found.gamertag;
    }

    const cleanGamerLower = targetGamertag ? String(targetGamertag).trim().toLowerCase() : null;
    const cleanIdStr = signupId ? String(signupId).trim() : "";

    if (dbClient) {
      try {
        if (cleanIdStr && !isNaN(cleanIdStr)) {
          const { error, data } = await dbClient
            .from("league_signups")
            .delete()
            .eq("id", parseInt(cleanIdStr, 10))
            .select();

          if (!data || data.length === 0) {
            await dbClient
              .from("league_signups")
              .update({ status: "Enlisted" })
              .eq("id", parseInt(cleanIdStr, 10));
          }
        } else if (cleanGamerLower) {
          const { error, data } = await dbClient
            .from("league_signups")
            .delete()
            .ilike("gamertag", cleanGamerLower)
            .select();

          if (!data || data.length === 0) {
            await dbClient
              .from("league_signups")
              .update({ status: "Enlisted" })
              .ilike("gamertag", cleanGamerLower);
          }
        }
      } catch (err) {
        console.warn("Supabase deleteSignup notice:", err);
      }
    }

    // Also remove / mark from localStorage
    try {
      const localSignups = JSON.parse(localStorage.getItem("frontline_league_signups")) || [];
      const updated = localSignups.filter(s => {
        if (cleanIdStr && String(s.id) === cleanIdStr) return false;
        if (cleanGamerLower && String(s.gamertag || "").toLowerCase() === cleanGamerLower) return false;
        return true;
      });
      localStorage.setItem("frontline_league_signups", JSON.stringify(updated));

      const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const updatedAccs = accounts.map(a => {
        const matchId = cleanIdStr && String(a.id) === cleanIdStr;
        const matchGamer = cleanGamerLower && String(a.gamertag || "").toLowerCase() === cleanGamerLower;
        if (matchId || matchGamer) {
          return { ...a, status: "Enlisted" };
        }
        return a;
      });
      localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(updatedAccs));
    } catch (e) {}

    if (MOCK_DATA.signups) {
      const idx = MOCK_DATA.signups.findIndex(x => {
        if (cleanIdStr && String(x.id) === cleanIdStr) return true;
        if (cleanGamerLower && String(x.gamertag || "").toLowerCase() === cleanGamerLower) return true;
        return false;
      });
      if (idx !== -1) MOCK_DATA.signups.splice(idx, 1);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("frontline_signups_updated", { detail: { id: signupId, gamertag: targetGamertag, action: "delete" } }));
    }

    return { success: true };
  },

  // Admin: Approve & Enlist a Signup (stores player in players table and deletes from league_signups table)
  async approveAndEnlistSignup(signupId, customPlayerData = {}) {
    try {
      let signup = null;
      if (dbClient) {
        try {
          const { data } = await dbClient
            .from("league_signups")
            .select("*")
            .eq("id", signupId)
            .maybeSingle();
          if (data) signup = data;
        } catch (_) {}
      }

      if (!signup) {
        try {
          const localSignups = JSON.parse(localStorage.getItem("frontline_league_signups")) || [];
          signup = localSignups.find(s =>
            String(s.id) === String(signupId) ||
            String(s.gamertag || "").toLowerCase() === String(signupId || "").toLowerCase()
          );
        } catch (_) {}
      }

      if (!signup) {
        try {
          const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
          const matchedAcc = accounts.find(a =>
            String(a.id) === String(signupId) ||
            String(a.gamertag || "").toLowerCase() === String(signupId || "").toLowerCase()
          );
          if (matchedAcc) {
            signup = {
              gamertag: matchedAcc.gamertag,
              activision_id: matchedAcc.activision_id,
              role: matchedAcc.role || "Flex",
              team_name: matchedAcc.team_name || null
            };
          }
        } catch (_) {}
      }

      if (!signup && MOCK_DATA.signups) {
        signup = MOCK_DATA.signups.find(s =>
          String(s.id) === String(signupId) ||
          String(s.gamertag || "").toLowerCase() === String(signupId || "").toLowerCase()
        );
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

      // 4. Remove player from league_signups table & local storage
      const deleteResult = await this.deleteSignup(signupId, gamertag);

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

    // Dynamic Rules Articles (Add & Remove system)
    const rulesList = Array.isArray(data.rules_list) ? data.rules_list : (MOCK_DATA.rulebook ? MOCK_DATA.rulebook.rules_list : []);
    if (rulesList && Array.isArray(rulesList)) {
      const renderSection = (containerId, sectionKey) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const matching = rulesList.filter(r => (r.section || "league") === sectionKey);
        if (matching.length === 0) {
          container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--muted); font-size:13px; border:1px dashed #333a20; margin:16px 0;">No active rules listed under this section. Use Admin Console to add rules.</div>`;
          return;
        }
        container.innerHTML = matching.map(rule => {
          const badgeHtml = rule.badge ? `<span class="val-badge ${rule.badge_type === 'warn' ? 'warn' : ''}">${rule.badge}</span>` : '';
          const calloutHtml = rule.callout ? `<div class="rule-callout ${rule.callout_type === 'danger' ? 'danger' : ''}">${rule.callout}</div>` : '';
          const descHtml = rule.description ? `<p class="rule-card-desc">${rule.description}</p>` : '';
          const bulletsHtml = (Array.isArray(rule.bullets) && rule.bullets.length > 0)
            ? `<ul class="rule-card-list">${rule.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
            : '';

          return `
            <article class="rule-card" data-rule-id="${rule.id || ''}">
              <div class="rule-card-header">
                <div class="rule-card-title">
                  <span class="rule-tag-id">${rule.tag || '§'}</span>
                  <span>${rule.title || 'Rule'}</span>
                </div>
                ${badgeHtml}
              </div>
              ${calloutHtml}
              ${descHtml}
              ${bulletsHtml}
            </article>
          `;
        }).join("");
      };

      renderSection("rules-container-league", "league");
      renderSection("rules-container-host", "host");
    }
  },

  async addRule(ruleData) {
    const rb = await this.getRulebook();
    const rules = Array.isArray(rb.rules_list) ? [...rb.rules_list] : (Array.isArray(MOCK_DATA.rulebook.rules_list) ? [...MOCK_DATA.rulebook.rules_list] : []);
    const newRule = {
      id: "rule_" + Date.now(),
      section: ruleData.section || "league",
      tag: ruleData.tag || "§",
      title: ruleData.title || "New Regulation",
      badge: ruleData.badge || "",
      badge_type: ruleData.badge_type || "lime",
      description: ruleData.description || "",
      bullets: Array.isArray(ruleData.bullets) ? ruleData.bullets : [],
      callout: ruleData.callout || "",
      callout_type: ruleData.callout_type || "info"
    };
    rules.push(newRule);
    const updated = { ...rb, rules_list: rules };
    return await this.updateRulebook(updated);
  },

  async updateRule(ruleId, updatedData) {
    const rb = await this.getRulebook();
    const rules = Array.isArray(rb.rules_list) ? [...rb.rules_list] : (Array.isArray(MOCK_DATA.rulebook.rules_list) ? [...MOCK_DATA.rulebook.rules_list] : []);
    const idx = rules.findIndex(r => String(r.id) === String(ruleId));
    if (idx !== -1) {
      rules[idx] = { ...rules[idx], ...updatedData };
      const updated = { ...rb, rules_list: rules };
      return await this.updateRulebook(updated);
    }
    return { success: false, error: "Rule not found" };
  },

  async removeRule(ruleId) {
    const rb = await this.getRulebook();
    const rules = Array.isArray(rb.rules_list) ? [...rb.rules_list] : (Array.isArray(MOCK_DATA.rulebook.rules_list) ? [...MOCK_DATA.rulebook.rules_list] : []);
    const filtered = rules.filter(r => String(r.id) !== String(ruleId));
    const updated = { ...rb, rules_list: filtered };
    return await this.updateRulebook(updated);
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

    // Maintain Live status if draft is active
    if (state.status === "Live" || pickData.isLive) {
      state.status = "Live";
    }

    // Calculate next onTheClock team if draftOrder exists
    const order = (state.draftOrder && state.draftOrder.length > 0) ? state.draftOrder : (pickData.draftOrder || []);
    if (order.length > 0) {
      state.draftOrder = order;
      const nextOverallPick = state.picks.length + 1;
      const numTeams = order.length;
      const roundIndex = Math.floor((nextOverallPick - 1) / numTeams);
      const pickInRound = (nextOverallPick - 1) % numTeams;
      
      // Snake draft logic: odd rounds forward, even rounds backward
      const teamIdx = roundIndex % 2 === 0 ? pickInRound : (numTeams - 1 - pickInRound);
      const nextTeam = order[teamIdx];

      state.currentRound = roundIndex + 1;
      state.currentPick = nextOverallPick;
      state.onTheClock = nextTeam ? nextTeam.name : (order[0]?.name || null);
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
    if (!dbClient) {
      try {
        const local = localStorage.getItem("frontline_league_auth_user");
        if (local) return { user: JSON.parse(local) };
      } catch (e) {}
      return null;
    }
    try {
      const { data } = await dbClient.auth.getSession();
      if (data?.session) return data.session;
      const local = localStorage.getItem("frontline_league_auth_user");
      if (local) return { user: JSON.parse(local) };
      return null;
    } catch (e) {
      try {
        const local = localStorage.getItem("frontline_league_auth_user");
        if (local) return { user: JSON.parse(local) };
      } catch (err) {}
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
  async signUpPlayer(email, password, gamertag = "", activisionId = "") {
    const cleanEmail = (email || "").trim();
    const cleanGamertag = (gamertag || "").trim() || (cleanEmail.includes("@") ? cleanEmail.split("@")[0] : cleanEmail);
    const cleanActivision = (activisionId || "").trim() || `${cleanGamertag}#1234567`;

    if (!cleanEmail) {
      return { success: false, error: "Email address is required." };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (!gamertag || !gamertag.trim()) {
      return { success: false, error: "Please choose a username for the website." };
    }
    if (!activisionId || !activisionId.trim()) {
      return { success: false, error: "Activision ID is required (e.g. Username#1234567)." };
    }

    if (!dbClient) {
      const localUser = {
        id: "usr_" + Date.now(),
        email: cleanEmail,
        user_metadata: {
          gamertag: cleanGamertag,
          username: cleanGamertag,
          activision_id: cleanActivision,
          role: "player"
        }
      };
      try {
        localStorage.setItem("frontline_league_auth_user", JSON.stringify(localUser));
        const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
        const filtered = customAccounts.filter(a =>
          (a.email && a.email.toLowerCase() !== cleanEmail.toLowerCase()) &&
          (a.gamertag && a.gamertag.toLowerCase() !== cleanGamertag.toLowerCase())
        );
        filtered.push({
          id: localUser.id,
          gamertag: cleanGamertag,
          username: cleanGamertag,
          email: cleanEmail,
          activision_id: cleanActivision,
          password: password,
          tag: "LEAGUE",
          team_name: "Free Agent",
          elo: 1200,
          tier: "Specialist",
          avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
          created_at: new Date().toISOString()
        });
        localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(filtered));
      } catch (e) {}

      // Automatically place into recruitment queue
      try {
        await this.submitSignup({
          gamertag: cleanGamertag,
          activision_id: cleanActivision,
          discord_username: cleanGamertag,
          role: "Flex",
          platform: "PC",
          region: "NA East",
          registration_type: "Free Agent",
          team_name: null,
          notes: `[Account: ${cleanEmail}] Website recruit registration`,
          status: "Pending"
        });
      } catch (signupErr) {
        console.warn("Auto-queue on signup notice:", signupErr);
      }

      return {
        success: true,
        user: localUser,
        session: { user: localUser },
        requiresEmailConfirmation: false
      };
    }
    try {
      const { data, error } = await dbClient.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            gamertag: cleanGamertag,
            username: cleanGamertag,
            activision_id: cleanActivision,
            role: "player"
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        try {
          localStorage.setItem("frontline_league_auth_user", JSON.stringify(data.user));
          const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
          const filtered = customAccounts.filter(a =>
            (a.email && a.email.toLowerCase() !== cleanEmail.toLowerCase()) &&
            (a.gamertag && a.gamertag.toLowerCase() !== cleanGamertag.toLowerCase())
          );
          filtered.push({
            id: data.user.id,
            gamertag: cleanGamertag,
            username: cleanGamertag,
            email: cleanEmail,
            activision_id: cleanActivision,
            tag: "LEAGUE",
            team_name: "Free Agent",
            elo: 1200,
            tier: "Specialist",
            avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            created_at: new Date().toISOString()
          });
          localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(filtered));
        } catch (e) {}

        // Automatically place into recruitment queue
        try {
          await this.submitSignup({
            gamertag: cleanGamertag,
            activision_id: cleanActivision,
            discord_username: cleanGamertag,
            role: "Flex",
            platform: "PC",
            region: "NA East",
            registration_type: "Free Agent",
            team_name: null,
            notes: `[Account: ${cleanEmail}] Website recruit registration`,
            status: "Pending"
          });
        } catch (signupErr) {
          console.warn("Auto-queue on signup notice:", signupErr);
        }
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
    const cleanEmail = (email || "").trim();
    if (!cleanEmail) {
      return { success: false, error: "Email is required." };
    }
    if (!password) {
      return { success: false, error: "Password is required." };
    }
    if (!dbClient) {
      try {
        const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
        const match = customAccounts.find(a =>
          (a.email && a.email.toLowerCase() === cleanEmail.toLowerCase()) ||
          (a.gamertag && a.gamertag.toLowerCase() === cleanEmail.toLowerCase())
        );
        if (match) {
          if (match.password && password && match.password !== password) {
            return { success: false, error: "Invalid password for this account." };
          }
          const userObj = {
            id: match.id,
            email: match.email || cleanEmail,
            user_metadata: {
              gamertag: match.gamertag,
              username: match.gamertag,
              activision_id: match.activision_id,
              role: "player"
            }
          };
          localStorage.setItem("frontline_league_auth_user", JSON.stringify(userObj));
          return { success: true, user: userObj, session: { user: userObj } };
        }
      } catch (e) {}
      const fallbackUser = {
        id: "usr_" + Date.now(),
        email: cleanEmail,
        user_metadata: {
          gamertag: cleanEmail.split("@")[0],
          username: cleanEmail.split("@")[0],
          activision_id: `${cleanEmail.split("@")[0]}#1234567`,
          role: "player"
        }
      };
      localStorage.setItem("frontline_league_auth_user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser, session: { user: fallbackUser } };
    }
    try {
      const { data, error } = await dbClient.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        try {
          localStorage.setItem("frontline_league_auth_user", JSON.stringify(data.user));
        } catch (e) {}
      }
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Sign-in error occurred." };
    }
  },

  async signInWithDiscord(redirectUrl) {
    if (!dbClient) {
      return { success: false, error: "Database client is not connected." };
    }
    try {
      const targetRedirect = redirectUrl || (window.location.origin + window.location.pathname);
      const { data, error } = await dbClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: targetRedirect,
          scopes: "identify email"
        }
      });
      if (error) {
        if (error.message && (error.message.toLowerCase().includes("not enabled") || error.code === "validation_failed")) {
          return {
            success: false,
            error: "Discord OAuth is not yet enabled in your Supabase project. In your Supabase Dashboard, go to Authentication -> Providers -> Discord to enable it.",
            unsupported: true
          };
        }
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || "Failed to initiate Discord authentication." };
    }
  },

  async signOutPlayer() {
    try {
      localStorage.removeItem("frontline_league_auth_user");
    } catch (e) {}
    if (!dbClient) return { success: true };
    try {
      await dbClient.auth.signOut();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getAuthUser() {
    if (!dbClient) {
      try {
        const local = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
        return { success: !!local, user: local || null };
      } catch (e) {
        return { success: false, user: null };
      }
    }
    try {
      const { data, error } = await dbClient.auth.getUser();
      if (error || !data?.user) {
        // Fallback to session check
        const { data: sessData } = await dbClient.auth.getSession();
        if (sessData?.session?.user) {
          return { success: true, user: sessData.session.user };
        }
        return { success: false, user: null };
      }
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message, user: null };
    }
  },

  // ==========================================
  // STAFF ROLES & PERMISSIONS (RBAC)
  // ==========================================
  STAFF_ROLES: {
    commissioner: {
      key: "commissioner",
      title: "League Commissioner",
      badgeClass: "role-badge-commissioner",
      description: "Full command console access to all operations, league settings, and staff management.",
      tabs: ["tab-teams", "tab-players", "tab-player-stats", "tab-matches", "tab-schedule", "tab-signups", "tab-broadcast", "tab-announcements", "tab-season", "tab-rulebook", "tab-staff", "tab-ladder-disputes"]
    },
    referee: {
      key: "referee",
      title: "Match Referee",
      badgeClass: "role-badge-referee",
      description: "Authorized to record match series scores, enter map statistics, manage schedules, and adjudicate ladder disputes.",
      tabs: ["tab-matches", "tab-player-stats", "tab-schedule", "tab-ladder-disputes"]
    },
    roster_manager: {
      key: "roster_manager",
      title: "Roster Admin",
      badgeClass: "role-badge-roster",
      description: "Authorized to manage teams/franchises, enlist players, and update squad rosters.",
      tabs: ["tab-teams", "tab-players"]
    },
    recruiter: {
      key: "recruiter",
      title: "Recruitment Officer",
      badgeClass: "role-badge-recruiter",
      description: "Authorized to review pending signups from website & Discord bot, evaluate free agents, and approve enlistments.",
      tabs: ["tab-signups", "tab-players"]
    },
    broadcaster: {
      key: "broadcaster",
      title: "Broadcast Media Lead",
      badgeClass: "role-badge-broadcaster",
      description: "Authorized to toggle livestream online/offline, update Twitch channels, stream titles, and post announcements.",
      tabs: ["tab-broadcast", "tab-announcements"]
    },
    rulebook_admin: {
      key: "rulebook_admin",
      title: "Rules Officer",
      badgeClass: "role-badge-rulebook",
      description: "Authorized to edit CDL competitive regulations, custom lobby settings, and restricted item directives.",
      tabs: ["tab-rulebook"]
    }
  },

  getRoleTabs(roleKey, customPermissions) {
    if (Array.isArray(customPermissions) && customPermissions.length > 0) {
      return customPermissions;
    }
    const roleDef = this.STAFF_ROLES[roleKey];
    if (roleDef) return roleDef.tabs;
    return this.STAFF_ROLES.commissioner.tabs;
  },

  async getStaffProfile(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Supabase staff_roles table
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("staff_roles")
          .select("*")
          .ilike("email", cleanEmail)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            email: data.email,
            display_name: data.display_name || cleanEmail.split("@")[0],
            role: data.role || "commissioner",
            custom_permissions: data.custom_permissions || null,
            notes: data.notes || ""
          };
        }
      } catch (err) {
        console.warn("Error querying staff_roles table from Supabase:", err);
      }
    }

    // 2. Try localStorage cache
    try {
      const cached = localStorage.getItem("frontline_staff_roles_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const match = parsed.find(s => s.email && s.email.toLowerCase() === cleanEmail);
        if (match) return match;
      }
    } catch (e) {}

    // 3. Fallback to mock list
    const mock = (MOCK_DATA.staffRoles || []).find(s => s.email.toLowerCase() === cleanEmail);
    if (mock) return mock;

    // 4. Default: If user is the primary admin or no role exists yet, give commissioner role
    return {
      id: 0,
      email: cleanEmail,
      display_name: cleanEmail.split("@")[0],
      role: "commissioner",
      notes: "Default Administrator"
    };
  },

  async getAllStaffMembers() {
    let list = [];
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("staff_roles")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          list = data;
          try {
            localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(list));
          } catch (e) {}
          return list;
        }
      } catch (err) {
        console.warn("Supabase getAllStaffMembers error:", err);
      }
    }

    // Local storage fallback
    try {
      const cached = localStorage.getItem("frontline_staff_roles_cache");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    return MOCK_DATA.staffRoles || [];
  },

  async saveStaffRole(staffData) {
    const cleanEmail = (staffData.email || "").toLowerCase().trim();
    if (!cleanEmail) {
      return { success: false, error: "Valid staff email is required." };
    }

    const payload = {
      email: cleanEmail,
      display_name: staffData.display_name?.trim() || cleanEmail.split("@")[0],
      role: staffData.role || "referee",
      custom_permissions: staffData.custom_permissions || null,
      notes: staffData.notes?.trim() || null,
      updated_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("staff_roles")
          .upsert(payload, { onConflict: "email" })
          .select();

        if (error) {
          console.error("Supabase upsert staff_roles error:", error);
          return { success: false, error: error.message };
        }

        await this.getAllStaffMembers();
        return { success: true, data: data?.[0] || payload };
      } catch (err) {
        console.error("saveStaffRole network error:", err);
        return { success: false, error: err.message || err };
      }
    }

    // Local fallback
    try {
      let list = await this.getAllStaffMembers();
      const existingIdx = list.findIndex(s => s.email.toLowerCase() === cleanEmail);
      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...payload };
      } else {
        list.push({ id: Date.now(), ...payload });
      }
      localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(list));
      return { success: true, data: payload, mock: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async deleteStaffRole(staffIdOrEmail) {
    if (dbClient) {
      try {
        let query = dbClient.from("staff_roles").delete();
        if (typeof staffIdOrEmail === "number" || /^\d+$/.test(String(staffIdOrEmail))) {
          query = query.eq("id", staffIdOrEmail);
        } else {
          query = query.ilike("email", String(staffIdOrEmail).toLowerCase().trim());
        }
        const { error } = await query;
        if (error) return { success: false, error: error.message };
        await this.getAllStaffMembers();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Local fallback
    try {
      let list = await this.getAllStaffMembers();
      list = list.filter(s => s.id != staffIdOrEmail && s.email.toLowerCase() !== String(staffIdOrEmail).toLowerCase());
      localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(list));
      return { success: true, mock: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  paypalConfig: PAYPAL_CONFIG,
  isConfigured: isSupabaseConfigured
};

// ==============================================================================
// FRONTLINE ARENA LADDER DATABASE API (SEPARATE FROM LEAGUE STANDINGS)
// ==============================================================================
const MOCK_LADDER_DATA = {
  teams: [
    // 4v4 Variant
    {
      id: 101,
      name: "Apex Predators",
      tag: "APEX",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "ViperX",
      elo: 2045,
      tier: "Apex Prestige",
      wins: 18,
      losses: 2,
      streak: 6,
      players: [
        {
          gamertag: "ViperX",
          role: "Captain / Main AR",
          elo: 2045,
          wins: 18,
          losses: 2,
          activision_id: "ViperX#8392014",
          discord: "viperx_cdl",
          avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Predator",
          role: "SMG Entry",
          elo: 1980,
          wins: 17,
          losses: 3,
          activision_id: "Predator#4412903",
          discord: "predator_cod",
          avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Kobra",
          role: "SMG Slayer",
          elo: 1940,
          wins: 16,
          losses: 3,
          activision_id: "Kobra#7721094",
          discord: "kobra_fps",
          avatar_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Venom",
          role: "Flex / Support",
          elo: 1910,
          wins: 15,
          losses: 4,
          activision_id: "Venom#1938472",
          discord: "venom_cdl",
          avatar_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 102,
      name: "Crimson Syndicate",
      tag: "CRIM",
      avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "Havoc",
      elo: 1880,
      tier: "Commander",
      wins: 14,
      losses: 4,
      streak: 3,
      players: [
        {
          gamertag: "Havoc",
          role: "Captain / Main AR",
          elo: 1880,
          wins: 14,
          losses: 4,
          activision_id: "Havoc#6291038",
          discord: "havoc_snd",
          avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Scarlet",
          role: "SMG Slayer",
          elo: 1820,
          wins: 13,
          losses: 5,
          activision_id: "Scarlet#5521904",
          discord: "scarlet_crim",
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Bloodline",
          role: "Flex",
          elo: 1790,
          wins: 12,
          losses: 5,
          activision_id: "Bloodline#8831920",
          discord: "bloodline_cod",
          avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Reign",
          role: "Entry Sub",
          elo: 1750,
          wins: 11,
          losses: 6,
          activision_id: "Reign#2049182",
          discord: "reign_fps",
          avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 103,
      name: "Ghost Protocol",
      tag: "GPRT",
      avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "Specter",
      elo: 1690,
      tier: "Warlord",
      wins: 11,
      losses: 5,
      streak: 2,
      players: [
        {
          gamertag: "Specter",
          role: "Captain / Flex",
          elo: 1690,
          wins: 11,
          losses: 5,
          activision_id: "Specter#7492810",
          discord: "specter_cdl",
          avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Mirage",
          role: "Main AR",
          elo: 1640,
          wins: 10,
          losses: 6,
          activision_id: "Mirage#3321945",
          discord: "mirage_gprt",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Shadow",
          role: "SMG Slayer",
          elo: 1610,
          wins: 9,
          losses: 6,
          activision_id: "Shadow#4491028",
          discord: "shadow_gprt",
          avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Wraith",
          role: "Obj Sub",
          elo: 1580,
          wins: 8,
          losses: 7,
          activision_id: "Wraith#1192837",
          discord: "wraith_cdl",
          avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 104,
      name: "Vanguard Prime",
      tag: "VNG",
      avatar_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "Phantom",
      elo: 1520,
      tier: "Vanguard",
      wins: 9,
      losses: 6,
      streak: 1,
      players: [
        {
          gamertag: "Phantom",
          role: "Captain / Main AR",
          elo: 1520,
          wins: 9,
          losses: 6,
          activision_id: "Phantom#9821043",
          discord: "phantom_vng",
          avatar_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Sentinel",
          role: "SMG Entry",
          elo: 1480,
          wins: 8,
          losses: 6,
          activision_id: "Sentinel#6629104",
          discord: "sentinel_cod",
          avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Titan",
          role: "Flex",
          elo: 1450,
          wins: 8,
          losses: 7,
          activision_id: "Titan#5591827",
          discord: "titan_vng",
          avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Aegis",
          role: "Support Sub",
          elo: 1410,
          wins: 7,
          losses: 7,
          activision_id: "Aegis#3301928",
          discord: "aegis_fps",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 105,
      name: "Sub Base Kings",
      tag: "SBK",
      avatar_url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "Blitz",
      elo: 1340,
      tier: "Specialist",
      wins: 7,
      losses: 7,
      streak: 0,
      players: [
        {
          gamertag: "Blitz",
          role: "Captain / Flex",
          elo: 1340,
          wins: 7,
          losses: 7,
          activision_id: "Blitz#1928374",
          discord: "blitz_sbk",
          avatar_url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Anchor",
          role: "Main AR",
          elo: 1310,
          wins: 6,
          losses: 7,
          activision_id: "Anchor#4401928",
          discord: "anchor_fps",
          avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "SubZero",
          role: "SMG Slayer",
          elo: 1280,
          wins: 6,
          losses: 8,
          activision_id: "SubZero#7729104",
          discord: "subzero_cod",
          avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Riptide",
          role: "Entry Sub",
          elo: 1250,
          wins: 5,
          losses: 8,
          activision_id: "Riptide#8820194",
          discord: "riptide_cdl",
          avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 106,
      name: "Rookie Regime",
      tag: "RREG",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      ladder_type: "4v4_variant",
      captain_name: "NewbieSniper",
      elo: 1120,
      tier: "Operator",
      wins: 3,
      losses: 6,
      streak: -1,
      players: [
        {
          gamertag: "NewbieSniper",
          role: "Captain / Sniper",
          elo: 1120,
          wins: 3,
          losses: 6,
          activision_id: "NewbieSniper#5501928",
          discord: "newbie_cod",
          avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "FreshShot",
          role: "Flex",
          elo: 1100,
          wins: 3,
          losses: 6,
          activision_id: "FreshShot#9920194",
          discord: "freshshot_fps",
          avatar_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "GreenHorn",
          role: "SMG",
          elo: 1070,
          wins: 2,
          losses: 6,
          activision_id: "GreenHorn#1129384",
          discord: "greenhorn_cdl",
          avatar_url: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "Cadet",
          role: "AR Support",
          elo: 1040,
          wins: 2,
          losses: 7,
          activision_id: "Cadet#4482019",
          discord: "cadet_cod",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },

    // 2v2 SnD
    {
      id: 201,
      name: "Duo Demons",
      tag: "DEMN",
      avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      ladder_type: "2v2_snd",
      captain_name: "Reaper",
      elo: 1950,
      tier: "Commander",
      wins: 15,
      losses: 3,
      streak: 5,
      players: [
        {
          gamertag: "Reaper",
          role: "Captain / Slayer",
          elo: 1950,
          wins: 15,
          losses: 3,
          activision_id: "Reaper#7719284",
          discord: "reaper_snd",
          avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "SoulEater",
          role: "Bomb Carrier / Sub",
          elo: 1920,
          wins: 14,
          losses: 3,
          activision_id: "SoulEater#8839201",
          discord: "souleater_demn",
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 202,
      name: "Silent Scope Duo",
      tag: "SSD",
      avatar_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80",
      ladder_type: "2v2_snd",
      captain_name: "DeadSilence",
      elo: 1740,
      tier: "Warlord",
      wins: 12,
      losses: 4,
      streak: 2,
      players: [
        {
          gamertag: "DeadSilence",
          role: "Captain / Sniper",
          elo: 1740,
          wins: 12,
          losses: 4,
          activision_id: "DeadSilence#3391029",
          discord: "deadsilence_cod",
          avatar_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "GhostFoot",
          role: "Support AR",
          elo: 1710,
          wins: 11,
          losses: 4,
          activision_id: "GhostFoot#4492018",
          discord: "ghostfoot_ssd",
          avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 203,
      name: "Bomb Site Rushers",
      tag: "BSR",
      avatar_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80",
      ladder_type: "2v2_snd",
      captain_name: "NinjaDefuse",
      elo: 1480,
      tier: "Vanguard",
      wins: 8,
      losses: 5,
      streak: 1,
      players: [
        {
          gamertag: "NinjaDefuse",
          role: "Captain / Ninja Clutcher",
          elo: 1480,
          wins: 8,
          losses: 5,
          activision_id: "NinjaDefuse#1192840",
          discord: "ninjadefuse_bsr",
          avatar_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80"
        },
        {
          gamertag: "SmokeGrenade",
          role: "Entry Sub",
          elo: 1430,
          wins: 7,
          losses: 5,
          activision_id: "SmokeGrenade#2294810",
          discord: "smoke_snd",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },

    // 1v1 Radar / Gunfight
    {
      id: 301,
      name: "Lone Wolf Solo",
      tag: "LONE",
      avatar_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
      ladder_type: "1v1_radar",
      captain_name: "Apex",
      elo: 2010,
      tier: "Apex Prestige",
      wins: 22,
      losses: 1,
      streak: 8,
      players: [
        {
          gamertag: "Apex",
          role: "Solo Duelist",
          elo: 2010,
          wins: 22,
          losses: 1,
          activision_id: "Apex#1928374",
          discord: "apex_radar",
          avatar_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: 302,
      name: "QuickScopeGod",
      tag: "QSG",
      avatar_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80",
      ladder_type: "1v1_radar",
      captain_name: "Pulse",
      elo: 1675,
      tier: "Warlord",
      wins: 13,
      losses: 7,
      streak: 3,
      players: [
        {
          gamertag: "Pulse",
          role: "Solo Duelist",
          elo: 1675,
          wins: 13,
          losses: 7,
          activision_id: "Pulse#9928103",
          discord: "pulse_qsg",
          avatar_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80"
        }
      ]
    }
  ],
  challenges: [
    {
      id: 501,
      ladder_type: "4v4_variant",
      team_a: { id: 102, name: "Crimson Syndicate", tag: "CRIM", avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80", elo: 1880, tier: "Commander" },
      best_of: 5,
      status: "open",
      scheduled_time: "Tonight @ 9:00 PM EST",
      notes: "Looking for Top 10 Squad. CDL Rules, Karachi/Sub Base."
    },
    {
      id: 502,
      ladder_type: "2v2_snd",
      team_a: { id: 201, name: "Duo Demons", tag: "DEMN", avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80", elo: 1950, tier: "Commander" },
      best_of: 3,
      status: "open",
      scheduled_time: "ASAP / Next 30 Mins",
      notes: "2v2 SnD Any Map. Central host preferred."
    },
    {
      id: 503,
      ladder_type: "1v1_radar",
      team_a: { id: 302, name: "QuickScopeGod", tag: "QSG", avatar_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80", elo: 1675, tier: "Warlord" },
      best_of: 3,
      status: "open",
      scheduled_time: "Ready Now",
      notes: "1v1 Snipers Only. Radar Always On."
    }
  ],
  disputes: [
    {
      id: 901,
      match_id: 501,
      ladder_type: "4v4_variant",
      submitted_by: "Automated System (Score Conflict)",
      dispute_reason: "Score Mismatch: Apex Predators reported 3-1, while Crimson Syndicate reported 1-3. Proof submitted.",
      proof_url: "https://twitch.tv/videos/sample_match_vod",
      status: "open",
      team_a_name: "Apex Predators",
      team_a_tag: "APEX",
      team_b_name: "Crimson Syndicate",
      team_b_tag: "CRIM",
      team_a_score: 3,
      team_b_score: 1,
      team_b_reported_a: 1,
      team_b_reported_b: 3,
      created_at: new Date(Date.now() - 4200000).toISOString()
    }
  ]
};

window.LadderDB = {
  // User Active Squad per Ladder
  getMyTeam(ladderType = "4v4_variant") {
    try {
      const saved = localStorage.getItem("frontline_my_team_" + ladderType);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  },

  setMyTeam(ladderType, team) {
    if (!ladderType || !team) return;
    try {
      localStorage.setItem("frontline_my_team_" + ladderType, JSON.stringify(team));
      // Cross-tab / cross-component notification
      window.dispatchEvent(new CustomEvent("frontline_my_team_updated", { detail: { ladderType, team } }));
    } catch (e) {}
  },

  clearMyTeam(ladderType) {
    try {
      localStorage.removeItem("frontline_my_team_" + ladderType);
      window.dispatchEvent(new CustomEvent("frontline_my_team_updated", { detail: { ladderType, team: null } }));
    } catch (e) {}
  },

  getTier(elo) {
    const rating = Number(elo) || 1200;
    if (rating >= 2000) return { name: "Apex Prestige", badgeClass: "tier-apex", icon: "⚡" };
    if (rating >= 1800) return { name: "Commander", badgeClass: "tier-commander", icon: "🎖" };
    if (rating >= 1600) return { name: "Warlord", badgeClass: "tier-warlord", icon: "💀" };
    if (rating >= 1400) return { name: "Vanguard", badgeClass: "tier-vanguard", icon: "🛡" };
    if (rating >= 1200) return { name: "Specialist", badgeClass: "tier-specialist", icon: "🎯" };
    if (rating >= 1000) return { name: "Operator", badgeClass: "tier-operator", icon: "⚔" };
    return { name: "Recruit", badgeClass: "tier-recruit", icon: "🔰" };
  },

  getDivisionTier(elo) {
    return this.getTier(elo);
  },

  getTeamById(teamId) {
    if (!teamId) return null;
    const cleanId = String(teamId).trim();
    const cleanIdLower = cleanId.toLowerCase();
    let found = MOCK_LADDER_DATA.teams.find(t => String(t.id) === cleanId || (t.name && t.name.toLowerCase() === cleanIdLower));
    if (found) return found;

    for (const lt of ["4v4_variant", "2v2_snd", "1v1_radar"]) {
      try {
        const cached = JSON.parse(localStorage.getItem("frontline_ladder_teams_" + lt)) || [];
        found = cached.find(t => String(t.id) === cleanId || (t.name && t.name.toLowerCase() === cleanIdLower));
        if (found) return found;
      } catch (e) {}
    }

    for (const lt of ["4v4_variant", "2v2_snd", "1v1_radar"]) {
      try {
        const myT = JSON.parse(localStorage.getItem("frontline_my_team_" + lt));
        if (myT && (String(myT.id) === cleanId || (myT.name && myT.name.toLowerCase() === cleanIdLower))) return myT;
      } catch (e) {}
    }

    return null;
  },

  getTeamRoster(teamOrId) {
    let team = teamOrId;
    if (typeof team === "string" || typeof team === "number") {
      team = this.getTeamById(team);
    }
    if (!team) return [];

    if (team.players && Array.isArray(team.players) && team.players.length > 0) {
      return team.players.map(p => {
        const elo = Number(p.elo) || 1200;
        const wins = Number(p.wins) || 0;
        const losses = Number(p.losses) || 0;
        const total = wins + losses;
        const win_rate = total > 0 ? Math.round((wins / total) * 100) : 0;
        return {
          ...p,
          elo,
          wins,
          losses,
          win_rate,
          tier: this.getDivisionTier(elo)
        };
      });
    }

    return this.generateRosterForTeam(team);
  },

  generateRosterForTeam(team) {
    const ladderType = team.ladder_type || "4v4_variant";
    const teamElo = Number(team.elo) || 1200;
    const teamWins = Number(team.wins) || 0;
    const teamLosses = Number(team.losses) || 0;
    const captainName = team.captain_name || "Captain";
    const tag = team.tag || "TAG";

    const hashStr = (s) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
      return Math.abs(h);
    };

    if (ladderType === "1v1_radar") {
      return [{
        gamertag: captainName,
        role: "Solo Combatant",
        elo: teamElo,
        wins: teamWins,
        losses: teamLosses,
        win_rate: (teamWins + teamLosses) > 0 ? Math.round((teamWins / (teamWins + teamLosses)) * 100) : 0,
        activision_id: team.captain_activision || `${captainName}#${(hashStr(captainName) % 9000000) + 1000000}`,
        discord: team.captain_discord || `${captainName.toLowerCase()}#0001`,
        avatar_url: team.avatar_url || "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
        tier: this.getDivisionTier(teamElo)
      }];
    }

    if (ladderType === "2v2_snd") {
      const p1Elo = teamElo;
      const p2Elo = Math.max(800, teamElo - 25);
      const p2Wins = Math.max(0, teamWins - (teamWins > 1 ? 1 : 0));
      const p2Losses = teamLosses;
      return [
        {
          gamertag: captainName,
          role: "Captain / Shot Caller",
          elo: p1Elo,
          wins: teamWins,
          losses: teamLosses,
          win_rate: (teamWins + teamLosses) > 0 ? Math.round((teamWins / (teamWins + teamLosses)) * 100) : 0,
          activision_id: team.captain_activision || `${captainName}#${(hashStr(captainName) % 9000000) + 1000000}`,
          discord: team.captain_discord || `${captainName.toLowerCase()}#0001`,
          avatar_url: team.avatar_url || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
          tier: this.getDivisionTier(p1Elo)
        },
        {
          gamertag: `${tag}_Duo`,
          role: "Duo Partner / Slayer",
          elo: p2Elo,
          wins: p2Wins,
          losses: p2Losses,
          win_rate: (p2Wins + p2Losses) > 0 ? Math.round((p2Wins / (p2Wins + p2Losses)) * 100) : 0,
          activision_id: `${tag}_Duo#${(hashStr(tag + "2") % 9000000) + 1000000}`,
          discord: `${tag.toLowerCase()}_duo#0002`,
          avatar_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80",
          tier: this.getDivisionTier(p2Elo)
        }
      ];
    }

    // Default 4v4
    const roles = [
      { suffix: "", role: "Captain / Main AR", eloDelta: 0, wDelta: 0, lDelta: 0, avatar: team.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80" },
      { suffix: "Slayer", role: "SMG Slayer", eloDelta: -25, wDelta: -1, lDelta: 0, avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80" },
      { suffix: "Flex", role: "Flex / Support", eloDelta: -50, wDelta: -1, lDelta: 1, avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80" },
      { suffix: "Entry", role: "SMG Entry", eloDelta: -75, wDelta: -2, lDelta: 1, avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80" }
    ];

    return roles.map((r, i) => {
      const gname = i === 0 ? captainName : `${tag}_${r.suffix}`;
      const pElo = Math.max(800, teamElo + r.eloDelta);
      const pWins = Math.max(0, teamWins + r.wDelta);
      const pLosses = Math.max(0, teamLosses + r.lDelta);
      const total = pWins + pLosses;
      return {
        gamertag: gname,
        role: r.role,
        elo: pElo,
        wins: pWins,
        losses: pLosses,
        win_rate: total > 0 ? Math.round((pWins / total) * 100) : 0,
        activision_id: i === 0 && team.captain_activision ? team.captain_activision : `${gname}#${(hashStr(gname + i) % 9000000) + 1000000}`,
        discord: i === 0 && team.captain_discord ? team.captain_discord : `${gname.toLowerCase()}#000${i+1}`,
        avatar_url: r.avatar,
        tier: this.getDivisionTier(pElo)
      };
    });
  },

  async getLadderTeams(ladderType = "4v4_variant") {
    // 1. Try Supabase
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_teams")
          .select("*")
          .eq("ladder_type", ladderType)
          .order("elo", { ascending: false })
          .order("wins", { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase ladder_teams query failed:", err);
      }
    }

    // 2. Check LocalStorage Cache
    try {
      const cached = JSON.parse(localStorage.getItem("frontline_ladder_teams_" + ladderType));
      if (cached && cached.length > 0) return cached;
    } catch (e) {}

    // 3. Fallback Mock Data
    return MOCK_LADDER_DATA.teams.filter(t => t.ladder_type === ladderType);
  },

  async createLadderTeam(teamData) {
    // Set initial defaults
    const newTeam = {
      name: teamData.name,
      tag: (teamData.tag || "TAG").toUpperCase().trim().slice(0, 5),
      avatar_url: teamData.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      ladder_type: teamData.ladder_type || "4v4_variant",
      captain_name: teamData.captain_name || "Captain",
      captain_discord: teamData.captain_discord || "",
      elo: 1200,
      tier: "Specialist",
      wins: 0,
      losses: 0,
      streak: 0,
      created_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_teams")
          .insert([newTeam])
          .select();
        if (!error && data && data.length > 0) {
          const created = data[0];
          this.setMyTeam(newTeam.ladder_type, created);
          return { success: true, team: created };
        }
        console.warn("Supabase insert error, saving locally:", error);
      } catch (err) {
        console.warn("Supabase insert failed:", err);
      }
    }

    // LocalStorage Fallback
    try {
      const type = newTeam.ladder_type;
      let existing = await this.getLadderTeams(type);
      newTeam.id = "mock_" + Date.now();
      existing.push(newTeam);
      existing.sort((a, b) => (b.elo || 0) - (a.elo || 0));
      localStorage.setItem("frontline_ladder_teams_" + type, JSON.stringify(existing));
      this.setMyTeam(type, newTeam);
      return { success: true, team: newTeam, local: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getOpenChallenges(ladderType = "4v4_variant") {
    let challenges = [];
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_matches")
          .select("*, team_a:ladder_teams!team_a_id(*)")
          .eq("status", "open")
          .eq("ladder_type", ladderType)
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          challenges = data.map(c => {
            if (!c.team_a && c.team_a_id) {
              c.team_a = this.getTeamById(c.team_a_id);
            }
            return c;
          });
          return challenges;
        }
      } catch (err) {
        console.warn("Supabase open challenges failed:", err);
      }
    }

    try {
      const cached = JSON.parse(localStorage.getItem("frontline_ladder_challenges_" + ladderType));
      if (cached && cached.length > 0) {
        return cached.map(c => {
          if (!c.team_a && c.team_a_id) {
            c.team_a = this.getTeamById(c.team_a_id);
          }
          return c;
        });
      }
    } catch (e) {}

    return (MOCK_LADDER_DATA.challenges || []).filter(c => c.ladder_type === ladderType);
  },

  async getChallenges(ladderType = "4v4_variant") {
    return this.getOpenChallenges(ladderType);
  },

  async postChallenge(challengeData) {
    const newChallenge = {
      ladder_type: challengeData.ladder_type || "4v4_variant",
      team_a_id: challengeData.team_a_id,
      best_of: parseInt(challengeData.best_of, 10) || 5,
      status: "open",
      scheduled_time: challengeData.scheduled_time || "Ready Now",
      notes: challengeData.notes || "CDL Rules",
      created_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_matches")
          .insert([newChallenge])
          .select();
        if (!error && data && data.length > 0) {
          return { success: true, challenge: data[0] };
        }
      } catch (err) {
        console.warn("Supabase challenge insert failed:", err);
      }
    }

    // Local Fallback
    try {
      const type = newChallenge.ladder_type;
      let existing = await this.getOpenChallenges(type);
      newChallenge.id = "chal_" + Date.now();
      newChallenge.team_a = challengeData.team_a; // embed squad details
      existing.unshift(newChallenge);
      localStorage.setItem("frontline_ladder_challenges_" + type, JSON.stringify(existing));
      return { success: true, challenge: newChallenge, local: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Record or Accept Match in Progress
  async acceptChallenge(challengeId, acceptingTeam) {
    let matchObj = null;

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_matches")
          .update({
            team_b_id: acceptingTeam.id,
            status: "in_progress"
          })
          .eq("id", challengeId)
          .select("*, team_a:ladder_teams!team_a_id(*), team_b:ladder_teams!team_b_id(*)");
        if (!error && data && data.length > 0) {
          matchObj = data[0];
        }
      } catch (err) {
        console.warn("Supabase acceptChallenge failed:", err);
      }
    }

    if (!matchObj) {
      // Find original challenge in localStorage
      let foundChal = null;
      for (const type of ["4v4_variant", "2v2_snd", "1v1_radar"]) {
        try {
          let list = JSON.parse(localStorage.getItem("frontline_ladder_challenges_" + type)) || [];
          const idx = list.findIndex(c => String(c.id) === String(challengeId));
          if (idx >= 0) {
            foundChal = list.splice(idx, 1)[0];
            localStorage.setItem("frontline_ladder_challenges_" + type, JSON.stringify(list));
            break;
          }
        } catch (e) {}
      }

      if (!foundChal) {
        foundChal = (MOCK_LADDER_DATA.challenges || []).find(c => String(c.id) === String(challengeId)) || {};
      }

      matchObj = {
        id: challengeId,
        ladder_type: foundChal.ladder_type || "4v4_variant",
        best_of: foundChal.best_of || 5,
        status: "in_progress",
        team_a: foundChal.team_a || { id: 101, name: "Apex Predators", tag: "APEX", avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80", elo: 2045, tier: "Apex Prestige" },
        team_b: acceptingTeam,
        notes: foundChal.notes || "CDL Rules",
        server_info: "Dallas (Central Host)",
        created_at: new Date().toISOString()
      };
    }

    await this.saveMatch(matchObj);
    return { success: true, match: matchObj };
  },

  async getMatch(matchId) {
    if (!matchId) return null;

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_matches")
          .select("*, team_a:ladder_teams!team_a_id(*), team_b:ladder_teams!team_b_id(*)")
          .eq("id", matchId)
          .maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase getMatch error:", err);
      }
    }

    try {
      const match = JSON.parse(localStorage.getItem("frontline_ladder_match_" + matchId));
      if (match) return match;
    } catch (e) {}

    try {
      const active = JSON.parse(localStorage.getItem("frontline_ladder_active_matches")) || [];
      const found = active.find(m => String(m.id) === String(matchId));
      if (found) return found;
    } catch (e) {}

    for (const type of ["4v4_variant", "2v2_snd", "1v1_radar"]) {
      try {
        const challenges = JSON.parse(localStorage.getItem("frontline_ladder_challenges_" + type)) || [];
        const found = challenges.find(c => String(c.id) === String(matchId));
        if (found) {
          return {
            ...found,
            status: found.status || "in_progress",
            team_b: found.team_b || {
              id: 102,
              name: "Crimson Syndicate",
              tag: "CRIM",
              avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
              captain_name: "Havoc",
              elo: 1880,
              tier: "Commander"
            }
          };
        }
      } catch (e) {}
    }

    const mockChal = (MOCK_LADDER_DATA.challenges || []).find(c => String(c.id) === String(matchId));
    if (mockChal) {
      return {
        ...mockChal,
        team_b: {
          id: 101,
          name: "Apex Predators",
          tag: "APEX",
          avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
          captain_name: "ViperX",
          elo: 2045,
          tier: "Apex Prestige"
        }
      };
    }

    // Default match if generic or unknown ID requested (e.g. #FR-1049)
    return {
      id: matchId || 1049,
      ladder_type: "4v4_variant",
      best_of: 5,
      status: "in_progress",
      server_info: "Dallas (Central Host)",
      team_a: {
        id: 101,
        name: "Apex Predators",
        tag: "APEX",
        avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
        captain_name: "ViperX",
        elo: 2045,
        tier: "Apex Prestige"
      },
      team_b: {
        id: 102,
        name: "Crimson Syndicate",
        tag: "CRIM",
        avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
        captain_name: "Havoc",
        elo: 1880,
        tier: "Commander"
      },
      created_at: new Date().toISOString()
    };
  },

  async saveMatch(match) {
    if (!match || !match.id) return;
    try {
      localStorage.setItem("frontline_ladder_match_" + match.id, JSON.stringify(match));
      let active = JSON.parse(localStorage.getItem("frontline_ladder_active_matches")) || [];
      const idx = active.findIndex(m => String(m.id) === String(match.id));
      if (idx >= 0) active[idx] = match;
      else active.unshift(match);
      localStorage.setItem("frontline_ladder_active_matches", JSON.stringify(active));
    } catch (e) {}

    if (dbClient) {
      try {
        await dbClient.from("ladder_matches").upsert({
          id: match.id,
          ladder_type: match.ladder_type,
          team_a_id: match.team_a?.id,
          team_b_id: match.team_b?.id,
          status: match.status,
          best_of: match.best_of,
          team_a_score: match.team_a_score,
          team_b_score: match.team_b_score,
          veto_data: match.veto_data
        });
      } catch (err) {
        console.warn("Supabase upsert match failed:", err);
      }
    }
  },

  async getActiveMatches(ladderType = null) {
    let matches = [];
    if (dbClient) {
      try {
        let q = dbClient
          .from("ladder_matches")
          .select("*, team_a:ladder_teams!team_a_id(*), team_b:ladder_teams!team_b_id(*)")
          .in("status", ["in_progress", "disputed"])
          .order("created_at", { ascending: false });
        if (ladderType) q = q.eq("ladder_type", ladderType);
        const { data, error } = await q;
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }

    try {
      const active = JSON.parse(localStorage.getItem("frontline_ladder_active_matches")) || [];
      if (ladderType) matches = active.filter(m => m.ladder_type === ladderType);
      else matches = active;
    } catch (e) {}

    if (matches.length === 0) {
      matches = [
        {
          id: 1049,
          ladder_type: ladderType || "4v4_variant",
          best_of: 5,
          status: "in_progress",
          team_a: {
            id: 101,
            name: "Apex Predators",
            tag: "APEX",
            avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            captain_name: "ViperX",
            elo: 2045,
            tier: "Apex Prestige"
          },
          team_b: {
            id: 102,
            name: "Crimson Syndicate",
            tag: "CRIM",
            avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
            captain_name: "Havoc",
            elo: 1880,
            tier: "Commander"
          },
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ];
    }
    return matches;
  },

  getMatchChat(matchId) {
    try {
      const saved = localStorage.getItem("frontline_match_chat_" + matchId);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { sender: "System", tag: "SYS", text: "Match room initialized. Good luck, have fun!", isSystem: true, timestamp: "Just now" },
      { sender: "ViperX", tag: "APEX", text: "Host is ready on Dallas server. GL!", isSystem: false, timestamp: "2 mins ago" },
      { sender: "Havoc", tag: "CRIM", text: "Got it, let's finish the map veto first.", isSystem: false, timestamp: "1 min ago" }
    ];
  },

  sendMatchChat(matchId, message) {
    const list = this.getMatchChat(matchId);
    list.push(message);
    try {
      localStorage.setItem("frontline_match_chat_" + matchId, JSON.stringify(list));
    } catch (e) {}
    return list;
  },

  // Score Reporting with AUTOMATIC DISPUTE on Mismatch
  async reportMatchScore({ matchId, reportingTeamId, reportingTeamName, teamAScore, teamBScore, proofUrl }) {
    const key = "frontline_match_report_" + matchId;
    let currentMatchData;
    try {
      currentMatchData = JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      currentMatchData = {};
    }

    const thisReport = {
      reportingTeamId: String(reportingTeamId),
      reportingTeamName,
      teamAScore: parseInt(teamAScore, 10),
      teamBScore: parseInt(teamBScore, 10),
      proofUrl: proofUrl || "",
      reportedAt: new Date().toISOString()
    };

    // If no one reported yet, store this as first report
    if (!currentMatchData.firstReport) {
      currentMatchData.firstReport = thisReport;
      localStorage.setItem(key, JSON.stringify(currentMatchData));
      return {
        success: true,
        status: "awaiting_opponent",
        message: `${reportingTeamName} reported ${thisReport.teamAScore}-${thisReport.teamBScore}. Awaiting opponent score verification.`
      };
    }

    // Opponent already reported - compare scores!
    const prev = currentMatchData.firstReport;
    currentMatchData.secondReport = thisReport;

    const isMatch = (prev.teamAScore === thisReport.teamAScore && prev.teamBScore === thisReport.teamBScore);

    if (isMatch) {
      // SCORES MATCH! Auto-finalize match
      currentMatchData.status = "completed";
      const winnerId = thisReport.teamAScore > thisReport.teamBScore ? "team_a" : "team_b";
      currentMatchData.winner = winnerId;
      localStorage.setItem(key, JSON.stringify(currentMatchData));

      // Update Supabase if connected
      if (dbClient) {
        try {
          await dbClient
            .from("ladder_matches")
            .update({
              team_a_score: thisReport.teamAScore,
              team_b_score: thisReport.teamBScore,
              status: "completed",
              proof_url: thisReport.proofUrl || prev.proofUrl,
              completed_at: new Date().toISOString()
            })
            .eq("id", matchId);
        } catch (e) {}
      }

      return {
        success: true,
        status: "completed",
        isMatch: true,
        winnerId,
        scores: `${thisReport.teamAScore}-${thisReport.teamBScore}`,
        message: `Scores verified! Match finalized: ${thisReport.teamAScore}-${thisReport.teamBScore}. ELO ratings updated.`
      };
    } else {
      // SCORES DO NOT MATCH! -> AUTOMATIC DISPUTE FILED!
      currentMatchData.status = "disputed";
      localStorage.setItem(key, JSON.stringify(currentMatchData));

      const disputeReason = `Automated Dispute: Score Conflict. ${prev.reportingTeamName} reported ${prev.teamAScore}-${prev.teamBScore}, while ${thisReport.reportingTeamName} reported ${thisReport.teamAScore}-${thisReport.teamBScore}.`;
      const combinedProof = [prev.proofUrl, thisReport.proofUrl].filter(Boolean).join(" | ");

      const disputeRes = await this.fileDispute({
        matchId,
        submittedBy: "Automated System (Score Conflict)",
        disputeReason,
        proofUrl: combinedProof,
        team_a_name: prev.reportingTeamName,
        team_b_name: thisReport.reportingTeamName,
        team_a_score: prev.teamAScore,
        team_b_score: prev.teamBScore,
        team_b_reported_a: thisReport.teamAScore,
        team_b_reported_b: thisReport.teamBScore
      });

      return {
        success: true,
        status: "disputed",
        isConflict: true,
        autoDispute: true,
        disputeId: disputeRes.dispute?.id || "DISP_" + Date.now(),
        disputeReason,
        message: `⚠️ AUTOMATIC DISPUTE FILED: Score discrepancy detected (${prev.teamAScore}-${prev.teamBScore} vs ${thisReport.teamAScore}-${thisReport.teamBScore}). This match is now locked under League Admin review.`
      };
    }
  },

  // Manual or Automated Dispute Submission
  async fileDispute(disputeData) {
    const newDispute = {
      match_id: disputeData.matchId,
      submitted_by: disputeData.submittedBy || "Team Captain",
      dispute_reason: disputeData.disputeReason || "Match rule violation",
      proof_url: disputeData.proofUrl || "",
      status: "open",
      team_a_name: disputeData.team_a_name || "Team 1",
      team_b_name: disputeData.team_b_name || "Team 2",
      team_a_score: disputeData.team_a_score ?? 0,
      team_b_score: disputeData.team_b_score ?? 0,
      team_b_reported_a: disputeData.team_b_reported_a ?? 0,
      team_b_reported_b: disputeData.team_b_reported_b ?? 0,
      created_at: new Date().toISOString()
    };

    // Update match status to 'disputed'
    if (dbClient) {
      try {
        await dbClient.from("ladder_matches").update({ status: "disputed" }).eq("id", disputeData.matchId);
        const { data, error } = await dbClient.from("ladder_disputes").insert([newDispute]).select();
        if (!error && data && data.length > 0) return { success: true, dispute: data[0] };
      } catch (e) {
        console.warn("Supabase dispute insert failed:", e);
      }
    }

    // Local Storage Fallback
    try {
      let disputes = await this.getDisputes();
      newDispute.id = "disp_" + Date.now();
      disputes.unshift(newDispute);
      localStorage.setItem("frontline_ladder_disputes", JSON.stringify(disputes));
      return { success: true, dispute: newDispute, local: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getDisputes() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("ladder_disputes")
          .select("*, ladder_matches(*)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn("Supabase getDisputes failed:", e);
      }
    }

    try {
      const cached = JSON.parse(localStorage.getItem("frontline_ladder_disputes"));
      if (cached && cached.length > 0) return cached;
    } catch (e) {}

    return MOCK_LADDER_DATA.disputes || [];
  },

  async resolveDispute({ disputeId, matchId, action, winnerTeamId, winnerScore = 3, loserScore = 1, adminNotes = "" }) {
    const resolvedPayload = {
      status: action === "dismiss" ? "dismissed" : "resolved",
      admin_notes: adminNotes || `Resolved by Admin: ${action}`,
      resolved_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        await dbClient.from("ladder_disputes").update(resolvedPayload).eq("id", disputeId);
        if (action === "award_team_a" || action === "award_team_b") {
          await dbClient.from("ladder_matches").update({
            status: "completed",
            winner_id: winnerTeamId,
            team_a_score: action === "award_team_a" ? winnerScore : loserScore,
            team_b_score: action === "award_team_b" ? winnerScore : loserScore,
            completed_at: new Date().toISOString()
          }).eq("id", matchId);
        } else if (action === "rematch") {
          await dbClient.from("ladder_matches").update({
            status: "in_progress",
            team_a_score: 0,
            team_b_score: 0
          }).eq("id", matchId);
        }
        return { success: true };
      } catch (e) {
        console.warn("Supabase resolveDispute failed:", e);
      }
    }

    // Local Storage Resolution
    try {
      let disputes = await this.getDisputes();
      disputes = disputes.map(d => {
        if (String(d.id) === String(disputeId)) {
          return { ...d, ...resolvedPayload };
        }
        return d;
      });
      localStorage.setItem("frontline_ladder_disputes", JSON.stringify(disputes));
      return { success: true, local: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // ==============================================================================
  // ARENA PLAYER IDENTITY, PROFILE & MATCH HISTORY
  // ==============================================================================
  getCurrentPlayer() {
    try {
      const explicit = localStorage.getItem("frontline_arena_user");
      if (explicit) {
        return JSON.parse(explicit);
      }
    } catch (e) {}

    // Check Supabase session
    if (dbClient) {
      try {
        const sessionKeys = Object.keys(localStorage).filter(k => k.startsWith("sb-") && k.endsWith("-auth-token"));
        for (const k of sessionKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            const user = parsed?.user;
            if (user) {
              const gamertag = user.user_metadata?.gamertag || user.email?.split("@")[0] || "Combatant";
              return {
                id: user.id,
                gamertag: gamertag,
                email: user.email,
                tag: "ARENA",
                team_name: "Frontline Arena",
                elo: 1200,
                tier: "Specialist",
                avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
                discord: gamertag.toLowerCase(),
                activision_id: `${gamertag}#1234567`
              };
            }
          }
        }
      } catch (e) {}
    }

    return null;
  },

  getPlayerByGamertag(gamertag) {
    if (!gamertag) return null;
    const clean = String(gamertag).trim().toLowerCase();

    // 1. Current logged in player
    const cur = this.getCurrentPlayer();
    if (cur && ((cur.gamertag && cur.gamertag.toLowerCase() === clean) || (cur.username && cur.username.toLowerCase() === clean))) {
      return cur;
    }

    // 2. Presets
    const knownPresets = [
      {
        id: "viperx",
        gamertag: "ViperX",
        username: "ViperX",
        tag: "APEX",
        team_id: 101,
        team_name: "Apex Predators",
        elo: 2045,
        tier: "Apex Prestige",
        avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
        discord: "viperx_cdl",
        activision_id: "ViperX#8392014",
        email: "viperx@frontlinearena.com"
      },
      {
        id: "havoc",
        gamertag: "Havoc",
        username: "Havoc",
        tag: "CRIM",
        team_id: 102,
        team_name: "Crimson Syndicate",
        elo: 1880,
        tier: "Commander",
        avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
        discord: "havoc_snd",
        activision_id: "Havoc#6291038",
        email: "havoc@frontlinearena.com"
      },
      {
        id: "specter",
        gamertag: "Specter",
        username: "Specter",
        tag: "GPRT",
        team_id: 103,
        team_name: "Ghost Protocol",
        elo: 1690,
        tier: "Warlord",
        avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
        discord: "specter_cdl",
        activision_id: "Specter#7492810",
        email: "specter@frontlinearena.com"
      },
      {
        id: "phantom",
        gamertag: "Phantom",
        username: "Phantom",
        tag: "VNG",
        team_id: 104,
        team_name: "Vanguard Prime",
        elo: 1520,
        tier: "Vanguard",
        avatar_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
        discord: "phantom_vng",
        activision_id: "Phantom#9821043",
        email: "phantom@frontlinearena.com"
      }
    ];

    let found = knownPresets.find(p => p.gamertag.toLowerCase() === clean || (p.username && p.username.toLowerCase() === clean));
    if (found) return found;

    // 3. Custom registered accounts
    try {
      const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      found = customAccounts.find(a => (a.gamertag && a.gamertag.toLowerCase() === clean) || (a.username && a.username.toLowerCase() === clean));
      if (found) return found;
    } catch (e) {}

    // 4. Search in team rosters
    for (const lt of ["4v4_variant", "2v2_snd", "1v1_radar"]) {
      let teams = [];
      try {
        const cached = JSON.parse(localStorage.getItem("frontline_ladder_teams_" + lt)) || [];
        teams = (MOCK_LADDER_DATA.teams || []).concat(cached);
      } catch (e) {
        teams = MOCK_LADDER_DATA.teams || [];
      }
      for (const t of teams) {
        if (t.captain_name && t.captain_name.toLowerCase() === clean) {
          return {
            id: "cap_" + clean,
            gamertag: t.captain_name,
            username: t.captain_name,
            tag: t.tag || "ARENA",
            team_name: t.name,
            elo: t.elo || 1200,
            tier: this.getTier(t.elo || 1200).name,
            avatar_url: t.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            discord: t.captain_discord || `${t.captain_name.toLowerCase()}#0001`,
            activision_id: t.captain_activision || `${t.captain_name}#1234567`
          };
        }
        const roster = this.getTeamRoster(t);
        if (roster && Array.isArray(roster)) {
          const p = roster.find(pl => pl.gamertag && pl.gamertag.toLowerCase() === clean);
          if (p) {
            return {
              id: "usr_" + clean,
              gamertag: p.gamertag,
              username: p.gamertag,
              tag: t.tag || "ARENA",
              team_name: t.name,
              elo: p.elo || t.elo || 1200,
              tier: this.getTier(p.elo || t.elo || 1200).name,
              avatar_url: p.avatar_url || t.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
              discord: p.discord || `${p.gamertag.toLowerCase()}#0001`,
              activision_id: p.activision_id || `${p.gamertag}#1234567`
            };
          }
        }
      }
    }

    // 5. Fallback generic combatant profile
    return {
      id: "usr_" + clean,
      gamertag: gamertag,
      username: gamertag,
      tag: "ARENA",
      team_name: "Free Agent",
      elo: 1200,
      tier: "Specialist",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      discord: `${clean}#0001`,
      activision_id: `${gamertag}#1234567`
    };
  },

  async loginArenaPlayer(identifier, password = "") {
    if (!identifier || !identifier.trim()) {
      return { success: false, error: "Gamertag or Email is required." };
    }
    const cleanId = identifier.trim();

    // 1. Try Supabase Auth if email and password provided
    if (dbClient && cleanId.includes("@") && password) {
      try {
        const res = await window.LeagueDB.signInPlayer(cleanId, password);
        if (res.success && res.user) {
          const gamertag = res.user.user_metadata?.gamertag || cleanId.split("@")[0];
          const playerObj = {
            id: res.user.id,
            gamertag: gamertag,
            email: res.user.email,
            tag: "ARENA",
            team_name: "Frontline Arena",
            elo: 1200,
            tier: "Specialist",
            avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            discord: `${gamertag.toLowerCase()}#0001`,
            activision_id: `${gamertag}#1234567`
          };
          localStorage.setItem("frontline_arena_user", JSON.stringify(playerObj));
          this.updateArenaNavProfile();
          window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { player: playerObj } }));
          return { success: true, player: playerObj };
        }
      } catch (e) {
        console.warn("Supabase player login error, falling back:", e);
      }
    }

    // 2. Preset / Known Arena Players Directory
    const knownPresets = [
      {
        gamertag: "ViperX",
        tag: "APEX",
        team_id: 101,
        team_name: "Apex Predators",
        elo: 2045,
        tier: "Apex Prestige",
        avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
        discord: "viperx_cdl",
        activision_id: "ViperX#8392014",
        email: "viperx@frontlinearena.com"
      },
      {
        gamertag: "Havoc",
        tag: "CRIM",
        team_id: 102,
        team_name: "Crimson Syndicate",
        elo: 1880,
        tier: "Commander",
        avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
        discord: "havoc_snd",
        activision_id: "Havoc#6291038",
        email: "havoc@frontlinearena.com"
      },
      {
        gamertag: "Specter",
        tag: "GPRT",
        team_id: 103,
        team_name: "Ghost Protocol",
        elo: 1690,
        tier: "Warlord",
        avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
        discord: "specter_cdl",
        activision_id: "Specter#7492810",
        email: "specter@frontlinearena.com"
      },
      {
        gamertag: "Phantom",
        tag: "VNG",
        team_id: 104,
        team_name: "Vanguard Prime",
        elo: 1520,
        tier: "Vanguard",
        avatar_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
        discord: "phantom_vng",
        activision_id: "Phantom#9821043",
        email: "phantom@frontlinearena.com"
      }
    ];

    let found = knownPresets.find(p => 
      p.gamertag.toLowerCase() === cleanId.toLowerCase() || 
      (p.email && p.email.toLowerCase() === cleanId.toLowerCase())
    );

    // Check custom registered accounts
    if (!found) {
      try {
        const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
        const match = customAccounts.find(a => 
          (a.gamertag && a.gamertag.toLowerCase() === cleanId.toLowerCase()) || 
          (a.email && a.email.toLowerCase() === cleanId.toLowerCase())
        );
        if (match) {
          if (match.password && password && match.password !== password) {
            return { success: false, error: "Incorrect password. Please verify and try again." };
          }
          found = match;
        }
      } catch (e) {}
    }

    // If not in presets or custom list, generate a clean combatant profile for immediate sign in
    if (!found) {
      found = {
        id: "usr_" + Date.now(),
        gamertag: cleanId,
        username: cleanId,
        tag: "ARENA",
        team_name: "Free Agent",
        elo: 1200,
        tier: "Specialist",
        avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
        discord: `${cleanId.toLowerCase()}#0001`,
        activision_id: `${cleanId}#1234567`,
        email: cleanId.includes("@") ? cleanId : `${cleanId.toLowerCase()}@player.frontline`
      };
    }

    localStorage.setItem("frontline_arena_user", JSON.stringify(found));
    this.updateArenaNavProfile();
    window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { player: found } }));
    return { success: true, player: found };
  },

  logoutArenaPlayer() {
    try {
      localStorage.removeItem("frontline_arena_user");
      if (window.LeagueDB && typeof window.LeagueDB.signOutPlayer === "function") {
        window.LeagueDB.signOutPlayer().catch(() => {});
      }
    } catch (e) {}
    this.updateArenaNavProfile();
    window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { player: null } }));
    return { success: true };
  },

  async registerArenaPlayer({ gamertag, clan_tag, email, discord, activision_id, password }) {
    const cleanEmail = (email || "").trim();
    const cleanPassword = (password || "").trim();
    const cleanGamertag = (gamertag || "").trim();
    const cleanActivision = (activision_id || "").trim();

    if (!cleanEmail) {
      return { success: false, error: "Email address is required." };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (!cleanGamertag) {
      return { success: false, error: "Username is required. Please choose a username for the website." };
    }
    if (!cleanActivision) {
      return { success: false, error: "Activision ID is required (e.g. Username#1234567)." };
    }

    const cleanTag = (clan_tag || "TAG").toUpperCase().trim().slice(0, 5);

    // Sync to Supabase Auth / LeagueDB if available
    let supabaseUserId = null;
    if (window.LeagueDB && typeof window.LeagueDB.signUpPlayer === "function") {
      try {
        const supaRes = await window.LeagueDB.signUpPlayer(cleanEmail, cleanPassword, cleanGamertag, cleanActivision);
        if (supaRes && supaRes.user) {
          supabaseUserId = supaRes.user.id;
        }
      } catch (err) {
        console.warn("Supabase account sync notice:", err);
      }
    }

    const newPlayer = {
      id: supabaseUserId || ("usr_" + Date.now()),
      gamertag: cleanGamertag,
      username: cleanGamertag,
      tag: cleanTag,
      email: cleanEmail,
      team_name: `${cleanTag} Squad`,
      elo: 1200,
      tier: "Specialist",
      avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      discord: discord ? discord.trim() : `${cleanGamertag.toLowerCase()}#0001`,
      activision_id: cleanActivision,
      password: cleanPassword,
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const filtered = existing.filter(a =>
        (!a.email || a.email.toLowerCase() !== cleanEmail.toLowerCase()) &&
        (!a.gamertag || a.gamertag.toLowerCase() !== cleanGamertag.toLowerCase())
      );
      filtered.push(newPlayer);
      localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(filtered));
    } catch (e) {}

    // Ensure recruit is also recorded in the recruitment queue
    try {
      if (window.LeagueDB && typeof window.LeagueDB.submitSignup === "function") {
        await window.LeagueDB.submitSignup({
          gamertag: cleanGamertag,
          activision_id: cleanActivision,
          discord_username: discord ? discord.trim() : `${cleanGamertag.toLowerCase()}#0001`,
          role: "Starter",
          platform: "Crossplay",
          region: "NA East",
          registration_type: "Arena Combatant",
          team_name: `${cleanTag} Squad`,
          notes: `[Account: ${cleanEmail}] Frontline Arena combatant registration`,
          status: "Pending"
        });
      }
    } catch (_) {}

    localStorage.setItem("frontline_arena_user", JSON.stringify(newPlayer));
    this.updateArenaNavProfile();
    window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { player: newPlayer } }));
    return { success: true, player: newPlayer };
  },

  async updatePlayerProfile(updatedData) {
    const cur = this.getCurrentPlayer();
    if (!cur) return { success: false, error: "Not logged in" };

    const oldGamertag = cur.gamertag || cur.username || "";
    let targetGamertag = updatedData.gamertag !== undefined ? updatedData.gamertag.trim() : (updatedData.username !== undefined ? updatedData.username.trim() : oldGamertag);

    if (!targetGamertag) {
      return { success: false, error: "Username / Gamertag cannot be empty." };
    }

    // Collision check if gamertag is changing (case-insensitive)
    if (targetGamertag.toLowerCase() !== oldGamertag.toLowerCase()) {
      try {
        const customAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
        const isTaken = customAccounts.some(a => 
          a.gamertag && 
          a.gamertag.toLowerCase() === targetGamertag.toLowerCase() && 
          (a.id !== cur.id && (!cur.email || !a.email || a.email.toLowerCase() !== cur.email.toLowerCase()))
        );
        if (isTaken) {
          return { success: false, error: `Username "${targetGamertag}" is already taken by another operative. Please choose a different handle.` };
        }

        const knownPresetNames = ["viperx", "havoc", "specter", "phantom"];
        if (knownPresetNames.includes(targetGamertag.toLowerCase()) && !knownPresetNames.includes(oldGamertag.toLowerCase())) {
          return { success: false, error: `Username "${targetGamertag}" is reserved. Please select another gamertag.` };
        }
      } catch (e) {}
    }

    const merged = {
      ...cur,
      ...updatedData,
      gamertag: targetGamertag,
      username: targetGamertag
    };

    // 1. Update primary local session
    try {
      localStorage.setItem("frontline_arena_user", JSON.stringify(merged));
    } catch (e) {}

    // 2. Update auth user session in localStorage if present
    try {
      const authUserStr = localStorage.getItem("frontline_arena_auth_user");
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);
        const updatedAuthUser = { ...authUser, ...updatedData, gamertag: targetGamertag, username: targetGamertag };
        localStorage.setItem("frontline_arena_auth_user", JSON.stringify(updatedAuthUser));
      }
    } catch (e) {}

    // 3. Update registered accounts directory in localStorage
    try {
      let accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      let foundIndex = accounts.findIndex(a => 
        (cur.id && a.id === cur.id) || 
        (cur.email && a.email && a.email.toLowerCase() === cur.email.toLowerCase()) || 
        (a.gamertag && a.gamertag.toLowerCase() === oldGamertag.toLowerCase())
      );
      if (foundIndex >= 0) {
        accounts[foundIndex] = { ...accounts[foundIndex], ...merged };
      } else {
        accounts.push(merged);
      }
      localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(accounts));
    } catch (e) {}

    // 4. Update team rosters and captain name in my active squads
    try {
      const ladders = ["4v4_variant", "2v2_snd", "1v1_radar"];
      for (const lt of ladders) {
        const myTeam = this.getMyTeam(lt);
        if (myTeam) {
          let modified = false;
          if (myTeam.captain_name && (myTeam.captain_name.toLowerCase() === oldGamertag.toLowerCase() || myTeam.captain_name === cur.gamertag)) {
            myTeam.captain_name = targetGamertag;
            if (merged.tag) myTeam.tag = merged.tag;
            if (merged.avatar_url) myTeam.avatar_url = merged.avatar_url;
            modified = true;
          }
          if (myTeam.players && Array.isArray(myTeam.players)) {
            myTeam.players = myTeam.players.map(p => {
              if (p.gamertag && p.gamertag.toLowerCase() === oldGamertag.toLowerCase()) {
                modified = true;
                return {
                  ...p,
                  gamertag: targetGamertag,
                  activision_id: merged.activision_id || p.activision_id,
                  discord: merged.discord || p.discord,
                  avatar_url: merged.avatar_url || p.avatar_url
                };
              }
              return p;
            });
          }
          if (modified) {
            this.setMyTeam(lt, myTeam);
          }
        }
      }
    } catch (e) {}

    // 5. Cloud Supabase Auth Sync if user is authenticated
    if (dbClient && typeof dbClient.auth?.updateUser === "function") {
      try {
        const metaUpdate = {
          gamertag: targetGamertag,
          username: targetGamertag,
          name: targetGamertag
        };
        if (merged.activision_id) metaUpdate.activision_id = merged.activision_id;
        if (merged.avatar_url) metaUpdate.avatar_url = merged.avatar_url;
        await dbClient.auth.updateUser({ data: metaUpdate });
      } catch (err) {
        console.warn("Supabase user metadata update notice:", err);
      }
    }

    this.updateArenaNavProfile();
    window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { player: merged } }));
    return { success: true, player: merged };
  },

  // Retrieve rich match history for any player or active user
  getPlayerMatchHistory(playerOrGamertag = null) {
    let player = playerOrGamertag;
    if (!player) {
      player = this.getCurrentPlayer();
    } else if (typeof player === "string") {
      player = { gamertag: player };
    }

    if (!player || !player.gamertag) return [];

    const gt = player.gamertag.toLowerCase();
    const tag = (player.tag || "").toLowerCase();

    // Check if player is ViperX (Apex Predators)
    if (gt === "viperx" || tag === "apex" || (player.team_name && player.team_name.toLowerCase().includes("apex"))) {
      let liveScores = "3 – 1";
      try {
        const rep = JSON.parse(localStorage.getItem("frontline_match_report_1049"));
        if (rep && rep.firstReport) {
          liveScores = `${rep.firstReport.teamAScore} – ${rep.firstReport.teamBScore}`;
        }
      } catch (e) {}

      return [
        {
          id: 1049,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Today • 8:30 PM EST",
          timestamp: Date.now() - 1800000,
          opponent_name: "Crimson Syndicate",
          opponent_tag: "CRIM",
          opponent_avatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Havoc",
          opponent_elo: 1880,
          status: "in_progress",
          outcome: "in_progress",
          my_score: 3,
          opp_score: 1,
          score_display: liveScores,
          maps: "Karachi HP • Skidrow SnD • Invasion CTL • Sub Base HP",
          best_of: 5
        },
        {
          id: 1048,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Oct 1, 2026 • 6:15 PM EST",
          timestamp: Date.now() - 86400000,
          opponent_name: "Ghost Protocol",
          opponent_tag: "GPRT",
          opponent_avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Specter",
          opponent_elo: 1690,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Sub Base HP (250-184) • Terminal SnD (6-2) • Highrise CTL (3-1)",
          best_of: 5
        },
        {
          id: 1045,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 29, 2026 • 9:00 PM EST",
          timestamp: Date.now() - 172800000,
          opponent_name: "Vanguard Prime",
          opponent_tag: "VNG",
          opponent_avatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Phantom",
          opponent_elo: 1520,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 1,
          score_display: "3 – 1",
          maps: "Karachi HP (250-210) • Skidrow SnD (4-6) • Invasion CTL (3-2) • Terminal HP (250-195)",
          best_of: 5
        },
        {
          id: 1039,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 27, 2026 • 8:00 PM EST",
          timestamp: Date.now() - 345600000,
          opponent_name: "Crimson Syndicate",
          opponent_tag: "CRIM",
          opponent_avatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Havoc",
          opponent_elo: 1880,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 2,
          score_display: "3 – 2",
          maps: "Karachi HP (250-244) • Rio SnD (6-5) • Highrise CTL (2-3) • Sub Base HP (230-250) • Terminal SnD (6-5)",
          best_of: 5
        },
        {
          id: 1034,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 25, 2026 • 7:30 PM EST",
          timestamp: Date.now() - 518400000,
          opponent_name: "Sub Base Kings",
          opponent_tag: "SBK",
          opponent_avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Blitz",
          opponent_elo: 1340,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Sub Base HP (250-135) • Skidrow SnD (6-1) • Invasion CTL (3-0)",
          best_of: 5
        },
        {
          id: 1028,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 23, 2026 • 9:45 PM EST",
          timestamp: Date.now() - 691200000,
          opponent_name: "Rookie Regime",
          opponent_tag: "RREG",
          opponent_avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "NewbieSniper",
          opponent_elo: 1120,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Rio HP (250-112) • Karachi SnD (6-0) • Highrise CTL (3-0)",
          best_of: 5
        },
        {
          id: 1022,
          ladder_name: "2v2 Search & Destroy",
          ladder_type: "2v2_snd",
          date: "Sep 21, 2026 • 10:15 PM EST",
          timestamp: Date.now() - 864000000,
          opponent_name: "Duo Demons",
          opponent_tag: "DEMN",
          opponent_avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Reaper",
          opponent_elo: 1950,
          status: "completed",
          outcome: "victory",
          my_score: 2,
          opp_score: 0,
          score_display: "2 – 0",
          maps: "Karachi SnD (6-3) • Terminal SnD (6-4)",
          best_of: 3
        },
        {
          id: 1016,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 18, 2026 • 8:15 PM EST",
          timestamp: Date.now() - 1123200000,
          opponent_name: "Ghost Protocol",
          opponent_tag: "GPRT",
          opponent_avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Specter",
          opponent_elo: 1690,
          status: "completed",
          outcome: "defeat",
          my_score: 2,
          opp_score: 3,
          score_display: "2 – 3",
          maps: "Karachi HP (250-230) • Skidrow SnD (3-6) • Invasion CTL (3-1) • Rio HP (241-250) • Terminal SnD (4-6)",
          best_of: 5
        },
        {
          id: 1011,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 15, 2026 • 7:00 PM EST",
          timestamp: Date.now() - 1382400000,
          opponent_name: "Vanguard Prime",
          opponent_tag: "VNG",
          opponent_avatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Phantom",
          opponent_elo: 1520,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Sub Base HP (250-189) • Karachi SnD (6-2) • Highrise CTL (3-1)",
          best_of: 5
        },
        {
          id: 1005,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 12, 2026 • 9:30 PM EST",
          timestamp: Date.now() - 1641600000,
          opponent_name: "Crimson Syndicate",
          opponent_tag: "CRIM",
          opponent_avatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Havoc",
          opponent_elo: 1880,
          status: "completed",
          outcome: "defeat",
          my_score: 1,
          opp_score: 3,
          score_display: "1 – 3",
          maps: "Rio HP (215-250) • Skidrow SnD (6-4) • Invasion CTL (1-3) • Sub Base HP (205-250)",
          best_of: 5
        }
      ];
    }

    // Check if player is Havoc (Crimson Syndicate)
    if (gt === "havoc" || tag === "crim" || (player.team_name && player.team_name.toLowerCase().includes("crimson"))) {
      let liveScores = "1 – 3";
      try {
        const rep = JSON.parse(localStorage.getItem("frontline_match_report_1049"));
        if (rep && rep.firstReport) {
          liveScores = `${rep.firstReport.teamBScore} – ${rep.firstReport.teamAScore}`;
        }
      } catch (e) {}

      return [
        {
          id: 1049,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Today • 8:30 PM EST",
          timestamp: Date.now() - 1800000,
          opponent_name: "Apex Predators",
          opponent_tag: "APEX",
          opponent_avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "ViperX",
          opponent_elo: 2045,
          status: "in_progress",
          outcome: "in_progress",
          my_score: 1,
          opp_score: 3,
          score_display: liveScores,
          maps: "Karachi HP • Skidrow SnD • Invasion CTL • Sub Base HP",
          best_of: 5
        },
        {
          id: 1047,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 30, 2026 • 8:00 PM EST",
          timestamp: Date.now() - 86400000,
          opponent_name: "Vanguard Prime",
          opponent_tag: "VNG",
          opponent_avatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Phantom",
          opponent_elo: 1520,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 1,
          score_display: "3 – 1",
          maps: "Karachi HP (250-190) • Skidrow SnD (6-2) • Invasion CTL (2-3) • Rio HP (250-205)",
          best_of: 5
        },
        {
          id: 1043,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 28, 2026 • 7:15 PM EST",
          timestamp: Date.now() - 259200000,
          opponent_name: "Sub Base Kings",
          opponent_tag: "SBK",
          opponent_avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Blitz",
          opponent_elo: 1340,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Sub Base HP (250-160) • Terminal SnD (6-3) • Highrise CTL (3-0)",
          best_of: 5
        },
        {
          id: 1039,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 27, 2026 • 8:00 PM EST",
          timestamp: Date.now() - 345600000,
          opponent_name: "Apex Predators",
          opponent_tag: "APEX",
          opponent_avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "ViperX",
          opponent_elo: 2045,
          status: "completed",
          outcome: "defeat",
          my_score: 2,
          opp_score: 3,
          score_display: "2 – 3",
          maps: "Karachi HP (244-250) • Rio SnD (5-6) • Highrise CTL (3-2) • Sub Base HP (250-230) • Terminal SnD (5-6)",
          best_of: 5
        },
        {
          id: 1031,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 24, 2026 • 9:00 PM EST",
          timestamp: Date.now() - 604800000,
          opponent_name: "Ghost Protocol",
          opponent_tag: "GPRT",
          opponent_avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "Specter",
          opponent_elo: 1690,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 2,
          score_display: "3 – 2",
          maps: "Rio HP (250-210) • Skidrow SnD (4-6) • Invasion CTL (3-1) • Karachi HP (215-250) • Terminal SnD (6-4)",
          best_of: 5
        },
        {
          id: 1025,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 22, 2026 • 6:45 PM EST",
          timestamp: Date.now() - 777600000,
          opponent_name: "Rookie Regime",
          opponent_tag: "RREG",
          opponent_avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "NewbieSniper",
          opponent_elo: 1120,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 0,
          score_display: "3 – 0",
          maps: "Sub Base HP (250-130) • Karachi SnD (6-1) • Invasion CTL (3-0)",
          best_of: 5
        },
        {
          id: 1005,
          ladder_name: "4v4 CDL Variant",
          ladder_type: "4v4_variant",
          date: "Sep 12, 2026 • 9:30 PM EST",
          timestamp: Date.now() - 1641600000,
          opponent_name: "Apex Predators",
          opponent_tag: "APEX",
          opponent_avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
          opponent_captain: "ViperX",
          opponent_elo: 2045,
          status: "completed",
          outcome: "victory",
          my_score: 3,
          opp_score: 1,
          score_display: "3 – 1",
          maps: "Rio HP (250-215) • Skidrow SnD (4-6) • Invasion CTL (3-1) • Sub Base HP (250-205)",
          best_of: 5
        }
      ];
    }

    // Dynamic checks for active localStorage matches matching this player or team
    const customMatches = [];
    try {
      const active = JSON.parse(localStorage.getItem("frontline_ladder_active_matches")) || [];
      active.forEach(m => {
        const teamA = m.team_a;
        const teamB = m.team_b;
        const isTeamA = (teamA && (teamA.captain_name?.toLowerCase() === gt || teamA.tag?.toLowerCase() === tag));
        const isTeamB = (teamB && (teamB.captain_name?.toLowerCase() === gt || teamB.tag?.toLowerCase() === tag));

        if (isTeamA || isTeamB) {
          const myTeam = isTeamA ? teamA : teamB;
          const oppTeam = isTeamA ? teamB : teamA;
          const isCompleted = m.status === "completed";
          const isDisputed = m.status === "disputed";
          const myScore = isTeamA ? (m.team_a_score || 0) : (m.team_b_score || 0);
          const oppScore = isTeamA ? (m.team_b_score || 0) : (m.team_a_score || 0);

          let outcome = "in_progress";
          if (isDisputed) outcome = "disputed";
          else if (isCompleted) outcome = myScore > oppScore ? "victory" : "defeat";

          customMatches.push({
            id: m.id,
            ladder_name: m.ladder_type === "2v2_snd" ? "2v2 Search & Destroy" : m.ladder_type === "1v1_radar" ? "1v1 Radar Gunfight" : "4v4 CDL Variant",
            ladder_type: m.ladder_type || "4v4_variant",
            date: "Recently",
            timestamp: new Date(m.created_at || Date.now()).getTime(),
            opponent_name: oppTeam?.name || "Opponent Squad",
            opponent_tag: oppTeam?.tag || "OPP",
            opponent_avatar: oppTeam?.avatar_url || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
            opponent_captain: oppTeam?.captain_name || "Captain",
            opponent_elo: oppTeam?.elo || 1200,
            status: m.status,
            outcome: outcome,
            my_score: myScore,
            opp_score: oppScore,
            score_display: `${myScore} – ${oppScore}`,
            maps: "CDL Competitive Rotation",
            best_of: m.best_of || 5
          });
        }
      });
    } catch (e) {}

    return customMatches;
  },

  // Calculate Win/Loss statistics for player
  getPlayerStats(playerOrGamertag = null) {
    let player = playerOrGamertag;
    if (!player) player = this.getCurrentPlayer();
    else if (typeof player === "string") player = { gamertag: player };

    if (!player || !player.gamertag) {
      return {
        wins: 0,
        losses: 0,
        winRate: "0.0%",
        streak: "0",
        totalMatches: 0,
        completedMatches: 0,
        inProgress: 0,
        disputed: 0
      };
    }

    const gt = player.gamertag.toLowerCase();
    const tag = (player.tag || "").toLowerCase();

    // Specific presets
    if (gt === "viperx" || tag === "apex") {
      return {
        wins: 18,
        losses: 2,
        winRate: "90.0%",
        streak: "+6",
        totalMatches: 20,
        completedMatches: 19,
        inProgress: 1,
        disputed: 0
      };
    }

    if (gt === "havoc" || tag === "crim") {
      return {
        wins: 14,
        losses: 4,
        winRate: "77.8%",
        streak: "+3",
        totalMatches: 18,
        completedMatches: 17,
        inProgress: 1,
        disputed: 0
      };
    }

    const matches = this.getPlayerMatchHistory(player);
    let wins = 0;
    let losses = 0;
    let inProgress = 0;
    let disputed = 0;

    matches.forEach(m => {
      if (m.status === "in_progress") inProgress++;
      else if (m.status === "disputed") disputed++;
      else if (m.outcome === "victory") wins++;
      else if (m.outcome === "defeat") losses++;
    });

    const completed = wins + losses;
    const winRate = completed > 0 ? ((wins / completed) * 100).toFixed(1) : "0.0";

    let streak = 0;
    for (const m of matches) {
      if (m.status === "completed") {
        if (streak >= 0 && m.outcome === "victory") streak++;
        else if (streak <= 0 && m.outcome === "defeat") streak--;
        else break;
      }
    }

    return {
      wins,
      losses,
      winRate: `${winRate}%`,
      streak: streak > 0 ? `+${streak}` : String(streak),
      totalMatches: matches.length,
      completedMatches: completed,
      inProgress,
      disputed
    };
  },

  // Get active teams for all ladders (strictly ONE team per ladder rule)
  getUserTeams(playerOrGamertag = null) {
    let player = playerOrGamertag;
    if (!player) player = this.getCurrentPlayer();
    else if (typeof player === "string") player = { gamertag: player };

    const ladders = [
      { id: "4v4_variant", name: "4v4 CDL Variant", circuit: "Variant (HP / SnD / CTL)", maxPlayers: 4, icon: "⚔" },
      { id: "2v2_snd", name: "2v2 Search & Destroy", circuit: "Search & Destroy Only", maxPlayers: 2, icon: "🎯" },
      { id: "1v1_radar", name: "1v1 Radar Gunfight", circuit: "Radar Always-On Gunfight", maxPlayers: 1, icon: "💀" }
    ];

    if (!player || !player.gamertag) {
      return ladders.map(l => ({
        ladder_type: l.id,
        ladder_name: l.name,
        circuit: l.circuit,
        icon: l.icon,
        team: null
      }));
    }

    const gt = player.gamertag.toLowerCase();
    const tag = (player.tag || "").toLowerCase();

    // Presets for ViperX, Havoc, Specter
    if (gt === "viperx" || tag === "apex") {
      const mySaved4v4 = this.getMyTeam("4v4_variant");
      const mySaved2v2 = this.getMyTeam("2v2_snd");
      const mySaved1v1 = this.getMyTeam("1v1_radar");

      return [
        {
          ladder_type: "4v4_variant",
          ladder_name: "4v4 CDL Variant",
          circuit: "Variant (HP / SnD / CTL)",
          icon: "⚔",
          team: mySaved4v4 || {
            id: 101,
            name: "Apex Predators",
            tag: "APEX",
            avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            captain_name: "ViperX",
            role: "Captain / Starter",
            elo: 2045,
            tier: "Apex Prestige",
            wins: 18,
            losses: 2,
            streak: 6
          }
        },
        {
          ladder_type: "2v2_snd",
          ladder_name: "2v2 Search & Destroy",
          circuit: "Search & Destroy Only",
          icon: "🎯",
          team: mySaved2v2 || {
            id: 210,
            name: "Apex Duo",
            tag: "APEX",
            avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            captain_name: "ViperX",
            role: "Captain",
            elo: 1920,
            tier: "Commander",
            wins: 8,
            losses: 1,
            streak: 4
          }
        },
        {
          ladder_type: "1v1_radar",
          ladder_name: "1v1 Radar Gunfight",
          circuit: "Radar Always-On Gunfight",
          icon: "💀",
          team: mySaved1v1 || {
            id: 301,
            name: "Lone Wolf Solo",
            tag: "LONE",
            avatar_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
            captain_name: "ViperX",
            role: "Solo Operator",
            elo: 2010,
            tier: "Apex Prestige",
            wins: 22,
            losses: 1,
            streak: 8
          }
        }
      ];
    }

    if (gt === "havoc" || tag === "crim") {
      const mySaved4v4 = this.getMyTeam("4v4_variant");
      const mySaved2v2 = this.getMyTeam("2v2_snd");
      const mySaved1v1 = this.getMyTeam("1v1_radar");

      return [
        {
          ladder_type: "4v4_variant",
          ladder_name: "4v4 CDL Variant",
          circuit: "Variant (HP / SnD / CTL)",
          icon: "⚔",
          team: mySaved4v4 || {
            id: 102,
            name: "Crimson Syndicate",
            tag: "CRIM",
            avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
            captain_name: "Havoc",
            role: "Captain / Starter",
            elo: 1880,
            tier: "Commander",
            wins: 14,
            losses: 4,
            streak: 3
          }
        },
        {
          ladder_type: "2v2_snd",
          ladder_name: "2v2 Search & Destroy",
          circuit: "Search & Destroy Only",
          icon: "🎯",
          team: mySaved2v2 || {
            id: 211,
            name: "Crimson SnD Duo",
            tag: "CRIM",
            avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
            captain_name: "Havoc",
            role: "Captain",
            elo: 1750,
            tier: "Warlord",
            wins: 9,
            losses: 3,
            streak: 2
          }
        },
        {
          ladder_type: "1v1_radar",
          ladder_name: "1v1 Radar Gunfight",
          circuit: "Radar Always-On Gunfight",
          icon: "💀",
          team: mySaved1v1 || null
        }
      ];
    }

    if (gt === "specter" || tag === "gprt") {
      const mySaved4v4 = this.getMyTeam("4v4_variant");
      const mySaved2v2 = this.getMyTeam("2v2_snd");
      const mySaved1v1 = this.getMyTeam("1v1_radar");

      return [
        {
          ladder_type: "4v4_variant",
          ladder_name: "4v4 CDL Variant",
          circuit: "Variant (HP / SnD / CTL)",
          icon: "⚔",
          team: mySaved4v4 || {
            id: 103,
            name: "Ghost Protocol",
            tag: "GPRT",
            avatar_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80",
            captain_name: "Specter",
            role: "Captain / Starter",
            elo: 1690,
            tier: "Warlord",
            wins: 11,
            losses: 5,
            streak: 2
          }
        },
        {
          ladder_type: "2v2_snd",
          ladder_name: "2v2 Search & Destroy",
          circuit: "Search & Destroy Only",
          icon: "🎯",
          team: mySaved2v2 || {
            id: 202,
            name: "Silent Scope Duo",
            tag: "SSD",
            avatar_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=80",
            captain_name: "Specter",
            role: "Starter",
            elo: 1740,
            tier: "Warlord",
            wins: 12,
            losses: 4,
            streak: 2
          }
        },
        {
          ladder_type: "1v1_radar",
          ladder_name: "1v1 Radar Gunfight",
          circuit: "Radar Always-On Gunfight",
          icon: "💀",
          team: mySaved1v1 || null
        }
      ];
    }

    // Custom accounts: retrieve exactly ONE team per ladder stored in frontline_my_team_<ladder_type>
    return ladders.map(l => {
      const myTeam = this.getMyTeam(l.id);
      return {
        ladder_type: l.id,
        ladder_name: l.name,
        circuit: l.circuit,
        icon: l.icon,
        team: myTeam || null
      };
    });
  },

  // Updates the Arena navigation bar Profile / Login link and My Teams link across all pages
  updateArenaNavProfile() {
    if (typeof document === "undefined") return;
    const player = this.getCurrentPlayer();
    const linkEl = document.getElementById("nav-arena-profile-link");
    const iconEl = document.getElementById("nav-arena-profile-icon");
    const textEl = document.getElementById("nav-arena-profile-text");
    const myTeamsLink = document.getElementById("nav-arena-my-teams-link");

    if (myTeamsLink) {
      myTeamsLink.href = player && player.gamertag ? "profile.html#my-teams" : "profile.html#login";
    }

    if (linkEl) {
      if (player && player.gamertag) {
        linkEl.href = "profile.html";
        linkEl.title = `Signed in as ${player.gamertag} - View Profile & Records`;
        if (iconEl) iconEl.textContent = "👤";
        if (textEl) textEl.textContent = `Profile (${player.gamertag})`;
      } else {
        linkEl.href = "profile.html#login";
        linkEl.title = "Sign in to Frontline Arena";
        if (iconEl) iconEl.textContent = "🔑";
        if (textEl) textEl.textContent = "Login";
      }
    }

    // Also update any arena header squad/user pill if present
    const squadHeaderEl = document.getElementById("arena-header-squad-container");
    if (squadHeaderEl) {
      if (player && player.gamertag) {
        squadHeaderEl.innerHTML = `
          <a href="profile.html#my-teams" class="gb-my-squad-pill" title="View Active Teams" style="text-decoration:none;">
            <img src="${player.avatar_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80'}" class="gb-my-squad-avatar" />
            <div>
              <strong style="color:#ffffff;">[${player.tag || 'TAG'}] ${player.gamertag}</strong>
              <span style="color:#ff1e44; font-size:11px; margin-left:4px;">${player.elo || 1200} ELO</span>
            </div>
          </a>
        `;
      } else {
        squadHeaderEl.innerHTML = `
          <a href="profile.html#login" class="btn-crimson" style="font-size:11px; padding:7px 14px; text-decoration:none;">
            <span>🔑</span> <span>Combatant Login</span>
          </a>
        `;
      }
    }
  }
};

// Auto-initialize global Arena Profile nav status across all pages
(function initArenaNavWatcher() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  function runNavUpdate() {
    if (window.LadderDB && typeof window.LadderDB.updateArenaNavProfile === "function") {
      window.LadderDB.updateArenaNavProfile();
    }
  }

  runNavUpdate();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runNavUpdate);
  }

  window.addEventListener("frontline_arena_auth_changed", runNavUpdate);
  window.addEventListener("storage", (e) => {
    if (e.key === "frontline_arena_user") runNavUpdate();
  });
})();


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

