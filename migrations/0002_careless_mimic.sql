CREATE TABLE "accommodation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"arrival_date" timestamp NOT NULL,
	"departure_date" timestamp NOT NULL,
	"arrival_place" text NOT NULL,
	"accommodation_type" text,
	"special_requests" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "abstracts" ADD COLUMN "full_paper_url" text;