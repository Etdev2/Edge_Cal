/**
 * Canonical Evidence Windows and Filtering Rules
 * Strictly follows Issue #8 (Canonical NBA Evidence Semantics)
 */

export type EvidenceWindowType =
  | "season"
  | "last_20"
  | "last_10"
  | "last_5"
  | "vs_opponent"
  | "home"
  | "away";

export interface EvidenceWindowOption {
  id: EvidenceWindowType;
  label: string;
  shortLabel: string;
  description: string;
}

export const EVIDENCE_WINDOWS: EvidenceWindowOption[] = [
  {
    id: "season",
    label: "Full Season (All Games)",
    shortLabel: "Season",
    description: "All official completed games for the active season",
  },
  {
    id: "last_20",
    label: "Last 20 Games",
    shortLabel: "L20",
    description: "Most recent 20 played appearances",
  },
  {
    id: "last_10",
    label: "Last 10 Games",
    shortLabel: "L10",
    description: "Most recent 10 played appearances",
  },
  {
    id: "last_5",
    label: "Last 5 Games",
    shortLabel: "L5",
    description: "Most recent 5 played appearances (short sample)",
  },
  {
    id: "vs_opponent",
    label: "Head-to-Head (vs Opponent)",
    shortLabel: "vs Opp",
    description: "Historical match-ups specifically against this opponent",
  },
  {
    id: "home",
    label: "Home Games Only",
    shortLabel: "Home",
    description: "All games played in the home arena",
  },
  {
    id: "away",
    label: "Away Games Only",
    shortLabel: "Away",
    description: "All road games played at the opponent arena",
  },
];

export interface RawGameStatEntry {
  gameId: number;
  gameDate: string; // YYYY-MM-DD
  season: number;
  seasonType: string;
  isHome: boolean;
  opponentAbbr: string;
  opponentName: string;
  teamAbbr: string;
  teamScore?: number;
  opponentScore?: number;
  min: string; // "36:42" or "0:00"
  minutesNumeric: number;
  pts: number;
  reb: number;
  ast: number;
  fg3m: number;
  blk: number;
  stl: number;
  turnover?: number;
  isDnp: boolean;
  lowMinutesFlag: boolean;
  isOvertime?: boolean;
}

export interface SettledGameLogItem extends RawGameStatEntry {
  statValue: number;
  line: number;
  side: "over" | "under";
  outcome: "win" | "loss" | "push";
  isDnpExcluded: boolean;
}

/**
 * Parses minutes string into decimal minutes (e.g. "32:30" -> 32.5)
 */
export function parseMinutesString(minStr: string | null | undefined): number {
  if (!minStr) return 0;
  const clean = minStr.trim();
  if (clean === "" || clean === "0" || clean === "00:00" || clean === "0:00") return 0;
  if (clean.includes(":")) {
    const [mins, secs] = clean.split(":").map((v) => parseFloat(v) || 0);
    return mins + secs / 60;
  }
  return parseFloat(clean) || 0;
}

/**
 * Filter and apply evidence window rules:
 * 1. Exclude DNPs (minutes == 0 or explicit DNP flag)
 * 2. Overtime is naturally included
 * 3. Low minutes (<15.0 mins) are flagged with lowMinutesFlag but NOT silently dropped
 * 4. Apply window filter (L5, L10, L20, vs Opponent, Home, Away, Season)
 */
export function filterAndSettleEvidence(
  allGames: RawGameStatEntry[],
  windowType: EvidenceWindowType,
  targetOpponentAbbr?: string,
  statExtractor: (row: RawGameStatEntry) => number = (r) => r.pts,
  line: number = 20.5,
  side: "over" | "under" = "over"
): {
  eligibleGames: SettledGameLogItem[];
  dnpGamesCount: number;
  lowMinuteGamesCount: number;
  statValues: number[];
} {
  // 1. Separate DNPs
  const playedGames: RawGameStatEntry[] = [];
  let dnpGamesCount = 0;

  for (const g of allGames) {
    const mins = g.minutesNumeric > 0 ? g.minutesNumeric : parseMinutesString(g.min);
    if (g.isDnp || mins <= 0.1) {
      dnpGamesCount++;
    } else {
      playedGames.push({
        ...g,
        minutesNumeric: mins,
        lowMinutesFlag: mins < 15.0,
      });
    }
  }

  // Sort chronological descending (most recent first)
  playedGames.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());

  // 2. Filter by evidence window
  let windowFiltered: RawGameStatEntry[] = [];

  switch (windowType) {
    case "last_5":
      windowFiltered = playedGames.slice(0, 5);
      break;
    case "last_10":
      windowFiltered = playedGames.slice(0, 10);
      break;
    case "last_20":
      windowFiltered = playedGames.slice(0, 20);
      break;
    case "vs_opponent":
      if (targetOpponentAbbr) {
        windowFiltered = playedGames.filter(
          (g) => g.opponentAbbr.toUpperCase() === targetOpponentAbbr.toUpperCase()
        );
      } else {
        windowFiltered = playedGames;
      }
      break;
    case "home":
      windowFiltered = playedGames.filter((g) => g.isHome);
      break;
    case "away":
      windowFiltered = playedGames.filter((g) => !g.isHome);
      break;
    case "season":
    default:
      windowFiltered = playedGames;
      break;
  }

  // 3. Settle each game
  let lowMinuteGamesCount = 0;
  const statValues: number[] = [];

  const eligibleGames: SettledGameLogItem[] = windowFiltered.map((g) => {
    const val = statExtractor(g);
    statValues.push(val);
    if (g.lowMinutesFlag) lowMinuteGamesCount++;

    let outcome: "win" | "loss" | "push" = "loss";
    if (side === "over") {
      if (val > line) outcome = "win";
      else if (val === line) outcome = "push";
      else outcome = "loss";
    } else {
      if (val < line) outcome = "win";
      else if (val === line) outcome = "push";
      else outcome = "loss";
    }

    return {
      ...g,
      statValue: val,
      line,
      side,
      outcome,
      isDnpExcluded: false,
    };
  });

  return {
    eligibleGames,
    dnpGamesCount,
    lowMinuteGamesCount,
    statValues,
  };
}
