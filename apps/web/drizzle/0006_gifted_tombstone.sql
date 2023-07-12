DROP INDEX `hacker_tag_idx` ON `users`;--> statement-breakpoint
DROP INDEX `email_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `events` ADD `hidden` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `profile_data` ADD CONSTRAINT `profile_data_hacker_tag_unique` UNIQUE(`hacker_tag`);--> statement-breakpoint
ALTER TABLE `registration_data` ADD CONSTRAINT `registration_data_clerk_id_unique` UNIQUE(`clerk_id`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_clerk_id_unique` UNIQUE(`clerk_id`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_hacker_tag_unique` UNIQUE(`hacker_tag`);