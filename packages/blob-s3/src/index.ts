import { randomUUID } from "node:crypto";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
	BlobStorageAdapterWithView,
	BlobUploadTarget,
	BlobViewResult,
} from "@hackkit/core";

export type S3BlobStorageOptions = {
	bucket: string;
	region: string;
	endpoint?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	filesRoutePrefix?: string;
	presignExpiresInSeconds?: number;
};

function buildStoredFileReference(
	filesRoutePrefix: string,
	key: string,
): string {
	return `${filesRoutePrefix}/view?key=${encodeURIComponent(key)}`;
}

export type S3BlobStorage = BlobStorageAdapterWithView & {
	getPresignedViewUrl(key: string): Promise<string>;
};

export function createS3BlobStorage(
	options: S3BlobStorageOptions,
): S3BlobStorage {
	const filesRoutePrefix = options.filesRoutePrefix ?? "/api/files";
	const expiresIn = options.presignExpiresInSeconds ?? 3600;
	const client = new S3Client({
		region: options.region,
		endpoint: options.endpoint,
		credentials:
			options.accessKeyId && options.secretAccessKey
				? {
						accessKeyId: options.accessKeyId,
						secretAccessKey: options.secretAccessKey,
					}
				: undefined,
	});

	return {
		async getUploadTarget(input): Promise<BlobUploadTarget> {
			const extension = input.fileName.includes(".")
				? input.fileName.split(".").pop()
				: undefined;
			const key = `${input.location}/${randomUUID()}${extension ? `.${extension}` : ""}`;
			const uploadUrl = await getSignedUrl(
				client,
				new PutObjectCommand({
					Bucket: options.bucket,
					Key: key,
				}),
				{ expiresIn },
			);
			return {
				uploadUrl,
				storedFileReference: buildStoredFileReference(
					filesRoutePrefix,
					key,
				),
			};
		},

		async readObject(input): Promise<BlobViewResult | null> {
			try {
				const response = await client.send(
					new GetObjectCommand({
						Bucket: options.bucket,
						Key: input.key,
					}),
				);
				if (!response.Body) return null;
				const bytes = await response.Body.transformToByteArray();
				return {
					body: bytes,
					contentType: response.ContentType,
				};
			} catch {
				return null;
			}
		},

		async getPresignedViewUrl(key: string): Promise<string> {
			return getSignedUrl(
				client,
				new GetObjectCommand({
					Bucket: options.bucket,
					Key: key,
				}),
				{ expiresIn },
			);
		},
	};
}
