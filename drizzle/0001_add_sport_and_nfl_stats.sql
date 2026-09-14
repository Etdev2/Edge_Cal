ALTER TABLE "analysis_snapshots" ADD COLUMN "sport" text DEFAULT 'nba' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "sport" text DEFAULT 'nba' NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "sport" text DEFAULT 'nba' NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "pass_yds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "pass_td" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "pass_int" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "rush_yds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "rush_td" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "rec" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "rec_yds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD COLUMN "rec_td" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "sport" text DEFAULT 'nba' NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "sport" text DEFAULT 'nba' NOT NULL;