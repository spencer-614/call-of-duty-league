# Switch tournament update — based on the supplied 1.2 website

This update replaces the old Switch request/simulation engine with staff-run actions. Nothing has been deployed or applied to your production database.

## Required setup

1. Back up the existing database and website. In the existing Supabase SQL Editor, run **switch/migration.sql**. It is safe to rerun. Do not run the full database reset/setup script.
2. Authorize each staff member who will run the Switch desk. Find their actual Supabase Auth UUID:

   ```sql
   SELECT id, email FROM auth.users ORDER BY email;
   ```

   Add only the accounts you want controlling payments, spins, and official squads:

   ```sql
   INSERT INTO public.fcl_switch_operators(user_id)
   VALUES ('REPLACE-WITH-THE-STAFF-AUTH-UUID')
   ON CONFLICT DO NOTHING;
   ```

   Repeat for other staff. Staff must sign into their real Supabase account (Discord sign-in is supported by the existing site); a browser's old local admin flag is insufficient. No accounts are granted automatically.
3. Transfer the updated website files to your repository and deploy through your normal process. The SQL migration must be applied before the updated pages go live. No new server environment variables or payment API keys are needed.
4. Open the admin tournament manager for a **Duo** format tournament. Choose **Set up Switch desk**. Existing legacy test pairings are not imported. If the tournament already has a bracket, use a fresh test tournament or the new practice session instead; do not clear an active competition's bracket.
5. Check the configured Cash App and PayPal details. Starting prices: $5 per duo entry, $10 respin, $15 lock, $15 unlock, $20 Nuke. Each successful Nuke increases all four action prices by $5 for the whole session. The Nuke itself costs the price before its increase. Entry stays $5; there is no respin limit. Practice reset restores starting prices. Existing sessions use their saved blowup count. Authorized Switch operators can delete tournaments and their Switch sessions from the hub.

The migration creates separate protected Switch tables and authenticated functions. It does not change ordinary tournaments' access rules. A tournament with a Switch session gains a guard against unauthorized tournament updates and registration changes after pairing starts. It does not globally repair unrelated legacy database policies.

The optional reporter-assignment trigger is installed when `tournament_report_matches` and `tournament_report_members` already exist. If you install those existing reporting tables later, rerun this migration. Both original duo registration owners receive access when reporting is enabled for their combined squad. Registrations without a valid Auth owner still require the site's existing manual reporting-access assignment.

## Running the real event

1. Players register their duo. Their teammate must accept the invitation so the roster contains exactly two confirmed players.
2. Players send $5 via Cash App or PayPal with their duo name in the note. In the Switch desk select the duo, method, and optional transaction reference; check that you verified the payment and execute **Confirm entry**. The Switch desk's entry flags are authoritative for this event; the old registration-panel payment badges are separate legacy records.
3. Choose **Refresh registrations** after new signups or accepted roster invitations. Already confirmed entries remain confirmed by registration ID. Review changed rosters before proceeding.
4. **Close registration & begin pairing** requires at least four duos, an even registration count, all entries verified, two players per duo, and no duplicated player names.
5. Click **Spin next** for each unpaired duo. The server chooses the random partner. Wait for each wheel result before starting another action.
6. The purchase window opens when every duo is paired. Players send payment with **duo name + action**. An unlock also needs the target squad name. Staff verify the payment externally and use the corresponding action in the desk. The website never charges anyone or automatically verifies money.
7. **Close purchase window & finalize squads** makes the squads official. This cannot be reopened through the desk. Then use **Generate bracket from official squads**. If bracket generation fails, squads remain finalized and generation can be retried. Duplicate publication is blocked.
8. **Manage matches** opens the existing match/reporting tools. **Switch control desk** returns to the event overview.

Keep transaction references where available. Reusing the same reference with the same payment method in a session is blocked. The two payment methods have separate reference namespaces. Optional/missing references cannot identify externally duplicated payments, so staff must still reconcile their accounts.

## Exact pairing rules

