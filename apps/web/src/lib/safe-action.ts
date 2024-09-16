import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs";
import { getUser } from "db/functions";

export const publicAction = createSafeActionClient();

export const adminAction = createSafeActionClient({
	async middleware() {
		const { userId } = auth();
		if (!userId) throw new Error("Unauthorized (No UserID)");

		const user = await getUser(userId);
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
