"use server";

import { volunteerAction } from "@/lib/safe-action";
import { z } from "zod";
import { db, sql } from "db";
import { scans, userCommonData } from "db/schema";
import { eq, and } from "db/drizzle";

export const createScan = volunteerAction
	.schema(
		z.object({
			eventID: z.number(),
			userID: z.string(),
			creationTime: z.date(),
			countToSet: z.number(),
			alreadyExists: z.boolean(),
		}),
	)
	.action(
		async ({
			parsedInput: {
				eventID,
				userID,
				creationTime,
				countToSet,
				alreadyExists,
			},
			ctx: { user, userId },
		}) => {
			if (alreadyExists) {
				await db
					.update(scans)
					.set({ count: countToSet, updatedAt: creationTime })
					.where(
						and(
							eq(scans.eventID, eventID),
							eq(scans.userID, userID),
						),
					);
			} else {
				await db.insert(scans).values({
					userID: userID,
					updatedAt: creationTime,
					count: 1,
					eventID: eventID,
				});
			}
			return { success: true };
		},
	);

export const getScan = volunteerAction
	.schema(z.object({ eventID: z.number(), userID: z.string() }))
	.action(
		async ({
			parsedInput: { eventID, userID },
			ctx: { user, userId: adminUserID },
		}) => {
			const scan = await db.query.scans.findFirst({
				where: and(
					eq(scans.eventID, eventID),
					eq(scans.userID, userID),
				),
			});
			return scan;
		},
	);

// Schema will be moved over when rewrite of the other scanner happens
const checkInUserSchema = z.object({
	userID: z.string(),
	QRTimestamp: z
		.number()
		.positive()
		.refine((timestamp) => {
			return Date.now() - timestamp < 5 * 60 * 1000;
		}, "QR Code has expired. Please tell user refresh the QR Code"),
});

export const checkInUserToHackathon = volunteerAction
	.schema(checkInUserSchema)
	.action(async ({ parsedInput: { userID } }) => {
		// Set checkinTimestamp
		await db
			.update(userCommonData)
			.set({ checkinTimestamp: sql`(current_timestamp)` })
			.where(eq(userCommonData.clerkID, userID));
	});
