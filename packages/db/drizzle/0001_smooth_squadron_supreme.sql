-- Drop old stuff (safe if they don't exist)
DROP TABLE IF EXISTS `invites`;
DROP TABLE IF EXISTS `teams`;

-- Remove the old column from user_hacker_data (SQLite ≥ 3.35 supports DROP COLUMN)
ALTER TABLE `user_hacker_data` DROP COLUMN `team_id`;

-- Create the final banned_users table in its desired shape
CREATE TABLE `banned_users` (
  `id`          INTEGER PRIMARY KEY NOT NULL,
  `user_id`     TEXT(255) NOT NULL,
  `reason`      TEXT,
  `created_at`  INTEGER DEFAULT (current_timestamp) NOT NULL,
  `banned_by_id` TEXT(255) NOT NULL,
  FOREIGN KEY (`user_id`)
    REFERENCES `user_common_data`(`clerk_id`)
    ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (`banned_by_id`)
    REFERENCES `user_common_data`(`clerk_id`)
    ON UPDATE NO ACTION ON DELETE CASCADE
);