function fail(message, status = 400) {
  const e = new Error(message);
  e.status = status;
  throw e;
}
function integer(v, label = "ID") {
  if (
    !/^\d+$/.test(String(v)) ||
    !Number.isSafeInteger(Number(v)) ||
    Number(v) < 1
  )
    fail(`Invalid ${label}`);
  return Number(v);
}
function snowflake(v) {
  if (!/^\d{15,22}$/.test(String(v))) fail("Invalid Discord ID");
  return String(v);
}
const finished = (m) =>
  [
    "completed",
    "complete",
    "final",
    "cancelled",
    "canceled",
    "forfeit",
  ].includes(String(m.status).toLowerCase());
// Circle rotation; odd divisions receive a bye. Preseason rotation is independent.
function roundRobin(ids) {
  const ring = [...ids];
  if (ring.length % 2) ring.push(null);
  const rounds = [];
  for (let r = 0; r < ring.length - 1; r++) {
    const pairs = [];
    for (let i = 0; i < ring.length / 2; i++)
      if (ring[i] != null && ring[ring.length - 1 - i] != null)
        pairs.push(
          r % 2
            ? [ring[ring.length - 1 - i], ring[i]]
            : [ring[i], ring[ring.length - 1 - i]],
        );
    rounds.push(pairs);
    ring.splice(1, 0, ring.pop());
  }
  return rounds;
}
function fixtures(teams) {
  const rows = [];
  const groups = Object.groupBy(teams, (t) => t.division || "div-1");
  for (const group of Object.values(groups)) {
    if (group.length < 2)
      fail("Every participating division needs at least two teams");
    const rotation = roundRobin(group.map((t) => t.id));
    for (let week = 1; week <= 8; week++)
      for (const [a, b] of rotation[
        (week <= 2 ? week - 1 : week - 3) % rotation.length
      ])
        rows.push({ week, a, b, phase: week <= 2 ? "preseason" : "regular" });
  }
  return rows;
}
function standings(teams, matches) {
  const map = new Map(
    teams.map((t) => [
      String(t.team_id ?? t.id),
      { ...t, wins: 0, losses: 0, map_difference: 0 },
    ]),
  );
  for (const m of matches.filter(
    (m) =>
      m.season_type === "regular" &&
      finished(m) &&
      m.winner_id &&
      !["cancelled", "canceled"].includes(String(m.status).toLowerCase()),
  )) {
    const a = map.get(String(m.team1_id)),
      b = map.get(String(m.team2_id));
    if (!a || !b) continue;
    const diff = Number(m.team1_score || 0) - Number(m.team2_score || 0);
    a.map_difference += diff;
    b.map_difference -= diff;
    const winner = map.get(String(m.winner_id));
    if (winner !== a && winner !== b) continue;
    winner.wins++;
    (winner === a ? b : a).losses++;
  }
  return [...map.values()].sort(
    (a, b) =>
      b.wins - a.wins ||
      a.losses - b.losses ||
      b.map_difference - a.map_difference ||
      Number(a.team_id ?? a.id) - Number(b.team_id ?? b.id),
  );
}
function seededSlots(n) {
  let slots = [1, 2];
  while (slots.length < n) {
    const max = slots.length * 2 + 1;
    slots = slots.flatMap((s) => [s, max - s]);
  }
  return slots;
}
export {
  fail,
  integer,
  snowflake,
  finished,
  roundRobin,
  fixtures,
  standings,
  seededSlots,
};
