import { getPresignedViewingUrl } from "@/lib/utils/server/s3";
import { redirect } from "next/navigation";
import { bucketName } from "config";
import { auth } from "@clerk/nextjs";

export async function GET(
	_request: Request,
	{ params }: { params: { slug: string } },
) {
	const { userId } = auth();

	if (!userId) {
		return new Response("You must be logged in to access this resource", {
			status: 401,
		});
	}

	// Presign the url and return redirect to it.
	const presignedViewingUrl = await getPresignedViewingUrl(
		bucketName,
		params.slug,
	);

	return redirect(presignedViewingUrl);
}

export const runtime = "edge";
