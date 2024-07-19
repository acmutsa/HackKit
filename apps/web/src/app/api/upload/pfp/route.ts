import { handleBlobUpload, type HandleBlobUploadBody } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import c from "config";

export async function POST(request: Request): Promise<NextResponse> {
	const body = (await request.json()) as HandleBlobUploadBody;
	const { userId } = await auth();

	try {
		const jsonResponse = await handleBlobUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname) => {
				// Step 1. Generate a client token for the browser to upload the file

				// ⚠️ Authenticate users before allowing client tokens to be generated and sent to browsers. Otherwise, you're exposing your Blob store to be an anonymous upload platform.
				// See https://nextjs.org/docs/pages/building-your-application/routing/authenticating for more information

				if (!userId) {
					throw new Error("Not authenticated or bad pathname");
				}

				return {
					maximumSizeInBytes: c.maxProfilePhotoSizeInBytes, // optional, default and maximum is 500MB
					allowedContentTypes: ["image/jpeg", "image/png"], // optional, default is no restriction
				};
			},
			onUploadCompleted: async () => undefined,
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 },
		);
	}
}

export const runtime = "edge";
