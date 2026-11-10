/**
 * tournament-switch-wheel.js
 * Frontline Competitive Duo Switch Engine:
 * - Live synchronized HTML5 Canvas wheel spin with synthetic Web Audio API peg clicks and fanfare
 * - Supabase Realtime broadcast synchronization for all competitors & spectators
 * - Request Reroll -> Pops up in Admin -> Commissioner Clicks Accept -> Shows Duo Payment Directive -> Commissioner Confirms & Wheel Spins Live!
 * - Reroll ($10 base + escalation), Lock Squad ($15 immunity), and "Blow It Up" (Nuke re-shuffle)
 * - Live countdown timer window & Commissioner payment verification desk
 */

(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const client = () => window.supabaseClient || window.dbClient;

  // ---------------------------------------------------------------------------
  // 1. SYNTHETIC AUDIO ENGINE (Web Audio API)
  // ---------------------------------------------------------------------------
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  let lastTickTime = 0;
  function playPegTick(speedFactor = 1.0) {
    const now = performance.now();
    if (now - lastTickTime < 28) return; // rate-limit ticks to prevent Web Audio queue thrashing
    lastTickTime = now;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      // Realistic mechanical wheel peg click
      const baseFreq = 950 + Math.random() * 150;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.02);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
    } catch (_) {}
  }

  function playFanfare() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.46);
      });
    } catch (_) {}
  }

  function playNukeAlarm() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.35;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, start);
        osc.frequency.linearRampToValueAtTime(680, start + 0.18);
        osc.frequency.linearRampToValueAtTime(320, start + 0.32);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.33);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.34);
      }
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // 2. CANVAS WHEEL RENDERING ENGINE
  // ---------------------------------------------------------------------------
  const SLICE_COLORS = [
    '#f59e0b', // Amber
    '#3b82f6', // Electric Blue
    '#10b981', // Emerald
    '#ef4444', // Crimson Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#f97316', // Orange
    '#14b8a6'  // Teal
  ];

  class DuoSwitchWheel {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.slices = options.slices || [];
      this.currentAngle = 0; // in radians
      this.isSpinning = false;
      this.onSpinEnd = options.onSpinEnd || null;
      this.lastPegCrossed = -1;
      this.pointerKick = 0;
      this.animFrameId = null;

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.discCanvas = document.createElement('canvas');
      this.bezelCanvas = document.createElement('canvas');

      this.setupCanvasDPI();
      this.renderBezel();
      this.renderDisc();
    }

    setupCanvasDPI() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const logicalW = (rect && rect.width > 50) ? rect.width : 340;
      const logicalH = (rect && rect.height > 50) ? rect.height : 340;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetW = Math.round(logicalW * this.dpr);
      const targetH = Math.round(logicalH * this.dpr);

      if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
        this.canvas.width = targetW;
        this.canvas.height = targetH;
        this.renderBezel();
        this.renderDisc();
      }
    }

    setSlices(slices) {
      this.slices = Array.isArray(slices) ? slices : [];
      this.renderDisc();
      this.draw();
    }

    renderBezel() {
      if (!this.canvas) return;
      const width = this.canvas.width || Math.round(340 * this.dpr);
      const height = this.canvas.height || Math.round(340 * this.dpr);

      this.bezelCanvas.width = width;
      this.bezelCanvas.height = height;
      const bCtx = this.bezelCanvas.getContext('2d');
      if (!bCtx) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - (24 * this.dpr);

      bCtx.clearRect(0, 0, width, height);

      // Outer rim backing ring
      bCtx.beginPath();
      bCtx.arc(centerX, centerY, radius + (14 * this.dpr), 0, Math.PI * 2);
      bCtx.fillStyle = '#080a07';
      bCtx.fill();

      // Outer bezel ring
      bCtx.beginPath();
      bCtx.arc(centerX, centerY, radius + (10 * this.dpr), 0, Math.PI * 2);
      bCtx.strokeStyle = '#27311c';
      bCtx.lineWidth = 8 * this.dpr;
      bCtx.stroke();

      // Gold accent ring
      bCtx.beginPath();
      bCtx.arc(centerX, centerY, radius + (4 * this.dpr), 0, Math.PI * 2);
      bCtx.strokeStyle = '#fbbf24';
      bCtx.lineWidth = 3 * this.dpr;
      bCtx.stroke();
    }

    renderDisc() {
      if (!this.canvas) return;
      const width = this.canvas.width || Math.round(340 * this.dpr);
      const height = this.canvas.height || Math.round(340 * this.dpr);

      this.discCanvas.width = width;
      this.discCanvas.height = height;
      const dCtx = this.discCanvas.getContext('2d');
      if (!dCtx) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - (24 * this.dpr);

      dCtx.clearRect(0, 0, width, height);

      const numSlices = Math.max(1, this.slices.length);
      const sliceAngle = (Math.PI * 2) / numSlices;

      // Draw all slices onto offscreen canvas (pre-rendered once!)
      for (let i = 0; i < numSlices; i++) {
        const startA = i * sliceAngle;
        const endA = startA + sliceAngle;
        const sliceData = this.slices[i] || { name: `Duo ${i + 1}` };
        const color = sliceData.color || SLICE_COLORS[i % SLICE_COLORS.length];

        dCtx.beginPath();
        dCtx.moveTo(centerX, centerY);
        dCtx.arc(centerX, centerY, radius, startA, endA);
        dCtx.closePath();

        const grad = dCtx.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius);
        grad.addColorStop(0, '#10140c');
        grad.addColorStop(0.7, color);
        grad.addColorStop(1, '#080a06');
        dCtx.fillStyle = grad;
        dCtx.fill();

        dCtx.strokeStyle = '#050704';
        dCtx.lineWidth = 2 * this.dpr;
        dCtx.stroke();

        // Slice text label
        dCtx.save();
        dCtx.translate(centerX, centerY);
        const midA = startA + sliceAngle / 2;
        dCtx.rotate(midA);
        dCtx.textAlign = 'right';
        dCtx.textBaseline = 'middle';

        const label = String(sliceData.team_name || sliceData.name || `Duo ${i + 1}`).trim();
        const shortLabel = label.length > 18 ? label.substring(0, 16) + '..' : label;

        dCtx.font = `900 ${13 * this.dpr}px "Industry", "Inter", sans-serif`;
        dCtx.fillStyle = '#ffffff';
        dCtx.fillText(shortLabel, radius - (20 * this.dpr), 0);

        if (sliceData.captain_gamertag || sliceData.captain) {
          const cap = String(sliceData.captain_gamertag || sliceData.captain).trim();
          dCtx.font = `700 ${9.5 * this.dpr}px "Industry", "Inter", sans-serif`;
          dCtx.fillStyle = '#fbbf24';
          dCtx.fillText(`👑 ${cap.length > 14 ? cap.substring(0, 12) + '..' : cap}`, radius - (20 * this.dpr), 14 * this.dpr);
        }

        dCtx.restore();
      }

      // Outer rim pegs pre-rendered on the disc
      for (let i = 0; i < numSlices; i++) {
        const pegA = i * sliceAngle;
        const pegX = centerX + Math.cos(pegA) * (radius - 2 * this.dpr);
        const pegY = centerY + Math.sin(pegA) * (radius - 2 * this.dpr);

        dCtx.beginPath();
        dCtx.arc(pegX, pegY, 4 * this.dpr, 0, Math.PI * 2);
        dCtx.fillStyle = '#fbbf24';
        dCtx.fill();

        dCtx.beginPath();
        dCtx.arc(pegX, pegY, 2 * this.dpr, 0, Math.PI * 2);
        dCtx.fillStyle = '#ffffff';
        dCtx.fill();
      }
    }

    draw() {
      const { ctx, canvas } = this;
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - (24 * this.dpr);

      ctx.clearRect(0, 0, width, height);

      // 1. Static Bezel (single GPU blit)
      if (this.bezelCanvas) {
        ctx.drawImage(this.bezelCanvas, 0, 0);
      }

      // 2. Rotating Wheel Disc (single rotated GPU blit)
      if (this.discCanvas) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.currentAngle);
        ctx.drawImage(this.discCanvas, -centerX, -centerY);
        ctx.restore();
      }

      // 3. Center CDL Hub (crisp vector, zero blur)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38 * this.dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0d07';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 34 * this.dpr, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3 * this.dpr;
      ctx.stroke();

      ctx.font = `900 ${18 * this.dpr}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('⚔️', centerX, centerY);

      // 4. Pointer at 12 o'clock with responsive spring kick
      ctx.save();
      ctx.translate(centerX, centerY - radius + (4 * this.dpr));
      ctx.rotate(this.pointerKick);

      ctx.beginPath();
      ctx.moveTo(-12 * this.dpr, -22 * this.dpr);
      ctx.lineTo(12 * this.dpr, -22 * this.dpr);
      ctx.lineTo(0, 14 * this.dpr);
      ctx.closePath();

      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * this.dpr;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -14 * this.dpr, 5 * this.dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      // Dampen pointer kickback
      this.pointerKick *= 0.85;
    }

    stopSpin() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.isSpinning = false;
    }

    spinTo(targetIndex, durationMs = 5200, totalRotations = 6, onDone) {
      this.stopSpin();
      this.isSpinning = true;

      const numSlices = Math.max(1, this.slices.length);
      const sliceAngle = (Math.PI * 2) / numSlices;

      const sliceCenterA = targetIndex * sliceAngle + sliceAngle / 2;
      const targetBaseAngle = (Math.PI * 3 / 2) - sliceCenterA;

      // To guarantee exact identical rotation degrees across all clients:
      // Always normalize baseDelta to [0, 2pi), start at 0, and rotate identical radians
      let baseDelta = targetBaseAngle % (Math.PI * 2);
      while (baseDelta < 0) baseDelta += Math.PI * 2;
      const deltaAngle = baseDelta + (totalRotations * Math.PI * 2);

      this.currentAngle = 0;
      this.lastPegCrossed = -1;
      const startTime = performance.now();

      const easeOut = t => 1 - Math.pow(1 - t, 3.6);

      const step = now => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeOut(progress);

        this.currentAngle = deltaAngle * eased;

        const normalizedAngle = (this.currentAngle) % (Math.PI * 2);
        const currentPeg = Math.floor(normalizedAngle / sliceAngle);
        if (currentPeg !== this.lastPegCrossed) {
          this.lastPegCrossed = currentPeg;
          this.pointerKick = 0.30;
          playPegTick(1 - progress * 0.5);
        }

        this.draw();

        if (progress < 1) {
          this.animFrameId = requestAnimationFrame(step);
        } else {
          this.animFrameId = null;
          this.currentAngle = deltaAngle;
          this.draw();
          this.isSpinning = false;
          playFanfare();
          if (typeof onDone === 'function') onDone(this.slices[targetIndex], targetIndex);
        }
      };

      this.animFrameId = requestAnimationFrame(step);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. DUO SWITCH MODAL & UI CONTROLLER
  // ---------------------------------------------------------------------------
  class DuoSwitchManager {
    constructor() {
      this.activeTournamentId = null;
      this.currentTournament = null;
      this.wheelInstance = null;
      this.realtimeChannel = null;
      this.countdownInterval = null;
      this.currentSwitchState = null;
      this.cachedRegs = [];
      this.initModalDOM();
    }

    initModalDOM() {
      if (document.getElementById('modal-duo-switch-wheel-wrap')) return;

      const wrap = document.createElement('div');
      wrap.id = 'modal-duo-switch-wheel-wrap';
      wrap.style.cssText = 'display:none; position:fixed; inset:0; z-index:99999; background:rgba(4,6,3,0.94); align-items:center; justify-content:center; padding:16px; will-change:transform; transform:translateZ(0);';

      wrap.innerHTML = `
        <div style="background:#0c0f0a; border:1px solid #283416; border-top:3px solid #fbbf24; border-radius:4px; max-width:540px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.95); position:relative; overflow:hidden; display:flex; flex-direction:column; max-height:92vh;">
          <!-- Modal Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid #1e2614; background:#080a06;">
            <div>
              <div style="font-size:10px; font-weight:800; color:#fbbf24; text-transform:uppercase; letter-spacing:1px; display:flex; align-items:center; gap:6px;">
                <span class="live-pulse-dot" style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#ef4444; box-shadow:0 0 8px #ef4444;"></span>
                <span>LIVE DUO SWITCH WHEEL ARENA</span>
              </div>
              <h3 id="dsw-modal-title" style="margin:2px 0 0; font:900 17px var(--display, sans-serif); color:#ffffff; text-transform:uppercase;">
                4v4 Duo Switch Reveal
              </h3>
            </div>
            <button type="button" onclick="window.DuoSwitchEngine.closeWheelModal()" style="background:none; border:none; color:#9ca3af; font-size:22px; cursor:pointer; padding:4px 8px; line-height:1;">&times;</button>
          </div>

          <!-- Wheel Stage -->
          <div style="padding:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
            <div style="position:relative; width:340px; height:340px; max-width:100%;">
              <canvas id="dsw-canvas" width="340" height="340" style="width:100%; height:100%; display:block; border-radius:50%; box-shadow:0 0 35px rgba(251,191,36,0.22); will-change:transform;"></canvas>
            </div>

            <!-- Spin Status / Subtitle Banner -->
            <div id="dsw-status-banner" style="margin-top:14px; text-align:center; min-height:44px; width:100%;">
              <div id="dsw-status-text" style="font-size:13px; font-weight:800; color:#cbd5e1;">
                Synchronized Wheel Ready
              </div>
              <div id="dsw-status-subtext" style="font-size:11px; color:#94a3af; margin-top:2px;">
                Populated with official registered duos
              </div>
            </div>

            <!-- Reveal Result Banner (shows when spin stops) -->
            <div id="dsw-result-box" style="display:none; width:100%; margin-top:10px; background:#12180d; border:1px solid #2e3e18; border-left:4px solid #22c55e; padding:12px; border-radius:3px; text-align:center;">
              <span style="font-size:10px; color:#4ade80; font-weight:800; text-transform:uppercase; letter-spacing:0.8px;">🎉 PAIRING CONFIRMED</span>
              <div id="dsw-result-text" style="font-size:16px; font-weight:900; color:#ffffff; margin:3px 0 2px;"></div>
              <div id="dsw-result-desc" style="font-size:11px; color:#cbd5e1;"></div>
            </div>
          </div>

          <!-- Modal Footer Controls -->
          <div style="padding:12px 20px; border-top:1px solid #1e2614; background:#080a06; display:flex; justify-content:space-between; align-items:center;">
            <div id="dsw-sync-indicator" style="font-size:11px; color:#22c55e; font-weight:700; display:flex; align-items:center; gap:5px;">
              <span>●</span> <span>Synced across all competitors</span>
            </div>
            <button type="button" onclick="window.DuoSwitchEngine.closeWheelModal()" class="btn-tourney-outline" style="padding:5px 14px; font-size:11.5px;">
              Minimize ✕
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(wrap);
      const canvas = document.getElementById('dsw-canvas');
      if (canvas) {
        this.wheelInstance = new DuoSwitchWheel(canvas);
      }
    }

    openWheelModal(title, subtext) {
      this.initModalDOM();
      const wrap = document.getElementById('modal-duo-switch-wheel-wrap');
      if (wrap) wrap.style.display = 'flex';
      const t = document.getElementById('dsw-modal-title');
      if (t && title) t.textContent = title;
      const st = document.getElementById('dsw-status-subtext');
      if (st && subtext) st.textContent = subtext;
      const res = document.getElementById('dsw-result-box');
      if (res) res.style.display = 'none';

      if (this.wheelInstance) {
        this.wheelInstance.setupCanvasDPI();
        this.wheelInstance.renderBezel();
        this.wheelInstance.renderDisc();
        this.wheelInstance.draw();
      }
    }

    closeWheelModal() {
      if (this.wheelInstance) {
        this.wheelInstance.stopSpin();
      }
      const wrap = document.getElementById('modal-duo-switch-wheel-wrap');
      if (wrap) wrap.style.display = 'none';
    }

    // -------------------------------------------------------------------------
    // 4. REALTIME SYNC CHANNEL
    // -------------------------------------------------------------------------
    connectRealtime(tournamentId) {
      if (!tournamentId) return;
      const tidStr = String(tournamentId);

      // Keep existing channel if already connected for this tournament
      if (this.activeTournamentId === tidStr && this.realtimeChannel && this.realtimeChannel.state === 'joined') {
        return;
      }
      this.activeTournamentId = tidStr;

      const c = client();
      if (c && typeof c.channel === 'function') {
        const chanName = `tournament_duo_switch_${this.activeTournamentId}`;

        let chan = null;
        if (typeof c.getChannels === 'function') {
          const channels = c.getChannels() || [];
          chan = channels.find(ch => ch.topic === `realtime:${chanName}` || ch.topic === chanName);
        }

        if (!chan) {
          if (this.realtimeChannel) {
            try { c.removeChannel(this.realtimeChannel); } catch (_) {}
          }
          chan = c.channel(chanName, {
            config: { broadcast: { ack: false, self: true } }
          });
        }
        this.realtimeChannel = chan;

        this.realtimeChannel
          .on('broadcast', { event: 'duo_switch_spin' }, ({ payload }) => {
            if (!payload) return;
            this.handleIncomingSpinBroadcast(payload);
          })
          .on('broadcast', { event: 'duo_switch_state_update' }, ({ payload }) => {
            if (!payload) return;
            this.handleStateUpdate(payload);
          })
          .on('broadcast', { event: 'duo_switch_request_accepted' }, ({ payload }) => {
            if (!payload) return;
            this.handleRequestAccepted(payload);
          })
          .on('broadcast', { event: 'duo_switch_nuke' }, ({ payload }) => {
            if (!payload) return;
            this.handleNukeBroadcast(payload);
          })
          .on('broadcast', { event: 'duo_switch_bracket_generated' }, () => {
            if (typeof window.refreshCurrentBracketData === 'function') {
              window.refreshCurrentBracketData();
            }
          });

        if (this.realtimeChannel.state !== 'joined') {
          this.realtimeChannel.subscribe();
        }
      }

      // Cross-tab BroadcastChannel listener (instant sync across multiple browser tabs on same device)
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          if (this.localBroadcastChannel) {
            try { this.localBroadcastChannel.close(); } catch (_) {}
          }
          this.localBroadcastChannel = new BroadcastChannel(`frontline_duo_switch_${this.activeTournamentId}`);
          this.localBroadcastChannel.onmessage = (e) => {
            if (!e.data) return;
            const { event, payload } = e.data;
            if (event === 'duo_switch_spin') this.handleIncomingSpinBroadcast(payload);
            else if (event === 'duo_switch_state_update') this.handleStateUpdate(payload);
            else if (event === 'duo_switch_request_accepted') this.handleRequestAccepted(payload);
            else if (event === 'duo_switch_nuke') this.handleNukeBroadcast(payload);
            else if (event === 'duo_switch_bracket_generated') {
              if (typeof window.refreshCurrentBracketData === 'function') window.refreshCurrentBracketData();
            }
          };
        } catch (_) {}
      }

      // In-page CustomEvent listener
      if (typeof window !== 'undefined' && !this._hasRegisteredWindowListener) {
        this._hasRegisteredWindowListener = true;
        window.addEventListener('frontline_duo_switch_event', (e) => {
          const detail = e.detail;
          if (!detail || String(detail.tournamentId) !== String(this.activeTournamentId)) return;
          if (detail.eventName === 'duo_switch_spin') this.handleIncomingSpinBroadcast(detail.payload);
          else if (detail.eventName === 'duo_switch_state_update') this.handleStateUpdate(detail.payload);
          else if (detail.eventName === 'duo_switch_request_accepted') this.handleRequestAccepted(detail.payload);
          else if (detail.eventName === 'duo_switch_nuke') this.handleNukeBroadcast(detail.payload);
          else if (detail.eventName === 'duo_switch_bracket_generated') {
            if (typeof window.refreshCurrentBracketData === 'function') window.refreshCurrentBracketData();
          }
        });
      }
    }

    handleIncomingSpinBroadcast(payload) {
      if (!payload) return;
      const {
        spin_id,
        start_at,
        duration_ms = 5500,
        rotations = 6,
        slices,
        target_index,
        target_duo,
        requesting_duo,
        spin_type,
        title,
        subtext
      } = payload;

      // Deduplication guard to avoid firing same spin event twice across multiple channels
      if (spin_id && this.lastHandledSpinId === spin_id) return;
      if (spin_id) this.lastHandledSpinId = spin_id;

      // Open the wheel modal immediately across all screens
      this.openWheelModal(
        title || '4v4 Duo Switch Spin',
        subtext || 'Live synchronized wheel spin across all screens...'
      );

      if (!this.wheelInstance) return;
      if (Array.isArray(slices) && slices.length > 0) {
        this.wheelInstance.setSlices(slices);
      }

      const statusEl = document.getElementById('dsw-status-text');
      const now = Date.now();
      const targetStartTime = start_at || (now + 150);
      const delay = Math.max(0, targetStartTime - now);

      if (delay > 20) {
        if (statusEl) statusEl.textContent = '⏱ Synchronizing live wheel spin...';
      }

      setTimeout(() => {
        if (statusEl) statusEl.textContent = '🎲 Wheel spinning in real-time...';

        const elapsedSinceTarget = Math.max(0, Date.now() - targetStartTime);
        const actualDuration = Math.max(1200, duration_ms - elapsedSinceTarget);

        this.wheelInstance.spinTo(target_index, actualDuration, rotations, (winner) => {
          const resBox = document.getElementById('dsw-result-box');
          const resText = document.getElementById('dsw-result-text');
          const resDesc = document.getElementById('dsw-result-desc');
          if (resBox && resText) {
            resBox.style.display = 'block';
            resText.textContent = `${winner.team_name || winner.name}`;
            if (requesting_duo) {
              resDesc.textContent = `New 4v4 Partner for: ${requesting_duo.name || requesting_duo.team_name}`;
            } else {
              resDesc.textContent = 'Squad paired for Round 1 Matchup!';
            }
          }
          if (statusEl) statusEl.textContent = '✓ Spin Complete!';

          if (typeof window.refreshCurrentBracketData === 'function') {
            window.refreshCurrentBracketData();
          }
          if (typeof window.refreshAdminDuoSwitchDesk === 'function') {
            window.refreshAdminDuoSwitchDesk();
          }
        });
      }, delay);
    }

    handleNukeBroadcast(payload) {
      playNukeAlarm();
      const nukeBanner = document.createElement('div');
      nukeBanner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:999999; background:#7f1d1d; border:2px solid #ef4444; color:#ffffff; padding:16px 28px; border-radius:4px; font-weight:900; font-size:16px; text-transform:uppercase; box-shadow:0 10px 40px rgba(239,68,68,0.7); animation:shake 0.5s ease-in-out; text-align:center;';
      nukeBanner.innerHTML = `
        <div style="font-size:24px; margin-bottom:4px;">💥 BLOW IT UP ACTIVATED! 💥</div>
        <div style="font-size:12.5px; font-weight:700; color:#fca5a5;">
          ${esc(payload.requesting_duo_name || 'A competitor')} paid the Nuke fee! All unlocked squads re-shuffled!
        </div>
        <div style="font-size:12px; font-weight:800; color:#fef08a; margin-top:6px;">
          📈 Partner respin fee escalated by +$5! (Now $${payload.new_reroll_fee || '15'}+)
        </div>
      `;
      document.body.appendChild(nukeBanner);
      setTimeout(() => nukeBanner.remove(), 7000);

      if (typeof window.refreshCurrentBracketData === 'function') {
        window.refreshCurrentBracketData();
      }
      if (typeof window.refreshAdminDuoSwitchDesk === 'function') {
        window.refreshAdminDuoSwitchDesk();
      }
    }

    handleRequestAccepted(payload) {
      const currentUser = this.getCurrentUser();
      const myDuo = this.findUserDuo(currentUser, this.cachedRegs);
      if (!myDuo) return;

      // Check if accepted request belongs to this duo
      if (payload.duo_id === myDuo.id) {
        // Prompt duo with payment directive modal!
        this.openPaymentDirectiveModal(payload);
      }
    }

    handleStateUpdate(state) {
      this.currentSwitchState = state;
      const container = document.getElementById('duo-switch-bracket-mount');
      if (container && this.currentTournament) {
        this.renderBracketDuoSwitchBanner(container, this.currentTournament, null, this.cachedRegs);
      }
      if (typeof window.refreshAdminDuoSwitchDesk === 'function') {
        window.refreshAdminDuoSwitchDesk();
      }
    }

    // -------------------------------------------------------------------------
    // 5. BRACKET VIEW: DUO SWITCH BANNER & COMPETITOR ACTIONS
    // -------------------------------------------------------------------------
    async mountBracketDuoSwitchUI(containerId, tourney, bracketData) {
      const container = document.getElementById(containerId);
      if (!container || !tourney) return;

      const isDuo = String(tourney.format || '').toLowerCase().includes('duo');
      if (!isDuo) {
        container.style.display = 'none';
        return;
      }

      this.activeTournamentId = String(tourney.id);
      this.currentTournament = tourney;
      this.connectRealtime(tourney.id);

      let switchState = bracketData?.switch_state || tourney.switch_state || null;
      if (!switchState && window.LeagueDB && typeof window.LeagueDB.getDuoSwitchState === 'function') {
        switchState = await window.LeagueDB.getDuoSwitchState(tourney.id);
      }
      this.currentSwitchState = switchState;

      let regs = [];
      try {
        if (window.LeagueDB && typeof window.LeagueDB.getTournamentRegistrations === 'function') {
          regs = await window.LeagueDB.getTournamentRegistrations(tourney.id);
        } else {
          const all = JSON.parse(localStorage.getItem('frontline_tournament_registrations')) || [];
          regs = all.filter(r => String(r.tournament_id) === String(tourney.id));
        }
      } catch (_) {}
      this.cachedRegs = regs;

      container.style.display = 'block';
      this.renderBracketDuoSwitchBanner(container, tourney, bracketData, regs);
    }

    renderBracketDuoSwitchBanner(container, tourney, bracketData, regs) {
      const state = this.currentSwitchState || {};
      const isLocked = state.status === 'locked';
      const isWindowOpen = !isLocked;

      const currentUser = this.getCurrentUser();
      const myDuo = this.findUserDuo(currentUser, regs);
      const my4v4Team = myDuo ? this.findDuo4v4TeamInBracket(myDuo.id, bracketData) : null;
      const partnerDuoName = my4v4Team ? (my4v4Team.duo1_id === myDuo.id ? my4v4Team.duo2_name : my4v4Team.duo1_name) : null;
      const isMyTeamLocked = my4v4Team && (my4v4Team.isLocked || (state.locked_teams || []).includes(my4v4Team.name));

      const myRerollCount = (myDuo && state.duo_reroll_counts && state.duo_reroll_counts[myDuo.id]) || 0;
      const rerollCost = (state.reroll_base_fee || 10) + myRerollCount * (state.reroll_escalation || 5);
      const maxRerolls = state.max_rerolls_per_duo || 2;
      const canReroll = myDuo && isWindowOpen && !isMyTeamLocked && (myRerollCount < maxRerolls);

      // Check if this duo has a pending request waiting for commissioner approval or payment
      const myPendingReq = (state.pending_requests || []).find(r => myDuo && r.duo_id === myDuo.id);

      container.innerHTML = `
        <div style="background:#0e120a; border:1px solid #283716; border-left:4px solid #fbbf24; border-radius:3px; padding:16px 20px; margin-bottom:24px; box-shadow:0 10px 30px rgba(0,0,0,0.6);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">⚡</span>
              <div>
                <div style="font-size:10px; font-weight:800; color:#fbbf24; text-transform:uppercase; letter-spacing:0.8px;">
                  DUO SWITCH 4v4 // ROSTER POWER-UP ENGINE
                </div>
                <h4 style="margin:2px 0 0; font:900 16px var(--display, sans-serif); color:#ffffff; text-transform:uppercase;">
                  Live Partner Pairing &amp; Reroll Arena
                </h4>
              </div>
            </div>

            <!-- Status Indicator Badge -->
            <div style="display:flex; align-items:center; gap:8px; background:#080a05; border:1px solid #202a14; padding:6px 14px; border-radius:3px;">
              <span style="font-size:13px;">${isWindowOpen ? '⚡' : '🔒'}</span>
              <div>
                <div style="font-size:9.5px; color:#9ca3af; text-transform:uppercase; font-weight:700;">Status</div>
                <div id="dsw-status-display" style="font:900 13px var(--display, sans-serif); color:${isWindowOpen ? '#22c55e' : '#ef4444'}; text-transform:uppercase;">
                  ${isWindowOpen ? 'RESPIN & LOCK ACTIVE' : 'PAIRINGS LOCKED'}
                </div>
              </div>
            </div>
          </div>

          <!-- My Duo Status Card -->
          ${myDuo ? `
            <div style="background:#131a0e; border:1px solid #273718; padding:12px 14px; border-radius:3px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <span style="font-size:10.5px; color:#fbbf24; font-weight:800; text-transform:uppercase;">👑 Your Registered Duo:</span>
                <strong style="color:#ffffff; font-size:13.5px; margin-left:6px;">${esc(myDuo.team_name)}</strong>
                <span style="color:#94a3af; font-size:12px; margin-left:8px;">(Capt: ${esc(myDuo.captain_gamertag)})</span>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:3px;">
                  Current 4v4 Partner: 
                  <strong style="color:${partnerDuoName ? '#38bdf8' : '#94a3af'};">${partnerDuoName ? esc(partnerDuoName) : 'Awaiting Bracket Generation'}</strong>
                  ${isMyTeamLocked ? '<span style="background:rgba(34,197,94,0.2); border:1px solid #22c55e; color:#4ade80; font-size:10px; font-weight:800; padding:2px 6px; border-radius:2px; margin-left:8px;">🔒 SQUAD LOCKED</span>' : ''}
                </div>
              </div>

              <!-- Power Up Action Buttons or Pending Request Notice -->
              <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                ${myPendingReq ? `
                  <div style="background:#090d05; border:1px solid #fbbf24; padding:6px 12px; border-radius:3px; display:flex; align-items:center; gap:8px;">
                    <span style="color:#fbbf24; font-size:12px; font-weight:800;">
                      ${myPendingReq.status === 'accepted_awaiting_payment' ? '💳 Payment Due for ' : '⏳ Request Pending: '}
                      ${esc(myPendingReq.action_type.toUpperCase())} ($${myPendingReq.amount})
                    </span>
                    ${myPendingReq.status === 'accepted_awaiting_payment' ? `
                      <button type="button" class="btn-tourney-primary" style="font-size:11px; padding:3px 8px;" onclick="window.DuoSwitchEngine.openPaymentDirectiveModal(${JSON.stringify(myPendingReq).replace(/"/g, '&quot;')})">
                        Pay Fee Now ➔
                      </button>
                    ` : '<span style="font-size:10.5px; color:#94a3af;">(Waiting for Commissioner...)</span>'}
                  </div>
                ` : `
                  <!-- Reroll Button -->
                  <button type="button" 
                    class="btn-tourney-primary" 
                    style="font-size:11.5px; padding:7px 12px; ${canReroll ? '' : 'opacity:0.4; cursor:not-allowed;'}"
                    ${canReroll ? '' : 'disabled'}
                    onclick="window.DuoSwitchEngine.requestPowerUp('reroll', ${rerollCost})"
                    title="Request a new random partner duo">
                    🎲 Request Respin ($${rerollCost})
                  </button>

                  <!-- Lock Button -->
                  <button type="button" 
                    class="btn-tourney-outline" 
                    style="font-size:11.5px; padding:7px 12px; border-color:#22c55e; color:#4ade80; background:rgba(34,197,94,0.08); ${isWindowOpen && !isMyTeamLocked ? '' : 'opacity:0.4; cursor:not-allowed;'}"
                    ${isWindowOpen && !isMyTeamLocked ? '' : 'disabled'}
                    onclick="window.DuoSwitchEngine.requestPowerUp('lock', ${state.lock_fee || 15})"
                    title="Lock your 4v4 squad ($15) so nobody can swap or take your partner!">
                    🔒 Lock Squad ($${state.lock_fee || 15})
                  </button>

                  <!-- Blow It Up (Nuke) Button -->
                  <button type="button" 
                    class="btn-tourney-outline" 
                    style="font-size:11.5px; padding:7px 12px; border-color:#ef4444; color:#f87171; background:rgba(239,68,68,0.08); ${isWindowOpen ? '' : 'opacity:0.4; cursor:not-allowed;'}"
                    ${isWindowOpen ? '' : 'disabled'}
                    onclick="window.DuoSwitchEngine.requestPowerUp('nuke', ${state.nuke_fee || 25})"
                    title="Blow it up! Re-shuffle all unlocked duos across the tournament! (Escalates respin costs by +$5)">
                    💥 Blow It Up ($${state.nuke_fee || 25})
                  </button>
                `}
              </div>
            </div>
          ` : `
            <div style="background:#131a0e; border:1px solid #273718; padding:10px 14px; border-radius:3px; margin-bottom:12px; font-size:12px; color:#cbd5e1; display:flex; justify-content:space-between; align-items:center;">
              <span>Enlisted duos can request partner respins, locks ($15), or bracket scrambles. Blowups escalate respin fees by +$5!</span>
              <button type="button" onclick="window.DuoSwitchEngine.openLiveWheelPreview()" class="btn-tourney-outline" style="font-size:11px; padding:4px 10px; border-color:#fbbf24; color:#fbbf24;">
                🎡 View Live Wheel Slices
              </button>
            </div>
          `}

          <!-- Quick Explainer Footer -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:11px; color:#9ca3af; border-top:1px solid #1f2a13; padding-top:10px;">
            <div>
              <strong style="color:#ffffff;">Duo Switch Rules:</strong> 
              • 🎲 <strong>Reroll Partner:</strong> Starts at $${state.reroll_base_fee || 10} (+$5 each roll, max 2).
              • 🔒 <strong>Lock Squad ($15):</strong> Permanent immunity from swaps.
              • 💥 <strong>Blow It Up ($25):</strong> Scrambles all unlocked teams live &amp; escalates respin fee by +$5!
            </div>
            <button type="button" onclick="window.DuoSwitchEngine.openLiveWheelPreview()" style="background:none; border:none; color:#fbbf24; font-size:11px; cursor:pointer; text-decoration:underline;">
              🎡 Open Synchronized Wheel Modal ↗
            </button>
          </div>
        </div>
      `;
    }

    startCountdownTicker(endTime) {
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // -------------------------------------------------------------------------
    // 6. POWER-UP STEP 1: DUO CLICKS BUTTON -> POPS UP IN ADMIN PANEL
    // -------------------------------------------------------------------------
    async requestPowerUp(actionType, amount) {
      const currentUser = this.getCurrentUser();
      const myDuo = this.findUserDuo(currentUser, this.cachedRegs);
      if (!myDuo) {
        alert('You must be a registered Duo Captain in this tournament to request this action.');
        return;
      }

      let label = 'Partner Respin';
      if (actionType === 'lock') label = 'Lock Squad ($15)';
      else if (actionType === 'nuke') label = 'Blow It Up ($25)';

      const confirmMsg = `Submit request to Commissioner for ${label} ($${amount}.00 USD)?\n\nOnce accepted by the Commissioner, your payment directive will pop up on your screen to complete the action.`;
      if (!confirm(confirmMsg)) return;

      const requestPayload = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        tournament_id: this.activeTournamentId,
        duo_id: myDuo.id,
        duo_name: myDuo.team_name,
        captain_gamertag: myDuo.captain_gamertag,
        action_type: actionType,
        amount: amount,
        created_at: new Date().toISOString(),
        status: 'pending_commissioner_acceptance'
      };

      if (window.LeagueDB && typeof window.LeagueDB.submitDuoSwitchRequest === 'function') {
        const res = await window.LeagueDB.submitDuoSwitchRequest(this.activeTournamentId, requestPayload);
        if (res.success) {
          alert(`✓ Request sent to Commissioner Desk!\n\nAction: ${label}\nWaiting for Commissioner acceptance... Your payment directive will pop up as soon as it is accepted.`);
          if (this.currentTournament) {
            const container = document.getElementById('duo-switch-bracket-mount');
            if (container) this.renderBracketDuoSwitchBanner(container, this.currentTournament, null, this.cachedRegs);
          }
        } else {
          alert('Could not submit request: ' + (res.error || 'Unknown error'));
        }
      }
    }

    // -------------------------------------------------------------------------
    // 7. POWER-UP STEP 2: COMMISSIONER ACCEPTED -> SHOW PAYMENT METHOD TO DUO
    // -------------------------------------------------------------------------
    openPaymentDirectiveModal(req) {
      let modal = document.getElementById('modal-dsw-payment-directive');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-dsw-payment-directive';
        modal.style.cssText = 'position:fixed; inset:0; z-index:999999; background:rgba(5,7,3,0.88); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:16px;';
        document.body.appendChild(modal);
      }

      const tourney = this.currentTournament || {};
      const cashTag = tourney.cashapp_tag || '$FrontlineLeague';
      const cleanCash = String(cashTag).replace(/^[$@]/, '').trim();
      const paypalHandle = tourney.paypal_handle || 'frontlinecdl';

      modal.style.display = 'flex';
      modal.innerHTML = `
        <div style="background:#0d1109; border:1px solid #283716; border-top:3px solid #22c55e; border-radius:4px; max-width:480px; width:100%; padding:24px; box-shadow:0 25px 60px rgba(0,0,0,0.95); position:relative;">
          <button type="button" onclick="document.getElementById('modal-dsw-payment-directive').style.display='none'" style="position:absolute; top:14px; right:14px; background:none; border:none; color:#9ca3af; font-size:22px; cursor:pointer;">&times;</button>

          <span style="font-size:10.5px; font-weight:800; color:#4ade80; text-transform:uppercase; letter-spacing:0.8px;">✓ COMMISSIONER ACCEPTED YOUR REQUEST</span>
          <h3 style="margin:4px 0 8px; font:900 20px var(--display, sans-serif); color:#ffffff; text-transform:uppercase;">
            Pay $${req.amount}.00 for ${esc(req.action_type.toUpperCase())}
          </h3>
          <p style="font-size:12.5px; color:#cbd5e1; line-height:1.5; margin:0 0 16px;">
            The Commissioner has approved your request! Please send <strong>$${req.amount}.00 USD</strong> using either payment method below. Include your duo name (<strong>${esc(req.duo_name)}</strong>) in the payment note.
          </p>

          <!-- Payment Directives -->
          <div style="background:#070a04; border:1px solid #1d2710; border-radius:3px; padding:14px; margin-bottom:16px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div style="background:#0b0f06; border:1px solid #22c55e40; padding:10px; border-radius:3px;">
                <div style="font-size:10px; color:#4ade80; font-weight:800;">CASH APP ($Cashtag)</div>
                <div style="font-size:13px; font-weight:900; color:#fff; margin:2px 0 6px;">$${cleanCash}</div>
                <a href="https://cash.app/$${cleanCash}" target="_blank" class="btn-tourney-primary" style="font-size:10.5px; padding:3px 8px; text-decoration:none; display:inline-flex;">Open Cash App ↗</a>
              </div>
              <div style="background:#0b0f06; border:1px solid #38bdf840; padding:10px; border-radius:3px;">
                <div style="font-size:10px; color:#38bdf8; font-weight:800;">PAYPAL HANDLE</div>
                <div style="font-size:13px; font-weight:900; color:#fff; margin:2px 0 6px;">paypal.me/${paypalHandle}</div>
                <a href="https://paypal.me/${paypalHandle}" target="_blank" class="btn-tourney-primary" style="background:#0284c7; border-color:#38bdf8; font-size:10.5px; padding:3px 8px; text-decoration:none; display:inline-flex;">Open PayPal ↗</a>
              </div>
            </div>

            <div>
              <label style="display:block; font-size:11px; font-weight:800; color:#cbd5e1; text-transform:uppercase; margin-bottom:4px;">
                Your Payment Sender Name / $Cashtag *
              </label>
              <input type="text" id="dsw-directive-sender-handle" placeholder="e.g. $MyCashtag or PayPal Name" class="tourney-search-input" style="width:100%; box-sizing:border-box; font-size:12px;" />
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" onclick="document.getElementById('modal-dsw-payment-directive').style.display='none'" class="btn-tourney-outline" style="padding:8px 14px; font-size:12px;">
              Close
            </button>
            <button type="button" class="btn-tourney-primary" style="padding:8px 18px; font-size:12px;" onclick="window.DuoSwitchEngine.confirmPaymentSent('${req.id}')">
              I Have Sent Payment ($${req.amount}) ✓
            </button>
          </div>
        </div>
      `;
    }

    async confirmPaymentSent(requestId) {
      const handle = (document.getElementById('dsw-directive-sender-handle')?.value || '').trim();
      if (!handle) {
        alert('Please enter the $Cashtag or PayPal name you used to send payment.');
        return;
      }

      if (window.LeagueDB && typeof window.LeagueDB.confirmDuoSwitchPayment === 'function') {
        const res = await window.LeagueDB.confirmDuoSwitchPayment(this.activeTournamentId, requestId, handle);
        if (res.success) {
          alert('✓ Payment submitted! Once the Commissioner confirms receipt, the wheel will spin live for everyone.');
          document.getElementById('modal-dsw-payment-directive').style.display = 'none';
          if (this.currentTournament) {
            const container = document.getElementById('duo-switch-bracket-mount');
            if (container) this.renderBracketDuoSwitchBanner(container, this.currentTournament, null, this.cachedRegs);
          }
        } else {
          alert('Error: ' + (res.error || 'Failed to submit payment'));
        }
      }
    }

    openLiveWheelPreview() {
      let slices = [];
      const state = this.currentSwitchState;
      if (state && Array.isArray(state.teams)) {
        state.teams.forEach(t => {
          if (t.duo1_name) slices.push({ id: t.duo1_id, team_name: t.duo1_name, name: t.duo1_name });
          if (t.duo2_name) slices.push({ id: t.duo2_id, team_name: t.duo2_name, name: t.duo2_name });
        });
      }
      if (!slices.length && Array.isArray(this.cachedRegs)) {
        slices = this.cachedRegs.map(r => ({
          id: r.id,
          team_name: r.team_name,
          captain_gamertag: r.captain_gamertag
        }));
      }
      this.openWheelModal('Synchronized Duo Switch Wheel', 'Live view of all registered duos');
      if (this.wheelInstance && slices.length > 0) {
        this.wheelInstance.setSlices(slices);
      }
    }

    simulateWheelSpin(slices, targetIndex, options = {}, onDone) {
      if (!Array.isArray(slices) || slices.length === 0) {
        slices = [
          { team_name: 'Alpha Duo', name: 'Alpha Duo', captain_gamertag: 'Ghost' },
          { team_name: 'Bravo Duo', name: 'Bravo Duo', captain_gamertag: 'Soap' },
          { team_name: 'Charlie Duo', name: 'Charlie Duo', captain_gamertag: 'Price' },
          { team_name: 'Delta Duo', name: 'Delta Duo', captain_gamertag: 'Gaz' }
        ];
      }

      if (targetIndex === undefined || targetIndex < 0 || targetIndex >= slices.length) {
        targetIndex = Math.floor(Math.random() * slices.length);
      }

      const spinId = `spin_sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      this.handleIncomingSpinBroadcast({
        spin_id: spinId,
        start_at: Date.now() + 100,
        duration_ms: 5500,
        rotations: 6,
        slices: slices,
        target_index: targetIndex,
        title: options.title || '🎡 Live Duo Switch Wheel',
        subtext: options.subtext || 'Simulating live wheel spin...'
      });

      if (typeof onDone === 'function') {
        setTimeout(() => {
          if (slices && slices[targetIndex]) {
            onDone(slices[targetIndex], targetIndex);
          }
        }, 5800);
      }
    }

    getCurrentUser() {
      let u = null;
      try {
        const raw = localStorage.getItem('frontline_current_player') || localStorage.getItem('frontline_user_session');
        if (raw) u = JSON.parse(raw);
      } catch (_) {}
      return u;
    }

    findUserDuo(user, regs) {
      if (!user || !regs || !regs.length) return null;
      const norm = s => String(s || '').replace(/^@/, '').trim().toLowerCase();
      const uTag = norm(user.gamertag || user.username);
      const uDisc = norm(user.discord || user.discord_name);

      return regs.find(r => {
        if (uTag && norm(r.captain_gamertag) === uTag) return true;
        if (uDisc && norm(r.captain_discord) === uDisc) return true;
        const roster = Array.isArray(r.roster) ? r.roster : [];
        return roster.some(m => norm(typeof m === 'object' ? (m.gamertag || m.name) : m) === uTag);
      });
    }

    findDuo4v4TeamInBracket(duoId, bracketData) {
      if (!duoId) return null;
      const state = this.currentSwitchState;
      if (state && Array.isArray(state.teams)) {
        const found = state.teams.find(t => t && (t.duo1_id === duoId || t.duo2_id === duoId));
        if (found) return found;
      }
      if (!bracketData || !bracketData.stages) return null;
      for (const s of bracketData.stages) {
        for (const r of (s.rounds || [])) {
          for (const m of (r.matches || [])) {
            for (const t of [m.team1, m.team2]) {
              if (t && (t.duo1_id === duoId || t.duo2_id === duoId)) {
                return t;
              }
            }
          }
        }
      }
      return null;
    }
  }

  // Expose global instance
  window.DuoSwitchEngine = new DuoSwitchManager();
})();
