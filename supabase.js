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
if (typeof window !== "undefined" && window.supabase && isSupabaseConfigured()) {
  try {
    dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.dbClient = dbClient;
    window.supabaseClient = dbClient;

    dbClient.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        try {
          const prevUser = JSON.parse(localStorage.getItem("frontline_league_auth_user") || "null");
          if (prevUser && prevUser.id !== session.user.id) {
            // Identity switched: purge cached player card to prevent cross-account profile bleeding
            localStorage.removeItem("frontline_league_player_card");
          }
          localStorage.setItem("frontline_league_auth_user", JSON.stringify(session.user));
          localStorage.setItem("frontline_arena_auth_user", JSON.stringify(session.user));
          window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: session.user } }));
          window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { user: session.user } }));
        } catch(e) {}
      } else if (event === "SIGNED_OUT") {
        try {
          localStorage.removeItem("frontline_league_auth_user");
          localStorage.removeItem("frontline_arena_auth_user");
          localStorage.removeItem("frontline_league_player_card");
          sessionStorage.removeItem("frontline_admin_session");
          sessionStorage.removeItem("frontline_admin_email");
          window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: null } }));
          window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { user: null } }));
        } catch(e) {}
      }
    });
  } catch(e) {
    console.warn("Supabase client init notice:", e);
  }
}
window.SUPABASE_CONFIG = { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };

