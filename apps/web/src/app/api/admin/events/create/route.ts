import { auth } from "@clerk/nextjs";
import { eq } from "db/drizzle";
import { db } from "db";
import { userCommonData, events } from "db/schema";
import { newEventFormSchema } from "@/validators/event";
import { BasicRedirValidator } from "@/validators/shared/basicRedir";
import { NextResponse } from "next/server";
import { z } from "zod";
import superjson from "superjson";
import c from "config";

// Make this a server action
export async function POST(req: Request) {
	const { userId } = auth();

	if (!userId) return new Response("Unauthorized", { status: 401 });

	const reqUserRecord = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, userId),
	});

	if (
		!reqUserRecord ||
		(reqUserRecord.role !== "super_admin" && reqUserRecord.role !== "admin")
	) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = superjson.parse(await req.text());
	const parsedBody = newEventFormSchema.safeParse(body);

	if (!parsedBody.success) {
		return new Response("Malformed request body.", { status: 400 });
	}

	const res = await db
		.insert(events)
		.values({
			title: parsedBody.data.title,
			description: parsedBody.data.description,
			startTime: parsedBody.data.startTime,
			endTime: parsedBody.data.endTime,
			type: parsedBody.data.type,
			host:
				parsedBody.data.host && parsedBody.data.host.length > 0
					? parsedBody.data.host
					: `${c.hackathonName}`,
		})
		.returning();

	return NextResponse.json<z.infer<typeof BasicRedirValidator>>({
		success: true,
		message: "Event created successfully.",
		redirect: `/schedule/${res[0].id}`,
	});
}

export const runtime = "edge";
