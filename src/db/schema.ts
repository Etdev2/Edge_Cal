import { pgTable, text, serial, integer, doublePrecision, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  externalId: integer("external_id").unique(),
  abbreviation: text("abbreviation").notNull().unique(),
  city: text("city").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  conference: text("conference").notNull(),
  division: text("division").notNull(),
  primaryColor: text("primary_color").default("#1d428a"),
  secondaryColor: text("secondary_color").default("#c8102e"),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  externalId: integer("external_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name").notNull(),
  position: text("position").notNull(),
  jerseyNumber: text("jersey_number"),
  teamId: integer("team_id").references(() => teams.id),
  isActive: boolean("is_active").default(true).notNull(),
  height: text("height"),
  weight: text("weight"),
  avatarUrl: text("avatar_url"),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  externalId: integer("external_id").unique(),
  gameDate: text("game_date").notNull(), // YYYY-MM-DD
  season: integer("season").notNull(),
  seasonType: text("season_type").default("regular").notNull(), // regular, playoffs, ist, playin
  statusState: text("status_state").default("final").notNull(), // final, in_progress
  homeTeamId: integer("home_team_id").references(() => teams.id).notNull(),
  visitorTeamId: integer("visitor_team_id").references(() => teams.id).notNull(),
  homeTeamScore: integer("home_team_score"),
  visitorTeamScore: integer("visitor_team_score"),
  postseason: boolean("postseason").default(false).notNull(),
  isOvertime: boolean("is_overtime").default(false).notNull(),
});

export const playerGameStats = pgTable("player_game_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  opponentTeamId: integer("opponent_team_id").references(() => teams.id).notNull(),
  isHome: boolean("is_home").notNull(),
  min: text("min").notNull(), // e.g., "34:12"
  minutesNumeric: doublePrecision("minutes_numeric").default(0).notNull(),
  pts: integer("pts").default(0).notNull(),
  reb: integer("reb").default(0).notNull(),
  ast: integer("ast").default(0).notNull(),
  fg3m: integer("fg3m").default(0).notNull(),
  blk: integer("blk").default(0).notNull(),
  stl: integer("stl").default(0).notNull(),
  turnover: integer("turnover").default(0).notNull(),
  pf: integer("pf").default(0).notNull(),
  fga: integer("fga").default(0).notNull(),
  fgm: integer("fgm").default(0).notNull(),
  fta: integer("fta").default(0).notNull(),
  ftm: integer("ftm").default(0).notNull(),
  isDnp: boolean("is_dnp").default(false).notNull(),
  lowMinutesFlag: boolean("low_minutes_flag").default(false).notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  source: text("source").default("BALLDONTLIE_API").notNull(),
});

export const analysisSnapshots = pgTable("analysis_snapshots", {
  id: serial("id").primaryKey(),
  snapshotId: text("snapshot_id").notNull().unique(), // e.g. snap_abc123
  playerId: integer("player_id").references(() => players.id).notNull(),
  playerName: text("player_name").notNull(),
  playerTeam: text("player_team").notNull(),
  market: text("market").notNull(), // PTS, REB, AST, 3PM, PRA, etc.
  line: doublePrecision("line").notNull(),
  side: text("side").notNull(), // 'over' | 'under'
  americanOdds: integer("american_odds").notNull(), // e.g. -110, +125
  oppositeOdds: integer("opposite_odds"), // optional opposite side odds
  breakEvenProb: doublePrecision("break_even_prob").notNull(),
  noVigProb: doublePrecision("no_vig_prob"),
  vigPercent: doublePrecision("vig_percent"),
  hitRate: doublePrecision("hit_rate").notNull(),
  hitRateGap: doublePrecision("hit_rate_gap").notNull(),
  sampleSize: integer("sample_size").notNull(),
  wins: integer("wins").notNull(),
  losses: integer("losses").notNull(),
  pushes: integer("pushes").notNull(),
  uncertaintyLower: doublePrecision("uncertainty_lower").notNull(),
  uncertaintyUpper: doublePrecision("uncertainty_upper").notNull(),
  hypotheticalReturn100: doublePrecision("hypothetical_return_100").notNull(),
  historicalStatus: text("historical_status").notNull(), // 'above' | 'inconclusive' | 'below'
  evidenceWindow: text("evidence_window").notNull(), // 'season' | 'last_20' | 'last_10' | 'last_5' | 'vs_opponent' | 'home' | 'away'
  opponentAbbr: text("opponent_abbr"),
  gameEvidence: jsonb("game_evidence"), // snapshot of games analyzed
  source: text("source").default("BALLDONTLIE").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'bug' | 'feature' | 'data_correction' | 'general'
  message: text("message").notNull(),
  userEmail: text("user_email"),
  snapshotId: text("snapshot_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
