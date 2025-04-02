import { serverZodResponse } from "@/lib/utils/server/types";
import { BasicServerValidator } from "@/validators/shared/basic";
import { db } from "db";
import { eq, and } from "db/drizzle";
import { userCommonData, userHackerData, invites, teams } from "db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import c from "config";

const inviteAcceptValidator = z.object({
	teamInviteID: z.string().min(1).max(50),
});

export async function POST(
	req: Request,
): serverZodResponse<typeof BasicServerValidator> {
	const { userId } = await auth();
	if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

	const rawBody = req.json();
	const body = inviteAcceptValidator.safeParse(rawBody);

	if (!body.success) {
		return NextResponse.json({
			success: false,
			message: `Invalid body. Error: ${body.error.message}`,
		});
	}

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

	if (user.hackerData.teamID) {
		return NextResponse.json({
			success: false,
			message: "You are already on a team.",
			internalCode: "already_on_team",
		});
	}

	if (user.hackerData.invites.length === 0) {
		return NextResponse.json({
			success: false,
			message: "You have not been invited to this team.",
			internalCode: "not_invited",
		});
	}

	const team = await db.query.teams.findFirst({
		where: eq(teams.id, user.hackerData.invites[0].teamID),
		with: {
			members: true,
		},
	});

	if (!team) {
		return NextResponse.json({
			success: false,
			message: "Team not found",
			internalCode: "team_not_found",
		});
	}

	if (team.members.length >= c.maxTeamSize) {
		return NextResponse.json({
			success: false,
			message: "Team is full",
			internalCode: "team_full",
		});
	}

	await db
		.update(userHackerData)
		.set({ teamID: user.hackerData.invites[0].teamID })
		.where(eq(userHackerData.clerkID, userId));

	// TODO: would be interesting to see if the and() could be removed here in favor of directly looking up the composite key.
	await db
		.update(invites)
		.set({ status: "accepted" })
		.where(
			and(
				eq(invites.teamID, user.hackerData.invites[0].teamID),
				eq(invites.inviteeID, userId),
			),
		);

	return NextResponse.json({
		success: true,
		message: "Successfully joined team",
		internalCode: "success",
	});
}

export const runtime = "edge";
