import { describe, expect, it } from "vitest";
import { filterAndSettleEvidence, parseMinutesString } from "./evidence";

const game = (overrides: Partial<Parameters<typeof filterAndSettleEvidence>[0][number]> = {}) => ({
  gameId: 1,
  gameDate: "2026-01-01",
  season: 2025,
  seasonType: "regular",
  isHome: true,
  opponentAbbr: "LAL",
  opponentName: "Los Angeles Lakers",
  teamAbbr: "DEN",
  min: "30:00",
  minutesNumeric: 30,
  pts: 25,
  reb: 5,
  ast: 5,
  fg3m: 2,
  blk: 1,
  stl: 1,
  isDnp: false,
  lowMinutesFlag: false,
  ...overrides,
});

describe("evidence filtering", () => {
  it("parses clock minutes", () => {
    expect(parseMinutesString("32:30")).toBeCloseTo(32.5, 6);
    expect(parseMinutesString("0:00")).toBe(0);
  });

  it("excludes DNPs but retains low-minute appearances", () => {
    const result = filterAndSettleEvidence(
      [
        game({ gameId: 1, isDnp: true, min: "0:00", minutesNumeric: 0 }),
        game({ gameId: 2, min: "12:00", minutesNumeric: 12, pts: 10 }),
      ],
      "season",
      undefined,
      (row) => row.pts,
      20.5,
      "over"
    );
    expect(result.dnpGamesCount).toBe(1);
    expect(result.lowMinuteGamesCount).toBe(1);
    expect(result.eligibleGames).toHaveLength(1);
  });
});
