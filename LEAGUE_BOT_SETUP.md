# Frontline: GitHub Pages + Supabase Edge Functions

This guide REPLACES the earlier Node-hosting instructions. Your website stays on GitHub Pages. Supabase hosts the new `league` API. The Discord bot remains a separate process on your PC or bot host.

## What you need to do now

1. Copy the updated WEBSITE files into your existing Git repository and push them normally. Preserve its `.git` folder and private files. This updates the browser admin page; pushing to GitHub Pages alone does NOT deploy an Edge Function.
2. If you ALREADY ran `league/migration.sql`, skip it. This Edge adaptation uses exactly the same database schema and data. If you have NOT run it, apply that file once using the Supabase SQL Editor. Do not reset the database or rerun the old full setup script.
3. Add the six bot settings as Supabase Edge Function secrets, then deploy `league` using the steps below.
4. Copy the updated BOT code into your bot project. Preserve its real `.env`, installed dependencies and scrim `data/`. Change `FRONTLINE_API_URL` as shown below.
5. Run `npm run check-api`, then `npm start` in the bot folder containing `package.json` and `.env`.

No Railway service, website `npm start`, or environment variables on GitHub Pages are required for this integration. The existing `server.js` is retained for optional local development; production bot requests use Supabase.

## A. Supabase secrets

In your website project folder, copy:

```powershell
Copy-Item .\supabase\functions\.env.example .\supabase\functions\.env
```

Edit the new private `supabase/functions/.env` with the actual values you already configured for the bot:

```env
LEAGUE_BOT_SECRET=THE_SAME_VALUE_AS_BOT_FRONTLINE_API_KEY
DISCORD_TOKEN=YOUR_CURRENT_ROTATED_BOT_TOKEN
DISCORD_GUILD_ID=YOUR_SERVER_ID
FOUNDER_ROLE_ID=YOUR_FOUNDER_ROLE_ID
STAFF_ROLE_ID=YOUR_STAFF_ROLE_ID
GM_ROLE_ID=YOUR_GM_ROLE_ID
LEAGUE_ALLOWED_ORIGINS=https://frontlinecodleague.com,https://www.frontlinecodleague.com
```

Supabase already supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_DB_URL` to deployed functions. Do not put bot credentials or a database connection string in the browser's `supabase.js`. It should retain only the existing public project URL and anon key.

You can alternatively enter these same custom variables in your project's Edge Functions Secrets settings. `DISCORD_CLIENT_ID`, `FA_ROLE_ID` and `REGISTRATION_URL` stay in the bot's configuration; this backend does not need them.

If you also access the website through another origin, add that origin to `LEAGUE_ALLOWED_ORIGINS`, comma separated, without paths or trailing slashes. For example, a GitHub project site's origin is `https://YOUR_USER.github.io`, not the repository subpath. Browser CORS is restricted; the bot's requests have no browser Origin header and still require the shared secret.

Private `.env` files are ignored by Git. Commit `.env.example` with placeholders only. You do NOT need to generate a new shared secret or token merely to switch hosting: reuse your current matching values unless they were exposed.

## B. Deploy the function (no Docker required)

Run these commands from the WEBSITE project folder, where `supabase/config.toml` exists. The project reference below matches the project URL in the provided website's `supabase.js`. If your developer changed projects, substitute that project's reference instead.

```powershell
npx supabase@latest login
```

Complete the browser sign-in using a Supabase account authorized for the project. Then:

```powershell
npx supabase@latest secrets set --project-ref sllilxkbmxheclhgstcq --env-file supabase/functions/.env
```

```powershell
npx supabase@latest functions deploy league --project-ref sllilxkbmxheclhgstcq --no-verify-jwt --use-api
```

Deploy specifically **`league`**, not the old `bot` / `bot-registrations` functions. The `_shared` files are dependencies included with this function; do not deploy `_shared` separately. Keep `deno.json`, `index.ts`, and the `_shared` files together in their supplied locations.

