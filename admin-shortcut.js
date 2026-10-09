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
