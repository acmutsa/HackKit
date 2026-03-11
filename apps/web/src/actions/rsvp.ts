"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq } from "db/drizzle";
import { userCommonData } from "db/schema";
import { getUser } from "db/functions";
import { returnValidationErrors } from "next-safe-action";
import { sendRSVPConfirmationEmail } from "@/lib/utils/server/email";

export const rsvpMyself = authenticatedAction.action(
	async ({ ctx: { userId } }) => {
		const user = await getUser(userId);
		if (!user)
			returnValidationErrors(z.null(), { _errors: ["User not found"] });

		const [{ email }] = await db
			.update(userCommonData)
			.set({ isRSVPed: true })
			.where(eq(userCommonData.clerkID, userId))
			.returning({ email: userCommonData.email });

		await sendRSVPConfirmationEmail(email);
		return { success: true };
	},
);
