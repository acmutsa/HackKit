ALTER TABLE `users` ADD `role` enum('hacker','volunteer','mentor','mlh','admin','super_admin') DEFAULT 'hacker';--> statement-breakpoint
ALTER TABLE `registration_data` DROP COLUMN `role`;