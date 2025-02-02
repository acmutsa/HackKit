DO $$ BEGIN
 ALTER TABLE "user_hacker_data" ADD CONSTRAINT "user_hacker_data_clerk_id_user_common_data_clerk_id_fk" FOREIGN KEY ("clerk_id") REFERENCES "public"."user_common_data"("clerk_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
