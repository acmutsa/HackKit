import { NextResponse } from "next/server";
import { getBlobStorage, isLocalBlobStorage, isS3BlobStorage } from "@/lib/blob";

export async function GET(request: Request): Promise<NextResponse> {
	const url = new URL(request.url);
	const key = url.searchParams.get("key");
	if (!key) {
		return NextResponse.json({ error: "key is required" }, { status: 400 });
	}

	const storage = getBlobStorage();

	if (isS3BlobStorage(storage)) {
		const presignedUrl = await storage.getPresignedViewUrl(key);
		return NextResponse.redirect(presignedUrl);
	}

	if (isLocalBlobStorage(storage)) {
		const result = await storage.readObject({ key });
		if (!result) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		const body =
			result.body instanceof Uint8Array
				? result.body
				: Buffer.isBuffer(result.body)
					? result.body
					: Buffer.from(await new Response(result.body).arrayBuffer());
		return new NextResponse(body, {
			headers: {
				"Content-Type": result.contentType ?? "application/octet-stream",
			},
		});
	}

	return NextResponse.json({ error: "Not found" }, { status: 404 });
}
