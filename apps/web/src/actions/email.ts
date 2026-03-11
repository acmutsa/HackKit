"use server";

import { adminAction } from "@/lib/safe-action";
import { z } from "zod";
import { userHasPermission } from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { db, sql } from "db";
import { userCommonData } from "db/schema";
import { sendExampleEmail } from "@/lib/utils/server/email";

export const sendExampleEmailAction = adminAction
	.schema(z.object({ sendTo: z.enum(["all", "rsvpdOnly", "notRsvpdOnly"]) }))
	.outputSchema(
		z.object({ success: z.boolean(), error: z.string().optional() }),
	)
	.action(async ({ parsedInput: { sendTo }, ctx: { user } }) => {
		if (!userHasPermission(user, PermissionType.SEND_EMAILS)) {
			return {
				success: false,
				error: "You do not have permission to send emails.",
			};
		}

		let emails = await db
			.select({ email: userCommonData.email })
			.from(userCommonData)
			.where(
				sendTo == "rsvpdOnly"
					? sql`${userCommonData.isRSVPed} = 1`
					: sendTo == "notRsvpdOnly"
						? sql`${userCommonData.isRSVPed} = 0`
						: sql`${userCommonData.isRSVPed} = 1`,
			);

		try {
			await Promise.all(
				emails.map(({ email }) => sendExampleEmail(email)),
			);
		} catch (e) {
			console.error(e);
			return { success: false, error: e as string };
		}
		return { success: true };
	});
