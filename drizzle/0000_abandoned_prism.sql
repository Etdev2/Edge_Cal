CREATE TABLE "analysis_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"snapshot_id" text NOT NULL,
	"player_id" integer NOT NULL,
	"player_name" text NOT NULL,
	"player_team" text NOT NULL,
	"market" text NOT NULL,
	"line" double precision NOT NULL,
	"side" text NOT NULL,
	"american_odds" integer NOT NULL,
	"opposite_odds" integer,
	"pricing_mode" text DEFAULT 'sportsbook' NOT NULL,
	"prediction_market_price_cents" integer,
	"prediction_market_commission_pct" double precision,
	"break_even_prob" double precision NOT NULL,
	"no_vig_prob" double precision,
	"vig_percent" double precision,
	"hit_rate" double precision NOT NULL,
	"hit_rate_gap" double precision NOT NULL,
	"sample_size" integer NOT NULL,
	"wins" integer NOT NULL,
	"losses" integer NOT NULL,
	"pushes" integer NOT NULL,
	"uncertainty_lower" double precision NOT NULL,
	"uncertainty_upper" double precision NOT NULL,
	"hypothetical_return_100" double precision NOT NULL,
	"historical_status" text NOT NULL,
	"evidence_window" text NOT NULL,
	"opponent_abbr" text,
	"game_evidence" jsonb,
	"source" text DEFAULT 'BALLDONTLIE' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analysis_snapshots_snapshot_id_unique" UNIQUE("snapshot_id")
);
--> statement-breakpoint
CREATE TABLE "feedback_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"message" text NOT NULL,
	"user_email" text,
	"snapshot_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" integer,
	"game_date" text NOT NULL,
	"season" integer NOT NULL,
	"season_type" text DEFAULT 'regular' NOT NULL,
	"status_state" text DEFAULT 'final' NOT NULL,
	"home_team_id" integer NOT NULL,
	"visitor_team_id" integer NOT NULL,
	"home_team_score" integer,
	"visitor_team_score" integer,
	"postseason" boolean DEFAULT false NOT NULL,
	"is_overtime" boolean DEFAULT false NOT NULL,
	CONSTRAINT "games_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "player_game_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"opponent_team_id" integer NOT NULL,
	"is_home" boolean NOT NULL,
	"min" text NOT NULL,
	"minutes_numeric" double precision DEFAULT 0 NOT NULL,
	"pts" integer DEFAULT 0 NOT NULL,
	"reb" integer DEFAULT 0 NOT NULL,
	"ast" integer DEFAULT 0 NOT NULL,
	"fg3m" integer DEFAULT 0 NOT NULL,
	"blk" integer DEFAULT 0 NOT NULL,
	"stl" integer DEFAULT 0 NOT NULL,
	"turnover" integer DEFAULT 0 NOT NULL,
	"pf" integer DEFAULT 0 NOT NULL,
	"fga" integer DEFAULT 0 NOT NULL,
	"fgm" integer DEFAULT 0 NOT NULL,
	"fta" integer DEFAULT 0 NOT NULL,
	"ftm" integer DEFAULT 0 NOT NULL,
	"is_dnp" boolean DEFAULT false NOT NULL,
	"low_minutes_flag" boolean DEFAULT false NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"source" text DEFAULT 'BALLDONTLIE_API' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" integer,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text NOT NULL,
	"position" text NOT NULL,
	"jersey_number" text,
	"team_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"height" text,
	"weight" text,
	"avatar_url" text,
	CONSTRAINT "players_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" integer,
	"abbreviation" text NOT NULL,
	"city" text NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"conference" text NOT NULL,
	"division" text NOT NULL,
	"primary_color" text DEFAULT '#1d428a',
	"secondary_color" text DEFAULT '#c8102e',
	CONSTRAINT "teams_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "teams_abbreviation_unique" UNIQUE("abbreviation")
);
--> statement-breakpoint
ALTER TABLE "analysis_snapshots" ADD CONSTRAINT "analysis_snapshots_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_visitor_team_id_teams_id_fk" FOREIGN KEY ("visitor_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_game_stats" ADD CONSTRAINT "player_game_stats_opponent_team_id_teams_id_fk" FOREIGN KEY ("opponent_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;