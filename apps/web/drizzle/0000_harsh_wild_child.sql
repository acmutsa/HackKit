CREATE TABLE `profile_data` (
	`hacker_tag` varchar(50) NOT NULL,
	`discord_username` varchar(60) NOT NULL,
	`pronouns` varchar(20) NOT NULL,
	`bio` text NOT NULL,
	`skills` json NOT NULL,
	`profile_photo` varchar(255) NOT NULL);
--> statement-breakpoint
CREATE TABLE `registration_data` (
	`clerk_id` varchar(255) PRIMARY KEY NOT NULL,
	`age` int NOT NULL,
	`gender` varchar(50) NOT NULL,
	`accepted_mlh_code_of_conduct` boolean NOT NULL,
	`shared_data_with_mlh` boolean NOT NULL,
	`wants_to_receive_mlh_emails` boolean NOT NULL,
	`university` varchar(200) NOT NULL,
	`major` varchar(200) NOT NULL,
	`short_id` varchar(50) NOT NULL,
	`level_of_study` varchar(50) NOT NULL,
	`hackathons_attended` int NOT NULL,
	`software_experience` varchar(25) NOT NULL,
	`heard_from` varchar(50) NOT NULL,
	`shirt_size` varchar(5) NOT NULL,
	`diet_restrictions` json NOT NULL,
	`accommodation_note` text NOT NULL,
	`github` varchar(100),
	`linkedin` varchar(100),
	`personal_website` varchar(100));
--> statement-breakpoint
CREATE TABLE `users` (
	`clerk_id` varchar(255) PRIMARY KEY NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`hacker_tag` varchar(50) NOT NULL,
	`registration_complete` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`has_searchable_profile` boolean NOT NULL DEFAULT true,
	`group` int NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `hacker_tag_idx` ON `users` (`hacker_tag`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);