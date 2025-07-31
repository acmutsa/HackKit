import {
	createSafeActionClient,
	returnValidationErrors,
} from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "db/functions";
import { z } from "zod";
import { isUserAdmin } from "./utils/server/admin";

export const publicAction = createSafeActionClient();

export const authenticatedAction = publicAction.use(
	// TODO: Add registration check here?
	async ({ next, ctx }) => {
		const { userId } = await auth();
		if (!userId)
			returnValidationErrors(z.null(), {
				_errors: ["Unauthorized (No User ID)"],
			});
		// TODO: add check for registration
		return next({ ctx: { userId } });
	},
);

export const volunteerAction = authenticatedAction.use(
	async ({ next, ctx }) => {
		const user = await getUser(ctx.userId);
		if (
			!user ||
			!["admin", "super_admin", "volunteer"].includes(user.role)
		) {
			returnValidationErrors(z.null(), {
				_errors: ["Unauthorized (Not Admin)"],
			});
		}
		return next({ ctx: { user, ...ctx } });
	},
);

export const adminAction = authenticatedAction.use(async ({ next, ctx }) => {
	const user = await getUser(ctx.userId);
	if (!user || !isUserAdmin(user)) {
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (Not Admin)"],
		});
	}
	return next({ ctx: { user, ...ctx } });
});
