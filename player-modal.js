// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - PLAYER COMBAT DOSSIER MODAL (<dialog>)
// ==============================================================================

(function () {
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // 1. Create or get dialog element
  function getOrCreateModal() {
    let dialog = document.getElementById("player-dossier-modal");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "player-dossier-modal";
      dialog.className = "player-modal";
      dialog.setAttribute("closedby", "any");
      dialog.setAttribute("aria-labelledby", "modal-player-title");
      dialog.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-kicker-row">
              <span class="modal-kicker">FRONT-LINE OPS // COMBAT DOSSIER</span>
              <span class="modal-status-badge" id="modal-player-status">ACTIVE</span>
            </div>
            <div class="modal-title-group">
              <h2 id="modal-player-title" class="modal-gamertag">PLAYER</h2>
              <span class="pill" id="modal-player-role">ROLE</span>
              <span class="modal-team-tag" id="modal-player-team">[TAG] TEAM</span>
            </div>
            <div class="modal-player-meta" id="modal-player-meta"></div>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-button" aria-label="Close dossier">✕</button>
        </div>
        <div class="modal-body" id="modal-content-body">
          <div style="text-align:center; padding: 40px; color:var(--muted);">Loading combat records...</div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Close button event
      const closeBtn = dialog.querySelector("#modal-close-button");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => dialog.close());
      }

      // Modern-web-guidance fallback for browsers lacking native <dialog closedby>
      if (!("closedBy" in HTMLDialogElement.prototype)) {
        dialog.addEventListener("click", (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;
          if (!isDialogContent) dialog.close();
        });
      }
    }
    return dialog;
  }

  // 2. Open and populate player dossier modal
  async function openPlayerDossier(playerId) {
    const dialog = getOrCreateModal();
    const titleEl = document.getElementById("modal-player-title");
    const roleEl = document.getElementById("modal-player-role");
    const teamEl = document.getElementById("modal-player-team");
    const statusEl = document.getElementById("modal-player-status");
    const metaEl = document.getElementById("modal-player-meta");
    const bodyEl = document.getElementById("modal-content-body");

    // Open modal in loading state
    titleEl.textContent = "DECRYPTING...";
    roleEl.textContent = "—";
    teamEl.textContent = "—";
    if (statusEl) statusEl.textContent = "CONNECTING...";
    if (metaEl) metaEl.innerHTML = "";
    bodyEl.innerHTML = `<div style="text-align:center; padding:50px; color:var(--muted);">Loading combat records...</div>`;
    
    dialog.showModal();

    try {
      // Fetch player details and map stats
      const [player, mapStats] = await Promise.all([
        window.LeagueDB.getPlayerById(playerId),
        window.LeagueDB.getPlayerMapStats(playerId)
      ]);

      if (!player) {
        bodyEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--muted);">Player records not found.</div>`;
        return;
      }

      const teamName = player.teams?.name || player.team_name || "Free Agent";
      const teamTag = player.teams?.tag ? `[${player.teams.tag}]` : "";
      const gamertag = player.gamertag;
      const role = player.role || "Flex";
      const kdr = Number(player.kdr || 1.0).toFixed(2);
      const totalKills = player.total_kills ?? 0;
      const totalDeaths = player.total_deaths ?? 0;
      const isFreeAgent = player.status === "Free Agent" || !player.teams;

      titleEl.textContent = gamertag;
      roleEl.textContent = role;
      if (player.teams || (player.team_name && player.team_name !== "Free Agent" && player.team_name !== "Unassigned")) {
        const teamLookup = player.teams?.id || player.teams?.name || player.team_name;
        teamEl.innerHTML = `<span class="clickable-team" data-team-id="${escapeHtml(teamLookup)}" style="cursor:pointer; color:var(--lime); text-decoration:underline; text-underline-offset:3px;" title="Click to view squad dossier">${teamTag ? `${teamTag} ` : ""}${escapeHtml(teamName)} ↗</span>`;
      } else {
        teamEl.textContent = teamName;
      }

      if (statusEl) {
        statusEl.textContent = (player.status || (isFreeAgent ? "Free Agent" : "Active")).toUpperCase();
        statusEl.className = `modal-status-badge ${isFreeAgent ? "status-fa" : "status-active"}`;
      }

      if (metaEl) {
        const metaItems = [
          player.activision_id ? `<span><strong style="color:var(--lime)">ACTIVISION:</strong> ${escapeHtml(player.activision_id)}</span>` : "",
          player.discord_name ? `<span><strong style="color:var(--muted)">DISCORD:</strong> ${escapeHtml(player.discord_name)}</span>` : "",
          player.rank ? `<span><strong style="color:var(--muted)">TIER:</strong> ${escapeHtml(player.rank)}</span>` : ""
        ].filter(Boolean);
        metaEl.innerHTML = metaItems.join(`<span style="color:#ffffff25">•</span>`);
      }

      // Calculate aggregated metrics from map stats
      const mapsPlayed = mapStats.length;
      const wins = mapStats.filter(m => m.result === "W" || m.result === "Victory").length;
      const winRate = mapsPlayed > 0 ? Math.round((wins / mapsPlayed) * 100) : 0;
      const avgKillsPerMap = mapsPlayed > 0 ? (totalKills / mapsPlayed).toFixed(1) : (totalKills || 0);

      // Render Modal Body with Season Stats HUD & Map Stats Table
      bodyEl.innerHTML = `
        <!-- Season Stats Summary HUD -->
        <div class="modal-section-title">
          <div class="section-title-left">
            <span class="title-accent">//</span>
            <span>Season Combat Summary</span>
          </div>
          <span class="title-count">COMPETITIVE 2026</span>
        </div>
        <div class="overall-stats-hud">
          <div class="hud-item">
            <div class="hud-label">Season K/D Ratio</div>
            <div class="hud-value">${kdr}</div>
            <div class="hud-sub">${Number(kdr) >= 1.0 ? "POSITIVE RATIO" : "SUB-1.0 RATIO"}</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Confirmed Kills</div>
            <div class="hud-value">${Number(totalKills).toLocaleString()}</div>
            <div class="hud-sub">${avgKillsPerMap} AVG / MAP</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Combat Deaths</div>
            <div class="hud-value">${Number(totalDeaths).toLocaleString()}</div>
            <div class="hud-sub">RECORDED CASUALTIES</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Map Win Rate</div>
            <div class="hud-value">${winRate}%</div>
            <div class="hud-sub">${wins}W - ${mapsPlayed - wins}L (${mapsPlayed} MAPS)</div>
          </div>
        </div>

        <!-- Individual Map Breakdown -->
        <div class="modal-section-title">
          <div class="section-title-left">
            <span class="title-accent">//</span>
            <span>Individual Map Stats</span>
          </div>
          <span class="title-count" id="map-stats-count">${mapsPlayed} Maps Recorded</span>
        </div>

        <!-- Mode Filters -->
        <div class="map-filter-tabs" id="modal-mode-tabs">
          <button type="button" class="map-tab-btn active" data-mode="all">All Modes (${mapsPlayed})</button>
          <button type="button" class="map-tab-btn" data-mode="Hardpoint">Hardpoint</button>
          <button type="button" class="map-tab-btn" data-mode="Search & Destroy">Search & Destroy</button>
          <button type="button" class="map-tab-btn" data-mode="Control">Control</button>
        </div>

        <!-- Map Stats Table -->
        <div class="map-stats-table-wrapper">
          <table class="map-stats-table">
            <thead>
              <tr>
                <th>Map & Mode</th>
                <th>Result</th>
                <th>Opponent</th>
                <th>K - D</th>
                <th>K/D</th>
                <th>Damage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="modal-map-tbody">
              <!-- Injected by filter -->
            </tbody>
          </table>
        </div>
      `;

      // Function to render table rows based on active game mode
      function renderMapRows(selectedMode) {
        const tbody = document.getElementById("modal-map-tbody");
        const countSpan = document.getElementById("map-stats-count");
        if (!tbody) return;

        const filtered = selectedMode === "all"
          ? mapStats
          : mapStats.filter(m => m.game_mode?.toLowerCase() === selectedMode.toLowerCase());

        countSpan.textContent = `${filtered.length} Maps Displayed`;

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--muted);">No map records for ${escapeHtml(selectedMode)}.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(m => {
          const isWin = (m.result === "W" || m.result === "Victory");
          const badgeClass = isWin ? "badge-w" : "badge-l";
          const resultText = isWin ? "WIN" : "LOSS";
          const scoreText = m.score ? `<span style="color:var(--muted); font-size:10px; margin-left:4px;">${escapeHtml(m.score)}</span>` : "";
          const mapKd = Number(m.kdr || (m.deaths > 0 ? (m.kills / m.deaths) : m.kills)).toFixed(2);
          const opponent = m.opponent_team || "Opponent";
          const formattedDate = m.match_date ? new Date(m.match_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

          return `
            <tr>
              <td>
                <div class="map-name-cell">
                  <strong>${escapeHtml(m.map_name)}</strong>
                  <span class="mode-badge">${escapeHtml(m.game_mode)}</span>
                </div>
              </td>
              <td>
                <div style="display:flex; align-items:center;">
                  <span class="${badgeClass}">${resultText}</span>
                  ${scoreText}
                </div>
              </td>
              <td>vs ${escapeHtml(opponent)}</td>
              <td><strong>${m.kills}</strong> - ${m.deaths}</td>
              <td style="color:${Number(mapKd) >= 1.0 ? 'var(--lime)' : '#ff6b6b'}; font-weight:bold;">${mapKd}</td>
              <td>${(m.damage || 0).toLocaleString()}</td>
              <td style="color:var(--muted); font-size:10px;">${formattedDate}</td>
            </tr>
          `;
        }).join("");
      }

      // Attach mode filter tab click events
      document.querySelectorAll("#modal-mode-tabs .map-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#modal-mode-tabs .map-tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          renderMapRows(btn.getAttribute("data-mode"));
        });
      });

      // Initial table render
      renderMapRows("all");

    } catch (err) {
      console.error("Error displaying player dossier:", err);
      bodyEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--muted);">Unable to load player statistics.</div>`;
    }
  }

  // 3. Global export
  window.openPlayerDossier = openPlayerDossier;

  // 4. Delegate click on any element with data-player-id or inside .clickable-player
  document.addEventListener("click", (e) => {
    const playerTrigger = e.target.closest("[data-player-id]");
    const teamTrigger = e.target.closest("[data-team-id]");

    // If click was on a team trigger inside this element, let team modal handle it
    if (playerTrigger && teamTrigger && playerTrigger.contains(teamTrigger)) {
      return;
    }

    if (playerTrigger) {
      const pid = playerTrigger.getAttribute("data-player-id");
      if (pid) {
        e.preventDefault();
        openPlayerDossier(pid);
      }
    }
  });

  // 5. Check URL parameters for direct link (e.g. ?player=1 or ?player=Apex)
  window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const paramPlayer = params.get("player") || params.get("playerId");
    if (paramPlayer) {
      if (/^\d+$/.test(paramPlayer)) {
        openPlayerDossier(paramPlayer);
      } else {
        // Look up by gamertag
        try {
          const players = await window.LeagueDB.getPlayers();
          const found = players.find(p => p.gamertag.toLowerCase() === paramPlayer.toLowerCase());
          if (found) openPlayerDossier(found.id);
        } catch (_) {}
      }
    }
  });
})();
