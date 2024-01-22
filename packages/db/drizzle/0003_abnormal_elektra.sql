CREATE TABLE IF NOT EXISTS "discord_verification" (
	"code" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"clerk_id" varchar(255),
	"discord_user_id" varchar(255),
	"discord_user_tag" varchar(255),
	"discord_profile_photo" varchar(255),
	"discord_name" varchar(255),
	"status" "status" DEFAULT 'pending' NOT NULL
);
