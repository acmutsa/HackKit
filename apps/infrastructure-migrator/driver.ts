import { sql } from "@vercel/postgres";
import { drizzle as pgDrizzle } from "drizzle-orm/vercel-postgres";
import { drizzle } from "drizzle-orm/libsql";
import * as pgSchema from "./schema";
import { createClient } from "@libsql/client";
export * from "drizzle-orm";
import dotenv from "dotenv";
import * as schema from "db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import c, { staticUploads } from "config";
import { eq } from "drizzle-orm";

dotenv.config({
	path: "../../.env",
});

export const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const dbPostgres = pgDrizzle(sql, { schema: pgSchema });

const allUserCommonDataPromise = dbPostgres.query.userCommonData.findMany();
const allUserHackerDataPromise = dbPostgres.query.userHackerData.findMany();
const allEventsPromise = dbPostgres.query.events.findMany();
const allFilesPromise = dbPostgres.query.files.findMany();
const allScansPromise = dbPostgres.query.scans.findMany();
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
	const turso = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});
	const db = drizzle(turso, { schema });

	const [
		allUserCommonData,
		allUserHackerData,
		allEvents,
		allFiles,
		allScans,
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
		allErrorLogsPromise,
		alldiscordVerificationPromise,
		allTicketsPromise,
		allChatsPromise,
		allChatMessagesPromise,
		allTicketsToUsersPromise,
		allChatsToUsersPromise,
	]);
	console.log("Postgres data fetched 📦");

	console.log("Migrating Users 👥");

	if (allUserCommonData.length > 0) {
		///@ts-expect-error
		await db.insert(schema.userCommonData).values(allUserCommonData);
		// run bucket mover updates here
	}

	console.log("Migrated Users ✅\n\n");

	console.log("Migrating Hacker Data 🧑‍💻");

	if (allUserHackerData.length > 0) {
		// we need to filter our data to ensure that we do not have any repeating clerkIDs
		const filteredHackerData = allUserHackerData.filter(
			(value, index, self) =>
				self.findIndex((t) => t.clerkID === value.clerkID) === index &&
				allUserCommonData.find((t) => t.clerkID === value.clerkID) !=
					null,
		);
		await db.insert(schema.userHackerData).values(filteredHackerData);
	}

	console.log("Migrated Hacker Data ✅\n\n");

	console.log("Migrating Events 📅");

	if (allEvents.length > 0) {
		await db.insert(schema.events).values(allEvents);
	}

	console.log("Migrated Events ✅\n\n");

	console.log("Migrating Files 📁");

	if (allFiles.length > 0) {
		///@ts-expect-error
		await db.insert(schema.files).values(allFiles);
	}

	console.log("Migrated Files ✅\n\n");

	console.log("Migrating Scans 📡");

	if (allScans.length > 0) {
		await db.insert(schema.scans).values(allScans);
	}

	console.log("Migrated Scans ✅\n\n");

	console.log("Migrating Error Logs 📝");

	if (allErrorLogs.length > 0) {
		await db.insert(schema.errorLog).values(allErrorLogs);
	}

	console.log("Migrated Error Logs ✅\n\n");

	console.log("Migrating Discord Verification 🤖");

	if (alldiscordVerification.length > 0) {
		await db
			.insert(schema.discordVerification)
			.values(alldiscordVerification);
	}

	console.log("Migrated Discord Verification ✅\n\n");

	console.log("Migrating Tickets 🎫");

	if (allTickets.length > 0) {
		await db.insert(schema.tickets).values(allTickets);
	}

	console.log("Migrated Tickets ✅\n\n");

	console.log("Migrating Chats 💬");

	if (allChats.length > 0) {
		await db.insert(schema.chats).values(allChats);
	}

	console.log("Migrated Chats ✅\n\n");

	console.log("Migrating Chat Messages 💬");

	if (allChatMessages.length > 0) {
		await db.insert(schema.chatMessages).values(allChatMessages);
	}

	console.log("Migrated Chat Messages ✅\n\n");

	console.log("Migrating Tickets To Users 🎫");

	if (allTicketsToUsers.length > 0) {
		await db.insert(schema.ticketsToUsers).values(allTicketsToUsers);
	}

	console.log("Migrated Tickets To Users ✅\n\n");

	console.log("Migrating Chats To Users 💬");

	if (allChatsToUsers.length > 0) {
		await db.insert(schema.chatsToUsers).values(allChatsToUsers);
	}

	console.log("Migrated Chats To Users ✅\n\n");

	console.log("Migrating Vercel Blob Files To R2");

	const resumeData = await db.query.userHackerData.findMany({
		columns: { resume: true, clerkID: true },
	});

	for (let resumeEntry of resumeData) {
		const { resume: resumeUrlAsString, clerkID: userID } = resumeEntry;
		if (
			!resumeUrlAsString.length ||
			resumeUrlAsString === c.noResumeProvidedURL ||
			resumeUrlAsString.startsWith("/api")
		)
			continue;

		const resumeUrl = new URL(resumeUrlAsString);
		const resumeFetchResponse = await fetch(resumeUrl);

		if (!resumeFetchResponse.ok) {
			console.log("resume fetch failed");
		}
		const resumeBlob = await resumeFetchResponse.blob();

		let key = decodeURIComponent(resumeUrl.pathname);
		// if the first character is a slash, remove it
		if (key.charAt(0) === "/") {
			key = key.slice(1);
		}

		const buffer = await resumeBlob.arrayBuffer();

		const cmd = new PutObjectCommand({
			Key: key,
			Bucket: staticUploads.bucketName,
			ContentType: "application/pdf",
			///@ts-expect-error
			Body: buffer,
		});

		await S3.send(cmd);

		// New url to correspond to an api route
		const newResumeUrl = `/api/upload/resume/view?key=${key}`;

		await db
			.update(schema.userHackerData)
			.set({ resume: newResumeUrl.toString() })
			.where(eq(schema.userHackerData.clerkID, userID));
	}

	console.log("Migrated Vercel Blob Files To R2");

	return process.exit(0);
}

migratePostgresSqLite().catch((e) => {
	console.error(e);
	process.exit(1);
});
