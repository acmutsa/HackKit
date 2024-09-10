CREATE TABLE IF NOT EXISTS "chats_to_users" (
	"chat_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "chats_to_users_user_id_chat_id_pk" PRIMARY KEY("user_id","chat_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets_to_users" (
	"ticket_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "tickets_to_users_user_id_ticket_id_pk" PRIMARY KEY("user_id","ticket_id")
);
--> statement-breakpoint
ALTER TABLE "chat_messages" RENAME COLUMN "author" TO "author_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_to_users" ADD CONSTRAINT "chats_to_users_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_to_users" ADD CONSTRAINT "chats_to_users_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets_to_users" ADD CONSTRAINT "tickets_to_users_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets_to_users" ADD CONSTRAINT "tickets_to_users_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
