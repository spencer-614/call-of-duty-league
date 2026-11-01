const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PGlite } = require("@electric-sql/pglite");
const express = require("express");
const apiFactory = require("../api.cjs");
const root = path.resolve(__dirname, "../..");
test("database migration and authenticated season/roster workflows", async (t) => {
  const db = new PGlite();
  await db.exec(
    `CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE TABLE auth.identities(user_id uuid,provider text,provider_id text,identity_data jsonb);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`,
  );
  const schema = fs.readFileSync(
    path.join(root, "supabase_database_setup.sql"),
    "utf8",
  );
  for (const name of [
    "teams",
    "players",
    "league_signups",
    "scheduled_matches",
    "staff_roles",
    "player_map_stats",
  ]) {
    const match = schema.match(
      new RegExp(
        `CREATE TABLE IF NOT EXISTS public\\.${name} \\([\\s\\S]*?\\n\\);`,
      ),
    );
    assert.ok(match, name);
    await db.exec(match[0]);
  }
  await db.exec(
    fs.readFileSync(path.join(root, "league/migration.sql"), "utf8"),
  );
  await db.exec(
    fs.readFileSync(path.join(root, "league/migration.sql"), "utf8"),
  ); // rerunnable migration
  await db.exec(
    "ALTER TABLE players ADD COLUMN IF NOT EXISTS status text;ALTER TABLE players ADD COLUMN IF NOT EXISTS team_name text;",
  );
  const pool = {
    query: (sql, args) => db.query(sql, args),
    connect: async () => ({
      query: (sql, args) => db.query(sql, args),
      release() {},
    }),
  };
  const staff = "11111111-1111-4111-8111-111111111111",
    user = "22222222-2222-4222-8222-222222222222";
  await db.query("INSERT INTO auth.users VALUES($1),($2)", [staff, user]);
  await db.query(
    "INSERT INTO staff_roles(user_id,email,role) VALUES($1,'staff@example.invalid','founder')",
    [staff],
  );
  const gm1 = "100000000000000001",
    gm2 = "100000000000000002",
    p1 = "100000000000000003",
    p2 = "100000000000000004",
    fa = "100000000000000005";
  const originalFetch = global.fetch;
  process.env.LEAGUE_BOT_SECRET = "test-secret";
  process.env.DISCORD_GUILD_ID = "100000000000000009";
  process.env.DISCORD_TOKEN = "test";
  process.env.FOUNDER_ROLE_ID = "founder";
  process.env.STAFF_ROLE_ID = "staff";
  process.env.GM_ROLE_ID = "gm";
  process.env.SUPABASE_URL = "https://test.invalid";
  process.env.SUPABASE_ANON_KEY = "anon";
  const app = express();
  app.use(express.json());
  app.use("/api/league", apiFactory(pool));
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}/api/league`;
  global.fetch = async (url, opts) => {
    if (String(url).startsWith("https://discord.com/")) {
      const id = String(url).split("/").pop();
      return new Response(
        JSON.stringify({
          roles: [gm1, gm2].includes(id)
            ? ["gm"]
            : id === "100000000000000008"
              ? ["staff"]
              : [],
        }),
      );
    }
    if (String(url).startsWith("https://test.invalid"))
      return new Response(JSON.stringify({ id: staff }));
    return originalFetch(url, opts);
  };
  const request = async (method, p, body, actor, admin = false) => {
    const response = await originalFetch(base + p, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin ? "web-session" : "test-secret"}`,
        ...(actor ? { "X-Discord-Actor": actor } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  };
  const post = (p, b = {}, actor, admin = false) =>
    request("POST", p, b, actor, admin);
  try {
    await t.test("reject missing credentials", async () => {
      const r = await originalFetch(base + "/state");
      assert.equal(r.status, 401);
    });
    await db.exec(
      "INSERT INTO teams(id,name,tag,division) VALUES(1,'Alpha','ALP','div-1'),(2,'Bravo','BRA','div-1')",
    );
    let sid;
    await t.test(
      "create, enroll and generate a non-destructive eight-week season",
      async () => {
        let r = await post(
          "/seasons",
          { name: "Test season", start_date: "2027-01-04" },
          null,
          true,
        );
        assert.equal(r.status, 200, JSON.stringify(r));
        sid = r.body.id;
        assert.equal(
          (
            await post(
              `/seasons/${sid}/enroll`,
              { team_ids: [1, 2] },
              null,
              true,
            )
          ).status,
          200,
        );
        r = await post(`/seasons/${sid}/fixtures`, {}, null, true);
        assert.equal(r.status, 200, JSON.stringify(r));
        assert.equal(r.body.count, 8);
        r = await post(`/seasons/${sid}/fixtures`, {}, null, true);
        assert.equal(r.body.existing, true);
        assert.equal(
          (await db.query("SELECT count(*)::int AS n FROM scheduled_matches"))
            .rows[0].n,
          8,
        );
      },
    );
    for (const [i, did] of [p1, p2, fa].entries()) {
      const uid = `30000000-0000-4000-8000-00000000000${i + 1}`;
      await db.query("INSERT INTO auth.users VALUES($1)", [uid]);
      await db.query(
        "INSERT INTO auth.identities VALUES($1,'discord',$2,'{}')",
        [uid, did],
      );
      await db.query(
        "INSERT INTO players(id,user_id,gamertag,team_id) VALUES($1,$2,$3,$4)",
        [i + 1, uid, `Player ${i + 1}`, i < 2 ? i + 1 : null],
      );
    }
    await t.test("only provider-verified identities are linked", async () => {
      assert.equal(
        (await db.query("SELECT count(*)::int AS n FROM fcl_identities"))
          .rows[0].n,
        3,
      );
      await db.query(
        "INSERT INTO players(id,gamertag,discord_name) VALUES(4,'Unverified','100000000000000006')",
      );
      assert.equal(
        (await db.query("SELECT count(*)::int AS n FROM fcl_identities"))
          .rows[0].n,
        3,
      );
    });
    await post("/gms", { team_id: 1, discord_id: gm1 }, null, true);
    await post("/gms", { team_id: 2, discord_id: gm2 }, null, true);
    await t.test(
      "GM ownership enforced; add/drop commits and is idempotent",
      async () => {
        assert.equal(
          (
            await post(
              "/roster",
              { action: "add", team_id: 2, player: fa, operation_id: "wrong" },
              gm1,
            )
          ).status,
          403,
        );
        assert.equal(
          (
            await post(
              "/roster",
              { action: "add", team_id: 1, player: fa, operation_id: "add1" },
              gm1,
            )
          ).status,
          200,
        );
        assert.equal(
          (
            await post(
              "/roster",
              { action: "add", team_id: 1, player: fa, operation_id: "add1" },
              gm1,
            )
          ).status,
          200,
        );
        assert.equal(
          (
            await post(
              "/roster",
              { action: "drop", team_id: 1, player: fa, operation_id: "drop1" },
              gm1,
            )
          ).status,
          200,
        );
      },
    );
    await t.test(
      "trade restricts response and swaps both players atomically",
      async () => {
        const r = await post(
          "/trades",
          { source_team: 1, destination_team: 2, offered: p1, requested: p2 },
          gm1,
        );
        assert.equal(r.status, 200, JSON.stringify(r));
        assert.equal(
          (await post(`/trades/${r.body.id}/decide`, { accept: true }, gm1))
            .status,
          403,
        );
        const accept = await post(
          `/trades/${r.body.id}/decide`,
          { accept: true },
          gm2,
        );
        assert.equal(accept.status, 200, JSON.stringify(accept));
        assert.equal(accept.body.status, "accepted");
        assert.equal(
          (await db.query("SELECT team_id FROM players WHERE id=1")).rows[0]
            .team_id,
          2,
        );
        assert.equal(
          (await db.query("SELECT team_id FROM players WHERE id=2")).rows[0]
            .team_id,
          1,
        );
        assert.equal(
          (await post(`/trades/${r.body.id}/decide`, { accept: true }, gm2))
            .body.status,
          "accepted",
        );
      },
    );
    await t.test(
      "roster display columns follow the canonical team assignment",
      async () => {
        const p = (await db.query("SELECT * FROM players WHERE id=1")).rows[0];
        assert.equal(p.team_name, "Bravo");
        assert.equal(p.status, "Active");
        const free = (await db.query("SELECT * FROM players WHERE id=3"))
          .rows[0];
        assert.equal(free.team_name, "Free Agent");
        assert.equal(free.status, "Free Agent");
      },
    );
    await t.test(
      "stale roster invalidates trade without partial updates",
      async () => {
        const r = await post(
          "/trades",
          { source_team: 1, destination_team: 2, offered: p2, requested: p1 },
          gm1,
        );
        await db.query("UPDATE players SET team_id=NULL WHERE id=1");
        assert.equal(
          (await post(`/trades/${r.body.id}/decide`, { accept: true }, gm2))
            .status,
          409,
        );
        assert.equal(
          (await db.query("SELECT team_id FROM players WHERE id=2")).rows[0]
            .team_id,
          1,
        );
      },
    );
    const match = (
      await db.query("SELECT * FROM scheduled_matches WHERE week_number=1")
    ).rows[0];
    await t.test(
      "scheduling persists accepted time and requires the opposing GM",
      async () => {
        const proposal = await post(
          `/matches/${match.id}/schedule`,
          { action: "propose", team_id: 1, at: "2027-01-06T00:00:00.000Z" },
          gm1,
        );
        assert.equal(proposal.status, 200, JSON.stringify(proposal));
        const saved = (
          await db.query("SELECT * FROM scheduled_matches WHERE id=$1", [
            match.id,
          ])
        ).rows[0];
        assert.equal(
          (
            await post(
              `/matches/${match.id}/schedule`,
              {
                action: "accept",
                team_id: 1,
                proposal_id: saved.fcl_proposal.id,
              },
              gm1,
            )
          ).status,
          400,
        );
        assert.equal(
          (
            await post(
              `/matches/${match.id}/schedule`,
              {
                action: "accept",
                team_id: 2,
                proposal_id: saved.fcl_proposal.id,
              },
              gm2,
            )
          ).status,
          200,
        );
        const accepted = (
          await db.query("SELECT * FROM scheduled_matches WHERE id=$1", [
            match.id,
          ])
        ).rows[0];
        assert.equal(
          new Date(accepted.fcl_scheduled_at).toISOString(),
          "2027-01-06T00:00:00.000Z",
        );
        assert.equal(accepted.fcl_proposal, null);
        assert.equal(
          (
            await post(
              `/matches/${match.id}/schedule`,
              {
                action: "accept",
                team_id: 2,
                proposal_id: saved.fcl_proposal.id,
              },
              gm2,
            )
          ).status,
          409,
        );
      },
    );
    await t.test(
      "esub stays FA and loses active grant when website completes match",
      async () => {
        const r = await post(
          "/esubs",
          { match_id: match.id, team_id: 1, player: fa },
          gm1,
        );
        assert.equal(r.status, 200, JSON.stringify(r));
        assert.equal(
          (await db.query("SELECT team_id FROM players WHERE id=3")).rows[0]
            .team_id,
          null,
        );
        await db.query(
          "UPDATE scheduled_matches SET status='Completed',winner_id=1,winner_name='Alpha' WHERE id=$1",
          [match.id],
        );
        assert.equal(
          (await db.query("SELECT active FROM fcl_esubs")).rows[0].active,
          false,
        );
        assert.equal(
          (
            await post(
              "/esubs",
              { match_id: match.id, team_id: 1, player: fa },
              gm1,
            )
          ).status,
          400,
        );
      },
    );
    await t.test(
      "job lease rejects stale acknowledgement and preserves updates made while running",
      async () => {
        const r = await post("/worker/claim", { worker: "test-worker" });
        assert.ok(r.body.job);
        const j = r.body.job;
        assert.equal(
          (
            await post(`/worker/jobs/${j.id}/finish`, {
              lease: "11111111-1111-4111-8111-111111111111",
              revision: j.revision,
            })
          ).status,
          409,
        );
        await db.query("SELECT public.fcl_enqueue($1,$2,$3)", [
          j.dedupe_key,
          j.kind,
          JSON.stringify(j.payload),
        ]);
        await post(`/worker/jobs/${j.id}/finish`, {
          lease: j.lease,
          revision: j.revision,
        });
        assert.equal(
          (await db.query("SELECT status FROM fcl_jobs WHERE id=$1", [j.id]))
            .rows[0].status,
          "pending",
        );
      },
    );
    await t.test(
      "anonymous and ordinary users cannot write roster or assign themselves staff",
      async () => {
        await db.exec(
          "GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO anon,authenticated;GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO anon,authenticated;SET ROLE anon;",
        );
        await assert.rejects(
          db.query("INSERT INTO teams(name,tag) VALUES('Bad','BAD')"),
          /row-level security/,
        );
        await db.exec("RESET ROLE");
        await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [
          user,
        ]);
        await db.exec("SET ROLE authenticated");
        await assert.rejects(
          db.query(
            "INSERT INTO staff_roles(user_id,email,role) VALUES($1,'bad@example.invalid','founder')",
            [user],
          ),
          /row-level security/,
        );
        await db.exec("RESET ROLE");
        await db.query("SELECT set_config('request.jwt.claim.sub','',false)");
      },
    );
    await t.test(
      "players can edit their own profile but cannot modify roster or stats",
      async () => {
        await db.query(
          "SELECT set_config('request.jwt.claim.sub','30000000-0000-4000-8000-000000000003',false)",
        );
        await db.exec("SET ROLE authenticated");
        await db.query(
          "UPDATE players SET avatar_url='https://example.invalid/avatar.png' WHERE id=3",
        );
        await assert.rejects(
          db.query("UPDATE players SET team_id=1 WHERE id=3"),
          /Only staff/,
        );
        await assert.rejects(
          db.query("UPDATE players SET total_kills=999 WHERE id=3"),
          /Only staff/,
        );
        await db.exec("RESET ROLE");
        await db.query("SELECT set_config('request.jwt.claim.sub','',false)");
      },
    );
    await t.test(
      "preseason excluded from public standings and playoffs wait for regular season",
      async () => {
        const r = (
          await db.query("SELECT * FROM fcl_public_standings WHERE team_id=1")
        ).rows[0];
        assert.equal(r.wins, 0);
        assert.equal(
          (await post(`/seasons/${sid}/playoffs`, {}, null, true)).status,
          400,
        );
      },
    );
    await t.test(
      "playoffs generate once and winner advancement fills next round",
      async () => {
        await db.exec(
          "UPDATE scheduled_matches SET status='Completed',winner_id=1,winner_name='Alpha',team1_score=CASE WHEN team1_id=1 THEN 3 ELSE 0 END,team2_score=CASE WHEN team2_id=1 THEN 3 ELSE 0 END",
        );
        let r = await post(`/seasons/${sid}/playoffs`, {}, null, true);
        assert.equal(r.status, 200, JSON.stringify(r));
        assert.equal(r.body.count, 1);
        assert.equal(
          (await post(`/seasons/${sid}/playoffs`, {}, null, true)).body
            .existing,
          true,
        );
        assert.equal(
          (await post(`/seasons/${sid}/archive`, {}, null, true)).status,
          400,
        );
        await db.exec(
          "UPDATE scheduled_matches SET status='Completed',winner_id=1,winner_name='Alpha' WHERE season_type='playoffs'",
        );
        assert.equal(
          (await post(`/seasons/${sid}/archive`, {}, null, true)).status,
          200,
        );
        await assert.rejects(
          db.exec(
            "DELETE FROM scheduled_matches WHERE fcl_season_id IS NOT NULL",
          ),
          /cannot be deleted/,
        );
      },
    );
    await t.test(
      "five-team playoffs create correct byes and advance winners without duplicate rounds",
      async () => {
        await db.exec(
          "INSERT INTO teams(id,name,tag,division) VALUES(3,'Charlie','CHA','div-1'),(4,'Delta','DEL','div-1'),(5,'Echo','ECH','div-1')",
        );
        const create = await post(
          "/seasons",
          { name: "Five-team season", start_date: "2027-04-05" },
          null,
          true,
        );
        const sid2 = create.body.id;
        assert.equal(
          (
            await post(
              `/seasons/${sid2}/enroll`,
              { team_ids: [1, 2, 3, 4, 5] },
              null,
              true,
            )
          ).status,
          200,
        );
        assert.equal(
          (await post(`/seasons/${sid2}/fixtures`, {}, null, true)).status,
          200,
        );
        await db.query(
          "UPDATE scheduled_matches SET status='Completed',winner_id=team1_id,winner_name=team1_name,team1_score=3,team2_score=0 WHERE fcl_season_id=$1",
          [sid2],
        );
        assert.equal(
          (
            await post(
              `/seasons/${sid2}/seeds`,
              {
                seeds: [1, 2, 3, 4, 5].map((id) => ({ team_id: id, seed: id })),
              },
              null,
              true,
            )
          ).status,
          200,
        );
        const generate = await post(
          `/seasons/${sid2}/playoffs`,
          {},
          null,
          true,
        );
        assert.equal(generate.status, 200, JSON.stringify(generate));
        assert.equal(generate.body.count, 7);
        const first = (
          await db.query(
            "SELECT * FROM scheduled_matches WHERE fcl_season_id=$1 AND fcl_round=1 ORDER BY fcl_slot",
            [sid2],
          )
        ).rows;
        assert.equal(first.filter((m) => m.status === "Completed").length, 3);
        const played = first.find((m) => m.team1_id && m.team2_id);
        assert.equal(played.team1_id, 4);
        assert.equal(played.team2_id, 5);
        await db.query(
          "UPDATE scheduled_matches SET winner_id=4,winner_name='Delta',status='Completed' WHERE id=$1",
          [played.id],
        );
        const next = (
          await db.query(
            "SELECT m.* FROM scheduled_matches m JOIN fcl_playoff_links l ON l.next_id=m.id WHERE l.match_id=$1",
            [played.id],
          )
        ).rows[0];
        assert.equal(next.team2_id, 4);
        assert.equal(next.team1_id, 1);
      },
    );
  } finally {
    global.fetch = originalFetch;
    await new Promise((r) => server.close(r));
    await db.close();
  }
});
