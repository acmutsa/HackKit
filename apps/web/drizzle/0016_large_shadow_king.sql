CREATE TABLE `teams` (
	`id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tag` varchar(50) NOT NULL,
	`photo` varchar(400) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`owner_id` varchar(255) NOT NULL,
	`devpost_url` varchar(255),
	CONSTRAINT `teams_id` PRIMARY KEY(`id`),
	CONSTRAINT `teams_id_unique` UNIQUE(`id`),
	CONSTRAINT `teams_tag_unique` UNIQUE(`tag`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `team_id` varchar(50);