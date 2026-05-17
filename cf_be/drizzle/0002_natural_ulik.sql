ALTER TABLE "problems" ADD COLUMN "solvedCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_title_unique" UNIQUE("title");