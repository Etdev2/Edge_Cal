import { NBA_TEAMS, NBA_PLAYERS } from "./nbaData";
import type { RawGameStatEntry } from "@/lib/domain/evidence";

/**
 * In-memory fallback used when DATABASE_URL is not configured
 * (e.g. Vercel build time, or local demo without Postgres).
 * Keeps `next build` green and lets the UI run in demo mode.
 */

export function getFallbackTeams() {
  return NBA_TEAMS.map((t) => ({
    id: t.id,
    externalId: t.externalId,
    abbreviation: t.abbreviation,
    city: t.city,
    name: t.name,
    fullName: t.fullName,
    conference: t.conference,
    division: t.division,
    primaryColor: t.primaryColor,
    secondaryColor: t.secondaryColor,
  }));
}

export function getFallbackPlayers() {
  const teamById = new Map(NBA_TEAMS.map((t) => [t.id, t]));
  return NBA_PLAYERS.map((p) => {
    const team = teamById.get(p.teamId);
    return {
      id: p.id,
      externalId: p.externalId,
      firstName: p.firstName,
      lastName: p.lastName,
      fullName: p.fullName,
      position: p.position,
      jerseyNumber: p.jerseyNumber,
      teamId: p.teamId,
      teamAbbr: team?.abbreviation ?? p.teamAbbr,
      teamName: team?.name ?? p.teamAbbr,
      teamFullName: team?.fullName ?? p.teamAbbr,
      teamColor: team?.primaryColor ?? "#0E2240",
      height: p.height,
      weight: p.weight,
      avatarUrl: p.avatarUrl,
      isActive: true,
    };
  });
}

/**
 * Deterministically generate 35 game appearances for a player,
 * mirroring the seed logic but purely in-memory (no DB).
 */
export function generateFallbackGameLogs(playerId: number): RawGameStatEntry[] {
  const player = NBA_PLAYERS.find((p) => p.id === playerId);
  if (!player) return [];

  const avg = player.typicalAverages;
  const otherTeams = NBA_TEAMS.filter((t) => t.id !== player.teamId);
  const logs: RawGameStatEntry[] = [];

  for (let i = 0; i < 35; i++) {
    const oppTeam = otherTeams[i % otherTeams.length];
    const isHome = i % 2 === 0;

    const dateObj = new Date(2025, 9, 22);
    dateObj.setDate(dateObj.getDate() + i * 3);
    const gameDate = dateObj.toISOString().split("T")[0];

    const isDnp = i === 14;
    const isLowMinutes = i === 22;
    const isOt = i % 11 === 0;

    let minutesNumeric = 34 + Math.sin(i * 2.3) * 5;
    let minStr = `${Math.floor(minutesNumeric)}:${Math.floor(
      Math.abs(Math.sin(i)) * 50
    )
      .toString()
      .padStart(2, "0")}`;

    if (isDnp) {
      minutesNumeric = 0;
      minStr = "0:00";
    } else if (isLowMinutes) {
      minutesNumeric = 12.5;
      minStr = "12:30";
    }

    const pts = isDnp
      ? 0
      : Math.max(
          0,
          Math.round(
            avg.pts +
              Math.sin(i * 1.1) * (avg.pts * 0.28) +
              (isLowMinutes ? -12 : 0) +
              (isOt ? 5 : 0)
          )
        );
    const reb = isDnp
      ? 0
      : Math.max(
          0,
          Math.round(
            avg.reb + Math.cos(i * 1.3) * (avg.reb * 0.35) + (isLowMinutes ? -4 : 0)
          )
        );
    const ast = isDnp
      ? 0
      : Math.max(
          0,
          Math.round(
            avg.ast +
              Math.sin(i * 1.8 + 0.5) * (avg.ast * 0.38) +
              (isLowMinutes ? -3 : 0)
          )
        );
    const fg3m = isDnp ? 0 : Math.max(0, Math.round(avg.fg3m + Math.sin(i * 2.1) * 1.5));
    const blk = isDnp ? 0 : Math.max(0, Math.round(avg.blk + Math.cos(i * 0.9) * 1.0));
    const stl = isDnp ? 0 : Math.max(0, Math.round(avg.stl + Math.sin(i * 1.4) * 0.9));

    logs.push({
      gameId: playerId * 1000 + i + 1,
      gameDate,
      season: 2025,
      seasonType: "regular",
      isHome,
      opponentAbbr: oppTeam.abbreviation,
      opponentName: oppTeam.fullName,
      teamAbbr: player.teamAbbr,
      teamScore: undefined,
      opponentScore: undefined,
      min: minStr,
      minutesNumeric: Math.round(minutesNumeric * 10) / 10,
      pts,
      reb,
      ast,
      fg3m,
      blk,
      stl,
      turnover: (i % 4) + 1,
      isDnp,
      lowMinutesFlag: minutesNumeric > 0 && minutesNumeric < 15.0,
      isOvertime: isOt,
    });
  }

  // Most recent first, like the DB query ordering
  logs.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
  return logs;
}

export function getFallbackPlayerHeader(playerId: number) {
  const player = NBA_PLAYERS.find((p) => p.id === playerId);
  if (!player) return null;
  return {
    id: player.id,
    fullName: player.fullName,
    position: player.position,
    jerseyNumber: player.jerseyNumber,
    teamId: player.teamId,
    teamAbbr: player.teamAbbr,
    teamName: player.teamAbbr,
  };
}
