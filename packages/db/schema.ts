/*

When changes are made to this file, you must run the following command to create the SQL migrations:

pnpm run generate

more info: https://orm.drizzle.team/kit-docs/overview

*/

import {
	bigserial,
	text,
	varchar,
	uniqueIndex,
	boolean,
	timestamp,
	integer,
	json,
	pgEnum,
	primaryKey,
	pgTable,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roles = pgEnum("role", [
	"hacker",
	"volunteer",
	"mentor",
	"mlh",
	"admin",
	"super_admin",
]);

export const fileTypesEnum = pgEnum("type", ["generic", "resume"]);

export const inviteType = pgEnum("invite_status", [
	"pending",
	"accepted",
	"declined",
]);

export const chatType = pgEnum("chat_type", ["ticket"]);

export const ticketStatus = pgEnum("ticket_status", ["awaiting", "in_progress", "completed"]);

export const discordVerificationStatus = pgEnum("discord_status", [
	"pending",
	"expired",
	"accepted",
	"rejected",
]);

export const users = pgTable("users", {
	clerkID: varchar("clerk_id", { length: 255 })
		.notNull()
		.primaryKey()
		.unique(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	hackerTag: varchar("hacker_tag", { length: 50 }).notNull().unique(),
	registrationComplete: boolean("registration_complete")
		.notNull()
		.default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	hasSearchableProfile: boolean("has_searchable_profile")
		.notNull()
		.default(true),
	group: integer("group").notNull(),
	role: roles("role").notNull().default("hacker"),
	checkinTimestamp: timestamp("checkin_timestamp"),
	teamID: varchar("team_id", { length: 50 }),
	points: integer("points").notNull().default(0),
	checkedIn: boolean("checked_in").notNull().default(false),
	rsvp: boolean("rsvp").notNull().default(false),
});

export const userRelations = relations(users, ({ one, many }) => ({
	registrationData: one(registrationData, {
		fields: [users.clerkID],
		references: [registrationData.clerkID],
	}),
	discordVerification: one(discordVerification, {
		fields: [users.clerkID],
		references: [discordVerification.clerkID],
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

export const registrationData = pgTable("registration_data", {
	clerkID: varchar("clerk_id", { length: 255 })
		.notNull()
		.primaryKey()
		.unique(),
	age: integer("age").notNull(),
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
	hackathonsAttended: integer("hackathons_attended").notNull(),
	softwareExperience: varchar("software_experience", {
		length: 25,
	}).notNull(),
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

export const profileData = pgTable("profile_data", {
	hackerTag: varchar("hacker_tag", { length: 50 })
		.notNull()
		.primaryKey()
		.unique(),
	discordUsername: varchar("discord_username", { length: 60 }).notNull(),
	pronouns: varchar("pronouns", { length: 20 }).notNull(),
	bio: text("bio").notNull(),
	skills: json("skills").notNull().$type<string[]>().default([]),
	profilePhoto: varchar("profile_photo", { length: 255 }).notNull(),
});

export const events = pgTable("events", {
	id: bigserial("id", { mode: "number" }).notNull().primaryKey().unique(),
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

export const files = pgTable("files", {
	id: varchar("id", { length: 255 }).notNull().primaryKey().unique(),
	presignedURL: text("presigned_url").notNull(),
	key: varchar("key", { length: 500 }).notNull().unique(),
	validated: boolean("validated").notNull().default(false),
	type: fileTypesEnum("type").notNull(),
	ownerID: varchar("owner_id", { length: 255 }).notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
	owner: one(users, {
		fields: [files.ownerID],
		references: [users.clerkID],
	}),
}));

export const scans = pgTable(
	"scans",
	{
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		userID: varchar("user_id", { length: 255 }).notNull(),
		eventID: integer("event_id").notNull(),
		count: integer("count").notNull(),
	},
	(table) => ({
		id: primaryKey({ columns: [table.userID, table.eventID] }),
	}),
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

export const teams = pgTable("teams", {
	id: varchar("id", { length: 50 }).notNull().primaryKey().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	tag: varchar("tag", { length: 50 }).notNull().unique(),
	bio: text("bio"),
	photo: varchar("photo", { length: 400 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	ownerID: varchar("owner_id", { length: 255 }).notNull(),
	devpostURL: varchar("devpost_url", { length: 255 }),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
	members: many(users),
	invites: many(invites),
}));

export const invites = pgTable(
	"invites",
	{
		inviteeID: varchar("invitee_id", { length: 255 }).notNull(),
		teamID: varchar("team_id", { length: 50 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		status: inviteType("status").notNull().default("pending"),
	},
	(table) => ({
		id: primaryKey(table.inviteeID, table.teamID),
	}),
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

export const errorLog = pgTable("error_log", {
	id: varchar("id", { length: 50 }).notNull().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	userID: varchar("user_id", { length: 255 }),
	route: varchar("route", { length: 255 }),
	message: text("message").notNull(),
});

export const discordVerification = pgTable("discord_verification", {
	code: varchar("code", { length: 255 }).notNull().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	clerkID: varchar("clerk_id", { length: 255 }),
	discordUserID: varchar("discord_user_id", { length: 255 }).notNull(),
	discordUserTag: varchar("discord_user_tag", { length: 255 }).notNull(),
	discordProfilePhoto: varchar("discord_profile_photo", {
		length: 255,
	}).notNull(),
	discordName: varchar("discord_name", { length: 255 }).notNull(),
	status: discordVerificationStatus("status").notNull().default("pending"),
	guild: varchar("guild", { length: 100 }).notNull(),
});

/* Tickets */

export const tickets = pgTable("tickets", {
	id: text("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	status: ticketStatus("status").notNull().default("awaiting"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticketRelations = relations(tickets, ({ one }) => ({
	chat: one(chats),
}));

export const chats = pgTable("chats", {
	id: text("id").primaryKey(),
	type: chatType("type").notNull(),
	ticketID: text("ticket_id").references(() => tickets.id),
	author: text("author").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatRelations = relations(chats, ({ many }) => ({
	messages: many(chatMessages),
}));

export const chatMessages = pgTable("chat_messages", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	chatID: text("chat_id").notNull(),
	message: text("message").notNull(),
	author: text("author").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessageRelations = relations(chatMessages, ({ one }) => ({
	chat: one(chats, {
		fields: [chatMessages.chatID],
		references: [chats.id],
	}),
}));
