CREATE TABLE `roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL,
	`position` integer NOT NULL,
	`permissions` integer NOT NULL,
	`color` text(7)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_common_data` (
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
	`role_id` integer NOT NULL,
	`checkin_timestamp` integer,
	`is_rsvped` integer DEFAULT false NOT NULL,
	`is_approved` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_common_data`("clerk_id", "first_name", "last_name", "email", "hacker_tag", "age", "gender", "race", "ethnicity", "shirt_size", "diet_restrictions", "accommodation_note", "discord", "pronouns", "bio", "skills", "profile_photo", "phone_number", "country_of_residence", "is_fully_registered", "signup_time", "is_searchable", "role_id", "checkin_timestamp", "is_rsvped", "is_approved") SELECT "clerk_id", "first_name", "last_name", "email", "hacker_tag", "age", "gender", "race", "ethnicity", "shirt_size", "diet_restrictions", "accommodation_note", "discord", "pronouns", "bio", "skills", "profile_photo", "phone_number", "country_of_residence", "is_fully_registered", "signup_time", "is_searchable", "role_id", "checkin_timestamp", "is_rsvped", "is_approved" FROM `user_common_data`;--> statement-breakpoint
DROP TABLE `user_common_data`;--> statement-breakpoint
ALTER TABLE `__new_user_common_data` RENAME TO `user_common_data`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_email_unique` ON `user_common_data` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_common_data_hacker_tag_unique` ON `user_common_data` (`hacker_tag`);