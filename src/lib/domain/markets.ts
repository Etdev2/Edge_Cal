/**
 * Supported NBA Player Prop Markets and their stat extractors
 * Strictly follows Issue #8 (Canonical NBA Evidence Semantics)
 */

export interface PropMarketDefinition {
  id: string;
  code: string;
  label: string;
  category: "single" | "combo" | "defense";
  description: string;
  defaultLine: number;
  unit: string;
  isDerived: boolean;
  extractValue: (statRow: {
    pts: number;
    reb: number;
    ast: number;
    fg3m: number;
    blk: number;
    stl: number;
    turnover?: number;
  }) => number;
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

export function getMarketById(id: string): PropMarketDefinition {
  const found = SUPPORTED_MARKETS.find(
    (m) => m.id === id || m.code === id || m.id.toLowerCase() === id.toLowerCase()
  );
  return found || SUPPORTED_MARKETS[0];
}
