import { getPresignedUploadUrl } from "@/lib/utils/server/s3";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { staticUploads } from "config";

interface RequestBody {
	location: string;
	fileName: string;
}

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body: RequestBody = (await request.json()) as RequestBody;

		const { userId } = auth();
		if (!userId) {
			return new NextResponse(
				"You do not have permission to upload files",
				{
					status: 401,
				},
			);
		}

		const randomSeq = crypto.randomUUID();
		const key = `${body.location}/${randomSeq}/${body.fileName}`;
		const url = await getPresignedUploadUrl(staticUploads.bucketName, key);

		return NextResponse.json({ url, key });
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 },
		);
	}
}

export const runtime = "edge";
