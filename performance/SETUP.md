# v1.13 performance repair

## Install

1. In Supabase SQL Editor, run `performance/hotfix-v113.sql` in full. This replaces the tournament-summary reader and makes identity updates conditional on actual changes. It also includes the previous lightweight wheel readers. It does not delete tournament/player records or change staff roles/RLS policies.
2. Publish the updated project files using the normal GitHub Pages workflow.
3. Close extra Frontline tabs, then hard-refresh the admin page (Ctrl+Shift+R).
4. Check Network / Fetch-XHR: the summary call should succeed. Refreshing several times within five minutes should not repeatedly call `sync_my_discord_staff_identity` for unchanged account details. The throttle applies only to background linking, not database authorization. Account metadata changes allow a new sync.
5. Verify player registration, admin access, tournament editing and counts, Switch desk, a practice spin and an existing bracket. Confirm response times before the event.

## Changes and limits

- Only one auth listener initiates background account linking. Concurrent calls share work; subsequent unchanged syncs are limited to once per five minutes across pages/tabs, with a short retry cooldown. This is a load reduction, not a permissions cache.
- The SQL sync skips updates when stored values already match, avoiding needless update triggers. Ambiguous SQL variable names are qualified. The existing staff-matching rules are retained, and role assignments are not changed by this update.
- Summary construction processes registry/counts once and avoids repeated expansion of full JSON expressions. It still respects existing caller permissions/RLS.
- A summary timeout is surfaced as an error instead of starting another heavy full-list download. The compatibility fallback remains only for an uninstalled summary function.
- Previous v1.11/v1.12 wheel timeout/recovery and conditional-state polling improvements remain.

These changes pass local database and client tests; they do not establish production response times or prove that database resource pressure has been eliminated. Large embedded images, other database triggers, or external load may still require investigation.

If summaries remain large, inspect field sizes without returning their contents:

```sql
SELECT t.id, f.key, octet_length(f.value::text) AS bytes
FROM public.tournaments t
CROSS JOIN LATERAL jsonb_each(to_jsonb(t)) f
ORDER BY bytes DESC LIMIT 15;
```

Move large embedded images to asset storage through the existing editor only after preserving the images; do not blindly clear fields.

Validation: `node --test performance/*.test.cjs switch/test/*.test.cjs match-fixes/test/*.test.cjs` after `npm install`.

Do not rerun the old identity migration after this hotfix without reapplying the hotfix, as that would restore the unconditional sync updates. Earlier website versions remain compatible with the SQL sync change.
