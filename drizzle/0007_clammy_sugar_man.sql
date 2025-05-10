ALTER TABLE "weight_history" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "weight_history" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_history" ADD COLUMN "local_created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "packs" ADD COLUMN "local_created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "packs" ADD COLUMN "local_updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "weight_history" ADD CONSTRAINT "weight_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;