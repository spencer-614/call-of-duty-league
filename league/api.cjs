// Node adapter for local verification / optional Node hosting.
// Production GitHub Pages uses the same API through the league Edge Function.
const leagueApi =
  require("../supabase/functions/_shared/league-api.mjs").default;
module.exports = (pool) =>
  leagueApi(pool, process.env, require("express").Router());
