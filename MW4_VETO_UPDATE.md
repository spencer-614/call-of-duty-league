# MW4 map and mode update

Based on the current Frontline_COD_League_Rulebook.docx, Appendix A, version 1.1 dated November 11, 2026. The website uses the league's label **Hijacked**.

| Mode | Maps |
| --- | --- |
| Hardpoint | Lithium, Lotus, Munition, Reactor U92, Rooftops, Sentry |
| Search and Destroy | Coal, Lotus, Munition, Reactor U92, Rooftops, Silkworm |
| Hijacked | Lithium, Lotus, Munition |

Best-of-five order: **Hardpoint → Search and Destroy → Hijacked → Hardpoint → Search and Destroy**.

These Search and Destroy / Hijacked pools follow the rulebook, which differs from the earlier flyer. This update changes map pools, mode names, and rotation descriptions. It preserves the existing coin flip, alternating-strike procedure, reporter ownership, and revision checks. It does not adopt the rulebook's separately proposed ban/pick procedure, change match chat, or edit historical statistics.

## Apply

1. Back up the deployed website and database.
2. In the existing Supabase project's SQL Editor, run **veto/mw4-migration.sql**. Do not rerun the full database setup or Switch migration for this update.
3. Deploy these changed files from this ZIP, keeping their relative paths:
   - `tournament-veto.js`
   - `supabase.js`
   - `bracket.js`
   - `tournaments/bracket/index.html`
   - `tournaments/brackets/index.html`
   - `match/index.html`
4. Hard-refresh the site. The bracket pages include updated script version tags.
5. Open a fresh match, enable reporting, and flip the coin. Verify each mode's pool against the table. Test with both assigned team representatives so only the correct team can strike. Complete the five-map sequence and check the mode order.

The ZIP also retains all earlier Switch updates. If transferring only the changed files, the list above is the website patch; `package.json` additionally adds `npm run test:veto`, and `veto/test/mw4.test.cjs` contains its regression checks.

## Database compatibility

The uploaded website calls `tournament_veto_action` but does not include the deployed function's SQL definition. The migration therefore keeps that existing implementation as a private function and delegates its authorization, turn, and version checks. The public endpoint still has the same name and arguments. It changes only the initial map pools on authorized coin/reset actions, validates subsequent maps, and adds a saved ruleset tag.

The migration expects the client contract `tournament_veto_action(text,text,text,integer,integer,text)` and the existing `tournament_veto_states(tournament_id,match_id,state)` columns. If the deployed signature is different, the migration aborts without committing changes. If it reports that error, export the existing definition with this read-only query and provide it for an exact adaptation:

```sql
SELECT p.oid::regprocedure AS signature, pg_get_functiondef(p.oid) AS definition
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname='tournament_veto_action';
```

The adapter is tested against a fixture implementing the client-observed RPC contract. Your live function/database was not accessed or verified during this update. If the deployed implementation attempts to restore hard-coded obsolete maps, the adapter rolls the action back instead of accepting an inconsistent veto.

## Existing saved vetoes

Deploy between matches. No saved map choice is automatically changed by the migration or page load. Existing tournament vetoes without the new ruleset tag show an old-pool notice and block further strikes until an authorized staff member uses **Reset All** to start a new MW4 veto. Resetting removes that match's existing coin flip and map selections, so do not reset an active series without a staff decision.

The separate ladder match room also uses the new pools for fresh/reset vetoes. Its pre-existing saved ladder selections remain untouched.

## Verification

From the project root:

```bash
npm install
npm run test:veto
npm run test:switch
npm test
```

The veto checks cover exact browser/SQL pools and labels, BO5 order, fresh map objects, the standalone match room, allowed-map enforcement, delegated team/turn/version checks, staff-only reset, an entire five-map veto, idempotent migration installation, and blocking direct calls to the private original function.

The in-game lobby still needs the adopted MW4 competitive settings. A website map choice cannot configure players' game clients.
