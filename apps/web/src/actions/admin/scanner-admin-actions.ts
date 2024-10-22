"use server";

import { adminAction } from "@/lib/safe-action";
import { z } from "zod";
import { db, sql } from "db";
import { scans, userCommonData } from "db/schema";
import { eq, and } from "db/drizzle";
export const createScan = adminAction
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

export const getScan = adminAction
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

export const checkInUserToHackathon = adminAction
	.schema(z.string())
	.action(async ({ parsedInput: user }) => {
		console.log('Made to server. User is: ', user);
		// Set checkinTimestamp
		try{
			await db
			.update(userCommonData)
			.set({ checkinTimestamp: sql`now()` })
			.where(eq(userCommonData.clerkID, user));
		}
		catch(e){
			console.log('Error updating checkinTimestamp: ', e);
			return { success: false, message: 'Error checking in the user!' };
		}
		return { success: true };
	});
