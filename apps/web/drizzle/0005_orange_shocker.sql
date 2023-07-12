CREATE TABLE `events` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(255) NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`description` text,
	`type` varchar(50) NOT NULL,
	`host` varchar(255));
