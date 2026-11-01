# Frontline season / Discord integration

This update connects the existing website's Supabase/Postgres records to the Discord bot. It has not been deployed to your live server or database. Use Node.js 22.12+ for both projects. The website must run its included Node server; a static-only host cannot serve the new authenticated league API.

## What changed

- New `/admin/league/` page, linked from the existing admin portal.
- Eight ticket categories: Match Issues, Roster & Team, Rankings, League Rules, Payouts, Player Conduct, Staff Issues, Something Else. Categories are created when first used. Staff Issues and its `founder-transcripts` channel are restricted to Founders and the opener/bot as applicable. Existing tickets aren't moved or deleted.
- Verified Discord OAuth IDs link approved player records. No Discord-name guessing. Approving through the existing website creates a player and queues status synchronization. Unapproved signup records alone do not receive FA status.
- Approved FAs get FA role and `FA | Name`; rostered players get `TAG | Name`. The bot retains the original nickname for restoring players whose registration is removed. It does not alter unrelated unregistered members.
- Team setup creates season-specific team roles, private team categories, text and voice channels, and assigns roster members. Names include season/team IDs to recover resources after a restart without confusing teams with identical names. A team's nickname tag remains its plain tag.
- `/add`, `/drop`, `/trade`, `/esub`, `/player`, `/team` are top-level commands. Old local-only roster/scheduling admin commands are no longer registered. Existing scrim functionality remains.
- Trades are two-player swaps, proposed by one team GM (or staff/founder), with Accept/Decline DM buttons for the other team's assigned GM(s). They expire after 48 hours. Either authorized receiving GM can respond; the first decision wins. Staff/Founders can also respond, but nobody can approve their own proposal. Acceptance rechecks both rosters and swaps both players in one database transaction. A stale proposal cannot partially move a player.
- Esubs must be approved FAs; division/rank/cap eligibility is intentionally left to the GM. They get only this match's chat/thread access. Their permanent FA status and roster do not change. Access is removed by the worker after the website marks the match Completed, Final, Forfeit, or Cancelled. This depends on the bot running and permissions being valid; queue errors are visible to staff.
- Scheduling panels offer a modal with date and 24-hour time in the season's time zone. The opposing team's GM must accept. Times persist on the website; daylight-saving ambiguity is rejected instead of guessed. Existing staff edits to match dates/times also update the canonical timestamp.
- Persistent jobs, per-recipient DM checkpoints, a worker lease, exponential retries (up to ten failed attempts), and a staff retry control. Discord delivery is eventually consistent: database transactions commit before Discord updates. Periodic reconciliation repairs membership and channel permissions. A status update arriving during a sync is requeued after that job finishes.
- Daily reminders go by DM to the two teams' assigned GMs for matches within 24 hours and unscheduled/overdue matches from three days before the match week. No DMs can be delivered when a recipient blocks them; staff see that in the queue.
- Archiving preserves records, makes season channels read-only, closes team voice access, and archives/locks active match threads. All matches must be completed or cancelled first. It never deletes channels. Historical team roles stay assigned to preserve that team's archive access.

## Defaults used where rules weren't specified

- One match per team per week, within its division. Odd-sized divisions get byes. Opponent rotations repeat when necessary. Preseason rotation and regular-season rotation are separate.
- Two preseason weeks, six regular-season weeks, then playoffs.
- Every enrolled team qualifies for single-elimination playoffs within its division. Brackets expand to the next power of two; top seeds get byes. Week 9 is playoff round 1, week 10 round 2, etc. Only matchups with both opponents known get Discord channels.
- Seed by regular-season wins, then losses, then map difference. If those are tied, the generator stops and asks staff to set explicit seed overrides for every team in that division. This avoids silently using a team ID to break a competitive tie.
- Existing league points convention is preserved: ten points per regular-season win.
- `/player` and `/team` default to the active season and accept a season option. Team records exclude preseason. Player totals are season-tagged map statistics, including preseason maps if entered for that season. Old untagged map statistics are not silently attributed to a new season. Staff can assign their correct `fcl_season_id` when the historical season is known.
- League playoffs use `scheduled_matches` and advance into subsequent fixtures automatically; the existing tournament bracket system is separate.

## 1. Apply the database migration

Run **`league/migration.sql`** once in the existing Supabase SQL Editor using the database owner. It is rerunnable, adds integration tables/columns/triggers, and does not reset the existing database. Do not rerun the project's old full database setup script as a substitute.

Before application deployment, make sure your actual Founders/Staff records in `staff_roles` have the correct Supabase `user_id` and a trusted role (`founder`, `founders`, `commissioner`, `staff`, `admin`, or `administrator`). An email-only/local admin login does not authorize these actions. Only `founder`, `founders`, or `commissioner` may change staff assignments through the protected legacy API.

The migration adds restrictive write policies to the players, teams, schedule, map statistics, staff, and signup tables. Trusted staff must use real Supabase authentication. Players can still update their own cosmetic/profile fields; roster, ranking and statistics edits remain restricted. This intentionally closes the older public-write path; test the existing admin scoring and approval screens with your staff account after applying it. The old privileged table API now also requires a verified staff session for sensitive writes. Signups must go through authenticated Supabase, not the public privileged bridge.

Already approved players are backfilled only if `players.user_id` links to a provider-owned Discord OAuth identity in `auth.identities`. Unlinked or duplicate accounts require staff to repair the website account association; typed Discord IDs or usernames are not treated as verification. After an approved account links Discord later, the OAuth trigger queues the sync automatically.

