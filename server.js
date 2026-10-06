// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - RAILWAY NODE.JS BACKEND SERVER
// ==============================================================================
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Explicit root handler
app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Static files (serves all HTML, CSS, JS, assets)
app.use(express.static(path.join(__dirname), { etag: false, maxAge: 0 }));

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

// Allowed tables for query safety
const ALLOWED_TABLES = new Set([
  "teams", "players", "vods", "player_map_stats", "team_map_records",
  "league_signups", "org_signups", "league_announcements", "league_settings",
  "scheduled_matches", "tournament_divisions", "tournament_matches",
  "arena_free_agents", "ladder_teams", "ladder_rosters", "ladder_matches",
  "ladder_disputes", "staff_roles"
]);

// Helper: Build WHERE clause from query filters
function buildWhereClause(filters = [], paramOffset = 1) {
  if (!filters || filters.length === 0) return { whereStr: "", values: [] };
  const clauses = [];
  const values = [];
  let idx = paramOffset;

  for (const f of filters) {
    if (!f.col || !/^[a-zA-Z0-9_]+$/.test(f.col)) continue;
    if (f.op === "eq") {
      clauses.push(`"${f.col}" = $${idx++}`);
      values.push(f.val);
    } else if (f.op === "neq") {
      clauses.push(`"${f.col}" != $${idx++}`);
      values.push(f.val);
    } else if (f.op === "gte") {
      clauses.push(`"${f.col}" >= $${idx++}`);
      values.push(f.val);
    } else if (f.op === "lte") {
      clauses.push(`"${f.col}" <= $${idx++}`);
      values.push(f.val);
    } else if (f.op === "in" && Array.isArray(f.val)) {
      clauses.push(`"${f.col}" = ANY($${idx++})`);
      values.push(f.val);
    }
  }

  return {
    whereStr: clauses.length > 0 ? "WHERE " + clauses.join(" AND ") : "",
    values
  };
}

// GET: Retrieve table data (with specialized joins for complex UI queries)
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
    if (table === "teams" && filters.length === 0) {
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
    if (table === "players" && filters.length === 0) {
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
    if (table === "vods") {
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
    if (table === "ladder_matches") {
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

    // Generic Table Query with filters and ordering
    const { whereStr, values } = buildWhereClause(filters);
    let orderClause = "";
    if (orderBy && orderBy.length > 0) {
      const parts = orderBy
        .filter(o => o.col && /^[a-zA-Z0-9_]+$/.test(o.col))
        .map(o => `"${o.col}" ${o.ascending ? "ASC" : "DESC"}`);
      if (parts.length > 0) orderClause = "ORDER BY " + parts.join(", ");
    }
    const limitClause = limit ? `LIMIT ${parseInt(limit, 10)}` : "";

    const sql = `SELECT * FROM public."${table}" ${whereStr} ${orderClause} ${limitClause};`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error querying ${table}:`, err);
    res.status(500).json({ data: null, error: err.message });
  }
});

// POST: Insert one or more records into a table
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
      const keys = Object.keys(record).filter(k => /^[a-zA-Z0-9_]+$/.test(k));
      if (keys.length === 0) continue;

      const cols = keys.map(k => `"${k}"`).join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const values = keys.map(k => record[k]);

      const sql = `INSERT INTO public."${table}" (${cols}) VALUES (${placeholders}) RETURNING *;`;
      const result = await pool.query(sql, values);
      if (result.rows[0]) insertedRows.push(result.rows[0]);
    }

    res.json({ data: insertedRows, error: null });
  } catch (err) {
    console.error(`Error inserting into ${table}:`, err);
    res.status(500).json({ data: null, error: err.message });
  }
});

// POST: Upsert records (insert or update on conflict)
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
    const keys = Object.keys(record).filter(k => /^[a-zA-Z0-9_]+$/.test(k));
    const conflictCol = record.id !== undefined ? "id" : (record.gamertag ? "gamertag" : keys[0]);
    
    const cols = keys.map(k => `"${k}"`).join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const updateSets = keys.filter(k => k !== conflictCol).map(k => `"${k}" = EXCLUDED."${k}"`).join(", ");
    const values = keys.map(k => record[k]);

    const sql = `
      INSERT INTO public."${table}" (${cols}) 
      VALUES (${placeholders})
      ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updateSets || `"${conflictCol}" = EXCLUDED."${conflictCol}"`}
      RETURNING *;
    `;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error upserting ${table}:`, err);
    res.status(500).json({ data: null, error: err.message });
  }
});

// PATCH: Update records matching filters
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
    const updateKeys = Object.keys(updates).filter(k => /^[a-zA-Z0-9_]+$/.test(k));
    if (updateKeys.length === 0) return res.json({ data: [], error: null });

    const values = [];
    let idx = 1;

    const setClauses = updateKeys.map(k => {
      values.push(updates[k]);
      return `"${k}" = $${idx++}`;
    });

    const { whereStr, values: whereValues } = buildWhereClause(filters, idx);
    values.push(...whereValues);

    const sql = `UPDATE public."${table}" SET ${setClauses.join(", ")} ${whereStr} RETURNING *;`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    res.status(500).json({ data: null, error: err.message });
  }
});

// DELETE: Delete records matching filters
app.delete("/api/data/:table", async (req, res) => {
  const table = req.params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: "Invalid table name", data: null });
  }

  const { filters = [] } = req.body;
  try {
    const { whereStr, values } = buildWhereClause(filters);
    const sql = `DELETE FROM public."${table}" ${whereStr} RETURNING *;`;
    const result = await pool.query(sql, values);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error(`Error deleting from ${table}:`, err);
    res.status(500).json({ data: null, error: err.message });
  }
});

// Auth Login endpoint (Checks staff_roles table for staff login)
app.post("/api/auth/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const result = await pool.query(
      "SELECT * FROM public.staff_roles WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email.trim()]
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

// Start server
app.listen(PORT, () => {
  console.log(`Frontline CDL Node server running on port ${PORT}`);
  console.log(`Database connected via ${process.env.DATABASE_URL ? "DATABASE_URL" : "local fallback"}`);
});
