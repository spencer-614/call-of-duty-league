// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - TEAM DOSSIER & MAP TELEMETRY MODAL (<dialog>)
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

  // 1. Create or retrieve dialog element
  function getOrCreateModal() {
    let dialog = document.getElementById("team-dossier-modal");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "team-dossier-modal";
      dialog.className = "team-modal";
      dialog.setAttribute("closedby", "any");
      dialog.setAttribute("aria-labelledby", "modal-team-title");
      dialog.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-kicker-row">
              <span class="modal-kicker">FRONT-LINE OPS // SQUAD COMBAT DOSSIER</span>
              <span class="modal-status-badge status-active" id="modal-team-status">ACTIVE FRANCHISE</span>
            </div>
            <div class="modal-title-group">
              <span class="team-tag-badge" id="modal-team-tag">TAG</span>
              <h2 id="modal-team-title" class="modal-gamertag">TEAM NAME</h2>
              <span class="pill" id="modal-team-record">0W - 0L</span>
              <span class="pill" id="modal-team-points" style="color:var(--text); background:#ffffff10; border-color:#ffffff20;">0 PTS</span>
            </div>
            <div class="modal-player-meta" id="modal-team-meta"></div>
          </div>
          <button type="button" class="modal-close-btn" id="modal-team-close-button" aria-label="Close dossier">✕</button>
        </div>
        <div class="modal-body" id="modal-team-content-body">
          <div style="text-align:center; padding: 40px; color:var(--muted);">Loading squad telemetry & map records...</div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Close button event
      const closeBtn = dialog.querySelector("#modal-team-close-button");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => dialog.close());
      }

      // Unlock scrolling when dialog closes or is cancelled
      dialog.addEventListener("close", () => {
        if (!document.querySelector("dialog[open]")) {
          document.documentElement.classList.remove("modal-open");
          document.body.classList.remove("modal-open");
        }
      });
      dialog.addEventListener("cancel", () => {
        if (!document.querySelector("dialog[open]")) {
          document.documentElement.classList.remove("modal-open");
          document.body.classList.remove("modal-open");
        }
      });

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

  // 2. Open and populate team dossier modal
  async function openTeamDossier(teamId) {
    const dialog = getOrCreateModal();
    const titleEl = document.getElementById("modal-team-title");
    const tagEl = document.getElementById("modal-team-tag");
    const recordEl = document.getElementById("modal-team-record");
    const pointsEl = document.getElementById("modal-team-points");
    const statusEl = document.getElementById("modal-team-status");
    const metaEl = document.getElementById("modal-team-meta");
    const bodyEl = document.getElementById("modal-team-content-body");

    // Open in loading state and lock background scrolling
    titleEl.textContent = "DECRYPTING SQUAD...";
    tagEl.textContent = "···";
    recordEl.textContent = "—";
    pointsEl.textContent = "—";
    if (statusEl) statusEl.textContent = "CONNECTING...";
    if (metaEl) metaEl.innerHTML = "";
    bodyEl.innerHTML = `<div style="text-align:center; padding:50px; color:var(--muted);">Retrieving team records and map telemetry...</div>`;

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    dialog.showModal();

    try {
      // Fetch team details and map telemetry
      const [team, telemetry] = await Promise.all([
        window.LeagueDB.getTeamById(teamId),
        window.LeagueDB.getTeamMapRecords(teamId)
      ]);

      if (!team) {
        bodyEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--muted);">Team record not found.</div>`;
        return;
      }

      const teamName = team.name || "Squad";
      const teamTag = team.tag || "TAG";
      const matchWins = team.wins ?? 0;
      const matchLosses = team.losses ?? 0;
      const points = team.points ?? 0;
      const matchTotal = matchWins + matchLosses;
      const matchWinRate = matchTotal > 0 ? Math.round((matchWins / matchTotal) * 100) : 0;
      const players = team.players || [];

      // Telemetry info
      const modes = (telemetry && telemetry.modes) || {
        hardpoint: { wins: 0, losses: 0, win_rate: 0, avg_score: "—" },
        snd: { wins: 0, losses: 0, win_rate: 0, avg_score: "—" },
        control: { wins: 0, losses: 0, win_rate: 0, avg_score: "—" }
      };
      const mapList = (telemetry && telemetry.maps) || [];

      // Update Header
      titleEl.textContent = teamName;
      tagEl.textContent = teamTag;
      recordEl.textContent = `${matchWins}W - ${matchLosses}L (${matchWinRate}%)`;
      pointsEl.textContent = `${points} PTS`;
      if (statusEl) {
        statusEl.textContent = "ACTIVE FRANCHISE";
        statusEl.className = "modal-status-badge status-active";
      }

      if (metaEl) {
        metaEl.innerHTML = `
          <span><strong style="color:var(--lime)">ROSTER STRENGTH:</strong> ${players.length} Active Players</span>
          <span style="color:#ffffff25">•</span>
          <span><strong style="color:var(--muted)">DIVISION:</strong> CDL Pro Community</span>
          <span style="color:#ffffff25">•</span>
          <span><strong style="color:var(--lime)">SEASON:</strong> 2026 Competitive</span>
        `;
      }

      // Compute Total Map Record
      const totalMapWins = (telemetry && telemetry.overall && telemetry.overall.map_wins) != null
        ? telemetry.overall.map_wins
        : mapList.reduce((acc, m) => acc + (m.wins || 0), 0);
      const totalMapLosses = (telemetry && telemetry.overall && telemetry.overall.map_losses) != null
        ? telemetry.overall.map_losses
        : mapList.reduce((acc, m) => acc + (m.losses || 0), 0);
      const totalMapsPlayed = totalMapWins + totalMapLosses;
      const totalMapWinRate = totalMapsPlayed > 0 ? Math.round((totalMapWins / totalMapsPlayed) * 100) : matchWinRate;

      // Render Active Roster Mini-Cards
      const rosterCardsHtml = players.length > 0
        ? players.map(p => `
            <div class="team-modal-player-card clickable-player" data-player-id="${p.id}" title="Click to view ${escapeHtml(p.gamertag)}'s combat dossier">
              <div class="player-mini-top">
                <span class="pill">${escapeHtml(p.role || 'Flex')}</span>
                <span style="color:var(--lime); font-size:10px; font-weight:800;">${Number(p.kdr || 1.0).toFixed(2)} K/D</span>
              </div>
              <div class="player-modal-gt">${escapeHtml(p.gamertag)}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:9px; color:var(--muted);">
                <span>${(p.total_kills ?? 0).toLocaleString()} Kills</span>
                <span style="color:var(--lime); font-weight:bold;">VIEW DOSSIER ↗</span>
              </div>
            </div>
          `).join('')
        : `<div class="empty-roster" style="grid-column:1/-1;">No players currently signed to this team.</div>`;

      // Render Modal Body
      bodyEl.innerHTML = `
        <!-- Section 1: Season Records & Game Mode Telemetry HUD -->
        <div class="modal-section-title">
          <div class="section-title-left">
            <span class="title-accent">//</span>
            <span>Game Mode & Season Win/Loss Telemetry</span>
          </div>
          <span class="title-count">COMPETITIVE METRICS</span>
        </div>

        <div class="overall-stats-hud team-mode-grid">
          <div class="hud-item highlight-card">
            <div class="hud-label">Match Series Record</div>
            <div class="hud-value">${matchWins}W - ${matchLosses}L</div>
            <div class="hud-sub">${matchWinRate}% WIN RATE &nbsp;|&nbsp; ${totalMapWins}W-${totalMapLosses}L MAPS</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Hardpoint (HP)</div>
            <div class="hud-value">${modes.hardpoint.wins}W - ${modes.hardpoint.losses}L</div>
            <div class="hud-sub">${modes.hardpoint.win_rate}% WIN RATE &nbsp;|&nbsp; ${escapeHtml(modes.hardpoint.avg_score || '250 Pts')}</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Search & Destroy (S&D)</div>
            <div class="hud-value">${modes.snd.wins}W - ${modes.snd.losses}L</div>
            <div class="hud-sub">${modes.snd.win_rate}% WIN RATE &nbsp;|&nbsp; ${escapeHtml(modes.snd.avg_score || 'Round Win')}</div>
          </div>
          <div class="hud-item">
            <div class="hud-label">Control (CTL)</div>
            <div class="hud-value">${modes.control.wins}W - ${modes.control.losses}L</div>
            <div class="hud-sub">${modes.control.win_rate}% WIN RATE &nbsp;|&nbsp; ${escapeHtml(modes.control.avg_score || '3-2 Avg')}</div>
          </div>
        </div>

        <!-- Section 2: Active Roster Lineup -->
        <div class="modal-section-title">
          <div class="section-title-left">
            <span class="title-accent">//</span>
            <span>Active Squad Lineup (${players.length})</span>
          </div>
          <span class="title-count">CLICK PLAYER TO INSPECT INDIVIDUAL DOSSIER</span>
        </div>
        <div class="team-modal-roster-grid">
          ${rosterCardsHtml}
        </div>

        <!-- Section 3: Wins / Losses For Each Map -->
        <div class="modal-section-title" style="margin-top: 24px;">
          <div class="section-title-left">
            <span class="title-accent">//</span>
            <span>Map Win / Loss Telemetry Breakdown</span>
          </div>
          <span class="title-count" id="team-map-count">${mapList.length} Maps Recorded</span>
        </div>

        <!-- Mode Filter Tabs -->
        <div class="map-filter-tabs" id="modal-team-mode-tabs">
          <button type="button" class="map-tab-btn active" data-mode="all">All Modes (${mapList.length})</button>
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
                <th>Map Record (W - L)</th>
                <th>Win Rate (%)</th>
                <th>Streak</th>
                <th>Recent Map Result / Score</th>
              </tr>
            </thead>
            <tbody id="modal-team-map-tbody">
              <!-- Injected by filter -->
            </tbody>
          </table>
        </div>
      `;

      // Function to render table rows based on active filter
      function renderMapRows(selectedMode) {
        const tbody = document.getElementById("modal-team-map-tbody");
        const countSpan = document.getElementById("team-map-count");
        if (!tbody) return;

        const filtered = selectedMode === "all"
          ? mapList
          : mapList.filter(m => m.game_mode?.toLowerCase() === selectedMode.toLowerCase());

        countSpan.textContent = `${filtered.length} Maps Displayed`;

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--muted);">No map telemetry recorded for ${escapeHtml(selectedMode)}.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(m => {
          const wins = m.wins ?? 0;
          const losses = m.losses ?? 0;
          const total = wins + losses;
          const rate = total > 0 ? (m.win_rate != null ? m.win_rate : Math.round((wins / total) * 100)) : 0;
          const isWinning = wins > losses || (wins > 0 && losses === 0);
          const streakText = m.streak || (isWinning ? `${wins}W` : `${losses}L`);
          const recentResult = m.recent_result || (m.recent_score?.startsWith("W") ? "W" : (m.recent_score?.startsWith("L") ? "L" : (isWinning ? "W" : "L")));
          const recentBadgeClass = recentResult === "W" ? "badge-w" : "badge-l";

          return `
            <tr>
              <td>
                <div class="map-name-cell">
                  <strong>${escapeHtml(m.map_name)}</strong>
                  <span class="mode-badge">${escapeHtml(m.game_mode)}</span>
                </div>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="badge-w">${wins}W</span>
                  <span style="color:var(--muted); font-weight:bold;">-</span>
                  <span class="badge-l">${losses}L</span>
                </div>
              </td>
              <td>
                <strong style="color:${rate >= 50 ? 'var(--lime)' : '#ff6b6b'}; font-size:13px; font-family:var(--display);">
                  ${rate}%
                </strong>
                <span style="font-size:9px; color:var(--muted); margin-left:4px;">(${wins}/${total})</span>
              </td>
              <td>
                <span class="pill" style="float:none; padding:2px 6px; font-size:8px; border-color:#ffffff15;">
                  ${escapeHtml(streakText)}
                </span>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="${recentBadgeClass}">${recentResult}</span>
                  <span style="color:var(--text); font-weight:bold;">${escapeHtml(m.recent_score || '—')}</span>
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }

      // Attach mode filter tab click events
      document.querySelectorAll("#modal-team-mode-tabs .map-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#modal-team-mode-tabs .map-tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          renderMapRows(btn.getAttribute("data-mode"));
        });
      });

      // Initial table render
      renderMapRows("all");

    } catch (err) {
      console.error("Error displaying team dossier:", err);
      bodyEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--muted);">Unable to load team statistics at this time.</div>`;
    }
  }

  // 3. Global export
  window.openTeamDossier = openTeamDossier;

  // 4. Delegate click on any element with data-team-id
  document.addEventListener("click", (e) => {
    const teamTrigger = e.target.closest("[data-team-id]");
    const playerTrigger = e.target.closest("[data-player-id]");

    // If click was on a player trigger inside this element, let player modal handle it
    if (teamTrigger && playerTrigger && teamTrigger.contains(playerTrigger)) {
      return;
    }

    if (teamTrigger) {
      const tid = teamTrigger.getAttribute("data-team-id");
      if (tid) {
        e.preventDefault();
        openTeamDossier(tid);
      }
    }
  });

  // 5. Check URL parameters for direct link (e.g. ?team=1 or ?team=NSH)
  window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const paramTeam = params.get("team") || params.get("teamId");
    if (paramTeam) {
      if (/^\d+$/.test(paramTeam)) {
        openTeamDossier(paramTeam);
      } else {
        try {
          const teams = await window.LeagueDB.getStandings();
          const found = teams.find(t => 
            (t.tag && t.tag.toLowerCase() === paramTeam.toLowerCase()) ||
            (t.name && t.name.toLowerCase() === paramTeam.toLowerCase())
          );
          if (found) openTeamDossier(found.id);
        } catch (_) {}
      }
    }
  });
})();
