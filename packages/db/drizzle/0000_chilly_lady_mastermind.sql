CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`message` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`ticket_id` text,
	`author` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chats_to_users` (
	`chat_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `chat_id`),
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user_common_data`(`clerk_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `discord_verification` (
	`code` text(255) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`clerk_id` text(255),
	`discord_user_id` text(255) NOT NULL,
	`discord_user_tag` text(255) NOT NULL,
	`discord_profile_photo` text(255) NOT NULL,
	`discord_name` text(255) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`guild` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `error_log` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` text(255),
	`route` text(255),
	`message` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`location` text(255) DEFAULT 'TBD',
	`points` integer DEFAULT 0 NOT NULL,
	`description` text NOT NULL,
	`type` text(50) NOT NULL,
	`host` text(255),
	`hidden` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`presigned_url` text NOT NULL,
	`key` text(500) NOT NULL,
	`validated` integer DEFAULT false NOT NULL,
	`type` text NOT NULL,
	`owner_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_id_unique` ON `files` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_key_unique` ON `files` (`key`);--> statement-breakpoint
CREATE TABLE `invites` (
	`invitee_id` text(255) NOT NULL,
	`team_id` text(50) NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	PRIMARY KEY(`invitee_id`, `team_id`)
);
--> statement-breakpoint
CREATE TABLE `scans` (
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` text(255) NOT NULL,
	`event_id` integer NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`user_id`, `event_id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`tag` text(50) NOT NULL,
	`bio` text,
	`photo` text(400) NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL,
	`owner_id` text(255) NOT NULL,
	`devpost_url` text(255)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_id_unique` ON `teams` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_tag_unique` ON `teams` (`tag`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'awaiting' NOT NULL,
	`created_at` integer DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets_to_users` (
	`ticket_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `ticket_id`),
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user_common_data`(`clerk_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_common_data` (
	`clerk_id` text(255) PRIMARY KEY NOT NULL,
	`first_name` text(50) NOT NULL,
	`last_name` text(50) NOT NULL,
	`email` text(255) NOT NULL,
	`hacker_tag` text(50) NOT NULL,
	`age` integer NOT NULL,
	`gender` text(50) NOT NULL,
	`race` text(75) NOT NULL,
	`ethnicity` text(50) NOT NULL,
	`shirt_size` text(5) NOT NULL,
	`diet_restrictions` text DEFAULT '[]' NOT NULL,
	`accommodation_note` text,
	`discord` text(60),
	`pronouns` text(20) NOT NULL,
	`bio` text NOT NULL,
	`skills` text DEFAULT '[]' NOT NULL,
	`profile_photo` text(255) NOT NULL,
	`phone_number` text(30) NOT NULL,
	`country_of_residence` text(3) NOT NULL,
	`is_fully_registered` integer DEFAULT false NOT NULL,
	`signup_time` integer DEFAULT (current_timestamp) NOT NULL,
	`is_searchable` integer DEFAULT true NOT NULL,
	`role` text DEFAULT 'hacker' NOT NULL,
	`checkin_timestamp` integer,
	`is_rsvped` integer DEFAULT false NOT NULL,
	`is_approved` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_email_unique` ON `user_common_data` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_hacker_tag_unique` ON `user_common_data` (`hacker_tag`);--> statement-breakpoint
CREATE TABLE `user_hacker_data` (
	`clerk_id` text(255) PRIMARY KEY NOT NULL,
	`university` text(200) NOT NULL,
	`major` text(200) NOT NULL,
	`school_id` text(50) NOT NULL,
	`level_of_study` text(50) NOT NULL,
	`hackathons_attended` integer NOT NULL,
	`software_experience` text(25) NOT NULL,
	`heard_from` text(50),
	`github` text(100),
	`linkedin` text(100),
	`personal_website` text(100),
	`resume` text(255) DEFAULT 'https://static.acmutsa.org/No%20Resume%20Provided.pdf' NOT NULL,
	`group` integer NOT NULL,
	`team_id` text(50),
	`points` integer DEFAULT 0 NOT NULL,
	`has_accepted_mlh_coc` integer NOT NULL,
	`has_shared_data_with_mlh` integer NOT NULL,
	`is_emailable` integer NOT NULL,
	FOREIGN KEY (`clerk_id`) REFERENCES `user_common_data`(`clerk_id`) ON UPDATE no action ON DELETE cascade
);
