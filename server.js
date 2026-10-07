// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - RAILWAY NODE.JS BACKEND SERVER
// ==============================================================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// PostgreSQL Connection Pool using Railway's DATABASE_URL
// Note: Railway's internal network (*.railway.internal) DOES NOT support SSL
const isInternalRailway = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.includes("railway.internal"));
const isLocalhost = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");
const useSsl = (!isInternalRailway && !isLocalhost);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Protect process from unhandled database pool errors
pool.on("error", (err) => {
  console.error("PostgreSQL pool background error:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Disable caching so browser always displays latest HTML/CSS changes
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Root URL redirect -> Redirects to /home/ so URL says /home in the browser
app.get(["/", "/index.html"], (req, res) => res.redirect(301, "/home/"));

// Hierarchy routes mapping: clean URL to folder index.html
const HIERARCHY_ROUTES = [
  { path: "/home", file: "home/index.html" },
  { path: "/arena", file: "arena/index.html" },
  { path: "/arena/tournaments", file: "arena/tournaments/index.html" },
  { path: "/arena/free-agents", file: "arena/free-agents/index.html" },
  { path: "/arena/profile", file: "arena/profile/index.html" },
  { path: "/teams", file: "teams/index.html" },
  { path: "/players", file: "players/index.html" },
  { path: "/schedule", file: "schedule/index.html" },
  { path: "/brackets", file: "brackets/index.html" },
  { path: "/tournaments", file: "tournaments/index.html" },
  { path: "/draft", file: "draft/index.html" },
  { path: "/ladders", file: "ladders/index.html" },
  { path: "/match", file: "match/index.html" },
  { path: "/match-finder", file: "match-finder/index.html" },
  { path: "/livestreams", file: "livestreams/index.html" },
  { path: "/vods", file: "vods/index.html" },
  { path: "/rules", file: "rules/index.html" },
  { path: "/signup", file: "signup/index.html" },
  { path: "/profile", file: "profile/index.html" }
];

HIERARCHY_ROUTES.forEach(route => {
  const filePath = path.resolve(__dirname, route.file);
  // Match both with and without trailing slash
  app.get([route.path, `${route.path}/`], (req, res) => {
    res.sendFile(filePath);
  });
});

// Admin panel explicit route (/admin, /admin/, and /admin.html all serve admin.html directly)
app.get(["/admin", "/admin/", "/admin.html"], (req, res) => {
  res.sendFile(path.resolve(__dirname, "admin.html"));
});

// Favicon routes
app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
  res.sendFile(path.resolve(__dirname, "images/leaguelogo_1.png"));
});

// Legacy redirects (backwards compatibility for flat URLs and old bookmarks)
const LEGACY_REDIRECTS = {
  "/arena-tournaments": "/arena/tournaments/",
  "/arena-tournaments.html": "/arena/tournaments/",
  "/arena-free-agents": "/arena/free-agents/",
  "/arena-free-agents.html": "/arena/free-agents/",
  "/arena-profile": "/arena/profile/",
  "/arena-profile.html": "/arena/profile/",
  "/arena.html": "/arena/",
  "/teams.html": "/teams/",
  "/players.html": "/players/",
  "/schedule.html": "/schedule/",
  "/brackets.html": "/brackets/",
  "/tournaments.html": "/tournaments/",
  "/draft.html": "/draft/",
  "/ladders.html": "/ladders/",
  "/match.html": "/match/",
  "/match-finder.html": "/match-finder/",
  "/livestreams.html": "/livestreams/",
  "/vods.html": "/vods/",
  "/rules.html": "/rules/",
  "/signup.html": "/signup/",
  "/profile.html": "/profile/"
};

Object.entries(LEGACY_REDIRECTS).forEach(([oldUrl, newUrl]) => {
  app.get(oldUrl, (req, res) => res.redirect(301, newUrl));
});

// Static files (serves images, CSS, JS, assets)
app.use(express.static(path.join(__dirname), { 
  extensions: ["html"],
  etag: false, 
  maxAge: 0 
}));

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "healthy", database: "connected", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", database: err.message });
  }
});

// ------------------------------------------------------------------------------
// TABLE DATA API (Bridges frontend calls to Railway Postgres)
// ------------------------------------------------------------------------------

// Allowed tables for query safety - Strict whitelist
const ALLOWED_TABLES = new Set([
  "teams", "players", "vods", "player_map_stats", "team_map_records",
  "league_signups", "org_signups", "league_announcements", "league_settings",
  "scheduled_matches", "tournament_divisions", "tournament_matches",
  "tournaments", "tournament_registrations",
  "arena_free_agents", "ladder_teams", "ladder_rosters", "ladder_matches",
  "ladder_disputes", "staff_roles"
]);

