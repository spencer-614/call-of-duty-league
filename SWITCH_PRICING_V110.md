# v1.10: tournament-specific Switch prices

## Deploy

1. Run the updated **`switch/migration.sql`** in Supabase before deploying the website. Rerun the full file. It adds `tournaments.switch_prices` and updates the existing Switch functions; it does not clear tournaments, sessions, squads or payment history. Existing operator permissions remain in place.
2. Upload the full updated website and hard-refresh the admin and spectator tabs. The new `switch-pricing.js` must be deployed too.

## Set prices

When creating a Switch tournament, select the paid/free entry setting and use the existing **Entry Fee** field for entry (for example, `$10 / Duo`). The Switch section now has numeric **Respin**, **Lock**, **Unlock**, and **Nuke** base-price fields. All prices use whole US dollars; zero is allowed. New power-up fields default to Respin $10, Lock $15, Unlock $20 and Nuke $15, and can be changed before publishing.

Both tournament edit forms load the saved prices. The server, desk, wheel, spectator instructions, tournament details and action history use the same configured amounts. Each nuke raises Respin, Lock, Unlock and Nuke by $5 for that event. Entry remains fixed. The nuke that causes an increase is recorded at its pre-increase price.

Prices can be changed before the first entry payment is confirmed and before pairing begins. Saving a change updates an already-open, unpaid Switch desk. After payment confirmation or pairing, the server blocks base-price changes so the event cannot be silently repriced. Editing unrelated tournament information still works when effective prices stay the same.

Older events without saved Switch pricing retain their previous effective $5/$10/$15/$15/$20 entry/respin/lock/unlock/nuke defaults. They are not silently changed by deployment. To use new prices for an existing unpaid event, edit and save its configuration. For an event already accepting payments, keep its established pricing or create a fresh tournament. Generic isolated practice sessions continue to use the legacy defaults.

The Switch all-modes dropdowns, mode radio labels and generated default Switch rules text now say **Hijacked** instead of Ctrl. The actual veto system already used Hijacked. Historical Control statistics and unrelated rulebook/admin settings are retained.

## Verification

Local checks cover custom entry and all four power-up amounts, the saved action history, spectator prices, nuke escalation, duplicate-action safety, price locking, invalid inputs, edit-field round trips, legacy behavior and existing Switch workflows. Prior chat, reporting, spectator routing, league and veto checks also pass locally.

After deployment, create an unpaid test event with distinctive prices, reopen both edit forms and verify they persist. Open the desk and spectator view in separate browsers and confirm the same amounts. Confirm entry, pair the duos and exercise each power-up; check the recorded amounts and the $5 increase after a nuke. Verify a subsequent base-price edit is rejected. No real money needs to move for your controlled test, but real-session staff controls still require the payment-verification confirmation.
