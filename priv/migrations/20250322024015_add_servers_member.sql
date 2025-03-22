CREATE TYPE "public"."server_member_roles" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "server_members" (
	"id" text PRIMARY KEY NOT NULL,
	"server_id" text,
	"user_id" text,
	"role" "server_member_roles" DEFAULT 'member' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'w2a8f7x7nvnj4fa7ld70njks';--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "id" SET DEFAULT 'lnn0e63ihh09qdb6s4559zbx';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'pgbfdjwxyo0cy036ubwnvbeu';--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;