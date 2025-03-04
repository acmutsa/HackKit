import { db, eq } from "db";
import { userHackerData } from "db/schema";
import { staticUploads } from "config";
import { S3Client } from "bun";

export const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	accessKeyId: process.env.R2_ACCESS_KEY_ID!,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	bucket: staticUploads.bucketName,
});

async function main() {
	const resumeData = await db.query.userHackerData.findMany({
		columns: { resume: true, clerkID: true },
	});

	for (let resumeEntry of resumeData) {
		const { resume: resumeUrlAsString, clerkID: userID } = resumeEntry;
		if (!resumeUrlAsString.length) continue;

		const resumeUrl = new URL(resumeUrlAsString);
		const resumeFetchResponse = await fetch(resumeUrl);

		if (!resumeFetchResponse.ok) {
			console.log("resume fetch failed");
		}

		const file = S3.file(resumeUrl.pathname);

		await file.write(resumeFetchResponse, {
			type: "application/pdf",
		});

		// New url to correspond to an api route
		const newResumeUrl = `/api/upload/resume/view?key=${resumeUrl.pathname}`;

		await db
			.update(userHackerData)
			.set({ resume: newResumeUrl.toString() })
			.where(eq(userHackerData.clerkID, userID));
	}
}

await main();
