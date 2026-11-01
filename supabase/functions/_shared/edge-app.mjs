import leagueApi from "./league-api.mjs";
import { createFetchRouter } from "./fetch-router.mjs";
export const defaultOrigins = [
  "https://frontlinecodleague.com",
  "https://www.frontlinecodleague.com",
];
export function createEdgeHandler(pool, env) {
  const router = leagueApi(pool, env, createFetchRouter());
  const origins = new Set(
    (env.LEAGUE_ALLOWED_ORIGINS || defaultOrigins.join(","))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const required = [
    "LEAGUE_BOT_SECRET",
    "DISCORD_TOKEN",
    "DISCORD_GUILD_ID",
    "FOUNDER_ROLE_ID",
    "STAFF_ROLE_ID",
    "GM_ROLE_ID",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
  ];
  const missing = () => [
    ...required.filter((k) => !env[k]),
    ...(!env.LEAGUE_DATABASE_URL && !env.SUPABASE_DB_URL
      ? ["SUPABASE_DB_URL or LEAGUE_DATABASE_URL"]
      : []),
  ];
  return async function handle(request) {
    const headers = new Headers({
        "Cache-Control": "no-store",
        Vary: "Origin",
      }),
      origin = request.headers.get("origin");
    if (origin && !origins.has(origin))
      return Response.json(
        {
          error:
            "Website origin is not allowed. Configure LEAGUE_ALLOWED_ORIGINS in Supabase secrets.",
        },
        { status: 403, headers },
      );
    if (origin) headers.set("Access-Control-Allow-Origin", origin);
    headers.set(
      "Access-Control-Allow-Headers",
      "authorization, apikey, content-type, x-client-info, x-discord-actor",
    );
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    const full = new URL(request.url).pathname,
      prefix = ["/functions/v1/league", "/league"].find(
        (p) => full === p || full.startsWith(p + "/"),
      );
    if (!prefix)
      return Response.json(
        {
          error:
            "League API route not found. The base URL must end in /functions/v1/league.",
        },
        { status: 404, headers },
      );
    const path = full.slice(prefix.length) || "/";
    if (path === "/health" && request.method === "GET")
      return Response.json(
        {
          service: "frontline-league",
          version: "edge-v1",
          configured: missing().length === 0,
          missing: missing(),
        },
        { headers },
      );
    if (missing().length)
      return Response.json(
        {
          error:
            "League Edge Function secrets are incomplete. Check /league/health.",
          missing: missing(),
        },
        { status: 503, headers },
      );
    let response;
    try {
      response = await router.dispatch(request, path);
    } catch (error) {
      console.error("League request:", error.message);
      return Response.json(
        { error: "League Edge Function request failed" },
        { status: 500, headers },
      );
    }
    for (const [key, value] of headers) response.headers.set(key, value);
    return response;
  };
}
