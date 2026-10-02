// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - TOURNAMENT BRACKET SYSTEM & ENGINE
// ==============================================================================

(function () {
  if (typeof window === "undefined") return;

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // ============================================================================
  // COMPREHENSIVE BRACKET DATA BY DIVISION
  // ============================================================================
  const BRACKET_DATA = {
    // --------------------------------------------------------------------------
    // DIVISION 1: PREMIER CHAMPIONSHIP (Double Elimination)
    // --------------------------------------------------------------------------
    premier: {
      id: "premier",
      name: "Premier Championship",
      tier: "Division 1 · Pro Tier",
      badge: "ELITE DIVISION",
      format: "8-Team Double Elimination (Best of 5)",
      prizePool: "$1,000 USD",
      status: "CHAMPIONSHIP STAGE",
      description: "The top 8 franchise squads battling in the definitive Frontline double-elimination tournament.",
      ruleset: "CDL V4 Competitive Settings · 4v4 HP / S&D / CTL",
      explainer: {
        kicker: "COMPETITIVE FRAMEWORK // PRO DIVISION 1",
        title: 'How Premier <span style="color:var(--lime);">Double Elimination Works</span>',
        items: [
          {
            title: "1. Double Elimination Format",
            text: "Division 1 operates on a full double-elimination structure. A team that loses in the Winners (Upper) Bracket drops to the Elimination (Lower) Bracket for a second opportunity. A second loss results in complete tournament elimination."
          },
          {
            title: "2. Best of 5 Series Rotation",
            text: "Standard CDL match rotation: Map 1 Hardpoint (250 pts), Map 2 Search & Destroy (First to 6), Map 3 Control (First to 3), Map 4 Hardpoint, and Map 5 Search & Destroy. All series are played to first to 3 map wins."
          },
          {
            title: "3. Grand Finals & Bracket Reset",
            text: "The squad advancing undefeated from the Winners Bracket enters Grand Finals with 1-series advantage. The team emerging from the Elimination Bracket must win two consecutive Best of 5 series (Bracket Reset) to claim the championship title."
          },
          {
            title: "4. Live Telemetry & VODs",
            text: "Click on any match card in the bracket to review individual map telemetry, series scoreboard breakdowns, slayer MVPs, and link directly to full stream broadcasts."
          }
        ]
      },
      stages: [
        {
          id: "winners",
          name: "Winners Bracket (Upper)",
          rounds: [
            {
              roundId: "ub-qf",
              name: "Upper Quarterfinals",
              badge: "Round 1",
              bestOf: "BO5",
              matches: [
                {
                  id: "M1",
                  code: "UB-QF1",
                  status: "Completed",
                  time: "Fri · 6:00 PM EST",
                  team1: { seed: 1, name: "Night Shift", tag: "NSH", score: 3, winner: true },
                  team2: { seed: 8, name: "Ironclad", tag: "ICD", score: 0, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 180", winner: "Night Shift" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "6 - 2", winner: "Night Shift" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 0", winner: "Night Shift" }
                  ],
                  mvp: "Apex (1.45 K/D · 74 Kills)",
                  vodUrl: "livestreams.html"
                },
                {
                  id: "M2",
                  code: "UB-QF2",
                  status: "Completed",
                  time: "Fri · 7:15 PM EST",
                  team1: { seed: 4, name: "Static", tag: "STC", score: 2, winner: false },
                  team2: { seed: 5, name: "Sub Zero", tag: "SBZ", score: 3, winner: true },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "242 - 250", winner: "Sub Zero" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "6 - 4", winner: "Static" },
                    { number: 3, mode: "Control", map: "Karachi", score: "3 - 2", winner: "Static" },
                    { number: 4, mode: "Hardpoint", map: "Invasion", score: "215 - 250", winner: "Sub Zero" },
                    { number: 5, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Sub Zero" }
                  ],
                  mvp: "Frost (1.28 K/D · 88 Kills)",
                  vodUrl: "livestreams.html"
                },
                {
                  id: "M3",
                  code: "UB-QF3",
                  status: "Completed",
                  time: "Fri · 8:30 PM EST",
                  team1: { seed: 2, name: "Vantage", tag: "VTG", score: 3, winner: true },
                  team2: { seed: 7, name: "Apex Predators", tag: "APX", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "250 - 195", winner: "Vantage" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "6 - 3", winner: "Vantage" },
                    { number: 3, mode: "Control", map: "Invasion", score: "1 - 3", winner: "Apex Predators" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 210", winner: "Vantage" }
                  ],
                  mvp: "Specter (1.34 K/D · 79 Kills)",
                  vodUrl: "livestreams.html"
                },
                {
                  id: "M4",
                  code: "UB-QF4",
                  status: "Completed",
                  time: "Fri · 9:45 PM EST",
                  team1: { seed: 3, name: "Redline", tag: "RED", score: 3, winner: true },
                  team2: { seed: 6, name: "Havoc Esports", tag: "HVC", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 240", winner: "Redline" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Havoc Esports" },
                    { number: 3, mode: "Control", map: "Karachi", score: "3 - 1", winner: "Redline" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "210 - 250", winner: "Havoc Esports" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 4", winner: "Redline" }
                  ],
                  mvp: "Reaper (1.26 K/D · 91 Kills)",
                  vodUrl: "livestreams.html"
                }
              ]
            },
            {
              roundId: "ub-sf",
              name: "Upper Semifinals",
              badge: "Round 2",
              bestOf: "BO5",
              matches: [
                {
                  id: "M7",
                  code: "UB-SF1",
                  status: "Completed",
                  time: "Sat · 4:00 PM EST",
                  team1: { seed: 1, name: "Night Shift", tag: "NSH", score: 3, winner: true },
                  team2: { seed: 5, name: "Sub Zero", tag: "SBZ", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 205", winner: "Night Shift" },
                    { number: 2, mode: "Search & Destroy", map: "Invasion", score: "5 - 6", winner: "Sub Zero" },
                    { number: 3, mode: "Control", map: "Highrise", score: "3 - 1", winner: "Night Shift" },
                    { number: 4, mode: "Hardpoint", map: "Rio", score: "250 - 190", winner: "Night Shift" }
                  ],
                  mvp: "Ghost (1.38 K/D · Clutch 1v2)",
                  vodUrl: "livestreams.html"
                },
                {
                  id: "M8",
                  code: "UB-SF2",
                  status: "Completed",
                  time: "Sat · 5:30 PM EST",
                  team1: { seed: 2, name: "Vantage", tag: "VTG", score: 3, winner: true },
                  team2: { seed: 3, name: "Redline", tag: "RED", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "250 - 230", winner: "Vantage" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Redline" },
                    { number: 3, mode: "Control", map: "Invasion", score: "2 - 3", winner: "Redline" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 215", winner: "Vantage" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 5", winner: "Vantage" }
                  ],
                  mvp: "Havoc (1.31 K/D · Round 11 ACE)",
                  vodUrl: "livestreams.html"
                }
              ]
            },
            {
              roundId: "ub-f",
              name: "Winners Finals",
              badge: "Upper Final",
              bestOf: "BO5",
              matches: [
                {
                  id: "M11",
                  code: "UB-F",
                  status: "Completed",
                  time: "Sun · 2:00 PM EST",
                  team1: { seed: 1, name: "Night Shift", tag: "NSH", score: 3, winner: true },
                  team2: { seed: 2, name: "Vantage", tag: "VTG", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 238", winner: "Night Shift" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Vantage" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 2", winner: "Night Shift" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "220 - 250", winner: "Vantage" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 4", winner: "Night Shift" }
                  ],
                  mvp: "Apex (1.42 K/D · 102 Total Kills)",
                  note: "Winner advances directly to Grand Finals. Loser drops to Losers Finals.",
                  vodUrl: "livestreams.html"
                }
              ]
            }
          ]
        },
        {
          id: "elimination",
          name: "Elimination Bracket (Lower)",
          rounds: [
            {
              roundId: "lb-r1",
              name: "Elimination Round 1",
              badge: "Do or Die",
              bestOf: "BO5",
              matches: [
                {
                  id: "M5",
                  code: "LB-R1A",
                  status: "Completed",
                  time: "Sat · 1:00 PM EST",
                  team1: { seed: 8, name: "Ironclad", tag: "ICD", score: 1, winner: false },
                  team2: { seed: 4, name: "Static", tag: "STC", score: 3, winner: true },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "250 - 180", winner: "Static" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "4 - 6", winner: "Ironclad" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Static" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 220", winner: "Static" }
                  ],
                  mvp: "Titan (1.29 K/D · 76 Kills)"
                },
                {
                  id: "M6",
                  code: "LB-R1B",
                  status: "Completed",
                  time: "Sat · 2:30 PM EST",
                  team1: { seed: 7, name: "Apex Predators", tag: "APX", score: 1, winner: false },
                  team2: { seed: 6, name: "Havoc Esports", tag: "HVC", score: 3, winner: true },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "210 - 250", winner: "Havoc Esports" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "6 - 4", winner: "Apex Predators" },
                    { number: 3, mode: "Control", map: "Karachi", score: "1 - 3", winner: "Havoc Esports" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "190 - 250", winner: "Havoc Esports" }
                  ],
                  mvp: "Bullet (1.32 K/D · 81 Kills)"
                }
              ]
            },
            {
              roundId: "lb-qf",
              name: "Elimination Quarterfinals",
              badge: "Top 6",
              bestOf: "BO5",
              matches: [
                {
                  id: "M9",
                  code: "LB-QF1",
                  status: "Completed",
                  time: "Sat · 7:00 PM EST",
                  team1: { seed: 3, name: "Redline", tag: "RED", score: 3, winner: true },
                  team2: { seed: 4, name: "Static", tag: "STC", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 210", winner: "Redline" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "6 - 2", winner: "Redline" },
                    { number: 3, mode: "Control", map: "Invasion", score: "2 - 3", winner: "Static" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "250 - 195", winner: "Redline" }
                  ],
                  mvp: "Pulse (1.27 K/D · 72 Kills)"
                },
                {
                  id: "M10",
                  code: "LB-QF2",
                  status: "Completed",
                  time: "Sat · 8:30 PM EST",
                  team1: { seed: 5, name: "Sub Zero", tag: "SBZ", score: 3, winner: true },
                  team2: { seed: 6, name: "Havoc Esports", tag: "HVC", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "235 - 250", winner: "Havoc Esports" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "6 - 4", winner: "Sub Zero" },
                    { number: 3, mode: "Control", map: "Highrise", score: "3 - 2", winner: "Sub Zero" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "210 - 250", winner: "Havoc Esports" },
                    { number: 5, mode: "Search & Destroy", map: "Highrise", score: "6 - 3", winner: "Sub Zero" }
                  ],
                  mvp: "Glacier (1.30 K/D · 89 Kills)"
                }
              ]
            },
            {
              roundId: "lb-sf",
              name: "Elimination Semifinals",
              badge: "Top 4",
              bestOf: "BO5",
              matches: [
                {
                  id: "M12",
                  code: "LB-SF",
                  status: "Completed",
                  time: "Sun · 3:30 PM EST",
                  team1: { seed: 3, name: "Redline", tag: "RED", score: 3, winner: true },
                  team2: { seed: 5, name: "Sub Zero", tag: "SBZ", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 245", winner: "Redline" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "3 - 6", winner: "Sub Zero" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Redline" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "205 - 250", winner: "Sub Zero" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 4", winner: "Redline" }
                  ],
                  mvp: "Reaper (1.35 K/D · 94 Kills)"
                }
              ]
            },
            {
              roundId: "lb-f",
              name: "Losers Finals",
              badge: "Bronze / Runner-Up",
              bestOf: "BO5",
              matches: [
                {
                  id: "M13",
                  code: "LB-F",
                  status: "Completed",
                  time: "Sun · 5:00 PM EST",
                  team1: { seed: 2, name: "Vantage", tag: "VTG", score: 3, winner: true },
                  team2: { seed: 3, name: "Redline", tag: "RED", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "250 - 215", winner: "Vantage" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "6 - 4", winner: "Vantage" },
                    { number: 3, mode: "Control", map: "Invasion", score: "2 - 3", winner: "Redline" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 228", winner: "Vantage" }
                  ],
                  mvp: "Specter (1.36 K/D · 82 Kills)",
                  note: "Vantage advances to Grand Finals. Redline finishes in 3rd Place."
                }
              ]
            }
          ]
        },
        {
          id: "finals",
          name: "Championship Grand Finals",
          rounds: [
            {
              roundId: "gf",
              name: "Grand Finals",
              badge: "CHAMPIONSHIP MATCH",
              bestOf: "BO5",
              matches: [
                {
                  id: "M14",
                  code: "GF-M1",
                  status: "Live",
                  time: "Sun · 7:00 PM EST",
                  team1: { seed: 1, name: "Night Shift", tag: "NSH", score: 2, winner: null },
                  team2: { seed: 2, name: "Vantage", tag: "VTG", score: 2, winner: null },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 242", winner: "Night Shift" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Vantage" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Night Shift" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "235 - 250", winner: "Vantage" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "LIVE: Round 9", winner: "IN PROGRESS" }
                  ],
                  mvp: "Map 5 Game Decider in Progress",
                  note: "Night Shift possesses Winners Advantage. Vantage must win 2 consecutive Bo5 series to complete bracket reset.",
                  vodUrl: "livestreams.html"
                }
              ]
            }
          ]
        }
      ]
    },

    // --------------------------------------------------------------------------
    // DIVISION 2: CHALLENGERS DIVISION (Contenders Tier)
    // --------------------------------------------------------------------------
    challengers: {
      id: "challengers",
      name: "Challengers Division",
      tier: "Division 2 · Contenders Tier",
      badge: "CONTENDERS",
      format: "8-Team Double Elimination (Best of 5)",
      prizePool: "$500 USD + Tier-1 Promotion",
      status: "WEEK 4 · ELIMINATION STAGE",
      description: "Amateur & franchise development teams fighting for league glory, prize cash, and Premier Division promotion.",
      ruleset: "CDL Competitive Standard · 4v4 Roster Lock",
      explainer: {
        kicker: "CONTENDERS FRAMEWORK // DIVISION 2",
        title: 'How Challengers <span style="color:var(--lime);">Double Elimination Works</span>',
        items: [
          {
            title: "1. Double Elimination Format",
            text: "Division 2 operates on a competitive double-elimination structure. Squads defeated in the Winners Bracket drop into the Elimination Bracket for a redemption run. A second defeat results in tournament elimination."
          },
          {
            title: "2. Best of 5 Series Rotation",
            text: "Official CDL competitive rule set: Map 1 Hardpoint (250 pts), Map 2 Search & Destroy (First to 6), Map 3 Control (First to 3), Map 4 Hardpoint, and Map 5 Search & Destroy decider. All series are played first to 3 map wins."
          },
          {
            title: "3. Grand Finals & Premier Promotion",
            text: "The Challengers tournament champion claims the $500 prize pool and an automatic promotional berth into Division 1 Premier. The Elimination Bracket finalist must win two consecutive series to achieve a bracket reset."
          },
          {
            title: "4. Live Telemetry & Scout Reports",
            text: "Click any match in the bracket to inspect map telemetry, player performance metrics, match MVPs, and link to broadcast VODs."
          }
        ]
      },
      stages: [
        {
          id: "winners",
          name: "Winners Bracket",
          rounds: [
            {
              roundId: "ch-ub-qf",
              name: "Upper Quarterfinals",
              badge: "Round 1",
              bestOf: "BO5",
              matches: [
                {
                  id: "C1",
                  code: "CH-QF1",
                  status: "Completed",
                  time: "Fri · 5:00 PM EST",
                  team1: { seed: 1, name: "Underdogs", tag: "UND", score: 3, winner: true },
                  team2: { seed: 8, name: "Ghost Recon", tag: "GHR", score: 0, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 165", winner: "Underdogs" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "6 - 1", winner: "Underdogs" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 0", winner: "Underdogs" }
                  ],
                  mvp: "CoolRanchhh (1.48 K/D)"
                },
                {
                  id: "C2",
                  code: "CH-QF2",
                  status: "Completed",
                  time: "Fri · 6:15 PM EST",
                  team1: { seed: 4, name: "Phantom Squad", tag: "PHT", score: 3, winner: true },
                  team2: { seed: 5, name: "Neon Militia", tag: "NNM", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "250 - 210", winner: "Phantom Squad" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "6 - 4", winner: "Phantom Squad" },
                    { number: 3, mode: "Control", map: "Invasion", score: "1 - 3", winner: "Neon Militia" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 195", winner: "Phantom Squad" }
                  ],
                  mvp: "Ghosty (1.29 K/D)"
                },
                {
                  id: "C3",
                  code: "CH-QF3",
                  status: "Completed",
                  time: "Fri · 7:30 PM EST",
                  team1: { seed: 2, name: "Grim Syndicate", tag: "GRM", score: 3, winner: true },
                  team2: { seed: 7, name: "Overdrive", tag: "OVD", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 190", winner: "Grim Syndicate" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "6 - 3", winner: "Grim Syndicate" },
                    { number: 3, mode: "Control", map: "Karachi", score: "2 - 3", winner: "Overdrive" },
                    { number: 4, mode: "Hardpoint", map: "Invasion", score: "250 - 215", winner: "Grim Syndicate" }
                  ],
                  mvp: "Grimm (1.33 K/D)"
                },
                {
                  id: "C4",
                  code: "CH-QF4",
                  status: "Completed",
                  time: "Fri · 8:45 PM EST",
                  team1: { seed: 3, name: "Rogue Ops", tag: "RGO", score: 3, winner: true },
                  team2: { seed: 6, name: "Bulletproof", tag: "BLP", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "250 - 240", winner: "Rogue Ops" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "4 - 6", winner: "Bulletproof" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Rogue Ops" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "215 - 250", winner: "Bulletproof" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 4", winner: "Rogue Ops" }
                  ],
                  mvp: "ShadowStrike (1.25 K/D)"
                }
              ]
            },
            {
              roundId: "ch-ub-sf",
              name: "Upper Semifinals",
              badge: "Round 2",
              bestOf: "BO5",
              matches: [
                {
                  id: "C7",
                  code: "CH-SF1",
                  status: "Completed",
                  time: "Sat · 3:00 PM EST",
                  team1: { seed: 1, name: "Underdogs", tag: "UND", score: 3, winner: true },
                  team2: { seed: 4, name: "Phantom Squad", tag: "PHT", score: 2, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 235", winner: "Underdogs" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "3 - 6", winner: "Phantom Squad" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 2", winner: "Underdogs" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "210 - 250", winner: "Phantom Squad" },
                    { number: 5, mode: "Search & Destroy", map: "Rio", score: "6 - 3", winner: "Underdogs" }
                  ],
                  mvp: "Maddengamer (1.31 K/D)"
                },
                {
                  id: "C8",
                  code: "CH-SF2",
                  status: "Completed",
                  time: "Sat · 4:30 PM EST",
                  team1: { seed: 2, name: "Grim Syndicate", tag: "GRM", score: 3, winner: true },
                  team2: { seed: 3, name: "Rogue Ops", tag: "RGO", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "250 - 210", winner: "Grim Syndicate" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "6 - 4", winner: "Grim Syndicate" },
                    { number: 3, mode: "Control", map: "Invasion", score: "1 - 3", winner: "Rogue Ops" },
                    { number: 4, mode: "Hardpoint", map: "Karachi", score: "250 - 225", winner: "Grim Syndicate" }
                  ],
                  mvp: "Cynic (1.34 K/D)"
                }
              ]
            },
            {
              roundId: "ch-ub-f",
              name: "Winners Finals",
              badge: "Upper Final",
              bestOf: "BO5",
              matches: [
                {
                  id: "C11",
                  code: "CH-WF",
                  status: "Completed",
                  time: "Sun · 1:00 PM EST",
                  team1: { seed: 1, name: "Underdogs", tag: "UND", score: 3, winner: true },
                  team2: { seed: 2, name: "Grim Syndicate", tag: "GRM", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 220", winner: "Underdogs" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "6 - 5", winner: "Underdogs" },
                    { number: 3, mode: "Control", map: "Invasion", score: "1 - 3", winner: "Grim Syndicate" },
                    { number: 4, mode: "Hardpoint", map: "Sub Base", score: "250 - 215", winner: "Underdogs" }
                  ],
                  mvp: "CoolRanchhh (1.39 K/D)",
                  note: "Underdogs qualify for Challengers Grand Finals."
                }
              ]
            }
          ]
        },
        {
          id: "elimination",
          name: "Elimination Bracket",
          rounds: [
            {
              roundId: "ch-lb-f",
              name: "Challengers Losers Finals",
              badge: "Elimination",
              bestOf: "BO5",
              matches: [
                {
                  id: "C13",
                  code: "CH-LF",
                  status: "Live",
                  time: "Sun · 4:00 PM EST",
                  team1: { seed: 2, name: "Grim Syndicate", tag: "GRM", score: 2, winner: null },
                  team2: { seed: 4, name: "Phantom Squad", tag: "PHT", score: 1, winner: null },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "250 - 215", winner: "Grim Syndicate" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "4 - 6", winner: "Phantom Squad" },
                    { number: 3, mode: "Control", map: "Karachi", score: "3 - 2", winner: "Grim Syndicate" },
                    { number: 4, mode: "Hardpoint", map: "Invasion", score: "In Progress", winner: null }
                  ],
                  mvp: "Map 4 In Progress",
                  note: "Winner advances to play Underdogs in the Challengers Grand Finals."
                }
              ]
            }
          ]
        },
        {
          id: "finals",
          name: "Challengers Grand Finals",
          rounds: [
            {
              roundId: "ch-gf",
              name: "Grand Finals",
              badge: "TITLE MATCH",
              bestOf: "BO5",
              matches: [
                {
                  id: "C14",
                  code: "CH-GF",
                  status: "Scheduled",
                  time: "Sun · 6:30 PM EST",
                  team1: { seed: 1, name: "Underdogs", tag: "UND", score: 0, winner: null },
                  team2: { seed: null, name: "Winner of C13", tag: "TBD", score: 0, winner: null },
                  maps: [],
                  mvp: "Scheduled",
                  note: "Challengers Championship Decider + Promotion Berth."
                }
              ]
            }
          ]
        }
      ]
    },

    // --------------------------------------------------------------------------
    // DIVISION 3: OPEN RECRUIT CUP (Grassroots Tier - Single Elimination)
    // --------------------------------------------------------------------------
    open: {
      id: "open",
      name: "Open Recruit Cup",
      tier: "Division 3 · Open Tier",
      badge: "GRASSROOTS",
      format: "8-Team Single Elimination + 3rd Place (Best of 3)",
      prizePool: "$250 USD + Challengers Seed",
      status: "ROUND 2 · SEMIFINALS",
      description: "Open community tournament for free agents, newly drafted squads, and grassroots combatants.",
      ruleset: "CDL 4v4 Ruleset · Best of 3 (HP / S&D / CTL)",
      explainer: {
        kicker: "GRASSROOTS FRAMEWORK // DIVISION 3",
        title: 'How Open Recruit <span style="color:var(--lime);">Single Elimination Works</span>',
        items: [
          {
            title: "1. Single Elimination Knockout",
            text: "Division 3 operates on a pure single-elimination knockout format. There is no lower bracket—one series defeat results in immediate tournament elimination. Every round is sudden death."
          },
          {
            title: "2. Best of 3 Series (Finals BO5)",
            text: "Quarterfinals and Semifinals are played as Best of 3 (Map 1 Hardpoint, Map 2 Search & Destroy, Map 3 Control). The Grand Finals title match elevates to a Best of 5 championship showdown."
          },
          {
            title: "3. Bronze Final (3rd Place Playoff)",
            text: "Losing semifinalists battle in a dedicated 3rd Place match to determine final tournament podium standing and earn priority qualification points."
          },
          {
            title: "4. Talent Scouting & Promotion",
            text: "The Open Recruit Cup champion earns direct promotion into the Challengers Division. Outstanding performers are highlighted on the Free Agent board for franchise scouts."
          }
        ]
      },
      stages: [
        {
          id: "main",
          name: "Championship Bracket",
          rounds: [
            {
              roundId: "op-qf",
              name: "Quarterfinals",
              badge: "Round 1",
              bestOf: "BO3",
              matches: [
                {
                  id: "O1",
                  code: "OP-QF1",
                  status: "Completed",
                  time: "Sat · 12:00 PM EST",
                  team1: { seed: 1, name: "Delta Force", tag: "DLT", score: 2, winner: true },
                  team2: { seed: 8, name: "Recon Unit", tag: "RCN", score: 0, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 140", winner: "Delta Force" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "6 - 2", winner: "Delta Force" }
                  ],
                  mvp: "Bravo (1.52 K/D)"
                },
                {
                  id: "O2",
                  code: "OP-QF2",
                  status: "Completed",
                  time: "Sat · 1:00 PM EST",
                  team1: { seed: 4, name: "Shadow Legion", tag: "SHD", score: 2, winner: true },
                  team2: { seed: 5, name: "Bad Company", tag: "BDC", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Sub Base", score: "250 - 220", winner: "Shadow Legion" },
                    { number: 2, mode: "Search & Destroy", map: "Rio", score: "4 - 6", winner: "Bad Company" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Shadow Legion" }
                  ],
                  mvp: "Nocturne (1.24 K/D)"
                },
                {
                  id: "O3",
                  code: "OP-QF3",
                  status: "Completed",
                  time: "Sat · 2:00 PM EST",
                  team1: { seed: 2, name: "Vector Nine", tag: "V9", score: 2, winner: true },
                  team2: { seed: 7, name: "Alpha Squad", tag: "ALP", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 200", winner: "Vector Nine" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "5 - 6", winner: "Alpha Squad" },
                    { number: 3, mode: "Control", map: "Karachi", score: "3 - 2", winner: "Vector Nine" }
                  ],
                  mvp: "Vector (1.28 K/D)"
                },
                {
                  id: "O4",
                  code: "OP-QF4",
                  status: "Completed",
                  time: "Sat · 3:00 PM EST",
                  team1: { seed: 3, name: "Midnight Marauders", tag: "MDN", score: 2, winner: true },
                  team2: { seed: 6, name: "Havoc Academy", tag: "HVA", score: 1, winner: false },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Rio", score: "240 - 250", winner: "Havoc Academy" },
                    { number: 2, mode: "Search & Destroy", map: "Karachi", score: "6 - 4", winner: "Midnight Marauders" },
                    { number: 3, mode: "Control", map: "Invasion", score: "3 - 1", winner: "Midnight Marauders" }
                  ],
                  mvp: "Dusk (1.30 K/D)"
                }
              ]
            },
            {
              roundId: "op-sf",
              name: "Semifinals",
              badge: "Semifinals",
              bestOf: "BO3",
              matches: [
                {
                  id: "O5",
                  code: "OP-SF1",
                  status: "Live",
                  time: "Sun · 1:30 PM EST",
                  team1: { seed: 1, name: "Delta Force", tag: "DLT", score: 1, winner: null },
                  team2: { seed: 4, name: "Shadow Legion", tag: "SHD", score: 1, winner: null },
                  maps: [
                    { number: 1, mode: "Hardpoint", map: "Karachi", score: "250 - 210", winner: "Delta Force" },
                    { number: 2, mode: "Search & Destroy", map: "Highrise", score: "3 - 6", winner: "Shadow Legion" },
                    { number: 3, mode: "Control", map: "Invasion", score: "Map 3 In Progress", winner: null }
                  ],
                  mvp: "Map 3 Live Decider"
                },
                {
                  id: "O6",
                  code: "OP-SF2",
                  status: "Scheduled",
                  time: "Sun · 2:45 PM EST",
                  team1: { seed: 2, name: "Vector Nine", tag: "V9", score: 0, winner: null },
                  team2: { seed: 3, name: "Midnight Marauders", tag: "MDN", score: 0, winner: null },
                  maps: [],
                  mvp: "Scheduled"
                }
              ]
            },
            {
              roundId: "op-gf",
              name: "Finals & 3rd Place",
              badge: "TITLE & PODIUM",
              bestOf: "BO5 / BO3",
              matches: [
                {
                  id: "O7",
                  code: "OP-GF",
                  status: "Scheduled",
                  time: "Sun · 5:30 PM EST",
                  bestOf: "BO5",
                  team1: { seed: null, name: "Winner of O5", tag: "TBD", score: 0, winner: null },
                  team2: { seed: null, name: "Winner of O6", tag: "TBD", score: 0, winner: null },
                  maps: [],
                  mvp: "Scheduled",
                  note: "Recruit Division Champions + Automatic promotion seed into Challengers."
                },
                {
                  id: "O8",
                  code: "OP-3RD",
                  status: "Scheduled",
                  time: "Sun · 4:15 PM EST",
                  bestOf: "BO3",
                  team1: { seed: null, name: "Loser of O5", tag: "TBD", score: 0, winner: null },
                  team2: { seed: null, name: "Loser of O6", tag: "TBD", score: 0, winner: null },
                  maps: [],
                  mvp: "Scheduled",
                  note: "Bronze Final (3rd Place Playoff) · Best of 3."
                }
              ]
            }
          ]
        }
      ]
    }
  };

  // State
  let currentDivision = "premier";
  let currentStageFilter = "all";
  let currentViewMode = "tree"; // "tree" or "list"

  // ============================================================================
  // MATCH DETAILS MODAL (<dialog>)
  // ============================================================================
  function getOrCreateMatchModal() {
    let dialog = document.getElementById("bracket-match-modal");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "bracket-match-modal";
      dialog.className = "bracket-modal";
      dialog.setAttribute("closedby", "any");
      dialog.setAttribute("aria-labelledby", "bracket-modal-title");
      dialog.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-kicker-row">
              <span class="modal-kicker" id="bracket-modal-code">MATCH INTEL // ROUND REPORT</span>
              <span class="modal-status-badge status-active" id="bracket-modal-status">COMPLETED</span>
            </div>
            <div class="modal-title-group" style="margin-top: 6px;">
              <h2 id="bracket-modal-title" class="modal-gamertag" style="font-size: 26px;">TEAM A vs TEAM B</h2>
              <span class="pill" id="bracket-modal-series-score" style="color:var(--lime); border-color:#d5f45b50;">3 - 0</span>
              <span class="pill" id="bracket-modal-bestof" style="color:var(--text); background:#ffffff10;">BO5</span>
            </div>
            <div class="modal-player-meta" id="bracket-modal-meta">Friday 7:00 PM EST · CDL Competitive Settings</div>
          </div>
          <button type="button" class="modal-close-btn" id="bracket-modal-close-btn" aria-label="Close match details">✕</button>
        </div>
        <div class="modal-body" id="bracket-modal-body"></div>
      `;
      document.body.appendChild(dialog);

      dialog.querySelector("#bracket-modal-close-btn")?.addEventListener("click", () => dialog.close());

      // Unlock scrolling when dialog closes or cancels
      dialog.addEventListener("close", () => {
        if (!document.querySelector("dialog[open]")) {
          document.documentElement.classList.remove("modal-open");
          document.body.classList.remove("modal-open");
        }
      });
      dialog.addEventListener("cancel", () => {
        if (!document.querySelector("dialog[open]")) {
          document.documentElement.classList.remove("modal-open");
          document.body.classList.remove("modal-open");
        }
      });

      // Modern light-dismiss fallback
      if (!("closedBy" in HTMLDialogElement.prototype)) {
        dialog.addEventListener("click", (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const inside =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;
          if (!inside) dialog.close();
        });
      }
    }
    return dialog;
  }

  function openMatchDetails(match) {
    const dialog = getOrCreateMatchModal();
    const codeEl = document.getElementById("bracket-modal-code");
    const statusEl = document.getElementById("bracket-modal-status");
    const titleEl = document.getElementById("bracket-modal-title");
    const scoreEl = document.getElementById("bracket-modal-series-score");
    const bestOfEl = document.getElementById("bracket-modal-bestof");
    const metaEl = document.getElementById("bracket-modal-meta");
    const bodyEl = document.getElementById("bracket-modal-body");

    codeEl.textContent = `MATCH INTEL // ${match.code || match.id}`;
    
    // Status styling
    statusEl.textContent = (match.status || "Scheduled").toUpperCase();
    if (match.status === "Live") {
      statusEl.className = "modal-status-badge status-live-dot";
      statusEl.style.color = "#ff4a4a";
      statusEl.style.borderColor = "#ff4a4a60";
    } else if (match.status === "Completed") {
      statusEl.className = "modal-status-badge status-active";
      statusEl.style.color = "var(--lime)";
      statusEl.style.borderColor = "#d5f45b60";
    } else {
      statusEl.className = "modal-status-badge status-pending";
      statusEl.style.color = "var(--muted)";
      statusEl.style.borderColor = "#ffffff25";
    }

    titleEl.textContent = `${match.team1.name} vs ${match.team2.name}`;
    scoreEl.textContent = `${match.team1.score} - ${match.team2.score}`;
    bestOfEl.textContent = match.bestOf || "BO5";
    metaEl.textContent = `${match.time || "Scheduled"} · ${match.note || "CDL V4 Competitive Settings"}`;

    // Map rows
    let mapsHtml = "";
    if (match.maps && match.maps.length > 0) {
      mapsHtml = `
        <div class="match-modal-section">
          <div class="modal-section-title">SERIES MAP-BY-MAP TELEMETRY</div>
          <div class="modal-map-grid">
            ${match.maps.map(m => `
              <div class="modal-map-card ${m.winner ? 'map-finished' : 'map-pending'}">
                <div class="map-card-header">
                  <span class="map-num">MAP ${m.number}</span>
                  <span class="map-mode-badge">${escapeHtml(m.mode)}</span>
                </div>
                <div class="map-name">${escapeHtml(m.map)}</div>
                <div class="map-score-row">
                  <span class="map-score">${escapeHtml(m.score || "Pending")}</span>
                  ${m.winner ? `<span class="map-winner-tag">VICTORY: ${escapeHtml(m.winner)}</span>` : `<span class="map-in-progress">IN PROGRESS</span>`}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    } else {
      mapsHtml = `
        <div class="match-modal-section">
          <div style="text-align:center; padding: 24px 0; color:var(--muted); font-size:13px;">
            Map vetoes and series breakdown will unlock once match broadcast begins.
          </div>
        </div>
      `;
    }

    // Match Teams Breakdown Row
    const teamsHtml = `
      <div class="modal-scoreboard-banner">
        <div class="modal-team-side ${match.team1.winner ? 'winner' : ''}">
          <div class="modal-team-tag">${escapeHtml(match.team1.tag)}</div>
          <div class="modal-team-name">${escapeHtml(match.team1.name)}</div>
          ${match.team1.seed ? `<div class="modal-team-seed">Seed #${match.team1.seed}</div>` : ''}
          <div class="modal-big-score">${match.team1.score}</div>
        </div>
        <div class="modal-vs-divider">
          <span>VS</span>
          <small>${escapeHtml(match.bestOf || "BO5")}</small>
        </div>
        <div class="modal-team-side ${match.team2.winner ? 'winner' : ''}">
          <div class="modal-team-tag">${escapeHtml(match.team2.tag)}</div>
          <div class="modal-team-name">${escapeHtml(match.team2.name)}</div>
          ${match.team2.seed ? `<div class="modal-team-seed">Seed #${match.team2.seed}</div>` : ''}
          <div class="modal-big-score">${match.team2.score}</div>
        </div>
      </div>
    `;

    // MVP & Actions
    const mvpHtml = match.mvp ? `
      <div class="modal-mvp-box">
        <span class="mvp-label">★ MATCH MVP:</span>
        <span class="mvp-name">${escapeHtml(match.mvp)}</span>
      </div>
    ` : "";

    // Live Alert Banner & Watch Live / VOD Action Buttons
    const isLiveMatch = match.status === "Live";
    const liveStreamUrl = match.liveUrl || match.vodUrl || "livestreams.html";

    const liveAlertBannerHtml = isLiveMatch ? `
      <div class="modal-live-banner">
        <div class="modal-live-banner-left">
          <span class="live-pulse-dot" style="width:10px; height:10px;"></span>
          <div>
            <div class="modal-live-banner-title">MATCH IS CURRENTLY LIVE ON AIR</div>
            <div class="modal-live-banner-sub">Frontline official CDL stream broadcast & live match telemetry in progress.</div>
          </div>
        </div>
        <a href="${escapeHtml(liveStreamUrl)}" class="btn-watch-live-action" style="padding: 10px 18px; font-size:12px;">
          <span class="live-pulse-dot" style="width:7px; height:7px;"></span>
          <span>Watch Live Stream</span>
          <span>▶</span>
        </a>
      </div>
    ` : "";

    let actionBtnHtml = "";
    if (isLiveMatch) {
      actionBtnHtml = `
        <div style="margin-top: 24px; display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap;">
          <a href="${escapeHtml(liveStreamUrl)}" class="btn-watch-live-action">
            <span class="live-pulse-dot" style="width:8px; height:8px;"></span>
            <span>Watch Match Live</span>
            <span style="font-size:15px;">▶</span>
          </a>
        </div>
      `;
    } else if (match.vodUrl) {
      actionBtnHtml = `
        <div style="margin-top: 20px; text-align: right;">
          <a href="${escapeHtml(match.vodUrl)}" class="btn-paypal-submit" style="display:inline-flex; width:auto; padding: 10px 20px; font-size:13px; text-decoration:none;">
            <span>Watch Match Broadcast / VOD</span>
            <span style="font-size:16px;">↗</span>
          </a>
        </div>
      `;
    }

    bodyEl.innerHTML = `
      ${liveAlertBannerHtml}
      ${teamsHtml}
      ${mvpHtml}
      ${mapsHtml}
      ${actionBtnHtml}
    `;

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    dialog.showModal();
  }

  // ============================================================================
  // BRACKET RENDERERS (TREE & LIST)
  // ============================================================================
  function renderMatchCard(match) {
    const isCompleted = match.status === "Completed";
    const isLive = match.status === "Live";
    
    let statusBadge = "";
    if (isLive) {
      statusBadge = `<span class="badge-match-live"><span class="live-pulse-dot"></span>LIVE</span>`;
    } else if (isCompleted) {
      statusBadge = `<span class="badge-match-finished">FINAL</span>`;
    } else {
      statusBadge = `<span class="badge-match-time">${escapeHtml(match.time || "TBD")}</span>`;
    }

    const actionHintHtml = isLive
      ? `<span class="bmc-action-hint bmc-live-hint"><span class="live-pulse-dot" style="width:6px; height:6px;"></span>Watch Live & Intel ↗</span>`
      : `<span class="bmc-action-hint">View Maps & Intel ↗</span>`;

    return `
      <div class="bracket-match-card ${isLive ? 'is-live-match' : ''}" data-match-id="${escapeHtml(match.id)}" role="button" tabindex="0" aria-label="Match ${escapeHtml(match.code)}: ${escapeHtml(match.team1.name)} vs ${escapeHtml(match.team2.name)}">
        <div class="bmc-header">
          <span class="bmc-code">${escapeHtml(match.code || match.id)}</span>
          ${statusBadge}
        </div>
        <div class="bmc-teams">
          <!-- Team 1 -->
          <div class="bmc-team-row ${match.team1.winner ? 'winner-row' : ''}">
            <div class="bmc-team-info">
              ${match.team1.seed ? `<span class="bmc-seed">${match.team1.seed}</span>` : ''}
              <span class="bmc-tag">${escapeHtml(match.team1.tag)}</span>
              <span class="bmc-name" title="${escapeHtml(match.team1.name)}">${escapeHtml(match.team1.name)}</span>
            </div>
            <span class="bmc-score">${match.team1.score}</span>
          </div>
          <!-- Team 2 -->
          <div class="bmc-team-row ${match.team2.winner ? 'winner-row' : ''}">
            <div class="bmc-team-info">
              ${match.team2.seed ? `<span class="bmc-seed">${match.team2.seed}</span>` : ''}
              <span class="bmc-tag">${escapeHtml(match.team2.tag)}</span>
              <span class="bmc-name" title="${escapeHtml(match.team2.name)}">${escapeHtml(match.team2.name)}</span>
            </div>
            <span class="bmc-score">${match.team2.score}</span>
          </div>
        </div>
        <div class="bmc-footer">
          <span class="bmc-bestof">${escapeHtml(match.bestOf || "BO5")}</span>
          ${actionHintHtml}
        </div>
      </div>
    `;
  }

  function renderBracketTree(divData) {
    const rootEl = document.getElementById("bracket-display-root");
    if (!rootEl) return;

    // Filter stages if filter applied
    let stagesToRender = divData.stages;
    if (currentStageFilter !== "all") {
      stagesToRender = divData.stages.filter(s => s.id === currentStageFilter);
    }

    if (!stagesToRender || stagesToRender.length === 0) {
      rootEl.innerHTML = `
        <div class="empty-bracket-state">
          <h3>NO MATCHES SCHEDULED IN THIS STAGE</h3>
          <p>Please select another stage filter or switch divisions.</p>
        </div>
      `;
      return;
    }

    const html = `
      <div class="bracket-tree-container">
        ${stagesToRender.map(stage => `
          <div class="bracket-stage-block" id="stage-${stage.id}">
            <div class="bracket-stage-title-bar">
              <span class="stage-tag">// BRACKET STAGE</span>
              <h3 class="stage-name">${escapeHtml(stage.name)}</h3>
            </div>
            <div class="bracket-rounds-track">
              ${stage.rounds.map((round, rIndex) => `
                <div class="bracket-round-column" data-round-index="${rIndex}">
                  <div class="round-header">
                    <span class="round-badge">${escapeHtml(round.badge || `Round ${rIndex + 1}`)}</span>
                    <h4 class="round-title">${escapeHtml(round.name)}</h4>
                    <span class="round-rule">${escapeHtml(round.bestOf || "BO5")}</span>
                  </div>
                  <div class="round-matches-list">
                    ${round.matches.map(m => renderMatchCard(m)).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;

    rootEl.innerHTML = html;
    attachMatchCardClicks(divData);
  }

  function renderBracketList(divData) {
    const rootEl = document.getElementById("bracket-display-root");
    if (!rootEl) return;

    let allMatches = [];
    divData.stages.forEach(stage => {
      if (currentStageFilter !== "all" && stage.id !== currentStageFilter) return;
      stage.rounds.forEach(round => {
        round.matches.forEach(m => {
          allMatches.push({ ...m, stageName: stage.name, roundName: round.name });
        });
      });
    });

    if (allMatches.length === 0) {
      rootEl.innerHTML = `
        <div class="empty-bracket-state">
          <h3>NO MATCHES RECORDED</h3>
          <p>No matches matching your current filter.</p>
        </div>
      `;
      return;
    }

    const html = `
      <div class="bracket-list-container">
        <div class="schedule-grid">
          ${allMatches.map(m => `
            <div class="schedule-card-item">
              <div class="sci-header">
                <span class="sci-stage">${escapeHtml(m.stageName)} · ${escapeHtml(m.roundName)}</span>
                <span class="sci-time">${escapeHtml(m.time || "Scheduled")}</span>
              </div>
              ${renderMatchCard(m)}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    rootEl.innerHTML = html;
    attachMatchCardClicks(divData);
  }

  function attachMatchCardClicks(divData) {
    // Collect all matches from all stages for quick lookup
    const matchMap = new Map();
    divData.stages.forEach(s => {
      s.rounds.forEach(r => {
        r.matches.forEach(m => {
          matchMap.set(m.id, m);
        });
      });
    });

    document.querySelectorAll(".bracket-match-card").forEach(card => {
      const matchId = card.getAttribute("data-match-id");
      const match = matchMap.get(matchId);
      if (!match) return;

      const clickHandler = (e) => {
        openMatchDetails(match);
      };

      card.addEventListener("click", clickHandler);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          clickHandler(e);
        }
      });
    });
  }

  // Update Division Banner Info
  function updateDivisionHeader(divData) {
    const titleEl = document.getElementById("div-banner-title");
    const badgeEl = document.getElementById("div-banner-badge");
    const descEl = document.getElementById("div-banner-desc");
    const formatEl = document.getElementById("div-banner-format");
    const prizeEl = document.getElementById("div-banner-prize");
    const statusEl = document.getElementById("div-banner-status");
    const rulesEl = document.getElementById("div-banner-rules");

    if (titleEl) titleEl.textContent = divData.name;
    if (badgeEl) badgeEl.textContent = divData.tier;
    if (descEl) descEl.textContent = divData.description;
    if (formatEl) formatEl.textContent = divData.format;
    if (prizeEl) prizeEl.textContent = divData.prizePool;
    if (statusEl) statusEl.textContent = divData.status;
    if (rulesEl) rulesEl.textContent = divData.ruleset;
  }

  // Update Explainer Section Content
  function updateExplainerSection(divData) {
    const kickerEl = document.getElementById("explainer-kicker");
    const titleEl = document.getElementById("explainer-title");
    const gridEl = document.getElementById("explainer-grid");

    if (!divData || !divData.explainer) return;

    if (kickerEl) kickerEl.textContent = divData.explainer.kicker;
    if (titleEl) titleEl.innerHTML = divData.explainer.title;
    if (gridEl && Array.isArray(divData.explainer.items)) {
      gridEl.innerHTML = divData.explainer.items.map(item => `
        <div>
          <strong style="color:var(--text); font-size:14px; display:block; margin-bottom:6px;">${escapeHtml(item.title)}</strong>
          ${escapeHtml(item.text)}
        </div>
      `).join("");
    }
  }

  // Update Dynamic Stage Filter Buttons
  function updateStageFilterButtons(divData) {
    const container = document.getElementById("stage-filter-container");
    if (!container) return;

    const validStageIds = ["all", ...divData.stages.map(s => s.id)];
    if (!validStageIds.includes(currentStageFilter)) {
      currentStageFilter = "all";
    }

    const stages = [
      { id: "all", name: "All Stages" },
      ...divData.stages.map(s => ({ id: s.id, name: s.name }))
    ];

    container.innerHTML = stages.map(s => `
      <button type="button" class="stage-filter-btn ${s.id === currentStageFilter ? 'active' : ''}" data-stage="${escapeHtml(s.id)}">${escapeHtml(s.name)}</button>
    `).join("");

    container.querySelectorAll(".stage-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const stageId = btn.getAttribute("data-stage");
        if (stageId === currentStageFilter) return;

        container.querySelectorAll(".stage-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentStageFilter = stageId;
        refreshView();
      });
    });
  }

  function refreshView() {
    const divData = BRACKET_DATA[currentDivision] || BRACKET_DATA.premier;
    updateDivisionHeader(divData);
    updateStageFilterButtons(divData);
    updateExplainerSection(divData);

    if (currentViewMode === "tree") {
      renderBracketTree(divData);
    } else {
      renderBracketList(divData);
    }
  }

  // ============================================================================
  // INITIALIZATION & TAB SWITCHING
  // ============================================================================
  function initBracketPage() {
    // 1. Division Tabs
    const divTabs = document.querySelectorAll(".div-tab-btn");
    divTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const divId = tab.getAttribute("data-division");
        if (!divId || divId === currentDivision) return;

        divTabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        currentDivision = divId;
        currentStageFilter = "all";
        window.location.hash = divId;
        refreshView();
      });
    });

    // 3. View Mode Switcher (Tree vs List)
    const viewTreeBtn = document.getElementById("view-btn-tree");
    const viewListBtn = document.getElementById("view-btn-list");

    viewTreeBtn?.addEventListener("click", () => {
      if (currentViewMode === "tree") return;
      currentViewMode = "tree";
      viewTreeBtn.classList.add("active");
      viewListBtn?.classList.remove("active");
      refreshView();
    });

    viewListBtn?.addEventListener("click", () => {
      if (currentViewMode === "list") return;
      currentViewMode = "list";
      viewListBtn.classList.add("active");
      viewTreeBtn?.classList.remove("active");
      refreshView();
    });

    // 4. URL Hash check (e.g. #challengers or #open)
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash && BRACKET_DATA[hash]) {
      currentDivision = hash;
      divTabs.forEach(t => {
        const matches = t.getAttribute("data-division") === hash;
        t.classList.toggle("active", matches);
        t.setAttribute("aria-selected", matches ? "true" : "false");
      });
    }

    refreshView();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBracketPage);
  } else {
    initBracketPage();
  }

  // Expose global controller
  window.FrontlineBrackets = {
    getBracketData: () => BRACKET_DATA,
    switchDivision: (divId) => {
      if (BRACKET_DATA[divId]) {
        currentDivision = divId;
        refreshView();
      }
    },
    openMatch: (matchId) => {
      const divData = BRACKET_DATA[currentDivision];
      if (!divData) return;
      for (const s of divData.stages) {
        for (const r of s.rounds) {
          const m = r.matches.find(x => x.id === matchId);
          if (m) {
            openMatchDetails(m);
            return;
          }
        }
      }
    }
  };
})();
