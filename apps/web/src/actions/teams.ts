"use server";

// TODO: update team /api endpoints to be actions

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "db";
import { userHackerData, teams, invites } from "db/schema";
import { eq } from "db/drizzle";
import { revalidatePath } from "next/cache";
import { getHacker } from "db/functions";

export const leaveTeam = authenticatedAction(
	z.null(),
	async (_, { userId }) => {
		const user = await getHacker(userId, false);
		if (!user) throw new Error("User not found");

		if (!user.hackerData.teamID) {
			revalidatePath("/dash/team");
			return {
				success: false,
				message: "User is not on a team",
			};
		}

		const result = await db.transaction(async (tx) => {
			await tx
				.update(userHackerData)
				.set({ teamID: null })
				.where(eq(userHackerData.clerkID, user.clerkID));
			const team = await tx.query.teams.findFirst({
				where: eq(teams.id, user.hackerData.teamID as string), // Converted to string since TS does not realise for some reason that we checked above.
				with: {
					members: {
						with: {
							commonData: true,
						},
					},
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
				await tx.delete(invites).where(eq(invites.teamID, team.id));
				revalidatePath("/dash/team");
				return {
					success: true,
					message:
						"Team has been left. Team has been deleted since it has no members.",
				};
			}

			if (team.ownerID == userId) {
				await tx
					.update(teams)
					.set({ ownerID: team.members[0].clerkID })
					.where(eq(teams.id, team.id));
				revalidatePath("/dash/team");
				return {
					success: true,
					message: `Team has been left. Ownership has been transferred to ${team.members[0].commonData.firstName} ${team.members[0].commonData.lastName}.`,
				};
			}
			revalidatePath("/dash/team");
			return {
				success: true,
				message: "Team has been left.",
			};
		});

		return result;
	},
);
