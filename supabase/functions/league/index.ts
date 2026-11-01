// Supabase runs this server inside its Edge Runtime. GitHub Pages remains static.
import pg from "pg";
import { createEdgeHandler } from "../_shared/edge-app.mjs";

const env = Deno.env.toObject();
if (!env.SUPABASE_ANON_KEY && env.SUPABASE_PUBLISHABLE_KEYS) {
  try {
    env.SUPABASE_ANON_KEY = JSON.parse(env.SUPABASE_PUBLISHABLE_KEYS).default;
  } catch {
    /* health endpoint reports missing config */
  }
}
const pool = new pg.Pool({
  connectionString: env.LEAGUE_DATABASE_URL || env.SUPABASE_DB_URL,
  max: 1,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000,
  query_timeout: 20000,
  ...(env.LEAGUE_DATABASE_CA
    ? {
        ssl: {
          ca: env.LEAGUE_DATABASE_CA.replace(/\\n/g, "\n"),
          rejectUnauthorized: true,
        },
      }
    : {}),
});
pool.on("error", (error) =>
  console.error("League database connection:", error.message),
);
const handle = createEdgeHandler(pool, env);
Deno.serve(
  { port: Number(env.LEAGUE_EDGE_PORT) || 8000, hostname: "0.0.0.0" },
  handle,
);
