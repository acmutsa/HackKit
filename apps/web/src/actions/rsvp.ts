"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq } from "db/drizzle";
import { userCommonData } from "db/schema";
import { getUser } from "db/functions";
import { returnValidationErrors } from "next-safe-action";

export const rsvpMyself = authenticatedAction.action(
	async ({ ctx: { user } }) => {
		await db
			.update(userCommonData)
			.set({ isRSVPed: true })
			.where(eq(userCommonData.id, user?.id));
		return { success: true };
	},
);
