"use server";

import { adminAction } from "@/lib/safe-action";
import { z } from "zod";
import { db, sql } from "db";
import { scans, userCommonData } from "db/schema";
import { eq, and } from "db/drizzle";
export const createScan = adminAction(
	z.object({
		eventID: z.number(),
		userID: z.string(),
		creationTime: z.date(),
		countToSet: z.number(),
		alreadyExists: z.boolean(),
	}),
	async (
		{ eventID, userID, creationTime, countToSet, alreadyExists },
		{ user, userId },
	) => {
		if (alreadyExists) {
			await db
				.update(scans)
				.set({ count: countToSet, updatedAt: creationTime })
				.where(
					and(eq(scans.eventID, eventID), eq(scans.userID, userID)),
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

export const getScan = adminAction(
	z.object({ eventID: z.number(), userID: z.string() }),
	async ({ eventID, userID }, { user, userId: adminUserID }) => {
		const scan = await db.query.scans.findFirst({
			where: and(eq(scans.eventID, eventID), eq(scans.userID, userID)),
		});
		return scan;
	},
);

export const checkInUser = adminAction(z.string(), async (user) => {
	// Set checkinTimestamp
	return await db
		.update(userCommonData)
		.set({ checkinTimestamp: sql`now()` })
		.where(eq(userCommonData.clerkID, user));
});
