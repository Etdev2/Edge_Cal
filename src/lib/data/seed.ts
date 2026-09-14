import { db, isDatabaseConfigured } from "@/db";
import { teams, players, games, playerGameStats } from "@/db/schema";
import { NBA_TEAMS, NBA_PLAYERS } from "./nbaData";
import { NFL_TEAMS, NFL_PLAYERS } from "./nflData";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

/**
 * Seed entry point. Each sport is seeded independently and idempotently, so
 * a database that already contains the NBA demo dataset will automatically
 * pick up the NFL dataset (and vice versa) without wiping anything.
 */
export async function seedDatabaseIfEmpty() {
  if (!isDatabaseConfigured()) {
    return { seeded: false, message: "Database not configured — running in demo memory mode" };
  }

  let nbaSeeded = false;
  let nflSeeded = false;
  const errors: string[] = [];

  try {
    const nbaTeams = await db.select({ id: teams.id }).from(teams).where(eq(teams.sport, "nba")).limit(1);
    if (nbaTeams.length === 0) {
      await seedNbaDemoData();
      nbaSeeded = true;
    }
  } catch (err) {
    console.error("NBA seeding error:", err);
    errors.push(String(err));
  }

  try {
    const nflTeams = await db.select({ id: teams.id }).from(teams).where(eq(teams.sport, "nfl")).limit(1);
    if (nflTeams.length === 0) {
      await seedNflDemoData();
      nflSeeded = true;
    }
  } catch (err) {
    console.error("NFL seeding error:", err);
    errors.push(String(err));
  }

  if (errors.length > 0) return { seeded: false, error: errors.join("; ") };
  if (!nbaSeeded && !nflSeeded) return { seeded: false, message: "Database already populated" };
  const parts: string[] = [];
  if (nbaSeeded) parts.push("NBA demo dataset");
  if (nflSeeded) parts.push("NFL demo dataset");
  return { seeded: true, message: `Seeded ${parts.join(" and ")}` };
}

/**
 * NBA demo dataset: 30 teams, 12 featured players, 35 games each with the
 * canonical evidence semantics (DNP game #14, low-minute game #22, OT every
 * 11th game).
 */
