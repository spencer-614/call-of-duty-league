/* ==============================================================================
   Frontline Tournaments — Live Bracket Map Pick & Veto Engine
   Supports CDL 2026 / Black Ops Maps: Search & Destroy, Overload, Hardpoint
   Only available when tournament bracket is LIVE.
   ============================================================================== */
(function() {
  const CDL_TOURNAMENT_MAP_POOL = {
    Hardpoint: [
      { name: "Colossus" },
      { name: "Den" },
      { name: "Gridlock" },
      { name: "Hacienda" },
      { name: "Sake" },
      { name: "Scar" }
    ],
    SearchAndDestroy: [
      { name: "Den" },
      { name: "Fringe" },
      { name: "Gridlock" },
      { name: "Hacienda" },
      { name: "Raid" },
      { name: "Sake" }
    ],
    Overload: [
      { name: "Den" },
      { name: "Exposure" },
      { name: "Gridlock" },
      { name: "Scar" }
    ]
  };

  function createFreshVetoSeries() {
    return [
      { game: 1, mode: "Hardpoint", map: null, status: "pending", pool: CDL_TOURNAMENT_MAP_POOL.Hardpoint.map(m => ({ name: m.name })), struckBy: [] },
      { game: 2, mode: "Search & Destroy", map: null, status: "pending", pool: CDL_TOURNAMENT_MAP_POOL.SearchAndDestroy.map(m => ({ name: m.name })), struckBy: [] },
      { game: 3, mode: "Overload", map: null, status: "pending", pool: CDL_TOURNAMENT_MAP_POOL.Overload.map(m => ({ name: m.name })), struckBy: [] },
      { game: 4, mode: "Hardpoint", map: null, status: "pending", pool: CDL_TOURNAMENT_MAP_POOL.Hardpoint.map(m => ({ name: m.name })), struckBy: [] },
      { game: 5, mode: "Search & Destroy", map: null, status: "pending", pool: CDL_TOURNAMENT_MAP_POOL.SearchAndDestroy.map(m => ({ name: m.name })), struckBy: [] }
    ];
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.TournamentVeto = {
    pool: CDL_TOURNAMENT_MAP_POOL,

    async mount(hostEl, tournament, match, userContext) {
      if (!hostEl) return;
      hostEl.innerHTML = '';

      if (!tournament || !match) {
        return;
      }

      // Check if tournament bracket is LIVE. The veto tool shouldn't pop up until bracket is LIVE!
      const tourneyStatus = String(tournament.status || '').toLowerCase();
      const matchStatus = String(match.status || '').toLowerCase();
      const isTourneyLive = tourneyStatus.includes('live') || (tournament.bracket_data && !tourneyStatus.includes('upcoming') && !tourneyStatus.includes('open'));
      const isMatchPlayable = isTourneyLive || matchStatus.includes('live') || matchStatus.includes('in_progress');

      if (!isMatchPlayable) {
        // Tournament is not live yet - show locked info banner
        const lockedBox = document.createElement('div');
        lockedBox.style.cssText = 'background:#12140e; border:1px solid #282f1b; padding:16px; border-radius:3px; margin:16px 0; display:flex; align-items:center; gap:12px;';
        lockedBox.innerHTML = `
          <div style="font-size:24px;">🔒</div>
          <div>
            <div style="font:800 12px var(--body); color:#fbbf24; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:2px;">
              MAP PICK &amp; VETO DIRECTIVE ARMED
            </div>
            <div style="font-size:12px; color:#9ca3af; line-height:1.5;">
              The interactive map veto and coin toss tool will activate automatically as soon as this tournament bracket goes <strong>LIVE</strong>.
            </div>
          </div>
        `;
        hostEl.appendChild(lockedBox);
        return;
      }

      const t1 = match.team1 || { name: 'Team 1', tag: 'T1' };
      const t2 = match.team2 || { name: 'Team 2', tag: 'T2' };

      // Root card
      const wrapper = document.createElement('div');
      wrapper.className = 'tournament-veto-root';
      wrapper.style.cssText = 'background:#0d100a; border:1px solid #2f381c; border-left:4px solid #fbbf24; padding:18px; border-radius:3px; margin:16px 0; position:relative;';

      wrapper.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px; border-bottom:1px solid #232a15; padding-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">⚔</span>
            <span style="font:800 13px var(--body); color:#fbbf24; text-transform:uppercase; letter-spacing:0.8px;">
              OFFICIAL CDL MAP PICK &amp; VETO SYSTEM
            </span>
            <span style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#f87171; font:800 10px var(--body); padding:2px 6px; border-radius:2px; text-transform:uppercase;">
              LIVE BRACKET ACTIVE
            </span>
          </div>
          <div id="veto-live-status-pill" style="font-size:11px; color:#cbd5e1;"></div>
        </div>

        <!-- Coin Toss Bar -->
        <div id="veto-coin-bar" style="background:#13180e; border:1px solid #2d381c; border-radius:3px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div id="veto-coin-disc" style="width:36px; height:36px; border-radius:50%; background:#241d08; border:2px solid #fbbf24; display:flex; align-items:center; justify-content:center; font:900 10px var(--body); color:#fbbf24; box-shadow:0 0 10px rgba(251,191,36,0.3); transition:transform 0.8s ease;">
              🪙
            </div>
            <div>
              <div style="font:800 11.5px var(--body); color:#ffffff; text-transform:uppercase;">COIN FLIP (FIRST STRIKE ADVANTAGE)</div>
              <div id="veto-coin-text" style="font-size:11px; color:#9ca3af;">Awaiting coin toss to establish veto order.</div>
            </div>
          </div>
          <div id="veto-coin-actions" style="display:flex; gap:8px;"></div>
        </div>

        <!-- Turn Banner -->
        <div id="veto-turn-hud" style="background:#171d10; border-left:3px solid #22c55e; border:1px solid #2f3b1c; padding:10px 14px; font:800 12.5px var(--body); color:#fff; text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span id="veto-turn-msg">Loading veto rotation...</span>
          <div id="veto-admin-actions" style="display:flex; gap:6px;"></div>
        </div>

        <!-- 5-Game Series Card Deck -->
        <div id="veto-series-cards" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:16px;"></div>

        <!-- Copy and Quick Share Strip -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-top:1px solid #212814; padding-top:12px;">
          <div style="font-size:11px; color:#6b7280;">Best of 5 Rotation: HP ➔ SnD ➔ Overload ➔ HP ➔ SnD</div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-tourney-outline" id="btn-veto-copy-rotation" style="font-size:11px; padding:5px 12px;">
              📋 Copy Match Rotation
            </button>
          </div>
        </div>
      `;

      hostEl.appendChild(wrapper);

      // State Management
      let vetoState = {
        series: createFreshVetoSeries(),
        coinFlipped: false,
        coinWinner: 'team_a',
        vetoStep: 0,
        version: 0,
        updated_at: new Date().toISOString()
      };

      // Load existing state from cloud / localStorage
      try {
        if (window.LeagueDB && typeof window.LeagueDB.getTournamentMatchVeto === 'function') {
          const remoteVeto = await window.LeagueDB.getTournamentMatchVeto(tournament.id, match.id);
          if (remoteVeto && Array.isArray(remoteVeto.series) && remoteVeto.series.length > 0) {
            vetoState = remoteVeto;
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing tournament veto:', err);
      }

      // Never infer veto ownership from display names or client-side staff flags.
      const c = window.supabaseClient || window.dbClient;
      let ownTeam = null, isStaff = false;
      try {
        if (!c) throw new Error('Database unavailable.');
        const { data: auth, error: authError } = await c.auth.getUser();
        if (authError || !auth?.user) throw new Error('Sign in to veto maps.');
        isStaff = [true, 'true'].includes(auth.user.app_metadata?.tournament_admin);
        const { data: members, error } = await c.from('tournament_report_members')
          .select('team').eq('tournament_id', String(tournament.id))
          .eq('match_id', String(match.id)).eq('user_id', auth.user.id);
        if (error) throw new Error(error.message);
        if (members?.length === 1) ownTeam = members[0].team;
      } catch (error) {
        hostEl.textContent = 'Map veto: ' + error.message;
        return;
      }
      const isTeam1 = ownTeam === 1, isTeam2 = ownTeam === 2;
      const isCombatant = isTeam1 || isTeam2;
      const canManage = isStaff || isCombatant;
      let busy = false;

      function allDecided() {
        return vetoState.series.every(g => g.status === 'decided');
      }

      function getActiveTurnTeam() {
        const teamA = t1;
        const teamB = t2;
        if (vetoState.vetoStep % 2 === 0) {
          return vetoState.coinWinner === 'team_a' ? teamA : teamB;
        } else {
          return vetoState.coinWinner === 'team_a' ? teamB : teamA;
        }
      }

      function isMyTurn() {
        if (busy || allDecided() || !vetoState.coinFlipped || !isCombatant) return false;
        const first = vetoState.coinWinner === 'team_a' ? 1 : 2;
        return ownTeam === (vetoState.vetoStep % 2 === 0 ? first : 3 - first);
      }

      async function applyAction(action, game = null, map = null) {
        if (busy) return;
        busy = true;
        renderVetoUI();
        try {
          vetoState = await window.LeagueDB.tournamentVetoAction(
            tournament.id, match.id, action, vetoState.version || 0, game, map);
        } catch (error) {
          alert(error.message);
          try { const latest = await window.LeagueDB.getTournamentMatchVeto(tournament.id, match.id); if(latest) vetoState = latest; } catch (_) {}
        } finally { busy = false; renderVetoUI(); }
      }

      function renderVetoUI() {
        const coinText = wrapper.querySelector('#veto-coin-text');
        const coinActions = wrapper.querySelector('#veto-coin-actions');
        const coinDisc = wrapper.querySelector('#veto-coin-disc');
        const turnHud = wrapper.querySelector('#veto-turn-hud');
        const turnMsg = wrapper.querySelector('#veto-turn-msg');
        const cardsCont = wrapper.querySelector('#veto-series-cards');
        const adminActions = wrapper.querySelector('#veto-admin-actions');

        // 1. Coin Flip section
        if (vetoState.coinFlipped) {
          const winnerTeam = vetoState.coinWinner === 'team_a' ? t1 : t2;
          coinText.innerHTML = `🪙 <strong style="color:#22c55e;">${esc(winnerTeam.name)}</strong> won the coin toss (First strike advantage)`;
          coinDisc.innerHTML = vetoState.coinWinner === 'team_a' ? 'H' : 'T';
          coinDisc.style.background = '#152514';
          coinDisc.style.borderColor = '#22c55e';
          coinDisc.style.color = '#4ade80';
          
          if (isStaff) {
            coinActions.innerHTML = `
              <button type="button" class="btn-tourney-outline" id="btn-admin-reset-coin" style="font-size:10.5px; padding:3px 9px; color:#f87171; border-color:#7f1d1d;" title="Only Tournament Admins can reset the coin flip">
                🔄 Reset Coin Toss
              </button>
            `;
            wrapper.querySelector('#btn-admin-reset-coin')?.addEventListener('click', handleResetCoin);
          } else {
            coinActions.innerHTML = `<span style="font-size:10.5px; color:#6b7280; font-style:italic;">Coin Toss Confirmed</span>`;
          }
        } else {
          coinText.textContent = `Coin toss required to determine first strike advantage between ${t1.name} and ${t2.name}.`;
          if (canManage && !busy) {
            coinActions.innerHTML = `
              <button type="button" class="btn-tourney-primary" id="btn-toss-coin" style="font-size:11px; padding:4px 10px;">
                Flip Coin 🪙
              </button>
            `;
            wrapper.querySelector('#btn-toss-coin')?.addEventListener('click', handleCoinFlip);
          } else {
            coinActions.innerHTML = `<span style="font-size:11px; color:#9ca3af;">Awaiting team captains...</span>`;
          }
        }

        // 2. Turn HUD
        if (allDecided()) {
          turnHud.style.borderLeftColor = '#22c55e';
          turnHud.style.background = '#141c10';
          turnMsg.innerHTML = `🏁 <span style="color:#4ade80;">OFFICIAL SERIES ROTATION LOCKED IN</span> — Ready to Launch Match`;
        } else if (!vetoState.coinFlipped) {
          turnHud.style.borderLeftColor = '#fbbf24';
          turnHud.style.background = '#1b190f';
          turnMsg.innerHTML = `🪙 <span style="color:#fbbf24;">AWAITING COIN FLIP</span> — Flip the coin above to establish turn order.`;
        } else {
          const activeTeam = getActiveTurnTeam();
          const curGame = vetoState.series.find(g => g.status !== 'decided') || vetoState.series[0];
          const myTurn = isMyTurn();

          if (myTurn) {
            turnHud.style.borderLeftColor = '#22c55e';
            turnHud.style.background = 'rgba(34,197,94,0.1)';
            turnMsg.innerHTML = `👉 <strong style="color:#4ade80;">YOUR TURN (${esc(activeTeam.name)})</strong> — Select a map to strike for <span style="color:#ffffff;">Game ${curGame.game} (${curGame.mode})</span>`;
          } else if (isCombatant) {
            turnHud.style.borderLeftColor = '#ef4444';
            turnHud.style.background = 'rgba(239,68,68,0.08)';
            turnMsg.innerHTML = `⏳ <strong style="color:#f87171;">WAITING FOR ${esc(activeTeam.name).toUpperCase()} TO VETO</strong> — Your controls are locked until their pick is made.`;
          } else {
            turnHud.style.borderLeftColor = '#fbbf24';
            turnHud.style.background = '#171d10';
            turnMsg.innerHTML = `👉 <strong style="color:#fbbf24;">${esc(activeTeam.name)}'s</strong> Turn to Strike Map for <span style="color:#ffffff;">Game ${curGame.game} (${curGame.mode})</span>`;
          }
        }

        // Admin actions (Reset / Auto-fill)
        if (isStaff) {
          adminActions.innerHTML = `

            <button type="button" id="btn-veto-reset" class="btn-tourney-outline" style="font-size:10px; padding:2px 8px; color:#f87171;" title="Reset veto to initial state">Reset All</button>
          `;
          wrapper.querySelector('#btn-veto-auto')?.addEventListener('click', handleAutoVeto);
          wrapper.querySelector('#btn-veto-reset')?.addEventListener('click', handleResetVeto);
        }

        // 3. Render Series Cards in strict sequential order
        const currentPendingGame = vetoState.series.find(g => g.status !== 'decided');
        const myTurn = isMyTurn();

        cardsCont.innerHTML = vetoState.series.map(game => {
          const isDecided = game.status === 'decided';
          const decidedMap = game.map || (isDecided ? game.pool[0] : null);
          const isCurrentActive = currentPendingGame && currentPendingGame.game === game.game;
          const isUpcomingLocked = !isDecided && !isCurrentActive;

          return `
            <div style="background:#12160e; border:1px solid ${isDecided ? '#22c55e' : (isCurrentActive ? '#fbbf24' : '#232b17')}; border-radius:3px; padding:12px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:${isCurrentActive ? '0 0 14px rgba(251,191,36,0.15)' : 'none'}; opacity:${isUpcomingLocked ? '0.55' : '1'};">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font:800 10.5px var(--body); color:#fbbf24; text-transform:uppercase;">GAME ${game.game}</span>
                  <span style="font:800 9.5px var(--body); padding:1px 5px; border-radius:2px; ${isDecided ? 'background:rgba(34,197,94,0.15); border:1px solid #22c55e; color:#4ade80;' : (isCurrentActive ? 'background:rgba(251,191,36,0.15); border:1px solid #fbbf24; color:#fbbf24;' : 'background:#1b2212; color:#6b7280;')}">
                    ${isDecided ? 'LOCKED IN' : (isCurrentActive ? 'VETO ACTIVE' : 'QUEUED')}
                  </span>
                </div>
                <div style="font:800 14px var(--body); color:#ffffff; margin-bottom:2px;">
                  ${isDecided ? esc(decidedMap.name) : esc(game.mode)}
                </div>
                <div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">
                  ${isDecided ? `Mode: ${esc(game.mode)}` : (isCurrentActive ? `${game.pool.length} maps in active pool` : `Queued after Game ${game.game - 1}`)}
                </div>

                <!-- Map options list -->
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                  ${game.pool.map(m => {
                    const isStruck = (game.struckBy || []).some(s => s.mapName === m.name);
                    const isPicked = game.map && game.map.name === m.name;

                    if (isPicked) {
                      return `<span style="display:inline-block; font-size:11px; font-weight:800; background:rgba(34,197,94,0.15); border:1px solid #22c55e; color:#4ade80; padding:2px 7px; border-radius:2px;">✓ ${esc(m.name)} (LOCKED)</span>`;
                    }
                    if (isStruck) {
                      return `<span style="display:inline-block; font-size:11px; color:#6b7280; text-decoration:line-through; padding:2px 5px;">✕ ${esc(m.name)}</span>`;
                    }

                    // Strike button - strictly clickable ONLY if current active game AND is my turn AND coin flipped!
                    const canStrikeThis = isCurrentActive && myTurn && vetoState.coinFlipped;
                    return `
                      <button type="button" class="btn-veto-strike-map" data-game="${game.game}" data-map="${esc(m.name)}" ${canStrikeThis ? '' : 'disabled'} style="background:${canStrikeThis ? '#1f2814' : '#14180e'}; border:1px solid ${canStrikeThis ? '#eab308' : '#28321a'}; color:${canStrikeThis ? '#ffffff' : '#6b7280'}; padding:3px 7px; border-radius:2px; font-size:11px; font-weight:700; cursor:${canStrikeThis ? 'pointer' : 'not-allowed'}; pointer-events:${canStrikeThis ? 'auto' : 'none'}; opacity:${canStrikeThis ? '1' : '0.45'}; display:inline-flex; align-items:center; gap:4px;">
                        <span style="color:#ef4444;">✕</span> ${esc(m.name)}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              ${(game.struckBy && game.struckBy.length > 0) ? `
                <div style="font-size:10px; color:#6b7280; margin-top:10px; border-top:1px solid #1c2212; padding-top:4px;">
                  Last Ban: ${esc(game.struckBy[game.struckBy.length - 1].teamName)} struck ${esc(game.struckBy[game.struckBy.length - 1].mapName)}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        // Wire strike click listeners
        cardsCont.querySelectorAll('.btn-veto-strike-map:not([disabled])').forEach(btn => {
          btn.addEventListener('click', () => {
            const gNum = Number(btn.getAttribute('data-game'));
            const mMap = btn.getAttribute('data-map');
            handleStrikeMap(gNum, mMap);
          });
        });
      }

      async function handleCoinFlip() {
        if (!canManage || busy || vetoState.coinFlipped) return;
        await applyAction('coin');
      }

      async function handleResetCoin() {
        if (!isStaff || busy) return;
        if (confirm('Reset the coin flip and all vetoes for this match?')) await applyAction('reset');
      }

      async function handleStrikeMap(gameNumber, mapName) {
        if (!isMyTurn()) { alert("It is not your team's turn to veto."); return; }
        const active = vetoState.series.find(g => g.status !== 'decided');
        if (!active || active.game !== gameNumber || !active.pool.some(m=>m.name===mapName)) return;
        await applyAction('strike', gameNumber, mapName);
      }

      async function handleAutoVeto() {
        alert('Auto-fill is disabled: teams must alternate their vetoes.');
      }

      async function handleResetVeto() { await handleResetCoin(); }

      function copyRotation() {
        const lines = [
          `🏆 FRONTLINE TOURNAMENTS — CDL MAP ROTATION`,
          `⚔ Match: ${t1.name} vs ${t2.name}`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        ];
        vetoState.series.forEach(g => {
          const mapName = g.map ? g.map.name : (g.status === 'decided' ? g.pool[0].name : 'VETO IN PROGRESS');
          lines.push(`Game ${g.game}: [${g.mode}] — ${mapName}`);
        });
        lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        lines.push(`Official Map Veto via Frontline Tournaments Hub`);

        navigator.clipboard.writeText(lines.join('\n')).then(() => {
          alert('📋 CDL Map Rotation copied to clipboard! Paste directly into your match chat.');
        }).catch(() => {
          alert(lines.join('\n'));
        });
      }

      wrapper.querySelector('#btn-veto-copy-rotation')?.addEventListener('click', copyRotation);

      // Listen for remote updates
      const onVetoUpdated = (e) => {
        if (String(e.detail?.tournamentId) === String(tournament.id) && String(e.detail?.matchId) === String(match.id)) {
          if (e.detail.vetoData && (e.detail.vetoData.version || 0) >= (vetoState.version || 0)) {
            const incoming = e.detail.vetoData;
            const hasChanged = incoming.coinFlipped !== vetoState.coinFlipped ||
                               incoming.coinWinner !== vetoState.coinWinner ||
                               incoming.vetoStep !== vetoState.vetoStep ||
                               JSON.stringify(incoming.series) !== JSON.stringify(vetoState.series);
            if (hasChanged) {
              vetoState = incoming;
              renderVetoUI();
            }
          }
        }
      };
      window.addEventListener('frontline_match_veto_updated', onVetoUpdated);

      // Initial Render
      renderVetoUI();

      // Periodic poll while dialog is open (1.5s for fast live sync)
      const pollInterval = setInterval(async () => {
        if (!hostEl.isConnected) {
          clearInterval(pollInterval);
          window.removeEventListener('frontline_match_veto_updated', onVetoUpdated);
          return;
        }
        if (window.LeagueDB && typeof window.LeagueDB.getTournamentMatchVeto === 'function') {
          try {
            const fresh = await window.LeagueDB.getTournamentMatchVeto(tournament.id, match.id);
            if (fresh && !busy && (fresh.version || 0) >= (vetoState.version || 0)) {
              const hasChanged = fresh.coinFlipped !== vetoState.coinFlipped ||
                                 fresh.coinWinner !== vetoState.coinWinner ||
                                 fresh.vetoStep !== vetoState.vetoStep ||
                                 JSON.stringify(fresh.series) !== JSON.stringify(vetoState.series);
              if (hasChanged) {
                vetoState = fresh;
                renderVetoUI();
              }
            }
          } catch (_) {}
        }
      }, 1500);
    }
  };
})();