// Fallback Mock Data (displayed if Supabase credentials have not been configured yet)
const MOCK_DATA = {
  teams: [],
  players: [],
  signups: [],
  staffRoles: [
    { id: 0, email: "todd061496@gmail.com", display_name: "Commissioner Spencer", role: "commissioner", notes: "League Owner & Commissioner" },
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
      image_url: null,
      image_fit: "contain",
      link_url: "/brackets/",
      link_text: "View Tournament Brackets ↗",
      is_active: true,
      pinned: false,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  vods: [],
  scheduled_matches: [],
  map_stats: {},
  team_map_records: {}
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
    let teams = [];
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .select("*")
          .order("points", { ascending: false })
          .order("wins", { ascending: false });
        if (!error && data) teams = data;
        else console.warn("Supabase fetch returned error, using fallback:", error);
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }
    if (!teams || teams.length === 0) {
      teams = (MOCK_DATA.teams || []).slice();
    }
    // Enrich teams with division mapping (either from record, or from local persistent division map)
    try {
      const divMap = JSON.parse(localStorage.getItem('frontline_teams_division_map') || '{}');
      teams = teams.map(t => {
        const div = t.division || divMap[t.id] || (t.name ? divMap[t.name.toLowerCase().trim()] : null) || 'div-1';
        return { ...t, division: div };
      });
    } catch(e) {}
    return teams;
  },

  // 1b. Fetch Teams with their Roster of Players
  async getTeamsWithPlayers() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("teams")
          .select("*, players(*)")
          .order("points", { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase fetch returned error, using fallback:", error);
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
    let list = [];

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("players")
          .select("*, teams(name, tag)")
          .order("kdr", { ascending: false });

        if (!error && Array.isArray(data)) {
          list = data.map(p => {
            const isFreeAgent = !p.teams || (p.team_name && (p.team_name.toLowerCase() === 'free agent' || p.team_name.toLowerCase() === 'unassigned')) || p.status === 'Free Agent';
            const division = p.division || p.teams?.division || (isFreeAgent ? 'Free Agent' : (p.kdr >= 1.15 ? 'Division 1 (Pro)' : (p.kdr >= 1.0 ? 'Division 2 (Challengers)' : 'Open Division')));
            const calculatedRank = p.rank || (p.kdr >= 1.2 ? "1.5" : (p.kdr >= 1.0 ? "1.0" : "0.5"));
            return {
              ...p,
              avatar_url: p.avatar_url || p.photo_url || null,
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
        } else if (error) {
          console.warn("Supabase fetch returned error, using fallback:", error);
        }
      } catch (err) {
        console.error("Supabase query error:", err);
      }
    }

    if (list.length === 0) {
      list = (MOCK_DATA.players || []).slice();
    }

    // Merge in any incoming Free Agent signups so all recruits immediately show in Community Players
    try {
      let signups = [];
      if (typeof this.getSignups === "function") {
        signups = await this.getSignups();
      }
      const existingTags = new Set(list.map(p => (p.gamertag || "").toLowerCase().trim()));

      (signups || []).forEach(s => {
        const tag = (s.gamertag || "").trim();
        const lowerTag = tag.toLowerCase();
        if (!tag || existingTags.has(lowerTag)) return;

        existingTags.add(lowerTag);
        list.push({
          id: `signup-${s.id}`,
          gamertag: tag,
          discord_name: s.discord_username || s.discord_name || tag,
          activision_id: s.activision_id || `${tag}#0000`,
          role: s.role || "Flex",
          platform: s.platform || "PC",
          region: s.region || "NA East",
          avatar_url: s.avatar_url || s.photo_url || null,
          rank: "1.0",
          skill_rank: "1.0",
          status: "Free Agent",
          kdr: 1.00,
          total_kills: 0,
          total_deaths: 0,
          wins: 0,
          losses: 0,
          team_name: s.team_name || "Free Agent",
          division: "Open Division",
          is_free_agent: !s.team_name || s.team_name.toLowerCase() === "free agent"
        });
      });
    } catch (e) {}

    // Ensure active logged-in user is present in Community Players with their chosen gamertag & avatar (only if they are a combatant, NOT staff/admin)
    try {
      const authUser = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
      if (authUser && !this.isAccountAdmin(authUser)) {
        let playerCard = null;
        try {
          const raw = JSON.parse(localStorage.getItem("frontline_league_player_card"));
          if (raw && (raw._owner_id === authUser.id || (raw._owner_email && raw._owner_email.toLowerCase() === (authUser.email || "").toLowerCase()))) {
            playerCard = raw;
          }
        } catch (_) {}

        const meta = authUser?.user_metadata || {};
        const authTag = (playerCard?.gamertag || meta.gamertag || meta.username || meta.name || "").trim();
        const discordAvatar = playerCard?.avatar || meta.avatar_url || meta.picture || authUser?.avatar_url;

        if (authTag && authTag !== "Operative") {
          const lowerTag = authTag.toLowerCase();
          const match = list.find(p => (p.gamertag || "").toLowerCase().trim() === lowerTag);
          if (match) {
            if (discordAvatar && (!match.avatar_url || match.avatar_url.includes("unsplash.com"))) {
              match.avatar_url = discordAvatar;
            }
            if (playerCard?.activision && !match.activision_id) {
              match.activision_id = playerCard.activision;
            }
          } else {
            list.unshift({
              id: `auth-${authUser?.id || Date.now()}`,
              gamertag: authTag,
              discord_name: meta.discord_name || playerCard?.discord || authTag,
              activision_id: playerCard?.activision || meta.activision_id || `${authTag}#1234567`,
              role: playerCard?.role || meta.role || "Flex",
              platform: playerCard?.platform || meta.platform || "PC",
              region: playerCard?.region || meta.region || "NA East",
              avatar_url: discordAvatar || null,
              rank: "1.0",
              skill_rank: "1.0",
              status: playerCard?.team && playerCard.team !== "Free Agent" ? "Active" : "Free Agent",
              kdr: 1.00,
              total_kills: 0,
              total_deaths: 0,
              wins: 0,
              losses: 0,
              team_name: playerCard?.team || "Free Agent",
              division: playerCard?.division || "Open Division",
              is_free_agent: !playerCard?.team || playerCard.team === "Free Agent"
            });
          }
        }
      }
    } catch (e) {}

    return list;
  },

  // 3. Fetch All VODs / Matches
  async getVODs() {
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("vods")
          .select("*, team1:team1_id(name), team2:team2_id(name)")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase fetch returned error, using fallback:", error);
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

    // Guard: Prevent unlinked admin accounts from registering as free agents
    if (this.shouldBlockAdminCombatant(signupData)) {
      console.log(`[LeagueDB] submitSignup denied: Admin account (${signupData.email || cleanGamertag}) not linked to Discord email.`);
      return {
        success: false,
        error: "Staff administrator accounts cannot register as free agents unless linked to your verified Discord email."
      };
    }

    const cleanActivision = signupData.activision_id ? String(signupData.activision_id).trim() : null;
    const cleanDiscord = signupData.discord_username ? String(signupData.discord_username).trim() : cleanGamertag;
    const cleanRole = signupData.role || "Flex";
    const cleanPlatform = signupData.platform || "PC";
    const cleanRegion = signupData.region || "NA East";
    const cleanRegType = signupData.registration_type || "Free Agent";
    const cleanTeamName = signupData.team_name ? String(signupData.team_name).trim() : null;
    const cleanNotes = signupData.notes ? String(signupData.notes).trim() : null;
    const cleanStatus = signupData.status || "Pending";
    const cleanAvatar = signupData.avatar_url || signupData.photo_url || null;
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

    if (cleanAvatar) {
      cleanPayload.avatar_url = cleanAvatar;
    }

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

    // Also sync player dossier across tables & update player card immediately
    try {
      if (typeof this.syncPlayerDossierAcrossTables === "function") {
        await this.syncPlayerDossierAcrossTables({
          userId: signupData.user_id,
          gamertag: cleanGamertag,
          activisionId: cleanActivision,
          role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discordName: cleanDiscord,
          avatarUrl: cleanAvatar,
          status: "Free Agent",
          teamName: signupData.team_name || "Free Agent"
        });
      }
    } catch (_) {}

    try {
      const card = {
        gamertag: cleanGamertag,
        team: signupData.team_name || "Free Agent",
        tag: "AGENT",
        role: cleanRole,
        division: "Open Division",
        activision: cleanActivision || "Unlinked",
        discord: cleanDiscord,
        platform: cleanPlatform,
        region: cleanRegion,
        input: "Controller",
        avatar: cleanAvatar || "",
        contract: "UNASSIGNED FREE AGENT"
      };
      localStorage.setItem("frontline_league_player_card", JSON.stringify(card));
    } catch (_) {}

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
    const div = teamData.division || 'div-1';
    // Persist division locally so it's always remembered regardless of backend schema
    try {
      const divMap = JSON.parse(localStorage.getItem('frontline_teams_division_map') || '{}');
      if (teamData.name) divMap[teamData.name.toLowerCase().trim()] = div;
      localStorage.setItem('frontline_teams_division_map', JSON.stringify(divMap));
    } catch(e) {}

    if (dbClient) {
      try {
        const payload = { ...teamData };
        let { data, error } = await dbClient
          .from("teams")
          .insert([payload])
          .select();
        
        // If Postgres column 'division' does not exist in schema, retry without it
        if (error && error.message && error.message.toLowerCase().includes("division")) {
          delete payload.division;
          const retryRes = await dbClient.from("teams").insert([payload]).select();
          data = retryRes.data;
          error = retryRes.error;
        }

        if (error) throw error;
        if (data && data[0]) {
          try {
            const divMap = JSON.parse(localStorage.getItem('frontline_teams_division_map') || '{}');
            divMap[data[0].id] = div;
            if (data[0].name) divMap[data[0].name.toLowerCase().trim()] = div;
            localStorage.setItem('frontline_teams_division_map', JSON.stringify(divMap));
          } catch(e) {}
          return { success: true, data: { ...data[0], division: div } };
        }
      } catch (err) {
        console.error("Supabase createTeam error:", err);
        return { success: false, error: err.message || err };
      }
    }
    // Fallback in-memory
    const newId = Date.now();
    const mockTeam = { id: newId, ...teamData, division: div };
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

  // Admin: Batch Commit Player Map Stats (Used by AI Scoreboard Scanner)
  async addPlayerMapStatsBatch(statsArray) {
    if (!Array.isArray(statsArray) || statsArray.length === 0) {
      return { success: false, error: "No player stats provided." };
    }
    const inserted = [];
    const errors = [];
    const playerIdsToSync = new Set();

    for (const stat of statsArray) {
      try {
        const res = await this.addPlayerMapStat(stat);
        if (res.success) {
          inserted.push(res.data);
          if (stat.player_id) playerIdsToSync.add(Number(stat.player_id));
        } else {
          errors.push(res.error || "Failed stat insert");
        }
      } catch (err) {
        errors.push(err.message || err);
      }
    }

    // Ensure all players are synced
    for (const pid of playerIdsToSync) {
      try {
        await this.syncPlayerTotals(pid);
      } catch (e) {}
    }

    return {
      success: inserted.length > 0,
      insertedCount: inserted.length,
      inserted,
      errors: errors.length > 0 ? errors : null
    };
  },

  // Admin: Record Team Map Outcome (Wins/Losses per Map & Mode in team_map_records)
  async recordTeamMapStat(teamId, mapName, gameMode, result = "W", recentScore = "") {
    if (!teamId) return { success: false, error: "Team ID is required" };
    const isWin = String(result).toUpperCase() === "W";

    if (dbClient) {
      try {
        const { data: existing } = await dbClient
          .from("team_map_records")
          .select("*")
          .eq("team_id", teamId)
          .ilike("map_name", mapName.trim())
          .ilike("game_mode", gameMode.trim())
          .maybeSingle();

        if (existing) {
          const newWins = (existing.wins || 0) + (isWin ? 1 : 0);
          const newLosses = (existing.losses || 0) + (isWin ? 0 : 1);
          const total = newWins + newLosses;
          const winRate = total > 0 ? Math.round((newWins / total) * 100) : 0;
          const streak = isWin ? "1W" : "1L";

          const { data, error } = await dbClient
            .from("team_map_records")
            .update({
              wins: newWins,
              losses: newLosses,
              win_rate: winRate,
              streak,
              recent_score: recentScore || existing.recent_score,
              recent_result: isWin ? "W" : "L"
            })
            .eq("id", existing.id)
            .select();
          return { success: !error, data: data?.[0] };
        } else {
          const { data, error } = await dbClient
            .from("team_map_records")
            .insert([{
              team_id: teamId,
              map_name: mapName.trim(),
              game_mode: gameMode.trim(),
              wins: isWin ? 1 : 0,
              losses: isWin ? 0 : 1,
              win_rate: isWin ? 100 : 0,
              streak: isWin ? "1W" : "1L",
              recent_score: recentScore || null,
              recent_result: isWin ? "W" : "L"
            }])
            .select();
          return { success: !error, data: data?.[0] };
        }
      } catch (err) {
        console.warn("Supabase recordTeamMapStat warning:", err);
      }
    }

    // Local storage fallback
    try {
      const key = "frontline_team_map_records_" + teamId;
      let list = JSON.parse(localStorage.getItem(key)) || [];
      const idx = list.findIndex(m => m.map_name.toLowerCase() === mapName.toLowerCase() && m.game_mode.toLowerCase() === gameMode.toLowerCase());
      if (idx !== -1) {
        list[idx].wins = (list[idx].wins || 0) + (isWin ? 1 : 0);
        list[idx].losses = (list[idx].losses || 0) + (isWin ? 0 : 1);
        const tot = list[idx].wins + list[idx].losses;
        list[idx].win_rate = Math.round((list[idx].wins / tot) * 100);
        list[idx].recent_score = recentScore;
        list[idx].recent_result = isWin ? "W" : "L";
      } else {
        list.push({
          id: Date.now(),
          team_id: teamId,
          map_name: mapName,
          game_mode: gameMode,
          wins: isWin ? 1 : 0,
          losses: isWin ? 0 : 1,
          win_rate: isWin ? 100 : 0,
          recent_score: recentScore,
          recent_result: isWin ? "W" : "L"
        });
      }
      localStorage.setItem(key, JSON.stringify(list));
      return { success: true, mock: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
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

  // Admin: Approve & Enlist All Pending Signups in Batch
  async approveAndEnlistAllSignups() {
    try {
      const signups = await this.getSignups();
      if (!signups || signups.length === 0) {
        return { success: true, count: 0, results: [] };
      }

      let teams = [];
      try {
        teams = await this.getTeams();
      } catch (_) {}

      const results = [];
      let successCount = 0;

      for (const s of signups) {
        let teamId = null;
        if (s.team_name && teams && teams.length > 0) {
          const found = teams.find(t =>
            (t.name && t.name.toLowerCase() === s.team_name.toLowerCase()) ||
            (t.tag && t.tag.toLowerCase() === s.team_name.toLowerCase())
          );
          if (found) teamId = found.id;
        }

        const res = await this.approveAndEnlistSignup(s.id, {
          gamertag: s.gamertag,
          role: s.role || "Flex",
          activision_id: s.activision_id || null,
          team_id: teamId,
          kdr: 1.00
        });

        if (res.success) {
          successCount++;
        }
        results.push({ id: s.id, gamertag: s.gamertag, success: res.success });
      }

      return {
        success: true,
        count: successCount,
        total: signups.length,
        results
      };
    } catch (err) {
      console.error("Error in approveAndEnlistAllSignups:", err);
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
  _getStoredAnnouncements() {
    try {
      const stored = localStorage.getItem("frontline_announcements");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  },

  _saveStoredAnnouncements(list) {
    try {
      if (Array.isArray(list)) {
        localStorage.setItem("frontline_announcements", JSON.stringify(list));
      }
    } catch (e) {}
  },

  _notifyAnnouncementChange(ann) {
    try {
      if (typeof window !== "undefined") {
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel("frontline_announcements_channel");
          bc.postMessage({ type: "ANNOUNCEMENT_CHANGED", data: ann, timestamp: Date.now() });
          bc.close();
        }
        localStorage.setItem("frontline_announcements_last_update", Date.now().toString());
        window.dispatchEvent(new CustomEvent("frontline_announcement_changed", { detail: ann }));
      }
    } catch (_) {}
  },

  async getAnnouncements(includeInactive = false, includeScheduled = false) {
    let list = null;
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
        if (!error && data && data.length > 0) {
          list = data;
          this._saveStoredAnnouncements(data);
        } else if (error) {
          console.warn("Supabase league_announcements returned error, falling back to local:", error.message || error);
        }
      } catch (err) {
        console.warn("Supabase getAnnouncements query error, using local fallback:", err);
      }
    }

    if (!list || list.length === 0) {
      list = this._getStoredAnnouncements();
    }
    if (!list || list.length === 0) {
      list = Array.isArray(MOCK_DATA.announcements) ? [...MOCK_DATA.announcements] : [];
      this._saveStoredAnnouncements(list);
    }

    if (!includeInactive) {
      list = list.filter(a => a.is_active !== false);
    }

    // Filter out future scheduled announcements unless explicitly requested (e.g. by admin console)
    if (!includeScheduled) {
      const now = new Date();
      list = list.filter(a => {
        if (!a.scheduled_for) return true;
        try {
          return new Date(a.scheduled_for) <= now;
        } catch (_) {
          return true;
        }
      });
    }

    // Sort pinned first, then newest
    return list.sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  },

  async getLatestAnnouncement(includeScheduled = false) {
    const list = await this.getAnnouncements(false, includeScheduled);
    return list && list.length > 0 ? list[0] : null;
  },

  async createAnnouncement(announcementData) {
    const record = {
      title: announcementData.title,
      message: announcementData.message,
      tag: announcementData.tag || "Official Update",
      tag_color: announcementData.tag_color || "lime",
      image_url: announcementData.image_url || null,
      image_fit: announcementData.image_fit || "contain",
      link_url: announcementData.link_url || null,
      link_text: announcementData.link_text || null,
      scheduled_for: announcementData.scheduled_for || null,
      is_active: announcementData.is_active !== undefined ? !!announcementData.is_active : true,
      pinned: announcementData.pinned !== undefined ? !!announcementData.pinned : false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (dbClient) {
      try {
        let insertRecord = { ...record };
        let { data, error } = await dbClient
          .from("league_announcements")
          .insert([insertRecord])
          .select();

        // If schema cache lacks optional columns (image_fit, scheduled_for), retry with fallback payload
        if (error && (error.code === "PGRST204" || (error.message && error.message.includes("column")))) {
          console.warn("Supabase missing optional announcement column, auto-retrying insert...", error.message || error.code);
          if (error.message?.includes("scheduled_for")) delete insertRecord.scheduled_for;
          if (error.message?.includes("image_fit")) delete insertRecord.image_fit;
          if (error.code === "PGRST204") {
            delete insertRecord.scheduled_for;
            delete insertRecord.image_fit;
          }
          const retry = await dbClient
            .from("league_announcements")
            .insert([insertRecord])
            .select();
          data = retry.data;
          error = retry.error;
        }

        if (error) throw error;
        if (data && data.length > 0) {
          const stored = this._getStoredAnnouncements() || [];
          stored.unshift(data[0]);
          this._saveStoredAnnouncements(stored);
          this._notifyAnnouncementChange(data[0]);
          return { success: true, data: data[0] };
        }
      } catch (err) {
        console.warn("Supabase createAnnouncement error, falling back to local storage:", err);
      }
    }

    // Fallback Local & Mock Storage
    record.id = Date.now();
    if (!MOCK_DATA.announcements) MOCK_DATA.announcements = [];
    MOCK_DATA.announcements.unshift(record);
    const stored = this._getStoredAnnouncements() || [...MOCK_DATA.announcements];
    if (!stored.some(a => String(a.id) === String(record.id))) {
      stored.unshift(record);
    }
    this._saveStoredAnnouncements(stored);
    this._notifyAnnouncementChange(record);
    return { success: true, data: record, mock: true };
  },

  async updateAnnouncement(id, updates) {
    const cleanUpdates = { ...updates, updated_at: new Date().toISOString() };
    if (cleanUpdates.image_url === undefined && updates.image_url !== undefined) {
      cleanUpdates.image_url = updates.image_url;
    }
    if (cleanUpdates.image_fit === undefined && updates.image_fit !== undefined) {
      cleanUpdates.image_fit = updates.image_fit;
    }
    if (cleanUpdates.scheduled_for === undefined && updates.scheduled_for !== undefined) {
      cleanUpdates.scheduled_for = updates.scheduled_for;
    }

    if (dbClient) {
      try {
        let updatePayload = { ...cleanUpdates };
        let { data, error } = await dbClient
          .from("league_announcements")
          .update(updatePayload)
          .eq("id", id)
          .select();

        // If schema cache lacks optional columns, retry with fallback payload
        if (error && (error.code === "PGRST204" || (error.message && error.message.includes("column")))) {
          console.warn("Supabase missing optional column on update, auto-retrying update...", error.message || error.code);
          if (error.message?.includes("scheduled_for")) delete updatePayload.scheduled_for;
          if (error.message?.includes("image_fit")) delete updatePayload.image_fit;
          if (error.code === "PGRST204") {
            delete updatePayload.scheduled_for;
            delete updatePayload.image_fit;
          }
          const retry = await dbClient
            .from("league_announcements")
            .update(updatePayload)
            .eq("id", id)
            .select();
          data = retry.data;
          error = retry.error;
        }

        if (error) throw error;
        if (data && data.length > 0) {
          const stored = this._getStoredAnnouncements() || [];
          const idx = stored.findIndex(a => String(a.id) === String(id));
          if (idx !== -1) stored[idx] = { ...stored[idx], ...cleanUpdates };
          this._saveStoredAnnouncements(stored);
          this._notifyAnnouncementChange(data[0]);
          return { success: true, data: data[0] };
        }
      } catch (err) {
        console.warn("Supabase updateAnnouncement error, updating in local storage:", err);
      }
    }

    if (MOCK_DATA.announcements) {
      const idx = MOCK_DATA.announcements.findIndex(a => String(a.id) === String(id));
      if (idx !== -1) {
        MOCK_DATA.announcements[idx] = { ...MOCK_DATA.announcements[idx], ...cleanUpdates };
      }
    }
    const stored = this._getStoredAnnouncements() || [];
    const idx = stored.findIndex(a => String(a.id) === String(id));
    if (idx !== -1) {
      stored[idx] = { ...stored[idx], ...cleanUpdates };
      this._saveStoredAnnouncements(stored);
      this._notifyAnnouncementChange(stored[idx]);
      return { success: true, data: stored[idx], mock: true };
    }
    this._notifyAnnouncementChange(cleanUpdates);
    return { success: true, data: cleanUpdates, mock: true };
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
      } catch (err) {
        console.warn("Supabase deleteAnnouncement error, deleting from local storage:", err);
      }
    }

    if (MOCK_DATA.announcements) {
      MOCK_DATA.announcements = MOCK_DATA.announcements.filter(a => String(a.id) !== String(id));
    }
    const stored = this._getStoredAnnouncements() || [];
    const filtered = stored.filter(a => String(a.id) !== String(id));
    this._saveStoredAnnouncements(filtered);
    this._notifyAnnouncementChange({ id, deleted: true });

    return { success: true, id: id };
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
  // PLATFORM SWITCHER & COMMISSIONER VISIBILITY CONTROLS
  // ==============================================================================
  DEFAULT_SWITCHER_SETTINGS: {
    switcher_visible: true,
    show_league: true,
    show_arena: true,
    show_tournaments: true,
    tournaments_page_enabled: true
  },

  async getPlatformSwitcherSettings() {
    let settings = { ...this.DEFAULT_SWITCHER_SETTINGS };
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .select("*")
          .eq("id", "platform_switcher")
          .maybeSingle();

        if (!error && data && data.status_text) {
          try {
            const parsed = JSON.parse(data.status_text);
            settings = { ...settings, ...parsed };
            try {
              localStorage.setItem("frontline_platform_switcher_settings", JSON.stringify(settings));
            } catch (e) {}
            return settings;
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Supabase platform_switcher query notice:", err);
      }
    }

    try {
      const local = localStorage.getItem("frontline_platform_switcher_settings");
      if (local) {
        settings = { ...settings, ...JSON.parse(local) };
      }
    } catch (e) {}

    return settings;
  },

  async savePlatformSwitcherSettings(newSettings) {
    const current = await this.getPlatformSwitcherSettings();
    const merged = { ...current, ...newSettings };

    try {
      localStorage.setItem("frontline_platform_switcher_settings", JSON.stringify(merged));
    } catch (e) {}

    if (dbClient) {
      try {
        await dbClient.from("league_settings").upsert({
          id: "platform_switcher",
          status_state: merged.switcher_visible ? "active" : "hidden",
          status_text: JSON.stringify(merged),
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });
      } catch (err) {
        console.warn("Supabase savePlatformSwitcherSettings error:", err);
      }
    }

    this.applyPlatformSwitcherSettings(merged);
    window.dispatchEvent(new CustomEvent("frontline_switcher_settings_changed", { detail: merged }));
    return { success: true, settings: merged };
  },

  applyPlatformSwitcherSettings(settings) {
    if (!settings || typeof document === "undefined") return;
    const s = { ...this.DEFAULT_SWITCHER_SETTINGS, ...settings };

    const docEl = document.documentElement;
    if (docEl) {
      docEl.classList.toggle("hide-platform-switcher", !s.switcher_visible);
      docEl.classList.toggle("hide-mode-league", s.show_league === false);
      docEl.classList.toggle("hide-mode-arena", s.show_arena === false);
      docEl.classList.toggle("hide-mode-tournaments", s.show_tournaments === false);
    }

    // Direct DOM manipulation across all pills
    const pills = document.querySelectorAll(".mode-switch-pill");
    pills.forEach(pill => {
      // Exclude admin live preview simulator
      if (pill.closest && pill.closest("#admin-switcher-live-preview")) return;
      if (!s.switcher_visible || (!s.show_league && !s.show_arena && !s.show_tournaments)) {
        pill.style.display = "none";
        return;
      } else {
        pill.style.display = "";
      }

      // Check for league button
      const leagueBtn = pill.querySelector('[data-mode="league"]') || pill.querySelector('a[href*="/home"], a[href*="index.html"], a[href*="players"], a[href*="brackets"]');
      if (leagueBtn) {
        leagueBtn.setAttribute("data-mode", "league");
        leagueBtn.style.display = (s.show_league !== false) ? "" : "none";
      }

      // Check for arena button
      const arenaBtn = pill.querySelector('[data-mode="arena"]') || pill.querySelector('a[href*="/arena"], a[href*="arena.html"], a[href*="ladders"]');
      if (arenaBtn) {
        arenaBtn.setAttribute("data-mode", "arena");
        arenaBtn.style.display = (s.show_arena !== false) ? "" : "none";
      }

      // Check for tournaments button (or inject if missing)
      let tournBtn = pill.querySelector('[data-mode="tournaments"]') || pill.querySelector('a[href*="tournaments"]');
      if (!tournBtn) {
        tournBtn = document.createElement("a");
        tournBtn.href = "/tournaments/";
        tournBtn.className = "mode-switch-btn" + (window.location.pathname.includes("tournaments") ? " active-tournaments" : "");
        tournBtn.setAttribute("data-mode", "tournaments");
        tournBtn.setAttribute("title", "Frontline Tournaments Hub");
        tournBtn.innerHTML = `<span>🏆</span> <span>Tournaments</span>`;
        pill.appendChild(tournBtn);
      } else {
        tournBtn.setAttribute("data-mode", "tournaments");
      }
      tournBtn.style.display = (s.show_tournaments !== false) ? "" : "none";
    });
  },

  initPlatformSwitcher() {
    if (typeof window === "undefined" || !window.document) return;
    try {
      const local = localStorage.getItem("frontline_platform_switcher_settings");
      const initSettings = local ? JSON.parse(local) : this.DEFAULT_SWITCHER_SETTINGS;
      this.applyPlatformSwitcherSettings(initSettings);
    } catch (e) {}

    // Cloud fetch in background
    setTimeout(async () => {
      try {
        const cloudSettings = await this.getPlatformSwitcherSettings();
        this.applyPlatformSwitcherSettings(cloudSettings);
      } catch (e) {}
    }, 100);
  },

  // ==============================================================================
  // FRONTLINE TOURNAMENTS HUB SYSTEM
  // ==============================================================================
  DEFAULT_TOURNAMENTS: [
    {
      id: "tourney_major_1",
      title: "Frontline Spring Championship Major",
      format: "4v4 CDL Variant",
      bracket_type: "Double Elimination",
      prize_pool: "$2,500 USD",
      entry_fee: "Free Entry",
      max_teams: 16,
      registered_teams: 14,
      start_date: "2026-10-24",
      start_time: "6:00 PM EST",
      status: "Registration Open",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      registration_url: "https://discord.gg/frontlinecodleague",
      bracket_url: "/brackets/",
      description: "Official 4v4 CDL Variant Premier Championship. Best of 5 series on official maps. Top squads battle live on broadcast.",
      rules_notes: "CDL V4 Competitive Rulebook applies. Map vetoes in match room. Dedicated host server."
    },
    {
      id: "tourney_prime_snd",
      title: "Saturday Night SnD Prime Cup",
      format: "2v2 Search & Destroy",
      bracket_type: "Single Elimination",
      prize_pool: "$750 USD",
      entry_fee: "Free Entry",
      max_teams: 32,
      registered_teams: 28,
      start_date: "2026-10-17",
      start_time: "8:00 PM EST",
      status: "Registration Open",
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
      registration_url: "https://discord.gg/frontlinecodleague",
      bracket_url: "",
      description: "High-octane 2v2 Search & Destroy prime tournament. First to 6 rounds wins. Knife for first blood / side choice.",
      rules_notes: "SnD ruleset. Hardcore & Radar disabled. No snipers in 2v2."
    },
    {
      id: "tourney_radar_1v1",
      title: "Radar Always On 1v1 Gunfight Showdown",
      format: "1v1 Radar",
      bracket_type: "Double Elimination",
      prize_pool: "$500 USD",
      entry_fee: "Free Entry",
      max_teams: 16,
      registered_teams: 16,
      start_date: "2026-10-18",
      start_time: "7:00 PM EST",
      status: "Live",
      image_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
      registration_url: "",
      bracket_url: "",
      description: "Constant UAV radar ping gunfight series. Test raw gunskill, pre-aim speed, and centering under live radar conditions.",
      rules_notes: "Standard CDL weapon restrictions apply. First to 15 kills wins."
    },
    {
      id: "tourney_challengers_cup",
      title: "Division 2 Challengers Qualifier Cup",
      format: "4v4 CDL Variant",
      bracket_type: "Double Elimination",
      prize_pool: "$1,000 USD",
      entry_fee: "Free Entry",
      max_teams: 16,
      registered_teams: 8,
      start_date: "2026-10-31",
      start_time: "5:00 PM EST",
      status: "Upcoming",
      image_url: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
      registration_url: "https://discord.gg/frontlinecodleague",
      bracket_url: "",
      description: "Path to Pro qualification cup for Division 2 Challengers squads seeking promotion seeds for the Premier division.",
      rules_notes: "All squads must have active community roster on Frontline League."
    }
  ],

  async getTournaments(filters = {}) {
    let list = [];

    // 1. Try Supabase dedicated table 'tournaments' if created
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("tournaments")
          .select("*")
          .order("start_date", { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          list = data;
          try {
            localStorage.setItem("frontline_tournaments_data", JSON.stringify(list));
          } catch (e) {}
        }
      } catch (err) {
        // Table may not exist yet, fallback below
      }
    }

    // 2. Try Supabase league_settings row 'tournaments_registry'
    if ((!list || list.length === 0) && dbClient) {
      try {
        const { data, error } = await dbClient
          .from("league_settings")
          .select("*")
          .eq("id", "tournaments_registry")
          .maybeSingle();

        if (!error && data && data.status_text) {
          try {
            const parsed = JSON.parse(data.status_text);
            if (Array.isArray(parsed) && parsed.length > 0) {
              list = parsed;
              try {
                localStorage.setItem("frontline_tournaments_data", JSON.stringify(list));
              } catch (e) {}
            }
          } catch (e) {}
        }
      } catch (err) {}
    }

    // 3. Fallback to localStorage
    if (!list || list.length === 0) {
      try {
        const local = localStorage.getItem("frontline_tournaments_data");
        if (local) {
          list = JSON.parse(local);
        }
      } catch (e) {}
    }

    // 4. Default mock fallback
    if (!list || list.length === 0) {
      list = [...this.DEFAULT_TOURNAMENTS];
      try {
        localStorage.setItem("frontline_tournaments_data", JSON.stringify(list));
      } catch (e) {}
    }

    // Filter in-memory if requested
    if (filters) {
      if (filters.format && filters.format !== "all") {
        list = list.filter(t => t.format && t.format.toLowerCase().includes(filters.format.toLowerCase()));
      }
      if (filters.status && filters.status !== "all") {
        list = list.filter(t => t.status && t.status.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        list = list.filter(t =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.format && t.format.toLowerCase().includes(q)) ||
          (t.prize_pool && t.prize_pool.toLowerCase().includes(q))
        );
      }
    }

    return list;
  },

  async saveTournament(tournamentData) {
    if (!tournamentData || !tournamentData.title) {
      return { success: false, error: "Tournament title is required." };
    }

    const currentList = await this.getTournaments();
    const tourneyId = tournamentData.id || ("t_" + Date.now());
    const tourneyItem = {
      ...tournamentData,
      id: tourneyId,
      updated_at: new Date().toISOString()
    };

    const existingIdx = currentList.findIndex(t => String(t.id) === String(tourneyId));
    if (existingIdx !== -1) {
      currentList[existingIdx] = tourneyItem;
    } else {
      currentList.unshift(tourneyItem);
    }

    // Save to localStorage
    try {
      localStorage.setItem("frontline_tournaments_data", JSON.stringify(currentList));
    } catch (e) {}

    // Save to Supabase (upsert into tournaments or league_settings)
    if (dbClient) {
      try {
        // Try direct tournaments table first
        const { error: directErr } = await dbClient.from("tournaments").upsert({
          id: tourneyItem.id,
          title: tourneyItem.title,
          format: tourneyItem.format,
          bracket_type: tourneyItem.bracket_type,
          prize_pool: tourneyItem.prize_pool,
          entry_fee: tourneyItem.entry_fee,
          max_teams: Number(tourneyItem.max_teams) || 16,
          registered_teams: Number(tourneyItem.registered_teams) || 0,
          start_date: tourneyItem.start_date,
          start_time: tourneyItem.start_time,
          status: tourneyItem.status,
          image_url: tourneyItem.image_url,
          registration_url: tourneyItem.registration_url,
          bracket_url: tourneyItem.bracket_url,
          description: tourneyItem.description,
          rules_notes: tourneyItem.rules_notes,
          updated_at: new Date().toISOString()
        });

        if (directErr) {
          // Fallback to league_settings JSON registry
          await dbClient.from("league_settings").upsert({
            id: "tournaments_registry",
            status_state: "active",
            status_text: JSON.stringify(currentList),
            updated_at: new Date().toISOString()
          }, { onConflict: "id" });
        }
      } catch (dbErr) {
        // Fallback to league_settings
        try {
          await dbClient.from("league_settings").upsert({
            id: "tournaments_registry",
            status_state: "active",
            status_text: JSON.stringify(currentList),
            updated_at: new Date().toISOString()
          }, { onConflict: "id" });
        } catch (e) {}
      }
    }

    window.dispatchEvent(new CustomEvent("frontline_tournaments_updated", { detail: tourneyItem }));
    return { success: true, tournament: tourneyItem };
  },

  async deleteTournament(tournamentId) {
    if (!tournamentId) return { success: false, error: "Tournament ID required." };
    const currentList = await this.getTournaments();
    const filtered = currentList.filter(t => String(t.id) !== String(tournamentId));

    try {
      localStorage.setItem("frontline_tournaments_data", JSON.stringify(filtered));
    } catch (e) {}

    if (dbClient) {
      try {
        await dbClient.from("tournaments").delete().eq("id", tournamentId);
      } catch (e) {}
      try {
        await dbClient.from("league_settings").upsert({
          id: "tournaments_registry",
          status_state: "active",
          status_text: JSON.stringify(filtered),
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });
      } catch (e) {}
    }

    window.dispatchEvent(new CustomEvent("frontline_tournaments_updated", { detail: { id: tournamentId, deleted: true } }));
    return { success: true };
  },

  async updateTournamentStatus(tournamentId, newStatus) {
    const list = await this.getTournaments();
    const item = list.find(t => String(t.id) === String(tournamentId));
    if (!item) return { success: false, error: "Tournament not found" };
    item.status = newStatus;
    return await this.saveTournament(item);
  },

  async registerSquadForTournament(tournamentId, squadData) {
    const list = await this.getTournaments();
    const item = list.find(t => String(t.id) === String(tournamentId));
    if (!item) return { success: false, error: "Tournament not found" };

    // Increment registered teams count on tournament
    item.registered_teams = (Number(item.registered_teams) || 0) + 1;
    await this.saveTournament(item);

    const regId = "reg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const regRecord = {
      id: regId,
      tournament_id: String(tournamentId),
      tournament_title: item.title || "Frontline Tournament",
      team_name: String(squadData.team_name || "Squad").trim(),
      captain_gamertag: String(squadData.captain_gamertag || "Captain").trim(),
      captain_discord: String(squadData.captain_discord || "").trim(),
      captain_activision_id: String(squadData.captain_activision_id || "").trim(),
      roster: Array.isArray(squadData.roster) ? squadData.roster : [squadData.roster].filter(Boolean),
      roster_text: squadData.roster_text || (Array.isArray(squadData.roster) ? squadData.roster.join(", ") : String(squadData.roster || "")),
      status: "registered",
      registered_at: squadData.registered_at || new Date().toISOString()
    };

    let savedToDatabase = false;

    // 1. Persist directly to Supabase / Database Client if configured
    if (dbClient) {
      try {
        const { error } = await dbClient
          .from("tournament_registrations")
          .insert([regRecord]);
        if (!error) {
          savedToDatabase = true;
        } else {
          console.warn("Notice inserting to tournament_registrations:", error.message || error);
        }
      } catch (err) {
        console.warn("Database client insert notice:", err.message || err);
      }
    }

    // 2. Direct Railway REST fallback if running on Node backend
    if (!savedToDatabase && typeof fetch !== "undefined") {
      try {
        const res = await fetch("/api/data/tournament_registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regRecord)
        });
        if (res.ok) {
          savedToDatabase = true;
        }
      } catch (e) {}
    }

    // 3. Persist registration record to localStorage as backup/cache
    try {
      const regKey = "frontline_tournament_registrations";
      const regs = JSON.parse(localStorage.getItem(regKey)) || [];
      regs.unshift(regRecord);
      localStorage.setItem(regKey, JSON.stringify(regs));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent("frontline_tournament_registered", { 
      detail: { tournamentId, registration: regRecord, savedToDatabase } 
    }));

    return { success: true, tournament: item, registration: regRecord, savedToDatabase };
  },

  async getTournamentRegistrations(tournamentId = null) {
    let list = [];

    // 1. Try Database Client first
    if (dbClient) {
      try {
        let query = dbClient
          .from("tournament_registrations")
          .select("*")
          .order("registered_at", { ascending: false });
        if (tournamentId) {
          query = query.eq("tournament_id", String(tournamentId));
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          list = data;
        }
      } catch (err) {}
    }

    // 2. Try Railway API if available
    if ((!list || list.length === 0) && typeof fetch !== "undefined") {
      try {
        const filters = tournamentId ? [{ col: "tournament_id", op: "eq", val: String(tournamentId) }] : [];
        const res = await fetch("/api/data/tournament_registrations?q=" + encodeURIComponent(
          JSON.stringify({ filters, orderBy: [{ col: "registered_at", ascending: false }] })
        ));
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            list = json.data;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback to localStorage
    if (!list || list.length === 0) {
      try {
        const local = JSON.parse(localStorage.getItem("frontline_tournament_registrations")) || [];
        list = tournamentId ? local.filter(r => String(r.tournament_id) === String(tournamentId)) : local;
      } catch (e) {}
    }

    return list;
  },

  async deleteTournamentRegistration(registrationId, tournamentId = null) {
    if (!registrationId) return { success: false, error: "Registration ID required" };

    // 1. Delete from database
    if (dbClient) {
      try {
        await dbClient.from("tournament_registrations").delete().eq("id", registrationId);
      } catch (e) {}
    }
    if (typeof fetch !== "undefined") {
      try {
        await fetch("/api/data/tournament_registrations", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters: [{ col: "id", op: "eq", val: registrationId }] })
        });
      } catch (e) {}
    }

    // 2. Update localStorage
    try {
      const regKey = "frontline_tournament_registrations";
      const regs = JSON.parse(localStorage.getItem(regKey)) || [];
      const filtered = regs.filter(r => String(r.id) !== String(registrationId));
      localStorage.setItem(regKey, JSON.stringify(filtered));
    } catch (e) {}

    // 3. Decrement tournament registered_teams count if tournamentId provided
    if (tournamentId) {
      const tourneys = await this.getTournaments();
      const t = tourneys.find(item => String(item.id) === String(tournamentId));
      if (t && Number(t.registered_teams) > 0) {
        t.registered_teams = Number(t.registered_teams) - 1;
        await this.saveTournament(t);
      }
    }

    return { success: true };
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

    // Filter free agents from players table (skipping unlinked admin accounts)
    const faPlayers = (players || []).filter(p => {
      if (this.shouldBlockAdminCombatant(p)) return false;
      const team = (p.teams?.name || p.team_name || "").toLowerCase();
      const status = (p.status || "").toLowerCase();
      return !p.teams || team === "free agent" || team === "unassigned" || status === "free agent";
    }).map(p => ({
      ...p,
      avatar_url: p.avatar_url || p.photo_url || null,
      source: "player",
      isDrafted: false
    }));

    // Filter free agents from signups table (skipping unlinked admin accounts)
    const faSignups = (signups || []).filter(s => {
      if (this.shouldBlockAdminCombatant(s)) return false;
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
      avatar_url: s.avatar_url || s.photo_url || null,
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
    let merged = [];

    [...faPlayers, ...faSignups].forEach(p => {
      const lower = (p.gamertag || "").toLowerCase().trim();
      if (!lower || seenTags.has(lower)) return;
      seenTags.add(lower);
      merged.push(p);
    });

    // Ensure active logged-in Discord user is automatically represented in Free Agents (unless unlinked admin)
    try {
      const authUser = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
      if (authUser && !this.shouldBlockAdminCombatant(authUser)) {
        const meta = authUser?.user_metadata || {};
        const authTag = meta.gamertag || meta.username || meta.name;
        const discordAvatar = meta.avatar_url || meta.picture || authUser?.avatar_url;
        if (authTag) {
          const lower = authTag.toLowerCase().trim();
          const existing = merged.find(p => (p.gamertag || "").toLowerCase().trim() === lower);
          if (existing) {
            if (!existing.avatar_url && discordAvatar) {
              existing.avatar_url = discordAvatar;
            }
          } else {
            merged.unshift({
              id: `auth-${authUser.id || Date.now()}`,
              gamertag: authTag,
              discord_name: meta.discord_name || authTag,
              activision_id: meta.activision_id || `${authTag}#1234567`,
              role: meta.role || meta.tactical_role || "Flex",
              platform: meta.platform || "PC",
              region: meta.region || "NA East",
              avatar_url: discordAvatar || null,
              notes: "Verified League Member",
              rank: "1.0",
              status: "Free Agent",
              kdr: null,
              total_kills: 0,
              total_deaths: 0,
              team_name: "Free Agent",
              source: "auth",
              isDrafted: false
            });
          }
        }
      }
    } catch(e) {}

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

    // Final guard: exclude any unlinked admin accounts
    return merged.filter(p => !this.shouldBlockAdminCombatant(p));
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
      player_avatar: pickData.player_avatar || null,
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

    // Persist draft pick assignment to players table and local player card
    try {
      if (dbClient) {
        const { data: teamRows } = await dbClient.from("teams").select("id").ilike("name", newPick.team_name).limit(1);
        const teamId = teamRows && teamRows.length > 0 ? teamRows[0].id : null;
        await dbClient
          .from("players")
          .update({
            status: "Active",
            team_id: teamId,
            team_name: newPick.team_name
          })
          .ilike("gamertag", newPick.player_gamertag);
      }
    } catch(dbErr) {
      console.warn("Draft pick player table sync notice:", dbErr);
    }

    try {
      const card = JSON.parse(localStorage.getItem("frontline_league_player_card")) || {};
      if (card.gamertag && card.gamertag.toLowerCase() === (newPick.player_gamertag || "").toLowerCase()) {
        card.team = newPick.team_name;
        card.tag = newPick.team_tag || "CDL";
        card.contract = `SIGNED DRAFT PICK (RD ${newPick.round} · #${newPick.pick})`;
        localStorage.setItem("frontline_league_player_card", JSON.stringify(card));
      }
    } catch(e) {}

    // Broadcast pick to league_announcements as an official update!
    try {
      const divLabel = divKey === "div-2" ? "Division 2" : (divKey === "div-3" ? "Division 3" : "Division 1");
      const autoBadge = isAuto ? " [AUTO-DRAFT: CLOCK EXPIRED]" : "";
      await this.addAnnouncement({
        title: `DRAFT PICK: [${divLabel}] Round ${newPick.round} Pick #${newPick.pick} - ${newPick.team_name}${autoBadge}`,
        message: `${newPick.team_name} selects ${newPick.player_gamertag} (${newPick.player_role})${isAuto ? ' via automatic system selection' : ''}${newPick.notes ? ` · "${newPick.notes}"` : ""}.`,
        tag: isAuto ? "Auto-Draft" : "Draft Pick",
        tag_color: isAuto ? "amber" : "lime",
        link_url: "/draft/",
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
        link_url: "/schedule/",
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
    if (resultData.winner_id !== undefined && resultData.winner_id !== null && resultData.winner_id !== "") {
      winnerId = resultData.winner_id;
      winnerName = resultData.winner_name || (winnerId == match.team1_id ? match.team1_name : match.team2_name);
    } else if (s1 > s2) {
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

  recordMatchScore(matchId, resultData) {
    return this.recordScheduledMatchResult(matchId, resultData);
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

      // Synchronize active auth user and purge stale non-staff player card
      try {
        const cleanUserEmail = (data.user?.email || email).toLowerCase().trim();
        localStorage.setItem("frontline_league_auth_user", JSON.stringify(data.user));
        localStorage.setItem("frontline_arena_auth_user", JSON.stringify(data.user));
        sessionStorage.setItem("frontline_admin_session", "authorized");
        sessionStorage.setItem("frontline_admin_email", cleanUserEmail);
        localStorage.removeItem("frontline_league_player_card");
        window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: data.user } }));
      } catch (e) {}

      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      return { success: false, error: err.message || "Sign-in error occurred." };
    }
  },

  async signOutAdmin() {
    try {
      sessionStorage.removeItem("frontline_admin_session");
      sessionStorage.removeItem("frontline_admin_email");
      localStorage.removeItem("frontline_league_auth_user");
      localStorage.removeItem("frontline_arena_auth_user");
      localStorage.removeItem("frontline_league_player_card");
      window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: null } }));
    } catch (e) {}
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
  async signUpPlayer(email, password, gamertag = "", activisionId = "", playerRole = "Flex", region = "NA East", platform = "PC") {
    const cleanEmail = (email || "").trim();
    const cleanGamertag = (gamertag || "").trim() || (cleanEmail.includes("@") ? cleanEmail.split("@")[0] : cleanEmail);
    const cleanActivision = (activisionId || "").trim() || `${cleanGamertag}#1234567`;
    const cleanRole = (playerRole || "").trim() || "Flex";
    const cleanRegion = (region || "").trim() || "NA East";
    const cleanPlatform = (platform || "").trim() || "PC";

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
          role: cleanRole,
          tactical_role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discord_name: cleanGamertag,
          profile_completed: true
        }
      };

      try {
        localStorage.setItem("frontline_league_auth_user", JSON.stringify(localUser));
      } catch (e) {}

      // Automatically sync into all tables & caches
      try {
        await this.syncPlayerDossierAcrossTables({
          userId: localUser.id,
          gamertag: cleanGamertag,
          activisionId: cleanActivision,
          role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discordName: cleanGamertag,
          email: cleanEmail
        });
      } catch (syncErr) {
        console.warn("Local sync dossier notice:", syncErr);
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
            role: cleanRole,
            tactical_role: cleanRole,
            region: cleanRegion,
            platform: cleanPlatform,
            discord_name: cleanGamertag,
            profile_completed: true
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        try {
          localStorage.setItem("frontline_league_auth_user", JSON.stringify(data.user));
        } catch (e) {}

        // Automatically sync into all tables & caches
        try {
          await this.syncPlayerDossierAcrossTables({
            userId: data.user.id,
            gamertag: cleanGamertag,
            activisionId: cleanActivision,
            role: cleanRole,
            region: cleanRegion,
            platform: cleanPlatform,
            discordName: cleanGamertag,
            email: cleanEmail
          });
        } catch (syncErr) {
          console.warn("Multi-table sync on signup notice:", syncErr);
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
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const targetRedirect = redirectUrl || (origin + pathname);
    const directOAuthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=discord&redirect_to=${encodeURIComponent(targetRedirect)}`;

    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("frontline_discord_oauth_pending", "true");
    }

    const client = dbClient || window.dbClient || window.supabaseClient;
    if (client && client.auth && typeof client.auth.signInWithOAuth === "function") {
      try {
        const { data, error } = await client.auth.signInWithOAuth({
          provider: "discord",
          options: {
            redirectTo: targetRedirect,
            scopes: "identify email"
          }
        });
        if (!error && data?.url) {
          if (typeof window !== "undefined") {
            window.location.href = data.url;
          }
          return { success: true, url: data.url, data };
        }
      } catch (err) {
        console.warn("[LeagueDB] signInWithOAuth exception, falling back to direct URL:", err);
      }
    }

    if (typeof window !== "undefined") {
      window.location.href = directOAuthUrl;
      return { success: true, url: directOAuthUrl };
    }

    return { success: false, error: "Failed to initiate Discord authentication." };
  },

  async signOutPlayer() {
    try {
      localStorage.removeItem("frontline_league_auth_user");
      localStorage.removeItem("frontline_arena_auth_user");
      localStorage.removeItem("frontline_league_player_card");
      sessionStorage.removeItem("frontline_admin_session");
      sessionStorage.removeItem("frontline_admin_email");
    } catch (e) {}
    if (typeof this.updateLeagueNavProfile === "function") {
      this.updateLeagueNavProfile();
    }
    window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: null } }));
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
  // DISCORD IDENTITY & COMBATANT DOSSIER SYNC
  // ==========================================
  getDiscordIdentity(user) {
    if (!user) return null;
    const meta = user.user_metadata || {};
    const appMeta = user.app_metadata || {};
    const identities = Array.isArray(user.identities) ? user.identities : [];
    const discordIdent = identities.find(i => i.provider === "discord") || null;
    const identData = discordIdent?.identity_data || {};

    const isDiscord = appMeta.provider === "discord" ||
                      (appMeta.providers && appMeta.providers.includes("discord")) ||
                      !!discordIdent ||
                      !!meta.provider_id ||
                      !!meta.discord_username ||
                      !!meta.custom_claims?.global_name;

    const globalName = meta.custom_claims?.global_name || identData.custom_claims?.global_name || meta.full_name || meta.name || identData.full_name || "";
    const handle = meta.user_name || meta.preferred_username || meta.username || meta.discord_username || identData.user_name || identData.username || "";
    const primaryName = globalName || handle || (user.email ? user.email.split("@")[0] : "Operative");
    const handleTag = handle ? `@${handle}` : (globalName ? `@${globalName}` : "");

    // Extract Discord avatar URL from all possible Supabase OAuth locations
    let avatarUrl = "";
    if (meta.avatar_url && !meta.avatar_url.includes("unsplash.com")) {
      avatarUrl = meta.avatar_url;
    } else if (meta.picture && !meta.picture.includes("unsplash.com")) {
      avatarUrl = meta.picture;
    } else if (identData.avatar_url && !identData.avatar_url.includes("unsplash.com")) {
      avatarUrl = identData.avatar_url;
    } else if (identData.picture && !identData.picture.includes("unsplash.com")) {
      avatarUrl = identData.picture;
    }

    const discordId = discordIdent?.id || identData.id || meta.provider_id || meta.sub;
    const avatarHash = identData.avatar || meta.avatar;

    if (!avatarUrl && discordId && avatarHash) {
      const ext = String(avatarHash).startsWith("a_") ? "gif" : "png";
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}?size=256`;
    } else if (!avatarUrl && discordId && isDiscord) {
      try {
        const defaultIndex = Number((BigInt(discordId) >> 22n) % 6n);
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
      } catch (e) {
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/0.png`;
      }
    }

    if (avatarUrl && avatarUrl.includes("cdn.discordapp.com") && !avatarUrl.includes("size=")) {
      avatarUrl += (avatarUrl.includes("?") ? "&" : "?") + "size=256";
    }

    return {
      isDiscord: !!isDiscord,
      primaryName,
      handle,
      globalName,
      handleTag,
      avatarUrl,
      discordId
    };
  },

  // ==========================================
  // STAFF ADMIN & DISCORD EMAIL LINKING CHECKS
  // ==========================================
  isAccountAdmin(target) {
    if (!target) return false;

    const staffRoleKeys = [
      "commissioner", "referee", "stats_official", "roster_manager",
      "recruiter", "broadcaster", "rulebook_admin", "admin", "staff",
      "administrator", "mod", "moderator"
    ];

    const getStaffEmails = () => {
      const set = new Set([
        "todd061496@gmail.com",
        "admin@frontlineleague.com",
        "referee@frontlineleague.com",
        "roster@frontlineleague.com",
        "recruiter@frontlineleague.com",
        "broadcast@frontlineleague.com"
      ]);
      try {
        const cached = localStorage.getItem("frontline_staff_roles_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            parsed.forEach(s => {
              if (s.email) set.add(String(s.email).toLowerCase().trim());
            });
          }
        }
      } catch (e) {}

      try {
        if (typeof MOCK_DATA !== "undefined" && Array.isArray(MOCK_DATA?.staffRoles)) {
          MOCK_DATA.staffRoles.forEach(s => {
            if (s.email) set.add(String(s.email).toLowerCase().trim());
          });
        }
      } catch (e) {}

      try {
        const adminEmail = sessionStorage.getItem("frontline_admin_email");
        if (adminEmail) set.add(String(adminEmail).toLowerCase().trim());
      } catch (e) {}

      return set;
    };

    if (typeof target === "string") {
      const clean = target.toLowerCase().trim();
      if (clean.includes("@")) {
        return getStaffEmails().has(clean);
      }
      try {
        const cached = localStorage.getItem("frontline_staff_roles_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.some(s => s.user_id && String(s.user_id) === clean)) {
            return true;
          }
        }
      } catch (e) {}
      return false;
    }

    if (typeof target === "object" && target !== null) {
      const allEmails = new Set();
      if (target.email) allEmails.add(String(target.email).toLowerCase().trim());
      if (target.user_email) allEmails.add(String(target.user_email).toLowerCase().trim());
      if (target.user_metadata?.email) allEmails.add(String(target.user_metadata.email).toLowerCase().trim());
      const discordIdent = Array.isArray(target.identities) ? target.identities.find(i => i.provider === "discord") : null;
      if (discordIdent?.identity_data?.email) allEmails.add(String(discordIdent.identity_data.email).toLowerCase().trim());

      const staffEmails = getStaffEmails();
      for (const e of allEmails) {
        if (e && staffEmails.has(e)) return true;
      }

      const uid = target.userId || target.user_id || target.id;
      const discordId = discordIdent?.id || target.user_metadata?.provider_id || target.user_metadata?.discord_user_id;

      if (uid || discordId) {
        try {
          const cached = localStorage.getItem("frontline_staff_roles_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.some(s => 
              (uid && s.user_id && String(s.user_id) === String(uid)) ||
              (discordId && s.discord_id && String(s.discord_id) === String(discordId))
            )) {
              return true;
            }
          }
        } catch (e) {}

        try {
          const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
          const matchedAcc = accounts.find(a => 
            (uid && (a.id === uid || a.user_id === uid)) ||
            (discordId && (a.discord_id === discordId || a.id === discordId)) ||
            Array.from(allEmails).some(e => a.email && a.email.toLowerCase() === e)
          );
          if (matchedAcc && (matchedAcc.is_staff === true || matchedAcc.staff_role || (matchedAcc.role && staffRoleKeys.includes(String(matchedAcc.role).toLowerCase())))) {
            return true;
          }
        } catch (e) {}
      }

      const appRole = target.app_metadata?.role;
      const metaRole = target.user_metadata?.role;
      const directRole = target.role;

      if (appRole && staffRoleKeys.includes(String(appRole).toLowerCase())) return true;
      if (metaRole && staffRoleKeys.includes(String(metaRole).toLowerCase())) return true;
      if (directRole && staffRoleKeys.includes(String(directRole).toLowerCase())) return true;

      if (target.is_staff === true || target.is_admin === true || target.app_metadata?.claims_admin === true) {
        return true;
      }
    }

    return false;
  },

  async isAccountAdminAsync(target) {
    if (this.isAccountAdmin(target)) return true;

    if (dbClient) {
      let emailToCheck = "";
      let idToCheck = null;

      if (typeof target === "string" && target.includes("@")) {
        emailToCheck = target.toLowerCase().trim();
      } else if (typeof target === "object" && target !== null) {
        const discordIdent = Array.isArray(target.identities) ? target.identities.find(i => i.provider === "discord") : null;
        emailToCheck = (
          target.email || 
          target.user_email || 
          target.user_metadata?.email || 
          discordIdent?.identity_data?.email || 
          ""
        ).toLowerCase().trim();
        idToCheck = target.userId || target.user_id || target.id;
      }

      try {
        if (emailToCheck) {
          const { data, error } = await dbClient
            .from("staff_roles")
            .select("id, email, role, user_id, custom_permissions, notes")
            .ilike("email", emailToCheck)
            .maybeSingle();

          if (!error && data) {
            try {
              const cached = JSON.parse(localStorage.getItem("frontline_staff_roles_cache")) || [];
              if (!cached.some(c => (c.email || "").toLowerCase() === emailToCheck)) {
                cached.push(data);
                localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(cached));
              }
            } catch (e) {}
            return true;
          }
        }

        if (idToCheck) {
          const { data, error } = await dbClient
            .from("staff_roles")
            .select("id, email, role, user_id, custom_permissions, notes")
            .eq("user_id", String(idToCheck))
            .maybeSingle();

          if (!error && data) {
            try {
              const cached = JSON.parse(localStorage.getItem("frontline_staff_roles_cache")) || [];
              if (!cached.some(c => String(c.id) === String(data.id))) {
                cached.push(data);
                localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(cached));
              }
            } catch (e) {}
            return true;
          }
        }
      } catch (err) {
        console.warn("isAccountAdminAsync query notice:", err);
      }
    }

    return false;
  },

  isDiscordLinkedToEmail(target) {
    if (!target) return false;

    let userObj = (typeof target === "object" && target !== null) ? target : null;
    let targetEmail = "";

    if (typeof target === "string" && target.includes("@")) {
      targetEmail = target.toLowerCase().trim();
    } else if (userObj) {
      targetEmail = (userObj.email || userObj.user_email || "").toLowerCase().trim();
    }

    // If userObj does not contain identities or app_metadata, check frontline_league_auth_user
    if (!userObj?.identities && !userObj?.app_metadata) {
      try {
        const localAuth = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
        if (localAuth) {
          const localEmail = (localAuth.email || "").toLowerCase().trim();
          const localId = String(localAuth.id || "");
          const targetId = String(userObj?.userId || userObj?.user_id || userObj?.id || "");
          if ((targetEmail && localEmail === targetEmail) || (targetId && localId === targetId)) {
            userObj = { ...localAuth, ...(userObj || {}) };
            if (!targetEmail) targetEmail = localEmail;
          }
        }
      } catch (e) {}
    }

    if (!userObj && !targetEmail) return false;

    // 1. Check user identities for Discord provider
    const identities = Array.isArray(userObj?.identities) ? userObj.identities : [];
    const discordIdent = identities.find(i => i.provider === "discord");
    if (discordIdent) {
      const identEmail = (discordIdent.identity_data?.email || discordIdent.email || "").toLowerCase().trim();
      if (identEmail && targetEmail && identEmail === targetEmail) {
        return true;
      }
      if (discordIdent.id || discordIdent.identity_id) {
        if (!identEmail || !targetEmail || identEmail === targetEmail) {
          return true;
        }
      }
    }

    // 2. Check app_metadata provider
    const appMeta = userObj?.app_metadata || {};
    if (appMeta.provider === "discord" || (Array.isArray(appMeta.providers) && appMeta.providers.includes("discord"))) {
      return true;
    }

    // 3. Check user_metadata for verified linked Discord email
    const userMeta = userObj?.user_metadata || {};
    const metaDiscordEmail = (userMeta.discord_email || userMeta.discord_linked_email || "").toLowerCase().trim();
    if (metaDiscordEmail && targetEmail && metaDiscordEmail === targetEmail) {
      return true;
    }
    if (userMeta.discord_email_linked === true || userMeta.discord_linked === true) {
      return true;
    }

    // 4. Check explicit localStorage link flag
    if (targetEmail) {
      try {
        if (localStorage.getItem("frontline_discord_linked_" + targetEmail) === "true") {
          return true;
        }
      } catch (e) {}
    }

    return false;
  },

  shouldBlockAdminCombatant(target) {
    return false; // Combatants and community players are never blocked
  },

  async shouldBlockAdminCombatantAsync(target) {
    return false;
  },

  async linkDiscordIdentity(redirectUrl) {
    if (!dbClient || !dbClient.auth?.linkIdentity) {
      return { success: false, error: "Identity linking is not supported by this Supabase client." };
    }
    try {
      const targetRedirect = redirectUrl || (window.location.origin + window.location.pathname);
      const { data, error } = await dbClient.auth.linkIdentity({
        provider: "discord",
        options: {
          redirectTo: targetRedirect,
          scopes: "identify email"
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // UNIFIED PLAYER DOSSIER MULTI-TABLE SYNC
  // ==========================================
  async syncPlayerDossierAcrossTables(payload = {}) {
    const {
      userId,
      gamertag,
      activisionId,
      role = "Flex",
      region = "NA East",
      platform = "PC",
      discordName,
      avatarUrl,
      email
    } = payload;

    const cleanGamertag = (gamertag || "").trim();
    const cleanActivision = (activisionId || "").trim();
    const cleanRole = (role || "").trim() || "Flex";
    const cleanRegion = (region || "").trim() || "NA East";
    const cleanPlatform = (platform || "").trim() || "PC";
    const cleanDiscord = (discordName || "").trim() || cleanGamertag;

    // Verified combatant registration across players and rosters

    let cleanAvatar = avatarUrl;
    if (!cleanAvatar || cleanAvatar.includes("unsplash.com")) {
      try {
        const localUser = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
        if (localUser) {
          const disc = this.getDiscordIdentity(localUser);
          if (disc?.avatarUrl) cleanAvatar = disc.avatarUrl;
        }
      } catch (e) {}
    }
    if (!cleanAvatar) {
      cleanAvatar = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80";
    }

    if (!cleanGamertag) return { success: false, error: "Gamertag is required." };

    // 1. Supabase Auth update if logged in
    if (dbClient && typeof dbClient.auth?.updateUser === "function") {
      try {
        await dbClient.auth.updateUser({
          data: {
            gamertag: cleanGamertag,
            username: cleanGamertag,
            name: cleanGamertag,
            activision_id: cleanActivision,
            role: cleanRole,
            tactical_role: cleanRole,
            region: cleanRegion,
            platform: cleanPlatform,
            discord_name: cleanDiscord,
            discord_username: cleanDiscord,
            profile_completed: true,
            avatar_url: cleanAvatar
          }
        });
      } catch (authErr) {
        console.warn("Auth updateUser sync notice:", authErr);
      }
    }

    // 2. Sync public.players table (Insert or Update)
    if (dbClient) {
      try {
        let existingPlayer = null;
        if (userId) {
          try {
            const { data: pById } = await dbClient
              .from("players")
              .select("id, gamertag")
              .eq("user_id", userId)
              .maybeSingle();
            if (pById) existingPlayer = pById;
          } catch (e) {}
        }
        if (!existingPlayer) {
          try {
            const { data: pByTag } = await dbClient
              .from("players")
              .select("id, gamertag")
              .ilike("gamertag", cleanGamertag)
              .maybeSingle();
            if (pByTag) existingPlayer = pByTag;
          } catch (e) {}
        }

        if (existingPlayer) {
          const updateObj = {
            gamertag: cleanGamertag,
            activision_id: cleanActivision,
            role: cleanRole,
            region: cleanRegion,
            platform: cleanPlatform,
            discord_name: cleanDiscord
          };
          if (userId) updateObj.user_id = userId;
          if (cleanAvatar) updateObj.avatar_url = cleanAvatar;

          const { error: updErr } = await dbClient
            .from("players")
            .update(updateObj)
            .eq("id", existingPlayer.id);

          if (updErr) {
            // Fallback for core columns only if custom columns aren't migrated
            await dbClient
              .from("players")
              .update({
                gamertag: cleanGamertag,
                role: cleanRole,
                avatar_url: cleanAvatar
              })
              .eq("id", existingPlayer.id);
          }
        } else {
          const insertObj = {
            gamertag: cleanGamertag,
            activision_id: cleanActivision,
            role: cleanRole,
            region: cleanRegion,
            platform: cleanPlatform,
            discord_name: cleanDiscord,
            avatar_url: cleanAvatar,
            kdr: 1.00,
            wins: 0,
            losses: 0,
            total_kills: 0,
            total_deaths: 0
          };
          if (userId) insertObj.user_id = userId;

          const { error: insErr } = await dbClient
            .from("players")
            .insert([insertObj]);

          if (insErr) {
            // Fallback for core columns
            await dbClient
              .from("players")
              .insert([{
                gamertag: cleanGamertag,
                role: cleanRole,
                avatar_url: cleanAvatar,
                kdr: 1.00,
                wins: 0,
                losses: 0
              }]);
          }
        }
      } catch (pErr) {
        console.warn("Supabase players sync notice:", pErr);
      }
    }

    // 3. Sync public.league_signups table (Insert or Update)
    try {
      await this.submitSignup({
        user_id: userId || null,
        gamertag: cleanGamertag,
        activision_id: cleanActivision,
        discord_username: cleanDiscord,
        role: cleanRole,
        platform: cleanPlatform,
        region: cleanRegion,
        registration_type: "Free Agent",
        notes: `[Auto-Registered: ${email || cleanDiscord || cleanGamertag}]`,
        status: "Pending"
      });
    } catch (sErr) {
      console.warn("Supabase league_signups sync notice:", sErr);
    }

    // 4. Sync public.arena_free_agents table (Insert or Update)
    if (dbClient) {
      try {
        let existingFA = null;
        if (userId) {
          try {
            const { data: faById } = await dbClient
              .from("arena_free_agents")
              .select("id")
              .eq("user_id", String(userId))
              .maybeSingle();
            if (faById) existingFA = faById;
          } catch (e) {}
        }
        if (!existingFA) {
          try {
            const { data: faByTag } = await dbClient
              .from("arena_free_agents")
              .select("id")
              .ilike("gamertag", cleanGamertag)
              .maybeSingle();
            if (faByTag) existingFA = faByTag;
          } catch (e) {}
        }

        const faPayload = {
          user_id: userId ? String(userId) : null,
          gamertag: cleanGamertag,
          activision_id: cleanActivision,
          discord: cleanDiscord,
          clan_tag: "LFT",
          primary_role: cleanRole,
          secondary_role: "Main AR",
          platform: cleanPlatform,
          region: cleanRegion,
          avatar_url: cleanAvatar,
          ladder_pref: "4v4_variant",
          elo: 1200,
          kdr: 1.00,
          availability: "Active / Daily",
          is_active: true,
          is_new_user: true
        };

        if (existingFA) {
          await dbClient
            .from("arena_free_agents")
            .update({
              activision_id: cleanActivision,
              discord: cleanDiscord,
              primary_role: cleanRole,
              platform: cleanPlatform,
              region: cleanRegion,
              avatar_url: cleanAvatar,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingFA.id);
        } else {
          await dbClient
            .from("arena_free_agents")
            .insert([faPayload]);
        }
      } catch (faErr) {
        console.warn("Supabase arena_free_agents sync notice:", faErr);
      }
    }

    // 5. Sync Local Storage across all game profiles
    try {
      const rawCard = JSON.parse(localStorage.getItem("frontline_league_player_card"));
      const isMyCard = rawCard && (rawCard._owner_id === userId || (rawCard._owner_email && email && rawCard._owner_email.toLowerCase() === email.toLowerCase()));
      const card = (isMyCard ? rawCard : null) || {
        team: "Free Agent",
        tag: "FA",
        division: "Division 1 · Premier",
        contract: "UNSIGNED FREE AGENT"
      };
      card._owner_id = userId || card._owner_id;
      if (email) card._owner_email = email.toLowerCase().trim();
      card.gamertag = cleanGamertag;
      card.activision = cleanActivision;
      card.role = cleanRole;
      card.discord = cleanDiscord;
      card.region = cleanRegion;
      card.platform = cleanPlatform;
      if (cleanAvatar) card.avatar = cleanAvatar;
      localStorage.setItem("frontline_league_player_card", JSON.stringify(card));
    } catch (e) {}

    try {
      const arenaAuth = JSON.parse(localStorage.getItem("frontline_arena_auth_user")) || {};
      arenaAuth.id = userId || arenaAuth.id || ("usr_" + Date.now());
      if (email) arenaAuth.email = email;
      arenaAuth.gamertag = cleanGamertag;
      arenaAuth.username = cleanGamertag;
      arenaAuth.activision_id = cleanActivision;
      arenaAuth.discord = cleanDiscord;
      arenaAuth.role = cleanRole;
      arenaAuth.region = cleanRegion;
      arenaAuth.platform = cleanPlatform;
      arenaAuth.avatar_url = cleanAvatar;
      localStorage.setItem("frontline_arena_auth_user", JSON.stringify(arenaAuth));
    } catch (e) {}

    try {
      const arenaAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const idx = arenaAccounts.findIndex(a =>
        (userId && a.id === userId) ||
        (email && a.email && a.email.toLowerCase() === email.toLowerCase()) ||
        (a.gamertag && a.gamertag.toLowerCase() === cleanGamertag.toLowerCase())
      );
      const accObj = {
        id: userId || ("usr_" + Date.now()),
        email: email || `${cleanGamertag.toLowerCase()}@frontlineleague.com`,
        gamertag: cleanGamertag,
        username: cleanGamertag,
        activision_id: cleanActivision,
        role: cleanRole,
        region: cleanRegion,
        platform: cleanPlatform,
        discord: cleanDiscord,
        avatar_url: cleanAvatar,
        elo: 1200,
        tier: "Specialist",
        tag: "ARENA"
      };
      if (idx >= 0) {
        arenaAccounts[idx] = { ...arenaAccounts[idx], ...accObj };
      } else {
        arenaAccounts.push(accObj);
      }
      localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(arenaAccounts));
    } catch (e) {}

    try {
      const faKey = "frontline_arena_free_agents";
      const localFAs = JSON.parse(localStorage.getItem(faKey)) || [];
      const faIdx = localFAs.findIndex(f =>
        (userId && f.user_id === String(userId)) ||
        (f.gamertag && f.gamertag.toLowerCase() === cleanGamertag.toLowerCase())
      );
      const faItem = {
        id: "fa_" + Date.now(),
        user_id: userId ? String(userId) : null,
        gamertag: cleanGamertag,
        activision_id: cleanActivision,
        discord: cleanDiscord,
        clan_tag: "LFT",
        primary_role: cleanRole,
        platform: cleanPlatform,
        region: cleanRegion,
        avatar_url: cleanAvatar,
        ladder_pref: "4v4_variant",
        elo: 1200,
        kdr: 1.00,
        availability: "Active / Daily"
      };
      if (faIdx >= 0) {
        localFAs[faIdx] = { ...localFAs[faIdx], ...faItem };
      } else {
        localFAs.push(faItem);
      }
      localStorage.setItem(faKey, JSON.stringify(localFAs));
    } catch (e) {}

    // 6. Sync LadderDB if loaded
    try {
      if (window.LadderDB && typeof window.LadderDB.registerFreeAgentFromAccount === "function") {
        await window.LadderDB.registerFreeAgentFromAccount({
          id: userId || ("usr_" + Date.now()),
          gamertag: cleanGamertag,
          email: email || `${cleanGamertag.toLowerCase()}@frontlineleague.com`,
          activision_id: cleanActivision,
          tag: "LFT",
          elo: 1200,
          role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discord: cleanDiscord,
          ladder_pref: "4v4_variant",
          created_at: new Date().toISOString()
        });
      }
      if (window.LadderDB && typeof window.LadderDB.updatePlayerProfile === "function") {
        await window.LadderDB.updatePlayerProfile({
          gamertag: cleanGamertag,
          activision_id: cleanActivision,
          role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discord: cleanDiscord
        });
      }
    } catch (lErr) {
      console.warn("LadderDB sync notice:", lErr);
    }

    return { success: true };
  },

  async completeCombatantDossier(payload = {}) {
    const { gamertag, activisionId, role, region, platform, discordName, avatarUrl } = payload;
    const cleanGamertag = (gamertag || "").trim();
    const cleanActivision = (activisionId || "").trim();
    const cleanRole = (role || "").trim() || "Flex";
    const cleanRegion = (region || "").trim() || "NA East";
    const cleanPlatform = (platform || "").trim() || "PC";
    const cleanDiscord = (discordName || "").trim() || cleanGamertag;

    if (!cleanGamertag) {
      return { success: false, error: "Please choose a username for the website / gamertag." };
    }
    if (!cleanActivision) {
      return { success: false, error: "Activision ID is required (e.g. Username#1234567)." };
    }

    // Retrieve active auth user
    let user = null;
    const authRes = await this.getAuthUser();
    if (authRes.success && authRes.user) {
      user = authRes.user;
    } else {
      try {
        user = JSON.parse(localStorage.getItem("frontline_league_auth_user")) || null;
      } catch (e) {}
    }

    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        email: cleanDiscord.includes("@") ? cleanDiscord : `${cleanGamertag.toLowerCase()}@frontlineleague.com`,
        user_metadata: {}
      };
    }

    if (!user.user_metadata) user.user_metadata = {};
    user.user_metadata.gamertag = cleanGamertag;
    user.user_metadata.username = cleanGamertag;
    user.user_metadata.name = cleanGamertag;
    user.user_metadata.activision_id = cleanActivision;
    user.user_metadata.role = cleanRole;
    user.user_metadata.tactical_role = cleanRole;
    user.user_metadata.region = cleanRegion;
    user.user_metadata.platform = cleanPlatform;
    user.user_metadata.discord_name = cleanDiscord;
    user.user_metadata.discord_username = cleanDiscord;
    user.user_metadata.profile_completed = true;
    if (avatarUrl) user.user_metadata.avatar_url = avatarUrl;

    // Synchronize across all database tables & caches
    await this.syncPlayerDossierAcrossTables({
      userId: user.id,
      gamertag: cleanGamertag,
      activisionId: cleanActivision,
      role: cleanRole,
      region: cleanRegion,
      platform: cleanPlatform,
      discordName: cleanDiscord,
      avatarUrl: avatarUrl || user.user_metadata?.avatar_url,
      email: user.email
    });

    try {
      localStorage.setItem("frontline_league_auth_user", JSON.stringify(user));
    } catch (e) {}

    // Clear Discord pending flag
    try {
      sessionStorage.removeItem("frontline_discord_oauth_pending");
    } catch (e) {}

    // Broadcast event
    window.dispatchEvent(new CustomEvent("frontline_dossier_completed", {
      detail: { user, gamertag: cleanGamertag, activision_id: cleanActivision, role: cleanRole, region: cleanRegion, platform: cleanPlatform, discord_name: cleanDiscord }
    }));

    return { success: true, user };
  },

  showDiscordDossierModal({ user, onComplete, onCancel } = {}) {
    const discordInfo = this.getDiscordIdentity(user) || {
      primaryName: "Discord Operative",
      handle: "operative",
      globalName: "Operative",
      avatarUrl: ""
    };
    const meta = user?.user_metadata || {};
    const existingGamertag = meta.gamertag || meta.username || discordInfo.globalName || discordInfo.handle || "";
    const existingActivision = meta.activision_id || "";
    const existingRole = meta.role || meta.tactical_role || "Flex";
    const existingRegion = meta.region || "NA East";
    const existingPlatform = meta.platform || "PC";

    let modal = document.getElementById("modal-discord-dossier");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-discord-dossier";
      modal.className = "modal-overlay";
      modal.style.cssText = "display:flex; position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:99999; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px);";
      modal.innerHTML = `
        <div class="account-gate-card" style="background:#13150f; border:1px solid #5865F2; box-shadow:0 0 45px rgba(88,101,242,0.3); max-width:540px; width:100%; padding:32px 28px; position:relative; margin:0; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div class="gate-kicker" style="color:#5865F2; display:flex; align-items:center; gap:6px; font-weight:800; font-size:11px; letter-spacing:1px; text-transform:uppercase;">
                <span>⚡ DISCORD SIGN-IN // ACCOUNT ONBOARDING</span>
              </div>
              <h2 class="gate-title" style="margin:4px 0 0; font-size:26px; font-family:var(--display, Impact, sans-serif); text-transform:uppercase; color:#fff;">
                COMPLETE <span style="color:var(--lime, #d5f45b);">COMBATANT PROFILE</span>
              </h2>
            </div>
            <button type="button" id="btn-close-discord-dossier" style="background:none; border:none; color:var(--muted, #b8baa9); font-size:22px; cursor:pointer; padding:4px 8px; line-height:1;" title="Dismiss modal">✕</button>
          </div>

          <p class="gate-subtitle" style="margin-bottom:16px; font-size:13px; color:var(--muted, #b8baa9); line-height:1.5;">
            Welcome! Your Discord is verified. To complete your Frontline league account, provide your Activision ID, combat role, and regional timezone below.
          </p>

          <!-- Verified Discord Account Card -->
          <div style="display:flex; align-items:center; gap:14px; background:#141724; border:1px solid #2d3654; padding:12px 16px; border-radius:4px; margin-bottom:20px;">
            <div style="width:42px; height:42px; border-radius:50%; background:#5865F2; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
              <img id="discord-badge-avatar" src="" style="width:100%; height:100%; object-fit:cover; display:none;" alt="Discord Avatar" />
              <svg id="discord-badge-fallback-icon" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:10.5px; font-weight:800; color:#5865F2; letter-spacing:1px; text-transform:uppercase;">Connected Discord Account</div>
              <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                <strong id="discord-badge-username" style="font-size:15px; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Username#0000</strong>
                <span style="background:#5865f225; color:#8ea1e1; font-size:10px; font-weight:800; padding:2px 6px; border:1px solid #5865f250; border-radius:3px;">OAUTH VERIFIED</span>
              </div>
            </div>
          </div>

          <!-- Error Banner inside modal -->
          <div id="discord-dossier-error-banner" class="gate-error-banner" style="display:none; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.4); color:#fca5a5; font-size:13px; padding:10px 14px; margin-bottom:14px; border-radius:2px;"></div>

          <!-- The Dossier Form -->
          <form id="form-discord-dossier" class="signup-form" style="display:flex; flex-direction:column; gap:14px;">
            
            <!-- 1. Gamertag / Website Alias -->
            <div class="form-group" style="text-align:left;">
              <label class="form-label" for="discord-dossier-gamertag" style="display:block; font-size:12px; font-weight:700; color:var(--text, #f5f5f0); text-transform:uppercase; margin-bottom:6px;">
                Website Gamertag / Competitor Handle <span class="req" style="color:var(--lime, #d5f45b);">*</span>
              </label>
              <input
                type="text"
                id="discord-dossier-gamertag"
                class="form-control"
                placeholder="e.g. Apex, Ghost, Shotzzy"
                required
                autocomplete="nickname"
                style="width:100%; box-sizing:border-box; background:#080a07; border:1px solid #333d1c; padding:10px 14px; color:#fff; font-size:13.5px; border-radius:2px;"
              />
              <span class="form-hint" style="font-size:11px; color:var(--muted, #b8baa9); margin-top:4px; display:block;">Your competitive handle across Frontline leaderboards & rosters</span>
            </div>

            <!-- 2. Activision ID -->
            <div class="form-group" style="text-align:left;">
              <label class="form-label" for="discord-dossier-activision" style="display:block; font-size:12px; font-weight:700; color:var(--text, #f5f5f0); text-transform:uppercase; margin-bottom:6px;">
                Activision ID <span class="req" style="color:var(--lime, #d5f45b);">*</span>
              </label>
              <input
                type="text"
                id="discord-dossier-activision"
                class="form-control"
                placeholder="e.g. Apex#1928374"
                required
                autocomplete="off"
                style="width:100%; box-sizing:border-box; background:#080a07; border:1px solid #333d1c; padding:10px 14px; color:#fff; font-size:13.5px; border-radius:2px;"
              />
              <span class="form-hint" style="font-size:11px; color:var(--muted, #b8baa9); margin-top:4px; display:block;">Include numbers (#1234567) for matchmaking invitations & stats tracking</span>
            </div>

            <!-- 3. Tactical Role & Battle Platform Grid -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div class="form-group" style="text-align:left;">
                <label class="form-label" for="discord-dossier-role" style="display:block; font-size:12px; font-weight:700; color:var(--text, #f5f5f0); text-transform:uppercase; margin-bottom:6px;">
                  Tactical Role <span class="req" style="color:var(--lime, #d5f45b);">*</span>
                </label>
                <select id="discord-dossier-role" class="form-control" required style="width:100%; box-sizing:border-box; background:#080a07; border:1px solid #333d1c; padding:10px 14px; color:#fff; font-size:13.5px; border-radius:2px;">
                  <option value="Flex" selected>Flex / Hybrid</option>
                  <option value="Main AR">Main AR / Anchor</option>
                  <option value="SMG">SMG / Entry Fragger</option>
                  <option value="Sniper">Sniper / Slayer</option>
                </select>
              </div>

              <div class="form-group" style="text-align:left;">
                <label class="form-label" for="discord-dossier-platform" style="display:block; font-size:12px; font-weight:700; color:var(--text, #f5f5f0); text-transform:uppercase; margin-bottom:6px;">
                  Battle Platform <span class="req" style="color:var(--lime, #d5f45b);">*</span>
                </label>
                <select id="discord-dossier-platform" class="form-control" required style="width:100%; box-sizing:border-box; background:#080a07; border:1px solid #333d1c; padding:10px 14px; color:#fff; font-size:13.5px; border-radius:2px;">
                  <option value="PC" selected>PC (Battle.net / Steam)</option>
                  <option value="PlayStation">PlayStation 5 / PS4</option>
                  <option value="Xbox">Xbox Series X|S / One</option>
                </select>
              </div>
            </div>

            <!-- 4. Operational Region / Timezone -->
            <div class="form-group" style="text-align:left;">
              <label class="form-label" for="discord-dossier-region" style="display:block; font-size:12px; font-weight:700; color:var(--text, #f5f5f0); text-transform:uppercase; margin-bottom:6px;">
                Timezone / Operational Region <span class="req" style="color:var(--lime, #d5f45b);">*</span>
              </label>
              <select id="discord-dossier-region" class="form-control" required style="width:100%; box-sizing:border-box; background:#080a07; border:1px solid #333d1c; padding:10px 14px; color:#fff; font-size:13.5px; border-radius:2px;">
                <option value="NA East" selected>North America — East (EST / CST)</option>
                <option value="NA Central">North America — Central (CST)</option>
                <option value="NA West">North America — West (PST / MST)</option>
                <option value="EU">Europe (GMT / CET)</option>
                <option value="Other">Other / International</option>
              </select>
              <span class="form-hint" style="font-size:11px; color:var(--muted, #b8baa9); margin-top:4px; display:block;">Server ping optimization, match scheduling, and ladder queue</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="btn-discord-dossier-submit" class="btn-submit-signup" style="width:100%; justify-content:center; margin-top:8px; background:var(--lime, #d5f45b); color:#000; border:none; padding:14px; font-weight:800; font-size:13px; text-transform:uppercase; letter-spacing:0.8px; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <span>Create Profile &amp; Unlock Dossier</span>
              <span style="font-size:16px;">⚡</span>
            </button>

            <div style="font-size:11.5px; color:var(--muted, #b8baa9); text-align:center; margin-top:4px;">
              Signed into the wrong Discord? <a href="javascript:void(0)" id="link-discord-dossier-signout" style="color:#ef4444; font-weight:700; text-decoration:underline;">Disconnect / Sign Out</a>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Populate Discord card details
    const badgeUsername = modal.querySelector("#discord-badge-username");
    if (badgeUsername) badgeUsername.textContent = discordInfo.handleTag ? `${discordInfo.primaryName} (${discordInfo.handleTag})` : discordInfo.primaryName;

    const badgeAvatar = modal.querySelector("#discord-badge-avatar");
    const badgeFallback = modal.querySelector("#discord-badge-fallback-icon");
    if (discordInfo.avatarUrl) {
      if (badgeAvatar) {
        badgeAvatar.src = discordInfo.avatarUrl;
        badgeAvatar.style.display = "block";
      }
      if (badgeFallback) badgeFallback.style.display = "none";
    } else {
      if (badgeAvatar) badgeAvatar.style.display = "none";
      if (badgeFallback) badgeFallback.style.display = "block";
    }

    // Prefill form inputs
    const inputGamertag = modal.querySelector("#discord-dossier-gamertag");
    if (inputGamertag) inputGamertag.value = existingGamertag;

    const inputActivision = modal.querySelector("#discord-dossier-activision");
    if (inputActivision) {
      inputActivision.value = existingActivision;
      setTimeout(() => inputActivision.focus(), 150);
    }

    const selectRole = modal.querySelector("#discord-dossier-role");
    if (selectRole && existingRole) {
      selectRole.value = existingRole;
    }

    const selectPlatform = modal.querySelector("#discord-dossier-platform");
    if (selectPlatform && existingPlatform) {
      selectPlatform.value = existingPlatform;
    }

    const selectRegion = modal.querySelector("#discord-dossier-region");
    if (selectRegion && existingRegion) {
      selectRegion.value = existingRegion;
    }

    const errBanner = modal.querySelector("#discord-dossier-error-banner");
    if (errBanner) {
      errBanner.style.display = "none";
      errBanner.textContent = "";
    }

    modal.style.display = "flex";

    // Setup close and sign-out handlers
    const btnClose = modal.querySelector("#btn-close-discord-dossier");
    if (btnClose) {
      btnClose.onclick = () => {
        modal.style.display = "none";
        sessionStorage.removeItem("frontline_discord_oauth_pending");
        if (typeof onCancel === "function") onCancel();
      };
    }

    const linkSignout = modal.querySelector("#link-discord-dossier-signout");
    if (linkSignout) {
      linkSignout.onclick = async () => {
        modal.style.display = "none";
        sessionStorage.removeItem("frontline_discord_oauth_pending");
        await this.signOutPlayer();
        window.location.reload();
      };
    }

    // Setup submit handler
    const form = modal.querySelector("#form-discord-dossier");
    const submitBtn = modal.querySelector("#btn-discord-dossier-submit");
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (errBanner) errBanner.style.display = "none";

        const gamertag = inputGamertag?.value.trim() || "";
        const activisionId = inputActivision?.value.trim() || "";
        const role = selectRole?.value || "Flex";
        const platform = selectPlatform?.value || "PC";
        const region = selectRegion?.value || "NA East";

        if (!gamertag) {
          if (errBanner) {
            errBanner.textContent = "Please enter your competitive gamertag / username.";
            errBanner.style.display = "block";
          }
          return;
        }

        if (!activisionId) {
          if (errBanner) {
            errBanner.textContent = "Activision ID is required (e.g. Username#1234567).";
            errBanner.style.display = "block";
          }
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>SAVING COMBATANT DOSSIER...</span><span>⏳</span>`;
        }

        try {
          const res = await this.completeCombatantDossier({
            gamertag,
            activisionId,
            role,
            platform,
            region,
            discordName: discordInfo.primaryName,
            avatarUrl: discordInfo.avatarUrl
          });

          if (res.success) {
            modal.style.display = "none";
            if (typeof onComplete === "function") {
              onComplete({
                success: true,
                user: res.user,
                gamertag,
                activisionId,
                role,
                platform,
                region,
                discordName: discordInfo.primaryName
              });
            }
          } else {
            if (errBanner) {
              errBanner.textContent = res.error || "Failed to save profile.";
              errBanner.style.display = "block";
            }
          }
        } catch (err) {
          if (errBanner) {
            errBanner.textContent = err.message || "An unexpected error occurred.";
            errBanner.style.display = "block";
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Create Profile &amp; Unlock Dossier</span><span style="font-size:16px;">⚡</span>`;
          }
        }
      };
    }
  },

  _discordOnboardedMap: {},
  _checkingDiscordOnboarding: false,

  async autoCheckDiscordOnboarding() {
    if (typeof window === "undefined" || !window.document) return;
    if (window.location.pathname.includes("/admin")) return;
    if (this._checkingDiscordOnboarding) return;

    let user = null;
    const authRes = await this.getAuthUser();
    if (authRes?.success && authRes?.user) {
      user = authRes.user;
    } else {
      try {
        user = JSON.parse(localStorage.getItem("frontline_league_auth_user")) || null;
      } catch (e) {}
    }

    if (!user || !user.id) return;
    // Guard: never run auto Discord onboarding on admin or staff accounts
    if (this.isAccountAdmin(user)) return;
    if (this._discordOnboardedMap && this._discordOnboardedMap[user.id]) return;
    this._checkingDiscordOnboarding = true;

    const meta = user.user_metadata || {};
    const discordInfo = this.getDiscordIdentity(user);
    const isDiscord = discordInfo && discordInfo.isDiscord;

    if (isDiscord) {
      try {
        const cleanGamertag = meta.gamertag || meta.username || discordInfo?.globalName || discordInfo?.handle || discordInfo?.primaryName || (user.email ? user.email.split("@")[0] : "Operative");
        const cleanDiscord = meta.discord_name || meta.discord_username || discordInfo?.primaryName || cleanGamertag;
        const cleanDiscordId = discordInfo?.discordId || null;
        const cleanAvatar = discordInfo?.avatarUrl || meta.avatar_url || "";
        const cleanRole = meta.role || meta.tactical_role || "Flex";
        const cleanPlatform = meta.platform || meta.battle_platform || "PC";
        const cleanRegion = meta.region || meta.operational_region || "NA East";
        const cleanActivision = meta.activision_id || "";

        // Check existing card or team assignment so we never demote a drafted / signed player
        let existingCard = null;
        try {
          const rawCard = JSON.parse(localStorage.getItem("frontline_league_player_card"));
          if (rawCard && (rawCard._owner_id === user.id || (rawCard._owner_email && rawCard._owner_email.toLowerCase() === (user.email || "").toLowerCase()))) {
            existingCard = rawCard;
          }
        } catch (e) {}

        const currentTeam = (existingCard?.team && existingCard.team !== "Free Agent" && existingCard.team !== "Unassigned")
          ? existingCard.team
          : "Free Agent";
        const isFA = currentTeam === "Free Agent";

        // Mark profile completed in user metadata so the system never prompts for info
        if (!meta.profile_completed || !meta.gamertag || (cleanAvatar && meta.avatar_url !== cleanAvatar)) {
          meta.gamertag = cleanGamertag;
          meta.username = cleanGamertag;
          meta.name = cleanGamertag;
          meta.discord_name = cleanDiscord;
          meta.discord_username = cleanDiscord;
          if (cleanDiscordId) meta.discord_user_id = cleanDiscordId;
          meta.role = cleanRole;
          meta.tactical_role = cleanRole;
          meta.platform = cleanPlatform;
          meta.region = cleanRegion;
          meta.profile_completed = true;
          if (cleanAvatar) meta.avatar_url = cleanAvatar;
          user.user_metadata = meta;
          try {
            localStorage.setItem("frontline_league_auth_user", JSON.stringify(user));
          } catch (e) {}

          if (dbClient && typeof dbClient.auth?.updateUser === "function") {
            dbClient.auth.updateUser({ data: meta }).catch(() => {});
          }
        }

        // Log to database: sync across public.players, public.league_signups, public.arena_free_agents
        await this.syncPlayerDossierAcrossTables({
          userId: user.id,
          gamertag: cleanGamertag,
          activisionId: cleanActivision,
          role: cleanRole,
          region: cleanRegion,
          platform: cleanPlatform,
          discordName: cleanDiscord,
          avatarUrl: cleanAvatar,
          email: user.email,
          status: isFA ? "Free Agent" : "Active",
          teamName: currentTeam
        });

        // Update player card in localStorage with owner metadata
        const cardObj = {
          _owner_id: user.id,
          _owner_email: (user.email || "").toLowerCase().trim(),
          gamertag: cleanGamertag,
          team: currentTeam,
          tag: isFA ? "AGENT" : currentTeam.slice(0, 5).toUpperCase(),
          role: cleanRole,
          division: existingCard?.division || (isFA ? "Free Agent" : "Division 1 · Premier"),
          activision: cleanActivision || existingCard?.activision || "Unlinked",
          discord: cleanDiscord,
          platform: cleanPlatform,
          region: cleanRegion,
          input: existingCard?.input || "Controller",
          avatar: cleanAvatar || existingCard?.avatar || "",
          contract: isFA ? "UNASSIGNED FREE AGENT" : "SIGNED FRANCHISE STARTER"
        };
        try {
          localStorage.setItem("frontline_league_player_card", JSON.stringify(cardObj));
        } catch (e) {}

        // Update DOM avatars
        const leagueAvatarEl = document.getElementById("league-user-avatar");
        if (leagueAvatarEl && cleanAvatar) leagueAvatarEl.src = cleanAvatar;

        const editAvatarInput = document.getElementById("edit-league-avatar");
        if (editAvatarInput && cleanAvatar && (!editAvatarInput.value || editAvatarInput.value.includes("unsplash.com"))) {
          editAvatarInput.value = cleanAvatar;
        }

        const arenaAvatarEl = document.getElementById("user-avatar-img");
        if (arenaAvatarEl && cleanAvatar) arenaAvatarEl.src = cleanAvatar;

        // Clear pending OAuth flag
        sessionStorage.removeItem("frontline_discord_oauth_pending");

        // Update navigation link
        if (typeof this.updateLeagueNavProfile === "function") {
          this.updateLeagueNavProfile();
        }

        window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user } }));
      } catch (e) {
        console.warn("Discord auto-onboarding notice:", e);
      } finally {
        if (!this._discordOnboardedMap) this._discordOnboardedMap = {};
        if (user?.id) this._discordOnboardedMap[user.id] = true;
        this._checkingDiscordOnboarding = false;
      }
    } else {
      this._checkingDiscordOnboarding = false;
    }
  },

  // ==========================================
  STAFF_ROLES: {
    commissioner: {
      key: "commissioner",
      title: "League Commissioner",
      badgeClass: "role-badge-commissioner",
      description: "Full command console access to all operations, league settings, and staff management.",
      tabs: ["tab-teams", "tab-players", "tab-player-stats", "tab-matches", "tab-schedule", "tab-signups", "tab-broadcast", "tab-announcements", "tab-season", "tab-rulebook", "tab-staff", "tab-ladder-disputes", "tab-platform-switcher", "tab-tournaments-hub"]
    },
    referee: {
      key: "referee",
      title: "Match Referee",
      badgeClass: "role-badge-referee",
      description: "Authorized to record match series scores, enter individual player combat statistics, manage schedules, and adjudicate ladder disputes.",
      tabs: ["tab-matches", "tab-player-stats", "tab-schedule", "tab-ladder-disputes"]
    },
    stats_official: {
      key: "stats_official",
      title: "Stats & Scoring Official",
      badgeClass: "role-badge-referee",
      description: "Authorized for match score reporting, player map statistics calculation, and telemetry updates.",
      tabs: ["tab-matches", "tab-player-stats"]
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
    if (roleKey === "commissioner") {
      return [...this.STAFF_ROLES.commissioner.tabs];
    }
    if (Array.isArray(customPermissions) && customPermissions.length > 0) {
      return customPermissions;
    }
    const roleDef = this.STAFF_ROLES[roleKey];
    if (roleDef) return roleDef.tabs;
    return this.STAFF_ROLES.commissioner.tabs;
  },

  async getStaffProfile(target) {
    if (!target) return null;

    let cleanEmail = "";
    let userId = null;
    let discordId = null;

    if (typeof target === "string") {
      cleanEmail = target.toLowerCase().trim();
    } else if (typeof target === "object") {
      const discordIdent = Array.isArray(target.identities) ? target.identities.find(i => i.provider === "discord") : null;
      cleanEmail = (
        target.email ||
        target.user_email ||
        target.user_metadata?.email ||
        discordIdent?.identity_data?.email ||
        ""
      ).toLowerCase().trim();
      userId = target.userId || target.user_id || target.id || null;
      discordId = discordIdent?.id || target.user_metadata?.provider_id || null;
    }

    // 1. Try Supabase staff_roles table by email or user_id
    if (dbClient) {
      try {
        if (cleanEmail) {
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
        }

        if (userId) {
          const { data, error } = await dbClient
            .from("staff_roles")
            .select("*")
            .eq("user_id", String(userId))
            .maybeSingle();

          if (!error && data) {
            return {
              id: data.id,
              email: data.email || cleanEmail,
              display_name: data.display_name || cleanEmail.split("@")[0],
              role: data.role || "commissioner",
              custom_permissions: data.custom_permissions || null,
              notes: data.notes || ""
            };
          }
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
        const match = parsed.find(s => 
          (cleanEmail && s.email && s.email.toLowerCase() === cleanEmail) ||
          (userId && s.user_id && String(s.user_id) === String(userId)) ||
          (discordId && s.discord_id && String(s.discord_id) === String(discordId))
        );
        if (match) return match;
      }
    } catch (e) {}

    // 2b. Check frontline_arena_registered_accounts for assigned staff role
    try {
      const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const match = accounts.find(a => 
        (cleanEmail && a.email && a.email.toLowerCase() === cleanEmail) ||
        (userId && (a.id === userId || a.user_id === userId)) ||
        (discordId && (a.discord_id === discordId || a.id === discordId))
      );
      if (match && (match.is_staff === true || match.staff_role)) {
        return {
          id: match.id,
          email: match.email || cleanEmail,
          display_name: match.gamertag || match.username || cleanEmail.split("@")[0],
          role: match.staff_role || match.role || "referee",
          custom_permissions: match.custom_permissions || null,
          notes: match.notes || ""
        };
      }
    } catch (e) {}

    // 3. Fallback to mock list
    if (cleanEmail) {
      const mock = (MOCK_DATA.staffRoles || []).find(s => s.email.toLowerCase() === cleanEmail);
      if (mock) return mock;

      // 4. Primary official commissioner email fallback
      if (cleanEmail === "admin@frontlineleague.com" || cleanEmail === "todd061496@gmail.com") {
        return {
          id: 0,
          email: cleanEmail,
          display_name: cleanEmail === "todd061496@gmail.com" ? "Commissioner Spencer" : "Commissioner",
          role: "commissioner",
          notes: "Primary League Commissioner"
        };
      }
    }

    return null;
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
      notes: staffData.notes?.trim() || (staffData.discord ? `Staff account for Discord @${staffData.discord}` : null),
      updated_at: new Date().toISOString()
    };

    if (staffData.user_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(staffData.user_id))) {
      payload.user_id = staffData.user_id;
    }

    // Update frontline_arena_registered_accounts so Discord / website account immediately gets staff status
    try {
      const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const idx = accounts.findIndex(a => 
        (a.email && a.email.toLowerCase() === cleanEmail) ||
        (staffData.user_id && (a.id === staffData.user_id || a.user_id === staffData.user_id)) ||
        (staffData.discord && a.discord && a.discord.toLowerCase() === staffData.discord.toLowerCase())
      );
      if (idx !== -1) {
        accounts[idx].is_staff = true;
        accounts[idx].staff_role = payload.role;
        accounts[idx].custom_permissions = payload.custom_permissions;
        if (payload.user_id && !accounts[idx].user_id) accounts[idx].user_id = payload.user_id;
        localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(accounts));
      }
    } catch (e) {}

    // Update active session if currently signed in user matches
    try {
      const curAuth = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
      if (curAuth && ((curAuth.email && curAuth.email.toLowerCase() === cleanEmail) || (staffData.user_id && curAuth.id === staffData.user_id))) {
        curAuth.is_staff = true;
        curAuth.staff_role = payload.role;
        curAuth.custom_permissions = payload.custom_permissions;
        localStorage.setItem("frontline_league_auth_user", JSON.stringify(curAuth));
      }
    } catch (e) {}

    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from("staff_roles")
          .upsert(payload, { onConflict: "email" })
          .select();

        if (error) {
          console.error("Supabase upsert staff_roles error:", error);
          // If upsert failed due to user_id constraint (e.g. invalid foreign key), retry without user_id
          if (payload.user_id && (error.code === "23503" || error.message?.includes("foreign key"))) {
            delete payload.user_id;
            const retryRes = await dbClient.from("staff_roles").upsert(payload, { onConflict: "email" }).select();
            if (!retryRes.error) {
              await this.getAllStaffMembers();
              return { success: true, data: retryRes.data?.[0] || payload };
            }
          }
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
      const cacheItem = { ...payload, discord: staffData.discord, discord_id: staffData.discord_id };
      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...cacheItem };
      } else {
        list.push({ id: Date.now(), ...cacheItem });
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
        if (error) console.warn("deleteStaffRole warning:", error);
        await this.getAllStaffMembers();
      } catch (err) {
        console.warn("deleteStaffRole error:", err);
      }
    }

    // Local fallback
    try {
      let list = await this.getAllStaffMembers();
      list = list.filter(s => s.id != staffIdOrEmail && s.email.toLowerCase() !== String(staffIdOrEmail).toLowerCase());
      localStorage.setItem("frontline_staff_roles_cache", JSON.stringify(list));
    } catch (e) {}

    // Also strip is_staff and staff_role from frontline_arena_registered_accounts cache
    try {
      const accounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const targetStr = String(staffIdOrEmail).toLowerCase().trim();
      let updated = false;
      accounts.forEach(a => {
        if ((a.email && a.email.toLowerCase() === targetStr) || (a.id && String(a.id) === targetStr) || (a.user_id && String(a.user_id) === targetStr)) {
          a.is_staff = false;
          delete a.staff_role;
          delete a.custom_permissions;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem("frontline_arena_registered_accounts", JSON.stringify(accounts));
      }
    } catch (e) {}

    return { success: true };
  },

  // Updates the League navigation bar Profile link across all pages
  // Hides "View Profile" until someone signs up through email or signs in with Discord
  async updateLeagueNavProfile() {
    if (typeof document === "undefined") return false;

    // Ensure Edit Profile is never present in the Explore League dropdown menu
    try {
      document.querySelectorAll('.links a, nav.links a, .nav-dropdown-col a, .menu-toggle a').forEach((a) => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        const text = (a.textContent || '').toLowerCase();
        if (href.includes('edit=true') || text.includes('edit profile')) {
          a.remove();
        }
      });
    } catch (e) {}

    const profileLinks = document.querySelectorAll(
      '.nav-league-profile-link, #nav-league-profile-link, a[href="/profile/"], a[href="profile.html"]'
    );

    let authUser = null;
    try {
      if (typeof this.getAuthUser === "function") {
        const authRes = await this.getAuthUser();
        if (authRes?.success && authRes?.user) {
          authUser = authRes.user;
        }
      }
    } catch (e) {}

    if (!authUser) {
      try {
        authUser = JSON.parse(localStorage.getItem("frontline_league_auth_user")) || null;
      } catch (e) {}
    }

    if (!authUser) {
      try {
        const sess = await this.getAuthSession();
        if (sess?.user) authUser = sess.user;
      } catch (e) {}
    }

    const isLoggedIn = !!authUser;

    profileLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";

      // Do not touch platform switcher buttons (e.g. .mode-switch-btn in header)
      if (link.classList.contains("mode-switch-btn")) {
        return;
      }

      // If it's an edit profile link, remove it
      if (href.includes("edit=true") || (link.textContent && link.textContent.toLowerCase().includes("edit profile"))) {
        link.remove();
        return;
      }

      if (isLoggedIn) {
        link.style.display = "";
        link.style.removeProperty("display");
        const meta = authUser.user_metadata || {};
        const gamertag = meta.gamertag || meta.username || meta.name;
        const discordInfo = typeof this.getDiscordIdentity === "function" ? this.getDiscordIdentity(authUser) : null;
        let navAvatar = discordInfo?.avatarUrl || meta.avatar_url;
        if (navAvatar && navAvatar.includes("unsplash.com")) navAvatar = null;
        const iconHtml = navAvatar
          ? `<img src="${navAvatar}" alt="" style="width:16px; height:16px; border-radius:50%; object-fit:cover; display:inline-block; vertical-align:middle; margin-right:6px; border:1px solid var(--lime);" />`
          : `<span class="nav-icon">👤</span>`;

        if (gamertag && gamertag !== "Operative") {
          link.innerHTML = `${iconHtml} View Profile (${gamertag})`;
        } else {
          link.innerHTML = `${iconHtml} View Profile`;
        }
      } else {
        link.style.display = "none";
      }
    });

    return isLoggedIn;
  },

  paypalConfig: PAYPAL_CONFIG,
  isConfigured: isSupabaseConfigured
};

