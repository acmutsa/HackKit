import { getPresignedUploadUrl } from "@/lib/utils/server/s3";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { bucketName } from "config";

interface RequestBody {
	bucket: string;
	key: string;
}

export async function POST(request: Request): Promise<NextResponse> {
	const body: RequestBody = (await request.json()) as RequestBody;
	const { userId } = auth();

	if (body.bucket != bucketName) {
		return new NextResponse(
			"You do not have permission to upload to this bucket",
			{ status: 401 },
		);
	}

	if (!userId) {
		return new NextResponse("You do not have permission to upload files", {
			status: 401,
		});
	}

	try {
		const url = await getPresignedUploadUrl(body.bucket, body.key);
		const jsonResponse = { url };

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 },
		);
	}
}

export const runtime = "edge";
