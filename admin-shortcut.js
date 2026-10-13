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
      if (loc.protocol === "file:") {
        if (href.includes("/home/") || href.includes("/profile/") || href.includes("/players/") || href.includes("/teams/") || href.includes("/schedule/") || href.includes("/rules/") || href.includes("/livestreams/") || href.includes("/vods/") || href.includes("/brackets/") || href.includes("/draft/") || href.includes("/signup/") || href.includes("/arena/") || href.includes("/ladders/") || href.includes("/match/")) {
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
    try {
      if (window.LadderDB && typeof window.LadderDB.getCurrentPlayer === "function") {
        const p = window.LadderDB.getCurrentPlayer();
        if (p && (p.gamertag || p.username || p.id)) return p;
      }
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

    if (typeof userIdent === "string") {
      tag = userIdent.trim().toLowerCase();
      uid = userIdent.trim();
    } else if (typeof userIdent === "object" && userIdent !== null) {
      tag = String(userIdent.gamertag || userIdent.username || userIdent.name || userIdent.email || "").trim().toLowerCase();
      uid = String(userIdent.id || userIdent.user_id || "").trim();
      disc = String(userIdent.discord || userIdent.discord_name || userIdent.discord_username || "").trim().toLowerCase();
      act = String(userIdent.activision_id || userIdent.activision || "").trim().toLowerCase();
      if (userIdent.user_metadata) {
        const m = userIdent.user_metadata;
        if (!tag) tag = String(m.gamertag || m.username || m.name || "").trim().toLowerCase();
        if (!disc) disc = String(m.discord || m.discord_name || m.discord_username || "").trim().toLowerCase();
        if (!act) act = String(m.activision_id || "").trim().toLowerCase();
      }
    }

    return allList.filter(n => {
      const nTag = String(n.target_gamertag || "").trim().toLowerCase();
      const nUid = String(n.target_user_id || "").trim();
      const nDisc = String(n.target_discord || "").trim().toLowerCase();
      const nAct = String(n.target_activision || "").trim().toLowerCase();

      if (tag && nTag && (tag === nTag || tag.includes(nTag) || nTag.includes(tag))) return true;
      if (uid && nUid && uid === nUid) return true;
      if (disc && nDisc && (disc === nDisc || disc.includes(nDisc) || nDisc.includes(disc))) return true;
      if (act && nAct && act === nAct) return true;
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

    toast.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:16px;">🔔</span>
          <strong style="color:#d5f45b; font-size:12.5px; text-transform:uppercase; letter-spacing:0.8px;">${notif.title}</strong>
        </div>
        <button type="button" class="btn-dismiss-toast" style="background:transparent; border:none; color:#888; font-size:14px; cursor:pointer; padding:0 4px; line-height:1;">✕</button>
      </div>
      <div style="font-size:12px; color:#cbd5e1; line-height:1.45;">
        ${notif.message}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <small style="font-size:10px; color:#6b7280;">Frontline HQ Directive</small>
        <a href="/profile/" style="font-size:11px; color:#d5f45b; font-weight:800; text-decoration:none;">View Dossier ↗</a>
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
    }, 7000);
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

      <div id="fl-notif-dropdown-menu" style="display:none; position:absolute; top:calc(100% + 8px); right:0; width:340px; background:#12150f; border:1px solid #2a331c; border-radius:4px; box-shadow:0 14px 40px rgba(0,0,0,0.85); z-index:999999; font-family:'Chakra Petch', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-bottom:1px solid #242c16; background:#161a12;">
          <strong style="font-size:12px; color:#d5f45b; text-transform:uppercase; letter-spacing:0.8px;">Directives &amp; Notifications</strong>
          <button type="button" id="fl-btn-mark-all-read" style="background:transparent; border:none; color:#94a3b8; font-size:11px; cursor:pointer; text-decoration:underline;">Mark all read</button>
        </div>
        <div id="fl-notif-list-body" style="max-height:320px; overflow-y:auto; padding:8px 0;">
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
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
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
          const isAccepted = n.type === 'registration_accepted' || n.type === 'tourney_accepted';
          const dateStr = n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent';
          return `
            <div style="padding:10px 14px; border-bottom:1px solid #1a2012; background:${n.read ? 'transparent' : 'rgba(213,244,91,0.06)'}; display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:10px; font-weight:800; color:${isAccepted ? '#22c55e' : '#d5f45b'}; text-transform:uppercase;">
                  ${isAccepted ? '✓ ACCEPTED' : 'DIRECTIVE'}
                </span>
                <span style="font-size:10px; color:#64748b;">${dateStr}</span>
              </div>
              <strong style="font-size:12px; color:#ffffff;">${n.title}</strong>
              <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 4px; line-height:1.4;">${n.message}</p>
              ${!n.read ? `
                <button type="button" onclick="window.__markNotificationAsRead('${n.id}')" style="align-self:flex-start; background:transparent; border:none; color:#d5f45b; font-size:10.5px; font-weight:700; cursor:pointer; padding:0; text-decoration:underline;">
                  Mark as read
                </button>
              ` : ''}
            </div>
          `;
        }).join("");
      }
    }
  }

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