Useful diagnostic (database-owner SQL Editor):

```sql
SELECT p.id, p.gamertag, p.user_id, i.discord_id
FROM public.players p
LEFT JOIN public.fcl_identities i ON i.player_id=p.id
ORDER BY p.id;
```

## 2. Configure the website backend

Keep the existing `DATABASE_URL`. It must point to the SAME Supabase database used by the website frontend. Add the variables from the website `.env.example` to your hosting provider:

- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: the same project as the browser's existing `supabase.js` configuration.
- `LEAGUE_BOT_SECRET`: a long random shared secret, matching the bot's `FRONTLINE_API_KEY`.
- `DISCORD_TOKEN`: the rotated bot token, used server-side to verify current Discord roles.
- `DISCORD_GUILD_ID`, `FOUNDER_ROLE_ID`, `STAFF_ROLE_ID`, `GM_ROLE_ID`: exact Discord IDs.

The uploaded bot `.env.example` contained a token. Rotate that token in the Discord Developer Portal before deployment. No real token is included in the returned example configuration.

Install/run the website:

```sh
npm ci
npm test
npm start
```

`npm test` uses PGlite, an embedded Postgres engine, and a minimal copy of the existing table schema. It never connects to your production database or Discord server.

## 3. Configure and run the bot

Copy settings from the bot `.env.example` into your existing private `.env`. Preserve your existing `.env`, local scrim `data/`, and any scrim settings. The updated download intentionally excludes `node_modules`, private `.env`, and database files; install dependencies locally rather than copying Windows native modules to a Linux host.

- `DISCORD_TOKEN`: the newly rotated token.
- `DISCORD_CLIENT_ID`: the bot application ID.
- `DISCORD_GUILD_ID`: the same guild as the website backend.
- `FOUNDER_ROLE_ID`, `STAFF_ROLE_ID`, `GM_ROLE_ID`, `FA_ROLE_ID`.
- `FRONTLINE_API_URL=https://YOUR-WEBSITE/api/league` (include `/api/league`; do not use the old registration edge-function URL).
- `FRONTLINE_API_KEY`: exactly the website's `LEAGUE_BOT_SECRET`.
- `REGISTRATION_URL`: the actual registration page. Update this when the final page URL is provided.

In the Developer Portal, enable **Server Members Intent** and **Message Content Intent**. The latter supports ticket transcripts and the retained scrim feature. Invite the bot with `bot` and `applications.commands` scopes.

Give the bot View Channels, Send Messages, Send Messages in Threads, Read Message History, Attach Files, Embed Links, Manage Channels, Manage Roles, Manage Nicknames, Create Public Threads, Manage Threads, and Manage Messages. Put its highest role above FA/team roles and players whose nicknames it must edit. FA/team roles should grant no server-level permissions; private channel overwrites provide access. It cannot change the server owner's nickname or manage members above its role.

Staff who should not see Staff Issues must NOT have Administrator: Discord itself bypasses all channel overwrites for administrators and the server owner. The bot cannot override that platform behavior.

```sh
npm ci
npm test
npm run deploy
npm start
```

Keep the bot running on a persistent host. Existing scrims still use local SQLite, so preserve that data directory. League seasons, trades, scheduling, sync jobs and transaction history are stored centrally in Postgres. Run one bot instance; the worker lease also guards accidental duplicate instances for sync jobs. Scale-out gateway deployments are not part of this update.

Use `/frontline setup-tickets` in `#tickets` and `/frontline setup-registration` in `#register`. Replace old season scheduling panels with the new website-created ones; they use different button IDs and central scheduling state. Existing scrim panels are separate.

## 4. First season workflow

1. Sign in through the existing admin portal using your real staff Supabase account.
2. Open **League Operations & Discord** (`/admin/league/`).
3. Create the season and select its start date/time zone.
4. Select the participating website teams and save enrollment. Every division needs at least two teams. Enrollment is locked once fixtures exist.
5. Assign each team's GM by Discord ID. That member must currently be in the server with GM, Staff, or Founder role. A GM can be assigned multiple teams.
6. Generate fixtures. Rerunning returns the existing schedule; it does not wipe or reshuffle it.
7. Click **Create / repair team Discord setup**. Review the queue for failures before publishing matches.
8. Select week 1 and create match channels. Repeat for the desired week as the season progresses. Rerunning repairs existing resources.
9. Finalize scores in the existing website schedule/admin flow. Results and winner IDs must identify the actual winning team. This finalizes esubs and feeds regular-season standings.
10. After all six regular-season weeks are finalized, resolve any seeding ties and generate playoffs. The default is all-team, single-elimination by division; change `league/logic.cjs` and the playoff route if league rules require a different format.
11. Publish each playoff week after its matchups are known. Advancing teams populate the next round automatically.
12. Complete/cancel remaining matches, then archive the season before creating the next one.

## Validation and remaining live checks

Automated tests cover schedule rotation, division isolation, timezone/DST behavior, command definitions, privacy overwrites, ticket category permissions, rerunnable migrations, verified identity linking, GM ownership, atomic trades, stale roster rejection, add/drop idempotency, scheduling acceptance, esub expiry, retry leases, write policies, postseason byes and advancement, and archival protection.

Live checks still required: login/role configuration in your guild, registration URL, two-GM DM acceptance, blocked-DM recovery, actual nicknames under your server's role hierarchy, team/match/thread visibility from player accounts, Founder-only ticket/transcript visibility, scoring/approval from the existing admin UI, and worker recovery after a restart. No deployment or production data edits were performed while preparing this update.
