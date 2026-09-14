import { describe, expect, it } from "vitest";
import {
  SUPPORTED_MARKETS,
  NFL_SUPPORTED_MARKETS,
  getMarketsBySport,
  getMarketById,
} from "./markets";

describe("sport-scoped market registries", () => {
  it("has the canonical 10 NBA markets", () => {
    expect(SUPPORTED_MARKETS).toHaveLength(10);
    const ids = SUPPORTED_MARKETS.map((m) => m.id);
    for (const id of ["PTS", "REB", "AST", "3PM", "PRA", "PTS_AST", "PTS_REB", "REB_AST", "BLK", "STL"]) {
      expect(ids).toContain(id);
    }
  });

  it("has the 6 NFL player-prop markets", () => {
    expect(NFL_SUPPORTED_MARKETS).toHaveLength(6);
    const ids = NFL_SUPPORTED_MARKETS.map((m) => m.id);
    for (const id of ["PASS_YDS", "RUSH_YDS", "REC", "REC_YDS", "TD", "TOTAL_YDS"]) {
      expect(ids).toContain(id);
    }
  });

  it("returns sport-specific registries and falls back to NBA for unknown sports", () => {
    expect(getMarketsBySport("nba")).toBe(SUPPORTED_MARKETS);
    expect(getMarketsBySport("nfl")).toBe(NFL_SUPPORTED_MARKETS);
    expect(getMarketsBySport("soccer")).toBe(SUPPORTED_MARKETS);
    expect(getMarketsBySport("NBA").length).toBe(10);
  });

  it("NBA and NFL market IDs do not collide", () => {
    const nbaIds = new Set(SUPPORTED_MARKETS.map((m) => m.id.toUpperCase()));
    const nflIds = new Set(NFL_SUPPORTED_MARKETS.map((m) => m.id.toUpperCase()));
    const overlap = [...nbaIds].filter((id) => nflIds.has(id));
    expect(overlap).toHaveLength(0);
  });
});

describe("getMarketById (sport-aware lookup)", () => {
  it("resolves NBA markets", () => {
    expect(getMarketById("PTS").label).toBe("Points");
    expect(getMarketById("PRA", "nba").isDerived).toBe(true);
  });

  it("resolves NFL markets", () => {
    const passYds = getMarketById("PASS_YDS", "nfl");
    expect(passYds.category).toBe("passing");
    expect(passYds.defaultLine).toBe(255.5);

    const rec = getMarketById("REC", "nfl");
    expect(rec.category).toBe("receiving");
    expect(rec.defaultLine).toBe(6.5);
  });

  it("is case-insensitive on the market id", () => {
    expect(getMarketById("pass_yds", "nfl").id).toBe("PASS_YDS");
    expect(getMarketById("pts").id).toBe("PTS");
  });

  it("falls back to the other registry for robustness (never throws)", () => {
    // An NFL id requested without sport still resolves
    expect(getMarketById("PASS_YDS").id).toBe("PASS_YDS");
    // An unknown id falls back to the first NBA market rather than throwing
    expect(getMarketById("NOT_A_MARKET", "nfl").id).toBe(SUPPORTED_MARKETS[0].id);
  });
});

describe("NFL market extractors", () => {
  const nfl = {
    passYds: 255,
    passTd: 2,
    passInt: 1,
    rushYds: 70,
    rushTd: 1,
    rec: 5,
    recYds: 50,
    recTd: 0,
  };

  it("extracts passing yards directly", () => {
    expect(getMarketById("PASS_YDS", "nfl").extractValue(nfl)).toBe(255);
  });

  it("derives Total Touchdowns from pass + rush + rec TDs", () => {
    expect(getMarketById("TD", "nfl").extractValue(nfl)).toBe(3);
    expect(getMarketById("TD", "nfl").extractValue({})).toBe(0);
    expect(getMarketById("TD", "nfl").isDerived).toBe(true);
  });

  it("derives Total Yards from pass + rush + rec yards", () => {
    expect(getMarketById("TOTAL_YDS", "nfl").extractValue(nfl)).toBe(255 + 70 + 50);
    expect(getMarketById("TOTAL_YDS", "nfl").extractValue({})).toBe(0);
  });

  it("tolerates absent NFL fields (NBA-shaped rows)", () => {
    const nbaRow = { pts: 30, reb: 8, ast: 6, fg3m: 3, blk: 1, stl: 1 };
    expect(getMarketById("PASS_YDS", "nfl").extractValue(nbaRow as any)).toBe(0);
    expect(getMarketById("TD", "nfl").extractValue(nbaRow as any)).toBe(0);
  });
});

describe("NBA market extractors (regression)", () => {
  it("extracts single stats and derived combos from one row", () => {
    const row = { pts: 30, reb: 8, ast: 6, fg3m: 3, blk: 1, stl: 1 };
    expect(getMarketById("PTS").extractValue(row)).toBe(30);
    expect(getMarketById("PRA").extractValue(row)).toBe(44);
    expect(getMarketById("PTS_AST").extractValue(row)).toBe(36);
    expect(getMarketById("REB_AST").extractValue(row)).toBe(14);
    expect(getMarketById("3PM").extractValue(row)).toBe(3);
  });
});