// Allowed SQL filter operators - Strict whitelist
const ALLOWED_OPERATORS = new Set([
  "eq", "neq", "gt", "gte", "lt", "lte", "in", "like", "ilike", "is_null", "not_null"
]);

// Strict SQL Identifier Validator (Prevents SQL injection via table, column, or identifier manipulation)
function isValidIdentifier(name) {
  return typeof name === "string" && /^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(name);
}

// Safely format parameters for pg driver (serializes JS objects/arrays to JSON string when needed)
function formatParamValue(val) {
  if (val === undefined) return null;
  if (val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
    return JSON.stringify(val);
  }
  return val;
}

// Helper: Build parameterized WHERE clause from query filters
function buildWhereClause(filters = [], paramOffset = 1) {
  if (!Array.isArray(filters) || filters.length === 0) {
    return { whereStr: "", values: [] };
  }
  const clauses = [];
  const values = [];
  let idx = paramOffset;

  for (const f of filters) {
    if (!f || typeof f !== "object") continue;
    if (!isValidIdentifier(f.col)) continue;
    if (!ALLOWED_OPERATORS.has(f.op)) continue;

    const colEscaped = `"${f.col}"`;

    if (f.op === "eq") {
      clauses.push(`${colEscaped} = $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "neq") {
      clauses.push(`${colEscaped} != $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "gte") {
      clauses.push(`${colEscaped} >= $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "gt") {
      clauses.push(`${colEscaped} > $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "lte") {
      clauses.push(`${colEscaped} <= $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "lt") {
      clauses.push(`${colEscaped} < $${idx++}`);
      values.push(formatParamValue(f.val));
    } else if (f.op === "like") {
      clauses.push(`${colEscaped} LIKE $${idx++}`);
      values.push(String(f.val));
    } else if (f.op === "ilike") {
      clauses.push(`${colEscaped} ILIKE $${idx++}`);
      values.push(String(f.val));
    } else if (f.op === "in") {
      if (Array.isArray(f.val) && f.val.length > 0) {
        clauses.push(`${colEscaped} = ANY($${idx++})`);
        values.push(f.val);
      }
    } else if (f.op === "is_null") {
      clauses.push(`${colEscaped} IS NULL`);
    } else if (f.op === "not_null") {
      clauses.push(`${colEscaped} IS NOT NULL`);
    }
  }

  return {
    whereStr: clauses.length > 0 ? "WHERE " + clauses.join(" AND ") : "",
    values
  };
}

// Auto-migration: Ensure core and tournament registration tables exist in PostgreSQL
async function initDatabaseTables() {
  if (!process.env.DATABASE_URL) return;
  try {
    // 1. Tournaments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.tournaments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        format TEXT DEFAULT '4v4 CDL Variant',
        bracket_type TEXT DEFAULT 'Double Elimination',
        prize_pool TEXT DEFAULT '$500 USD',
        entry_fee TEXT DEFAULT 'FREE ENTRY',
        max_teams INT DEFAULT 16,
        registered_teams INT DEFAULT 0,
        start_date TEXT,
        start_time TEXT,
        status TEXT DEFAULT 'Registration Open',
        image_url TEXT,
        registration_url TEXT,
        bracket_url TEXT,
        description TEXT,
        rules_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Tournament Registrations Table (Logs all squad entries submitted via modal)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.tournament_registrations (
        id TEXT PRIMARY KEY,
        tournament_id TEXT NOT NULL,
        tournament_title TEXT,
        team_name TEXT NOT NULL,
        captain_gamertag TEXT NOT NULL,
        captain_discord TEXT NOT NULL,
        captain_activision_id TEXT,
        roster JSONB DEFAULT '[]'::jsonb,
        roster_text TEXT,
        status TEXT DEFAULT 'registered',
        registered_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tourney_reg_tid ON public.tournament_registrations (tournament_id);
    `);
    console.log("PostgreSQL database schemas verified & auto-migrated.");
  } catch (err) {
    console.warn("Database initialization check notice:", err.message);
  }
}

// Trigger schema check
initDatabaseTables();

// GET: Retrieve table data (Strict parameterized query & validated identifiers)
app.get("/api/data/:table", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  let q = {};
  if (req.query.q) {
    try { q = JSON.parse(req.query.q); } catch (e) {}
  }
  const { filters = [], orderBy = [], limit } = q;

  try {
    // 1. Specialized join: TEAMS (embeds players array)
    if (table === "teams" && (!filters || filters.length === 0)) {
      const query = `
        SELECT 
          t.*,
          COALESCE(
            json_agg(p.*) FILTER (WHERE p.id IS NOT NULL),
            '[]'::json
          ) AS players
        FROM public.teams t
        LEFT JOIN public.players p ON p.team_id = t.id
        GROUP BY t.id
        ORDER BY t.points DESC, t.wins DESC;
      `;
      const result = await pool.query(query);
      return res.json({ data: result.rows, error: null });
    }

    // 2. Specialized join: PLAYERS (embeds team object)
    if (table === "players" && (!filters || filters.length === 0)) {
      const query = `
        SELECT 
          p.*,
          CASE 
            WHEN t.id IS NOT NULL THEN json_build_object('id', t.id, 'name', t.name, 'tag', t.tag, 'logo_url', t.logo_url)
            ELSE NULL 
          END AS teams
        FROM public.players p
        LEFT JOIN public.teams t ON p.team_id = t.id
        ORDER BY p.kdr DESC;
      `;
      const result = await pool.query(query);
      return res.json({ data: result.rows, error: null });
    }

    // 3. Specialized join: VODS (embeds team1 and team2 names)
    if (table === "vods" && (!filters || filters.length === 0)) {
      const query = `
        SELECT 
          v.*,
          CASE WHEN t1.id IS NOT NULL THEN json_build_object('name', t1.name, 'tag', t1.tag) ELSE NULL END AS team1,
          CASE WHEN t2.id IS NOT NULL THEN json_build_object('name', t2.name, 'tag', t2.tag) ELSE NULL END AS team2
        FROM public.vods v
        LEFT JOIN public.teams t1 ON v.team1_id = t1.id
        LEFT JOIN public.teams t2 ON v.team2_id = t2.id
        ORDER BY v.created_at DESC;
      `;
      const result = await pool.query(query);
      return res.json({ data: result.rows, error: null });
    }

    // 4. Specialized join: LADDER_MATCHES (embeds team_a and team_b)
    if (table === "ladder_matches" && (!filters || filters.length === 0)) {
      const query = `
        SELECT 
          m.*,
          CASE WHEN ta.id IS NOT NULL THEN json_build_object('id', ta.id, 'name', ta.name, 'tag', ta.tag, 'elo', ta.elo, 'avatar_url', ta.avatar_url) ELSE NULL END AS team_a,
          CASE WHEN tb.id IS NOT NULL THEN json_build_object('id', tb.id, 'name', tb.name, 'tag', tb.tag, 'elo', tb.elo, 'avatar_url', tb.avatar_url) ELSE NULL END AS team_b
        FROM public.ladder_matches m
        LEFT JOIN public.ladder_teams ta ON m.team_a_id = ta.id
        LEFT JOIN public.ladder_teams tb ON m.team_b_id = tb.id
        ORDER BY m.created_at DESC;
      `;
      const result = await pool.query(query);
      return res.json({ data: result.rows, error: null });
    }

    // Generic Table Query with parameterized filters and ordering
    const { whereStr, values } = buildWhereClause(filters);
    let orderClause = "";
    if (Array.isArray(orderBy) && orderBy.length > 0) {
      const parts = orderBy
        .filter(o => o && isValidIdentifier(o.col))
        .map(o => `"${o.col}" ${o.ascending === false ? "DESC" : "ASC"}`);
      if (parts.length > 0) orderClause = "ORDER BY " + parts.join(", ");
    }
    
    let limitClause = "";
    if (limit !== undefined && limit !== null) {
      const parsedLimit = parseInt(limit, 10);
      if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
        limitClause = `LIMIT ${Math.min(parsedLimit, 1000)}`;
      }
    }

    const sql = `SELECT * FROM public."${table}" ${whereStr} ${orderClause} ${limitClause};`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error querying ${table}:`, err.message);
    res.status(500).json({ data: null, error: "Database query failed safely" });
  }
});

// POST: Insert one or more records into a table (Strict parameterization & identifier validation)
app.post("/api/data/:table", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  const payload = req.body;
  const records = Array.isArray(payload) ? payload : [payload];
  if (records.length === 0) return res.json({ data: [], error: null });

  try {
    const insertedRows = [];
    for (const record of records) {
      if (!record || typeof record !== "object") continue;
      const keys = Object.keys(record).filter(isValidIdentifier);
      if (keys.length === 0) continue;

      const cols = keys.map(k => `"${k}"`).join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const values = keys.map(k => formatParamValue(record[k]));

      const sql = `INSERT INTO public."${table}" (${cols}) VALUES (${placeholders}) RETURNING *;`;
      const result = await pool.query(sql, values);
      if (result.rows[0]) insertedRows.push(result.rows[0]);
    }

    res.json({ data: insertedRows, error: null });
  } catch (err) {
    console.error(`Error inserting into ${table}:`, err.message);
    res.status(500).json({ data: null, error: "Database insert failed safely" });
  }
});

// POST: Upsert records (insert or update on conflict with strict parameterization)
app.post("/api/data/:table/upsert", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  const record = req.body;
  if (!record || typeof record !== "object") {
    return res.status(400).json({ error: "Invalid payload", data: null });
  }

  try {
    const keys = Object.keys(record).filter(isValidIdentifier);
    if (keys.length === 0) {
      return res.status(400).json({ error: "No valid columns provided", data: null });
    }

    // Determine and strictly validate conflict column
    let conflictCol = "id";
    const requestedConflict = req.query.onConflict || req.body.onConflict;
    if (requestedConflict && isValidIdentifier(requestedConflict) && keys.includes(requestedConflict)) {
      conflictCol = requestedConflict;
    } else if (keys.includes("id")) {
      conflictCol = "id";
    } else if (keys.includes("gamertag")) {
      conflictCol = "gamertag";
    } else {
      conflictCol = keys[0];
    }

    if (!isValidIdentifier(conflictCol)) {
      return res.status(400).json({ error: "Invalid conflict column identifier", data: null });
    }
    
    const cols = keys.map(k => `"${k}"`).join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const updateSets = keys
      .filter(k => k !== conflictCol)
      .map(k => `"${k}" = EXCLUDED."${k}"`)
      .join(", ");
    const values = keys.map(k => formatParamValue(record[k]));

    const sql = `
      INSERT INTO public."${table}" (${cols}) 
      VALUES (${placeholders})
      ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updateSets || `"${conflictCol}" = EXCLUDED."${conflictCol}"`}
      RETURNING *;
    `;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error upserting ${table}:`, err.message);
    res.status(500).json({ data: null, error: "Database upsert failed safely" });
  }
});