// ==============================================================================
// FRONTLINE ARENA LADDER DATABASE API (SEPARATE FROM LEAGUE STANDINGS)
// ==============================================================================
const MOCK_LADDER_DATA = {
  teams: [],
  challenges: [],
  disputes: [],
  free_agents: []
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
        team_a: foundChal.team_a || { id: 1, name: "Team 1", tag: "T1", avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80", elo: 1200, tier: "Specialist" },
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
              name: "Opponent Squad",
              tag: "TBD",
              avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
              captain_name: "Opponent",
              elo: 1200,
              tier: "Specialist"
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
          id: 2,
          name: "Team 2",
          tag: "T2",
          avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
          captain_name: "Captain 2",
          elo: 1200,
          tier: "Specialist"
        }
      };
    }

    // Default match if generic or unknown ID requested
    return {
      id: matchId || 1049,
      ladder_type: "4v4_variant",
      best_of: 5,
      status: "in_progress",
      server_info: "Dallas (Central Host)",
      team_a: {
        id: 1,
        name: "Team 1",
        tag: "T1",
        avatar_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
        captain_name: "Captain 1",
        elo: 1200,
        tier: "Specialist"
      },
      team_b: {
        id: 2,
        name: "Team 2",
        tag: "T2",
        avatar_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
        captain_name: "Captain 2",
        elo: 1200,
        tier: "Specialist"
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

    return matches;
  },

  getMatchChat(matchId) {
    try {
      const saved = localStorage.getItem("frontline_match_chat_" + matchId);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { sender: "System", tag: "SYS", text: "Match room initialized. Good luck, have fun!", isSystem: true, timestamp: "Just now" }
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
    const knownPresets = [];

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
    const knownPresets = [];

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

  async registerArenaPlayer(params = {}) {
    const { gamertag, clan_tag, clanTag, email, discord, activision_id, activisionId, password, role, platform } = params;
    const cleanEmail = (email || "").trim();
    const cleanPassword = (password || "").trim();
    const cleanGamertag = (gamertag || "").trim();
    const cleanActivision = (activision_id || activisionId || "").trim();

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

    const cleanTag = (clan_tag || clanTag || "TAG").toUpperCase().trim().slice(0, 5);

    // Sync to Supabase Auth / LeagueDB if available
    let supabaseUserId = null;
    if (window.LeagueDB && typeof window.LeagueDB.signUpPlayer === "function") {
      try {
        const supaRes = await window.LeagueDB.signUpPlayer(cleanEmail, cleanPassword, cleanGamertag, cleanActivision, role);
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
      discord: discord ? discord.trim() : `${cleanGamertag.toLowerCase()}#0001`,
      activision_id: cleanActivision,
      role: role ? role.trim() : "Flex",
      platform: platform ? platform.trim() : "Crossplay",
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

    // Ensure recruit is also recorded in the recruitment queue (unless unlinked admin)
    const isBlockedAdmin = window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function"
      ? window.LeagueDB.shouldBlockAdminCombatant(newPlayer)
      : false;

    if (!isBlockedAdmin) {
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

      // Auto-sync into Arena Free Agents directory
      try {
        await this.registerFreeAgentFromAccount(newPlayer);
      } catch (faErr) {
        console.warn("Free agent auto-sync notice:", faErr);
      }
    }

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

    // Retrieve exactly ONE team per ladder stored in frontline_my_team_<ladder_type>
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
      myTeamsLink.href = player && player.gamertag ? "/arena/profile/#my-teams" : "/arena/profile/#login";
    }

    if (linkEl) {
      if (player && player.gamertag) {
        linkEl.href = "/arena/profile/";
        linkEl.title = `Signed in as ${player.gamertag} - View Profile & Records`;
        if (iconEl) iconEl.textContent = "👤";
        if (textEl) textEl.textContent = `Profile (${player.gamertag})`;
      } else {
        linkEl.href = "/arena/profile/#login";
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
          <a href="/arena/profile/#my-teams" class="gb-my-squad-pill" title="View Active Teams" style="text-decoration:none;">
            <img src="${player.avatar_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80'}" class="gb-my-squad-avatar" />
            <div>
              <strong style="color:#ffffff;">[${player.tag || 'TAG'}] ${player.gamertag}</strong>
              <span style="color:#ff1e44; font-size:11px; margin-left:4px;">${player.elo || 1200} ELO</span>
            </div>
          </a>
        `;
      } else {
        squadHeaderEl.innerHTML = `
          <a href="/arena/profile/#login" class="btn-crimson" style="font-size:11px; padding:7px 14px; text-decoration:none;">
            <span>🔑</span> <span>Combatant Login</span>
          </a>
        `;
      }
    }
  },

  // Free Agents (LFT) directory for Frontline Arena
  async getFreeAgents(filters = {}) {
    let list = [];

    // 1. Query Supabase 'arena_free_agents' table if configured
    if (dbClient) {
      try {
        let query = dbClient
          .from("arena_free_agents")
          .select("*")
          .eq("is_active", true)
          .order("elo", { ascending: false });

        if (filters.ladder && filters.ladder !== "all") {
          query = query.or(`ladder_pref.eq.${filters.ladder},ladder_pref.eq.all`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const eligibleData = data.filter(row => {
            if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
              return !window.LeagueDB.shouldBlockAdminCombatant(row);
            }
            return true;
          });

          list = eligibleData.map(row => ({
            id: row.id,
            gamertag: row.gamertag,
            clan_tag: row.clan_tag || "LFT",
            elo: Number(row.elo) || 1200,
            tier: this.getTier(Number(row.elo) || 1200),
            kdr: Number(row.kdr) || 1.15,
            ladder_pref: row.ladder_pref || "4v4_variant",
            primary_role: row.primary_role || "Flex",
            secondary_role: row.secondary_role || "Main AR",
            role: row.primary_role || "Flex",
            platform: row.platform || "Crossplay",
            region: row.region || "NA East",
            discord: row.discord || "",
            activision_id: row.activision_id || "",
            availability: row.availability || "Active / Daily",
            bio: row.bio || "Competitive operator looking for team.",
            avatar_url: row.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            mic: row.mic !== false,
            created_at: row.created_at || new Date().toISOString(),
            isNewUser: !!row.is_new_user,
            user_id: row.user_id
          }));

          // Cache in localStorage as local fallback
          try {
            localStorage.setItem("frontline_arena_free_agents", JSON.stringify(list));
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Supabase arena_free_agents query notice:", err);
      }
    }

    // 2. Fallback to LocalStorage if Supabase didn't yield results
    if (!list || list.length === 0) {
      try {
        const stored = localStorage.getItem("frontline_arena_free_agents");
        if (stored) {
          let parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
            parsed = parsed.filter(row => !window.LeagueDB.shouldBlockAdminCombatant(row));
          }
          list = parsed;
        }
      } catch (e) {}
    }

    // 3. Fallback to Mock Data if still empty
    if (!list || list.length === 0) {
      list = (MOCK_LADDER_DATA.free_agents || []).slice();
    }

    // Auto-discover and merge any registered website user accounts into Free Agents (unless unlinked admin)
    try {
      const registeredAccounts = JSON.parse(localStorage.getItem("frontline_arena_registered_accounts")) || [];
      const arenaUser = JSON.parse(localStorage.getItem("frontline_arena_user"));
      const leagueUser = JSON.parse(localStorage.getItem("frontline_league_auth_user"));

      const candidateUsers = [...registeredAccounts];
      if (arenaUser) candidateUsers.push(arenaUser);
      if (leagueUser) {
        const meta = leagueUser.user_metadata || {};
        candidateUsers.push({
          id: leagueUser.id,
          gamertag: meta.gamertag || meta.username || (leagueUser.email ? leagueUser.email.split("@")[0] : "Recruit"),
          activision_id: meta.activision_id,
          email: leagueUser.email,
          elo: 1200,
          created_at: leagueUser.created_at
        });
      }

      candidateUsers.forEach(u => {
        if (!u || !u.gamertag) return;
        // Skip unlinked admin accounts from Arena Free Agents pool
        if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
          if (window.LeagueDB.shouldBlockAdminCombatant(u)) {
            return;
          }
        }

        const lowerGamer = u.gamertag.toLowerCase().trim();
        const existingIdx = list.findIndex(fa => fa.gamertag && fa.gamertag.toLowerCase().trim() === lowerGamer);
        if (existingIdx === -1) {
          list.unshift({
            id: "fa-" + (u.id || Date.now()),
            gamertag: u.gamertag,
            clan_tag: (u.tag || "LFT").toUpperCase().slice(0, 5),
            elo: Number(u.elo) || 1200,
            tier: this.getTier(Number(u.elo) || 1200),
            kdr: Number(u.kdr) || 1.15,
            ladder_pref: u.ladder_pref || "4v4_variant",
            role: u.role || u.primary_role || "Flex",
            primary_role: u.role || u.primary_role || "Flex",
            secondary_role: u.secondary_role || "Main AR",
            platform: u.platform || "Crossplay",
            region: u.region || "NA East",
            mic: true,
            availability: "Active / LFT",
            discord: u.discord || `${lowerGamer}#0001`,
            activision_id: u.activision_id || `${u.gamertag}#1234567`,
            bio: u.bio || `Newly enlisted operator (${u.gamertag}) registered on website. Looking for active CDL team.`,
            avatar_url: u.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            created_at: u.created_at || new Date().toISOString(),
            isNewUser: true
          });
        }
      });
    } catch (e) {
      console.warn("Auto-merge registered accounts notice:", e);
    }

    if (filters.ladder && filters.ladder !== "all") {
      list = list.filter(fa => fa.ladder_pref === filters.ladder || fa.ladder_pref === "all");
    }
    if (filters.role && filters.role !== "all") {
      const r = filters.role.toLowerCase();
      list = list.filter(fa => (fa.primary_role && fa.primary_role.toLowerCase().includes(r)) || (fa.secondary_role && fa.secondary_role.toLowerCase().includes(r)));
    }
    if (filters.platform && filters.platform !== "all") {
      list = list.filter(fa => fa.platform && fa.platform.toLowerCase().includes(filters.platform.toLowerCase()));
    }
    if (filters.region && filters.region !== "all") {
      list = list.filter(fa => fa.region && fa.region.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(fa => (fa.gamertag && fa.gamertag.toLowerCase().includes(q)) || (fa.activision_id && fa.activision_id.toLowerCase().includes(q)) || (fa.bio && fa.bio.toLowerCase().includes(q)));
    }

    // Final guard: filter out any unlinked admin accounts
    if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
      list = list.filter(fa => !window.LeagueDB.shouldBlockAdminCombatant(fa));
    }
    return list;
  },

  async registerFreeAgentFromAccount(userData) {
    if (!userData || !userData.gamertag) return null;
    const cleanGamertag = userData.gamertag.trim();

    // Guard: Prevent unlinked admin accounts from registering as free agents in Arena
    if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
      if (window.LeagueDB.shouldBlockAdminCombatant(userData)) {
        console.log(`[LadderDB] registerFreeAgentFromAccount: Skipping unlinked admin account (${userData.email || cleanGamertag}).`);
        return null;
      }
    }

    const newAgent = {
      id: "fa-" + (userData.id || Date.now()),
      gamertag: cleanGamertag,
      clan_tag: (userData.tag || "LFT").toUpperCase().slice(0, 5),
      elo: Number(userData.elo) || 1200,
      tier: this.getTier(Number(userData.elo) || 1200),
      kdr: Number(userData.kdr) || 1.15,
      ladder_pref: userData.ladder_pref || "4v4_variant",
      role: userData.role || userData.primary_role || "Flex",
      primary_role: userData.role || userData.primary_role || "Flex",
      secondary_role: userData.secondary_role || "Main AR",
      platform: userData.platform || "Crossplay",
      region: userData.region || "NA East",
      mic: true,
      availability: "Active / Daily",
      discord: userData.discord || `${cleanGamertag.toLowerCase()}#0001`,
      activision_id: userData.activision_id || `${cleanGamertag}#1234567`,
      bio: userData.bio || `Newly enlisted operator (${cleanGamertag}) registered on website. Looking for active CDL team.`,
      avatar_url: userData.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      created_at: userData.created_at || new Date().toISOString(),
      isNewUser: true,
      is_active: true,
      user_id: userData.id ? String(userData.id) : null
    };

    // 1. Persist to Supabase arena_free_agents table
    if (dbClient) {
      try {
        await dbClient.from("arena_free_agents").upsert({
          gamertag: newAgent.gamertag,
          clan_tag: newAgent.clan_tag,
          elo: newAgent.elo,
          kdr: newAgent.kdr,
          ladder_pref: newAgent.ladder_pref,
          primary_role: newAgent.primary_role,
          secondary_role: newAgent.secondary_role,
          platform: newAgent.platform,
          region: newAgent.region,
          mic: newAgent.mic,
          availability: newAgent.availability,
          discord: newAgent.discord,
          activision_id: newAgent.activision_id,
          bio: newAgent.bio,
          avatar_url: newAgent.avatar_url,
          is_new_user: true,
          is_active: true,
          user_id: newAgent.user_id,
          updated_at: new Date().toISOString()
        }, { onConflict: "gamertag" });
      } catch (dbErr) {
        console.warn("Supabase registerFreeAgentFromAccount notice:", dbErr);
      }
    }

    // 2. Persist locally to localStorage
    let list = [];
    try {
      const stored = localStorage.getItem("frontline_arena_free_agents");
      list = stored ? JSON.parse(stored) : (MOCK_LADDER_DATA.free_agents || []).slice();
    } catch (e) {
      list = (MOCK_LADDER_DATA.free_agents || []).slice();
    }
    list = list.filter(fa => fa.gamertag && fa.gamertag.toLowerCase().trim() !== cleanGamertag.toLowerCase());
    list.unshift(newAgent);
    try {
      localStorage.setItem("frontline_arena_free_agents", JSON.stringify(list));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent("frontline_free_agents_updated", { detail: { agent: newAgent } }));
    return newAgent;
  },

  async postFreeAgent(agentData) {
    if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
      if (window.LeagueDB.shouldBlockAdminCombatant(agentData)) {
        return {
          success: false,
          error: "Staff administrator accounts cannot register as free agents unless linked to your verified Discord email."
        };
      }
    }

    const newAgent = {
      id: "fa-" + Date.now(),
      gamertag: agentData.gamertag || "Operator",
      clan_tag: (agentData.clan_tag || "LFT").toUpperCase().slice(0, 5),
      elo: Number(agentData.elo) || 1200,
      tier: this.getTier(Number(agentData.elo) || 1200),
      kdr: Number(agentData.kdr) || 1.10,
      ladder_pref: agentData.ladder_pref || "4v4_variant",
      primary_role: agentData.primary_role || "Flex",
      secondary_role: agentData.secondary_role || "Main AR",
      platform: agentData.platform || "PC",
      region: agentData.region || "NA East",
      mic: agentData.mic !== false,
      availability: agentData.availability || "Daily",
      discord: agentData.discord || "",
      activision_id: agentData.activision_id || "",
      bio: agentData.bio || "Competitive operator looking for team.",
      avatar_url: agentData.avatar_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      is_new_user: true,
      is_active: true
    };

    // 1. Persist to Supabase arena_free_agents table
    if (dbClient) {
      try {
        const { data, error } = await dbClient.from("arena_free_agents").upsert({
          gamertag: newAgent.gamertag,
          clan_tag: newAgent.clan_tag,
          elo: newAgent.elo,
          kdr: newAgent.kdr,
          ladder_pref: newAgent.ladder_pref,
          primary_role: newAgent.primary_role,
          secondary_role: newAgent.secondary_role,
          platform: newAgent.platform,
          region: newAgent.region,
          mic: newAgent.mic,
          availability: newAgent.availability,
          discord: newAgent.discord,
          activision_id: newAgent.activision_id,
          bio: newAgent.bio,
          avatar_url: newAgent.avatar_url,
          is_new_user: true,
          is_active: true,
          updated_at: new Date().toISOString()
        }, { onConflict: "gamertag" }).select();
        if (!error && data && data.length > 0) {
          newAgent.id = data[0].id;
        }
      } catch (err) {
        console.warn("Supabase postFreeAgent notice:", err);
      }
    }

    // 2. Persist locally to localStorage
    let list = [];
    try {
      const stored = localStorage.getItem("frontline_arena_free_agents");
      list = stored ? JSON.parse(stored) : (MOCK_LADDER_DATA.free_agents || []).slice();
    } catch (e) {
      list = (MOCK_LADDER_DATA.free_agents || []).slice();
    }
    list = list.filter(fa => fa.gamertag && fa.gamertag.toLowerCase().trim() !== newAgent.gamertag.toLowerCase());
    list.unshift(newAgent);
    try {
      localStorage.setItem("frontline_arena_free_agents", JSON.stringify(list));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent("frontline_free_agents_updated", { detail: { agent: newAgent } }));
    return newAgent;
  },

  async deleteFreeAgent(agentId) {
    if (dbClient) {
      try {
        await dbClient.from("arena_free_agents").delete().eq("id", agentId);
      } catch (err) {
        console.warn("Supabase deleteFreeAgent notice:", err);
      }
    }

    try {
      const stored = localStorage.getItem("frontline_arena_free_agents");
      let list = stored ? JSON.parse(stored) : (MOCK_LADDER_DATA.free_agents || []).slice();
      list = list.filter(fa => fa.id !== agentId);
      localStorage.setItem("frontline_arena_free_agents", JSON.stringify(list));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
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

// Auto-initialize global League Profile nav status across all pages
(function initLeagueNavWatcher() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  function runNavUpdate() {
    if (window.LeagueDB && typeof window.LeagueDB.updateLeagueNavProfile === "function") {
      window.LeagueDB.updateLeagueNavProfile();
    }
  }

  runNavUpdate();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runNavUpdate);
  }

  window.addEventListener("frontline_auth_changed", runNavUpdate);
  window.addEventListener("frontline_dossier_completed", runNavUpdate);
  window.addEventListener("storage", (e) => {
    if (e.key === "frontline_league_auth_user" || e.key?.includes("auth-token") || e.key?.includes("supabase.auth.token")) {
      runNavUpdate();
    }
  });

  if (dbClient?.auth?.onAuthStateChange) {
    try {
      dbClient.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          try {
            localStorage.setItem("frontline_league_auth_user", JSON.stringify(session.user));
          } catch(e) {}
        } else if (event === "SIGNED_OUT") {
          try {
            localStorage.removeItem("frontline_league_auth_user");
          } catch(e) {}
        }
        runNavUpdate();
      });
    } catch(e) {}
  }
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
    if (window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin")) return;
    window.location.href = "/admin";
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

      // 1. Secret word: typing "admin" anywhere on page (when not in a text box)
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



// Client-side cache migration: cleanse legacy placeholder teams/players from localStorage
(function scrubLegacyPlaceholderCache() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const placeholderNames = [
      "apex predators", "crimson syndicate", "ghost protocol", "vanguard prime",
      "sub base kings", "rookie regime", "duo demons", "silent scope duo",
      "bomb site rushers", "lone wolf solo", "quickscopegod", "night shift",
      "vantage", "redline", "static", "underdogs", "havok", "clayster", "attach", "standy"
    ];

    // Check my teams
    ["4v4_variant", "2v2_snd", "1v1_radar"].forEach(lt => {
      const myTeamKey = "frontline_my_team_" + lt;
      const t = localStorage.getItem(myTeamKey);
      if (t) {
        try {
          const parsed = JSON.parse(t);
          if (parsed && parsed.name && placeholderNames.includes(parsed.name.toLowerCase().trim())) {
            localStorage.removeItem(myTeamKey);
          }
        } catch(e) {}
      }

      // Check ladder teams cache
      const listKey = "frontline_ladder_teams_" + lt;
      const l = localStorage.getItem(listKey);
      if (l) {
        try {
          const teams = JSON.parse(l);
          if (Array.isArray(teams)) {
            const cleaned = teams.filter(tm => !placeholderNames.includes((tm.name || "").toLowerCase().trim()));
            localStorage.setItem(listKey, JSON.stringify(cleaned));
          }
        } catch(e) {}
      }
    });

    // Check league player card
    const card = localStorage.getItem("frontline_league_player_card");
    if (card) {
      try {
        const pc = JSON.parse(card);
        if (pc && (pc.gamertag === "Havok" || (pc.team && pc.team.toLowerCase().includes("legion")))) {
          localStorage.removeItem("frontline_league_player_card");
        }
      } catch(e) {}
    }

    // Check arena free agents
    const faKey = "frontline_arena_free_agents";
    const fa = localStorage.getItem(faKey);
    if (fa) {
      try {
        const agents = JSON.parse(fa);
        if (Array.isArray(agents)) {
          const dummyFA = ["ghostrider", "nyx", "bulletproof", "valkyrie", "staticpulse", "lonereaper"];
          let cleanedFA = agents.filter(a => !dummyFA.includes((a.gamertag || "").toLowerCase().trim()));
          if (window.LeagueDB && typeof window.LeagueDB.shouldBlockAdminCombatant === "function") {
            cleanedFA = cleanedFA.filter(a => !window.LeagueDB.shouldBlockAdminCombatant(a));
          }
          localStorage.setItem(faKey, JSON.stringify(cleanedFA));
        }
      } catch(e) {}
    }
  } catch(e) {
    console.warn("Legacy cache scrub notice:", e);
  }
})();

