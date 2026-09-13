import { describe, expect, it } from "vitest";
import { filterAndSettleEvidence, parseMinutesString, EVIDENCE_WINDOWS } from "./evidence";

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

describe("minutes parsing", () => {
  it("parses clock minutes", () => {
    expect(parseMinutesString("32:30")).toBeCloseTo(32.5, 6);
    expect(parseMinutesString("0:00")).toBe(0);
    expect(parseMinutesString("12:00")).toBe(12);
    expect(parseMinutesString("05:30")).toBeCloseTo(5.5, 6);
  });

  it("handles null/empty", () => {
    expect(parseMinutesString(null as any)).toBe(0);
    expect(parseMinutesString("")).toBe(0);
    expect(parseMinutesString("0")).toBe(0);
  });
});

describe("evidence filtering and settlement", () => {
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

  it("excludes games with <=0.1 minutes as DNP", () => {
    const result = filterAndSettleEvidence(
      [game({ minutesNumeric: 0.05, min: "0:03" }), game({ minutesNumeric: 20 })],
      "season",
      undefined,
      (r) => r.pts,
      20.5,
      "over"
    );
    expect(result.dnpGamesCount).toBe(1);
    expect(result.eligibleGames).toHaveLength(1);
  });

  it("sorts most recent first", () => {
    const result = filterAndSettleEvidence(
      [
        game({ gameId: 1, gameDate: "2025-10-01" }),
        game({ gameId: 2, gameDate: "2025-11-01" }),
        game({ gameId: 3, gameDate: "2025-09-01" }),
      ],
      "season",
      undefined,
      (r) => r.pts,
      20.5,
      "over"
    );
    expect(result.eligibleGames[0].gameId).toBe(2);
    expect(result.eligibleGames[1].gameId).toBe(1);
    expect(result.eligibleGames[2].gameId).toBe(3);
  });

  it("filters last_5 window", () => {
    const games = Array.from({ length: 10 }, (_, i) =>
      game({ gameId: i + 1, gameDate: `2025-10-${String(i + 1).padStart(2, "0")}` })
    );
    const result = filterAndSettleEvidence(games, "last_5", undefined, (r) => r.pts, 20.5, "over");
    expect(result.eligibleGames).toHaveLength(5);
  });

  it("filters last_10 and last_20 windows", () => {
    const games = Array.from({ length: 25 }, (_, i) =>
      game({ gameId: i + 1, gameDate: `2025-10-${String(i + 1).padStart(2, "0")}` })
    );
    expect(
      filterAndSettleEvidence(games, "last_10", undefined, (r) => r.pts, 20.5, "over").eligibleGames
    ).toHaveLength(10);
    expect(
      filterAndSettleEvidence(games, "last_20", undefined, (r) => r.pts, 20.5, "over").eligibleGames
    ).toHaveLength(20);
  });

  it("filters vs_opponent window", () => {
    const games = [
      game({ gameId: 1, opponentAbbr: "LAL" }),
      game({ gameId: 2, opponentAbbr: "GSW" }),
      game({ gameId: 3, opponentAbbr: "LAL" }),
    ];
    const result = filterAndSettleEvidence(games, "vs_opponent", "LAL", (r) => r.pts, 20.5, "over");
    expect(result.eligibleGames).toHaveLength(2);
  });

  it("filters home and away windows", () => {
    const games = [
      game({ gameId: 1, isHome: true }),
      game({ gameId: 2, isHome: false }),
      game({ gameId: 3, isHome: true }),
    ];
    expect(
      filterAndSettleEvidence(games, "home", undefined, (r) => r.pts, 20.5, "over").eligibleGames
    ).toHaveLength(2);
    expect(
      filterAndSettleEvidence(games, "away", undefined, (r) => r.pts, 20.5, "over").eligibleGames
    ).toHaveLength(1);
  });

  it("settles over/under with pushes", () => {
    const games = [
      game({ pts: 25 }),
      game({ pts: 20 }),
      game({ pts: 24 }),
    ];
    const overResult = filterAndSettleEvidence(games, "season", undefined, (r) => r.pts, 24, "over");
    expect(overResult.eligibleGames[0].outcome).toBe("win");
    expect(overResult.eligibleGames[1].outcome).toBe("loss");
    expect(overResult.eligibleGames[2].outcome).toBe("push");

    const underResult = filterAndSettleEvidence(games, "season", undefined, (r) => r.pts, 24, "under");
    expect(underResult.eligibleGames[0].outcome).toBe("loss");
    expect(underResult.eligibleGames[1].outcome).toBe("win");
    expect(underResult.eligibleGames[2].outcome).toBe("push");
  });

  it("flags low minutes <15", () => {
    const games = [game({ minutesNumeric: 12 }), game({ minutesNumeric: 20 })];
    const result = filterAndSettleEvidence(games, "season", undefined, (r) => r.pts, 20.5, "over");
    expect(result.lowMinuteGamesCount).toBe(1);
    expect(result.eligibleGames[0].lowMinutesFlag).toBe(true);
  });

  it("has 7 defined evidence windows", () => {
    expect(EVIDENCE_WINDOWS).toHaveLength(7);
    const ids = EVIDENCE_WINDOWS.map((w) => w.id);
    expect(ids).toContain("season");
    expect(ids).toContain("last_20");
    expect(ids).toContain("last_10");
    expect(ids).toContain("last_5");
    expect(ids).toContain("vs_opponent");
    expect(ids).toContain("home");
    expect(ids).toContain("away");
  });
});
