import { Request, Response } from "express";
import { db } from "db";
import { eq } from "db/drizzle";
import { discordVerification } from "db/schema";
import { getHacker } from "db/functions";
import c from "config";
import { RequestWithClient } from "../utils/loaders";

export async function handler(req: RequestWithClient, res: Response) {
	const client = req.client;
	try {
		const body = req.body;
		if (!body || typeof body.code !== "string") {
			return res
				.status(400)
				.json({ success: false, error: "missing_code" });
		}

		const verification = await db.query.discordVerification.findFirst({
			where: eq(discordVerification.code, body.code),
		});

		if (!verification || !verification.clerkID) {
			console.log("failed cause of no verification or missing clerkID");
			return res.json({ success: false });
		}

		const user = await getHacker(verification.clerkID);
		if (!user) {
			console.log("failed cause of no user in db");
			return res.json({ success: false });
		}

		const userGroupRoleName = (
			c.groups as Record<string, { discordRole: string }>
		)[Object.keys(c.groups)[user.hackerData.group]].discordRole;

		console.log(userGroupRoleName);

		if (!client) {
			console.error(
				"No client mounted on request in discordVerification handler",
			);
			return res.status(500).json({ success: false });
		}

		const guild = client.guilds.cache.get(verification.guild);
		if (!guild) {
			console.log("failed cause of no guild on interaction");
			return res.json({ success: false });
		}

		const role = guild.roles.cache.find(
			(r: any) => r.name === c.botParticipantRole,
		);
		const userGroupRole = guild.roles.cache.find(
			(r: any) => r.name === userGroupRoleName,
		);

		if (!role || !userGroupRole) {
			console.log(
				"failed cause could not find a role",
				role,
				userGroupRole,
			);
			return res.json({ success: false });
		}

		const member = guild.members.cache.get(verification.discordUserID);
		if (!member) {
			console.log("failed cause could not find member");
			return res.json({ success: false });
		}

		await member.roles.add(role);
		await member.roles.add(userGroupRole);
		await member.setNickname(user.firstName + " " + user.lastName);

		return res.json({ success: true });
	} catch (err) {
		console.error("Error in discord-verification receiver:", err);
		return res.status(500).json({ success: false });
	}
}

export default { handler };