async function seedNbaDemoData() {
  console.log("Seeding NBA Teams...");
  for (const t of NBA_TEAMS) {
    await db
      .insert(teams)
      .values({
        id: t.id,
        externalId: t.externalId,
        sport: "nba",
        abbreviation: t.abbreviation,
        city: t.city,
        name: t.name,
        fullName: t.fullName,
        conference: t.conference,
        division: t.division,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding NBA Players...");
  for (const p of NBA_PLAYERS) {
    await db
      .insert(players)
      .values({
        id: p.id,
        externalId: p.externalId,
        sport: "nba",
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: p.fullName,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
        teamId: p.teamId,
        isActive: true,
        height: p.height,
        weight: p.weight,
        avatarUrl: p.avatarUrl,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding NBA Games & Player Game Stats...");
  let gameCounter = 1;
  let statCounter = 1;

  for (const p of NBA_PLAYERS) {
    const avg = p.typicalAverages;
    const numGames = 35;
    const otherTeams = NBA_TEAMS.filter((t) => t.id !== p.teamId);

    for (let i = 0; i < numGames; i++) {
      const oppTeam = otherTeams[i % otherTeams.length];
      const isHome = i % 2 === 0;
      const gameId = gameCounter++;

      const dateObj = new Date(2025, 9, 22); // Oct 22, 2025
      dateObj.setDate(dateObj.getDate() + i * 3);
      const gameDate = dateObj.toISOString().split("T")[0];

      const isDnp = i === 14; // Game 14 was a DNP (rest / injury)
      const isLowMinutes = i === 22; // Game 22 was low minutes (foul trouble / blowout)
      const isOt = i % 11 === 0; // occasional OT

      const teamScore = 100 + Math.floor(Math.sin(i * 1.7) * 15) + 10;
      const oppScore = 100 + Math.floor(Math.cos(i * 1.5) * 15) + 8;

      const homeTeamId = isHome ? p.teamId : oppTeam.id;
      const visitorTeamId = isHome ? oppTeam.id : p.teamId;

      await db
        .insert(games)
        .values({
          id: gameId,
          externalId: 10000 + gameId,
          sport: "nba",
          gameDate,
          season: 2025,
          seasonType: "regular",
          statusState: "final",
          homeTeamId,
          visitorTeamId,
          homeTeamScore: teamScore,
          visitorTeamScore: oppScore,
          postseason: false,
          isOvertime: isOt,
        })
        .onConflictDoNothing();

      let minutesNumeric = 34 + Math.sin(i * 2.3) * 5;
      let minStr = `${Math.floor(minutesNumeric)}:${Math.floor(Math.abs(Math.sin(i)) * 50).toString().padStart(2, "0")}`;

      if (isDnp) {
        minutesNumeric = 0;
        minStr = "0:00";
      } else if (isLowMinutes) {
        minutesNumeric = 12.5;
        minStr = "12:30";
      }

      const pts = isDnp
        ? 0
        : Math.max(0, Math.round(avg.pts + Math.sin(i * 1.1) * (avg.pts * 0.28) + (isLowMinutes ? -12 : 0) + (isOt ? 5 : 0)));
      const reb = isDnp
        ? 0
        : Math.max(0, Math.round(avg.reb + Math.cos(i * 1.3) * (avg.reb * 0.35) + (isLowMinutes ? -4 : 0)));
      const ast = isDnp
        ? 0
        : Math.max(0, Math.round(avg.ast + Math.sin(i * 1.8 + 0.5) * (avg.ast * 0.38) + (isLowMinutes ? -3 : 0)));
      const fg3m = isDnp ? 0 : Math.max(0, Math.round(avg.fg3m + Math.sin(i * 2.1) * 1.5));
      const blk = isDnp ? 0 : Math.max(0, Math.round(avg.blk + Math.cos(i * 0.9) * 1.0));
      const stl = isDnp ? 0 : Math.max(0, Math.round(avg.stl + Math.sin(i * 1.4) * 0.9));

      await db
        .insert(playerGameStats)
        .values({
          id: statCounter++,
          playerId: p.id,
          gameId,
          teamId: p.teamId,
          opponentTeamId: oppTeam.id,
          sport: "nba",
          isHome,
          min: minStr,
          minutesNumeric: Math.round(minutesNumeric * 10) / 10,
          pts,
          reb,
          ast,
          fg3m,
          blk,
          stl,
          turnover: Math.floor(Math.random() * 4) + 1,
          pf: Math.floor(Math.random() * 4) + 1,
          fga: Math.round(pts * 0.8) + 4,
          fgm: Math.round(pts * 0.45),
          fta: Math.round(pts * 0.25),
          ftm: Math.round(pts * 0.2),
          isDnp,
          lowMinutesFlag: minutesNumeric > 0 && minutesNumeric < 15.0,
          source: "BALLDONTLIE_API",
        })
        .onConflictDoNothing();
    }
  }

  await resyncSequences();
}

/**
 * NFL demo dataset: 32 teams, 12 featured players, 8 completed 2026-season
 * games each (week 3 DNP, week 5 limited activity, week 1 OT).
 */
async function seedNflDemoData() {
  console.log("Seeding NFL Teams...");
  for (const t of NFL_TEAMS) {
    await db
      .insert(teams)
      .values({
        id: t.id,
        externalId: t.externalId,
        sport: "nfl",
        abbreviation: t.abbreviation,
        city: t.city,
        name: t.name,
        fullName: t.fullName,
        conference: t.conference,
        division: t.division,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding NFL Players...");
  for (const p of NFL_PLAYERS) {
    await db
      .insert(players)
      .values({
        id: p.id,
        externalId: p.externalId,
        sport: "nfl",
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: p.fullName,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
        teamId: p.teamId,
        isActive: true,
        height: p.height,
        weight: p.weight,
        avatarUrl: p.avatarUrl,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding NFL Games & Player Game Stats...");
  let gameCounter = 1;
  let statCounter = 1;

  for (const p of NFL_PLAYERS) {
    const avg = p.typicalAverages;
    const numGames = 8;
    const otherTeams = NFL_TEAMS.filter((t) => t.id !== p.teamId);

    for (let i = 0; i < numGames; i++) {
      const oppTeam = otherTeams[i % otherTeams.length];
      const isHome = i % 2 === 0;
      const gameId = gameCounter++;

      // Weekly cadence starting with the 2026 season opener
      const dateObj = new Date(2026, 8, 10); // Sep 10, 2026
      dateObj.setDate(dateObj.getDate() + i * 7);
      const gameDate = dateObj.toISOString().split("T")[0];

      const isDnp = i === 2; // missed week 3 (injury)
      const isLowActivity = i === 4; // week 5: mop-up snaps only
      const isOt = i === 0; // rare OT

      const teamScore = 24 + Math.floor(Math.sin(i * 1.9) * 4) + 4;
      const oppScore = 21 + Math.floor(Math.cos(i * 1.4) * 4) + 3;

      const homeTeamId = isHome ? p.teamId : oppTeam.id;
      const visitorTeamId = isHome ? oppTeam.id : p.teamId;

      await db
        .insert(games)
        .values({
          id: gameId,
          externalId: 50000 + gameId,
          sport: "nfl",
          gameDate,
          season: 2026,
          seasonType: "regular",
          statusState: "final",
          homeTeamId,
          visitorTeamId,
          homeTeamScore: teamScore,
          visitorTeamScore: oppScore,
          postseason: false,
          isOvertime: isOt,
        })
        .onConflictDoNothing();

      let minutesNumeric = 56 + Math.sin(i * 1.7) * 3;
      let minStr = `${Math.floor(minutesNumeric)}:${Math.floor(Math.abs(Math.sin(i * 3.1)) * 50).toString().padStart(2, "0")}`;

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

      await db
        .insert(playerGameStats)
        .values({
          id: statCounter++,
          playerId: p.id,
          gameId,
          teamId: p.teamId,
          opponentTeamId: oppTeam.id,
          sport: "nfl",
          isHome,
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
          pf: 2,
          fga: 0,
          fgm: 0,
          fta: 0,
          ftm: 0,
          isDnp,
          lowMinutesFlag: minutesNumeric > 0 && minutesNumeric < 15.0,
          source: "SYNTHETIC_DEMO_SEED",
        })
        .onConflictDoNothing();
    }
  }

  await resyncSequences();
}

/** Set postgres sequences past the explicit IDs we inserted. */
async function resyncSequences() {
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('teams', 'id'), coalesce(max(id),0) + 1, false) FROM teams;`);
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('players', 'id'), coalesce(max(id),0) + 1, false) FROM players;`);
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('games', 'id'), coalesce(max(id),0) + 1, false) FROM games;`);
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('player_game_stats', 'id'), coalesce(max(id),0) + 1, false) FROM player_game_stats;`);
  console.log("Seeding complete!");
}
