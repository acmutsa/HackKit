DO $$ BEGIN
 CREATE TYPE "discord_status" AS ENUM('pending', 'expired', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invite_status" AS ENUM('pending', 'accepted', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "discord_verification" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "discord_verification" ALTER COLUMN "status" SET DATA TYPE discord_status USING "status"::text::discord_status;--> statement-breakpoint
ALTER TABLE "discord_verification" ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "invites" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "invites" ALTER COLUMN "status" SET DATA TYPE invite_status USING "status"::text::invite_status;
ALTER TABLE "invites" ALTER COLUMN "status" SET DEFAULT 'pending';