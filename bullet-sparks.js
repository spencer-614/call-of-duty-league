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

  // Incandescent color palette: White-hot core, Electric Lime, and Molten Brass/Gold
  const SPARK_COLORS = [
    "#ffffff",
    "#ffffff",
    "#d5f45b", // Frontline Electric Lime
    "#d5f45b",
    "#eaff85",
    "#ffe270", // Molten brass
    "#ffaa33", // Hot spark
    "#ff6622"  // Amber tail
  ];

  // ============================================================================
  // FRONTLINE CDL: BULLET IMPACT & RICOCHET AUDIO ENGINE
  // Dual-layer system:
  //   1. Preloaded HTML5 Audio Pool with 3 kinetic ricochet WAV variants
  //      (Instant 0ms latency, pitch-randomized, reliable on all browsers & file://)
  //   2. Procedural Web Audio API synthesizer as an active real-time fallback
  // ============================================================================
  const SOUND_VARIANTS = [
    "./ricochet-0.wav",
    "./ricochet-1.wav",
    "./ricochet-2.wav"
  ];

  // Audio Pool: 9 pre-buffered channels (3 per variant) to allow rapid multi-click spam
  const audioPool = [];
  let poolIndex = 0;
  let audioUnlocked = false;

  function initAudioPool() {
    if (audioPool.length > 0) return;
    try {
      for (let i = 0; i < 9; i++) {
        const src = SOUND_VARIANTS[i % SOUND_VARIANTS.length];
        const snd = new Audio(src);
        snd.preload = "auto";
        snd.volume = 0.75;
        audioPool.push(snd);
      }
    } catch (e) {
      // Audio element not supported in this environment
    }
  }

  // Pre-initialize pool
  initAudioPool();

  // Procedural Web Audio API Synthesizer (Fallback / Ambient Synth)
  let audioCtx = null;
  let synthGain = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        synthGain = audioCtx.createGain();
        synthGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
        synthGain.connect(audioCtx.destination);
      }
    }
    return audioCtx;
  }

  function playProceduralRicochet() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const runSynth = () => {
        const now = ctx.currentTime;

        // 1. Kinetic crack noise burst
        const bufferSize = Math.floor(ctx.sampleRate * 0.035);
        const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const out = noiseBuf.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.85, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        noise.connect(noiseGain);
        noiseGain.connect(synthGain);
        noise.start(now);
        noise.stop(now + 0.04);

        // 2. High-speed ricochet whine oscillator
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sawtooth";
        const startF = 3200 + Math.random() * 1200;
        const endF = 450 + Math.random() * 300;
        const dur = 0.32;
        osc.frequency.setValueAtTime(startF, now);
        osc.frequency.exponentialRampToValueAtTime(endF, now + dur);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.65, now + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(oscGain);
        oscGain.connect(synthGain);
        osc.start(now);
        osc.stop(now + dur + 0.02);
        console.log("🔊 [CDL Audio] Web Audio procedural ricochet synthesized");
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(runSynth).catch(() => {});
      } else {
        runSynth();
      }
    } catch (e) {
      // Synth failsafe
    }
  }

  function playRicochetSound() {
    initAudioPool();

    let played = false;
    // 1. Try playing from preloaded audio pool
    if (audioPool.length > 0) {
      const sound = audioPool[poolIndex];
      poolIndex = (poolIndex + 1) % audioPool.length;

      try {
        sound.currentTime = 0;
        // Pitch variation (0.90x to 1.15x) creates unique dynamic acoustics for every shot
        sound.playbackRate = 0.90 + Math.random() * 0.22;
        sound.volume = 0.85;
        const promise = sound.play();
        if (promise !== undefined) {
          promise.then(() => {
            console.log("🔊 [CDL Audio] Ricochet sound played successfully");
          }).catch((err) => {
            console.warn("🔊 [CDL Audio] Audio element play failed, falling back to Web Audio synth:", err.message);
            playProceduralRicochet();
          });
        }
        played = true;
      } catch (e) {
        // Fallback to procedural synthesis below
      }
    }

    if (!played) {
      playProceduralRicochet();
    }
  }

  // Unlock audio system on first user gesture
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // Wake Web Audio Context if present
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }

  window.addEventListener("pointerdown", unlockAudio, { capture: true, once: true });
  window.addEventListener("mousedown", unlockAudio, { capture: true, once: true });
  window.addEventListener("keydown", unlockAudio, { capture: true, once: true });

  function triggerBulletImpact(x, y) {
    if (!canvas) initCanvas();

    // Play kinetic ricochet sound
    playRicochetSound();

    // 1. Instant Impact Flash / Kinetic Shockwave Ring
    shockwaves.push({
      x,
      y,
      radius: 3,
      maxRadius: 20 + Math.random() * 8,
      alpha: 1.0,
      lineWidth: 2.2,
      color: Math.random() > 0.35 ? "#d5f45b" : "#ffffff"
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
        color: Math.random() > 0.4 ? "#d5f45b" : "#fff8c4",
        width: 2.2
      });
    }

    // 3. Dense Metal Shrapnel & Spark Spray (20-28 flying sparks)
    const sparkCount = 20 + Math.floor(Math.random() * 8);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 9.5;
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.16 + Math.random() * 0.14,
        friction: 0.91,
        alpha: 1.0,
        decay: 0.022 + Math.random() * 0.028,
        size: 1.4 + Math.random() * 1.8,
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

    // A. Render Kinetic Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.28;
      sw.alpha *= 0.84;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = sw.lineWidth;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      if (sw.alpha < 0.04) {
        shockwaves.splice(i, 1);
      }
    }

    // B. Render Supersonic Ricochet Tracers (high-energy laser-like streaks)
    for (let i = ricochets.length - 1; i >= 0; i--) {
      const r = ricochets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vx *= 0.93;
      r.vy *= 0.93;
      r.alpha -= r.decay;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - r.vx * (r.length / 5), r.y - r.vy * (r.length / 5));
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.lineWidth = r.width;
      ctx.lineCap = "round";
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      if (r.alpha <= 0.03) {
        ricochets.splice(i, 1);
      }
    }

    // C. Render Molten Sparks Spray (elongated sparks with gravity & air friction)
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
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
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

  // Universal trigger on pointerdown and mousedown with 25ms deduplication
  let lastImpactTime = 0;
  function onImpactEvent(e) {
    const now = performance.now ? performance.now() : Date.now();
    if (now - lastImpactTime < 25) return;
    lastImpactTime = now;

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
    triggerBulletImpact(clientX, clientY);
  }

  window.addEventListener("pointerdown", onImpactEvent, { passive: true });
  window.addEventListener("mousedown", onImpactEvent, { passive: true });

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCanvas);
  } else {
    initCanvas();
  }

  // Expose global method if other components want to programmatically trigger impacts
  window.triggerBulletImpact = triggerBulletImpact;
})();
