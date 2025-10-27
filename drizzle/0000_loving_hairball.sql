CREATE TYPE "public"."category" AS ENUM('pipeline', 'kpi', 'process', 'enablement', 'deal', 'pricing');--> statement-breakpoint
CREATE TYPE "public"."health" AS ENUM('green', 'yellow', 'red');--> statement-breakpoint
CREATE TYPE "public"."impact_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."playbook_update" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('open', 'in_progress', 'done');--> statement-breakpoint
CREATE TABLE "insights_feed" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"month" varchar(20) NOT NULL,
	"top_learnings" text,
	"top_actions" text,
	"patterns" text,
	"playbook_update_needed" "playbook_update" DEFAULT 'no' NOT NULL,
	"training_need" text,
	"owner" varchar(100),
	"user_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_log" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"weekly_dashboard_id" varchar(64) NOT NULL,
	"category" "category" NOT NULL,
	"observation" text NOT NULL,
	"cause" text,
	"action" text,
	"owner" varchar(100),
	"due_date" timestamp,
	"status" "status" DEFAULT 'open' NOT NULL,
	"impact_level" "impact_level" DEFAULT 'medium' NOT NULL,
	"crm_deal_link" varchar(500),
	"user_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" text,
	"email" varchar(320),
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_signed_in" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "weekly_dashboard" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"week" varchar(20) NOT NULL,
	"date" timestamp NOT NULL,
	"pipeline_coverage" varchar(20),
	"opps_total" varchar(20),
	"proposals" varchar(20),
	"wins" varchar(20),
	"sql_proposal_rate" varchar(20),
	"velocity" varchar(20),
	"overall_health" "health" DEFAULT 'green' NOT NULL,
	"opps_to_move" text,
	"opps_to_push" text,
	"opps_to_close" text,
	"movement_notes" text,
	"owner" varchar(100),
	"next_steps" text,
	"user_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
