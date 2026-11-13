# Tournament deletion and Nuke pricing update

1. In Supabase SQL Editor, run the complete updated `switch/migration.sql`. It is safe to rerun. Do not run the full database setup/reset script.
2. Upload/replace the website files from this folder in your existing repository, then deploy normally.
3. Hard-refresh the admin portal (Ctrl+Shift+R). Retry deleting the unwanted tournament from the hub. Deletion requires an account listed in `fcl_switch_operators`; see SWITCH_SETUP.md for authorization instructions.

Deletion now removes Switch sessions and their action history, tournament rows, related records, and registry entries together. Failures are reported instead of showing a false success. This permanently deletes the selected tournament.

Starting prices: entry $5, respin $10, lock $15, unlock $15, Nuke $20.
After one successful Nuke: entry $5, respin $15, lock $20, unlock $20, Nuke $25.
After two: entry $5, respin $20, lock $25, unlock $25, Nuke $30.
Each Nuke is recorded at its current price, then raises all four action prices by $5. Existing sessions use their saved Nuke count. Failed actions and retries do not add another increase. Practice reset returns prices to their starting amounts. Historical payment amounts stay unchanged.

Updated price displays include the public Switch desk, staff action menu, confirmations, completion notifications, wheel price cards, and action alerts. Prices synchronize through the existing session polling.

Changed files:
- supabase.js
- switch/migration.sql
- switch-client.js
- tournament-switch-wheel.js
- admin/index.html
- tournaments/index.html
- tournaments/bracket/index.html
- tournaments/switch/index.html
- SWITCH_SETUP.md
- switch/test/workflow.test.cjs
- switch/test/prices.test.cjs

Validation: Switch database workflow and staff/spectator price rendering tests; veto tests; league tests; JavaScript syntax checks. Tests use an isolated database; no production database changes were made.
