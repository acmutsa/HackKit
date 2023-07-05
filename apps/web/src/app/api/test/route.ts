import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

export async function GET() {
	console.log("test route called");

	const user = await currentUser();

	if (!user) {
		return NextResponse.json({
			success: false,
			message: "no user",
		});
	}

	return NextResponse.json({
		success: true,
		message: "user found",
	});
}
