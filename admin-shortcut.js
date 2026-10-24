// Frontline League - Pre-render Platform Switcher Guard
// Executes in <head> before <body> parses to completely eliminate FOUC (flash of hidden switcher on refresh)
(function () {
  try {
    var raw = localStorage.getItem("frontline_platform_switcher_settings");
    if (raw) {
      var s = JSON.parse(raw);
      var isArena = s.switcher_visible !== false && s.show_arena !== false;
      var isLeague = s.switcher_visible !== false && s.show_league !== false;
      var isTourn = s.switcher_visible !== false && s.show_tournaments !== false;
      var isMaster = s.switcher_visible !== false && (isLeague || isArena || isTourn);
      var docEl = document.documentElement;
      if (docEl) {
        if (!isMaster) docEl.classList.add("hide-platform-switcher");
        if (!isLeague) docEl.classList.add("hide-mode-league");
        if (!isArena) docEl.classList.add("hide-mode-arena");
        if (!isTourn) docEl.classList.add("hide-mode-tournaments");
      }
    }
  } catch (_) {}
})();

// Frontline League - Global Stealth Admin Access Trigger
(function () {
  if (typeof window === "undefined" || !window.document) return;
  if (window.__stealthAdminTriggerInstalled) return;
  window.__stealthAdminTriggerInstalled = true;

  function goToAdmin() {
    try {
      const loc = window.location;
      const path = (loc.pathname || "").toLowerCase();
      const href = (loc.href || "").toLowerCase();
      if (path === "/admin" || path === "/admin/" || path.includes("/admin/") || href.includes("/admin/") || href.endsWith("admin.html") || href.includes("/admin/index.html")) {
        return;
      }
      try {
        sessionStorage.setItem("frontline_admin_session", "authorized");
        localStorage.setItem("frontline_admin_session", "authorized");
      } catch (_) {}

      if (loc.protocol === "file:") {
        if (href.includes("/arena/8s/") || href.includes("/arena/profile/") || href.includes("/arena/tournaments/") || href.includes("/arena/free-agents/") || href.includes("/tournaments/bracket/") || href.includes("/tournaments/brackets/")) {
          loc.href = "../../admin/index.html";
        } else if (href.includes("/home/") || href.includes("/profile/") || href.includes("/players/") || href.includes("/teams/") || href.includes("/schedule/") || href.includes("/rules/") || href.includes("/livestreams/") || href.includes("/vods/") || href.includes("/brackets/") || href.includes("/draft/") || href.includes("/signup/") || href.includes("/arena/") || href.includes("/ladders/") || href.includes("/match/") || href.includes("/tournaments/")) {
          loc.href = "../admin/index.html";
        } else {
          loc.href = "admin/index.html";
        }
        return;
      }
      loc.href = "/admin/";
    } catch (err) {
      window.location.href = "/admin/";
    }
  }

  let typed = "";
  let typedTimeout = null;

  function onKeyDown(e) {
    if (!e) return;
    const active = document.activeElement;
    const isInput = active && (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.tagName === "SELECT" ||
      active.isContentEditable
    );

    const rawKey = e.key || "";
    const key = rawKey.toLowerCase();
    const code = e.code || "";
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isAlt = e.altKey;
    const isShift = e.shiftKey;

    // 1. Hotkey: Alt + A (Simple, fast, no browser conflict)
    if (isAlt && !isCtrlOrCmd && (key === "a" || key === "å" || code === "KeyA")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 2. Hotkey: Ctrl/Cmd + Shift + A (Classic admin combo)
    if (isCtrlOrCmd && isShift && (key === "a" || key === "å" || code === "KeyA")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 3. Hotkey: Ctrl/Cmd + Shift + L (L for League / Login)
    if (isCtrlOrCmd && isShift && (key === "l" || code === "KeyL")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 4. Hotkey: Alt + L (Alt + League)
    if (isAlt && !isCtrlOrCmd && (key === "l" || code === "KeyL")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 5. Hotkey: Ctrl/Cmd + Alt + A
    if (isCtrlOrCmd && isAlt && (key === "a" || key === "å" || code === "KeyA")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 6. Hotkey: Ctrl/Cmd + Alt + L
    if (isCtrlOrCmd && isAlt && (key === "l" || code === "KeyL")) {
      e.preventDefault();
      e.stopPropagation();
      goToAdmin();
      return;
    }

    // 7. Secret word typed anywhere: "admin", "commish", or "frontline"
    if (!isInput && !isCtrlOrCmd && !isAlt && rawKey.length === 1) {
      clearTimeout(typedTimeout);
      typed += key;
      if (typed.length > 20) typed = typed.slice(-20);
      if (typed.endsWith("admin") || typed.endsWith("commish") || typed.endsWith("frontline")) {
        typed = "";
        goToAdmin();
        return;
      }
      typedTimeout = setTimeout(() => { typed = ""; }, 3000);
    }
  }

  // 8. 5-click easter egg on logo / brand
  let clicks = 0;
  let clickTimer = null;
  function onClick(e) {
    const brand = e.target && (
      e.target.closest(".brand") ||
      e.target.closest(".fl-brand-lockup") ||
      e.target.closest(".brand-logo") ||
      e.target.closest(".brand-title") ||
      e.target.closest(".brand-text")
    );
    if (brand) {
      clicks++;
      clearTimeout(clickTimer);
      if (clicks >= 5) {
        clicks = 0;
        goToAdmin();
        return;
      }
      clickTimer = setTimeout(() => { clicks = 0; }, 2000);
    }
  }

  window.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("click", onClick, true);
  window.__openAdminConsole = goToAdmin;
  window.navigateToAdminConsole = goToAdmin;
})();

// =========================================================================
// FRONTLINE GLOBAL NOTIFICATIONS CENTER & REAL-TIME ALERTS
// =========================================================================
(function () {
  if (typeof window === "undefined" || !window.document) return;
  if (window.__frontlineNotificationSystemInstalled) return;
  window.__frontlineNotificationSystemInstalled = true;

  function getCurrentUserIdentity() {
    let authUser = null;

    // 1. Check Supabase auth session in localStorage
    try {
      const sessionKeys = Object.keys(localStorage).filter(k => k.startsWith("sb-") && k.endsWith("-auth-token"));
      for (const k of sessionKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.user) {
            authUser = parsed.user;
            break;
          }
        }
      }
    } catch (_) {}

    // 2. LadderDB current player
    try {
      if (window.LadderDB && typeof window.LadderDB.getCurrentPlayer === "function") {
        const p = window.LadderDB.getCurrentPlayer();
        if (p && (p.gamertag || p.username || p.id)) {
          // If authUser was found, merge them
          if (authUser) {
            return Object.assign({}, authUser, p, {
              gamertag: p.gamertag || p.username || authUser.user_metadata?.gamertag,
              id: p.id || authUser.id
            });
          }
          return p;
        }
      }
    } catch (_) {}

    // 3. Explicit storage keys across platform
    try {
      const frontlineAuth = JSON.parse(localStorage.getItem("frontline_auth_user"));
      if (frontlineAuth && (frontlineAuth.gamertag || frontlineAuth.username || frontlineAuth.id)) return frontlineAuth;
    } catch (_) {}

    try {
      const leagueAuth = JSON.parse(localStorage.getItem("frontline_league_auth_user"));
      if (leagueAuth) return leagueAuth;
    } catch (_) {}

    try {
      const arenaAuth = JSON.parse(localStorage.getItem("frontline_arena_user")) || JSON.parse(localStorage.getItem("frontline_arena_auth_user"));
      if (arenaAuth) return arenaAuth;
    } catch (_) {}

    try {
      const card = JSON.parse(localStorage.getItem("frontline_league_player_card"));
      if (card && card.gamertag) return card;
    } catch (_) {}

    // 4. Return Supabase authUser if found
    if (authUser) return authUser;

    return null;
  }

  function getNotificationsStorage() {
    try {
      return JSON.parse(localStorage.getItem("frontline_user_notifications")) || [];
    } catch (_) {
      return [];
    }
  }

  function filterUserNotifications(allList, userIdent) {
    if (!userIdent || !Array.isArray(allList)) return [];
    let tag = "";
    let uid = "";
    let disc = "";
    let act = "";

    const clean = s => String(s || "").trim().toLowerCase();

    if (typeof userIdent === "string") {
      tag = clean(userIdent);
      uid = String(userIdent).trim();
    } else if (typeof userIdent === "object" && userIdent !== null) {
      tag = clean(userIdent.gamertag || userIdent.username || userIdent.name || userIdent.display_name || userIdent.global_name || "");
      uid = String(userIdent.id || userIdent.user_id || "").trim();
      disc = clean(userIdent.discord || userIdent.discord_name || userIdent.discord_username || "");
      act = clean(userIdent.activision_id || userIdent.activision || "");
      if (userIdent.user_metadata) {
        const m = userIdent.user_metadata;
        if (!tag) tag = clean(m.gamertag || m.username || m.name || m.display_name || m.full_name || "");
        if (!disc) disc = clean(m.discord || m.discord_name || m.discord_username || "");
        if (!act) act = clean(m.activision_id || "");
      }
      if (!tag && userIdent.email) {
        tag = clean(userIdent.email.split("@")[0]);
      }
    }

    return allList.filter(n => {
      const nTag = clean(n.target_gamertag);
      const nUid = String(n.target_user_id || "").trim();
      const nDisc = clean(n.target_discord);
      const nAct = clean(n.target_activision);

      // Match by gamertag (exact or normalized substring)
      if (tag && nTag) {
        if (tag === nTag) return true;
        // Check if alphanumeric matches (handling symbols/clan tags)
        const alphaTag = tag.replace(/[^a-z0-9]/g, "");
        const alphaNTag = nTag.replace(/[^a-z0-9]/g, "");
        if (alphaTag && alphaNTag && (alphaTag === alphaNTag || alphaTag.includes(alphaNTag) || alphaNTag.includes(alphaTag))) return true;
      }

      // Match by user ID
      if (uid && nUid && uid === nUid) return true;

      // Match by Discord handle
      if (disc && nDisc) {
        if (disc === nDisc || disc.includes(nDisc) || nDisc.includes(disc)) return true;
      }

      // Match by Activision ID
      if (act && nAct && act === nAct) return true;

      // Also check notification metadata invited_gamertag if team_invite
      if (tag && n.metadata && n.metadata.invited_gamertag) {
        const mInvTag = clean(n.metadata.invited_gamertag);
        if (tag === mInvTag) return true;
        const alphaTag = tag.replace(/[^a-z0-9]/g, "");
        const alphaMInvTag = mInvTag.replace(/[^a-z0-9]/g, "");
        if (alphaTag && alphaMInvTag && (alphaTag === alphaMInvTag || alphaTag.includes(alphaMInvTag) || alphaMInvTag.includes(alphaTag))) return true;
      }

      return false;
    });
  }

  function showNotificationToast(notif) {
    if (!notif || !notif.title) return;
    let toastWrap = document.getElementById("fl-global-toast-container");
    if (!toastWrap) {
      toastWrap = document.createElement("div");
      toastWrap.id = "fl-global-toast-container";
      toastWrap.style.cssText = "position:fixed; bottom:24px; left:24px; z-index:999999; display:flex; flex-direction:column; gap:10px; max-width:400px; width:calc(100vw - 48px); pointer-events:none;";
      document.body.appendChild(toastWrap);
    }

    const toast = document.createElement("div");
    toast.className = "fl-notif-toast";
    toast.style.cssText = `
      pointer-events:auto;
      background:linear-gradient(135deg, #161a10 0%, #0d100a 100%);
      border:1px solid #d5f45b;
      border-left:4px solid #d5f45b;
      color:#ffffff;
      padding:14px 18px;
      box-shadow:0 12px 36px rgba(0,0,0,0.85);
      border-radius:4px;
      display:flex;
      flex-direction:column;
      gap:6px;
      font-family:'Chakra Petch', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation:flFadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;

    const isInvite = notif.type === 'team_invite';
    const isTourneyLive = notif.type === 'tournament_live';
    const isMatchAccepted = notif.type === 'match_accepted';
    const inviteId = notif.metadata?.invite_id;
    const inviteStatus = notif.metadata?.status || 'pending';
    const bracketUrl = notif.metadata?.bracket_url || notif.metadata?.action_url || '/tournaments/bracket/';
    const matchUrl = notif.metadata?.match_url || (notif.metadata?.match_id ? `/match/?id=${encodeURIComponent(notif.metadata.match_id)}` : '/match-finder/');

    let actionButtonsHtml = '';
    if (isInvite && inviteStatus === 'pending' && inviteId) {
      actionButtonsHtml = `
        <div style="display:flex; gap:8px; margin-top:6px;">
          <button type="button" onclick="window.__respondToTeamInvite('${inviteId}', true, this)" style="background:#22c55e; border:none; color:#000; font-weight:800; font-size:11px; padding:6px 12px; border-radius:3px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">✓ Accept Invite</button>
          <button type="button" onclick="window.__respondToTeamInvite('${inviteId}', false, this)" style="background:transparent; border:1px solid #ef4444; color:#ef4444; font-weight:700; font-size:11px; padding:6px 12px; border-radius:3px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">✕ Decline</button>
        </div>
      `;
    } else if (isTourneyLive) {
      actionButtonsHtml = `
        <div style="margin-top:6px;">
          <a href="${bracketUrl}" style="display:inline-block; background:#ff1e44; color:#ffffff; font-weight:800; font-size:11px; padding:6px 14px; border-radius:3px; text-decoration:none; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(255,30,68,0.35);">
            ⚡ Open Live Bracket ↗
          </a>
        </div>
      `;
    } else if (isMatchAccepted) {
      actionButtonsHtml = `
        <div style="margin-top:6px;">
          <a href="${matchUrl}" style="display:inline-block; background:#ff1e44; color:#ffffff; font-weight:800; font-size:11px; padding:6px 14px; border-radius:3px; text-decoration:none; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(255,30,68,0.35);">
            ⚔ Enter Match Room ↗
          </a>
        </div>
      `;
    }

    const toastBorderColor = (isTourneyLive || isMatchAccepted) ? '#ff1e44' : (isInvite ? '#38bdf8' : '#d5f45b');
    const toastTitleColor = (isTourneyLive || isMatchAccepted) ? '#ff3b3b' : (isInvite ? '#22c55e' : '#d5f45b');
    const toastIcon = isTourneyLive ? '🔴' : (isMatchAccepted ? '⚔' : (isInvite ? '🛡' : '🔔'));

    toast.style.borderColor = toastBorderColor;
    toast.style.borderLeftColor = toastBorderColor;

    toast.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:16px;">${toastIcon}</span>
          <strong style="color:${toastTitleColor}; font-size:12.5px; text-transform:uppercase; letter-spacing:0.8px;">${notif.title}</strong>
        </div>
        <button type="button" class="btn-dismiss-toast" style="background:transparent; border:none; color:#888; font-size:14px; cursor:pointer; padding:0 4px; line-height:1;">✕</button>
      </div>
      <div style="font-size:12px; color:#cbd5e1; line-height:1.45;">
        ${notif.message}
      </div>
      ${actionButtonsHtml}
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <small style="font-size:10px; color:#6b7280;">Frontline Tournament Command</small>
        <a href="${bracketUrl}" style="font-size:11px; color:${toastTitleColor}; font-weight:800; text-decoration:none;">${isTourneyLive ? 'Live Bracket ↗' : 'View Dossier ↗'}</a>
      </div>
    `;

    const closeBtn = toast.querySelector(".btn-dismiss-toast");
    if (closeBtn) {
      closeBtn.onclick = () => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 250);
      };
    }

    toastWrap.appendChild(toast);
    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }
    }, 12000);
  }

  // Inject Bell Icon to Navigation Bars
  function injectNotificationBell() {
    if (document.getElementById("fl-nav-notif-bell-container")) return;

    // Search for ideal navbar injection target
    const target = document.querySelector(".nav-right-hub") || 
                   document.querySelector(".fl-topbar-right") || 
                   document.querySelector(".nav-actions") || 
                   document.querySelector(".header .nav");
    if (!target) return;

    const bellContainer = document.createElement("div");
    bellContainer.id = "fl-nav-notif-bell-container";
    bellContainer.style.cssText = "position:relative; display:inline-flex; align-items:center;";

    bellContainer.innerHTML = `
      <button type="button" id="fl-btn-notif-bell" aria-label="Notifications" title="Notifications & Alerts" style="background:transparent; border:1px solid #333d20; color:#d5f45b; width:36px; height:36px; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:all 0.2s ease;">
        <span style="font-size:16px;">🔔</span>
        <span id="fl-notif-badge" style="display:none; position:absolute; top:-4px; right:-4px; background:#ff1e44; color:#ffffff; font-size:10px; font-weight:900; min-width:16px; height:16px; border-radius:8px; line-height:16px; text-align:center; padding:0 3px; border:2px solid #11140e; box-sizing:content-box;">0</span>
      </button>

      <div id="fl-notif-dropdown-menu" style="display:none; position:absolute; top:calc(100% + 8px); right:0; width:min(350px, calc(100vw - 24px)); background:#12150f; border:1px solid #2a331c; border-radius:4px; box-shadow:0 14px 40px rgba(0,0,0,0.85); z-index:9999999; font-family:'Chakra Petch', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-bottom:1px solid #242c16; background:#161a12;">
          <strong style="font-size:12px; color:#d5f45b; text-transform:uppercase; letter-spacing:0.8px;">Directives &amp; Notifications</strong>
          <button type="button" id="fl-btn-mark-all-read" style="background:transparent; border:none; color:#94a3b8; font-size:11px; cursor:pointer; text-decoration:underline;">Mark all read</button>
        </div>
        <div id="fl-notif-list-body" style="max-height:360px; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:8px 0;">
          <div style="text-align:center; padding:24px 14px; color:#6b7280; font-size:12px;">
            No new notifications.
          </div>
        </div>
        <div style="padding:10px 14px; border-top:1px solid #242c16; background:#0d1009; text-align:center;">
          <a href="/profile/" style="font-size:11.5px; color:#cbd5e1; text-decoration:none; font-weight:700;">Open Profile Dossier ↗</a>
        </div>
      </div>
    `;

    // Insert as first child of nav-right-hub or target
    target.insertBefore(bellContainer, target.firstChild);

    const bellBtn = document.getElementById("fl-btn-notif-bell");
    const dropdown = document.getElementById("fl-notif-dropdown-menu");
    const markAllBtn = document.getElementById("fl-btn-mark-all-read");

    if (bellBtn && dropdown) {
      bellBtn.onclick = (e) => {
        e.stopPropagation();
        const willShow = dropdown.style.display !== "block";
        dropdown.style.display = willShow ? "block" : "none";
        if (willShow) {
          // Adjust position if overflowing screen left on narrow mobile screens
          const rect = bellContainer.getBoundingClientRect();
          if (rect.right < 340) {
            dropdown.style.right = "auto";
            dropdown.style.left = "0";
          } else {
            dropdown.style.right = "0";
            dropdown.style.left = "auto";
          }
        }
        refreshNotificationsUI();
      };

      document.addEventListener("click", (e) => {
        if (!bellContainer.contains(e.target)) {
          dropdown.style.display = "none";
        }
      });
    }

    if (markAllBtn) {
      markAllBtn.onclick = async () => {
        const user = getCurrentUserIdentity();
        if (window.LeagueDB && typeof window.LeagueDB.markAllNotificationsRead === "function") {
          await window.LeagueDB.markAllNotificationsRead(user);
        } else {
          const list = getNotificationsStorage();
          list.forEach(n => { n.read = true; });
          localStorage.setItem("frontline_user_notifications", JSON.stringify(list));
        }
        refreshNotificationsUI();
      };
    }
  }

  async function refreshNotificationsUI() {
    const user = getCurrentUserIdentity();
    if (!user) {
      const badge = document.getElementById("fl-notif-badge");
      if (badge) badge.style.display = "none";
      return;
    }

    let userNotifs = [];
    if (window.LeagueDB && typeof window.LeagueDB.getUserNotifications === "function") {
      try {
        userNotifs = await window.LeagueDB.getUserNotifications(user);
      } catch (_) {
        userNotifs = filterUserNotifications(getNotificationsStorage(), user);
      }
    } else {
      userNotifs = filterUserNotifications(getNotificationsStorage(), user);
    }

    // Also pull active tournament team invites from registry to guarantee tournament invites are NEVER missed
    try {
      if (window.LeagueDB && typeof window.LeagueDB.getTournamentTeamInvites === "function") {
        const directInvites = await window.LeagueDB.getTournamentTeamInvites(user);
        if (Array.isArray(directInvites) && directInvites.length > 0) {
          directInvites.forEach(inv => {
            const alreadyHas = userNotifs.some(n => n.type === 'team_invite' && (n.metadata?.invite_id === inv.id || n.id === inv.id));
            if (!alreadyHas) {
              userNotifs.unshift({
                id: 'synth_' + inv.id,
                title: 'Tournament Team Invite',
                message: `${inv.captain_gamertag || 'Team Captain'} has invited you to join team "${inv.team_name || 'Tournament Squad'}" for tournament "${inv.tournament_title || 'Tournament'}". Accept to join the squad roster.`,
                type: 'team_invite',
                created_at: inv.created_at || new Date().toISOString(),
                read: inv.status !== 'pending',
                metadata: {
                  invite_id: inv.id,
                  registration_id: inv.registration_id,
                  tournament_id: inv.tournament_id,
                  tournament_title: inv.tournament_title,
                  team_name: inv.team_name,
                  captain_gamertag: inv.captain_gamertag,
                  invited_gamertag: inv.invited_gamertag,
                  status: inv.status || 'pending'
                }
              });
            }
          });
        }
      }
    } catch (_) {}

    const unreadCount = userNotifs.filter(n => !n.read).length;
    const badge = document.getElementById("fl-notif-badge");
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount > 9 ? "9+" : unreadCount;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    }

    const listBody = document.getElementById("fl-notif-list-body");
    if (listBody) {
      if (userNotifs.length === 0) {
        listBody.innerHTML = `
          <div style="text-align:center; padding:28px 16px; color:#6b7280; font-size:12px;">
            <div style="font-size:22px; margin-bottom:6px;">📭</div>
            No notifications on file.
          </div>
        `;
      } else {
        listBody.innerHTML = userNotifs.map(n => {
          const isAccepted = n.type === 'registration_accepted';
          const isInvite = n.type === 'team_invite';
          const inviteId = n.metadata?.invite_id;
          const inviteStatus = n.metadata?.status || 'pending';
          const dateStr = n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent';

          let inviteActionHtml = '';
          if (isInvite && inviteStatus === 'pending' && inviteId) {
            inviteActionHtml = `
              <div style="display:flex; gap:6px; margin-top:6px;">
                <button type="button" onclick="window.__respondToTeamInvite('${inviteId}', true, this)" style="background:#22c55e; border:none; color:#000; font-weight:800; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer; text-transform:uppercase;">✓ Accept</button>
                <button type="button" onclick="window.__respondToTeamInvite('${inviteId}', false, this)" style="background:transparent; border:1px solid #ef4444; color:#ef4444; font-weight:700; font-size:10px; padding:4px 8px; border-radius:2px; cursor:pointer; text-transform:uppercase;">✕ Decline</button>
              </div>
            `;
          } else if (isInvite && inviteStatus === 'accepted') {
            inviteActionHtml = `<span style="font-size:10px; color:#22c55e; font-weight:800; margin-top:4px;">✓ Invite Accepted</span>`;
          } else if (isInvite && inviteStatus === 'declined') {
            inviteActionHtml = `<span style="font-size:10px; color:#94a3b8; font-weight:700; margin-top:4px;">✕ Invite Declined</span>`;
          }

          let badgeText = 'DIRECTIVE';
          let badgeColor = '#d5f45b';
          let customActionHtml = '';
          if (isAccepted) {
            badgeText = '✓ LEAGUE REGISTRATION ACCEPTED';
            badgeColor = '#22c55e';
          } else if (isInvite) {
            badgeText = '🛡 SQUAD INVITATION';
            badgeColor = '#38bdf8';
          } else if (n.type === 'tournament_live') {
            badgeText = '🔴 TOURNAMENT LIVE';
            badgeColor = '#ff1e44';
            const bUrl = n.metadata?.bracket_url || n.metadata?.action_url || '/tournaments/bracket/';
            customActionHtml = `
              <div style="margin-top:4px;">
                <a href="${bUrl}" style="display:inline-block; font-size:10.5px; font-weight:800; color:#ff1e44; text-decoration:none; text-transform:uppercase;">
                  ⚡ Open Bracket &amp; Vetoes ↗
                </a>
              </div>
            `;
          } else if (n.type === 'match_accepted') {
            badgeText = '⚔ MATCH CHALLENGE ACCEPTED';
            badgeColor = '#ff1e44';
            const mUrl = n.metadata?.match_url || (n.metadata?.match_id ? `/match/?id=${encodeURIComponent(n.metadata.match_id)}` : '/match-finder/');
            customActionHtml = `
              <div style="margin-top:4px;">
                <a href="${mUrl}" style="display:inline-block; font-size:10.5px; font-weight:800; color:#ff1e44; text-decoration:none; text-transform:uppercase;">
                  ⚔ Open Match Veto Room ↗
                </a>
              </div>
            `;
          }

          return `
            <div style="padding:10px 14px; border-bottom:1px solid #1a2012; background:${n.read ? 'transparent' : ((n.type === 'tournament_live' || n.type === 'match_accepted') ? 'rgba(255,30,68,0.08)' : 'rgba(213,244,91,0.06)')}; display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:10px; font-weight:800; color:${badgeColor}; text-transform:uppercase;">
                  ${badgeText}
                </span>
                <span style="font-size:10px; color:#64748b;">${dateStr}</span>
              </div>
              <strong style="font-size:12px; color:#ffffff;">${n.title}</strong>
              <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 4px; line-height:1.4;">${n.message}</p>
              ${inviteActionHtml}
              ${customActionHtml}
              ${!n.read ? `
                <button type="button" onclick="window.__markNotificationAsRead('${n.id}')" style="align-self:flex-start; background:transparent; border:none; color:#d5f45b; font-size:10.5px; font-weight:700; cursor:pointer; padding:0; text-decoration:underline; margin-top:2px;">
                  Mark as read
                </button>
              ` : ''}
            </div>
          `;
        }).join("");
      }
    }
  }

  window.__respondToTeamInvite = async function(inviteId, accept, btnEl) {
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = accept ? "Accepting..." : "Declining...";
    }
    try {
      const user = getCurrentUserIdentity();
      if (window.LeagueDB && typeof window.LeagueDB.respondTournamentTeamInvite === "function") {
        const res = await window.LeagueDB.respondTournamentTeamInvite(inviteId, accept, user);
        if (res && !res.success && res.error) {
          alert("Invite error: " + res.error);
        }
      }
    } catch (err) {
      console.error("Error responding to team invite:", err);
    }
    await refreshNotificationsUI();
  };

  window.__markNotificationAsRead = async function(notifId) {
    if (window.LeagueDB && typeof window.LeagueDB.markNotificationRead === "function") {
      await window.LeagueDB.markNotificationRead(notifId);
    } else {
      const list = getNotificationsStorage();
      list.forEach(n => {
        if (String(n.id) === String(notifId)) n.read = true;
      });
      localStorage.setItem("frontline_user_notifications", JSON.stringify(list));
    }
    refreshNotificationsUI();
  };

  // Event Listeners for real-time dispatch
  window.addEventListener("frontline_notification_received", (e) => {
    const notif = e.detail;
    const user = getCurrentUserIdentity();
    if (!user || !notif) return;
    const matched = filterUserNotifications([notif], user);
    if (matched.length > 0) {
      showNotificationToast(notif);
      refreshNotificationsUI();
    }
  });

  window.addEventListener("frontline_notifications_updated", () => {
    refreshNotificationsUI();
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "frontline_user_notifications") {
      refreshNotificationsUI();
    }
  });

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectNotificationBell();
      setTimeout(refreshNotificationsUI, 500);
    });
  } else {
    injectNotificationBell();
    setTimeout(refreshNotificationsUI, 500);
  }
})();