- No one can choose or purchase a specific partner. The partner is selected randomly on the server.
- A respin excludes the purchasing duo's current partner and every duo in a protected squad. If A+B and C+D are unlocked and A randomly draws C, the new squads are A+C and B+D. Staff see this consequence before execution.
- A later respin may return a duo to an earlier partner; only the current partner is excluded.
- A lock protects the entire four-player squad against respins and blow-ups.
- An unlock targets another squad and removes its protection. It does not change partners immediately.
- A blow-up requires at least two unlocked squads. It dissolves all unlocked squads, preserves protected squads, and puts the released duos in a visible pairing queue. Former partners can reunite during these new random spins.
- Only a registered, entry-verified duo can purchase a power-up, including a blow-up.
- Purchases are paused while a wheel is spinning or a pairing queue remains unfinished.

## Spectators and recovery

Use **Open spectator view** from the desk. It opens `/tournaments/switch/?session=...`. The tournament details also link to a public arena using its tournament ID. The bracket page embeds the new overview as well.

Public viewers fetch saved state about once per second. Each spin stores its result and server start/end timestamps; late viewers resume the same animation at the current point and see the same final partner. The normal squad display waits for the reveal. The connection indicator changes when synchronization is lost, and staff actions pause until a successful refresh. This is durable polling, not a dependency on a temporary broadcast; internet latency can still produce small timing differences.

Never manually execute a second payment action after a connection error. Use **Check / retry last action**. The operation ID makes that retry safe against duplicate execution. If the entire page was closed before confirmation, review the saved history before entering the payment again.

Completed and failed staff attempts remain in the database history. Failed commands roll back their pairing/payment changes and show the reason. Duplicate references only count completed actions. The screen displays the most recent 100 actions; all older audit records remain in `fcl_switch_actions` for staff database review. Payment notes, references, and staff identifiers are excluded from anonymous/public history.

## Practice checklist

**New practice session** creates eight fake duos in a separate session with no live registrations or payments. It is available before creating a real desk, too.

1. Verify entries one at a time to rehearse payment entry, or use **Verify all practice entries** as a shortcut.
2. Begin pairing and spin four squads. Open the spectator link in another browser/incognito window.
3. Select a duo and practice a respin. Confirm the wheel picks a different current partner and both resulting squads contain the correct four players.
4. Lock one squad; run a blow-up. The protected squad must remain intact while the other six duos become unpaired.
5. Spin all waiting duos. Select a purchaser outside the protected squad and unlock that squad. Run another blow-up and confirm all eight duos return to the pool.
6. During a spin, refresh the spectator page, open a second viewer, and try another staff action. Viewers must recover the same spin; overlapping actions must be blocked.
7. Open two staff screens and attempt competing actions. A stale screen must ask for a refresh instead of overwriting the other action.
8. Finish pairing, close the purchase window, and **Preview practice bracket**. This runs the same bracket builder without publishing a real bracket. Power-ups must remain unavailable after finalization.
9. **Reset this practice session** starts over and preserves the audit history. It cannot reset a real event.

A payment failure on a real session, repeated reference, unavailable target, missing roster member, odd duo count, and failed bracket publication are also covered by automated checks. The real Cash App/PayPal accounts and deployed Supabase project were not accessed during development.

## Checks

Run from the project root:

```bash
npm install
npm test
npm run test:switch
```

The Switch test runs the actual SQL functions in an isolated PostgreSQL-compatible database and the actual site's bracket builder. It covers authorization, retry/idempotency, stale revisions, failed-payment rollback/history, registration changes, random respins, protection, blow-up queues, roster integrity, finalization, public privacy, official bracket persistence, reporter ownership, and a practice bracket with byes. Browser layout was inspected using an isolated fixture, not production data.

## Changed files

- `supabase.js` — disable legacy Switch mutation methods, fixed prices, close registration, authoritative finalized squads, safe bracket publication, complete squad metadata.
- `admin/index.html` — route Duo tournaments into the new desk; retain existing match management.
- `tournaments/index.html` — current rules/payment instructions and live arena link.
- `tournaments/bracket/index.html` — load the new public Switch overview.
- `tournament-switch-wheel.js` — resume animation at a saved elapsed time.
- `tournament-reports.js` — preserve squad roster metadata when winners advance.
- `switch-client.js`, `switch.css`, `tournaments/switch/index.html` — new admin/spectator experience.
- `switch/migration.sql` — authoritative sessions, permissions, server actions, audit, publication, reporting integration.
- `switch/test/workflow.test.cjs`, `package.json` — regression checks and test command.

All other files from the supplied 1.2 archive are retained. Git metadata, local dependencies, and runtime secrets are excluded from the delivery ZIP.