// PATCH: Update records matching filters (Guarded against unconstrained whole-table updates)
app.patch("/api/data/:table", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  const { updates, filters = [] } = req.body;
  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ error: "No updates provided", data: null });
  }

  try {
    const updateKeys = Object.keys(updates).filter(isValidIdentifier);
    if (updateKeys.length === 0) return res.json({ data: [], error: null });

    const values = [];
    let idx = 1;

    const setClauses = updateKeys.map(k => {
      values.push(formatParamValue(updates[k]));
      return `"${k}" = $${idx++}`;
    });

    const { whereStr, values: whereValues } = buildWhereClause(filters, idx);
    // Security check: Never permit unconstrained table updates
    if (!whereStr) {
      return res.status(400).json({ error: "Bulk updates without filter conditions are not permitted for security.", data: null });
    }
    values.push(...whereValues);

    const sql = `UPDATE public."${table}" SET ${setClauses.join(", ")} ${whereStr} RETURNING *;`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error updating ${table}:`, err.message);
    res.status(500).json({ data: null, error: "Database update failed safely" });
  }
});

// DELETE: Delete records matching filters (Guarded against unconstrained table wipe)
app.delete("/api/data/:table", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  const { filters = [] } = req.body;
  try {
    const { whereStr, values } = buildWhereClause(filters);
    // Security check: Never permit unconstrained table deletions
    if (!whereStr) {
      return res.status(400).json({ error: "Bulk deletion without filter conditions is not permitted for security.", data: null });
    }
    const sql = `DELETE FROM public."${table}" ${whereStr} RETURNING *;`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error deleting from ${table}:`, err.message);
    res.status(500).json({ data: null, error: "Database delete failed safely" });
  }
});

