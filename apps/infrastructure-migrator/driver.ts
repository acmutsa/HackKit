import { sql } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/vercel-postgres";
import { drizzle } from "drizzle-orm/libsql";
import * as pgSchema from "./schema";
import { createClient } from "@libsql/client";
export * from "drizzle-orm";
import dotenv from "dotenv";
import * as schema from "db/schema";

dotenv.config({
	path: "../../.env",
});

const dbPostgres = pgDrizzle(sql, { schema: pgSchema });

const allUserCommonDataPromise = dbPostgres.query.userCommonData.findMany();
const allUserHackerDataPromise = dbPostgres.query.userHackerData.findMany();
const allEventsPromise = dbPostgres.query.events.findMany();
const allFilesPromise = dbPostgres.query.files.findMany();
const allScansPromise = dbPostgres.query.scans.findMany();
const allTeamsPromise = dbPostgres.query.teams.findMany();
const allInvitesPromise = dbPostgres.query.invites.findMany();
const allErrorLogsPromise = dbPostgres.query.errorLog.findMany();
const alldiscordVerificationPromise =
	dbPostgres.query.discordVerification.findMany();
const allTicketsPromise = dbPostgres.query.tickets.findMany();
const allChatsPromise = dbPostgres.query.chats.findMany();
const allChatMessagesPromise = dbPostgres.query.chatMessages.findMany();
const allTicketsToUsersPromise = dbPostgres.query.ticketsToUsers.findMany();
const allChatsToUsersPromise = dbPostgres.query.chatsToUsers.findMany();

async function migratePostgresSqLite() {
	console.log("Starting Migration 🚀");
	console.log("Fetching Postgres Data 🐘");
	const [
		allUserCommonData,
		allUserHackerData,
		allEvents,
		allFiles,
		allScans,
		allTeams,
		allInvites,
		allErrorLogs,
		alldiscordVerification,
		allTickets,
		allChats,
		allChatMessages,
		allTicketsToUsers,
		allChatsToUsers,
	] = await Promise.all([
		allUserCommonDataPromise,
		allUserHackerDataPromise,
		allEventsPromise,
		allFilesPromise,
		allScansPromise,
		allTeamsPromise,
		allInvitesPromise,
		allErrorLogsPromise,
		alldiscordVerificationPromise,
		allTicketsPromise,
		allChatsPromise,
		allChatMessagesPromise,
		allTicketsToUsersPromise,
		allChatsToUsersPromise,
	]);
	console.log("Postgres data fetched 📦");

	const turso = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});
	const db = drizzle(turso, { schema });

	console.log("Migrating Users 👥");

	if (allUserCommonData.length > 0) {
		///@ts-expect-error
		await db.insert(schema.userCommonData).values(allUserCommonData);
		// run bucket mover updates here
	}

	console.log("Migrated Users ✅");

	console.log("Migrating Hacker Data 🧑‍💻");

	if (allUserHackerData.length > 0) {
		await db.insert(schema.userHackerData).values(allUserHackerData);
	}

	console.log("Migrated Hacker Data ✅");

	console.log("Migrating Events 📅");

	if (allEvents.length > 0) {
		await db.insert(schema.events).values(allEvents);
	}

	console.log("Migrated Events ✅");

	console.log("Migrating Files 📁");

	if (allFiles.length > 0) {
		///@ts-expect-error
		await db.insert(schema.files).values(allFiles);
	}

	console.log("Migrated Files ✅");

	console.log("Migrating Scans 📡");

	if (allScans.length > 0) {
		await db.insert(schema.scans).values(allScans);
	}

	console.log("Migrated Scans ✅");

	console.log("Migrating Teams 🏆");

	if (allTeams.length > 0) {
		await db.insert(schema.teams).values(allTeams);
	}

	console.log("Migrated Teams ✅");

	console.log("Migrating Invites 💌");

	if (allInvites.length > 0) {
		await db.insert(schema.invites).values(allInvites);
	}

	console.log("Migrated Invites ✅");

	console.log("Migrating Error Logs 📝");

	if (allErrorLogs.length > 0) {
		await db.insert(schema.errorLog).values(allErrorLogs);
	}

	console.log("Migrated Error Logs ✅");

	console.log("Migrating Discord Verification 🤖");

	if (alldiscordVerification.length > 0) {
		await db
			.insert(schema.discordVerification)
			.values(alldiscordVerification);
	}

	console.log("Migrated Discord Verification ✅");

	console.log("Migrating Tickets 🎫");

	if (allTickets.length > 0) {
		await db.insert(schema.tickets).values(allTickets);
	}

	console.log("Migrated Tickets ✅");

	console.log("Migrating Chats 💬");

	if (allChats.length > 0) {
		await db.insert(schema.chats).values(allChats);
	}

	console.log("Migrated Chats ✅");

	console.log("Migrating Chat Messages 💬");

	if (allChatMessages.length > 0) {
		await db.insert(schema.chatMessages).values(allChatMessages);
	}

	console.log("Migrated Chat Messages ✅");

	console.log("Migrating Tickets To Users 🎫");

	if (allTicketsToUsers.length > 0) {
		await db.insert(schema.ticketsToUsers).values(allTicketsToUsers);
	}

	console.log("Migrated Tickets To Users ✅");

	console.log("Migrating Chats To Users 💬");

	if (allChatsToUsers.length > 0) {
		await db.insert(schema.chatsToUsers).values(allChatsToUsers);
	}

	console.log("Migrated Chats To Users ✅");

	return process.exit(0);
}

migratePostgresSqLite().catch((e) => {
	console.error(e);
	process.exit(1);
});
