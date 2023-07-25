CREATE TABLE `scans` (
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(255) NOT NULL,
	`event_id` int NOT NULL,
	`count` int NOT NULL,
	CONSTRAINT `scans_event_id_user_id` PRIMARY KEY(`event_id`,`user_id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `checkin_timestamp` timestamp;