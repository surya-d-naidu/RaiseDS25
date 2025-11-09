ALTER TABLE "accommodation_requests" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD COLUMN "gender" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture_url" text;