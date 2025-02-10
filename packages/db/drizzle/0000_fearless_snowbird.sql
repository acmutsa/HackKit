DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('generic', 'resume');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'accepted', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('hacker', 'volunteer', 'mentor', 'mlh', 'admin', 'super_admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "error_log" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"route" varchar(255),
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"host" varchar(255),
	"hidden" boolean DEFAULT false NOT NULL,
	"location" varchar(255) DEFAULT 'TBD'
	"points" integer DEFAULT 0 NOT NULL
	CONSTRAINT "events_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"presigned_url" text NOT NULL,
	"key" varchar(500) NOT NULL,
	"validated" boolean DEFAULT false NOT NULL,
	"type" "type" NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	CONSTRAINT "files_id_unique" UNIQUE("id"),
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"invitee_id" varchar(255) NOT NULL,
	"team_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT invites_invitee_id_team_id PRIMARY KEY("invitee_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_data" (
	"hacker_tag" varchar(50) PRIMARY KEY NOT NULL,
	"discord_username" varchar(60) NOT NULL,
	"pronouns" varchar(20) NOT NULL,
	"bio" text NOT NULL,
	"skills" json NOT NULL,
	"profile_photo" varchar(255) NOT NULL,
	CONSTRAINT "profile_data_hacker_tag_unique" UNIQUE("hacker_tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "registration_data" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"gender" varchar(50) NOT NULL,
	"race" varchar(75) NOT NULL,
	"ethnicity" varchar(50) NOT NULL,
	"accepted_mlh_code_of_conduct" boolean NOT NULL,
	"shared_data_with_mlh" boolean NOT NULL,
	"wants_to_receive_mlh_emails" boolean NOT NULL,
	"university" varchar(200) NOT NULL,
	"major" varchar(200) NOT NULL,
	"short_id" varchar(50) NOT NULL,
	"level_of_study" varchar(50) NOT NULL,
	"hackathons_attended" integer NOT NULL,
	"software_experience" varchar(25) NOT NULL,
	"heard_from" varchar(50),
	"shirt_size" varchar(5) NOT NULL,
	"diet_restrictions" json NOT NULL,
	"accommodation_note" text,
	"github" varchar(100),
	"linkedin" varchar(100),
	"personal_website" varchar(100),
	"resume" varchar(255) DEFAULT 'https://static.acmutsa.org/No%20Resume%20Provided.pdf' NOT NULL,
	CONSTRAINT "registration_data_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scans" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"event_id" integer NOT NULL,
	"count" integer NOT NULL,
	CONSTRAINT scans_user_id_event_id PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"tag" varchar(50) NOT NULL,
	"bio" text,
	"photo" varchar(400) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"devpost_url" varchar(255),
	CONSTRAINT "teams_id_unique" UNIQUE("id"),
	CONSTRAINT "teams_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"hacker_tag" varchar(50) NOT NULL,
	"registration_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"has_searchable_profile" boolean DEFAULT true NOT NULL,
	"group" integer NOT NULL,
	"role" "role" DEFAULT 'hacker' NOT NULL,
	"checkin_timestamp" timestamp,
	"team_id" varchar(50),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_hacker_tag_unique" UNIQUE("hacker_tag")
);
