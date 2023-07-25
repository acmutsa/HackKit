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
	primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
	clerkID: varchar("clerk_id", { length: 255 }).notNull().primaryKey().unique(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	hackerTag: varchar("hacker_tag", { length: 50 }).notNull().unique(),
	registrationComplete: boolean("registration_complete").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	hasSearchableProfile: boolean("has_searchable_profile").notNull().default(true),
	group: int("group").notNull(),
	role: mysqlEnum("role", ["hacker", "volunteer", "mentor", "mlh", "admin", "super_admin"])
		.default("hacker")
		.notNull(),
	checkinTimestamp: timestamp("checkin_timestamp"),
	teamID: varchar("team_id", { length: 50 }),
});

export const userRelations = relations(users, ({ one, many }) => ({
	registrationData: one(registrationData, {
		fields: [users.clerkID],
		references: [registrationData.clerkID],
	}),
	profileData: one(profileData, {
		fields: [users.hackerTag],
		references: [profileData.hackerTag],
	}),
	files: many(files),
	scans: many(scans),
	team: one(teams, {
		fields: [users.teamID],
		references: [teams.id],
	}),
	invites: many(invites),
}));

export const registrationData = mysqlTable("registration_data", {
	clerkID: varchar("clerk_id", { length: 255 }).notNull().primaryKey().unique(),
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
	resume: varchar("resume", { length: 255 })
		.notNull()
		.default("https://static.acmutsa.org/No%20Resume%20Provided.pdf"),
});

export const profileData = mysqlTable("profile_data", {
	hackerTag: varchar("hacker_tag", { length: 50 }).notNull().primaryKey().unique(),
	discordUsername: varchar("discord_username", { length: 60 }).notNull(),
	pronouns: varchar("pronouns", { length: 20 }).notNull(),
	bio: text("bio").notNull(),
	skills: json("skills").notNull(),
	profilePhoto: varchar("profile_photo", { length: 255 }).notNull(),
});

export const events = mysqlTable("events", {
	id: int("id").notNull().primaryKey().autoincrement(),
	title: varchar("name", { length: 255 }).notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	description: text("description").notNull(),
	type: varchar("type", { length: 50 }).notNull(),
	host: varchar("host", { length: 255 }),
	hidden: boolean("hidden").notNull().default(false),
});

export const eventsRelations = relations(events, ({ many }) => ({
	scans: many(scans),
}));

export const files = mysqlTable("files", {
	id: varchar("id", { length: 255 }).notNull().primaryKey().unique(),
	presignedURL: text("presigned_url").notNull(),
	key: varchar("key", { length: 500 }).notNull().unique(),
	validated: boolean("validated").notNull().default(false),
	type: mysqlEnum("type", ["generic", "resume"]).notNull(),
	ownerID: varchar("owner_id", { length: 255 }).notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
	owner: one(users, {
		fields: [files.ownerID],
		references: [users.clerkID],
	}),
}));

export const scans = mysqlTable(
	"scans",
	{
		createdAt: timestamp("created_at").notNull().defaultNow(),
		userID: varchar("user_id", { length: 255 }).notNull(),
		eventID: int("event_id").notNull(),
		count: int("count").notNull(),
	},
	(table) => ({
		id: primaryKey(table.userID, table.eventID),
	})
);

export const scansRelations = relations(scans, ({ one }) => ({
	user: one(users, {
		fields: [scans.userID],
		references: [users.clerkID],
	}),
	event: one(events, {
		fields: [scans.eventID],
		references: [events.id],
	}),
}));

export const teams = mysqlTable("teams", {
	id: varchar("id", { length: 50 }).notNull().primaryKey().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	tag: varchar("tag", { length: 50 }).notNull().unique(),
	photo: varchar("photo", { length: 400 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	ownerID: varchar("owner_id", { length: 255 }).notNull(),
	devpostURL: varchar("devpost_url", { length: 255 }),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
	members: many(users),
	invites: many(invites),
}));

export const invites = mysqlTable(
	"invites",
	{
		inviteeID: varchar("invitee_id", { length: 255 }).notNull(),
		teamID: varchar("team_id", { length: 50 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		status: mysqlEnum("status", ["pending", "accepted", "declined"]).notNull().default("pending"),
	},
	(table) => ({
		id: primaryKey(table.inviteeID, table.teamID),
	})
);

export const invitesRelations = relations(invites, ({ one }) => ({
	invitee: one(users, {
		fields: [invites.inviteeID],
		references: [users.clerkID],
	}),
	team: one(teams, {
		fields: [invites.teamID],
		references: [teams.id],
	}),
}));