`--use-api` bundles on Supabase without a local Docker installation. `--no-verify-jwt` is intentional: this API accepts a custom bot secret as well as real user JWTs. The application itself verifies every private request. Bots must provide the shared secret; browser users must have a valid Supabase session and the appropriate staff record. Disabling the gateway check does not disable this application authentication.

The function uses Supabase's provided database connection with parameterized queries and SQL transactions, preserving atomic trades. A separate database server is not needed. If function logs show a connection error with the built-in URL, copy a connection URI for the SAME Supabase database from its Connect dialog into the optional secret `LEAGUE_DATABASE_URL`. For pooler connections, use the recommended connection mode from Supabase; this driver uses unnamed parameterized statements. If your custom connection requires a root certificate, the optional `LEAGUE_DATABASE_CA` secret accepts its PEM contents. Never put either setting in the website JavaScript or bot configuration.

When you later edit Edge Function code, run the deploy command again. Frontend-only changes still publish through your normal GitHub Pages push workflow.

## C. Check the deployed service

Open this public health endpoint in your browser:

https://sllilxkbmxheclhgstcq.supabase.co/functions/v1/league/health

Expected result after adding secrets:

```json
{"service":"frontline-league","version":"edge-v1","configured":true,"missing":[]}
```

This endpoint reports configuration names, not secret values. It confirms the function is running, but does not by itself verify the database connection. The bot diagnostic in the next section checks authentication and required database tables too.

- A GitHub Pages HTML/404 response means the bot URL still points at the website instead of Supabase.
- A Supabase function-not-found response means `league` has not been deployed to that project.
- A gateway `Invalid JWT` response usually means the gateway verification setting was not disabled for **this** function. Redeploy with the exact command above.
- `configured:false` lists missing secret NAMES. Set those in Supabase, not on GitHub Pages.
- A database/migration failure appears in `npm run check-api`; inspect the `league` function logs in Supabase for the detailed database error.

## D. Update the bot

Inside the actual BOT project folder (the one containing `package.json`), retain your existing private `.env` values and change this line:

```env
FRONTLINE_API_URL=https://sllilxkbmxheclhgstcq.supabase.co/functions/v1/league
```

Keep the same `FRONTLINE_API_KEY` value as the Supabase secret `LEAGUE_BOT_SECRET`. Keep your existing bot token, application/server IDs, FA/GM/Staff/Founder role IDs, and registration URL. The supplied `.env.example` is a template, not the file loaded at runtime.

If dependencies are already installed, no reinstall is needed just for this adaptation. Otherwise use `npm ci`. Then run:

```powershell
npm run check-api
```

Success reports that the Edge Function is reachable/configured, the bot secret is accepted, the database is connected, and the migration is ready. It never prints your token or secret.

Then, if you have not registered the slash commands yet:

```powershell
npm run deploy
```

Start the bot:

```powershell
npm start
```

Keep it running. Closing the terminal stops Discord synchronization. You can leave the website on GitHub Pages; it does not need a continuously running Node process. The bot defaults to a 15-second idle poll, processes queued work rapidly, checks reminder deadlines every ten minutes, and performs a full reconciliation at startup and daily. This reduces routine Edge invocations; approval/roster/match triggers still enqueue changes immediately. Actual delivery also depends on a running bot, queue length, Discord rate limits and valid permissions. Review your Supabase plan's invocation allowance for your league's usage.

## E. Use the admin page

Sign in through the existing admin portal using your real Supabase staff account, then open:

https://frontlinecodleague.com/admin/league/

The browser derives the `league` function URL from your existing `window.SUPABASE_CONFIG.url` and sends only the signed-in user's JWT and public anon key. No bot secret is shipped to the browser.

Your staff record in `staff_roles` must contain the actual Supabase Auth `user_id` and a trusted role: `founder`, `founders`, `commissioner`, `staff`, `admin`, or `administrator`. An email-only/local admin login is not sufficient for the new operations. Fix the user association in the database-owner SQL Editor if necessary; do not grant permissions based only on a typed email or Discord name.

