import { getPresignedUploadUrl } from "@/lib/utils/server/s3";
import { NextResponse } from "next/server";

import { auth } from "@/lib/utils/server/auth";
//import { auth } from "@clerk/nextjs/server"; // TODO: remove clerk
import { staticUploads } from "config";

interface RequestBody {
	location: string;
	fileName: string;
}

// TODO: Verify this route works with create team.
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body: RequestBody = (await request.json()) as RequestBody;

		const userSession = await auth.api.getSession();
		if (!userSession?.user.id) {
			return new NextResponse(
				"You do not have permission to upload files",
				{
					status: 401,
				},
			);
		}

		const randomSeq = crypto.randomUUID();
		const [fileName, extension] = body.fileName.split(".");
		const key = `${body.location}/${fileName}-${randomSeq}.${extension}`;
		const url = await getPresignedUploadUrl(
			process.env.R2_BUCKET_NAME!,
			key,
		);

		return NextResponse.json({ url, key });
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 },
		);
	}
}
