# Switch spectator links and tournament buttons

Deploy this version over v1.6. No new database migration is required for this change; keep your existing Switch migration and policies.

## Behavior

- The Switch desk links directly to `/tournaments/switch/index.html?session=...`.
- The server explicitly serves the dedicated spectator page for `/tournaments/switch` and `/tournaments/switch/`.
- If a host serves the tournaments hub at an old spectator address, the hub detects the Switch route and mounts the spectator screen with the same session/tournament query. It does not redirect the viewer back to registration.
- The tournament card and details show **Watch Live Wheel Spins** during initial pairing, the purchase window and re-pairing after a nuke. Finalized squads remain viewable there while staff generate the bracket. After bracket generation, the button becomes **View Live Bracket**.
- Registration remains the normal action before pairing starts. Ordinary tournaments retain their existing behavior. The Live filter includes Switch sessions in the wheel phase even if the tournament's older status field still says Registration Open.
- Open hub pages refresh the phase every five seconds while visible. Clicking an old registration button rechecks the session before opening registration. The existing backend also rejects registrations after pairing starts.
- Spectators use the existing read-only Switch screen and durable spin timing. Opening this view while signed in as staff does not expose desk controls.

## Files

Deploy the full ZIP, or these files together:

- `switch-public.js` (new)
- `switch-client.js`
- `server.js` (restart your Node server if using it)
- `tournaments/index.html`
- `tournaments/switch/index.html`
- `admin/index.html`
- `tournaments/bracket/index.html`
- `tournaments/brackets/index.html`

Ensure `tournaments/switch/index.html` is included in the actual hosted upload. A server-side rewrite that overrides every nested asset/page may still need to be corrected in your hosting configuration. Hard-refresh the admin portal after uploading so the new spectator link is used.

## Check after deployment

1. Open the spectator link from the Switch desk in another browser, including one signed out. Confirm it says Live Switch Arena rather than Competitive Tournaments Hub.
2. With a test tournament, close registration and begin pairing. Within five seconds, its hub card should show Watch Live Wheel Spins and appear under the Live filter.
3. Open that button, spin once from the admin desk and confirm both screens show the same result. Repeat during a nuke/re-pairing stage.
4. Finalize squads and generate the bracket. Confirm the hub action becomes View Live Bracket.

Local checks cover real HTTP requests to all three spectator URL forms, the hub-route fallback, durable session phase transitions, details-button changes, temporary network failures, existing Switch workflow permissions and escalating prices. The deployed host still needs the checks above.
