// =============================================================================
// FRONTLINE ARENA — OFFICIAL CDL 2027 (MW4) COMPETITIVE MAPS, MODES & SETTINGS
// Source: https://callofdutyleague.com/en-us/competitive-settings
// =============================================================================
(function (global) {
  "use strict";

  const CDL_COMPETITIVE_SETTINGS = {
    version: "CDL 2027 Competitive Settings · MW4",
    sourceUrl: "https://callofdutyleague.com/en-us/competitive-settings",
    mapPool: {
      Hardpoint: [
        "Lotus",
        "Lithium",
        "Munition",
        "Reactor U92",
        "Rooftops",
        "Sentry"
      ],
      SearchAndDestroy: [
        "Lotus",
        "Coal",
        "Munition",
        "Reactor U92",
        "Rooftops",
        "Silkworm"
      ],
      Hijack: [
        "Lotus",
        "Lithium",
        "Munition"
      ]
    },
    modes: [
      {
        key: "Hardpoint",
        label: "Hardpoint",
        icon: "🚩",
        tag: "RESPAWN · 6 MAPS",
        highlights: "250 Score Limit · 5 Min Limit · 60s Hill · 2.5s Respawn · Killcam Off",
        maps: ["Lotus", "Lithium", "Munition", "Reactor U92", "Rooftops", "Sentry"],
        categories: [
          {
            id: "game",
            title: "Game Settings",
            defaultOpen: true,
            rows: [
              ["Time Limit", "5 Minutes"],
              ["Score Limit", "250 Points"],
              ["Match Start Time", "30 Seconds"],
              ["Skip Infil Sequence", "Off"],
              ["Input Swap Allowed", "Off"],
              ["Spawn Bot on Death", "Off"],
              ["Allow Callout Pings", "Off"],
              ["Normalize Latency", "Off"]
            ]
          },
          {
            id: "advanced",
            title: "Advanced Settings",
            defaultOpen: false,
            rows: [
              ["Points per Kill", "0 Points"],
              ["Points per Death", "0 Points"],
              ["Headshot Bonus Points", "0 Points"],
              ["Killstreak Kill Bonus Points", "0 Points"],
              ["Time to Capture Zone", "Instant"],
              ["Zone Lifetime", "1 Minutes"],
              ["First Zone Activation Delay", "Off"],
              ["Zone Activation Delay", "Off"],
              ["Next Zone Reveal Time", "10 Seconds"],
              ["Random Zone Order", "Off"],
              ["Additive Scoring", "Off"],
              ["Pause Time on Zone Captured", "On"],
              ["Capture Team Spawn Delay", "3 Seconds"]
            ]
          },
          {
            id: "player",
            title: "Player Settings",
            defaultOpen: false,
            rows: [
              ["Number of Lives", "Unlimited"],
              ["Max Health", "100 (Normal)"],
              ["Health Regeneration", "Default"],
              ["Enable Armor", "Off"],
              ["Weapon Mounting", "Off"],
              ["Last Stand", "Off"]
            ]
          },
          {
            id: "team",
            title: "Team Settings",
            defaultOpen: false,
            rows: [
              ["Spectating", "Player View"],
              ["Killcam", "Off"],
              ["Enable Minimap", "On"],
              ["Minimap Radar Always On", "Off"],
              ["Weapon Fire on Minimap", "On"],
              ["Weapon Pings on Compass", "Off"],
              ["Respawn Delay", "2.5 Seconds"],
              ["Wave Spawn Delay", "Off"],
              ["Suicide Spawn Delay", "1 Seconds"],
              ["Force Respawn", "On"],
              ["Team Assignment", "Off"],
              ["Friendly Fire", "On"]
            ]
          },
          {
            id: "gameplay",
            title: "Gameplay Settings",
            defaultOpen: false,
            rows: [
              ["Care Package Drops", "Off"],
              ["Spawn Camera", "Off"],
              ["Hardcore Mode", "Off"],
              ["Ammo Magazines on Spawn", "Default (3)"],
              ["Headshots Only", "Off"],
              ["Health Steal", "Off"],
              ["Cranked Timer", "Off"],
              ["Enable Field Upgrades", "On"],
              ["Field Upgrade Charge Rate", "Default (1x)"],
              ["Field Upgrade Score Modifier", "Default (1x)"],
              ["Perks", "On"],
              ["Killstreaks", "On"],
              ["Retain Killstreaks Between Rounds", "On"],
              ["Retain Killstreaks on Death", "On"],
              ["Killstreak Delay", "10 Seconds"],
              ["Persistent Streak Progress", "Off"],
              ["Wrap Killstreaks", "Off"],
              ["Killstreak Lottery", "Off"],
              ["Equipment Delay", "Off"],
              ["Equipment Protection", "Off"],
              ["Battle Chatter", "Off"],
              ["Announcer Dialog", "On"],
              ["Tactical Sprint", "On"]
            ]
          }
        ]
      },
      {
        key: "SearchAndDestroy",
        label: "Search & Destroy",
        icon: "💣",
        tag: "ROUND-BASED · 6 MAPS",
        highlights: "6 Round Win Limit · 1:30 Round · 1 Life · 5s Plant / 7.5s Defuse",
        maps: ["Lotus", "Coal", "Munition", "Reactor U92", "Rooftops", "Silkworm"],
        categories: [
          {
            id: "game",
            title: "Game Settings",
            defaultOpen: true,
            rows: [
              ["Round Time Limit", "1 Minute 30 Seconds"],
              ["Round Win Limit", "6 Rounds"],
              ["Round Switch", "Every Round"],
              ["Win By Two Rule", "Off"],
              ["Match Start Time", "30 Seconds"],
              ["Round Start Time", "10 Seconds"],
              ["Skip Infil Sequence", "On"],
              ["Allow Input Swap", "Off"],
              ["Spawn Bot on Death", "Off"],
              ["Allow Callout Pings", "Off"],
              ["Normalize Latency", "Off"]
            ]
          },
          {
            id: "advanced",
            title: "Advanced Settings",
            defaultOpen: false,
            rows: [
              ["Bomb Timer", "45 Seconds"],
              ["Plant Time", "5 Seconds"],
              ["Defuse Time", "7.5 Seconds"],
              ["Multi Bomb", "Off"],
              ["Silent Plant/Defuse", "On"],
              ["Persistent Plant/Defuse Progress", "On"]
            ]
          },
          {
            id: "player",
            title: "Player Settings",
            defaultOpen: false,
            rows: [
              ["Number of Lives", "1 Life"],
              ["Max Health", "100 (Normal)"],
              ["Health Regeneration", "Default"],
              ["Enable Armor", "Off"],
              ["Weapon Mounting", "Off"],
              ["Last Stand", "Off"]
            ]
          },
          {
            id: "team",
            title: "Team Settings",
            defaultOpen: false,
            rows: [
              ["Spectating", "Player View"],
              ["Killcam", "Off"],
              ["Enable Minimap", "On"],
              ["Minimap Radar Always On", "Off"],
              ["Weapon Fire on Minimap", "On"],
              ["Weapon Pings on Compass", "Off"],
              ["Team Assignment", "Off"],
              ["Friendly Fire", "On"]
            ]
          },
          {
            id: "gameplay",
            title: "Gameplay Settings",
            defaultOpen: false,
            rows: [
              ["Care Package", "Off"],
              ["Spawn Camera", "Off"],
              ["Hardcore Mode", "Off"],
              ["Ammo Magazines on Spawn", "Default (3)"],
              ["Headshots Only", "Off"],
              ["Health Steal", "Off"],
              ["Cranked Timer", "Off"],
              ["Allow Field Upgrades", "On"],
              ["Field Upgrade Charge Rate", "Default (1x)"],
              ["Field Upgrade Score Event", "Default (1x)"],
              ["Enable Perks", "On"],
              ["Enable Killstreaks", "On"],
              ["Retain Killstreaks Between Rounds", "On"],
              ["Retain Streaks on Death", "On"],
              ["Killstreak Delay", "10 Seconds"],
              ["Persistent Streak Progress", "Off"],
              ["Wrap Killstreaks", "Off"],
              ["Killstreak Lottery", "Off"],
              ["Equipment Delay", "Off"],
              ["Equipment Protection", "Off"],
              ["Battle Chatter", "Off"],
              ["Announcer Dialog", "On"],
              ["Tactical Sprint", "On"]
            ]
          }
        ]
      },
      {
        key: "Hijack",
        label: "Hijack",
        icon: "⚡",
        tag: "OBJECTIVE · 3 MAPS",
        highlights: "150 Score Limit · 4 Min Limit · Unlimited Lives · 4s Respawn · Killcam On",
        maps: ["Lotus", "Lithium", "Munition"],
        categories: [
          {
            id: "game",
            title: "Game Settings",
            defaultOpen: true,
            rows: [
              ["Time Limit", "4 Minutes"],
              ["Score Limit", "150 Points"],
              ["Match Start Time", "15 Seconds"],
              ["Skip Infil Sequence", "Off"],
              ["Allow Input Swap", "Off"],
              ["Spawn Bot on Death", "Off"],
              ["Allow Callout Pings", "Off"],
              ["Normalize Latency", "Off"]
            ]
          },
          {
            id: "advanced",
            title: "Advanced Settings",
            defaultOpen: false,
            rows: [
              ["Points per Kill", "0 Points"],
              ["Points per Death", "0 Points"],
              ["Spawn Protection Time", "Off"],
              ["Planted Timer", "30 Seconds"],
              ["Deactivate Timer", "3 Seconds"],
              ["Score per Tick", "1 Point"],
              ["Throw Planted Score", "15 Points"],
              ["Carry Planted Score", "30 Points"],
              ["Upload Complete Score", "0 Points"],
              ["Spike Spawn Time", "12 Seconds"],
              ["Shot Clock Time", "45 Seconds"],
              ["Enemy Carrier Ping Time", "1.25 Seconds"]
            ]
          },
          {
            id: "player",
            title: "Player Settings",
            defaultOpen: false,
            rows: [
              ["Number of Lives", "Unlimited"],
              ["Max Health", "100 (Normal)"],
              ["Health Regeneration", "Default"],
              ["Enable Armor", "Off"],
              ["Weapon Mounting", "Off"],
              ["Last Stand", "Off"]
            ]
          },
          {
            id: "team",
            title: "Team Settings",
            defaultOpen: false,
            rows: [
              ["Spectating", "Player View"],
              ["Killcam", "On"],
              ["Enable Minimap", "Yes"],
              ["Minimap Radar Always On", "Off"],
              ["Weapon Fire on Minimap", "On"],
              ["Weapon Fire On Compass", "Off"],
              ["Respawn Delay", "4 Seconds"],
              ["Wave Spawn Delay", "Off"],
              ["Suicide Spawn Delay", "1 Second"],
              ["Force Respawn", "On"],
              ["Team Assignment", "Off"],
              ["Friendly Fire", "On"]
            ]
          },
          {
            id: "gameplay",
            title: "Gameplay Settings",
            defaultOpen: false,
            rows: [
              ["Care Package Drops", "Off"],
              ["Spawn Camera", "Off"],
              ["Hardcore Mode", "Off"],
              ["Ammo Magazines on Spawn", "Default (3)"],
              ["Headshots Only", "Off"],
              ["Health Steal", "Off"],
              ["Cranked Timer", "Off"],
              ["Enable Field Upgrades", "On"],
              ["Field Upgrade Charge Rate", "Default (1x)"],
              ["Field Upgrade Score Modifier", "Default (1x)"],
              ["Enable Perks", "On"],
              ["Enable Killstreaks", "On"],
              ["Retain Killstreaks Between Rounds", "On"],
              ["Retain Killstreaks on Death", "On"],
              ["Killstreak Delay", "10 Seconds"],
              ["Persistent Killstreak Progress", "Off"],
              ["Wrap Killstreak", "Off"],
              ["Killstreak Lottery", "Off"],
              ["Equipment Delay", "Off"],
              ["Equipment Protection", "5 Seconds"],
              ["Battle Chatter", "Off"],
              ["Announcer Dialog", "On"],
              ["Tactical Sprint", "On"]
            ]
          }
        ]
      }
    ],
    restrictedItems: [
      {
        id: "weapons",
        title: "Primary & Secondary Weapons",
        defaultOpen: true,
        rows: [
          ["LMGs (Primary)", "ALL"],
          ["Marksman Rifles (Primary)", "ALL"],
          ["Shotguns (Primary)", "ALL"],
          ["Sniper Rifles (Primary)", "Astaroth .57, Signal 50"],
          ["Launchers (Secondary)", "ALL"]
        ]
      },
      {
        id: "attachments",
        title: "Restricted Attachments",
        defaultOpen: false,
        rows: [
          ["APEX", "ALL"],
          ["Lasers", "ALL"],
          [
            "Muzzles",
            "FTAC Lonestar, Expedite Drill L4, SFO Proto-33, Demo Ironshade, XRK Herder 40, FSS Crackdown, FSS IS40, XRK Mil-Tac Suppressor, FSS IS300, Ivanov QR600, DS RKT-90, Gauge-12 Mono, TT Solgae F7"
          ],
          [
            "Optics",
            "Bruen THRM-60 Optic, Schlager Night View Pro, RVX9 Thermo, Luca Stormwatch, Bruen Maestro"
          ],
          ["Underbarrels", "Miri 40mm, TV Judicator"],
          ["Rear Grips", "Akimbo"],
          ["Barrels", "Han 86 Silenced 413mm"]
        ]
      },
      {
        id: "equipment",
        title: "Tactical & Lethal Equipment",
        defaultOpen: false,
        rows: [
          [
            "Tactical",
            "Flash Grenade, Snapshot Grenade, Heartbeat Sensor, Shock Stick, Decoy Grenade, Stim, Screamer Mine"
          ],
          [
            "Lethal",
            "Drill Charge, Proximity Mine, Zip Gun, Trip Wire, Thermite, Molotov Cocktail, Claymore, C4, Throwing Knife"
          ]
        ]
      },
      {
        id: "upgrades-perks-streaks",
        title: "Field Upgrades, Perks & Killstreaks",
        defaultOpen: false,
        rows: [
          [
            "Field Upgrades",
            "Portable Radar, DDOS, Munitions Box, Sam Airburst Turret, Riot Shield, Seeker Drone, Inflatable Decoy, Recon Drone, Razor Wire Trap, Tactical Insertion"
          ],
          ["PERK 1", "Quick Fix, Overkill, High Alert, Ghost, Resupply"],
          ["PERK 2", "Hardline, Birds Eye"],
          ["PERK 3", "Lethal Reach, Combat Grid, Scavenger, Tracker, Cold-Blooded"],
          [
            "Killstreaks",
            "UAV, Bomb Glider, Care Package, Impact Warhead, Artillery Beacon, Crossfire, Combat Drone, Counter UAV, Wheelson, Railgun Sentry, Attack Helicopter, Deathstalker, Advanced UAV, Argonaut, Gunship, Air Lockdown"
          ]
        ]
      }
    ]
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function injectStylesOnce() {
    if (document.getElementById("cdl-comp-styles")) return;
    const style = document.createElement("style");
    style.id = "cdl-comp-styles";
    style.textContent = `
      @property --cdl-fade-start {
        syntax: "<length>";
        inherits: false;
        initial-value: 0px;
      }
      @property --cdl-fade-end {
        syntax: "<length>";
        inherits: false;
        initial-value: 0px;
      }

      .cdl-comp-shell {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .cdl-comp-shell .gb-meta-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 3px;
        font: 800 11px var(--body, system-ui, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        background: rgba(255, 30, 68, 0.14);
        border: 1px solid rgba(255, 30, 68, 0.4);
        color: #ff6b84;
      }

      .cdl-comp-shell .btn-crimson-outline {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        border: 1px solid rgba(255, 30, 68, 0.55);
        color: #ff6b84;
        border-radius: 4px;
        font: 800 11.5px var(--body, system-ui, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 8px 14px;
        text-decoration: none;
        white-space: nowrap;
      }

      .cdl-comp-shell .btn-crimson-outline:hover {
        background: rgba(255, 30, 68, 0.14);
        border-color: #ff1e44;
        color: #ffffff;
      }

      .cdl-comp-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 14px;
      }

      .cdl-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
      }

      .cdl-maps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .cdl-mode-map-card {
        background: #0e131d;
        border: 1px solid #1e283a;
        border-radius: 6px;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cdl-mode-map-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #1a2333;
      }

      .cdl-mode-map-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font: 900 15px var(--body, sans-serif);
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin: 0;
      }

      .cdl-mode-map-count {
        font: 800 10.5px var(--body, sans-serif);
        color: #ff1e44;
        background: rgba(255, 30, 68, 0.12);
        border: 1px solid rgba(255, 30, 68, 0.35);
        padding: 3px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .cdl-mode-quick-specs {
        font-size: 11.5px;
        color: #94a3b8;
        line-height: 1.45;
      }

      .cdl-map-pill-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .cdl-map-pill {
        background: #090d14;
        border: 1px solid #1c2637;
        border-left: 3px solid #ff1e44;
        border-radius: 4px;
        padding: 7px 10px;
        font: 700 12.5px var(--body, sans-serif);
        color: #f8fafc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Single-row accessible tablist with edge scroll fades */
      .cdl-tablist-wrap {
        position: relative;
        border-bottom: 1px solid #1e283a;
      }

      .cdl-tablist {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 6px;
        scrollbar-width: none;
        scroll-snap-type: inline proximity;
        scroll-padding-inline: 2.25rem;
        --cdl-fade-size: 2.25rem;
        mask:
          linear-gradient(black, black) no-clip subtract,
          linear-gradient(to right, black, transparent) 0 0 / var(--cdl-fade-start) 100% no-repeat no-clip,
          linear-gradient(to right, transparent, black) 100% 0 / var(--cdl-fade-end) 100% no-repeat no-clip;
        animation: cdl-fade-start linear both, cdl-fade-end linear both;
        animation-timeline: scroll(self inline);
        animation-range: 0 var(--cdl-fade-size), calc(100% - var(--cdl-fade-size)) 100%;
      }

      .cdl-tablist::-webkit-scrollbar {
        display: none;
      }

      @supports not (animation-timeline: scroll()) {
        .cdl-tablist {
          animation: none;
          transition: --cdl-fade-start 0.2s, --cdl-fade-end 0.2s;
        }
        .cdl-tablist.more-start {
          --cdl-fade-start: var(--cdl-fade-size);
        }
        .cdl-tablist.more-end {
          --cdl-fade-end: var(--cdl-fade-size);
        }
      }

      @keyframes cdl-fade-start {
        to { --cdl-fade-start: var(--cdl-fade-size); }
      }

      @keyframes cdl-fade-end {
        from { --cdl-fade-end: var(--cdl-fade-size); }
      }

      .cdl-tab-btn {
        flex: none;
        scroll-snap-align: start;
        position: relative;
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 0;
        margin: 0;
        padding: 11px 16px 13px;
        font: 800 12.5px var(--body, system-ui, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.45px;
        color: #94a3b8;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        white-space: nowrap;
      }

      .cdl-tab-btn:hover {
        color: #e2e8f0;
      }

      .cdl-tab-btn:focus-visible {
        outline: 2px solid #ff1e44;
        outline-offset: -2px;
      }

      .cdl-tab-btn[aria-selected="true"] {
        color: #ffffff;
      }

      .cdl-tab-btn[aria-selected="true"]::after {
        content: "";
        position: absolute;
        inset: auto 0 0;
        border-block-end: 3px solid #ff1e44;
      }

      /* Stacked panels grid: no padding/borders on role="tabpanel" itself */
      .cdl-panels-grid {
        display: grid;
      }

      .cdl-tabpanel {
        grid-area: 1 / 1;
        min-width: 0;
        padding: 0;
        margin: 0;
        border: 0;
        background: transparent;
      }

      .cdl-tabpanel[hidden] {
        pointer-events: none;
      }

      .cdl-panel-surface {
        background: #0e131d;
        border: 1px solid #1e283a;
        border-radius: 6px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .cdl-panel-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .cdl-panel-title {
        font: 800 16px var(--body, sans-serif);
        color: #ffffff;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      .cdl-panel-sub {
        font-size: 12px;
        color: #94a3b8;
        margin: 3px 0 0;
      }

      /* Expand / Collapse all button */
      .cdl-toggle-all-btn {
        margin: 0;
        background: #141c2b;
        border: 1px solid #283548;
        color: #e2e8f0;
        border-radius: 4px;
        padding: 6px 12px;
        font: 700 11.5px var(--body, system-ui, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.4px;
        cursor: pointer;
      }

      .cdl-toggle-all-btn:hover {
        border-color: #ff1e44;
        color: #ffffff;
      }

      .cdl-toggle-all-btn[aria-expanded="true"] .cdl-label-expand,
      .cdl-toggle-all-btn[aria-expanded="false"] .cdl-label-collapse {
        display: none;
      }

      /* Native details accordion */
      .cdl-accordion {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cdl-accordion > details {
        background: #090d14;
        border: 1px solid #1a2333;
        border-radius: 5px;
      }

      .cdl-accordion > details[open] {
        border-color: #29364f;
      }

      .cdl-accordion > details > summary {
        list-style: none;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 12px 14px;
        cursor: pointer;
        user-select: none;
        color: #ffffff;
        font: 800 13px var(--body, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      .cdl-accordion > details > summary::-webkit-details-marker {
        display: none;
      }

      .cdl-accordion > details > summary:hover {
        background: rgba(255, 255, 255, 0.03);
      }

      .cdl-accordion > details > summary::before {
        content: "";
        inline-size: 14px;
        block-size: 14px;
        flex-shrink: 0;
        background-color: #ff1e44;
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat center / contain;
        rotate: -90deg;
      }

      .cdl-accordion > details[open] > summary::before {
        rotate: 0deg;
      }

      @media (prefers-reduced-motion: no-preference) {
        .cdl-accordion > details > summary::before {
          transition: rotate 0.2s ease;
        }
        .cdl-accordion > details::details-content {
          transition: block-size, content-visibility, display;
          transition-duration: 0.26s;
          transition-timing-function: ease-in-out;
          transition-behavior: allow-discrete;
        }
      }

      .cdl-accordion > details::details-content {
        interpolate-size: allow-keywords;
        overflow: clip;
        contain: layout;
      }

      .cdl-accordion > details:not([open])::details-content {
        block-size: 0;
      }

      .cdl-summary-count {
        margin-left: auto;
        font: 700 11px var(--body, sans-serif);
        color: #94a3b8;
        text-transform: none;
        letter-spacing: 0;
      }

      /* Responsive semantic settings table */
      .cdl-table-wrapper {
        width: 100%;
        box-sizing: border-box;
        overflow: auto;
        max-inline-size: 100%;
        max-block-size: min(440px, 70vh);
        container-type: inline-size;
        border-top: 1px solid #162030;
      }

      .cdl-table-wrapper:focus-visible {
        outline: 2px solid #ff1e44;
        outline-offset: -2px;
      }

      .cdl-settings-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 13px;
        text-align: left;
      }

      .cdl-settings-table thead {
        position: sticky;
        inset-block-start: 0;
        z-index: 1;
      }

      .cdl-settings-table thead th {
        background: #0d131f;
        color: #94a3b8;
        font: 800 11px var(--body, sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 9px 14px;
        border-bottom: 1px solid #1e283a;
      }

      .cdl-settings-table tbody tr:hover td,
      .cdl-settings-table tbody tr:hover th {
        background: rgba(255, 255, 255, 0.025);
      }

      .cdl-settings-table tbody th,
      .cdl-settings-table tbody td {
        padding: 9px 14px;
        border-bottom: 1px solid #141d2d;
        vertical-align: top;
      }

      .cdl-settings-table tbody th {
        font-weight: 700;
        color: #cbd5e1;
        width: 52%;
        background: #090d14;
      }

      .cdl-settings-table tbody td {
        color: #ffffff;
        font-weight: 700;
      }

      .cdl-val-on {
        color: #22c55e;
      }

      .cdl-val-off {
        color: #94a3b8;
      }

      .cdl-val-highlight {
        color: #fde047;
      }

      .cdl-val-restricted {
        color: #f87171;
        font-weight: 600;
        line-height: 1.5;
      }

      @container (width < 430px) {
        .cdl-settings-table,
        .cdl-settings-table thead,
        .cdl-settings-table tbody,
        .cdl-settings-table tr,
        .cdl-settings-table th,
        .cdl-settings-table td {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .cdl-settings-table thead {
          display: none;
        }
        .cdl-settings-table tr {
          border-bottom: 1px solid #1e283a;
          padding: 8px 12px;
        }
        .cdl-settings-table tbody th,
        .cdl-settings-table tbody td {
          border-bottom: 0;
          padding: 3px 0;
        }
        .cdl-settings-table tbody td::before {
          content: attr(data-col-label) ": ";
          color: #64748b;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function formatValueClass(val, isRestricted) {
    if (isRestricted) return "cdl-val-restricted";
    const s = String(val).trim();
    if (s === "On" || s === "Yes") return "cdl-val-on";
    if (s === "Off") return "cdl-val-off";
    if (/Points|Seconds|Minutes|Round|Life|1x|Instant/i.test(s)) return "cdl-val-highlight";
    return "";
  }

  function renderCategoryDetails(prefixId, cat, valueLabel, isRestricted) {
    const captionId = `${prefixId}-cap-${cat.id}`;
    const rowsHtml = cat.rows.map(([setting, val]) => {
      const cls = formatValueClass(val, isRestricted);
      return `
        <tr>
          <th scope="row">${escapeHtml(setting)}</th>
          <td data-col-label="${escapeHtml(valueLabel)}" class="${cls}">${escapeHtml(val)}</td>
        </tr>
      `;
    }).join("");

    return `
      <details ${cat.defaultOpen ? "open" : ""}>
        <summary>
          <span>${escapeHtml(cat.title)}</span>
          <span class="cdl-summary-count">${cat.rows.length} ${cat.rows.length === 1 ? "rule" : "rules"}</span>
        </summary>
        <div tabindex="0" role="region" aria-labelledby="${escapeHtml(captionId)}" class="cdl-table-wrapper">
          <table class="cdl-settings-table">
            <caption id="${escapeHtml(captionId)}" class="cdl-sr-only">${escapeHtml(cat.title)}</caption>
            <thead>
              <tr>
                <th scope="col">Setting</th>
                <th scope="col">${escapeHtml(valueLabel)}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  function renderCdlCompetitivePanel(containerId, options) {
    const host = document.getElementById(containerId);
    if (!host) return;
    injectStylesOnce();

    const opts = options || {};
    const uid = containerId.replace(/[^a-zA-Z0-9_-]/g, "");
    const title = opts.title || "Official CDL 2027 Competitive Maps, Modes & Settings";
    const subtitle = opts.subtitle || "Synchronized with official Call of Duty League MW4 Competitive Settings (Hardpoint, Search & Destroy, Hijack).";
    const seriesSummary = opts.seriesSummary || "Arena Rotation: Hardpoint · Search & Destroy · Hijack";
    const tabItems = [
      ...CDL_COMPETITIVE_SETTINGS.modes.map(m => ({ id: m.key, label: m.label, icon: m.icon })),
      { id: "RestrictedItems", label: "Restricted Items", icon: "🚫" }
    ];

    const mapCardsHtml = CDL_COMPETITIVE_SETTINGS.modes.map(m => `
      <article class="cdl-mode-map-card">
        <div class="cdl-mode-map-head">
          <h4 class="cdl-mode-map-title">
            <span>${m.icon}</span>
            <span>${escapeHtml(m.label)}</span>
          </h4>
          <span class="cdl-mode-map-count">${m.maps.length} Maps</span>
        </div>
        <div class="cdl-mode-quick-specs">${escapeHtml(m.highlights)}</div>
        <ul class="cdl-map-pill-list">
          ${m.maps.map(mapName => `<li class="cdl-map-pill" title="${escapeHtml(mapName)}">${escapeHtml(mapName)}</li>`).join("")}
        </ul>
      </article>
    `).join("");

    const tabsButtonsHtml = tabItems.map((t, idx) => `
      <button
        type="button"
        role="tab"
        class="cdl-tab-btn"
        id="${uid}-tab-${t.id}"
        aria-selected="${idx === 0 ? "true" : "false"}"
        tabindex="${idx === 0 ? "0" : "-1"}"
        data-cdl-tab="${t.id}"
      >
        <span>${t.icon}</span>
        <span>${escapeHtml(t.label)}</span>
      </button>
    `).join("");

    const modePanelsHtml = CDL_COMPETITIVE_SETTINGS.modes.map((m, idx) => {
      const accId = `${uid}-acc-${m.key}`;
      const isFirst = idx === 0;
      const allOpen = m.categories.every(c => c.defaultOpen);
      return `
        <div
          role="tabpanel"
          class="cdl-tabpanel"
          id="${uid}-panel-${m.key}"
          aria-labelledby="${uid}-tab-${m.key}"
          ${isFirst ? 'tabindex="0"' : 'hidden="until-found"'}
        >
          <div class="cdl-panel-surface">
            <div class="cdl-panel-top">
              <div>
                <h4 class="cdl-panel-title">${m.icon} ${escapeHtml(m.label)} Competitive Settings</h4>
                <p class="cdl-panel-sub">${escapeHtml(m.highlights)} · Official Map Pool: ${escapeHtml(m.maps.join(", "))}</p>
              </div>
              <button
                type="button"
                class="cdl-toggle-all-btn"
                data-acc-target="${accId}"
                aria-expanded="${allOpen ? "true" : "false"}"
              >
                <span class="cdl-label-expand">Expand all</span>
                <span class="cdl-label-collapse">Collapse all</span>
              </button>
            </div>
            <div class="cdl-accordion" id="${accId}">
              ${m.categories.map(cat => renderCategoryDetails(`${uid}-${m.key}`, cat, "CDL Value", false)).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");

    const restrictedAccId = `${uid}-acc-RestrictedItems`;
    const restrictedAllOpen = CDL_COMPETITIVE_SETTINGS.restrictedItems.every(c => c.defaultOpen);
    const restrictedPanelHtml = `
      <div
        role="tabpanel"
        class="cdl-tabpanel"
        id="${uid}-panel-RestrictedItems"
        aria-labelledby="${uid}-tab-RestrictedItems"
        hidden="until-found"
      >
        <div class="cdl-panel-surface">
          <div class="cdl-panel-top">
            <div>
              <h4 class="cdl-panel-title">🚫 CDL 2027 Restricted Items (MW4)</h4>
              <p class="cdl-panel-sub">All prohibited weapons, attachments, equipment, field upgrades, perks, and killstreaks across Arena &amp; 8's.</p>
            </div>
            <button
              type="button"
              class="cdl-toggle-all-btn"
              data-acc-target="${restrictedAccId}"
              aria-expanded="${restrictedAllOpen ? "true" : "false"}"
            >
              <span class="cdl-label-expand">Expand all</span>
              <span class="cdl-label-collapse">Collapse all</span>
            </button>
          </div>
          <div class="cdl-accordion" id="${restrictedAccId}">
            ${CDL_COMPETITIVE_SETTINGS.restrictedItems.map(cat => renderCategoryDetails(`${uid}-restricted`, cat, "Restricted Status", true)).join("")}
          </div>
        </div>
      </div>
    `;

    host.innerHTML = `
      <div class="cdl-comp-shell">
        <div class="cdl-comp-header">
          <div>
            <div class="gb-meta-tag accent" style="margin-bottom:8px; display:inline-flex;">
              📋 ${escapeHtml(CDL_COMPETITIVE_SETTINGS.version)}
            </div>
            <h3 style="font-family:var(--display, system-ui, sans-serif); font-size:26px; text-transform:uppercase; color:#ffffff; margin:0 0 4px;">
              ${escapeHtml(title)}
            </h3>
            <p style="font-size:13px; color:#94a3b8; margin:0; line-height:1.5;">
              ${escapeHtml(subtitle)} <span style="color:#cbd5e1; font-weight:700;">${escapeHtml(seriesSummary)}</span>
            </p>
          </div>
          <a
            href="${escapeHtml(CDL_COMPETITIVE_SETTINGS.sourceUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-crimson-outline"
            style="padding:8px 14px; font-size:11.5px; text-decoration:none; white-space:nowrap;"
          >
            <span>🔗</span> <span>Official CDL Rulebook</span>
          </a>
        </div>

        <div class="cdl-maps-grid">
          ${mapCardsHtml}
        </div>

        <div>
          <div class="cdl-tablist-wrap">
            <div class="cdl-tablist" role="tablist" aria-label="CDL Mode Competitive Settings">
              ${tabsButtonsHtml}
            </div>
          </div>

          <div class="cdl-panels-grid" style="margin-top:14px;">
            ${modePanelsHtml}
            ${restrictedPanelHtml}
          </div>
        </div>
      </div>
    `;

    wireInteractions(host, uid);
  }

  function wireInteractions(host, uid) {
    const tablist = host.querySelector('[role="tablist"]');
    const tabs = Array.from(host.querySelectorAll('[role="tab"]'));
    const panels = Array.from(host.querySelectorAll('[role="tabpanel"]'));

    function activateTab(targetTab, shouldFocus) {
      if (!targetTab) return;
      const key = targetTab.getAttribute("data-cdl-tab");
      tabs.forEach(t => {
        const selected = t === targetTab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(p => {
        const isMatch = p.id === `${uid}-panel-${key}`;
        if (isMatch) {
          p.hidden = false;
          p.tabIndex = 0;
        } else {
          p.hidden = "until-found";
          p.removeAttribute("tabindex");
        }
      });
      if (typeof targetTab.scrollIntoView === "function") {
        try {
          targetTab.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
        } catch (_e) {
          targetTab.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      }
      if (shouldFocus) targetTab.focus();
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => activateTab(tab, false));
      tab.addEventListener("keydown", event => {
        const idx = tabs.indexOf(tab);
        let nextIdx = -1;
        if (event.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIdx = 0;
        else if (event.key === "End") nextIdx = tabs.length - 1;
        if (nextIdx !== -1) {
          event.preventDefault();
          activateTab(tabs[nextIdx], true);
        }
      });
    });

    // Support browser Find-in-Page revealing hidden="until-found" panels
    panels.forEach(panel => {
      panel.addEventListener("beforematch", () => {
        const tabId = panel.getAttribute("aria-labelledby");
        const tab = tabId ? document.getElementById(tabId) : null;
        if (tab) activateTab(tab, false);
      });
    });

    // Scroll affordance fade fallback when CSS scroll() timeline is unsupported
    if (tablist && typeof CSS !== "undefined" && (!CSS.supports || !CSS.supports("animation-timeline", "scroll()")) && typeof IntersectionObserver !== "undefined") {
      const first = tablist.firstElementChild;
      const last = tablist.lastElementChild;
      if (first && last) {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            tablist.classList.toggle(entry.target === first ? "more-start" : "more-end", entry.intersectionRatio < 1);
          });
        }, { root: tablist, threshold: 1, rootMargin: "1px" });
        obs.observe(first);
        obs.observe(last);
      }
    }

    // Expand all / Collapse all controls + individual toggle sync
    host.querySelectorAll(".cdl-toggle-all-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const acc = document.getElementById(btn.getAttribute("data-acc-target"));
        if (!acc) return;
        const shouldExpand = btn.getAttribute("aria-expanded") !== "true";
        acc.querySelectorAll(":scope > details").forEach(d => {
          d.open = shouldExpand;
        });
        btn.setAttribute("aria-expanded", String(shouldExpand));
      });
    });

    host.querySelectorAll(".cdl-accordion > details").forEach(det => {
      det.addEventListener("toggle", () => {
        const acc = det.parentElement;
        if (!acc || !acc.id) return;
        const btn = host.querySelector(`.cdl-toggle-all-btn[data-acc-target="${CSS.escape(acc.id)}"]`);
        if (!btn) return;
        const items = Array.from(acc.querySelectorAll(":scope > details"));
        const allOpen = items.length > 0 && items.every(item => item.open);
        btn.setAttribute("aria-expanded", String(allOpen));
      });
    });
  }

  global.CDL_COMPETITIVE_SETTINGS = CDL_COMPETITIVE_SETTINGS;
  global.renderCdlCompetitivePanel = renderCdlCompetitivePanel;
})(window);
