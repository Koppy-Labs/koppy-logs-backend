CREATE TABLE "verify_account" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verify_account" ADD CONSTRAINT "verify_account_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;