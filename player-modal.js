// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - PLAYER COMBAT DOSSIER MODAL (<dialog>)
// ==============================================================================

(function () {
  // 1. Create or get dialog element
  function getOrCreateModal() {
    let dialog = document.getElementById("player-dossier-modal");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "player-dossier-modal";
      dialog.className = "player-modal";
      dialog.setAttribute("closedby", "any");
      dialog.setAttribute("aria-labelledby", "player-modal-title");
      dialog.innerHTML = `
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="pill" id="modal-player-role">ROLE</span>
            <h2 id="modal-player-title" class="modal-gamertag">PLAYER</h2>
            <span class="modal-team-tag" id="modal-player-team">[TAG] TEAM</span>
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
    const bodyEl = document.getElementById("modal-content-body");

    // Open modal in loading state
    titleEl.textContent = "LOADING...";
    roleEl.textContent = "—";
    teamEl.textContent = "—";
    bodyEl.innerHTML = `<div style="text-align:center; padding:50px; color:var(--muted);">Decryping player combat records...</div>`;
    
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

      titleEl.textContent = gamertag;
      roleEl.textContent = role;
      teamEl.textContent = `${teamTag} ${teamName}`;

      // Calculate aggregated metrics from map stats
      const mapsPlayed = mapStats.length;
      const wins = mapStats.filter(m => m.result === "W" || m.result === "Victory").length;
      const winRate = mapsPlayed > 0 ? Math.round((wins / mapsPlayed) * 100) : 0;
      const totalDamage = mapStats.reduce((acc, m) => acc + (m.damage || 0), 0);
      const avgKillsPerMap = mapsPlayed > 0 ? (totalKills / mapsPlayed).toFixed(1) : (totalKills || 0);

      // Render Modal Body with Season Stats HUD & Map Stats Table
      bodyEl.innerHTML = `
        <!-- Season Stats Summary HUD -->
        <div class="modal-section-title">
          <span>Season Combat Summary</span>
          <span>Competitive 2026</span>
        </div>
        <div class="overall-stats-hud">
          <div class="hud-item">
            <strong>${kdr}</strong>
            <small>Season K/D Ratio</small>
          </div>
          <div class="hud-item">
            <strong>${totalKills}</strong>
            <small>Total Kills</small>
          </div>
          <div class="hud-item">
            <strong>${totalDeaths}</strong>
            <small>Total Deaths</small>
          </div>
          <div class="hud-item">
            <strong>${winRate}%</strong>
            <small>Map Win Rate (${wins}W - ${mapsPlayed - wins}L)</small>
          </div>
        </div>

        <!-- Individual Map Breakdown -->
        <div class="modal-section-title">
          <span>Individual Map Stats</span>
          <span id="map-stats-count">${mapsPlayed} Maps Recorded</span>
        </div>

        <!-- Mode Filters -->
        <div class="map-filter-tabs" id="modal-mode-tabs">
          <button type="button" class="map-tab-btn active" data-mode="all">All Modes (${mapsPlayed})</button>
          <button type="button" class="map-tab-btn" data-mode="Hardpoint">Hardpoint</button>
          <button type="button" class="map-tab-btn" data-mode="Search & Destroy">S&D</button>
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
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--muted);">No map records for ${selectedMode}.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(m => {
          const isWin = (m.result === "W" || m.result === "Victory");
          const badgeClass = isWin ? "badge-w" : "badge-l";
          const resultText = isWin ? "WIN" : "LOSS";
          const scoreText = m.score ? `<span style="color:var(--muted); font-size:10px; margin-left:4px;">${m.score}</span>` : "";
          const mapKd = Number(m.kdr || (m.deaths > 0 ? (m.kills / m.deaths) : m.kills)).toFixed(2);
          const opponent = m.opponent_team || "Opponent";
          const formattedDate = m.match_date ? new Date(m.match_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

          return `
            <tr>
              <td>
                <strong>${m.map_name}</strong>
                <span class="mode-badge">${m.game_mode}</span>
              </td>
              <td>
                <span class="${badgeClass}">${resultText}</span>
                ${scoreText}
              </td>
              <td>vs ${opponent}</td>
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
    const trigger = e.target.closest("[data-player-id]");
    if (trigger) {
      const pid = trigger.getAttribute("data-player-id");
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
