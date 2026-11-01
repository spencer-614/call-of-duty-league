"use strict";
const express = require("express");
const { timingSafeEqual, randomUUID } = require("node:crypto");
const {
  fail,
  integer,
  snowflake,
  finished,
  fixtures,
  standings,
  seededSlots,
} = require("./logic.cjs");
const eq = (a, b) =>
  typeof a === "string" &&
  typeof b === "string" &&
  a.length > 0 &&
  Buffer.byteLength(a) === Buffer.byteLength(b) &&
  timingSafeEqual(Buffer.from(a), Buffer.from(b));
function leagueApi(pool) {
  const router = express.Router();
  const query = async (db, sql, args = []) => (await db.query(sql, args)).rows;
  const one = async (db, sql, args = []) => (await query(db, sql, args))[0];
  const tx = async (fn) => {
    const db = await pool.connect();
    try {
      await db.query("BEGIN");
      const result = await fn(db);
      await db.query("COMMIT");
      return result;
    } catch (e) {
      await db.query("ROLLBACK");
      throw e;
    } finally {
      db.release();
    }
  };
  const job = (db, key, kind, payload) =>
    db.query("SELECT public.fcl_enqueue($1,$2,$3)", [
      key,
      kind,
      JSON.stringify(payload),
    ]);
  const audit = (db, actor, action, details, op = null) =>
    db.query(
      "INSERT INTO fcl_audit(actor_id,action,details,operation_id) VALUES($1,$2,$3,$4)",
      [actor, action, JSON.stringify(details), op],
    );
  const season = async (db, id) => {
    const s = await one(
      db,
      id
        ? "SELECT * FROM fcl_seasons WHERE id=$1"
        : "SELECT * FROM fcl_seasons WHERE status='active'",
      id ? [integer(id)] : [],
    );
    if (!s)
      fail(
        "Season not found. Create a season in League Operations first.",
        404,
      );
    return s;
  };
  const active = async (db, id) => {
    const s = await season(db, id);
    if (s.status !== "active") fail("This season is archived", 409);
    return s;
  };
  const enrolled = async (db, sid, tid) => {
    if (
      !(await one(
        db,
        "SELECT 1 FROM fcl_season_teams WHERE season_id=$1 AND team_id=$2",
        [sid, tid],
      ))
    )
      fail("Team is not enrolled in this season");
  };
  const gm = async (db, actor, tid) => {
    if (
      !actor.staff &&
      (!actor.gm ||
        !(await one(
          db,
          "SELECT 1 FROM fcl_gms WHERE team_id=$1 AND discord_id=$2",
          [tid, actor.id],
        )))
    )
      fail("You must be a GM assigned to this team", 403);
  };
  const player = async (db, id) => {
    const p = await one(
      db,
      "SELECT p.*,i.discord_id FROM players p JOIN fcl_identities i ON i.player_id=p.id WHERE i.discord_id=$1 FOR UPDATE OF p",
      [snowflake(id)],
    );
    if (!p)
      fail("Player must be approved and linked through Discord sign-in", 404);
    return p;
  };
  const staffOnly = (req) => {
    if (!req.actor.staff) fail("Staff or Founder access required", 403);
  };
  // Never use the legacy email-only login response as proof of authentication.
  router.use(async (req, res, next) => {
    try {
      const token = (req.headers.authorization || "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (eq(token, process.env.LEAGUE_BOT_SECRET)) {
        req.isBot = true;
        req.actor = { id: "bot", staff: false };
        if (req.headers["x-discord-actor"]) {
          const id = snowflake(req.headers["x-discord-actor"]);
          const response = await fetch(
            `https://discord.com/api/v10/guilds/${snowflake(process.env.DISCORD_GUILD_ID)}/members/${id}`,
            {
              headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
              signal: AbortSignal.timeout(10000),
            },
          );
          if (!response.ok)
            fail("Cannot verify current Discord membership", 403);
          const member = await response.json(),
            roles = new Set(member.roles);
          req.actor = {
            id,
            staff: [
              process.env.FOUNDER_ROLE_ID,
              process.env.STAFF_ROLE_ID,
            ].some((r) => r && roles.has(r)),
            gm: roles.has(process.env.GM_ROLE_ID),
          };
        }
      } else {
        if (
          !token ||
          !process.env.SUPABASE_URL ||
          !process.env.SUPABASE_ANON_KEY
        )
          fail("Sign in with your verified website account", 401);
        const response = await fetch(
          `${process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$|\/$/g, "")}/auth/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: process.env.SUPABASE_ANON_KEY,
            },
            signal: AbortSignal.timeout(10000),
          },
        );
        if (!response.ok) fail("Website session expired", 401);
        const user = await response.json();
        const staff = await one(
          pool,
          "SELECT 1 FROM staff_roles WHERE user_id=$1 AND lower(role) IN ('founder','founders','staff','commissioner','admin','administrator')",
          [user.id],
        );
        req.actor = { id: user.id, staff: !!staff, gm: false };
      }
      next();
    } catch (e) {
      next(e);
    }
  });
  const route = (method, path, fn) =>
    router[method](path, async (req, res, next) => {
      try {
        res.json(await fn(req));
      } catch (e) {
        next(e);
      }
    });
  const botOnly = (req) => {
    if (!req.isBot) fail("Bot credential required", 403);
  };
  route("get", "/state", async (req) => {
    staffOnly(req);
    return {
      seasons: await query(pool, "SELECT * FROM fcl_seasons ORDER BY id DESC"),
      teams: await query(
        pool,
        "SELECT id,name,tag,division FROM teams WHERE id>0 ORDER BY name",
      ),
      enrollments: await query(pool, "SELECT * FROM fcl_season_teams"),
      gms: await query(pool, "SELECT * FROM fcl_gms"),
      jobs: await query(
        pool,
        "SELECT id,kind,status,attempts,last_error,created_at FROM fcl_jobs ORDER BY id DESC LIMIT 100",
      ),
      audit: await query(
        pool,
        "SELECT * FROM fcl_audit ORDER BY id DESC LIMIT 50",
      ),
    };
  });
  route("get", "/catalog", async (req) => {
    botOnly(req);
    return {
      seasons: await query(
        pool,
        "SELECT id,name,status FROM fcl_seasons ORDER BY id DESC",
      ),
      teams: await query(
        pool,
        "SELECT id,name,tag FROM teams WHERE id>0 ORDER BY name",
      ),
      owned: await query(
        pool,
        "SELECT team_id FROM fcl_gms WHERE discord_id=$1",
        [req.actor.id],
      ),
    };
  });
  route("post", "/seasons", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const { name, start_date, timezone = "America/New_York" } = req.body;
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.length > 100 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(start_date)
      )
        fail("Supply a season name and start date");
      if (
        new Date(`${start_date}T12:00:00Z`).toISOString().slice(0, 10) !==
        start_date
      )
        fail("Invalid date");
      new Intl.DateTimeFormat("en-US", { timeZone: timezone });
      const s = await one(
        db,
        "INSERT INTO fcl_seasons(name,start_date,timezone) VALUES($1,$2,$3) RETURNING *",
        [name.trim(), start_date, timezone],
      );
      await db.query(
        "INSERT INTO fcl_roster_history(season_id,player_id,gamertag,team_id) SELECT $1,id,gamertag,team_id FROM players",
        [s.id],
      );
      await audit(db, req.actor.id, "season.create", s);
      return s;
    });
  });
  route("post", "/gms", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const tid = integer(req.body.team_id),
        did = snowflake(req.body.discord_id);
      if (!req.body.remove) {
        const response = await fetch(
          `https://discord.com/api/v10/guilds/${snowflake(process.env.DISCORD_GUILD_ID)}/members/${did}`,
          {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
            signal: AbortSignal.timeout(10000),
          },
        );
        if (!response.ok) fail("GM must be a current server member");
        const m = await response.json();
        if (
          ![
            process.env.GM_ROLE_ID,
            process.env.STAFF_ROLE_ID,
            process.env.FOUNDER_ROLE_ID,
          ].some((role) => role && m.roles.includes(role))
        )
          fail("Assigned member needs the GM, Staff or Founder role");
      }
      if (req.body.remove)
        await db.query(
          "DELETE FROM fcl_gms WHERE team_id=$1 AND discord_id=$2",
          [tid, did],
        );
      else
        await db.query(
          "INSERT INTO fcl_gms VALUES($1,$2) ON CONFLICT DO NOTHING",
          [tid, did],
        );
      await audit(db, req.actor.id, "gm.assign", req.body);
      return { success: true };
    });
  });
  route("post", "/seasons/:id/enroll", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id);
      const ids = [...new Set((req.body.team_ids || []).map(integer))];
      if (!ids.length) fail("Select participating teams");
      if (
        await one(
          db,
          "SELECT 1 FROM scheduled_matches WHERE fcl_season_id=$1",
          [s.id],
        )
      )
        fail("Team enrollment is locked after fixtures are generated", 409);
      const teams = await query(
        db,
        "SELECT * FROM teams WHERE id=ANY($1::bigint[]) AND id>0",
        [ids],
      );
      if (teams.length !== ids.length) fail("Team not found");
      await db.query("DELETE FROM fcl_season_teams WHERE season_id=$1", [s.id]);
      for (const t of teams)
        await db.query(
          "INSERT INTO fcl_season_teams(season_id,team_id,name,tag,division) VALUES($1,$2,$3,$4,$5)",
          [s.id, t.id, t.name, t.tag, t.division || "div-1"],
        );
      await audit(db, req.actor.id, "season.enroll", {
        season: s.id,
        teams: ids,
      });
      return { success: true };
    });
  });
  route("post", "/seasons/:id/fixtures", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id);
      await db.query("SELECT id FROM fcl_seasons WHERE id=$1 FOR UPDATE", [
        s.id,
      ]);
      const existing = await query(
        db,
        "SELECT id FROM scheduled_matches WHERE fcl_season_id=$1",
        [s.id],
      );
      if (existing.length) return { count: existing.length, existing: true };
      const teams = await query(
        db,
        "SELECT team_id AS id,name,tag,division FROM fcl_season_teams WHERE season_id=$1 ORDER BY team_id",
        [s.id],
      );
      if (teams.length < 2) fail("Enroll at least two teams");
      const byId = new Map(teams.map((t) => [String(t.id), t]));
      let count = 0;
      const numbers = {};
      for (const f of fixtures(teams)) {
        const a = byId.get(String(f.a)),
          b = byId.get(String(f.b));
        const n = (numbers[f.week] = (numbers[f.week] || 0) + 1);
        await db.query(
          `INSERT INTO scheduled_matches(fcl_season_id,week_number,season_type,week_label,match_number,team1_id,team1_name,team1_tag,team2_id,team2_name,team2_tag,scheduled_date,scheduled_time,status)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::date+($2::int-1)*7,'TBD','Scheduled')`,
          [
            s.id,
            f.week,
            f.phase,
            `${f.phase === "preseason" ? "Preseason" : "Regular Season"} Week ${f.week <= 2 ? f.week : f.week - 2}`,
            n,
            a.id,
            a.name,
            a.tag,
            b.id,
            b.name,
            b.tag,
            s.start_date,
          ],
        );
        count++;
      }
      await audit(db, req.actor.id, "season.fixtures", { season: s.id, count });
      return { count };
    });
  });
  route("post", "/seasons/:id/discord", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id);
      const teams = await query(
        db,
        "SELECT team_id FROM fcl_season_teams WHERE season_id=$1",
        [s.id],
      );
      if (!teams.length) fail("Enroll teams first");
      for (const t of teams)
        await job(db, `team:${s.id}:${t.team_id}`, "team", {
          season_id: s.id,
          team_id: t.team_id,
        });
      await audit(db, req.actor.id, "discord.teams", { season: s.id });
      return { queued: teams.length };
    });
  });
  route("post", "/seasons/:id/weeks/:week/discord", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id),
        week = integer(req.params.week);
      const matches = await query(
        db,
        "SELECT id FROM scheduled_matches WHERE fcl_season_id=$1 AND week_number=$2",
        [s.id, week],
      );
      if (!matches.length) fail("No matches for this week");
      for (const m of matches)
        await job(db, `match:${m.id}`, "match", { match_id: m.id });
      await audit(db, req.actor.id, "discord.week", { season: s.id, week });
      return { queued: matches.length };
    });
  });
  route("post", "/seasons/:id/archive", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await season(db, req.params.id);
      if (
        await one(
          db,
          "SELECT 1 FROM scheduled_matches WHERE fcl_season_id=$1 AND lower(status) NOT IN ('completed','complete','final','cancelled','canceled','forfeit')",
          [s.id],
        )
      )
        fail("Finalize or cancel every match before archiving");
      await db.query("UPDATE fcl_seasons SET status='archived' WHERE id=$1", [
        s.id,
      ]);
      await db.query(
        "UPDATE fcl_trades SET status='expired' WHERE season_id=$1 AND status='pending'",
        [s.id],
      );
      await job(db, `archive:${s.id}`, "archive", { season_id: s.id });
      await audit(db, req.actor.id, "season.archive", { season: s.id });
      return { success: true };
    });
  });
  route("post", "/roster", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const s = await active(db),
        tid = integer(req.body.team_id);
      await enrolled(db, s.id, tid);
      await gm(db, req.actor, tid);
      const previous = await one(
        db,
        "SELECT details FROM fcl_audit WHERE operation_id=$1",
        [req.body.operation_id],
      );
      if (previous) return previous.details;
      const p = await player(db, req.body.player);
      const action = req.body.action;
      if (!["add", "drop"].includes(action)) fail("Invalid roster action");
      if (action === "add" && Number(p.team_id || 0) !== 0)
        fail("Player is already rostered");
      if (action === "drop" && Number(p.team_id) !== tid)
        fail("Player is not on this team");
      await db.query("UPDATE players SET team_id=$1 WHERE id=$2", [
        action === "add" ? tid : null,
        p.id,
      ]);
      const result = {
        success: true,
        action,
        player: p.gamertag,
        team_id: tid,
      };
      await audit(
        db,
        req.actor.id,
        `roster.${action}`,
        result,
        req.body.operation_id,
      );
      return result;
    });
  });
  route("post", "/trades", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const s = await active(db),
        source = integer(req.body.source_team),
        destination = integer(req.body.destination_team);
      if (source === destination) fail("Choose different teams");
      await enrolled(db, s.id, source);
      await enrolled(db, s.id, destination);
      await gm(db, req.actor, source);
      // Consistent lock order prevents reciprocal proposals from deadlocking.
      const ids = [snowflake(req.body.offered), snowflake(req.body.requested)];
      const players = await query(
        db,
        "SELECT p.*,i.discord_id FROM players p JOIN fcl_identities i ON i.player_id=p.id WHERE i.discord_id=ANY($1::text[]) ORDER BY p.id FOR UPDATE OF p",
        [ids],
      );
      const a = players.find((p) => p.discord_id === req.body.offered),
        b = players.find((p) => p.discord_id === req.body.requested);
      if (
        !a ||
        !b ||
        a.id === b.id ||
        Number(a.team_id) !== source ||
        Number(b.team_id) !== destination
      )
        fail("Selected players must be on their specified teams");
      const managers = await query(
        db,
        "SELECT discord_id FROM fcl_gms WHERE team_id=$1",
        [destination],
      );
      if (!managers.length)
        fail("Destination team needs a verified GM assignment");
      const t = await one(
        db,
        "INSERT INTO fcl_trades(season_id,proposer,source_team,destination_team,offered_player,requested_player) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [s.id, req.actor.id, source, destination, a.id, b.id],
      );
      await job(db, `trade:${t.id}`, "trade", { trade_id: t.id });
      await audit(db, req.actor.id, "trade.propose", t);
      return t;
    });
  });
  route("post", "/trades/:id/decide", (req) => {
    botOnly(req);
    return tx(async (db) => {
      if (!/^[\da-f-]{36}$/i.test(req.params.id)) fail("Invalid trade");
      const t = await one(
        db,
        "SELECT * FROM fcl_trades WHERE id=$1 FOR UPDATE",
        [req.params.id],
      );
      if (!t) fail("Trade not found", 404);
      await active(db, t.season_id);
      await gm(db, req.actor, t.destination_team);
      if (req.actor.id === t.proposer)
        fail("The proposing GM cannot accept their own proposal");
      if (t.status !== "pending") return { status: t.status };
      if (new Date(t.expires_at) < new Date()) {
        await db.query("UPDATE fcl_trades SET status='expired' WHERE id=$1", [
          t.id,
        ]);
        return { status: "expired" };
      }
      const decision = req.body.accept ? "accepted" : "declined";
      if (req.body.accept) {
        const ps = await query(
          db,
          "SELECT * FROM players WHERE id=ANY($1::bigint[]) ORDER BY id FOR UPDATE",
          [[t.offered_player, t.requested_player]],
        );
        const a = ps.find((p) => String(p.id) === String(t.offered_player)),
          b = ps.find((p) => String(p.id) === String(t.requested_player));
        if (
          !a ||
          !b ||
          String(a.team_id) !== String(t.source_team) ||
          String(b.team_id) !== String(t.destination_team)
        )
          fail(
            "A roster changed after this proposal. Submit a new trade.",
            409,
          );
        await db.query(
          "UPDATE players SET team_id=CASE WHEN id=$1 THEN $3::bigint ELSE $4::bigint END WHERE id=ANY($2::bigint[])",
          [a.id, [a.id, b.id], t.destination_team, t.source_team],
        );
      }
      await db.query(
        "UPDATE fcl_trades SET status=$2,decided_by=$3 WHERE id=$1",
        [t.id, decision, req.actor.id],
      );
      await audit(db, req.actor.id, `trade.${decision}`, t);
      await job(db, `trade-result:${t.id}`, "trade-result", { trade_id: t.id });
      return { status: decision };
    });
  });
  const getMatch = async (db, id) => {
    const m = await one(
      db,
      "SELECT * FROM scheduled_matches WHERE id=$1 AND fcl_season_id IS NOT NULL FOR UPDATE",
      [integer(id)],
    );
    if (!m) fail("Match not found", 404);
    return m;
  };
  route("post", "/esubs", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const m = await getMatch(db, req.body.match_id);
      await active(db, m.fcl_season_id);
      if (finished(m)) fail("Match has ended");
      const tid = integer(req.body.team_id);
      if (![String(m.team1_id), String(m.team2_id)].includes(String(tid)))
        fail("Team is not in this match");
      await gm(db, req.actor, tid);
      const p = await player(db, req.body.player);
      if (Number(p.team_id || 0) !== 0)
        fail("Emergency sub must be an approved FA");
      const existing = await one(
        db,
        "SELECT * FROM fcl_esubs WHERE match_id=$1 AND player_id=$2",
        [m.id, p.id],
      );
      if (existing && String(existing.team_id) !== String(tid))
        fail("This FA is already substituting for the opposing team");
      await db.query(
        "INSERT INTO fcl_esubs(match_id,player_id,team_id,actor_id) VALUES($1,$2,$3,$4) ON CONFLICT(match_id,player_id) DO UPDATE SET active=true",
        [m.id, p.id, tid, req.actor.id],
      );
      await job(db, `match:${m.id}`, "match", { match_id: m.id });
      await audit(db, req.actor.id, "esub.add", {
        match: m.id,
        player: p.id,
        team: tid,
      });
      return { success: true };
    });
  });
  route("post", "/matches/:id/schedule", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const m = await getMatch(db, req.params.id);
      await active(db, m.fcl_season_id);
      if (finished(m)) fail("Match ended");
      const tid = integer(req.body.team_id);
      if (![String(m.team1_id), String(m.team2_id)].includes(String(tid)))
        fail("Choose a team in this match");
      await gm(db, req.actor, tid);
      if (req.body.action === "propose") {
        const at = new Date(req.body.at);
        if (!Number.isFinite(at.valueOf()) || at <= new Date())
          fail("Select a future date and time");
        const s = await season(db, m.fcl_season_id);
        const local = new Intl.DateTimeFormat("en-CA", {
          timeZone: s.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(at);
        const start = new Date(s.start_date);
        start.setUTCDate(start.getUTCDate() + (m.week_number - 1) * 7);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 7);
        if (
          local < start.toISOString().slice(0, 10) ||
          local >= end.toISOString().slice(0, 10)
        )
          fail("Schedule must be within this match week");
        const proposal = {
          at: at.toISOString(),
          team_id: tid,
          actor: req.actor.id,
          id: randomUUID(),
        };
        await db.query(
          "UPDATE scheduled_matches SET fcl_proposal=$2 WHERE id=$1",
          [m.id, JSON.stringify(proposal)],
        );
      } else {
        const p = m.fcl_proposal;
        if (!p || p.id !== req.body.proposal_id)
          fail("Proposal changed or expired", 409);
        if (String(p.team_id) === String(tid) || p.actor === req.actor.id)
          fail("The opposing GM must respond");
        if (req.body.action === "accept") {
          if (new Date(p.at) <= new Date()) fail("Proposed time has passed");
          const s = await season(db, m.fcl_season_id);
          const at = new Date(p.at);
          const date = new Intl.DateTimeFormat("en-CA", {
            timeZone: s.timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(at);
          const time = new Intl.DateTimeFormat("en-US", {
            timeZone: s.timezone,
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          }).format(at);
          await db.query(
            "UPDATE scheduled_matches SET fcl_scheduled_at=$2,scheduled_date=$3,scheduled_time=$4,fcl_proposal=NULL WHERE id=$1",
            [m.id, p.at, date, time],
          );
        } else if (req.body.action === "decline")
          await db.query(
            "UPDATE scheduled_matches SET fcl_proposal=NULL WHERE id=$1",
            [m.id],
          );
        else fail("Invalid scheduling action");
      }
      await job(db, `match:${m.id}`, "match", { match_id: m.id });
      await audit(db, req.actor.id, "match.schedule", {
        match: m.id,
        ...req.body,
      });
      return { success: true };
    });
  });
  route("get", "/stats/:kind/:id", async (req) => {
    botOnly(req);
    const s = await season(pool, req.query.season),
      kind = req.params.kind;
    const teams = await query(
        pool,
        "SELECT * FROM fcl_season_teams WHERE season_id=$1",
        [s.id],
      ),
      matches = await query(
        pool,
        "SELECT * FROM scheduled_matches WHERE fcl_season_id=$1",
        [s.id],
      );
    if (kind === "team") {
      const tid = integer(req.params.id),
        t = standings(teams, matches).find((t) => Number(t.team_id) === tid);
      if (!t) fail("Team did not participate in this season", 404);
      const division = standings(
        teams.filter((x) => x.division === t.division),
        matches,
      );
      const roster = await query(
        pool,
        "SELECT DISTINCT ON (player_id) player_id,gamertag,team_id FROM fcl_roster_history WHERE season_id=$1 ORDER BY player_id,changed_at DESC,id DESC",
        [s.id],
      );
      return {
        season: s.name,
        ...t,
        points: t.wins * 10,
        placement: division.findIndex((x) => Number(x.team_id) === tid) + 1,
        roster: roster
          .filter((p) => Number(p.team_id) === tid)
          .map((p) => p.gamertag),
      };
    }
    if (kind !== "player") fail("Invalid stats kind");
    const p = await one(
      pool,
      "SELECT p.id,p.gamertag,p.role FROM players p JOIN fcl_identities i ON i.player_id=p.id WHERE i.discord_id=$1",
      [snowflake(req.params.id)],
    );
    if (!p) fail("Linked player not found", 404);
    const stats = await one(
      pool,
      "SELECT count(*)::int AS maps,COALESCE(sum(kills),0)::int AS kills,COALESCE(sum(deaths),0)::int AS deaths,count(*) FILTER(WHERE result='W')::int AS wins FROM player_map_stats WHERE player_id=$1 AND fcl_season_id=$2",
      [p.id, s.id],
    );
    const history = await one(
      pool,
      "SELECT team_id FROM fcl_roster_history WHERE season_id=$1 AND player_id=$2 ORDER BY changed_at DESC,id DESC LIMIT 1",
      [s.id, p.id],
    );
    return {
      season: s.name,
      ...p,
      ...stats,
      team:
        teams.find((t) => String(t.team_id) === String(history?.team_id))
          ?.name || "FA",
      kd: stats.deaths
        ? (stats.kills / stats.deaths).toFixed(2)
        : stats.kills
          ? "∞"
          : "—",
    };
  });
  route("post", "/seasons/:id/seeds", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id);
      if (
        await one(
          db,
          "SELECT 1 FROM scheduled_matches WHERE fcl_season_id=$1 AND season_type='playoffs'",
          [s.id],
        )
      )
        fail("Playoff seeds are locked once the bracket exists");
      for (const t of req.body.seeds || [])
        await db.query(
          "UPDATE fcl_season_teams SET seed_override=$3 WHERE season_id=$1 AND team_id=$2",
          [s.id, integer(t.team_id), t.seed ? integer(t.seed) : null],
        );
      await audit(db, req.actor.id, "playoffs.seeds", req.body);
      return { success: true };
    });
  });
  route("post", "/seasons/:id/playoffs", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      const s = await active(db, req.params.id);
      await db.query("SELECT id FROM fcl_seasons WHERE id=$1 FOR UPDATE", [
        s.id,
      ]);
      const matches = await query(
        db,
        "SELECT * FROM scheduled_matches WHERE fcl_season_id=$1",
        [s.id],
      );
      if (matches.some((m) => m.season_type === "playoffs"))
        return { existing: true };
      const regular = matches.filter((m) => m.season_type === "regular");
      if (!regular.length || regular.some((m) => !finished(m)))
        fail("Complete all regular-season matches first");
      const teams = await query(
        db,
        "SELECT * FROM fcl_season_teams WHERE season_id=$1",
        [s.id],
      );
      let count = 0,
        matchNumber = 0;
      // All teams qualify by default; top seeds receive byes to the next power of two.
      for (const division of Object.values(
        Object.groupBy(teams, (t) => t.division),
      )) {
        let ranked = standings(division, matches);
        if (division.some((t) => t.seed_override != null)) {
          const seeds = division.map((t) => Number(t.seed_override));
          if (
            seeds.some(
              (v) => !Number.isInteger(v) || v < 1 || v > division.length,
            ) ||
            new Set(seeds).size !== division.length
          )
            fail(
              "Set a unique seed for every team in a division when overriding ties",
            );
          ranked.sort((a, b) => a.seed_override - b.seed_override);
        } else if (
          ranked.some(
            (t, i) =>
              i &&
              t.wins === ranked[i - 1].wins &&
              t.losses === ranked[i - 1].losses &&
              t.map_difference === ranked[i - 1].map_difference,
          )
        )
          fail(
            "Unresolved playoff seeding tie. Set explicit seeds for this division before generating.",
          );
        let size = 2;
        while (size < ranked.length) size *= 2;
        const seeds = seededSlots(size);
        const rounds = Math.log2(size);
        const ids = new Map();
        for (let round = 1; round <= rounds; round++)
          for (let slot = 0; slot < size / 2 ** round; slot++) {
            const a = round === 1 ? ranked[seeds[slot * 2] - 1] : null,
              b = round === 1 ? ranked[seeds[slot * 2 + 1] - 1] : null;
            const m = await one(
              db,
              `INSERT INTO scheduled_matches(fcl_season_id,week_number,season_type,week_label,match_number,team1_id,team1_name,team1_tag,team2_id,team2_name,team2_tag,status,fcl_round,fcl_slot) VALUES($1,$2,'playoffs',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
              [
                s.id,
                8 + round,
                `Playoffs ${division[0].division} Round ${round}`,
                ++matchNumber,
                a?.team_id || null,
                a?.name || "TBD",
                a?.tag || "",
                b?.team_id || null,
                b?.name || "TBD",
                b?.tag || "",
                round === 1 && (!a || !b) ? "Completed" : "Scheduled",
                round,
                slot,
              ],
            );
            ids.set(`${round}:${slot}`, m.id);
            count++;
            if (round === 1 && (!a || !b))
              await db.query(
                "UPDATE scheduled_matches SET winner_id=$2,winner_name=$3 WHERE id=$1",
                [m.id, (a || b)?.team_id, (a || b)?.name],
              );
          }
        for (const [key, id] of ids) {
          const [round, slot] = key.split(":").map(Number);
          if (round < rounds)
            await db.query(
              "INSERT INTO fcl_playoff_links(match_id,next_id,next_side) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
              [
                id,
                ids.get(`${round + 1}:${Math.floor(slot / 2)}`),
                (slot % 2) + 1,
              ],
            );
        }
      }
      await db.query("SELECT public.fcl_advance_playoffs($1)", [s.id]);
      await audit(db, req.actor.id, "playoffs.generate", {
        season: s.id,
        count,
      });
      return { count };
    });
  });
  // The worker holds a global, renewable DB lease. Only one worker may mutate Discord.
  route("post", "/worker/claim", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const lock = await one(
        db,
        "INSERT INTO fcl_worker_lock(id,owner,expires_at) VALUES(1,$1,now()+interval '5 minutes') ON CONFLICT(id) DO UPDATE SET owner=excluded.owner,expires_at=excluded.expires_at WHERE fcl_worker_lock.expires_at<now() OR fcl_worker_lock.owner=excluded.owner RETURNING id",
        [req.body.worker],
      );
      if (!lock) return { job: null };
      const j = await one(
        db,
        "SELECT * FROM fcl_jobs WHERE (status='pending' AND available_at<=now()) OR (status='running' AND locked_until<now()) ORDER BY CASE kind WHEN 'trade' THEN 0 WHEN 'trade-result' THEN 0 WHEN 'match' THEN 1 WHEN 'team' THEN 1 ELSE 2 END,available_at,id FOR UPDATE SKIP LOCKED LIMIT 1",
      );
      if (!j) return { job: null };
      return {
        job: await one(
          db,
          "UPDATE fcl_jobs SET status='running',attempts=attempts+1,lease=$2,locked_until=now()+interval '5 minutes' WHERE id=$1 RETURNING *",
          [j.id, randomUUID()],
        ),
      };
    });
  });
  route("post", "/worker/jobs/:id/finish", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const j = await one(
        db,
        "SELECT * FROM fcl_jobs WHERE id=$1 AND lease=$2 AND status='running' AND locked_until>now() FOR UPDATE",
        [integer(req.params.id), req.body.lease],
      );
      if (!j) fail("Lease expired", 409);
      if (req.body.error) {
        await db.query(
          "UPDATE fcl_jobs SET status=CASE WHEN attempts>=10 THEN 'failed' ELSE 'pending' END,last_error=$2,available_at=now()+least(3600,power(2,attempts)::int)*interval '1 second',locked_until=NULL WHERE id=$1",
          [j.id, String(req.body.error).slice(0, 1000)],
        );
      } else
        await db.query(
          "UPDATE fcl_jobs SET status=CASE WHEN revision=$2 THEN 'done' ELSE 'pending' END,attempts=0,last_error=NULL,locked_until=NULL,available_at=now() WHERE id=$1",
          [j.id, req.body.revision],
        );
      return { success: true };
    });
  });
  route("post", "/worker/heartbeat", (req) => {
    botOnly(req);
    return tx(async (db) => {
      const lock = await one(
        db,
        "UPDATE fcl_worker_lock SET expires_at=now()+interval '5 minutes' WHERE id=1 AND owner=$1 AND expires_at>now() RETURNING id",
        [req.body.worker],
      );
      if (!lock) fail("Worker lease lost", 409);
      if (req.body.job_id)
        await db.query(
          "UPDATE fcl_jobs SET locked_until=now()+interval '5 minutes' WHERE id=$1 AND lease=$2 AND status='running'",
          [req.body.job_id, req.body.lease],
        );
      return { success: true };
    });
  });
  route("post", "/jobs/:id/retry", (req) => {
    staffOnly(req);
    return tx(async (db) => {
      await db.query(
        "UPDATE fcl_jobs SET status='pending',attempts=0,available_at=now(),last_error=NULL WHERE id=$1 AND status<>'running'",
        [integer(req.params.id)],
      );
      await audit(db, req.actor.id, "job.retry", { id: req.params.id });
      return { success: true };
    });
  });
  route("get", "/worker/resources", async (req) => {
    botOnly(req);
    return query(pool, "SELECT * FROM fcl_resources");
  });
  route("post", "/worker/resources", async (req) => {
    botOnly(req);
    await pool.query(
      "INSERT INTO fcl_resources(resource_key,discord_id,metadata) VALUES($1,$2,$3) ON CONFLICT(resource_key) DO UPDATE SET discord_id=excluded.discord_id,metadata=excluded.metadata",
      [
        String(req.body.resource_key),
        String(req.body.discord_id),
        JSON.stringify(req.body.metadata || {}),
      ],
    );
    return { success: true };
  });
  route("get", "/worker/context", async (req) => {
    botOnly(req);
    return {
      seasons: await query(pool, "SELECT * FROM fcl_seasons"),
      teams: await query(pool, "SELECT * FROM teams WHERE id>0"),
      enrollments: await query(pool, "SELECT * FROM fcl_season_teams"),
      players: await query(
        pool,
        "SELECT p.id,p.gamertag,p.team_id,i.discord_id FROM players p JOIN fcl_identities i ON i.player_id=p.id",
      ),
      gms: await query(pool, "SELECT * FROM fcl_gms"),
      matches: await query(
        pool,
        "SELECT * FROM scheduled_matches WHERE fcl_season_id IS NOT NULL",
      ),
      esubs: await query(
        pool,
        "SELECT e.*,i.discord_id FROM fcl_esubs e JOIN fcl_identities i ON i.player_id=e.player_id",
      ),
      trades: await query(
        pool,
        "SELECT t.*,a.gamertag AS offered_name,b.gamertag AS requested_name FROM fcl_trades t JOIN players a ON a.id=t.offered_player JOIN players b ON b.id=t.requested_player",
      ),
    };
  });
  route("post", "/worker/maintenance", (req) => {
    botOnly(req);
    return tx(async (db) => {
      await db.query(
        "UPDATE fcl_trades SET status='expired' WHERE status='pending' AND expires_at<now()",
      );
      // Reconciliation covers changes committed during a running sync job, role loss, and restarts.
      const members = await query(
        db,
        "SELECT discord_id FROM fcl_identities UNION SELECT discord_id FROM fcl_resources WHERE resource_key LIKE 'member:%'",
      );
      for (const m of members)
        await job(db, `member:${m.discord_id}`, "member", m);
      const matches = await query(
        db,
        "SELECT m.* FROM scheduled_matches m JOIN fcl_seasons s ON s.id=m.fcl_season_id WHERE s.status='active'",
      );
      for (const m of matches) {
        const resource = await one(
          db,
          "SELECT 1 FROM fcl_resources WHERE resource_key=$1",
          [`match:${m.id}:channel`],
        );
        if (resource)
          await job(db, `match:${m.id}`, "match", { match_id: m.id });
        if (!finished(m)) {
          const s = await season(db, m.fcl_season_id);
          const due = m.fcl_scheduled_at
            ? new Date(m.fcl_scheduled_at)
            : new Date(
                new Date(s.start_date).getTime() +
                  (m.week_number - 1) * 7 * 86400000,
              );
          const delta = due - new Date();
          if (
            (!m.fcl_scheduled_at && delta < 3 * 86400000) ||
            (m.fcl_scheduled_at && delta > 0 && delta < 86400000)
          )
            await job(
              db,
              `reminder:${m.id}:${new Date().toISOString().slice(0, 10)}`,
              "reminder",
              { match_id: m.id },
            );
        }
      }
      return { success: true };
    });
  });
  router.use((e, req, res, next) => {
    console.error("League API:", e.message);
    res.status(e.status || 500).json({
      error: e.status
        ? e.message
        : "League operation failed; check server logs",
    });
  });
  router.requireWebsiteStaff = async (req, res, next) => {
    try {
      const token = (req.headers.authorization || "").replace(
        /^Bearer\s+/i,
        "",
      );
      if (!token || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY)
        fail("Verified website sign-in required", 401);
      const response = await fetch(
        `${process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$|\/$/g, "")}/auth/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: process.env.SUPABASE_ANON_KEY,
          },
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok) fail("Website session expired", 401);
      const user = await response.json();
      const roles =
        req.params.table === "staff_roles"
          ? ["founder", "founders", "commissioner"]
          : [
              "founder",
              "founders",
              "staff",
              "commissioner",
              "admin",
              "administrator",
            ];
      if (
        !(await one(
          pool,
          "SELECT 1 FROM staff_roles WHERE user_id=$1 AND lower(role)=ANY($2::text[])",
          [user.id, roles],
        ))
      )
        fail("Authorized staff account required", 403);
      next();
    } catch (e) {
      res
        .status(e.status || 503)
        .json({ error: e.status ? e.message : "Cannot verify staff access" });
    }
  };
  return router;
}
module.exports = leagueApi;
