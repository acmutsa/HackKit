import { auth } from "@clerk/nextjs";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import { NextResponse } from "next/server";
import { newInviteValidator } from "@/validators/shared/team";
import { BasicServerValidator } from "@/validators/shared/basic";
import { invites } from "db/schema";
import type { serverZodResponse } from "@/lib/utils/server/types";

export async function POST(
	req: Request,
): serverZodResponse<typeof BasicServerValidator> {
	const { userId } = await auth();
	if (!userId) return NextResponse.json("Unauthorized", { status: 401 });
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: { team: true },
	});
	if (!user) return NextResponse.json("Unauthorized", { status: 401 });

	if (!user.teamID || !user.team) {
		return NextResponse.json(
			{
				success: false,
				message:
					"You are not on a team. Join a team to invite members.",
			},
			{ status: 400 },
		);
	}

	if (user.team.ownerID !== userId) {
		return NextResponse.json(
			{
				success: false,
				message: "You are not the owner of this team.",
			},
			{ status: 400 },
		);
	}

	const rawBody = await req.json();
	const body = newInviteValidator.safeParse(rawBody);
	if (!body.success) {
		return NextResponse.json({
			success: false,
			message: `Invalid body. Error: ${body.error.message}`,
		});
	}

	const invitee = await db.query.users.findFirst({
		where: eq(users.hackerTag, body.data.inviteeTag),
		with: {
			team: true,
			invites: {
				where: eq(invites.teamID, user.teamID),
			},
		},
	});

	if (!invitee) {
		return NextResponse.json({
			success: false,
			message: "No user with that tag exists.",
			internalCode: "user_not_found",
		});
	}

	if (invitee.invites.length > 0) {
		return NextResponse.json({
			success: false,
			message: "That user already has an invite.",
			internalCode: "user_already_invited",
		});
	}

	await db.insert(invites).values({
		inviteeID: invitee.clerkID,
		teamID: user.teamID,
	});

	return NextResponse.json({
		success: true,
		message: "Invite sent successfully!",
	});
}

export const runtime = "edge";
