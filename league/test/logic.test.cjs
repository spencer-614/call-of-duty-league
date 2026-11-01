const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  roundRobin,
  fixtures,
  standings,
  seededSlots,
} = require("../logic.cjs");
test("round robin covers each pair once with no self-pairings or double-booking", () => {
  for (const n of [2, 3, 4, 7, 8, 17]) {
    const rounds = roundRobin(Array.from({ length: n }, (_, i) => i + 1));
    const pairs = [];
    for (const round of rounds) {
      assert.equal(new Set(round.flat()).size, round.length * 2);
      for (const [a, b] of round) {
        assert.notEqual(a, b);
        pairs.push([a, b].sort((a, b) => a - b).join(":"));
      }
    }
    assert.equal(pairs.length, (n * (n - 1)) / 2);
    assert.equal(new Set(pairs).size, pairs.length);
  }
});
test("eight weeks separate preseason and regular season and never cross divisions", () => {
  const teams = [1, 2, 3, 4, 5, 6, 7].map((id) => ({
    id,
    division: id < 5 ? "a" : "b",
  }));
  const rows = fixtures(teams);
  assert.equal(new Set(rows.map((r) => r.week)).size, 8);
  for (const r of rows) {
    assert.equal(r.phase, r.week <= 2 ? "preseason" : "regular");
    assert.equal(
      teams.find((t) => t.id === r.a).division,
      teams.find((t) => t.id === r.b).division,
    );
  }
  for (let w = 1; w <= 8; w++) {
    const week = rows.filter((r) => r.week === w);
    assert.equal(
      new Set(week.flatMap((r) => [r.a, r.b])).size,
      week.length * 2,
    );
  }
});
test("standings exclude preseason, unfinished and cancelled matches", () => {
  const teams = [1, 2].map((id) => ({ id }));
  const base = {
    team1_id: 1,
    team2_id: 2,
    winner_id: 1,
    team1_score: 3,
    team2_score: 1,
    status: "Completed",
    season_type: "regular",
  };
  const r = standings(teams, [
    base,
    { ...base, season_type: "preseason" },
    { ...base, status: "Scheduled" },
    { ...base, status: "Cancelled" },
  ]);
  assert.equal(r[0].wins, 1);
  assert.equal(r[1].losses, 1);
  assert.equal(r[0].map_difference, 2);
});
test("playoff seed positions preserve high-seed byes for non-power-of-two fields", () => {
  assert.deepEqual(seededSlots(8), [1, 8, 4, 5, 2, 7, 3, 6]);
  const slots = seededSlots(16);
  assert.equal(new Set(slots).size, 16);
  for (let i = 0; i < 16; i += 2) assert.equal(slots[i] + slots[i + 1], 17);
});
