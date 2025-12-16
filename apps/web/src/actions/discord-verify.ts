"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { discordVerification } from "db/schema";
import { env } from "@/env";

export const confirmVerifyDiscord = authenticatedAction
	.schema(
		z.object({
			code: z.string().min(20).max(20),
		}),
	)
	.action(async ({ parsedInput: { code }, ctx: { userId } }) => {
		const verification = await db.query.discordVerification.findFirst({
			where: and(
				eq(discordVerification.code, code),
				eq(discordVerification.status, "pending"),
			),
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

		// Call bot receivers endpoint with shared secret header
		const res = await fetch(`${env.BOT_API_URL}/discord-verification`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shared-Secret": env.SHARED_SECRET,
			},
			body: JSON.stringify({ code }),
		});
		let resJson = {};
		try {
			resJson = await res.json();
			console.log(resJson);
		} catch (e) {
			console.warn("discord receiver returned no JSON", e);
		}

		return {
			success: true,
		};
	});
