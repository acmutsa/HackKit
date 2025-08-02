import { env } from "./env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${env.BACKUPS_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.BACKUPS_BUCKET_ACCESS_KEY_ID,
		secretAccessKey: env.BACKUPS_BUCKET_SECRET_ACCESS_KEY,
	},
});

async function getDatabaseDump(databseName: string, organizationSlug: string) {
	const res = await fetch(
		`https://${databseName}-${organizationSlug}.turso.io/dump`,
		{
			method: "GET",
			headers: new Headers({
				Authorization: `Bearer ${env.BACKUPS_DB_BEARER}`,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(
			`Failed to get database dump: ${res.status} ${res.statusText}`,
		);
	}

	return res.text();
}

async function uploadToS3(fileName: string, dumpFile: string) {
	const cmd = new PutObjectCommand({
		Key: fileName,
		Bucket: env.BACKUPS_BUCKET_NAME,
		Body: Buffer.from(dumpFile, "utf-8"),
	});
	return S3.send(cmd);
}

async function doBackup() {
	const backupData = await getDatabaseDump(
		env.BACKUPS_DATABSE_NAME,
		env.BACKUPS_ORGANIZATION_SLUG,
	);
	const date = new Date().toISOString();
	const timestamp = date.replace(/[:.]+/g, "-");
	const fileName = `${env.BACKUPS_DATABSE_NAME}-${env.BACKUPS_ORGANIZATION_SLUG}-${timestamp}.sql`;
	const res = await uploadToS3(fileName, backupData);

	if (res.$metadata.httpStatusCode !== 200) {
		throw new Error(
			`Failed to upload file to S3: ${res.$metadata.httpStatusCode}`,
		);
	}
	return true;
}

export { doBackup, getDatabaseDump, uploadToS3 };
