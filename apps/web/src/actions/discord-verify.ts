"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq } from "db/drizzle";
import { discordVerification } from "db/schema";

export const confirmVerifyDiscord = authenticatedAction(
	z.object({
		code: z.string().min(20).max(20),
	}),
	async ({ code }, { userId }) => {
		await db
			.update(discordVerification)
			.set({ status: "accepted" })
			.where(eq(discordVerification.code, code));
		// impliment ping to server to update user roles
	}
);
