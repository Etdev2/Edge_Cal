import { db, isDatabaseConfigured } from "@/db";
import { teams, players, games, playerGameStats } from "@/db/schema";
import { NBA_TEAMS, NBA_PLAYERS } from "./nbaData";
import { sql } from "drizzle-orm";

export async function seedDatabaseIfEmpty() {
  if (!isDatabaseConfigured()) {
    return { seeded: false, message: "Database not configured — running in demo memory mode" };
  }
  try {
    const existingTeams = await db.select({ id: teams.id }).from(teams).limit(1);
    if (existingTeams.length > 0) {
      // Database already seeded
      return { seeded: false, message: "Database already populated" };
    }

    console.log("Seeding NBA Teams...");
    for (const t of NBA_TEAMS) {
      await db
        .insert(teams)
        .values({
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

    console.log("Seeding Games & Player Game Stats...");
    let gameCounter = 1;
    let statCounter = 1;

    // Generate 35 realistic game appearances per player
    for (const p of NBA_PLAYERS) {
      const avg = p.typicalAverages;
      const numGames = 35;
      const otherTeams = NBA_TEAMS.filter((t) => t.id !== p.teamId);

      for (let i = 0; i < numGames; i++) {
        const oppTeam = otherTeams[i % otherTeams.length];
        const isHome = i % 2 === 0;
        const gameId = gameCounter++;

        // Dates spanning the season
        const dateObj = new Date(2025, 9, 22); // Oct 22, 2025
        dateObj.setDate(dateObj.getDate() + i * 3);
        const gameDate = dateObj.toISOString().split("T")[0];

        const isDnp = i === 14; // Game 14 was a DNP (rest / injury)
        const isLowMinutes = i === 22; // Game 22 was low minutes (foul trouble / blowout)
        const isOt = i % 11 === 0; // occasional OT

        // Score
        const teamScore = 100 + Math.floor(Math.sin(i * 1.7) * 15) + 10;
        const oppScore = 100 + Math.floor(Math.cos(i * 1.5) * 15) + 8;

        const homeTeamId = isHome ? p.teamId : oppTeam.id;
        const visitorTeamId = isHome ? oppTeam.id : p.teamId;

        await db
          .insert(games)
          .values({
            id: gameId,
            externalId: 10000 + gameId,
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

        // Minutes and stats with realistic statistical distribution around typical averages
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
        const fg3m = isDnp
          ? 0
          : Math.max(0, Math.round(avg.fg3m + Math.sin(i * 2.1) * 1.5));
        const blk = isDnp
          ? 0
          : Math.max(0, Math.round(avg.blk + Math.cos(i * 0.9) * 1.0));
        const stl = isDnp
          ? 0
          : Math.max(0, Math.round(avg.stl + Math.sin(i * 1.4) * 0.9));

        await db
          .insert(playerGameStats)
          .values({
            id: statCounter++,
            playerId: p.id,
            gameId: gameId,
            teamId: p.teamId,
            opponentTeamId: oppTeam.id,
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

    // Set postgres sequences to avoid ID collisions
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('teams', 'id'), coalesce(max(id),0) + 1, false) FROM teams;`);
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('players', 'id'), coalesce(max(id),0) + 1, false) FROM players;`);
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('games', 'id'), coalesce(max(id),0) + 1, false) FROM games;`);
    await db.execute(sql`SELECT setval(pg_get_serial_sequence('player_game_stats', 'id'), coalesce(max(id),0) + 1, false) FROM player_game_stats;`);

    console.log("Seeding complete!");
    return { seeded: true, message: "Database successfully seeded" };
  } catch (err) {
    console.error("Seeding error:", err);
    return { seeded: false, error: String(err) };
  }
}
