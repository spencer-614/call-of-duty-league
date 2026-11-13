/* Staff permissions and browser caches never determine a player's chat name. */
(() => {
 const known = {'00dd56dd-fbc4-4243-b733-ff0a7e4086a3':'Savory','82788abf-e013-4aff-8475-673fb390b340':'Commissioner Spencer'};
 function name(user, registrations = []) {
  if (!user?.id) return 'Combatant';
  const reg = registrations.find(r => String(r.registered_by || '') === String(user.id) && r.captain_gamertag);
  if (reg) return reg.captain_gamertag;
  const meta = user.user_metadata || {};
  return meta.gamertag || meta.display_name || meta.global_name || meta.full_name || meta.username || user.gamertag || known[user.id] || 'Combatant';
 }
 async function current() {
  const c = window.supabaseClient || window.dbClient;
  const {data,error} = await c.auth.getUser();
  if (error || !data?.user) return null;
  const user = {...data.user};
  // Accept a cached player card only when its account identity matches this session.
  try {
   const card = JSON.parse(localStorage.getItem('frontline_league_player_card'));
   if (card && String(card.user_id || card.auth_user_id || card.id || '') === String(user.id)) user.gamertag = card.gamertag;
  } catch (_) {}
  user.gamertag = name(user);
  return user;
 }
 function author(message, registrations = []) {
  const reg = registrations.find(r => String(r.registered_by || '') === String(message.sender_id || '') && r.captain_gamertag);
  return reg?.captain_gamertag || known[message.sender_id] || String(message.sender_name || '').trim() || 'Combatant';
 }
 window.TournamentChatIdentity = {current,name,author};
})();
