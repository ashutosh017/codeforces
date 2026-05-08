CREATE TYPE "public"."submission_status" AS ENUM('PENDING', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'SKIPPED');--> statement-breakpoint
CREATE TABLE "contest_participants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contest_participants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"contest_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"rank" integer,
	"rating_change" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "problems_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"input_description" text,
	"output_description" text,
	"difficulty" integer NOT NULL,
	"time_limit" integer DEFAULT 1000 NOT NULL,
	"memory_limit" integer DEFAULT 256 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"contest_id" integer,
	"language" varchar(50) NOT NULL,
	"code" text NOT NULL,
	"status" "submission_status" DEFAULT 'PENDING' NOT NULL,
	"execution_time" integer,
	"memory_used" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"rank" varchar(50) DEFAULT 'Newbie' NOT NULL,
	"bio" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contest_participants" ADD CONSTRAINT "contest_participants_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_participants" ADD CONSTRAINT "contest_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;