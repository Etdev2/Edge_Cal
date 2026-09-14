import { NBA_TEAMS, NBA_PLAYERS } from "./nbaData";
import { NFL_TEAMS, NFL_PLAYERS, type NflPlayerSeed } from "./nflData";
import type { RawGameStatEntry } from "@/lib/domain/evidence";
import type { SportId } from "@/db/schema";

/**
 * In-memory fallback used when DATABASE_URL is not configured
 * (e.g. Vercel build time, or local demo without Postgres).
 * Keeps `next build` green and lets the UI run in demo mode for both
 * supported leagues (NBA + NFL).
 */

export interface FallbackTeam {
  id: number;
  externalId: number;
  sport: SportId;
  abbreviation: string;
  city: string;
  name: string;
  fullName: string;
  conference: string;
  division: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FallbackPlayer {
  id: number;
  externalId: number;
  sport: SportId;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  jerseyNumber: string;
  teamId: number;
  teamAbbr: string;
  teamName: string;
  teamFullName: string;
  teamColor: string;
  height: string;
  weight: string;
  avatarUrl: string;
  isActive: boolean;
}

export function getFallbackTeams(sport: SportId = "nba"): FallbackTeam[] {
  const teams = sport === "nfl" ? NFL_TEAMS : NBA_TEAMS;
  return teams.map((t) => ({
    id: t.id,
    externalId: t.externalId,
    sport,
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

export function getFallbackPlayers(sport: SportId = "nba"): FallbackPlayer[] {
  if (sport === "nfl") {
    const teamById = new Map(NFL_TEAMS.map((t) => [t.id, t]));
    return NFL_PLAYERS.map((p) => {
      const team = teamById.get(p.teamId);
      return {
        id: p.id,
        externalId: p.externalId,
        sport: "nfl" as const,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: p.fullName,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
        teamId: p.teamId,
        teamAbbr: team?.abbreviation ?? p.teamAbbr,
        teamName: team?.name ?? p.teamAbbr,
        teamFullName: team?.fullName ?? p.teamAbbr,
        teamColor: team?.primaryColor ?? "#002244",
        height: p.height,
        weight: p.weight,
        avatarUrl: p.avatarUrl,
        isActive: true,
      };
    });
  }

  const teamById = new Map(NBA_TEAMS.map((t) => [t.id, t]));
  return NBA_PLAYERS.map((p) => {
    const team = teamById.get(p.teamId);
    return {
      id: p.id,
      externalId: p.externalId,
      sport: "nba" as const,
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
 * Deterministically generate 35 NBA game appearances (or 8 NFL games) for a
 * player, mirroring the seed logic but purely in-memory (no DB).
 */
export function generateFallbackGameLogs(playerId: number, sport: SportId = "nba"): RawGameStatEntry[] {
  if (sport === "nfl") return generateFallbackNflGameLogs(playerId);
  return generateFallbackNbaGameLogs(playerId);
}

function generateFallbackNbaGameLogs(playerId: number): RawGameStatEntry[] {
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
          Math.round(avg.reb + Math.cos(i * 1.3) * (avg.reb * 0.35) + (isLowMinutes ? -4 : 0))
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

/**
 * Deterministic 8-week (completed) 2026 NFL season per player:
 * week 3 (i === 2) is a DNP (injury), week 5 (i === 4) is limited
 * activity (mop-up snaps only, flagged low-activity), week 1 goes to OT.
 */
function generateFallbackNflGameLogs(playerId: number): RawGameStatEntry[] {
  const player: NflPlayerSeed | undefined = NFL_PLAYERS.find((p) => p.id === playerId);
  if (!player) return [];

  const avg = player.typicalAverages;
  const otherTeams = NFL_TEAMS.filter((t) => t.id !== player.teamId);
  const logs: RawGameStatEntry[] = [];
  const numGames = 8;

  for (let i = 0; i < numGames; i++) {
    const oppTeam = otherTeams[i % otherTeams.length];
    const isHome = i % 2 === 0;

    // Weeks 1..8 of the 2026 season (weekly cadence)
    const dateObj = new Date(2026, 8, 10); // Sep 10, 2026
    dateObj.setDate(dateObj.getDate() + i * 7);
    const gameDate = dateObj.toISOString().split("T")[0];

    const isDnp = i === 2; // missed week 3 (injury)
    const isLowActivity = i === 4; // week 5: mop-up snaps only
    const isOt = i === 0; // rare OT in week 1

    let minutesNumeric = 56 + Math.sin(i * 1.7) * 3; // starter clock time
    let minStr = `${Math.floor(minutesNumeric)}:${Math.floor(
      Math.abs(Math.sin(i * 3.1)) * 50
    )
      .toString()
      .padStart(2, "0")}`;

    if (isDnp) {
      minutesNumeric = 0;
      minStr = "0:00";
    } else if (isLowActivity) {
      minutesNumeric = 12.5;
      minStr = "12:30";
    }

    const scale = isDnp ? 0 : isLowActivity ? 0.35 : 1;
    const jitter = (phase: number, spread: number) => Math.sin(i * 1.3 + phase) * spread;

    const passYds = Math.max(0, Math.round(avg.passYds * scale + jitter(0.2, avg.passYds * 0.18)));
    const passTd = Math.max(0, Math.min(4, Math.round(avg.passTd * scale + jitter(1.1, 1.2))));
    const passInt = Math.max(0, Math.min(3, Math.round(avg.passInt * scale + Math.cos(i * 0.9))));
    const rushYds = Math.max(0, Math.round(avg.rushYds * scale + jitter(0.7, avg.rushYds * 0.3)));
    const rushTd = Math.max(0, Math.min(2, Math.round(avg.rushTd * scale + (i % 3 === 0 ? 0.5 : -0.3))));
    const rec = Math.max(0, Math.round(avg.rec * scale + jitter(1.6, avg.rec * 0.3)));
    const recYds = Math.max(0, Math.round(avg.recYds * scale + jitter(2.2, avg.recYds * 0.25)));
    const recTd = Math.max(0, Math.min(2, Math.round(avg.recTd * scale + (i % 4 === 1 ? 0.5 : -0.4))));

    logs.push({
      gameId: playerId * 1000 + i + 1,
      gameDate,
      season: 2026,
      seasonType: "regular",
      isHome,
      opponentAbbr: oppTeam.abbreviation,
      opponentName: oppTeam.fullName,
      teamAbbr: player.teamAbbr,
      teamScore: undefined,
      opponentScore: undefined,
      min: minStr,
      minutesNumeric: Math.round(minutesNumeric * 10) / 10,
      pts: 0,
      reb: 0,
      ast: 0,
      fg3m: 0,
      blk: 0,
      stl: 0,
      passYds,
      passTd,
      passInt,
      rushYds,
      rushTd,
      rec,
      recYds,
      recTd,
      turnover: Math.max(0, Math.round(Math.abs(jitter(2.9, 0.8)))),
      isDnp,
      lowMinutesFlag: minutesNumeric > 0 && minutesNumeric < 15.0,
      isOvertime: isOt,
    });
  }

  logs.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
  return logs;
}

export function getFallbackPlayerHeader(playerId: number, sport: SportId = "nba") {
  if (sport === "nfl") {
    const player = NFL_PLAYERS.find((p) => p.id === playerId);
    if (!player) return null;
    const team = NFL_TEAMS.find((t) => t.id === player.teamId);
    return {
      id: player.id,
      fullName: player.fullName,
      position: player.position,
      jerseyNumber: player.jerseyNumber,
      teamId: player.teamId,
      teamAbbr: player.teamAbbr,
      teamName: team?.name ?? player.teamAbbr,
    };
  }

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
