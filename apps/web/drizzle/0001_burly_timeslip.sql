ALTER TABLE `registration_data` MODIFY COLUMN `heard_from` varchar(50);--> statement-breakpoint
ALTER TABLE `registration_data` MODIFY COLUMN `accommodation_note` text;--> statement-breakpoint
ALTER TABLE `registration_data` ADD `role` enum('hacker','volunteer','mentor','mlh','admin','super_admin') DEFAULT 'hacker';