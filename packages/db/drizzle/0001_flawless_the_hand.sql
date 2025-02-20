DROP INDEX "files_id_unique";--> statement-breakpoint
DROP INDEX "files_key_unique";--> statement-breakpoint
DROP INDEX "teams_id_unique";--> statement-breakpoint
DROP INDEX "teams_tag_unique";--> statement-breakpoint
DROP INDEX "user_common_data_email_unique";--> statement-breakpoint
DROP INDEX "user_common_data_hacker_tag_unique";--> statement-breakpoint
ALTER TABLE `user_common_data` ALTER COLUMN "diet_restrictions" TO "diet_restrictions" text NOT NULL DEFAULT '[]';--> statement-breakpoint
CREATE UNIQUE INDEX `files_id_unique` ON `files` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_key_unique` ON `files` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_id_unique` ON `teams` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_tag_unique` ON `teams` (`tag`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_email_unique` ON `user_common_data` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_hacker_tag_unique` ON `user_common_data` (`hacker_tag`);--> statement-breakpoint
ALTER TABLE `user_common_data` ALTER COLUMN "skills" TO "skills" text NOT NULL DEFAULT '[]';