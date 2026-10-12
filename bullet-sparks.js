// ==============================================================================
// FRONTLINE CDL - KINETIC BULLET METAL IMPACT & RICOCHET SPARK SYSTEM
// ==============================================================================

(function () {
  if (typeof window === "undefined") return;

  let canvas, ctx;
  const particles = [];
  const ricochets = [];
  const shockwaves = [];
  let animFrameId = null;

  // Setup single high-performance overlay canvas
  function initCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.id = "bullet-impact-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale before re-applying
    ctx.scale(dpr, dpr);
  }

  // Check if current page is Arena mode vs League mode
  function isArenaMode() {
    return (
      (document.body && document.body.classList.contains("gb-body")) ||
      !!document.querySelector(".status-arena, .active-arena, .btn-crimson") ||
      /arena|ladders|match/i.test(window.location.pathname)
    );
  }

  // Incandescent color palettes
  const LEAGUE_SPARK_COLORS = [
    "#ffffff",
    "#ffffff",
    "#d5f45b", // Frontline Electric Lime
    "#d5f45b",
    "#eaff85",
    "#ffe270", // Molten brass
    "#ffaa33", // Hot spark
    "#ff6622"  // Amber tail
  ];

  const ARENA_SPARK_COLORS = [
    "#ffffff",
    "#ffffff",
    "#ff1e44", // Frontline Arena Crimson
    "#ff1e44",
    "#ff4d6d", // Hot neon crimson
    "#ffa033", // Fiery molten spark
    "#ffe270", // Molten gold
    "#ff6b81"  // Bright ricochet
  ];

  function triggerBulletImpact(x, y) {
    if (!canvas) initCanvas();

    const isArena = isArenaMode();
    const sparkPalette = isArena ? ARENA_SPARK_COLORS : LEAGUE_SPARK_COLORS;
    const primaryColor = isArena ? "#ff1e44" : "#d5f45b";

    // 1. Instant Impact Flash / Kinetic Shockwave Ring
    shockwaves.push({
      x,
      y,
      radius: 3,
      maxRadius: 20 + Math.random() * 8,
      alpha: 1.0,
      lineWidth: 2.2,
      color: Math.random() > 0.35 ? primaryColor : "#ffffff"
    });

    // 2. High-Velocity Ricochet Tracers (1 to 2 sharp deflected bullet tracer streaks)
    const ricochetCount = Math.random() > 0.3 ? 2 : 1;
    for (let i = 0; i < ricochetCount; i++) {
      // Ricochets deflect off at steep angles
      const angle = Math.random() * Math.PI * 2;
      const speed = 14 + Math.random() * 11;
      ricochets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        decay: 0.04 + Math.random() * 0.02,
        length: 22 + Math.random() * 16,
        color: Math.random() > 0.4 ? primaryColor : (isArena ? "#ffd070" : "#fff8c4"),
        width: 2.2
      });
    }

    // 3. Dense Metal Shrapnel & Spark Spray (crisp 10-14 sparks for maximum performance)
    const sparkCount = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 8.5;
      const color = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.16 + Math.random() * 0.14,
        friction: 0.91,
        alpha: 1.0,
        decay: 0.026 + Math.random() * 0.03,
        size: 1.4 + Math.random() * 1.6,
        color
      });
    }

    // Start render loop if idle
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // A. Render Kinetic Shockwaves (dual-stroke GPU hardware glow, zero CPU shadowBlur)
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.28;
      sw.alpha *= 0.84;

      ctx.save();
      // Outer glow ring
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha * 0.35);
      ctx.lineWidth = sw.lineWidth * 2.2;
      ctx.stroke();

      // Sharp inner core ring
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = sw.lineWidth;
      ctx.stroke();
      ctx.restore();

      if (sw.alpha < 0.04) {
        shockwaves.splice(i, 1);
      }
    }

    // B. Render Supersonic Ricochet Tracers (dual-stroke laser core, 100% GPU accelerated)
    for (let i = ricochets.length - 1; i >= 0; i--) {
      const r = ricochets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vx *= 0.93;
      r.vy *= 0.93;
      r.alpha -= r.decay;

      const tailX = r.x - r.vx * (r.length / 5);
      const tailY = r.y - r.vy * (r.length / 5);

      ctx.save();
      // Outer luminous glow streak
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = Math.max(0, r.alpha * 0.35);
      ctx.lineWidth = r.width * 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Sharp core streak
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(tailX, tailY);
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.lineWidth = r.width;
      ctx.stroke();
      ctx.restore();

      if (r.alpha <= 0.03) {
        ricochets.splice(i, 1);
      }
    }

    // C. Render Molten Sparks Spray (elongated sparks with zero CPU blur overhead)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const oldX = p.x;
      const oldY = p.y;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.alpha -= p.decay;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(oldX, oldY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = "round";
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.stroke();
      ctx.restore();

      if (p.alpha <= 0.02) {
        particles.splice(i, 1);
      }
    }

    // Continue animation loop while active; suspend when all sparks finish
    if (shockwaves.length > 0 || ricochets.length > 0 || particles.length > 0) {
      animFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      animFrameId = null;
    }
  }

  // Universal trigger on pointerdown with modal and form filtering
  let lastImpactTime = 0;
  function onImpactEvent(e) {
    // Skip sparks if clicking inside any modal, dialog, or form controls
    if (e && e.target) {
      if (
        e.target.closest("dialog, .tourney-modal-overlay, .modal-overlay, .tourney-modal-card, .ladder-modal-box, form, input, textarea, select, button[type='submit'], .modal-close-btn, .tourney-modal-close") ||
        document.querySelector("dialog[open], .tourney-modal-overlay[style*='flex'], .modal-overlay.active")
      ) {
        return;
      }
    }

    const now = performance.now ? performance.now() : Date.now();
    if (now - lastImpactTime < 25) return;
    lastImpactTime = now;

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
    triggerBulletImpact(clientX, clientY);
  }

  window.addEventListener("pointerdown", onImpactEvent, { passive: true });

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
  } else {
    initCanvas();
  }

  // Expose global method if other components want to programmatically trigger impacts
  window.triggerBulletImpact = triggerBulletImpact;
})();
