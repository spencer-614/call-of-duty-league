const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createEdgeHandler,
} = require("../../supabase/functions/_shared/edge-app.mjs");
const { createLeagueClient } = require("../client.mjs");
const { asNodeApp } = require("./http-bridge.cjs");
const start = async (handler) => {
  const app = asNodeApp(handler);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
};
const env = {
  SUPABASE_URL: "https://auth.invalid",
  SUPABASE_ANON_KEY: "public-key",
  SUPABASE_DB_URL: "postgres://not-used",
  LEAGUE_BOT_SECRET: "shared-secret",
  DISCORD_TOKEN: "bot-token",
  DISCORD_GUILD_ID: "100000000000000001",
  FOUNDER_ROLE_ID: "founder",
  STAFF_ROLE_ID: "staff",
  GM_ROLE_ID: "gm",
};
test("edge routing, CORS, readiness and fail-closed authentication", async () => {
  const pool = {
    query: async (sql, args) => ({
      rows: sql.includes("to_regclass") ? [{ name: args[0] }] : [],
    }),
  };
  const { server, base } = await start(createEdgeHandler(pool, env));
  const original = global.fetch;
  global.fetch = async (url, opts) =>
    String(url).startsWith("https://auth.invalid")
      ? new Response("{}", { status: 401 })
      : original(url, opts);
  try {
    for (const prefix of ["/league", "/functions/v1/league"]) {
      let r = await original(`${base}${prefix}/health`);
      assert.equal(r.status, 200);
      assert.equal((await r.json()).configured, true);
      r = await original(`${base}${prefix}/catalog`, {
        headers: { Authorization: "Bearer shared-secret" },
      });
      assert.equal(r.status, 200);
      assert.deepEqual((await r.json()).teams, []);
      r = await original(`${base}${prefix}/diagnostics`, {
        headers: { Authorization: "Bearer shared-secret" },
      });
      assert.equal(r.status, 200);
      assert.equal((await r.json()).migration, "ready");
    }
    let r = await original(`${base}/league/state`);
    assert.equal(r.status, 401);
    r = await original(`${base}/league/worker/resources`, {
      headers: { Authorization: "Bearer wrong-secret" },
    });
    assert.equal(r.status, 401);
    r = await original(`${base}/league/catalog`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://frontlinecodleague.com",
        "Access-Control-Request-Headers": "authorization,apikey,content-type",
      },
    });
    assert.equal(r.status, 204);
    assert.equal(
      r.headers.get("Access-Control-Allow-Origin"),
      "https://frontlinecodleague.com",
    );
    assert.match(r.headers.get("Access-Control-Allow-Headers"), /apikey/);
    r = await original(`${base}/league/health`, {
      headers: { Origin: "https://untrusted.invalid" },
    });
    assert.equal(r.status, 403);
    assert.equal(r.headers.get("Access-Control-Allow-Origin"), null);
    r = await original(`${base}/league/worker/claim`, {
      method: "POST",
      headers: {
        Authorization: "Bearer shared-secret",
        "Content-Type": "application/json",
      },
      body: "{",
    });
    assert.equal(r.status, 400);
    assert.equal((await r.json()).error, "Invalid JSON request body");
    r = await original(`${base}/league/not-a-route`, {
      headers: { Authorization: "Bearer shared-secret" },
    });
    assert.equal(r.status, 404);
    assert.match((await r.json()).error, /route not found/);
  } finally {
    global.fetch = original;
    await new Promise((r) => server.close(r));
  }
});
test("missing Edge secrets are reported by name and private routes fail without querying DB", async () => {
  const pool = {
    query() {
      throw Error("Should not reach database");
    },
  };
  const { server, base } = await start(createEdgeHandler(pool, {}));
  try {
    let r = await fetch(`${base}/league/health`);
    const body = await r.json();
    assert.equal(body.configured, false);
    assert.ok(body.missing.includes("LEAGUE_BOT_SECRET"));
    r = await fetch(`${base}/league/catalog`);
    assert.equal(r.status, 503);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
test("browser admin sends only session JWT and public key to Supabase, not GitHub Pages", async () => {
  let request;
  const call = createLeagueClient({
    baseUrl: "https://project.supabase.co/functions/v1/league/",
    anonKey: "public-key",
    getSession: async () => ({ access_token: "user-jwt" }),
    fetchImpl: async (url, options) => {
      request = { url, options };
      return new Response(JSON.stringify({ queued: 2 }));
    },
  });
  await call("/seasons/1/discord", {});
  assert.equal(
    request.url,
    "https://project.supabase.co/functions/v1/league/seasons/1/discord",
  );
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "public-key");
  assert.equal(request.options.headers["X-Discord-Actor"], undefined);
  assert.equal(request.options.method, "POST");
});
test("browser reports non-JSON, rejected login and missing sessions clearly", async () => {
  const opts = {
    baseUrl: "https://project.supabase.co/functions/v1/league",
    anonKey: "public-key",
    getSession: async () => ({ access_token: "jwt" }),
  };
  await assert.rejects(
    createLeagueClient({
      ...opts,
      fetchImpl: async () => new Response("<html>404</html>", { status: 404 }),
    })("/state"),
    /HTTP 404 without JSON/,
  );
  await assert.rejects(
    createLeagueClient({
      ...opts,
      fetchImpl: async () =>
        new Response(JSON.stringify({ error: "Staff required" }), {
          status: 403,
        }),
    })("/state"),
    /Staff required/,
  );
  await assert.rejects(
    createLeagueClient({ ...opts, getSession: async () => null })("/state"),
    /Sign in with Discord/,
  );
});