// ==============================================================================
// AUTO-CHECK DISCORD ONBOARDING & SESSION LISTENER
// ==============================================================================
(function initDiscordOnboardingCheck() {
  if (typeof window === "undefined") return;

  async function checkOnboarding() {
    if (!window.LeagueDB || typeof window.LeagueDB.autoCheckDiscordOnboarding !== "function") return;
    try {
      await window.LeagueDB.autoCheckDiscordOnboarding();
    } catch (e) {
      console.warn("Discord onboarding check notice:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.LeagueDB && typeof window.LeagueDB.initPlatformSwitcher === "function") {
        window.LeagueDB.initPlatformSwitcher();
      }
      setTimeout(checkOnboarding, 600);
    });
  } else {
    if (window.LeagueDB && typeof window.LeagueDB.initPlatformSwitcher === "function") {
      window.LeagueDB.initPlatformSwitcher();
    }
    setTimeout(checkOnboarding, 600);
  }

  if (typeof dbClient !== "undefined" && dbClient && dbClient.auth) {
    try {
      dbClient.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          if (session?.user) {
            try {
              localStorage.setItem("frontline_league_auth_user", JSON.stringify(session.user));
              localStorage.setItem("frontline_arena_auth_user", JSON.stringify(session.user));
              window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: session.user } }));
              window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { user: session.user } }));
            } catch(e) {}
          }
          setTimeout(checkOnboarding, 400);
        } else if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          if (session?.user) {
            try {
              localStorage.setItem("frontline_league_auth_user", JSON.stringify(session.user));
              localStorage.setItem("frontline_arena_auth_user", JSON.stringify(session.user));
            } catch(e) {}
          }
        } else if (event === "SIGNED_OUT") {
          try {
            localStorage.removeItem("frontline_league_auth_user");
            localStorage.removeItem("frontline_arena_auth_user");
            window.dispatchEvent(new CustomEvent("frontline_auth_changed", { detail: { user: null } }));
            window.dispatchEvent(new CustomEvent("frontline_arena_auth_changed", { detail: { user: null } }));
          } catch(e) {}
        }
      });
    } catch (e) {}
  }
})();
