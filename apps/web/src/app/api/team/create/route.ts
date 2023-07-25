import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

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
}
