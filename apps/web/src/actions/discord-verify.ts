"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { discordVerification } from "db/schema";

export const confirmVerifyDiscord = authenticatedAction(
	z.object({
		code: z.string().min(20).max(20),
	}),
	async ({ code }, { userId }) => {
		const verification = await db.query.discordVerification.findFirst({
			where: and(eq(discordVerification.code, code), eq(discordVerification.status, "pending")),
		});
		if (!verification) {
			return {
				success: false,
			};
		}
		await db
			.update(discordVerification)
			.set({ status: "accepted", clerkID: userId })
			.where(eq(discordVerification.code, code));

		return {
			success: true,
		};
	}
);
