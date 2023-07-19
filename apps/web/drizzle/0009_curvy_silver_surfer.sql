ALTER TABLE `files` ADD `id` varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_id_unique` UNIQUE(`id`);