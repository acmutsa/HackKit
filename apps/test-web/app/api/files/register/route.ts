import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getBlobStorage } from "@/lib/blob";

export async function POST(request: Request): Promise<NextResponse> {
	const session = await getAuthSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = (await request.json()) as {
			location?: string;
			fileName?: string;
		};
		if (!body.location || !body.fileName) {
			return NextResponse.json(
				{ error: "location and fileName are required" },
				{ status: 400 },
			);
		}

		const target = await getBlobStorage().getUploadTarget({
			location: body.location,
			fileName: body.fileName,
		});

		return NextResponse.json(target);
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Bad request" },
			{ status: 400 },
		);
	}
}
