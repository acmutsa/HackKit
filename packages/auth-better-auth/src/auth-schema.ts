import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
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

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
});

const statements = [
	`CREATE TABLE IF NOT EXISTS "user" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"name" TEXT NOT NULL,
		"email" TEXT NOT NULL UNIQUE,
		"emailVerified" INTEGER NOT NULL,
		"image" TEXT,
		"createdAt" INTEGER NOT NULL,
		"updatedAt" INTEGER NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS "session" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"expiresAt" INTEGER NOT NULL,
		"token" TEXT NOT NULL UNIQUE,
		"createdAt" INTEGER NOT NULL,
		"updatedAt" INTEGER NOT NULL,
		"ipAddress" TEXT,
		"userAgent" TEXT,
		"userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
	)`,
	`CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId")`,
	`CREATE TABLE IF NOT EXISTS "account" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"accountId" TEXT NOT NULL,
		"providerId" TEXT NOT NULL,
		"userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
		"accessToken" TEXT,
		"refreshToken" TEXT,
		"idToken" TEXT,
		"accessTokenExpiresAt" INTEGER,
		"refreshTokenExpiresAt" INTEGER,
		"scope" TEXT,
		"password" TEXT,
		"createdAt" INTEGER NOT NULL,
		"updatedAt" INTEGER NOT NULL
	)`,
	`CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId")`,
	`CREATE TABLE IF NOT EXISTS "verification" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"identifier" TEXT NOT NULL,
		"value" TEXT NOT NULL,
		"expiresAt" INTEGER NOT NULL,
		"createdAt" INTEGER NOT NULL,
		"updatedAt" INTEGER NOT NULL
	)`,
	`CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier")`,
];

export async function syncBetterAuthStorage(database: {
	run: (query: unknown) => Promise<unknown>;
}) {
	for (const statement of statements) {
		await database.run(sql.raw(statement));
	}
}
