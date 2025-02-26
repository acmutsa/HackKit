import {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function getPresignedUploadUrl(bucket: string, key: string) {
	return getSignedUrl(
		S3,
		new PutObjectCommand({ Bucket: bucket, Key: key }),
		{
			expiresIn: 3600,
		},
	);
}

export async function getPresignedViewingUrl(bucket: string, key: string) {
	return getSignedUrl(
		S3,
		new GetObjectCommand({ Bucket: bucket, Key: key }),
		{
			expiresIn: 3600,
		},
	);
}
