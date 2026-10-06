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
  "premier": {
    "id": "premier",
    "name": "Premier Championship",
    "tier": "Division 1 · Pro Tier",
    "badge": "ELITE DIVISION",
    "format": "8-Team Double Elimination (Best of 5)",
    "prizePool": "$1,000 USD",
    "status": "CHAMPIONSHIP STAGE",
    "description": "The top 8 franchise squads battling in the definitive Frontline double-elimination tournament.",
    "ruleset": "CDL V4 Competitive Settings · 4v4 HP / S&D / CTL",
    "explainer": {
      "kicker": "COMPETITIVE FRAMEWORK // PRO DIVISION 1",
      "title": "How Premier <span style=\"color:var(--lime);\">Double Elimination Works</span>",
      "items": [
        {
          "title": "1. Double Elimination Format",
          "text": "Division 1 operates on a full double-elimination structure. A team that loses in the Winners (Upper) Bracket drops to the Elimination (Lower) Bracket for a second opportunity. A second loss results in complete tournament elimination."
        },
        {
          "title": "2. Best of 5 Series Rotation",
          "text": "Standard CDL match rotation: Map 1 Hardpoint (250 pts), Map 2 Search & Destroy (First to 6), Map 3 Control (First to 3), Map 4 Hardpoint, and Map 5 Search & Destroy. All series are played to first to 3 map wins."
        },
        {
          "title": "3. Grand Finals & Bracket Reset",
          "text": "The squad advancing undefeated from the Winners Bracket enters Grand Finals with 1-series advantage. The team emerging from the Elimination Bracket must win two consecutive Best of 5 series (Bracket Reset) to claim the championship title."
        },
        {
          "title": "4. Live Telemetry & VODs",
          "text": "Click on any match card in the bracket to review individual map telemetry, series scoreboard breakdowns, slayer MVPs, and link directly to full stream broadcasts."
        }
      ]
    },
    "stages": [
      {
        "id": "winners",
        "name": "Winners Bracket (Upper)",
        "rounds": [
          {
            "roundId": "ub-qf",
            "name": "Upper Quarterfinals",
            "badge": "Round 1",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M1",
                "code": "UB-QF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 1,
                  "name": "Seed #1 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 8,
                  "name": "Seed #8 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M2",
                "code": "UB-QF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 4,
                  "name": "Seed #4 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 5,
                  "name": "Seed #5 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M3",
                "code": "UB-QF3",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 2,
                  "name": "Seed #2 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 7,
                  "name": "Seed #7 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M4",
                "code": "UB-QF4",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 3,
                  "name": "Seed #3 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 6,
                  "name": "Seed #6 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "ub-sf",
            "name": "Upper Semifinals",
            "badge": "Round 2",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M7",
                "code": "UB-SF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of M1",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M2",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M8",
                "code": "UB-SF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of M3",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M4",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "ub-f",
            "name": "Winners Finals",
            "badge": "Upper Final",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M11",
                "code": "UB-F",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of M7",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M8",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          }
        ]
      },
      {
        "id": "losers",
        "name": "Elimination Bracket (Lower)",
        "rounds": [
          {
            "roundId": "lb-r1",
            "name": "Elimination Round 1",
            "badge": "Lower R1",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M5",
                "code": "LB-R1A",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of M1",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Loser of M2",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M6",
                "code": "LB-R1B",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of M3",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Loser of M4",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "lb-qf",
            "name": "Elimination Quarterfinals",
            "badge": "Lower QF",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M9",
                "code": "LB-QF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of M8",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M5",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "M10",
                "code": "LB-QF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of M7",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M6",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "lb-sf",
            "name": "Elimination Semifinals",
            "badge": "Lower Semi",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M12",
                "code": "LB-SF",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of M9",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M10",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "lb-f",
            "name": "Losers Finals",
            "badge": "Lower Final",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M13",
                "code": "LB-F",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of M11",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of M12",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Winner advances to Grand Finals."
              }
            ]
          }
        ]
      },
      {
        "id": "grandfinals",
        "name": "Championship Grand Finals",
        "rounds": [
          {
            "roundId": "gf",
            "name": "Grand Finals",
            "badge": "Championship",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "M14",
                "code": "GF-M1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winners Champion (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Elimination Champion (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Winners Bracket team possesses 1-series advantage."
              }
            ]
          }
        ]
      }
    ]
  },
  "challengers": {
    "id": "challengers",
    "name": "Challengers Division",
    "tier": "Division 2 · Tier 2",
    "badge": "CHALLENGERS CIRCUIT",
    "format": "8-Team Double Elimination (Best of 5)",
    "prizePool": "$500 USD",
    "status": "PLAYOFF STAGE",
    "description": "Challengers Division 2 Championship bracket featuring upcoming competitive rosters.",
    "ruleset": "CDL V4 Competitive Settings · 4v4 HP / S&D / CTL",
    "explainer": {
      "kicker": "COMPETITIVE FRAMEWORK // DIVISION 2",
      "title": "Challengers <span style=\"color:var(--lime);\">Circuit Structure</span>",
      "items": [
        {
          "title": "1. Semi-Pro Pathway",
          "text": "The premier feeder division for players fighting for a spot in Division 1 franchise scouting lists."
        },
        {
          "title": "2. Double Elimination Progression",
          "text": "Teams eliminated in upper rounds fight through the lower bracket for a second shot at the Grand Finals."
        },
        {
          "title": "3. Scout Scoring Integration",
          "text": "Telemetry from all Challengers matches directly factors into the Draft Scouting Grade algorithm."
        }
      ]
    },
    "stages": [
      {
        "id": "winners",
        "name": "Winners Bracket",
        "rounds": [
          {
            "roundId": "ch-ub-qf",
            "name": "Upper Quarterfinals",
            "badge": "Round 1",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "C1",
                "code": "CH-QF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 1,
                  "name": "Seed #1 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 8,
                  "name": "Seed #8 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "C2",
                "code": "CH-QF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 4,
                  "name": "Seed #4 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 5,
                  "name": "Seed #5 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "C3",
                "code": "CH-QF3",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 2,
                  "name": "Seed #2 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 7,
                  "name": "Seed #7 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "C4",
                "code": "CH-QF4",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 3,
                  "name": "Seed #3 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 6,
                  "name": "Seed #6 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "ch-ub-sf",
            "name": "Upper Semifinals",
            "badge": "Round 2",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "C7",
                "code": "CH-SF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of C1",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of C2",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "C8",
                "code": "CH-SF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of C3",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of C4",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "ch-ub-f",
            "name": "Winners Finals",
            "badge": "Upper Final",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "C11",
                "code": "CH-WF",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of C7",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of C8",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Winner qualifies for Challengers Grand Finals."
              }
            ]
          }
        ]
      },
      {
        "id": "losers",
        "name": "Elimination Bracket",
        "rounds": [
          {
            "roundId": "ch-lb-f",
            "name": "Challengers Losers Finals",
            "badge": "Lower Final",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "C13",
                "code": "CH-LF",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of C11",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Lower Semifinal Winner",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Winner advances to play in Challengers Grand Finals."
              }
            ]
          }
        ]
      },
      {
        "id": "grandfinals",
        "name": "Challengers Grand Finals",
        "rounds": [
          {
            "roundId": "ch-gf",
            "name": "Grand Finals",
            "badge": "Championship",
            "bestOf": "BO5",
            "matches": [
              {
                "id": "C14",
                "code": "CH-GF",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winners Champion (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of C13 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Winners Bracket team possesses 1-series advantage."
              }
            ]
          }
        ]
      }
    ]
  },
  "open": {
    "id": "open",
    "name": "Open Recruit Cup",
    "tier": "Division 3 · Open Tier",
    "badge": "GRASSROOTS RECRUIT",
    "format": "8-Team Single Elimination + 3rd Place Match (Best of 3)",
    "prizePool": "$250 USD",
    "status": "CUP STAGE",
    "description": "Open amateur and community recruitment cup where rising players compete for team scouting.",
    "ruleset": "CDL V4 Competitive Settings · 4v4 HP / S&D / CTL (Best of 3)",
    "explainer": {
      "kicker": "COMPETITIVE FRAMEWORK // DIVISION 3",
      "title": "Open Recruit <span style=\"color:var(--lime);\">Cup System</span>",
      "items": [
        {
          "title": "1. Single Elimination Knockout",
          "text": "Fast-paced single elimination format. Win or go home across three intense rounds of Best of 3 series."
        },
        {
          "title": "2. 3rd Place Consolation Match",
          "text": "Semifinalists who fall in round 2 compete in an official 3rd place consolation match for division points."
        },
        {
          "title": "3. Community Scout Showcase",
          "text": "All players who compete in the Open Recruit Cup receive entry into the verified Free Agent recruitment database."
        }
      ]
    },
    "stages": [
      {
        "id": "championship",
        "name": "Championship Bracket",
        "rounds": [
          {
            "roundId": "op-qf",
            "name": "Quarterfinals",
            "badge": "Round 1",
            "bestOf": "BO3",
            "matches": [
              {
                "id": "O1",
                "code": "OP-QF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 1,
                  "name": "Seed #1 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 8,
                  "name": "Seed #8 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "O2",
                "code": "OP-QF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 4,
                  "name": "Seed #4 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 5,
                  "name": "Seed #5 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "O3",
                "code": "OP-QF3",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 2,
                  "name": "Seed #2 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 7,
                  "name": "Seed #7 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "O4",
                "code": "OP-QF4",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": 3,
                  "name": "Seed #3 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": 6,
                  "name": "Seed #6 (TBD)",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "op-sf",
            "name": "Semifinals",
            "badge": "Round 2",
            "bestOf": "BO3",
            "matches": [
              {
                "id": "O5",
                "code": "OP-SF1",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of O1",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of O2",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              },
              {
                "id": "O6",
                "code": "OP-SF2",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of O3",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of O4",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null
              }
            ]
          },
          {
            "roundId": "op-f",
            "name": "Finals & 3rd Place",
            "badge": "Medal Rounds",
            "bestOf": "BO3",
            "matches": [
              {
                "id": "O7",
                "code": "OP-GF",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Winner of O5",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Winner of O6",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Championship Match · Best of 3"
              },
              {
                "id": "O8",
                "code": "OP-3RD",
                "status": "Scheduled",
                "time": "Scheduled Series",
                "team1": {
                  "seed": null,
                  "name": "Loser of O5",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "team2": {
                  "seed": null,
                  "name": "Loser of O6",
                  "tag": "TBD",
                  "score": 0,
                  "winner": null
                },
                "maps": [],
                "mvp": "TBD upon series completion",
                "vodUrl": null,
                "note": "Bronze Medal 3rd Place Consolation Match"
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
