import {
	createSafeActionClient,
	returnValidationErrors,
} from "next-safe-action";
import { auth } from "@clerk/nextjs";
import { getUser } from "db/functions";
import { z } from "zod";

export const publicAction = createSafeActionClient();

export const authenticatedAction = publicAction.use(
	// TODO: Add registration check here?
	async ({ next, ctx }) => {
		const { userId } = auth();
		if (!userId)
			returnValidationErrors(z.null(), {
				_errors: ["Unauthorized (No User ID)"],
			});
		// TODO: add check for registration
		return next({ ctx: { userId } });
	},
);

export const adminAction = authenticatedAction.use(async ({ next, ctx }) => {
	const user = await getUser(ctx.userId);
	if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
		returnValidationErrors(z.null(), {
			_errors: ["Unauthorized (Not Admin)"],
		});
	}
	return next({ ctx: { user, ...ctx } });
});

export const superAdminAction = authenticatedAction.use(
	async ({ next, ctx }) => {
		const user = await getUser(ctx.userId);
		if (!user || user.role !== "super_admin") {
			returnValidationErrors(z.null(), {
				_errors: ["Unauthorized (Not Super Admin)"],
			});
		}
		return next({ ctx: { user, ...ctx } });
	},
);
