/*

When changes are made to this file, you must run the following command to create the SQL migrations:

pnpm run generate

more info: https://orm.drizzle.team/kit-docs/overview

*/

import {
	bigserial,
	text,
	varchar,
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

export const ticketStatus = pgEnum("ticket_status", [
	"awaiting",
	"in_progress",
	"completed",
]);

export const discordVerificationStatus = pgEnum("discord_status", [
	"pending",
	"expired",
	"accepted",
	"rejected",
]);

export const userCommonData = pgTable("user_common_data", {
	// id
	clerkID: varchar("clerk_id", { length: 255 }).primaryKey(),

	// data
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	hackerTag: varchar("hacker_tag", { length: 50 }).notNull().unique(),
	age: integer("age").notNull(),
	gender: varchar("gender", { length: 50 }).notNull(),
	race: varchar("race", { length: 75 }).notNull(),
	ethnicity: varchar("ethnicity", { length: 50 }).notNull(),
	shirtSize: varchar("shirt_size", { length: 5 }).notNull(),
	dietRestrictions: json("diet_restrictions").notNull(),
	accommodationNote: text("accommodation_note"),
	discord: varchar("discord", { length: 60 }),
	pronouns: varchar("pronouns", { length: 20 }).notNull(),
	bio: text("bio").notNull(),
	skills: json("skills").notNull().$type<string[]>().default([]),
	profilePhoto: varchar("profile_photo", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 30 }).notNull(),
	countryOfResidence: varchar("country_of_residence", {
		length: 3,
	}).notNull(),

	// metadata
	isFullyRegistered: boolean("is_fully_registered").notNull().default(false),
	signupTime: timestamp("signup_time").notNull().defaultNow(),
	isSearchable: boolean("is_searchable").notNull().default(true),
	role: roles("role").notNull().default("hacker"),
	checkinTimestamp: timestamp("checkin_timestamp"),
	isRSVPed: boolean("is_rsvped").notNull().default(false),
	isApproved: boolean("is_approved").notNull().default(false),
});

export const userCommonRelations = relations(
	userCommonData,
	({ one, many }) => ({
		hackerData: one(userHackerData, {
			fields: [userCommonData.clerkID],
			references: [userHackerData.clerkID],
		}),
		discordVerification: one(discordVerification, {
			fields: [userCommonData.clerkID],
			references: [discordVerification.clerkID],
		}),
		files: many(files),
		scans: many(scans),
		tickets: many(ticketsToUsers),
		chats: many(chatsToUsers),
		messages: many(chatMessages),
	}),
);

export const userHackerData = pgTable("user_hacker_data", {
	// id
	clerkID: varchar("clerk_id", { length: 255 }).primaryKey(),

	// data
	university: varchar("university", { length: 200 }).notNull(),
	major: varchar("major", { length: 200 }).notNull(),
	schoolID: varchar("school_id", { length: 50 }).notNull(),
	levelOfStudy: varchar("level_of_study", { length: 50 }).notNull(),
	hackathonsAttended: integer("hackathons_attended").notNull(),
	softwareExperience: varchar("software_experience", {
		length: 25,
	}).notNull(),
	heardFrom: varchar("heard_from", { length: 50 }),
	GitHub: varchar("github", { length: 100 }),
	LinkedIn: varchar("linkedin", { length: 100 }),
	PersonalWebsite: varchar("personal_website", { length: 100 }),
	resume: varchar("resume", { length: 255 })
		.notNull()
		.default("https://static.acmutsa.org/No%20Resume%20Provided.pdf"),

	// metadata
	group: integer("group").notNull(),
	teamID: varchar("team_id", { length: 50 }),
	points: integer("points").notNull().default(0),
	hasAcceptedMLHCoC: boolean("has_accepted_mlh_coc").notNull(),
	hasSharedDataWithMLH: boolean("has_shared_data_with_mlh").notNull(),
	isEmailable: boolean("is_emailable").notNull(),
});

export const userHackerRelations = relations(
	userHackerData,
	({ one, many }) => ({
		commonData: one(userCommonData, {
			fields: [userHackerData.clerkID],
			references: [userCommonData.clerkID],
		}),
		team: one(teams, {
			fields: [userHackerData.teamID],
			references: [teams.id],
		}),
		invites: many(invites),
	}),
);

export const events = pgTable("events", {
	id: bigserial("id", { mode: "number" }).notNull().primaryKey().unique(),
	title: varchar("name", { length: 255 }).notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	location: varchar("location", { length: 255 }).default("TBD"),
	points: integer("points").notNull().default(0),
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
	owner: one(userCommonData, {
		fields: [files.ownerID],
		references: [userCommonData.clerkID],
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
	user: one(userCommonData, {
		fields: [scans.userID],
		references: [userCommonData.clerkID],
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
	members: many(userHackerData),
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
	invitee: one(userHackerData, {
		fields: [invites.inviteeID],
		references: [userHackerData.clerkID],
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

export const ticketRelations = relations(tickets, ({ one, many }) => ({
	chat: one(chats, {
		fields: [tickets.id],
		references: [chats.ticketID],
	}),
	tickets: many(ticketsToUsers),
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
	members: many(chatsToUsers),
}));

export const chatMessages = pgTable("chat_messages", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	chatID: text("chat_id").notNull(),
	message: text("message").notNull(),
	authorID: text("author_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessageRelations = relations(chatMessages, ({ one }) => ({
	chat: one(chats, {
		fields: [chatMessages.chatID],
		references: [chats.id],
	}),
	author: one(userCommonData, {
		fields: [chatMessages.authorID],
		references: [userCommonData.clerkID],
	}),
}));

export const ticketsToUsers = pgTable(
	"tickets_to_users",
	{
		ticketID: text("ticket_id")
			.notNull()
			.references(() => tickets.id),
		userID: text("user_id")
			.notNull()
			.references(() => userCommonData.clerkID),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userID, t.ticketID] }),
	}),
);

export const ticketsToUserRelations = relations(ticketsToUsers, ({ one }) => ({
	ticket: one(tickets, {
		fields: [ticketsToUsers.ticketID],
		references: [tickets.id],
	}),
	user: one(userCommonData, {
		fields: [ticketsToUsers.userID],
		references: [userCommonData.clerkID],
	}),
}));

export const chatsToUsers = pgTable(
	"chats_to_users",
	{
		chatID: text("chat_id")
			.notNull()
			.references(() => chats.id),
		userID: text("user_id")
			.notNull()
			.references(() => userCommonData.clerkID),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userID, t.chatID] }),
	}),
);

export const chatsToUserRelations = relations(chatsToUsers, ({ one }) => ({
	chat: one(chats, {
		fields: [chatsToUsers.chatID],
		references: [chats.id],
	}),
	user: one(userCommonData, {
		fields: [chatsToUsers.userID],
		references: [userCommonData.clerkID],
	}),
}));
