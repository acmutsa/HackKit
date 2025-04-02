import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "db";
import { userCommonData, invites } from "db/schema";
import { eq, and } from "db/drizzle";

const inviteDeclineValidator = z.object({
	teamInviteID: z.string().min(1).max(50),
});

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

	const rawBody = req.json();
	const body = inviteDeclineValidator.safeParse(rawBody);

	if (!body.success) {
		return NextResponse.json({
			success: false,
			message: `Invalid body. Error: ${body.error.message}`,
		});
	}

	// TODO(xander): adjust logic here. null check shouldnt require a join, and invite can be queried directly
	const user = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, userId),
		with: {
			hackerData: {
				with: {
					invites: {
						where: eq(invites.teamID, body.data.teamInviteID),
					},
				},
			},
		},
	});

	if (!user) return NextResponse.json("Unauthorized", { status: 401 });

	// TODO(xander): get invite using body data here to avoid joins above
	await db
		.update(invites)
		.set({
			status: "declined",
		})
		.where(
			and(
				eq(invites.teamID, user.hackerData.invites[0].teamID),
				eq(invites.inviteeID, userId),
			),
		);
}
