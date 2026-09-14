/**
 * Supported Player Prop Markets (NBA + NFL) and their stat extractors.
 * Strictly follows Issue #8 (Canonical NBA Evidence Semantics) and its
 * NFL extension: same line/side/push settlement, same evidence windows,
 * sport-scoped market registry so leagues never bleed into each other.
 */

export type PropMarketCategory = "single" | "combo" | "defense" | "passing" | "rushing" | "receiving";

/**
 * A box-score row from either league. Fields are optional because a row only
 * carries its own league's stats (the other league's are absent/0); every
 * extractor treats missing fields as 0.
 */
export type StatRowInput = {
  // NBA box-score fields
  pts?: number;
  reb?: number;
  ast?: number;
  fg3m?: number;
  blk?: number;
  stl?: number;
  turnover?: number;
  // NFL box-score fields
  passYds?: number;
  passTd?: number;
  passInt?: number;
  rushYds?: number;
  rushTd?: number;
  rec?: number;
  recYds?: number;
  recTd?: number;
};

export interface PropMarketDefinition {
  id: string;
  code: string;
  label: string;
  category: PropMarketCategory;
  description: string;
  defaultLine: number;
  unit: string;
  isDerived: boolean;
  extractValue: (statRow: StatRowInput) => number;
}

export const SUPPORTED_MARKETS: PropMarketDefinition[] = [
  {
    id: "PTS",
    code: "PTS",
    label: "Points",
    category: "single",
    description: "Total points scored in full game including overtime",
    defaultLine: 24.5,
    unit: "PTS",
    isDerived: false,
    extractValue: (row) => row.pts ?? 0,
  },
  {
    id: "REB",
    code: "REB",
    label: "Rebounds",
    category: "single",
    description: "Total rebounds (offensive + defensive)",
    defaultLine: 7.5,
    unit: "REB",
    isDerived: false,
    extractValue: (row) => row.reb ?? 0,
  },
  {
    id: "AST",
    code: "AST",
    label: "Assists",
    category: "single",
    description: "Total assists recorded",
    defaultLine: 6.5,
    unit: "AST",
    isDerived: false,
    extractValue: (row) => row.ast ?? 0,
  },
  {
    id: "3PM",
    code: "3PM",
    label: "3-Pointers Made",
    category: "single",
    description: "Total 3-point field goals made (fg3m)",
    defaultLine: 2.5,
    unit: "3PM",
    isDerived: false,
    extractValue: (row) => row.fg3m ?? 0,
  },
  {
    id: "PRA",
    code: "PRA",
    label: "Pts + Reb + Ast",
    category: "combo",
    description: "Combo market: Points + Rebounds + Assists",
    defaultLine: 38.5,
    unit: "PRA",
    isDerived: true,
    extractValue: (row) => (row.pts ?? 0) + (row.reb ?? 0) + (row.ast ?? 0),
  },
  {
    id: "PTS_AST",
    code: "PTS+AST",
    label: "Points + Assists",
    category: "combo",
    description: "Combo market: Points + Assists",
    defaultLine: 31.5,
    unit: "PTS+AST",
    isDerived: true,
    extractValue: (row) => (row.pts ?? 0) + (row.ast ?? 0),
  },
  {
    id: "PTS_REB",
    code: "PTS+REB",
    label: "Points + Rebounds",
    category: "combo",
    description: "Combo market: Points + Rebounds",
    defaultLine: 32.5,
    unit: "PTS+REB",
    isDerived: true,
    extractValue: (row) => (row.pts ?? 0) + (row.reb ?? 0),
  },
  {
    id: "REB_AST",
    code: "REB+AST",
    label: "Rebounds + Assists",
    category: "combo",
    description: "Combo market: Rebounds + Assists",
    defaultLine: 14.5,
    unit: "REB+AST",
    isDerived: true,
    extractValue: (row) => (row.reb ?? 0) + (row.ast ?? 0),
  },
  {
    id: "BLK",
    code: "BLK",
    label: "Blocks",
    category: "defense",
    description: "Total blocked shots",
    defaultLine: 1.5,
    unit: "BLK",
    isDerived: false,
    extractValue: (row) => row.blk ?? 0,
  },
  {
    id: "STL",
    code: "STL",
    label: "Steals",
    category: "defense",
    description: "Total steals recorded",
    defaultLine: 1.5,
    unit: "STL",
    isDerived: false,
    extractValue: (row) => row.stl ?? 0,
  },
];

