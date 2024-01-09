import { createSafeActionClient } from "next-safe-action";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import { auth } from "@clerk/nextjs";

export const publicAction = createSafeActionClient();

export const adminAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized (No UserID)");
		const user = await db.query.users.findFirst({
			where: eq(users.clerkID, userId),
		});
		if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
			throw new Error("Unauthorized (Not Admin)");
		}

		return { user, userId };
	},
});

export const authenticatedAction = createSafeActionClient({
	// TODO: Add registration check here?
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized");
		// TODO: add check for registration
		return { userId };
	},
});
