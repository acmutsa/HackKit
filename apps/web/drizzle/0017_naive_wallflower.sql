CREATE TABLE `invites` (
	`invitee_id` varchar(255) NOT NULL,
	`team_id` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
	CONSTRAINT `invites_invitee_id_team_id` PRIMARY KEY(`invitee_id`,`team_id`)
);
