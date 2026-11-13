/* Public Switch navigation uses the durable session, never local admin state. */
(() => {
 'use strict';
 const sessions = new Map();
 const isSwitch = t => /duo.*switch|switch.*duo/i.test(String(t.format || ''));
 const spectatorUrl = (id, session = false) => '/tournaments/switch/index.html?' + (session ? 'session=' : 'tournament=') + encodeURIComponent(id);
 const isSpectatorRoute = /^\/tournaments\/switch(?:\/|$)/.test(location.pathname);
 async function refresh(tournaments) {
  const c = window.supabaseClient || window.dbClient;
  if (!c) return false;
  let changed = false;
  await Promise.all(tournaments.filter(isSwitch).map(async t => {
   try {
    const { data, error } = await c.rpc('fcl_switch_read', { p_id: String(t.id) });
    if (error) throw error;
    const next = data && !data.practice ? { id: data.id, state: { phase: data.state.phase, bracket_generated: !!data.state.bracket_generated, blowup_count: Number(data.state.blowup_count || 0) } } : null;
    if (JSON.stringify(sessions.get(String(t.id))) !== JSON.stringify(next)) changed = true;
    sessions.set(String(t.id), next);
   } catch (e) { console.warn('Could not refresh Switch phase:', e.message); }
  }));
  return changed;
 }
 function action(t) {
  if (!isSwitch(t)) return null;
  const s = sessions.get(String(t.id));
  if (!s || s.state.phase === 'registration') return null;
  if (s.state.phase === 'finalized' && s.state.bracket_generated) return { kind: 'bracket', label: 'View Live Bracket ↗', href: '/tournaments/bracket/?tournament=' + encodeURIComponent(t.id) };
  return { kind: 'wheel', label: 'Watch Live Wheel Spins', href: spectatorUrl(t.id) };
 }
 function updateDetails(t) {
  const a = action(t), link = document.getElementById('modal-detail-bracket-link'), reg = document.getElementById('modal-detail-register-btn');
  if (a && link) { link.href = a.href; link.textContent = a.label; link.style.display = 'inline-flex'; if (reg) reg.style.display = 'none'; }
 }
 function recoverSpectatorPage() {
  if (!isSpectatorRoute || document.querySelector('[data-switch-public]')) return;
  document.title = 'Live Switch Tournament · Frontline';
  document.body.innerHTML = '<header style="max-width:1240px;margin:auto;padding:24px"><a href="/tournaments/" style="color:#d5f45b">FRONTLINE / TOURNAMENTS</a><h1>Live Switch Arena</h1></header><main data-switch-public aria-live="polite" style="max-width:1240px;margin:auto;padding:24px">Connecting…</main>';
  const script = document.createElement('script'); script.src = '/switch-client.js?v=wheel-public-20261112';
  script.onerror = () => { document.querySelector('[data-switch-public]').textContent = 'The spectator files could not load. Please refresh or contact tournament staff.'; };
  document.body.append(script);
 }
 window.SwitchPublic = { refresh, action, spectatorUrl, isSpectatorRoute, updateDetails, recoverSpectatorPage };
 document.addEventListener('DOMContentLoaded', recoverSpectatorPage);
})();
