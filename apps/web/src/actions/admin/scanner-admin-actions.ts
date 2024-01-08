"use server";

import { adminAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { scans } from "db/schema";
import { eq, and } from "db/drizzle";
export const createScan = adminAction(
	z.object({ eventID: z.number(), userID: z.string(), creationTime: z.date() }),
	async ({ eventID, userID, creationTime }, { user, userId: adminUserID }) => {
		const scan = await db.insert(scans).values({
			userID: userID,
			createdAt: creationTime,
			count: 0,
			eventID: eventID,
		});
	}
);

export const getScan = adminAction(
	z.object({ eventID: z.number(), userID: z.string() }),
	async ({ eventID, userID }, { user, userId: adminUserID }) => {
		const scan = await db.query.scans.findFirst({
			where: and(eq(scans.eventID, eventID), eq(scans.userID, userID)),
		});
		return scan;
	}
);
