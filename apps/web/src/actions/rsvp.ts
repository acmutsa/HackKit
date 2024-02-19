"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";

export const rsvpMyself = authenticatedAction(z.any(), async (_, { userId }) => {
	const user = await db.query.users.findFirst({ where: eq(users.clerkID, userId) });
	if (!user) throw new Error("User not found");
	await db.update(users).set({ rsvp: true }).where(eq(users.clerkID, userId));
	return { success: true };
});
