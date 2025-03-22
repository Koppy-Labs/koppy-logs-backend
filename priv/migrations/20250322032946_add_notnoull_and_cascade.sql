ALTER TABLE "server_members" DROP CONSTRAINT "server_members_server_id_servers_id_fk";
--> statement-breakpoint
ALTER TABLE "server_members" DROP CONSTRAINT "server_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT 'ck40b9m76qd0dmxfvweuobw2';--> statement-breakpoint
ALTER TABLE "servers" ALTER COLUMN "id" SET DEFAULT 'fhzftituwdxetg6kw47rg23j';--> statement-breakpoint
ALTER TABLE "server_members" ALTER COLUMN "server_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "server_members" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT 'kzdesi6kyg3rccat7y1xs6oy';--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;