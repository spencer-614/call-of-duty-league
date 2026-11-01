const $ = (id) => document.getElementById(id);
let state;
const message = (s) => ($("message").textContent = s);
async function call(path, body) {
  const client = window.supabaseClient || window.dbClient;
  const session = client && (await client.auth.getSession()).data.session;
  if (!session)
    throw Error("Sign in with Discord on the admin portal, then return here.");
  const response = await fetch(`/api/league${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const r = await response.json();
  if (!response.ok) throw Error(r.error || "Request failed");
  return r;
}
const option = (text, value) => {
  const o = document.createElement("option");
  o.textContent = text;
  o.value = value;
  return o;
};
function showTeams() {
  const s = state.seasons.find((s) => String(s.id) === $("season").value);
  $("teams").replaceChildren();
  for (const t of state.teams) {
    const label = document.createElement("label"),
      input = document.createElement("input");
    input.type = "checkbox";
    input.value = t.id;
    input.checked = state.enrollments.some(
      (e) =>
        String(e.season_id) === String(s?.id) &&
        String(e.team_id) === String(t.id),
    );
    label.append(input, document.createTextNode(`${t.name} (${t.division})`));
    $("teams").append(label);
  }
  $("seeds").replaceChildren();
  for (const t of state.enrollments.filter(
    (t) => String(t.season_id) === String(s?.id),
  )) {
    const label = document.createElement("label"),
      input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.value = t.seed_override || "";
    input.dataset.team = t.team_id;
    input.style.width = "65px";
    label.append(document.createTextNode(`${t.name} seed`), input);
    $("seeds").append(label);
  }
}

async function refresh() {
  state = await call("/state");
  const selected = $("season").value;
  $("season").replaceChildren(
    ...state.seasons.map((s) => option(`${s.name} · ${s.status}`, s.id)),
  );
  if (state.seasons.some((s) => String(s.id) === selected))
    $("season").value = selected;
  showTeams();
  $("gm-team").replaceChildren(...state.teams.map((t) => option(t.name, t.id)));
  $("gms").replaceChildren();
  for (const g of state.gms) {
    const li = document.createElement("li");
    li.textContent = `${state.teams.find((t) => String(t.id) === String(g.team_id))?.name || g.team_id}: ${g.discord_id}`;
    $("gms").append(li);
  }
  $("jobs").replaceChildren();
  for (const j of state.jobs) {
    const tr = document.createElement("tr");
    for (const text of [j.kind, j.status, j.attempts, j.last_error || ""]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.append(td);
    }
    const td = document.createElement("td");
    if (j.status === "failed") {
      const b = document.createElement("button");
      b.textContent = "Retry";
      b.onclick = () =>
        run(b, async () => {
          await call(`/jobs/${j.id}/retry`, {});
          await refresh();
          return "Retry queued";
        });
      td.append(b);
    }
    tr.append(td);
    $("jobs").append(tr);
  }
  $("audit").replaceChildren();
  for (const a of state.audit) {
    const tr = document.createElement("tr");
    for (const text of [
      new Date(a.created_at).toLocaleString(),
      a.actor_id,
      a.action,
      JSON.stringify(a.details),
    ]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.append(td);
    }
    $("audit").append(tr);
  }
}
async function run(button, fn) {
  button.disabled = true;
  try {
    message((await fn()) || "Saved.");
  } catch (e) {
    message(e.message);
  } finally {
    button.disabled = false;
  }
}
$("refresh").onclick = () =>
  run($("refresh"), async () => {
    await refresh();
    return "Refreshed.";
  });
$("season").onchange = showTeams;
$("create").onsubmit = (e) => {
  e.preventDefault();
  run(e.submitter, async () => {
    await call("/seasons", Object.fromEntries(new FormData(e.target)));
    await refresh();
    return "Season created.";
  });
};
const action = (id, fn) =>
  ($(id).onclick = () =>
    run($(id), async () => {
      const s = $("season").value;
      if (!s) throw Error("Create or select a season first.");
      const r = await fn(s);
      await refresh();
      return JSON.stringify(r);
    }));
action("enroll", (s) =>
  call(`/seasons/${s}/enroll`, {
    team_ids: [...$("teams").querySelectorAll("input:checked")].map(
      (i) => i.value,
    ),
  }),
);
action("fixtures", (s) => call(`/seasons/${s}/fixtures`, {}));
action("discord", (s) => call(`/seasons/${s}/discord`, {}));
action("week-publish", (s) =>
  call(`/seasons/${s}/weeks/${$("week").value}/discord`, {}),
);
action("playoffs", (s) => call(`/seasons/${s}/playoffs`, {}));
action("archive", (s) => call(`/seasons/${s}/archive`, {}));
for (const [id, remove] of [
  ["gm-add", false],
  ["gm-remove", true],
])
  $(id).onclick = () =>
    run($(id), async () => {
      await call("/gms", {
        team_id: $("gm-team").value,
        discord_id: $("gm-id").value.trim(),
        remove,
      });
      await refresh();
      return "GM assignments saved.";
    });
refresh()
  .then(() => message("Connected."))
  .catch((e) => message(e.message));

action("save-seeds", (s) =>
  call(`/seasons/${s}/seeds`, {
    seeds: [...$("seeds").querySelectorAll("input")].map((i) => ({
      team_id: i.dataset.team,
      seed: i.value || null,
    })),
  }),
);
