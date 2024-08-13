-- Rename Tables

ALTER TABLE "users"             RENAME TO "user_common_data"; --> statement-breakpoint
ALTER TABLE "registration_data" RENAME TO "user_hacker_data"; --> statement-breakpoint


-- Rename Columns

ALTER TABLE "user_hacker_data" RENAME COLUMN "short_id"                     TO "school_id";                --> statement-breakpoint
ALTER TABLE "user_hacker_data" RENAME COLUMN "accepted_mlh_code_of_conduct" TO "has_accepted_mlh_coc";     --> statement-breakpoint
ALTER TABLE "user_hacker_data" RENAME COLUMN "shared_data_with_mlh"         TO "has_shared_data_with_mlh"; --> statement-breakpoint
ALTER TABLE "user_hacker_data" RENAME COLUMN "wants_to_receive_mlh_emails"  TO "is_emailable";             --> statement-breakpoint
ALTER TABLE "user_common_data" RENAME COLUMN "registration_complete"        TO "is_fully_registered";      --> statement-breakpoint
ALTER TABLE "user_common_data" RENAME COLUMN "created_at"                   TO "signup_time";              --> statement-breakpoint
ALTER TABLE "user_common_data" RENAME COLUMN "has_searchable_profile"       TO "is_searchable";            --> statement-breakpoint
ALTER TABLE "user_common_data" RENAME COLUMN "rsvp"                         TO "is_rsvped";                --> statement-breakpoint
ALTER TABLE "user_common_data" RENAME COLUMN "approved"                     TO "is_approved";              --> statement-breakpoint


-- Add Moving Column Destinations Without Constraints

ALTER TABLE "user_common_data" ADD COLUMN "age" integer;                    --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "gender" varchar(50);             --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "race" varchar(75);               --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "ethnicity" varchar(50);          --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "shirt_size" varchar(5);          --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "diet_restrictions" json;         --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "accommodation_note" text;        --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "discord" varchar(60);            --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "pronouns" varchar(20);           --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "bio" text;                       --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "skills" json DEFAULT '[]'::json; --> statement-breakpoint
ALTER TABLE "user_common_data" ADD COLUMN "profile_photo" varchar(255);     --> statement-breakpoint

ALTER TABLE "user_hacker_data" ADD COLUMN "group" integer;                  --> statement-breakpoint
ALTER TABLE "user_hacker_data" ADD COLUMN "team_id" varchar(50);            --> statement-breakpoint
ALTER TABLE "user_hacker_data" ADD COLUMN "points" integer DEFAULT 0;       --> statement-breakpoint


-- Transfer Moving Column Data

UPDATE "user_common_data"
SET "age"                = "user_hacker_data"."age",
    "gender"             = "user_hacker_data"."gender",
    "race"               = "user_hacker_data"."race",
    "ethnicity"          = "user_hacker_data"."ethnicity",
    "shirt_size"         = "user_hacker_data"."shirt_size",
    "diet_restrictions"  = "user_hacker_data"."diet_restrictions",
    "accommodation_note" = "user_hacker_data"."accommodation_note"
FROM "user_hacker_data"
WHERE "user_common_data"."clerk_id" = "user_hacker_data"."clerk_id";
--> statement-breakpoint

UPDATE "user_common_data"
SET "discord"            = "profile_data"."discord_username",
    "pronouns"           = "profile_data"."pronouns",
    "bio"                = "profile_data"."bio",
    "skills"             = "profile_data"."skills",
    "profile_photo"      = "profile_data"."profile_photo"
FROM "profile_data"
WHERE "user_common_data"."hacker_tag" = "profile_data"."hacker_tag";
--> statement-breakpoint

UPDATE "user_hacker_data"
SET "group"   = "user_common_data"."group",
    "team_id" = "user_common_data"."team_id",
    "points"  = "user_common_data"."points"
FROM "user_common_data"
WHERE "user_common_data"."clerk_id" = "user_hacker_data"."clerk_id";
--> statement-breakpoint


-- Add Moving Column Constraints

ALTER TABLE "user_common_data" ALTER COLUMN "age"               SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "gender"            SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "race"              SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "ethnicity"         SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "shirt_size"        SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "diet_restrictions" SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "discord"           SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "pronouns"          SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "bio"               SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "skills"            SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "profile_photo"     SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_hacker_data" ALTER COLUMN "group"             SET NOT NULL; --> statement-breakpoint
ALTER TABLE "user_hacker_data" ALTER COLUMN "points"            SET NOT NULL; --> statement-breakpoint


-- Drop Moving Column Sources

ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "age";                --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "gender";             --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "race";               --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "ethnicity";          --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "shirt_size";         --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "diet_restrictions";  --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP COLUMN IF EXISTS "accommodation_note"; --> statement-breakpoint
ALTER TABLE "user_common_data" DROP COLUMN IF EXISTS "group";              --> statement-breakpoint
ALTER TABLE "user_common_data" DROP COLUMN IF EXISTS "team_id";            --> statement-breakpoint
ALTER TABLE "user_common_data" DROP COLUMN IF EXISTS "points";             --> statement-breakpoint
DROP TABLE "profile_data"; --> statement-breakpoint


-- Update Constraints

ALTER TABLE "chats_to_users" DROP CONSTRAINT "chats_to_users_user_id_users_clerk_id_fk";
DO $$ BEGIN
 ALTER TABLE "chats_to_users" ADD CONSTRAINT "chats_to_users_user_id_user_common_data_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_common_data"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

ALTER TABLE "tickets_to_users" DROP CONSTRAINT "tickets_to_users_user_id_users_clerk_id_fk";
DO $$ BEGIN
 ALTER TABLE "tickets_to_users" ADD CONSTRAINT "tickets_to_users_user_id_user_common_data_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_common_data"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

ALTER TABLE "user_common_data" DROP CONSTRAINT "users_email_unique";
ALTER TABLE "user_common_data" ADD CONSTRAINT "user_common_data_email_unique" UNIQUE("email");
--> statement-breakpoint

ALTER TABLE "user_common_data" DROP CONSTRAINT "users_hacker_tag_unique";
ALTER TABLE "user_common_data" ADD CONSTRAINT "user_common_data_hacker_tag_unique" UNIQUE("hacker_tag");
--> statement-breakpoint


-- Drop Deleted Tables, Columns & Constraints

ALTER TABLE "user_common_data" DROP COLUMN IF EXISTS "checked_in";                  --> statement-breakpoint
ALTER TABLE "user_hacker_data" DROP CONSTRAINT "registration_data_clerk_id_unique"; --> statement-breakpoint
