"use server";

// TODO: update team /api enpoints to be actions

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { users, teams } from "db/schema";
import { eq } from "db/drizzle";
import { revalidatePath } from "next/cache";

export const leaveTeam = authenticatedAction(z.null(), async (_, { userId }) => {
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			team: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (user.team === null || user.team === undefined) {
		revalidatePath("/dash/team");
		return {
			success: false,
			message: "User is not on a team",
		};
	}

	const result = await db.transaction(async (tx) => {
		await tx.update(users).set({ teamID: null }).where(eq(users.clerkID, userId));
		const team = await tx.query.teams.findFirst({
			where: eq(teams.id, user.team?.id as string), // Added null check for user.team. Converted to string since TS does not realise for some reason that we checked above.
			with: {
				members: true,
			},
		});

		if (!team) {
			revalidatePath("/dash/team");
			return {
				success: false,
				message: "Team not found.",
			};
		}

		if (team.members.length < 1) {
			await tx.delete(teams).where(eq(teams.id, team.id));
			revalidatePath("/dash/team");
			return {
				success: true,
				message: "Team has been left. Team has been deleted since it has no members.",
			};
		}

		if (team.ownerID == userId) {
			await tx.update(teams).set({ ownerID: team.members[0].clerkID }).where(eq(teams.id, team.id));
			revalidatePath("/dash/team");
			return {
				success: true,
				message: `Team has been left. Ownership has been transferred to ${team.members[0].firstName} ${team.members[0].lastName}.`,
			};
		}
		revalidatePath("/dash/team");
		return {
			success: true,
			message: "Team has been left.",
		};
	});

	return result;
});
