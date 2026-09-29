-- ==============================================================================
-- FRONTLINE CDL - ROSTER BOT DISCORD CONFIGURATION
-- Execute this script in Supabase SQL Editor (as database owner / postgres)
-- ==============================================================================

insert into fcl_private.roster_bot_config(singleton, guild_id, secret_hash)
values (
  true,
  '1553302786806915092',
  '503ddf5752cbbbdc57f11eec463d81739723fe1d6ab8462d5ad68c3bc5f712e4'
)
on conflict (singleton) do update
set guild_id = excluded.guild_id, secret_hash = excluded.secret_hash;

-- Reload PostgREST schema cache to ensure RPC and permissions are synchronized
notify pgrst, 'reload schema';