Create a season, select participating teams, assign each team's GM by Discord ID, generate fixtures, and click the team/week Discord setup buttons. Check the transaction and sync queue tables on this page. GM assignments require that member to be in the Discord server with GM, Staff or Founder role. GMs can manage multiple assigned teams.

Approved players link through provider-verified Discord OAuth identities. An unlinked player must sign in/link Discord; typed names and IDs are not treated as proof. No unapproved signup receives an FA role just from submitting a form.

## Preserved behavior and defaults

- Eight ticket categories: Match Issues, Roster & Team, Rankings, League Rules, Payouts, Player Conduct, Staff Issues, Something Else. Staff Issues and its `founder-transcripts` destination are Founder-only, with opener/bot access as appropriate. Existing tickets are retained. Discord Administrators and the server owner bypass channel privacy; staff who should not see these tickets must not have Administrator.
- Approved FAs get the FA role and `FA | Name`; rostered players get `TAG | Name`. Unrelated unregistered members are untouched; managed nicknames are restored when registration/linkage is removed.
- Season-specific team roles and private team text/voice channels. Match channels and their discussion threads are private to both teams and staff/founders, plus explicitly authorized esubs. Setup buttons repair existing resources rather than blindly recreating them.
- `/add`, `/drop`, `/trade`, `/esub`, `/player`, `/team`. GM ownership is checked against saved assignments and current Discord roles. Staff/Founders can operate across teams.
- Trades swap two players atomically. Receiving GM(s) get DM Accept/Decline buttons. First decision wins; proposals expire in 48 hours. Nobody can approve their own proposal. Acceptance rechecks rosters and cannot partially move a player. Delivery failures are logged/retried.
- Esubs are approved FAs, with rank/division/cap eligibility checked by GMs as requested. Only match access is temporary; the permanent roster/FA status stays unchanged. Completion, cancellation or forfeit revokes the esub grant through the worker.
- Scheduling modals use the season time zone, reject nonexistent/ambiguous DST times, and require opposing-GM acceptance. Accepted schedules persist on the website. Staff date/time edits also update the canonical timestamp.
- Two preseason weeks and six regular-season weeks. Default is one match per team per week within its division, with byes for odd team counts and repeated rotations when necessary. Preseason doesn't affect regular standings. Ten points per regular-season win.
- Default playoffs: all teams, single elimination within each division, top seeds receiving byes. Rank by regular-season wins, losses, then map difference. Remaining ties require explicit staff seed overrides. Winners advance in `scheduled_matches`; the older tournament bracket system remains separate.
- Player/team stats default to the active season with an optional season selector. Player totals use season-tagged map statistics; historical untagged stats are not silently relabeled. Team records exclude preseason.
- Persistent jobs with exponential retries, worker leases and checkpoints. Failures after ten attempts are visible for manual retry. Transactions commit in Postgres before Discord updates, so synchronization is eventually consistent.
- Reminders DM the assigned GMs for imminent scheduled matches and unscheduled/overdue matches. Reminder jobs are created once per match/day, and recipient checkpoints avoid repeated delivery during routine maintenance.
- Archiving retains records and channels, makes season channels read-only, closes voice access, and locks/archives match threads. Finalize/cancel all matches first.
- Existing scrims remain separate and retain their local SQLite data. Preserve the bot's private `.env` and `data/` when copying updates.

## Validation and live limits

The automated suite covers the shared business logic, embedded Postgres migrations/transactions, add/drop, stale/atomic trades, GM authorization, scheduling, esub expiry, permissions, roster/profile guards, retry leases, byes/advancement, archival, Edge route prefixes, browser CORS, client headers and clear HTML/error handling. The full database workflow is also run through the Fetch handler served in production. Deno type-check and runtime smoke checks cover health, preflight and missing-configuration behavior.

This package has NOT deployed a function, modified your live database, or sent live Discord messages. Live database connectivity, Supabase project permissions, actual Discord role hierarchy, GM DMs, team/thread visibility and admin approval/scoring screens still need checking after deployment.
