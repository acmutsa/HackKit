import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, teams } from "@/db/schema";
import { newTeamValidator } from "@/validators/shared/team";
import { nanoid } from "nanoid";
import c from "@/hackkit.config";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return new Response("Unauthorized", { status: 401 });
	const user = await db.query.users.findFirst({ where: eq(users.clerkID, userId) });
	if (!user) return new Response("Unauthorized", { status: 401 });
	if (user.teamID) {
		return NextResponse.json({
			success: false,
			message: "You are already on a team. Leave your current team to create a new one.",
		});
	}

	const rawBody = await req.json();
	const body = newTeamValidator.safeParse(rawBody);
	if (!body.success) {
		return NextResponse.json({
			success: false,
			message: body.error.message,
		});
	}

	try {
		await db.insert(teams).values({
			id: nanoid(10),
			name: body.data.name,
			tag: body.data.tag,
			photo: body.data.photo,
			ownerID: userId,
		});

		return NextResponse.json({
			success: true,
			message: body.data.tag,
		});
	} catch (e) {
		return NextResponse.json({
			success: false,
			message: `An error occurred while creating your team. If this is a continuing issue, please reach out to ${c.issueEmail} .Error: ${e}`,
		});
	}
}
