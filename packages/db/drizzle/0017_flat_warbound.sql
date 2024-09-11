ALTER TABLE "user_common_data" ALTER COLUMN "discord" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_common_data" ALTER COLUMN "phone_number" SET DATA TYPE varchar(30);