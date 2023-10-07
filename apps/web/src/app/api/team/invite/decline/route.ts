import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, invites, teams } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			invites: {
				where: eq(invites.teamID, body.data.teamInviteID),
			},
		},
	});

	if (!user) return NextResponse.json("Unauthorized", { status: 401 });

	await db
		.update(invites)
		.set({
			status: "declined",
		})
		.where(and(eq(invites.teamID, user.invites[0].teamID), eq(invites.inviteeID, userId)));
}
