import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const authUser = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const authSession = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => authUser.id, { onDelete: "cascade" }),
});

export const authAccount = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => authUser.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", {
		mode: "timestamp_ms",
	}),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
		mode: "timestamp_ms",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const authVerification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const coreRole = sqliteTable("core_role", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull().unique(),
	position: integer("position").notNull(),
	permissions: text("permissions", { mode: "json" }).notNull(),
	color: text("color"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const coreUser = sqliteTable("core_user", {
	authId: text("authId").primaryKey().notNull(),
	email: text("email").notNull().unique(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	profilePhotoUrl: text("profilePhotoUrl"),
	hackTag: text("hackTag").unique(),
	roleId: text("roleId").references(() => coreRole.id, { onDelete: "set null" }),
	isApproved: integer("isApproved", { mode: "boolean" }).notNull(),
	checkedInAt: integer("checkedInAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const coreUserData = sqliteTable("core_userData", {
	authId: text("authId")
		.primaryKey()
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	age: integer("age").notNull(),
	gender: text("gender").notNull(),
	race: text("race").notNull(),
	ethnicity: text("ethnicity").notNull(),
	shirtSize: text("shirtSize").notNull(),
	dietaryRestrictions: text("dietaryRestrictions", { mode: "json" }).notNull(),
	accommodationNote: text("accommodationNote"),
	phoneNumber: text("phoneNumber"),
	countryOfResidence: text("countryOfResidence"),
	hasAcceptedMLHCodeOfConduct: integer("hasAcceptedMLHCodeOfConduct", {
		mode: "boolean",
	}).notNull(),
	hasSharedDataWithMLH: integer("hasSharedDataWithMLH", {
		mode: "boolean",
	}).notNull(),
	isEmailable: integer("isEmailable", { mode: "boolean" }).notNull(),
	completedAt: integer("completedAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const coreHacker = sqliteTable("core_hacker", {
	authId: text("authId")
		.primaryKey()
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	university: text("university").notNull(),
	major: text("major").notNull(),
	schoolId: text("schoolId"),
	levelOfStudy: text("levelOfStudy").notNull(),
	hackathonsAttended: integer("hackathonsAttended").notNull(),
	softwareExperience: text("softwareExperience").notNull(),
	heardFrom: text("heardFrom"),
	githubUrl: text("githubUrl"),
	linkedInUrl: text("linkedInUrl"),
	personalWebsiteUrl: text("personalWebsiteUrl"),
	resumeUrl: text("resumeUrl"),
	group: text("group"),
	registeredAt: integer("registeredAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const coreUserBan = sqliteTable("core_userBan", {
	authId: text("authId")
		.primaryKey()
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	reason: text("reason"),
	bannedByAuthId: text("bannedByAuthId")
		.notNull()
		.references(() => coreUser.authId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const coreEvent = sqliteTable("core_event", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	startTime: integer("startTime", { mode: "timestamp" }).notNull(),
	endTime: integer("endTime", { mode: "timestamp" }).notNull(),
	location: text("location").notNull(),
	description: text("description").notNull(),
	type: text("type").notNull(),
	host: text("host"),
	hidden: integer("hidden", { mode: "boolean" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const coreSetting = sqliteTable("core_setting", {
	key: text("key").primaryKey().notNull(),
	value: text("value", { mode: "json" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	createdByAuthId: text("createdByAuthId").references(() => coreUser.authId, {
		onDelete: "set null",
	}),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	updatedByAuthId: text("updatedByAuthId").references(() => coreUser.authId, {
		onDelete: "set null",
	}),
});

export const coreEventScan = sqliteTable("core_eventScan", {
	id: text("id").primaryKey().notNull(),
	eventId: text("eventId")
		.notNull()
		.references(() => coreEvent.id, { onDelete: "cascade" }),
	authId: text("authId")
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	scannedByAuthId: text("scannedByAuthId")
		.notNull()
		.references(() => coreUser.authId),
	scannedAt: integer("scannedAt", { mode: "timestamp" }).notNull(),
});

export const teamsTeam = sqliteTable("teams_team", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	tag: text("tag").notNull().unique(),
	ownerAuthId: text("ownerAuthId")
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const teamsMember = sqliteTable("teams_member", {
	id: text("id").primaryKey().notNull(),
	teamId: text("teamId")
		.notNull()
		.references(() => teamsTeam.id, { onDelete: "cascade" }),
	authId: text("authId")
		.notNull()
		.unique()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	joinedAt: integer("joinedAt", { mode: "timestamp" }).notNull(),
});

export const teamsInvite = sqliteTable("teams_invite", {
	id: text("id").primaryKey().notNull(),
	teamId: text("teamId")
		.notNull()
		.references(() => teamsTeam.id, { onDelete: "cascade" }),
	inviteeAuthId: text("inviteeAuthId")
		.notNull()
		.references(() => coreUser.authId, { onDelete: "cascade" }),
	status: text("status").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
