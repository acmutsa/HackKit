"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq } from "db/drizzle";
import { userCommonData } from "db/schema";

export const rsvpMyself = authenticatedAction(
	z.any(),
	async (_, { userId }) => {
		const user = await db.query.userCommonData.findFirst({
			where: eq(userCommonData.clerkID, userId),
		});
		if (!user) throw new Error("User not found");
		await db
			.update(userCommonData)
			.set({ isRSVPed: true })
			.where(eq(userCommonData.clerkID, userId));
		return { success: true };
	},
);