// Auth Login endpoint (Parameterized staff login check)
app.post("/api/auth/login", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.length > 255) {
    return res.status(400).json({ error: "Email length exceeds allowed limit" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.staff_roles WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [cleanEmail]
    );

    if (result.rows.length > 0) {
      const staff = result.rows[0];
      return res.json({
        user: {
          id: staff.user_id || "staff_" + staff.id,
          email: staff.email,
          role: staff.role,
          display_name: staff.display_name
        }
      });
    }

    // Default operator user if not staff
    res.json({
      user: {
        id: "usr_" + Date.now(),
        email: email,
        role: "player"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global route error handling
app.use((err, req, res, next) => {
  console.error("Express routing error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

// Start server - Must bind to 0.0.0.0 for Railway container networking
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontline CDL Node server running on 0.0.0.0:${PORT}`);
  console.log(`Database status: ${process.env.DATABASE_URL ? "DATABASE_URL detected" : "No DATABASE_URL found"}`);
});

// Safe dual-port listener: if Railway set PORT to something other than 3000,
// ALSO listen on 3000 so that whether Railway's domain routes to $PORT or 3000, it works!
if (PORT !== 3000) {
  try {
    const http = require("http");
    const server3000 = http.createServer(app);
    server3000.on("error", (err) => {
      console.log("Port 3000 fallback status:", err.message);
    });
    server3000.listen(3000, "0.0.0.0", () => {
      console.log("Frontline CDL Node server ALSO safely listening on 0.0.0.0:3000");
    });
  } catch (e) {
    console.log("Dual port startup note:", e.message);
  }
}
