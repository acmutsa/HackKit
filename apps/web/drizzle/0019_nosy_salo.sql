CREATE TABLE `error_log` (
	`id` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(255),
	`route` varchar(255),
	`message` text NOT NULL,
	CONSTRAINT `error_log_id` PRIMARY KEY(`id`)
);
