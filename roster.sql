-- Run as the project database owner in Supabase SQL Editor.
-- Configure the secret and league guild separately, as described in INTEGRATION.md.
begin;
create schema if not exists fcl_private;
revoke all on schema fcl_private from public, anon, authenticated;

create table if not exists fcl_private.roster_bot_config (
  singleton boolean primary key default true check (singleton),
  guild_id text not null,
  secret_hash text not null check (length(secret_hash) = 64)
);
create table if not exists fcl_private.roster_audit (
  operation_id uuid primary key,
  guild_id text not null,
  actor_id text not null,
  target_id text not null,
  discord_name text not null,
  action text not null,
  team_id bigint not null,
  player_id bigint not null,
  previous_team_id bigint,
  result_team_id bigint not null,
  created_at timestamptz not null default now()
);
revoke all on all tables in schema fcl_private from public, anon, authenticated;
alter table fcl_private.roster_bot_config enable row level security;
alter table fcl_private.roster_audit enable row level security;

create or replace function public.fcl_change_roster(
  p_bot_secret text, p_guild_id text, p_actor_id text, p_target_id text,
  p_discord_name text, p_action text, p_team_id bigint, p_operation_id uuid
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_config fcl_private.roster_bot_config%rowtype;
  v_player public.players%rowtype;
  v_receipt fcl_private.roster_audit%rowtype;
  v_previous bigint;
  v_next bigint;
begin
  select * into v_config from fcl_private.roster_bot_config where singleton = true;
  if not found or p_bot_secret is null or length(p_bot_secret) < 64 or
     v_config.guild_id is distinct from p_guild_id or
     v_config.secret_hash is distinct from pg_catalog.encode(
       pg_catalog.sha256(pg_catalog.convert_to(p_bot_secret, 'UTF8')), 'hex') then
    raise exception 'Roster bot authentication failed' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('sign', 'drop') or p_team_id is null or p_team_id <= 0 or
     p_operation_id is null or p_actor_id is null or p_actor_id !~ '^[0-9]{15,22}$' or
     p_target_id is null or p_target_id !~ '^[0-9]{15,22}$' or
     p_discord_name is null or length(btrim(p_discord_name)) = 0 then
    raise exception 'Invalid roster request';
  end if;
  -- Serialize retries with the same request ID before looking for its receipt.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_operation_id::text, 0));
  select * into v_receipt from fcl_private.roster_audit where operation_id = p_operation_id;
  if found then
    if v_receipt.guild_id <> p_guild_id or v_receipt.actor_id <> p_actor_id or
       v_receipt.target_id <> p_target_id or v_receipt.action <> p_action or
       v_receipt.team_id <> p_team_id or v_receipt.discord_name <> lower(btrim(p_discord_name)) then
      raise exception 'Operation ID was already used for another request';
    end if;
    return jsonb_build_object('playerId', v_receipt.player_id::text, 'teamId', v_receipt.result_team_id,
      'changed', v_receipt.previous_team_id is distinct from v_receipt.result_team_id);
  end if;
  if not exists (select 1 from public.teams where id = p_team_id) then
    raise exception 'The GM team does not exist';
  end if;
  begin
    select p.* into strict v_player from public.players p
      where lower(btrim(p.discord_name)) = lower(btrim(p_discord_name)) for update;
  exception
    when no_data_found then raise exception 'No player record matches this Discord account username';
    when too_many_rows then raise exception 'Several player records match this Discord account username';
  end;
  v_previous := v_player.team_id;
  if p_action = 'sign' then
    if coalesce(v_previous, 0) not in (0, p_team_id) then
      raise exception 'This player is already on another team and must be dropped first';
    end if;
    v_next := p_team_id;
  else
    if coalesce(v_previous, 0) not in (0, p_team_id) then
      raise exception 'You can only drop players on your own team';
    end if;
    if not exists (select 1 from public.teams where id = 0) then
      raise exception 'Create the Free Agent team record with teams.id = 0 before dropping players';
    end if;
    v_next := 0;
  end if;
  update public.players set team_id = v_next where id = v_player.id;
  insert into fcl_private.roster_audit
    (operation_id, guild_id, actor_id, target_id, discord_name, action, team_id,
     player_id, previous_team_id, result_team_id)
    values (p_operation_id, p_guild_id, p_actor_id, p_target_id, lower(btrim(p_discord_name)),
      p_action, p_team_id, v_player.id, v_previous, v_next);
  return jsonb_build_object('playerId', v_player.id::text, 'teamId', v_next,
    'changed', v_previous is distinct from v_next);
end;
$$;
revoke all on function public.fcl_change_roster(text,text,text,text,text,text,bigint,uuid)
  from public, anon, authenticated;
-- The public key can call the function, but the separate secret is always checked first.
grant execute on function public.fcl_change_roster(text,text,text,text,text,text,bigint,uuid) to anon;

-- Configure Roster Bot singleton config with Discord Guild ID & Secret Hash
insert into fcl_private.roster_bot_config(singleton, guild_id, secret_hash)
values (true, '1553302786806915092', '503ddf5752cbbbdc57f11eec463d81739723fe1d6ab8462d5ad68c3bc5f712e4')
on conflict (singleton) do update
set guild_id = excluded.guild_id, secret_hash = excluded.secret_hash;

notify pgrst, 'reload schema';
commit;

