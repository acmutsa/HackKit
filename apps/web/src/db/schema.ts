/*

When changes are made to this file, you must run the following command to create the SQL migrations:

pnpm run generate

more info: https://orm.drizzle.team/kit-docs/overview

*/

import {
	mysqlTable,
	text,
	varchar,
	uniqueIndex,
	boolean,
	timestamp,
	int,
	json,
	mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable(
	"users",
	{
		clerkID: varchar("clerk_id", { length: 255 }).notNull().primaryKey(),
		firstName: varchar("first_name", { length: 50 }).notNull(),
		lastName: varchar("last_name", { length: 50 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		hackerTag: varchar("hacker_tag", { length: 50 }).notNull(),
		registrationComplete: boolean("registration_complete").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		hasSearchableProfile: boolean("has_searchable_profile").notNull().default(true),
		group: int("group").notNull(),
		role: mysqlEnum("role", [
			"hacker",
			"volunteer",
			"mentor",
			"mlh",
			"admin",
			"super_admin",
		]).default("hacker"),
	},
	(table) => {
		return {
			hackerTagIdx: uniqueIndex("hacker_tag_idx").on(table.hackerTag),
			emailIdx: uniqueIndex("email_idx").on(table.email),
		};
	}
);

export const userRelations = relations(users, ({ one }) => ({
	registrationData: one(registrationData, {
		fields: [users.clerkID],
		references: [registrationData.clerkID],
	}),
	profileData: one(profileData, {
		fields: [users.hackerTag],
		references: [profileData.hackerTag],
	}),
}));

export const registrationData = mysqlTable("registration_data", {
	clerkID: varchar("clerk_id", { length: 255 }).notNull().primaryKey(),
	age: int("age").notNull(),
	gender: varchar("gender", { length: 50 }).notNull(),
	race: varchar("race", { length: 75 }).notNull(),
	ethnicity: varchar("ethnicity", { length: 50 }).notNull(),
	acceptedMLHCodeOfConduct: boolean("accepted_mlh_code_of_conduct").notNull(),
	sharedDataWithMLH: boolean("shared_data_with_mlh").notNull(),
	wantsToReceiveMLHEmails: boolean("wants_to_receive_mlh_emails").notNull(),
	university: varchar("university", { length: 200 }).notNull(),
	major: varchar("major", { length: 200 }).notNull(),
	shortID: varchar("short_id", { length: 50 }).notNull(),
	levelOfStudy: varchar("level_of_study", { length: 50 }).notNull(),
	hackathonsAttended: int("hackathons_attended").notNull(),
	softwareExperience: varchar("software_experience", { length: 25 }).notNull(),
	heardFrom: varchar("heard_from", { length: 50 }),
	shirtSize: varchar("shirt_size", { length: 5 }).notNull(),
	dietRestrictions: json("diet_restrictions").notNull(),
	accommodationNote: text("accommodation_note"),
	GitHub: varchar("github", { length: 100 }),
	LinkedIn: varchar("linkedin", { length: 100 }),
	PersonalWebsite: varchar("personal_website", { length: 100 }),
});

export const profileData = mysqlTable("profile_data", {
	hackerTag: varchar("hacker_tag", { length: 50 }).notNull().primaryKey(),
	discordUsername: varchar("discord_username", { length: 60 }).notNull(),
	pronouns: varchar("pronouns", { length: 20 }).notNull(),
	bio: text("bio").notNull(),
	skills: json("skills").notNull(),
	profilePhoto: varchar("profile_photo", { length: 255 }).notNull(),
});

export const events = mysqlTable("events", {
	id: int("id").notNull().primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	description: text("description"),
	type: varchar("type", { length: 50 }).notNull(),
	host: varchar("host", { length: 255 }),
});