/**
 * NFL Player Prop Markets (2026 season). Same settlement contract as the NBA
 * registry: a line + over/under side, integer lines push when the stat equals
 * the line, DNP (did not play) is excluded, low-activity games are flagged.
 */
export const NFL_SUPPORTED_MARKETS: PropMarketDefinition[] = [
  {
    id: "PASS_YDS",
    code: "PASS YDS",
    label: "Passing Yards",
    category: "passing",
    description: "Total passing yards in the game including overtime",
    defaultLine: 255.5,
    unit: "YDS",
    isDerived: false,
    extractValue: (row) => row.passYds ?? 0,
  },
  {
    id: "RUSH_YDS",
    code: "RUSH YDS",
    label: "Rushing Yards",
    category: "rushing",
    description: "Total rushing yards (net of sacks) in the game",
    defaultLine: 65.5,
    unit: "YDS",
    isDerived: false,
    extractValue: (row) => row.rushYds ?? 0,
  },
  {
    id: "REC",
    code: "REC",
    label: "Receptions",
    category: "receiving",
    description: "Total completed receptions in the game",
    defaultLine: 6.5,
    unit: "REC",
    isDerived: false,
    extractValue: (row) => row.rec ?? 0,
  },
  {
    id: "REC_YDS",
    code: "REC YDS",
    label: "Receiving Yards",
    category: "receiving",
    description: "Total receiving yards in the game",
    defaultLine: 75.5,
    unit: "YDS",
    isDerived: false,
    extractValue: (row) => row.recYds ?? 0,
  },
  {
    id: "TD",
    code: "TD",
    label: "Total Touchdowns",
    category: "combo",
    description: "Total touchdowns (passing + rushing + receiving)",
    defaultLine: 1.5,
    unit: "TD",
    isDerived: true,
    extractValue: (row) =>
      (row.passTd ?? 0) + (row.rushTd ?? 0) + (row.recTd ?? 0),
  },
  {
    id: "TOTAL_YDS",
    code: "TOTAL YDS",
    label: "Total Yards (Pass + Rush + Rec)",
    category: "combo",
    description: "Total all-purpose yards: passing + rushing + receiving",
    defaultLine: 395.5,
    unit: "YDS",
    isDerived: true,
    extractValue: (row) =>
      (row.passYds ?? 0) + (row.rushYds ?? 0) + (row.recYds ?? 0),
  },
];

const NBA_MARKET_MAP = new Map(SUPPORTED_MARKETS.map((m) => [m.id.toUpperCase(), m]));
const NFL_MARKET_MAP = new Map(NFL_SUPPORTED_MARKETS.map((m) => [m.id.toUpperCase(), m]));

const SPORT_MARKET_MAP: Record<string, PropMarketDefinition[]> = {
  nba: SUPPORTED_MARKETS,
  nfl: NFL_SUPPORTED_MARKETS,
};

export function getMarketsBySport(sport: string): PropMarketDefinition[] {
  return SPORT_MARKET_MAP[sport.toLowerCase()] ?? SUPPORTED_MARKETS;
}

/**
 * Sport-aware market lookup. Falls back to an NBA lookup when no sport is
 * supplied so existing callers keep working.
 */
export function getMarketById(id: string, sport?: string): PropMarketDefinition {
  const key = id.toUpperCase();
  if (sport) {
    const normalizedSport = sport.toLowerCase();
    const registry =
      normalizedSport === "nfl" ? NFL_MARKET_MAP : NBA_MARKET_MAP;
    const fallbackRegistry =
      normalizedSport === "nfl" ? NBA_MARKET_MAP : NFL_MARKET_MAP;
    const found =
      registry.get(key) ??
      [...registry.values()].find((m) => m.code === id || m.code.toLowerCase() === id.toLowerCase());
    if (found) return found;
    const crossFound = fallbackRegistry.get(key);
    if (crossFound) return crossFound;
  }
  const found =
    NBA_MARKET_MAP.get(key) ??
    NFL_MARKET_MAP.get(key) ??
    [...SUPPORTED_MARKETS, ...NFL_SUPPORTED_MARKETS].find(
      (m) => m.id === id || m.code === id || m.id.toLowerCase() === id.toLowerCase()
    );
  return found || SUPPORTED_MARKETS[0];
}
