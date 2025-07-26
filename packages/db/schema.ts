/*

When changes are made to this file, you must run the following command to create the SQL migrations:

pnpm run generate

more info: https://orm.drizzle.team/kit-docs/overview

*/

import {
	integer,
	text,
	blob,
	sqliteTable,
	customType,
	primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
	perms,
	discordInviteStatus,
	ticketStatus,
	discordVerificationStatus,
} from "../config/hackkit.config";

export const uuid = customType<{ data: string; notNull: true; default: true }>({
	dataType() {
		return "text";
	},
	toDriver() {
		return nanoid();
	},
});

export const rolesEnum = customType<{
	data: (typeof perms)[number];
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return value;
	},
});

export const fileTypesEnum = customType<{
	data: "resume" | "profilePhoto";
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return value;
	},
});

export const inviteType = customType<{
	data: (typeof discordInviteStatus)[number];
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return value;
	},
});

export const chatType = customType<{
	data: "ticket";
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return value;
	},
});

export const ticketStatusEnum = customType<{
	data: (typeof ticketStatus)[number];
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
});

export const discordVerificationStatusEnum = customType<{
	data: (typeof discordVerificationStatus)[number];
	notNull: true;
	default: true;
}>({
	dataType() {
		return "text";
	},
});

export const userCommonData = sqliteTable("user_common_data", {
	// id
	clerkID: text("clerk_id", { length: 255 }).primaryKey(),

	// data
	firstName: text("first_name", { length: 50 }).notNull(),
	lastName: text("last_name", { length: 50 }).notNull(),
	email: text("email", { length: 255 }).notNull().unique(),
	hackerTag: text("hacker_tag", { length: 50 }).notNull().unique(),
	age: integer("age").notNull(),
	gender: text("gender", { length: 50 }).notNull(),
	race: text("race", { length: 75 }).notNull(),
	ethnicity: text("ethnicity", { length: 50 }).notNull(),
	shirtSize: text("shirt_size", { length: 5 }).notNull(),
	dietRestrictions: text("diet_restrictions", { mode: "json" })
		.notNull()
		.$type<string[]>()
		.default([]),
	accommodationNote: text("accommodation_note"),
	discord: text("discord", { length: 60 }),
	pronouns: text("pronouns", { length: 20 }).notNull(),
	bio: text("bio").notNull(),
	skills: text("skills", { mode: "json" })
		.notNull()
		.$type<string[]>()
		.default([]),
	profilePhoto: text("profile_photo", { length: 255 }).notNull(),
	phoneNumber: text("phone_number", { length: 30 }).notNull(),
	countryOfResidence: text("country_of_residence", {
		length: 3,
	}).notNull(),

	// metadata
	isFullyRegistered: integer("is_fully_registered", { mode: "boolean" })
		.notNull()
		.default(false),
	signupTime: integer("signup_time", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
	isSearchable: integer("is_searchable", { mode: "boolean" })
		.notNull()
		.default(true),
	role: rolesEnum("role").notNull().default("hacker"),
	checkinTimestamp: integer("checkin_timestamp", { mode: "timestamp_ms" }),
	isRSVPed: integer("is_rsvped", { mode: "boolean" })
		.notNull()
		.default(false),
	isApproved: integer("is_approved", { mode: "boolean" })
		.notNull()
		.default(false),
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

export const userHackerData = sqliteTable("user_hacker_data", {
	// id
	clerkID: text("clerk_id", { length: 255 })
		.primaryKey()
		.references(() => userCommonData.clerkID, { onDelete: "cascade" }),

	// data
	university: text("university", { length: 200 }).notNull(),
	major: text("major", { length: 200 }).notNull(),
	schoolID: text("school_id", { length: 50 }).notNull(),
	levelOfStudy: text("level_of_study", { length: 50 }).notNull(),
	hackathonsAttended: integer("hackathons_attended").notNull(),
	softwareExperience: text("software_experience", {
		length: 25,
	}).notNull(),
	heardFrom: text("heard_from", { length: 50 }),
	GitHub: text("github", { length: 100 }),
	LinkedIn: text("linkedin", { length: 100 }),
	PersonalWebsite: text("personal_website", { length: 100 }),
	resume: text("resume", { length: 255 })
		.notNull()
		.default("https://static.acmutsa.org/No%20Resume%20Provided.pdf"),

	// metadata
	group: integer("group").notNull(),
	hasAcceptedMLHCoC: integer("has_accepted_mlh_coc", {
		mode: "boolean",
	}).notNull(),
	hasSharedDataWithMLH: integer("has_shared_data_with_mlh", {
		mode: "boolean",
	}).notNull(),
	isEmailable: integer("is_emailable", { mode: "boolean" }).notNull(),
});

export const userHackerRelations = relations(
	userHackerData,
	({ one, many }) => ({
		commonData: one(userCommonData, {
			fields: [userHackerData.clerkID],
			references: [userCommonData.clerkID],
		}),
	}),
);

export const events = sqliteTable("events", {
	id: integer("id", { mode: "number" }).notNull().primaryKey(),
	title: text("name", { length: 255 }).notNull(),
	startTime: integer("start_time", { mode: "timestamp_ms" }).notNull(),
	endTime: integer("end_time", { mode: "timestamp_ms" }).notNull(),
	location: text("location", { length: 255 }).default("TBD"),
	description: text("description").notNull(),
	type: text("type", { length: 50 }).notNull(),
	host: text("host", { length: 255 }),
	hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
});

export const eventsRelations = relations(events, ({ many }) => ({
	scans: many(scans),
}));

export const files = sqliteTable("files", {
	id: text("id", { length: 255 }).notNull().primaryKey().unique(),
	presignedURL: text("presigned_url").notNull(),
	key: text("key", { length: 500 }).notNull().unique(),
	validated: integer("validated", { mode: "boolean" })
		.notNull()
		.default(false),
	type: fileTypesEnum("type").notNull(),
	ownerID: text("owner_id", { length: 255 }).notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
	owner: one(userCommonData, {
		fields: [files.ownerID],
		references: [userCommonData.clerkID],
	}),
}));

export const scans = sqliteTable(
	"scans",
	{
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(current_timestamp)`),
		userID: text("user_id", { length: 255 }).notNull(),
		eventID: integer("event_id").notNull(),
		count: integer("count").notNull(),
	},
	(table) => [primaryKey({ columns: [table.userID, table.eventID] })],
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

export const errorLog = sqliteTable("error_log", {
	id: text("id", { length: 50 }).notNull().primaryKey(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
	userID: text("user_id", { length: 255 }),
	route: text("route", { length: 255 }),
	message: text("message").notNull(),
});

export const discordVerification = sqliteTable("discord_verification", {
	code: text("code", { length: 255 }).notNull().primaryKey(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
	clerkID: text("clerk_id", { length: 255 }),
	discordUserID: text("discord_user_id", { length: 255 }).notNull(),
	discordUserTag: text("discord_user_tag", { length: 255 }).notNull(),
	discordProfilePhoto: text("discord_profile_photo", {
		length: 255,
	}).notNull(),
	discordName: text("discord_name", { length: 255 }).notNull(),
	status: discordVerificationStatusEnum("status")
		.notNull()
		.default("pending"),
	guild: text("guild", { length: 100 }).notNull(),
});

/* Tickets */

export const tickets = sqliteTable("tickets", {
	id: text("id").primaryKey(),
	title: text("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	status: ticketStatusEnum("status").notNull().default("awaiting"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const ticketRelations = relations(tickets, ({ one, many }) => ({
	chat: one(chats, {
		fields: [tickets.id],
		references: [chats.ticketID],
	}),
	tickets: many(ticketsToUsers),
}));

export const chats = sqliteTable("chats", {
	id: text("id").primaryKey(),
	type: chatType("type").notNull(),
	ticketID: text("ticket_id").references(() => tickets.id),
	author: text("author").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const chatRelations = relations(chats, ({ many }) => ({
	messages: many(chatMessages),
	members: many(chatsToUsers),
}));

export const chatMessages = sqliteTable("chat_messages", {
	id: integer("id", { mode: "number" }).primaryKey(),
	chatID: text("chat_id").notNull(),
	message: text("message").notNull(),
	authorID: text("author_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(current_timestamp)`),
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

export const ticketsToUsers = sqliteTable(
	"tickets_to_users",
	{
		ticketID: text("ticket_id")
			.notNull()
			.references(() => tickets.id),
		userID: text("user_id")
			.notNull()
			.references(() => userCommonData.clerkID),
	},
	(t) => [primaryKey({ columns: [t.userID, t.ticketID] })],
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

export const chatsToUsers = sqliteTable(
	"chats_to_users",
	{
		chatID: text("chat_id")
			.notNull()
			.references(() => chats.id),
		userID: text("user_id")
			.notNull()
			.references(() => userCommonData.clerkID),
	},
	(t) => [primaryKey({ columns: [t.userID, t.chatID] })],
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
