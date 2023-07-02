import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST() {
	const user = await currentUser();
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}
	return NextResponse.json({});
}

export const runtime = "edge";
