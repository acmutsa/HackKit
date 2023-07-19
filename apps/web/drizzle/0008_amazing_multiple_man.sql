CREATE TABLE `files` (
	`presigned_url` text NOT NULL,
	`key` varchar(500) NOT NULL,
	`validated` boolean NOT NULL DEFAULT false,
	`type` enum('generic','resume') NOT NULL,
	`owner_id` varchar(255) NOT NULL,
	CONSTRAINT `files_key_unique` UNIQUE(`key`)
);
