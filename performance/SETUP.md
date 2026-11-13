# Performance update v1.11

1. Open Supabase SQL Editor and run `performance/migration.sql` in full. This adds three read functions. It does not delete or rewrite tournament/player records. Apply it after the existing Switch migration; do not rerun other migrations for this update.
2. Copy the updated project files into your website repository and publish through your usual GitHub Pages process. Do not delete unrelated files. The HTML files include updated script version tags so browsers load the changes.
3. Hard-refresh the admin page (Ctrl+Shift+R). In Network / Fetch-XHR, expect `fcl_tournament_summaries` for lists, `fcl_switch_summary` for public event status, and `fcl_switch_poll` approximately every two seconds on the wheel. Unchanged wheel responses contain no full state or action history. Hidden wheel tabs pause polling.
4. Verify the player list, registration, tournament counts, edit/save, Switch desk, a practice spin, and opening an existing bracket. Compare the network transfer sizes and loading times with the previous capture before the tournament.

Full bracket data remains in the database. Bracket viewing fetches the selected tournament's bracket; mutations retain the existing full-data workflow. Identical concurrent lookups share a request but no response cache is retained after completion. The Switch desk no longer waits for unrelated bracket and registration downloads before mounting.

If the new SQL functions are not installed, lists and wheel polling fall back to the old readers. Apply the SQL to receive the full improvement. Existing database permissions/RLS still govern tournament summaries. The Switch readers retain the existing public read model and do not expose payment history through summaries.

This update targets excessive reads and repeated concurrent lookups. It does not establish a measured production speedup or fix every possible bottleneck. Embedded image data can still make summaries large; the query below identifies which fields account for the actual stored size without returning their contents:

```sql
SELECT t.id, f.key, octet_length(f.value::text) AS bytes
FROM public.tournaments t
CROSS JOIN LATERAL jsonb_each(to_jsonb(t)) f
ORDER BY bytes DESC LIMIT 15;
```

If image_url/banner_url contains large embedded images, move those assets to image storage and save their URLs through the existing editor after preserving the images. Do not clear those fields blindly.

Local validation: run `node --test performance/performance.test.cjs switch/test/*.test.cjs match-fixes/test/*.test.cjs` after `npm install`.

Rollback: restore the previous website files. The added SQL functions may remain unused; no tournament or registration data restoration is needed.
