import { db, eq } from "db";
import { userHackerData } from "db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { staticUploads } from "config";

export const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function migrateBlob() {
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

		const key = "Migrated" + decodeURIComponent(resumeUrl.pathname);

		const cmd = new PutObjectCommand({
			Key: key,
			Bucket: staticUploads.bucketName,
			ContentType: "application/pdf",
		});

		S3.send(cmd);

		// New url to correspond to an api route
		const newResumeUrl = `/api/upload/resume/view?key=${key}`;

		await db
			.update(userHackerData)
			.set({ resume: newResumeUrl.toString() })
			.where(eq(userHackerData.clerkID, userID));
	}
}
